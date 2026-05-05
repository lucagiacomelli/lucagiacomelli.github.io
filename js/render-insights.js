/* ═══════════════════════════════════════════════════════════════
   RENDER INSIGHTS — card rendering for homepage + listing page
   Depends on: data/insights.js, js/subscription.js
═══════════════════════════════════════════════════════════════ */

/* ── Tag pill HTML ───────────────────────────────────────────── */

function tagPillHTML(tag, label) {
  return `<span class="insight-tag tag-${tag}">${label}</span>`;
}

/* ── Demo pill HTML ──────────────────────────────────────────── */

function demoPillHTML() {
  return `<span class="demo-pill">⚡ Interactive demo</span>`;
}

/* ────────────────────────────────────────────────────────────────
   HOMEPAGE — compact cards (matches existing site design)
   ──────────────────────────────────────────────────────────────── */

function homepageCardHTML(insight, delay) {
  const footer = insight.isLocked
    ? `<span class="coming-soon">🔒 Subscribers only</span>`
    : insight.hasDemo
      ? demoPillHTML()
      : `<span class="coming-soon">${insight.dateDisplay} · ${insight.readTime}</span>`;

  return `
    <a href="${insight.url}" class="insight-card reveal reveal-delay-${delay}">
      ${tagPillHTML(insight.tag, insight.tagLabel)}
      <h3>${insight.title}</h3>
      <p>${insight.excerpt}</p>
      <div class="insight-footer">${footer}</div>
    </a>`;
}

function renderHomepageInsights(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const items = getInsightsWithAccess().slice(0, 3);
  container.innerHTML = items
    .map((insight, i) => homepageCardHTML(insight, i + 1))
    .join('');
}

/* ────────────────────────────────────────────────────────────────
   INSIGHTS LISTING PAGE — full cards with lock state + mini demo
   ──────────────────────────────────────────────────────────────── */

function miniDemoHTML(insight) {
  return `
    <div class="mini-demo" onclick="event.stopPropagation();">
      <div class="mini-demo-label">⚡ Try it — Gross Margin Calculator</div>
      <div class="mini-demo-row">
        <label>Model</label>
        <select id="mini-model">
          <option value="0.05,0.40">GPT-5 nano</option>
          <option value="2.00,8.00" selected>GPT-4.1</option>
          <option value="3.00,15.00">Claude Sonnet 4.5</option>
          <option value="5.00,25.00">Claude Opus 4.6</option>
        </select>
      </div>
      <div class="mini-demo-row">
        <label>Price / user</label>
        <input type="range" id="mini-price" min="5" max="199" value="29" step="1" />
        <span class="mini-val" id="mini-price-val">$29</span>
      </div>
      <div class="mini-demo-row">
        <label>Queries / day</label>
        <input type="range" id="mini-queries" min="1" max="30" value="5" step="1" />
        <span class="mini-val" id="mini-queries-val">5</span>
      </div>
      <div class="mini-result">
        <span class="mini-result-label">Est. gross margin</span>
        <span class="mini-result-value" id="mini-margin">—</span>
        <a href="${insight.url}" class="mini-result-note"
           style="text-decoration:none;color:var(--blue);font-weight:500;"
           onclick="event.stopPropagation();">Full model →</a>
      </div>
    </div>`;
}

