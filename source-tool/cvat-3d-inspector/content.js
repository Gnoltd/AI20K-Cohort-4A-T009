// CVAT 3D Inspector — kiểm tra job 3D có đủ dữ liệu để sinh box 3D từ ảnh 2D không.
// Chạy trong trang CVAT, gọi REST API bằng chính phiên đăng nhập của người dùng.
// Không ghi gì lên CVAT, chỉ đọc.
(() => {
  const API = location.origin + '/api';
  const ICON = { ok: '✅', warn: '⚠️', fail: '❌', info: 'ℹ️' };
  let calib = null;
  let lastReport = null;

  // ---------- API ----------

  function authHeaders() {
    // CVAT mới dùng session cookie; bản cũ lưu token trong localStorage.
    const headers = {};
    try {
      const token = localStorage.getItem('token');
      if (token) headers.Authorization = 'Token ' + token.replace(/^"|"$/g, '');
    } catch { /* bỏ qua */ }
    return headers;
  }

  async function api(path, as = 'json') {
    const res = await fetch(API + path, { credentials: 'include', headers: authHeaders() });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText} — GET /api${path}`);
    return as === 'json' ? res.json() : res.arrayBuffer();
  }

  // ---------- Zip (CVAT trả ảnh camera và chunk dưới dạng zip) ----------

  function zipEntries(buf) {
    const dv = new DataView(buf);
    const u8 = new Uint8Array(buf);
    let eocd = -1;
    for (let i = buf.byteLength - 22; i >= Math.max(0, buf.byteLength - 65557); i--) {
      if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
    }
    if (eocd < 0) throw new Error('Dữ liệu trả về không phải file zip');
    const count = dv.getUint16(eocd + 10, true);
    let p = dv.getUint32(eocd + 16, true);
    const entries = [];
    for (let k = 0; k < count && dv.getUint32(p, true) === 0x02014b50; k++) {
      const nameLen = dv.getUint16(p + 28, true);
      entries.push({
        name: new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nameLen)),
        method: dv.getUint16(p + 10, true),
        size: dv.getUint32(p + 20, true),
        offset: dv.getUint32(p + 42, true),
      });
      p += 46 + nameLen + dv.getUint16(p + 30, true) + dv.getUint16(p + 32, true);
    }
    return entries;
  }

  async function zipRead(buf, entry) {
    const dv = new DataView(buf);
    const start = entry.offset + 30 + dv.getUint16(entry.offset + 26, true) + dv.getUint16(entry.offset + 28, true);
    const raw = new Blob([new Uint8Array(buf, start, entry.size)]);
    if (entry.method === 0) return raw;
    if (entry.method === 8) {
      return new Response(raw.stream().pipeThrough(new DecompressionStream('deflate-raw'))).blob();
    }
    throw new Error(`Kiểu nén zip chưa hỗ trợ: ${entry.method}`);
  }

  // ---------- Point cloud ----------

  function pcdHeader(buf) {
    const text = new TextDecoder('latin1').decode(new Uint8Array(buf, 0, Math.min(buf.byteLength, 4096)));
    if (!/^(#.*\n)*\s*VERSION/m.test(text) || !/\nFIELDS /.test(text)) return null;
    const header = {};
    for (const line of text.split('\n')) {
      const m = line.match(/^(VERSION|FIELDS|SIZE|TYPE|COUNT|WIDTH|HEIGHT|VIEWPOINT|POINTS|DATA)\s+(.*)$/);
      if (m) header[m[1]] = m[2].trim();
      if (line.startsWith('DATA')) break;
    }
    return header;
  }

  // ---------- Calib ----------

  const isMat = (m, r, c) => Array.isArray(m) && m.length === r && m.every(row => Array.isArray(row) && row.length === c && row.every(Number.isFinite));

  function rigidIssues(m) {
    const issues = [];
    const last = m[3];
    if (last[0] !== 0 || last[1] !== 0 || last[2] !== 0 || last[3] !== 1) issues.push('hàng cuối không phải [0 0 0 1]');
    const R = m.slice(0, 3).map(r => r.slice(0, 3));
    const det = R[0][0] * (R[1][1] * R[2][2] - R[1][2] * R[2][1])
              - R[0][1] * (R[1][0] * R[2][2] - R[1][2] * R[2][0])
              + R[0][2] * (R[1][0] * R[2][1] - R[1][1] * R[2][0]);
    if (Math.abs(det - 1) > 0.01) issues.push(`det(R) = ${det.toFixed(3)}, không phải ma trận xoay`);
    return issues;
  }

  function cameraCenter(m) {
    // Vị trí camera trong hệ ego = -Rᵀ t
    const t = [m[0][3], m[1][3], m[2][3]];
    return [0, 1, 2].map(j => -(m[0][j] * t[0] + m[1][j] * t[1] + m[2][j] * t[2]));
  }

  function checkCalib(c, contextImages, add) {
    if (!c) {
      add('fail', 'Calib', 'Chưa nạp file calib. CVAT không lưu calib, bấm "Nạp calib…" để chọn file JSON BTC cung cấp.');
      return { ok: false };
    }
    let ok = true;
    if (c.pcd_frame) add('info', 'Hệ toạ độ point cloud', `pcd_frame = "${c.pcd_frame}"`);
    const s2e = c.lidar && c.lidar.sensor2ego;
    if (s2e) {
      if (!isMat(s2e, 4, 4)) { ok = false; add('fail', 'lidar.sensor2ego', 'Không phải ma trận 4×4'); }
      else {
        const issues = rigidIssues(s2e);
        const yaw = Math.atan2(s2e[1][0], s2e[0][0]) * 180 / Math.PI;
        add(issues.length ? 'warn' : 'ok', 'lidar.sensor2ego',
          `yaw ${yaw.toFixed(2)}°, tịnh tiến [${s2e[0][3]}, ${s2e[1][3]}, ${s2e[2][3]}] m` + (issues.length ? '\n' + issues.join('; ') : ''));
      }
    }

    const cams = Object.entries(c.cameras || {});
    if (!cams.length) { add('fail', 'Camera', 'File calib không có mục "cameras"'); return { ok: false }; }

    let fovSum = 0;
    for (const [name, cam] of cams) {
      const problems = [];
      if (!isMat(cam.K, 3, 3)) problems.push('K không phải 3×3');
      if (!Array.isArray(cam.dist) || ![4, 5, 8, 12, 14].includes(cam.dist.length)) problems.push('dist phải có 4/5/8/12/14 hệ số');
      if (!isMat(cam.ego2cam, 4, 4)) problems.push('ego2cam không phải 4×4');
      else problems.push(...rigidIssues(cam.ego2cam));
      if (!Array.isArray(cam.image_size) || cam.image_size.length !== 2) problems.push('thiếu image_size [w, h]');

      const lines = [];
      if (isMat(cam.K, 3, 3) && Array.isArray(cam.image_size)) {
        const [w, h] = cam.image_size;
        const fov = 2 * Math.atan(w / 2 / cam.K[0][0]) * 180 / Math.PI;
        fovSum += fov;
        lines.push(`fx ${cam.K[0][0].toFixed(1)}, cx ${cam.K[0][2].toFixed(1)} / ${w}, cy ${cam.K[1][2].toFixed(1)} / ${h}, FOV ngang ≈ ${fov.toFixed(0)}°`);
      }
      if (isMat(cam.ego2cam, 4, 4)) {
        const pos = cameraCenter(cam.ego2cam).map(v => v.toFixed(2));
        lines.push(`vị trí trong hệ ego: x ${pos[0]}, y ${pos[1]}, z ${pos[2]} m`);
      }
      if (Array.isArray(cam.dist) && Math.abs(cam.dist[0]) > 0.2) {
        lines.push(`k1 = ${cam.dist[0]}: méo mạnh, cần biết ảnh trên CVAT đã undistort chưa`);
      }

      const match = contextImages.find(img => img.name.toLowerCase().includes(name.toLowerCase()));
      if (!contextImages.length) lines.push('chưa đối chiếu được với ảnh trên CVAT');
      else if (!match) { problems.push(`không thấy ảnh camera nào có tên chứa "${name}"`); }
      else if (match.width && Array.isArray(cam.image_size)
               && (match.width !== cam.image_size[0] || match.height !== cam.image_size[1])) {
        problems.push(`ảnh "${match.name}" có cỡ ${match.width}×${match.height}, calib ghi ${cam.image_size.join('×')}`);
      } else {
        lines.push(`khớp ảnh "${match.name}" (${match.width}×${match.height})`);
      }

      if (problems.length) ok = false;
      add(problems.length ? 'fail' : 'ok', `Camera ${name}`, [...problems, ...lines].join('\n'));
    }

    const coverage = Math.min(360, fovSum);
    add(coverage >= 300 ? 'ok' : 'warn', 'Vùng phủ camera',
      `${cams.length} camera, tổng FOV ngang ≈ ${coverage.toFixed(0)}° / 360°.` +
      (coverage < 300 ? '\nXe nằm ngoài vùng này (hai bên, phía sau) không có ảnh để click, vẫn phải gán trực tiếp trong 3D.' : ''));
    return { ok };
  }

  // ---------- Kiểm tra job ----------

  async function inspect() {
    const items = [];
    const add = (status, title, detail = '') => { items.push({ status, title, detail }); render(items); };
    const jobMatch = location.pathname.match(/\/jobs\/(\d+)/);
    if (!jobMatch) {
      add('fail', 'Không thấy job', 'Mở một job (URL dạng /tasks/<id>/jobs/<id>) rồi bấm lại.');
      return finish(items, null);
    }
    const jobId = jobMatch[1];
    const facts = { jobId, origin: location.origin, checkedAt: new Date().toISOString() };

    try {
      const about = await api('/server/about');
      facts.cvatVersion = about.version;
      add('info', 'Máy chủ CVAT', `${location.origin} — phiên bản ${about.version}`);
    } catch (e) { add('warn', 'Máy chủ CVAT', e.message); }

    try {
      const me = await api('/users/self');
      facts.user = me.username;
      add('ok', 'Kết nối API', `Đăng nhập là "${me.username}". Mọi request dùng phiên đăng nhập này.`);
    } catch (e) {
      add('fail', 'Kết nối API', `${e.message}\nKiểm tra đã đăng nhập CVAT trên tab này chưa.`);
      return finish(items, facts);
    }

    let job, task, meta;
    try {
      job = await api(`/jobs/${jobId}`);
      task = await api(`/tasks/${job.task_id}`);
      facts.taskId = job.task_id;
      facts.dimension = task.dimension;
      facts.frames = [job.start_frame, job.stop_frame];
      add(task.dimension === '3d' ? 'ok' : 'fail', 'Loại task',
        `Task ${job.task_id} "${task.name}" — dimension = ${task.dimension}\nJob ${jobId}: frame ${job.start_frame}–${job.stop_frame} (${job.stop_frame - job.start_frame + 1} frame)`);
    } catch (e) {
      add('fail', 'Job / task', e.message);
      return finish(items, facts);
    }

    try {
      meta = await api(`/jobs/${jobId}/data/meta`);
      const frames = meta.frames || [];
      const withCtx = frames.filter(f => (f.related_files || 0) > 0).length;
      const ctxCounts = [...new Set(frames.map(f => f.related_files || 0))].sort((a, b) => a - b);
      facts.relatedFilesPerFrame = ctxCounts;
      add(withCtx === frames.length && frames.length ? 'ok' : (withCtx ? 'warn' : 'fail'), 'Ảnh camera theo frame',
        `${withCtx}/${frames.length} frame có ảnh camera đi kèm; số ảnh mỗi frame: ${ctxCounts.join(', ')}` +
        (frames[0] ? `\nVí dụ tên frame: ${frames[0].name}` : ''));
    } catch (e) { add('warn', 'Metadata frame', e.message); }

    // Point cloud của frame đầu
    const first = job.start_frame;
    try {
      const buf = await api(`/jobs/${jobId}/data?type=frame&number=${first}&quality=original`, 'buf');
      const header = pcdHeader(buf);
      if (header) {
        const fields = (header.FIELDS || '').split(/\s+/);
        const hasXYZ = ['x', 'y', 'z'].every(f => fields.includes(f));
        facts.pcd = header;
        add(hasXYZ ? 'ok' : 'fail', `Point cloud frame ${first}`,
          `${(buf.byteLength / 1024 / 1024).toFixed(1)} MB, ${header.POINTS} điểm, FIELDS: ${header.FIELDS}, DATA: ${header.DATA}`);
      } else {
        add('warn', `Point cloud frame ${first}`,
          `Server trả ${(buf.byteLength / 1024).toFixed(0)} KB nhưng không phải file PCD có header (có thể là .bin hoặc ảnh preview).`);
      }
    } catch (e) { add('fail', `Point cloud frame ${first}`, e.message); }

    // Ảnh camera của frame đầu
    const contextImages = [];
    try {
      const buf = await api(`/jobs/${jobId}/data?type=context_image&number=${first}&quality=original`, 'buf');
      for (const entry of zipEntries(buf)) {
        if (entry.name.endsWith('/')) continue;
        const img = { name: entry.name };
        try {
          const bmp = await createImageBitmap(await zipRead(buf, entry));
          img.width = bmp.width; img.height = bmp.height;
          bmp.close();
        } catch { /* không phải ảnh */ }
        contextImages.push(img);
      }
      facts.contextImages = contextImages;
      add(contextImages.length ? 'ok' : 'fail', `Ảnh camera frame ${first}`,
        contextImages.map(i => `${i.name}${i.width ? ` — ${i.width}×${i.height}` : ''}`).join('\n') || 'Không có ảnh');
    } catch (e) { add('fail', `Ảnh camera frame ${first}`, e.message); }

    try {
      const labels = await api(`/labels?job_id=${jobId}&page_size=500`);
      const names = (labels.results || labels).map(l => `${l.name}${l.type && l.type !== 'any' ? ` (${l.type})` : ''}`);
      facts.labels = names;
      add(names.length ? 'ok' : 'warn', 'Nhãn', names.join(', ') || 'Không có nhãn');
    } catch (e) { add('warn', 'Nhãn', e.message); }

    try {
      const ann = await api(`/jobs/${jobId}/annotations`);
      const byType = {};
      for (const s of ann.shapes || []) byType[s.type] = (byType[s.type] || 0) + 1;
      const trackShapes = (ann.tracks || []).reduce((n, t) => n + (t.shapes || []).length, 0);
      facts.annotations = { shapes: byType, tracks: (ann.tracks || []).length, trackKeyframes: trackShapes };
      const sample = (ann.tracks || [])[0]?.shapes?.[0] || (ann.shapes || [])[0];
      add('info', 'Annotation hiện có',
        `shapes: ${JSON.stringify(byType)}; tracks: ${(ann.tracks || []).length} (${trackShapes} keyframe)` +
        (sample ? `\nVí dụ points của ${sample.type}: [${sample.points.slice(0, 9).map(v => +v.toFixed(3)).join(', ')}…]` : '') +
        ((ann.tracks || []).length ? '\nCó thể dùng làm ground truth để đo độ chính xác box tự sinh.' : ''));
    } catch (e) { add('warn', 'Annotation hiện có', e.message); }

    const calibResult = checkCalib(calib, contextImages, add);
    facts.calibLoaded = !!calib;

    const failed = items.some(i => i.status === 'fail');
    facts.ready = !failed && calibResult.ok;
    return finish(items, facts);
  }

  function finish(items, facts) {
    lastReport = { facts, items };
    render(items, facts);
    console.log('[CVAT 3D Inspector]', lastReport);
  }

  // ---------- Giao diện ----------

  const toggle = document.createElement('button');
  toggle.id = 'c3i-toggle';
  toggle.textContent = '3D check';

  const panel = document.createElement('div');
  panel.id = 'c3i-panel';
  panel.innerHTML = `
    <header>CVAT 3D Inspector</header>
    <div class="c3i-actions">
      <button data-act="run">Kiểm tra job này</button>
      <button data-act="calib">Nạp calib…</button>
      <button data-act="copy" disabled>Copy báo cáo</button>
      <input type="file" accept=".json,application/json" hidden>
    </div>
    <div class="c3i-verdict" hidden></div>
    <ul></ul>`;

  const list = panel.querySelector('ul');
  const verdict = panel.querySelector('.c3i-verdict');
  const fileInput = panel.querySelector('input[type=file]');
  const copyBtn = panel.querySelector('[data-act=copy]');

  function render(items, facts) {
    list.replaceChildren(...items.map(({ status, title, detail }) => {
      const li = document.createElement('li');
      const b = document.createElement('b');
      b.textContent = `${ICON[status]} ${title}`;
      const span = document.createElement('span');
      span.textContent = detail;
      li.append(b, span);
      return li;
    }));
    if (facts === undefined) return;
    copyBtn.disabled = !lastReport;
    verdict.hidden = false;
    if (facts && facts.ready) {
      verdict.className = 'c3i-verdict ok';
      verdict.textContent = 'Đủ dữ liệu: có point cloud, ảnh camera và calib khớp.';
    } else {
      const fails = items.filter(i => i.status === 'fail').map(i => i.title);
      verdict.className = 'c3i-verdict ' + (fails.length ? 'fail' : 'warn');
      verdict.textContent = fails.length ? `Chưa đủ: ${fails.join(', ')}` : 'Cần xem lại các mục ⚠️.';
    }
  }

  panel.addEventListener('click', async (ev) => {
    const act = ev.target.dataset && ev.target.dataset.act;
    if (act === 'run') {
      ev.target.disabled = true;
      verdict.hidden = true;
      try { await inspect(); } finally { ev.target.disabled = false; }
    } else if (act === 'calib') {
      fileInput.click();
    } else if (act === 'copy' && lastReport) {
      await navigator.clipboard.writeText(JSON.stringify(lastReport, null, 2));
      ev.target.textContent = 'Đã copy';
      setTimeout(() => { ev.target.textContent = 'Copy báo cáo'; }, 1500);
    }
  });

  fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      calib = JSON.parse(await file.text());
      await chrome.storage.local.set({ calib, calibName: file.name });
      render([{ status: 'ok', title: 'Đã nạp calib', detail: `${file.name} — camera: ${Object.keys(calib.cameras || {}).join(', ') || '(không có)'}` }]);
    } catch (e) {
      render([{ status: 'fail', title: 'Không đọc được calib', detail: e.message }]);
    }
    fileInput.value = '';
  });

  toggle.addEventListener('click', () => panel.classList.toggle('open'));

  chrome.storage.local.get(['calib']).then(({ calib: saved }) => { if (saved) calib = saved; });
  document.body.append(toggle, panel);
})();
