/* AlgoLab UI: routing, sidebar, visualization renderers, playback controls. */
(function () {
  const { CATS, ALGOS, GN, GE, ek } = window.ALGO_DATA;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const byId = Object.fromEntries(ALGOS.map(a => [a.id, a]));
  const catOf = Object.fromEntries(CATS.map(c => [c.id, c]));
  const LABEL = { compare: 'Comparing', swap: 'Swapping', sorted: 'Sorted', pivot: 'Pivot', active: 'Active', found: 'Found', current: 'Current', frontier: 'Discovered', done: 'Finished', look: 'Examining', tree: 'Tree edge', try: 'Trying', bad: 'Conflict', ok: 'Safe', dim: 'Ignored' };

  /* ---------- tiny storage helpers (never throw) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
  };
  let solved = new Set(store.get('algolab.solved', []));
  const totalProblems = ALGOS.reduce((n, a) => n + a.problems.length, 0);
  function updateProgress() { $('#progress').textContent = `${solved.size} / ${totalProblems} problems`; }

  /* ---------- sidebar ---------- */
  function buildNav() {
    $('#navList').innerHTML = CATS.map(c => `
      <div class="nav-cat" data-cat="${c.id}">
        <h4><span class="dot" style="--h:${c.hue}"></span>${esc(c.name)}</h4>
        ${ALGOS.filter(a => a.cat === c.id).map(a => `<a href="#/${a.id}" data-id="${a.id}" data-name="${esc(a.name.toLowerCase())}">${esc(a.name)}</a>`).join('')}
      </div>`).join('');
  }
  function markNav(id) {
    document.querySelectorAll('#navList a').forEach(a => a.classList.toggle('on', a.dataset.id === id));
  }
  $('#search').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#navList a').forEach(a => { a.style.display = !q || a.dataset.name.includes(q) ? '' : 'none'; });
    document.querySelectorAll('.nav-cat').forEach(c => { c.style.display = [...c.querySelectorAll('a')].some(a => a.style.display !== 'none') ? '' : 'none'; });
  });
  const closeMenu = () => document.body.classList.remove('menu');
  $('#menuBtn').onclick = () => document.body.classList.toggle('menu');
  $('#scrim').onclick = closeMenu;
  $('#themeBtn').onclick = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('algolab.theme', root.dataset.theme); } catch (e) { /* ignore */ }
  };

  /* ---------- routing ---------- */
  let player = null;
  function stopPlayer() { if (player) { player.destroy(); player = null; } }
  function route() {
    stopPlayer(); closeMenu();
    const id = location.hash.replace(/^#\/?/, '');
    window.scrollTo(0, 0);
    if (byId[id]) { markNav(id); renderAlgo(byId[id]); document.title = `${byId[id].name} — AlgoLab`; }
    else { markNav(null); renderHome(); document.title = 'AlgoLab — Learn Algorithms Visually'; }
  }

  function renderHome() {
    $('#main').innerHTML = `
      <section class="hero">
        <h1>Learn algorithms by watching them run.</h1>
        <p>${ALGOS.length} classic algorithms in ${CATS.length} categories. Step through each one, see the pseudocode light up line by line, then practise on real coding problems.</p>
      </section>
      ${CATS.map(c => `
        <section class="cat-block">
          <h2><span class="dot" style="--h:${c.hue}"></span>${esc(c.name)}</h2>
          <p>${esc(c.blurb)}</p>
          <div class="cards">${ALGOS.filter(a => a.cat === c.id).map(a => `
            <a class="card-link" style="--h:${c.hue}" href="#/${a.id}"><b>${esc(a.name)}</b><small>Time ${esc(a.time)} · ${a.problems.length} problems</small></a>`).join('')}
          </div>
        </section>`).join('')}`;
  }

  /* ---------- visualization renderers (build once, update in place) ---------- */
  const NS = 'http://www.w3.org/2000/svg';
  const R = {
    array: {
      key: s => `array-${s.mode}-${s.arr.length}`,
      build(host, s) {
        host.className = 'viz array ' + s.mode;
        host.innerHTML = s.arr.map(() => '<div class="col"><div class="stack"><div class="val"></div><div class="fill"></div></div><div class="idx"></div><div class="ptr"></div></div>').join('');
        host._cols = [...host.children];
      },
      update(host, s) {
        const max = Math.max(1, ...s.arr.map(Math.abs));
        const names = {}; Object.entries(s.ptrs).forEach(([k, i]) => (names[i] = names[i] || []).push(k));
        host._cols.forEach((col, i) => {
          const dim = s.dim && (i < s.dim[0] || i > s.dim[1]);
          const inwin = s.win && i >= s.win[0] && i <= s.win[1];
          col.className = 'col ' + (s.cls[i] || '') + (dim ? ' dim' : '') + (inwin ? ' inwin' : '');
          const fill = col.children[0].children[1], val = col.children[0].children[0];
          if (s.mode === 'bars') { fill.style.height = Math.max(6, Math.round(s.arr[i] / max * 200)) + 'px'; val.textContent = s.arr[i]; }
          else fill.textContent = s.arr[i];
          col.children[1].textContent = i;
          col.children[2].textContent = (names[i] || []).join(' · ');
        });
      },
    },
    graph: {
      key: () => 'graph',
      build(host) {
        const pos = Object.fromEntries(GN.map(([id, x, y]) => [id, [x, y]]));
        const edges = GE.map(([u, v, w]) => {
          const [x1, y1] = pos[u], [x2, y2] = pos[v];
          return `<g class="edge" data-k="${ek(u, v)}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2}">${w}</text></g>`;
        }).join('');
        const nodes = GN.map(([id, x, y]) => `<g class="node" data-id="${id}"><circle cx="${x}" cy="${y}" r="23"/><text class="lbl" x="${x}" y="${y}">${id}</text><text class="sub" x="${x}" y="${y - 30}"></text></g>`).join('');
        host.className = 'viz graph';
        host.innerHTML = `<svg viewBox="0 0 650 380" role="img" aria-label="Graph visualization">${edges}${nodes}</svg>`;
        host._e = [...host.querySelectorAll('.edge')]; host._n = [...host.querySelectorAll('.node')];
      },
      update(host, s) {
        host.classList.toggle('weighted', !!s.weighted);
        host._e.forEach(g => { g.setAttribute('class', 'edge ' + (s.edgeCls[g.dataset.k] || '')); });
        host._n.forEach(g => { g.setAttribute('class', 'node ' + (s.nodeCls[g.dataset.id] || '')); g.querySelector('.sub').textContent = s.sub[g.dataset.id] || ''; });
      },
    },
    grid: {
      key: s => `grid-${s.rows.length}x${s.cols.length}`,
      build(host, s) {
        host.className = 'viz grid';
        host.innerHTML = `<table class="dp"><thead><tr><th></th>${s.cols.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${
          s.rows.map(r => `<tr><th class="rh">${esc(r)}</th>${s.cols.map(() => '<td></td>').join('')}</tr>`).join('')}</tbody></table>`;
        host._rows = [...host.querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')]);
      },
      update(host, s) {
        host._rows.forEach((tds, r) => tds.forEach((td, c) => { const v = s.cells[r][c]; td.textContent = v == null ? '' : v; td.className = s.cls[`${r},${c}`] || ''; }));
      },
    },
    board: {
      key: s => `board-${s.n}`,
      build(host, s) {
        host.className = 'viz board';
        host.innerHTML = `<div class="board-grid" style="grid-template-columns:repeat(${s.n},1fr)">${Array.from({ length: s.n * s.n }, () => '<div class="sq"><span class="q"></span></div>').join('')}</div>`;
        host._sq = [...host.querySelectorAll('.sq')];
      },
      update(host, s) {
        host._sq.forEach((el, k) => {
          const r = Math.floor(k / s.n), c = k % s.n;
          el.className = 'sq ' + ((r + c) % 2 ? 'dark' : 'light') + ' ' + (s.cls[`${r},${c}`] || '');
          el.firstChild.textContent = s.queens[r] === c ? '♛' : '';
        });
      },
    },
  };

  /* ---------- input parsing ---------- */
  function fieldValue(f, input) {
    const v = input[f.key];
    return f.type === 'list' ? v.join(', ') : v;
  }
  function parseFields(algo, root) {
    const out = {};
    for (const f of algo.fields) {
      const el = root.querySelector(`[data-key="${f.key}"]`), raw = el.value.trim();
      if (f.type === 'list') {
        const nums = raw.split(/[\s,;]+/).filter(Boolean).map(Number);
        if (nums.some(n => !Number.isFinite(n) || !Number.isInteger(n))) throw new Error(`${f.label}: use whole numbers separated by commas.`);
        if (nums.length < f.min || nums.length > f.max) throw new Error(`${f.label}: enter ${f.min}–${f.max} numbers.`);
        if (nums.some(n => n < f.lo || n > f.hi)) throw new Error(`${f.label}: values must be between ${f.lo} and ${f.hi}.`);
        out[f.key] = nums;
      } else if (f.type === 'num') {
        const n = Number(raw); if (raw === '' || !Number.isInteger(n)) throw new Error(`${f.label}: enter a whole number.`);
        if (n < 0 || n > 99) throw new Error(`${f.label}: use 0–99.`);
        out[f.key] = n;
      } else if (f.type === 'text') {
        const t = raw.toUpperCase().replace(/[^A-Z]/g, '');
        if (!t || t.length > f.max) throw new Error(`${f.label}: 1–${f.max} letters.`);
        out[f.key] = t;
      } else out[f.key] = typeof f.options[0] === 'number' ? Number(raw) : raw;
    }
    if (algo.id === 'sliding-window' && out.k > out.arr.length) throw new Error('Window size k cannot exceed the array length.');
    if (algo.id === 'coin-change' && out.amount > 30) throw new Error('Amount: use 0–30 to keep the table readable.');
    return out;
  }

  /* ---------- algorithm page ---------- */
  function renderAlgo(algo) {
    const cat = catOf[algo.cat], i = ALGOS.indexOf(algo), prev = ALGOS[i - 1], next = ALGOS[i + 1];
    const ex = (window.EXPLAIN || {})[algo.id];
    const legend = (algo.legend || []).map(l => { const [k, t] = Array.isArray(l) ? l : [l, LABEL[l]]; return `<span><i class="${k}"></i>${esc(t)}</span>`; }).join('');
    const probs = `<ul class="problems" id="problems">${algo.problems.map(([t, slug, d]) => {
      const key = `${algo.id}|${slug}`;
      return `<li class="${solved.has(key) ? 'done' : ''}"><input type="checkbox" data-key="${key}" ${solved.has(key) ? 'checked' : ''} aria-label="Mark ${esc(t)} as solved"><a href="https://leetcode.com/problems/${slug}/" target="_blank" rel="noopener">${esc(t)}</a><span class="badge ${d}">${d}</span></li>`;
    }).join('')}</ul><p class="note">Opens on LeetCode. Tick problems off as you solve them — saved in this browser.</p>`;
    const code = `<div class="code-lines" id="code">${algo.code.map((l, n) => `<div class="ln"><span class="no">${l === '' ? '' : n + 1}</span><span>${esc(l) || ' '}</span></div>`).join('')}</div><p class="note">The highlighted line is what the animation is doing right now.</p>`;
    const tabs = [];
    if (ex) {
      tabs.push({ id: 'idea', label: '💡 Idea', html: `<p><b>Problem.</b> ${esc(ex.problem)}</p><p><b>Think of it like…</b> ${esc(ex.analogy)}</p>` });
      tabs.push({ id: 'how', label: '🧠 How it works', html: `<p>${esc(ex.idea)}</p>` });
      tabs.push({ id: 'ex', label: '✏️ Example', html: `<p class="example">${esc(ex.example)}</p>` });
      tabs.push({ id: 'read', label: '👀 Read the picture', html: `<p>${esc(ex.read)}</p>` });
    } else tabs.push({ id: 'how', label: '🧠 How it works', html: `<ol class="how">${algo.how.map(h => `<li>${esc(h)}</li>`).join('')}</ol>` });
    tabs.push({ id: 'code', label: '📜 Code', html: code });
    if (ex) {
      tabs.push({ id: 'cx', label: '⏱ Speed', html: `<p><span class="chip">Time <b>${esc(algo.time)}</b></span> <span class="chip">Space <b>${esc(algo.space)}</b></span></p><p>${esc(ex.why)}</p><p><b>Use it when:</b> ${esc(ex.use)}</p>` });
      tabs.push({ id: 'pit', label: '⚠️ Pitfalls', html: `<ul class="mistakes">${ex.mistakes.map(m => `<li>${esc(m)}</li>`).join('')}</ul><dl class="terms">${ex.terms.map(([t, d]) => `<dt>${esc(t)}</dt><dd>${esc(d)}</dd>`).join('')}</dl>` });
    }
    tabs.push({ id: 'prac', label: '🏋️ Practice', html: probs });
    $('#main').innerHTML = `
      <article class="algo">
        <div class="crumbs"><a href="#/">All algorithms</a> / ${esc(cat.name)}</div>
        <h1>${esc(algo.name)}</h1>
        <p class="blurb">${esc(algo.blurb)}</p>
        <div class="chips"><span class="chip">Time <b>${esc(algo.time)}</b></span><span class="chip">${esc(cat.name)}</span></div>

        <section class="card" aria-label="Visualization">
          <div class="inputs" id="inputs"></div>
          <div class="viz-info" id="vizInfo"></div>
          <div class="viz" id="viz"></div>
          <div class="aux" id="aux"></div>
          <div class="legend">${legend}</div>
          <div class="msg" id="msg" aria-live="polite"></div>
          <div class="controls">
            <button class="btn" id="bFirst" title="Restart (Home)">⏮</button>
            <button class="btn" id="bPrev" title="Step back (←)">|◀</button>
            <button class="btn primary" id="bPlay" title="Play / pause (Space)">▶ Play</button>
            <button class="btn" id="bNext" title="Step forward (→)">▶|</button>
            <button class="btn" id="bLast" title="Jump to end (End)">⏭</button>
            <input class="scrub" id="scrub" type="range" min="0" value="0" aria-label="Step">
            <label class="speed">Speed <input id="speed" type="range" min="1" max="6" value="3"><span id="speedLbl">1×</span></label>
            <span class="count" id="count"></span>
          </div>
        </section>

        <section class="card tabs-card">
          <div class="tabs" role="tablist">${tabs.map((t, n) => `<button role="tab" class="tab${n === 0 ? ' on' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}</div>
          ${tabs.map((t, n) => `<div class="panel" role="tabpanel" data-panel="${t.id}" ${n === 0 ? '' : 'hidden'}>${t.html}</div>`).join('')}
        </section>

        <nav class="pager">${prev ? `<a href="#/${prev.id}">← ${esc(prev.name)}</a>` : '<span></span>'}${next ? `<a href="#/${next.id}">${esc(next.name)} →</a>` : '<span></span>'}</nav>
      </article>`;

    document.querySelectorAll('.tab').forEach(t => t.onclick = () => {
      document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x === t));
      document.querySelectorAll('.panel').forEach(p => { p.hidden = p.dataset.panel !== t.dataset.tab; });
    });
    $('#problems').addEventListener('change', (e) => {
      const cb = e.target.closest('input'); if (!cb) return;
      cb.checked ? solved.add(cb.dataset.key) : solved.delete(cb.dataset.key);
      cb.closest('li').classList.toggle('done', cb.checked);
      store.set('algolab.solved', [...solved]); updateProgress();
    });
    player = createPlayer(algo);
  }

  /* ---------- player ---------- */
  const SPEEDS = [0.25, 0.5, 1, 2, 4, 8];
  function createPlayer(algo) {
    const host = $('#viz'), msg = $('#msg'), scrub = $('#scrub'), count = $('#count'), bPlay = $('#bPlay');
    const codeEls = [...document.querySelectorAll('#code .ln')];
    let input = algo.random(), steps = [], idx = 0, timer = null, speed = 2;

    /* input form */
    const inputs = $('#inputs');
    function buildInputs() {
      inputs.innerHTML = algo.fields.map(f => {
        const v = fieldValue(f, input);
        if (f.type === 'select') return `<label>${esc(f.label)}<select data-key="${f.key}">${f.options.map(o => `<option ${String(o) === String(v) ? 'selected' : ''}>${o}</option>`).join('')}</select></label>`;
        return `<label>${esc(f.label)}<input data-key="${f.key}" class="${f.type === 'list' ? 'wide' : ''}" value="${esc(v)}" ${f.type === 'num' ? 'inputmode="numeric" style="min-width:70px;width:90px"' : ''}></label>`;
      }).join('') + `${algo.fields.length ? '<button class="btn primary" id="bApply">Apply</button>' : ''}<button class="btn" id="bRandom">🎲 New random input</button><div class="err" id="err"></div>`;
      const apply = () => {
        try { input = parseFields(algo, inputs); $('#err').textContent = ''; load(); }
        catch (e) { $('#err').textContent = e.message; }
      };
      const ap = $('#bApply'); if (ap) ap.onclick = apply;
      inputs.querySelectorAll('input').forEach(el => el.addEventListener('keydown', e => { if (e.key === 'Enter') apply(); }));
      inputs.querySelectorAll('select').forEach(el => el.addEventListener('change', apply));
      $('#bRandom').onclick = () => { input = algo.random(); load(); };
    }

    function load() {
      pause();
      if (algo.normalize) input = algo.normalize(input);
      buildInputs();
      steps = algo.run(input); idx = 0;
      scrub.max = steps.length - 1;
      draw();
    }

    function draw() {
      const step = steps[idx], s = step.s, r = R[s.type];
      const key = r.key(s);
      if (host._key !== key) { host.innerHTML = ''; host._key = key; r.build(host, s); }
      r.update(host, s);
      $('#vizInfo').textContent = s.info || '';
      const aux = $('#aux');
      if (s.aux) {
        aux.className = 'aux on';
        aux.innerHTML = `<span class="t">${esc(s.aux.title)}</span>` + (s.aux.items.length ? s.aux.items.map(x => `<span class="it">${esc(x)}</span>`).join('') : '<span class="empty">empty</span>');
      } else aux.className = 'aux';
      msg.textContent = step.msg;
      codeEls.forEach((el, n) => el.classList.toggle('on', n === step.line));
      scrub.value = idx;
      count.textContent = `Step ${idx + 1} / ${steps.length}`;
    }

    const delay = () => 750 / SPEEDS[speed];
    function tick() {
      if (idx >= steps.length - 1) { pause(); return; }
      idx++; draw(); timer = setTimeout(tick, delay());
    }
    function play() {
      if (idx >= steps.length - 1) { idx = 0; draw(); }
      bPlay.textContent = '⏸ Pause'; timer = setTimeout(tick, delay() * 0.6);
    }
    function pause() { clearTimeout(timer); timer = null; bPlay.textContent = '▶ Play'; }
    const go = (n) => { pause(); idx = Math.max(0, Math.min(steps.length - 1, n)); draw(); };

    bPlay.onclick = () => (timer ? pause() : play());
    $('#bFirst').onclick = () => go(0);
    $('#bPrev').onclick = () => go(idx - 1);
    $('#bNext').onclick = () => go(idx + 1);
    $('#bLast').onclick = () => go(steps.length - 1);
    scrub.oninput = () => go(+scrub.value);
    $('#speed').oninput = (e) => { speed = +e.target.value - 1; $('#speedLbl').textContent = SPEEDS[speed] + '×'; };

    const onKey = (e) => {
      if (/^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName) && e.target.type !== 'range') return;
      if (e.key === ' ') { e.preventDefault(); bPlay.onclick(); }
      else if (e.key === 'ArrowRight') go(idx + 1);
      else if (e.key === 'ArrowLeft') go(idx - 1);
      else if (e.key === 'Home') go(0);
      else if (e.key === 'End') go(steps.length - 1);
    };
    document.addEventListener('keydown', onKey);

    load();
    return { destroy() { pause(); document.removeEventListener('keydown', onKey); } };
  }

  /* ---------- boot ---------- */
  buildNav(); updateProgress();
  window.addEventListener('hashchange', route);
  route();
})();