function listingCardHTML(insight) {
  const isLocked = insight.isLocked;

  const topBar = `
    <div class="card-top-bar">
      ${tagPillHTML(insight.tag, insight.tagLabel)}
      ${insight.hasDemo && !isLocked ? demoPillHTML() : ''}
      ${isLocked ? `<span class="lock-badge">🔒 Subscribers</span>` : ''}
    </div>`;

  const body = `
    <div class="card-content ${isLocked ? 'blurred' : ''}">
      <h2>${insight.title}</h2>
      <p>${insight.excerpt}</p>
      <div class="card-footer">
        <span class="card-meta-text">${insight.dateDisplay} · ${insight.readTime}</span>
        <span class="card-arrow">↗</span>
      </div>
    </div>`;

  const demo = insight.miniDemo && !isLocked ? miniDemoHTML(insight) : '';

  // Card with demo: div wrapper (link is inside demo section)
  if (insight.miniDemo) {
    return `
      <div class="insight-list-card"
           data-tag="${insight.tag}"
           data-title="${insight.title.toLowerCase()} ${insight.excerpt.toLowerCase()}"
           style="cursor:default;">
        ${topBar}
        <a href="${insight.url}" style="text-decoration:none;display:block;">
          ${body}
        </a>
        ${demo}
      </div>`;
  }

  return `
    <a href="${insight.url}"
       class="insight-list-card"
       data-tag="${insight.tag}"
       data-title="${insight.title.toLowerCase()} ${insight.excerpt.toLowerCase()}">
      ${topBar}${body}
    </a>`;
}

function renderInsightsPage(gridSelector, countSelector) {
  const grid = document.querySelector(gridSelector);
  if (!grid) return;

  const items = getInsightsWithAccess();
  grid.innerHTML = items.map(listingCardHTML).join('');

  // Update count
  const countEl = document.querySelector(countSelector);
  if (countEl) countEl.textContent = `${items.length} insights`;

  // Wire up search + filter
  _initSearchFilter(grid, countEl);
}

/* ── Search + Filter logic ───────────────────────────────────── */

function _initSearchFilter(grid, countEl) {
  let activeTag   = 'all';
  let searchQuery = '';

  function apply() {
    const cards   = grid.querySelectorAll('.insight-list-card');
    let   visible = 0;

    cards.forEach(card => {
      const tag   = card.dataset.tag   || '';
      const title = card.dataset.title || '';
      const show  = (activeTag === 'all' || tag === activeTag)
                 && (searchQuery === '' || title.includes(searchQuery));
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });

    let empty = grid.querySelector('.empty-state');
    if (visible === 0) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = '<span>🔍</span><p>No insights match your search.</p>';
        grid.appendChild(empty);
      }
      empty.style.display = '';
    } else if (empty) {
      empty.style.display = 'none';
    }

    if (countEl) countEl.textContent = `${visible} insight${visible !== 1 ? 's' : ''}`;
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchQuery = e.target.value.trim().toLowerCase();
      apply();
    });
  }

  const pillsContainer = document.getElementById('filter-pills');
  if (pillsContainer) {
    pillsContainer.addEventListener('click', e => {
      const btn = e.target.closest('.filter-pill');
      if (!btn) return;
      pillsContainer.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      activeTag = btn.dataset.tag;
      apply();
    });
  }
}

/* ── Mini-demo calculator init ───────────────────────────────── */

function initMiniDemos() {
  const modelEl   = document.getElementById('mini-model');
  const priceEl   = document.getElementById('mini-price');
  const queriesEl = document.getElementById('mini-queries');
  if (!modelEl || !priceEl || !queriesEl) return;

  function calc() {
    const [inP, outP] = modelEl.value.split(',').map(Number);
    const price       = parseInt(priceEl.value);
    const queries     = parseInt(queriesEl.value);
    const monthly     = queries * 30;
    const llm         = ((500 / 1e6) * inP + (300 / 1e6) * outP) * monthly;
    const margin      = ((price - llm - price * 0.2) / price) * 100;
    const el          = document.getElementById('mini-margin');
    if (el) {
      el.textContent = Math.round(margin) + '%';
      el.style.color = margin < 30 ? '#C2410C' : margin > 60 ? '#15803D' : 'var(--ink)';
    }
    const pv = document.getElementById('mini-price-val');
    const qv = document.getElementById('mini-queries-val');
    if (pv) pv.textContent = '$' + price;
    if (qv) qv.textContent = queries;
  }

  modelEl.addEventListener('change', calc);
  priceEl.addEventListener('input', calc);
  queriesEl.addEventListener('input', calc);
  calc();
}
