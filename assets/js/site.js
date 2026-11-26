(() => {
  const apps = window.PROJECTS || [];
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasStore = (a) => /^\d+$/.test(a.appStoreId || '');
  const storeUrl = (a) => `https://apps.apple.com/app/id${a.appStoreId}`;
  const byId = Object.fromEntries(apps.map((a) => [a.id, a]));

  // ---------- ambient spotlight ----------
  addEventListener('pointermove', (e) => {
    document.documentElement.style.setProperty('--mx', e.clientX + 'px');
    document.documentElement.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  // ---------- nav ----------
  const nav = $('.nav');
  const toggle = $('.nav-toggle');
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  $$('.nav-links a').forEach((a) => a.addEventListener('click', () => nav.classList.remove('open')));
  const sections = $$('.nav-links a').map((a) => $(a.hash)).filter(Boolean);
  const onScroll = () => {
    nav.classList.toggle('scrolled', scrollY > 20);
    let current = null;
    for (const s of sections) if (s.getBoundingClientRect().top < innerHeight * 0.4) current = s;
    $$('.nav-links a').forEach((a) => a.classList.toggle('active', current && a.hash === '#' + current.id));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- hero rotator + card stack ----------
  const phrases = {
    kcal: 'scan your meals',
    'newborn-ai': 'turn baby photos into art',
    'area-measure': 'measure any field',
    'dog-translator': 'talk to your dog',
  };
  const heroApps = Object.keys(phrases).map((id) => byId[id]).filter(Boolean);
  const word = $('.rotator-word');
  const stack = $('#heroStack');
  let hi = 0;

  const splitWord = (text) => {
    let i = 0;
    return text.split(' ').map((w) =>
      `<span class="w">${[...w].map((ch) => `<span class="ch" style="animation-delay:${i++ * 22}ms">${esc(ch)}</span>`).join('')}</span>`
    ).join(' ');
  };

  function renderStack() {
    stack.innerHTML = '';
    [0, 1, 2].forEach((k) => {
      const a = heroApps[(hi + k) % heroApps.length];
      const card = document.createElement('div');
      card.className = 'stack-card';
      card.style.setProperty('--i', k);
      card.style.zIndex = 3 - k;
      card.innerHTML = `<img src="${a.image}" alt="" loading="${k ? 'lazy' : 'eager'}">`;
      card.addEventListener('click', () => openApp(a.id));
      stack.appendChild(card);
    });
  }

  function setHero(a) {
    document.documentElement.style.setProperty('--accent', a.accent);
    $('#stageEmoji').textContent = a.emoji;
    $('#stageName').textContent = a.title;
    $('#stageTag').textContent = a.tagline;
  }

  function nextHero() {
    const front = stack.firstElementChild;
    word.classList.add('out');
    front?.classList.add('leaving');
    setTimeout(() => {
      hi = (hi + 1) % heroApps.length;
      const a = heroApps[hi];
      word.classList.remove('out');
      word.innerHTML = splitWord(phrases[a.id]);
      setHero(a);
      renderStack();
    }, reduce ? 0 : 380);
  }

  if (heroApps.length) {
    word.innerHTML = splitWord(phrases[heroApps[0].id]);
    setHero(heroApps[0]);
    renderStack();
    let timer = setInterval(nextHero, 3200);
    document.addEventListener('visibilitychange', () => {
      clearInterval(timer);
      if (!document.hidden) timer = setInterval(nextHero, 3200);
    });
    const stage = $('.hero-stage');
    if (!reduce) {
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        stack.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg)`;
      });
      stage.addEventListener('pointerleave', () => (stack.style.transform = ''));
    }
  }

  // ---------- stats count-up ----------
  const countIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target;
      countIO.unobserve(el);
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const plain = 'plain' in el.dataset;
      const from = plain ? target - 12 : 0;
      const t0 = performance.now();
      const dur = reduce ? 0 : 1400;
      const tick = (t) => {
        const p = dur ? Math.min(1, (t - t0) / dur) : 1;
        const v = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => countIO.observe(el));

  // ---------- marquee ----------
  const mq = $('#marquee');
  const mqItems = apps.map((a) => `<span class="marquee-item" style="--c:${a.accent}"><i>${a.emoji}</i>${esc(a.title)} <small>${esc(a.category)}</small></span>`).join('');
  mq.innerHTML = mqItems + mqItems;

  // ---------- app grid ----------
  const grid = $('#appsGrid');
  const legalLinks = (a) => `<a href="${a.legal.privacyUrl}" onclick="event.stopPropagation()">Privacy</a><a href="${a.legal.termsUrl}" onclick="event.stopPropagation()">Terms</a>`;
  const storeLink = (a) => hasStore(a)
    ? `<a class="card-store" href="${storeUrl(a)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">App Store ↗</a>`
    : '<span class="card-soon">Coming soon</span>';

  grid.innerHTML = apps.map((a, i) => `
    <article class="card${a.featured ? ' featured' : ''}" style="--c:${a.accent};--d:${i}" data-id="${a.id}" data-filters="${(a.filters || []).join(' ')}" tabindex="0" role="button" aria-label="Open ${esc(a.title)}">
      <div class="card-media">
        <span class="card-badge">${a.featured ? '★ Featured · ' : ''}${esc(a.platform || 'iOS')}</span>
        <img src="${a.image}" alt="${esc(a.title)} screenshots" loading="lazy">
      </div>
      <div class="card-body">
        <div class="card-top">
          <span class="app-icon">${a.emoji}</span>
          <div><h3>${esc(a.title)}</h3><span class="card-tag">${esc(a.tagline)}</span></div>
        </div>
        <p class="card-desc">${esc(a.description)}</p>
        ${a.featured && a.features ? `<div class="feature-pills">${a.features.map((f) => `<span>${f.icon} ${esc(f.text)}</span>`).join('')}</div>` : ''}
        <div class="card-foot">
          <span class="card-legal">${legalLinks(a)}</span>
          ${storeLink(a)}
        </div>
      </div>
    </article>`).join('');

  $$('.card', grid).forEach((card) => {
    card.addEventListener('click', () => openApp(card.dataset.id));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openApp(card.dataset.id); }
    });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      card.style.setProperty('--px', x + 'px');
      card.style.setProperty('--py', y + 'px');
      if (reduce || e.pointerType !== 'mouse') return;
      const k = card.classList.contains('featured') ? 3 : 6;
      card.style.setProperty('--ry', ((x / r.width) - 0.5) * k + 'deg');
      card.style.setProperty('--rx', -((y / r.height) - 0.5) * k + 'deg');
    });
    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });

  // filters
  $$('.chip').forEach((chip) => chip.addEventListener('click', () => {
    $$('.chip').forEach((c) => { c.classList.toggle('active', c === chip); c.setAttribute('aria-selected', c === chip); });
    const f = chip.dataset.filter;
    let d = 0;
    $$('.card', grid).forEach((card) => {
      const show = f === 'all' || card.dataset.filters.split(' ').includes(f);
      card.classList.toggle('hide', !show);
      card.classList.toggle('featured', show && f === 'all' && byId[card.dataset.id].featured);
      if (show) {
        card.style.setProperty('--d', d++);
        card.style.animation = 'none';
        card.offsetHeight; // restart entrance animation
        card.style.animation = '';
      }
    });
  }));

  // ---------- legal list ----------
  const list = $('#legalList');
  const renderLegal = (q = '') => {
    const s = q.trim().toLowerCase();
    const rows = apps.filter((a) => !s || (a.title + ' ' + a.tagline + ' ' + a.category).toLowerCase().includes(s));
    list.innerHTML = rows.length
      ? rows.map((a) => `
        <li class="legal-row" style="--c:${a.accent}">
          <span class="app-icon">${a.emoji}</span>
          <span><strong>${esc(a.title)}</strong><small>${esc(a.category)} · ${esc(a.platform || 'iOS')}</small></span>
          <span class="legal-links"><a href="${a.legal.privacyUrl}">Privacy Policy</a><a href="${a.legal.termsUrl}">Terms of Use</a></span>
        </li>`).join('')
      : '<li class="legal-empty">No app matches that search.</li>';
  };
  renderLegal();
  $('#legalSearch').addEventListener('input', (e) => renderLegal(e.target.value));

  // ---------- modal ----------
  const modal = $('#modal');
  const sheet = $('.modal-sheet', modal);
  const body = $('#modalBody');
  let currentIdx = -1;
  let lastFocus = null;

  function modalHTML(a) {
    const fd = a.fullDescription;
    let extra = '';
    if (fd) {
      extra += fd.keyFeatures ? `<div class="m-section"><h3>Highlights</h3><div class="m-features">${fd.keyFeatures.map((k) => `<div class="m-feature"><strong>${esc(k.title)}</strong><p>${esc(k.description)}</p></div>`).join('')}</div></div>` : '';
      extra += fd.gettingStarted ? `<div class="m-section"><h3>How it works</h3><ol class="m-steps">${fd.gettingStarted.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>` : '';
      extra += fd.pricing ? `<div class="m-section"><h3>Pricing</h3><div class="m-price"><b>${esc(fd.pricing.price)}</b><ul>${fd.pricing.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div></div>` : '';
      extra += fd.quote ? `<blockquote class="m-quote">${esc(fd.quote)}</blockquote>` : '';
    }
    return `
      <div class="m-media${a.featured ? ' wide' : ''}"><img src="${a.image}" alt="${esc(a.title)} screenshots"></div>
      <div class="m-content">
        <div class="m-head">
          <span class="app-icon">${a.emoji}</span>
          <div><h2 id="modalTitle">${esc(a.title)}</h2><p>${esc(a.tagline)} · ${esc(a.category)}</p></div>
        </div>
        <div class="m-actions">
          ${hasStore(a) ? `<a class="btn btn-app" href="${storeUrl(a)}" target="_blank" rel="noopener">Download on the App Store</a>` : '<span class="btn btn-ghost" aria-disabled="true">Coming soon</span>'}
          <button class="btn btn-ghost" data-share="${a.id}">Share</button>
        </div>
        <p class="m-desc">${esc(fd?.intro || a.description)}</p>
        <div class="m-tech">${(a.tech || []).map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        ${extra}
        <div class="m-legal">
          <a href="${a.legal.privacyUrl}">🔒 ${esc(a.title)} Privacy Policy</a>
          <a href="${a.legal.termsUrl}">📄 ${esc(a.title)} Terms of Use</a>
        </div>
      </div>`;
  }

  function openApp(id, push = true) {
    const idx = apps.findIndex((a) => a.id === id);
    if (idx < 0) return;
    const a = apps[idx];
    if (modal.hidden) lastFocus = document.activeElement;
    currentIdx = idx;
    sheet.style.setProperty('--c', a.accent);
    body.innerHTML = modalHTML(a);
    modal.hidden = false;
    document.body.classList.add('locked');
    sheet.scrollTop = 0;
    sheet.focus();
    if (push && location.hash !== '#app/' + id) history.replaceState(null, '', '#app/' + id);
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove('locked');
    history.replaceState(null, '', location.pathname + location.search);
    lastFocus?.focus?.();
  }

  const step = (d) => openApp(apps[(currentIdx + d + apps.length) % apps.length].id);
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
    if (e.target.closest('[data-prev]')) step(-1);
    if (e.target.closest('[data-next]')) step(1);
    const share = e.target.closest('[data-share]');
    if (share) {
      const url = location.origin + location.pathname + '#app/' + share.dataset.share;
      if (navigator.share) navigator.share({ title: byId[share.dataset.share].title, url }).catch(() => {});
      else copy(url, 'Link copied');
    }
  });
  addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  });
  $$('[data-open]').forEach((el) => el.addEventListener('click', (e) => { e.preventDefault(); openApp(el.dataset.open); }));

  const fromHash = () => {
    const m = location.hash.match(/^#app\/(.+)$/);
    if (m) openApp(decodeURIComponent(m[1]), false);
  };
  addEventListener('hashchange', fromHash);
  fromHash();

  // ---------- copy / toast ----------
  const toast = $('#toast');
  let toastT;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove('show'), 1800);
  }
  async function copy(text, msg = 'Copied') {
    try { await navigator.clipboard.writeText(text); showToast(msg + ' ✓'); }
    catch { location.href = 'mailto:' + text; }
  }
  $$('[data-copy]').forEach((b) => b.addEventListener('click', () => copy(b.dataset.copy, 'Email copied')));

  // ---------- reveal ----------
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach((el) => io.observe(el));

  // ---------- clock + year ----------
  const timeEl = $('#localTime');
  const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });
  const tickClock = () => (timeEl.textContent = fmt.format(new Date()) + ' GMT+3');
  tickClock();
  setInterval(tickClock, 30000);
  $('#year').textContent = new Date().getFullYear();
})();
