/**
 * Zoth Studio hub — nav, scroll, parallax, pets modal, lightbox, filters
 */
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile nav ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
  if (toggle && panel) {
    toggle.addEventListener('click', () => {
      const open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    panel.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        panel.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* ---------- Header + scroll progress ---------- */
  const header = document.querySelector('.site-header');
  const progress = document.querySelector('[data-scroll-progress]');
  const backTop = document.querySelector('[data-back-top]');

  const onScrollChrome = () => {
    const y = window.scrollY || 0;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = `${p}%`;
    }
    if (backTop) backTop.hidden = y < 480;
  };
  onScrollChrome();
  window.addEventListener('scroll', onScrollChrome, { passive: true });
  if (backTop) {
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Active section nav ---------- */
  const sectionIds = [
    'overview',
    'features',
    'pets',
    'pipeline',
    'arsenal',
    'run',
    'faq',
  ];
  const navLinks = [...document.querySelectorAll('[data-nav-link]')];
  const setActive = () => {
    let current = sectionIds[0];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= 140) current = id;
    }
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActive, { passive: true });
  setActive();

  const revealIfInView = () => {
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 40 && r.top < window.innerHeight - 40) el.classList.add('is-visible');
    });
  };
  window.addEventListener('hashchange', () => {
    requestAnimationFrame(revealIfInView);
  });
  window.addEventListener('load', revealIfInView);

  /* ---------- Reveal on view ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 }
    );
    revealEls.forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i % 6, 5) * 55}ms`);
      io.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Pet filters ---------- */
  const filterBar = document.querySelector('[data-pet-filters]');
  const petCards = [...document.querySelectorAll('[data-pet]')];
  if (filterBar && petCards.length) {
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      const filter = btn.dataset.filter;
      filterBar.querySelectorAll('[data-filter]').forEach((b) => b.classList.toggle('is-active', b === btn));
      petCards.forEach((card) => {
        const show = filter === 'all' || card.dataset.domain === filter;
        card.classList.toggle('is-filtered-out', !show);
        card.hidden = !show;
      });
    });
  }

  /* ---------- Pet art style (neon default / classic) ---------- */
  const artBar = document.querySelector('[data-art-style]');
  const applyArtStyle = (style) => {
    petCards.forEach((card) => {
      const neon = card.dataset.img; // current default is neon path in data-img
      const classic = card.dataset.imgClassic;
      const img = card.querySelector('.pet-media img');
      if (!img) return;
      // data-img holds neon default; classic is data-img-classic
      const neonSrc = card.getAttribute('data-img') || '';
      const classicSrc = card.getAttribute('data-img-classic') || neonSrc;
      const next = style === 'classic' ? classicSrc : neonSrc;
      img.src = next;
      card.dataset.currentArt = style;
    });
    document.body.classList.toggle('pets-classic', style === 'classic');
    document.body.classList.toggle('pets-neon', style !== 'classic');
  };
  // ensure defaults are neon
  applyArtStyle('neon');
  if (artBar) {
    artBar.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-art]');
      if (!btn) return;
      const style = btn.dataset.art || 'neon';
      artBar.querySelectorAll('[data-art]').forEach((b) => b.classList.toggle('is-active', b === btn));
      applyArtStyle(style);
    });
  }

  /* ---------- Pet modal ---------- */
  const petModal = document.querySelector('[data-pet-modal]');
  const petImg = document.querySelector('[data-pet-modal-img]');
  const petName = document.querySelector('[data-pet-modal-name]');
  const petRole = document.querySelector('[data-pet-modal-role]');
  const petBlurb = document.querySelector('[data-pet-modal-blurb]');
  const petDomain = document.querySelector('[data-pet-modal-domain]');
  const petTags = document.querySelector('[data-pet-modal-tags]');
  const petEngage = document.querySelector('[data-pet-modal-engage]');
  const copyEngage = document.querySelector('[data-copy-engage]');
  let lastFocus = null;

  const openPetModal = (card) => {
    if (!petModal) return;
    lastFocus = document.activeElement;
    const name = card.dataset.name || '';
    const role = card.dataset.role || '';
    const style = card.dataset.currentArt || 'neon';
    const img =
      style === 'classic'
        ? card.getAttribute('data-img-classic') || card.getAttribute('data-img') || ''
        : card.getAttribute('data-img') || '';
    const blurb = card.dataset.blurb || '';
    const engage = card.dataset.engage || '';
    const domain = (card.dataset.domain || '').toUpperCase();
    const tags = (card.dataset.tags || '').split(',').map((t) => t.trim()).filter(Boolean);

    if (petImg) {
      petImg.src = img;
      petImg.alt = name;
      petImg.classList.toggle('is-neon', style !== 'classic');
    }
    if (petName) petName.textContent = name;
    if (petRole) petRole.innerHTML = role;
    if (petBlurb) petBlurb.textContent = blurb;
    if (petDomain) petDomain.textContent = `Companion · ${domain}`;
    if (petEngage) petEngage.textContent = engage;
    if (petTags) {
      petTags.innerHTML = tags.map((t) => `<span class="tag">${t}</span>`).join('');
    }
    petModal.hidden = false;
    document.body.classList.add('modal-open');
    petModal.querySelector('.modal-close')?.focus();
  };

  const closePetModal = () => {
    if (!petModal) return;
    petModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };

  petCards.forEach((card) => {
    card.addEventListener('click', () => openPetModal(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPetModal(card);
      }
    });
  });

  petModal?.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closePetModal);
  });
  window.addEventListener('hashchange', () => {
    if (petModal && !petModal.hidden) closePetModal();
    if (lbModal && !lbModal.hidden) closeLightbox();
  });

  copyEngage?.addEventListener('click', async () => {
    const text = petEngage?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyEngage.textContent = 'Copied';
      setTimeout(() => {
        copyEngage.textContent = 'Copy engage prompt';
      }, 1400);
    } catch {
      copyEngage.textContent = 'Copy failed';
    }
  });

  /* ---------- Lightbox ---------- */
  const lbModal = document.querySelector('[data-lightbox-modal]');
  const lbStage = document.querySelector('[data-lightbox-stage]');
  const lbCap = document.querySelector('[data-lightbox-caption]');

  const closeLightbox = () => {
    if (!lbModal) return;
    lbModal.hidden = true;
    document.body.classList.remove('modal-open');
    if (lbStage) lbStage.innerHTML = '';
  };

  document.querySelectorAll('[data-lightbox]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!lbModal || !lbStage) return;
      const type = btn.dataset.type || 'image';
      const src = btn.dataset.src || '';
      const poster = btn.dataset.poster || '';
      const caption = btn.dataset.caption || '';
      lbStage.innerHTML = '';
      if (type === 'video') {
        const v = document.createElement('video');
        v.controls = true;
        v.autoplay = true;
        v.playsInline = true;
        if (poster) v.poster = poster;
        const s = document.createElement('source');
        s.src = src;
        s.type = 'video/mp4';
        v.appendChild(s);
        lbStage.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.src = src;
        img.alt = caption;
        lbStage.appendChild(img);
      }
      if (lbCap) lbCap.textContent = caption;
      lbModal.hidden = false;
      document.body.classList.add('modal-open');
    });
  });

  lbModal?.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', closeLightbox);
  });

  /* ---------- Escape closes modals ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (petModal && !petModal.hidden) closePetModal();
    if (lbModal && !lbModal.hidden) closeLightbox();
  });

  /* ---------- Copy runbook ---------- */
  const copyBtn = document.querySelector('[data-copy-code]');
  const codeBlock = document.querySelector('[data-code-block]');
  copyBtn?.addEventListener('click', async () => {
    const text = codeBlock?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = 'Copied';
      setTimeout(() => {
        copyBtn.textContent = 'Copy';
      }, 1400);
    } catch {
      copyBtn.textContent = 'Failed';
    }
  });

  /* ---------- Year ---------- */
  const y = document.querySelector('[data-year]');
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- Optional vault daemon + studio health probes (fail soft) ---------- */
  const daemonBadge = document.querySelector('[data-daemon-badge]');
  const studioBadges = [...document.querySelectorAll('[data-studio-badge]')];
  const studioLabel = document.querySelector('[data-studio-label]');
  const studioMeta = document.querySelector('[data-studio-meta]');

  const probe = async (url) => {
    const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timer = setTimeout(() => ctrl?.abort(), 1200);
    try {
      const res = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        signal: ctrl?.signal,
      });
      if (!res.ok) return null;
      try {
        return await res.json();
      } catch {
        return { ok: true };
      }
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };

  const probeDaemon = async () => {
    if (!daemonBadge) return;
    const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8787/health') : null;
    const ok = data && data.ok !== false;
    if (ok) {
      daemonBadge.hidden = false;
      daemonBadge.setAttribute('data-daemon-online', 'true');
    }
  };

  const probeStudio = async () => {
    if (!studioBadges.length) return;
    const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8484/api/dashboard') : null;
    const online = !!(data && (data.healthy === true || data.status === 'ok' || data.tool_count));
    studioBadges.forEach((badge) => {
      badge.hidden = false;
      badge.classList.toggle('is-offline', !online);
      badge.setAttribute('data-studio-online', online ? 'true' : 'false');
      badge.setAttribute('aria-label', online ? 'Studio deck is online' : 'Studio deck is offline');
    });
    if (studioLabel) studioLabel.textContent = online ? 'Deck online' : 'Deck offline';
    if (studioMeta) {
      studioMeta.textContent = online
        ? `${data.tool_count || 298} tools · Studio Deck`
        : 'Start orchestrator.py serve';
    }
    const map = document.querySelector('.deck-map');
    if (map) map.classList.toggle('is-offline', !online);
    const launch = document.querySelector('[data-studio-launch]');
    if (launch) {
      launch.title = online
        ? 'Open the operator deck'
        : 'Deck is offline — start orchestrator.py serve, then retry';
    }
  };

  const probeSpark = async () => {
    const launch = document.querySelector('[data-spark-launch]');
    if (!launch) return;
    const data = (location.hostname === 'localhost' || location.hostname === '127.0.0.1') ? await probe('http://127.0.0.1:8765/health') : null;
    const online = !!(data && data.ok);
    launch.title = online
      ? `Spark online · ${data.model || 'local model'}`
      : 'Spark is offline — python3 scripts/try_server.py in rust-website';
    launch.classList.toggle('is-offline', !online);
  };

  const runProbes = () => {
    probeDaemon();
    probeStudio();
    probeSpark();
  };
  if (typeof requestIdleCallback === 'function') {
    requestIdleCallback(runProbes, { timeout: 2500 });
  } else {
    setTimeout(runProbes, 400);
  }

  /* ---------- Count-up stats ---------- */
  const counters = [...document.querySelectorAll('[data-count]')];
  if (counters.length) {
    const runCount = (el) => {
      const target = parseFloat(el.dataset.count || '0');
      const suffix = el.dataset.suffix || '';
      if (reduce) {
        el.textContent = `${target}${suffix}`;
        return;
      }
      const start = performance.now();
      const dur = 1200;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        const val = Math.round(target * eased);
        el.textContent = `${val}${suffix}`;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            runCount(entry.target);
            cio.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );
      counters.forEach((el) => cio.observe(el));
    } else {
      counters.forEach(runCount);
    }
  }
})();
