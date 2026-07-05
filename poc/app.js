// AthleteOS POC — vanilla JS render logic. No frameworks, no persistence.

const state = {
  selectedDayIndex: new Date().getDay(), // 0=Sun..6=Sat, matches PLAN_DATA order
  checked: new Set(), // keys of "dayId:sectionIdx:exIdx"
};

function renderDayPills() {
  const container = document.getElementById('day-pills');
  container.innerHTML = '';
  const todayIndex = new Date().getDay();

  PLAN_DATA.forEach((day, i) => {
    const btn = document.createElement('button');
    btn.className = 'day-pill' + (i === state.selectedDayIndex ? ' active' : '') + (i === todayIndex ? ' is-today' : '');
    btn.textContent = day.label;
    btn.setAttribute('aria-pressed', i === state.selectedDayIndex ? 'true' : 'false');
    btn.addEventListener('click', () => {
      state.selectedDayIndex = i;
      renderDayPills();
      renderDayContent();
    });
    container.appendChild(btn);
  });
}

function exerciseKey(dayId, sIdx, eIdx) {
  return `${dayId}:${sIdx}:${eIdx}`;
}

function renderDayContent() {
  const day = PLAN_DATA[state.selectedDayIndex];
  const container = document.getElementById('day-content');
  container.innerHTML = '';

  const card = document.createElement('div');
  card.className = 'day-card';
  card.innerHTML = `
    <h2>${day.title}</h2>
    ${day.targetTime ? `<div class="meta">יעד זמן: ${day.targetTime}</div>` : ''}
    ${day.focus ? `<div class="meta">${day.focus}</div>` : ''}
  `;
  container.appendChild(card);

  day.sections.forEach((section, sIdx) => {
    const meta = CATEGORY_META[section.category] || CATEGORY_META.Activity;

    const block = document.createElement('div');
    block.className = 'section-block';

    const titleEl = document.createElement('div');
    titleEl.className = 'section-title';
    titleEl.innerHTML = `<span class="section-dot" style="background:${meta.color}"></span>${meta.label}`;
    block.appendChild(titleEl);

    section.exercises.forEach((ex, eIdx) => {
      const key = exerciseKey(day.id, sIdx, eIdx);
      const isChecked = state.checked.has(key);

      const row = document.createElement('div');
      row.className = 'exercise-row' + (isChecked ? ' done' : '');

      const stats = [];
      if (ex.sets) stats.push(`<b>${ex.sets}</b> סטים`);
      if (ex.reps) stats.push(`<b>${ex.reps}</b>`);
      if (ex.rest) stats.push(`מנוחה <b>${ex.rest}</b>`);

      const tier = ex.tier && TIER_META[ex.tier]
        ? `<span class="tier-badge tier-${ex.tier}">${TIER_META[ex.tier].label}</span>`
        : '';

      row.innerHTML = `
        <div class="exercise-icon" style="background:${meta.color}">${iconSvg(ex.icon)}</div>
        <div class="exercise-body">
          <div class="exercise-name">${ex.name}${tier}</div>
          ${stats.length ? `<div class="exercise-stats">${stats.map(s => `<span>${s}</span>`).join('')}</div>` : ''}
          ${ex.note ? `<div class="exercise-note">${ex.note}</div>` : ''}
        </div>
        <button class="exercise-check${isChecked ? ' checked' : ''}" aria-label="סמן כבוצע">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </button>
      `;

      row.querySelector('.exercise-check').addEventListener('click', () => {
        if (state.checked.has(key)) state.checked.delete(key);
        else state.checked.add(key);
        renderDayContent();
      });

      block.appendChild(row);
    });

    container.appendChild(block);
  });

  if (day.id === 'mon' || day.id === 'tue' || day.id === 'thu' || day.id === 'fri' || day.id === 'sat') {
    const banner = document.createElement('div');
    banner.className = 'rule-banner';
    banner.textContent = SYSTEM_RULE;
    container.appendChild(banner);
  }
}

function renderPhilosophy() {
  document.getElementById('philosophy-tagline').textContent = PHILOSOPHY_TAGLINE;
  document.getElementById('philosophy-intro').textContent = PHILOSOPHY_INTRO;

  const philGrid = document.getElementById('philosophies-grid');
  philGrid.innerHTML = PHILOSOPHIES.map(p => `
    <div class="philosophy-card">
      <div class="exercise-icon">${iconSvg(p.icon)}</div>
      <div>
        <h3>${p.title}</h3>
        <p>${p.text}</p>
      </div>
    </div>
  `).join('');

  const pillarsGrid = document.getElementById('pillars-grid');
  pillarsGrid.innerHTML = PILLARS.map(p => `
    <div class="pillar-card">
      <h4>${p.title}</h4>
      <p>${p.text}</p>
    </div>
  `).join('');

  const chainList = document.getElementById('chain-list');
  chainList.innerHTML = DAILY_CHAIN.map((c, i) => `
    <li>
      <div class="chain-num">${i + 1}</div>
      <div>
        <h4>${c.title}</h4>
        <p>${c.text}</p>
      </div>
    </li>
  `).join('');

  document.getElementById('closing-line').textContent = CLOSING_LINE;
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const views = {
    plan: document.getElementById('view-plan'),
    philosophy: document.getElementById('view-philosophy'),
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      Object.entries(views).forEach(([key, el]) => {
        el.hidden = key !== tab.dataset.tab;
      });
    });
  });
}

renderDayPills();
renderDayContent();
renderPhilosophy();
setupTabs();
