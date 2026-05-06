document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('[data-nav-toggle]');
  const mobilePanel = document.querySelector('[data-nav-panel]');
  const pageBody = document.body;
  const pageKey = pageBody?.dataset?.page;
  const heroButton = document.getElementById('get-started');
  const heroMenu = document.querySelector('[data-hero-menu]');
  const heroOverlay = document.getElementById('cta-overlay');
  const heroGlint = document.getElementById('hero-glint');
  const heroContent = document.getElementById('hero-content');
  const fxLayer = document.getElementById('fx-layer');
  const prefersReducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const supportsMediaListener = typeof prefersReducedMotionQuery?.addEventListener === 'function';
  const addMotionListener = (handler) => {
    if (supportsMediaListener) {
      prefersReducedMotionQuery.addEventListener('change', handler);
    } else if (typeof prefersReducedMotionQuery?.addListener === 'function') {
      prefersReducedMotionQuery.addListener(handler);
    }
  };

  const closeMenu = () => {
    if (!navToggle || !mobilePanel) return;
    navToggle.setAttribute('aria-expanded', 'false');
    mobilePanel.dataset.open = 'false';
    mobilePanel.setAttribute('hidden', '');
    pageBody.classList.remove('nav-open');
  };

  const openMenu = () => {
    if (!navToggle || !mobilePanel) return;
    navToggle.setAttribute('aria-expanded', 'true');
    mobilePanel.dataset.open = 'true';
    mobilePanel.removeAttribute('hidden');
    pageBody.classList.add('nav-open');
  };

  if (navToggle && mobilePanel) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobilePanel.addEventListener('click', (event) => {
      if (event.target === mobilePanel) {
        closeMenu();
      }
    });

    mobilePanel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeMenu();
      }
    });
  }

  if (pageKey) {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    navLinks.forEach((link) => {
      const target = link.getAttribute('data-nav-link');
      const isActive = target === pageKey;
      if (isActive) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
      link.classList.toggle('text-white', isActive);
      link.classList.toggle('text-blue-100/80', !isActive);
    });
  }

  const setHeroMenuState = (open) => {
    if (!heroButton || !heroMenu) return;
    heroButton.setAttribute('aria-expanded', String(open));
    heroMenu.dataset.visible = open ? 'true' : 'false';
    heroMenu.setAttribute('aria-hidden', String(!open));
    if (heroOverlay) {
      heroOverlay.dataset.active = open ? 'true' : 'false';
    }
    if (heroGlint && !prefersReducedMotionQuery.matches) {
      heroGlint.classList.toggle('animate-glint', open);
    }
  };

  if (heroButton && heroMenu) {
    heroButton.addEventListener('click', (event) => {
      // Compute ripple origin relative to button
      const rect = heroButton.getBoundingClientRect();
      const x = (event.clientX ?? (rect.left + rect.width / 2)) - rect.left;
      const y = (event.clientY ?? (rect.top + rect.height / 2)) - rect.top;
      heroButton.style.setProperty('--ripple-x', `${x}px`);
      heroButton.style.setProperty('--ripple-y', `${y}px`);
      // Trigger ripple
      heroButton.classList.add('btn-rippling');
      // Open menu (no toggle) for a snappier feel
      setHeroMenuState(true);
      // Fade out and remove button after short delay
      heroButton.style.pointerEvents = 'none';
      // Allow ripple to be visible briefly before fade
      setTimeout(() => {
        heroButton.classList.add('is-fading');
      }, 80);
      // Clean up: stop ripple class and remove element from layout
      setTimeout(() => {
        heroButton.classList.remove('btn-rippling');
        heroButton.style.display = 'none';
      }, 280);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && heroButton.getAttribute('aria-expanded') === 'true') {
        setHeroMenuState(false);
      }
    });

    if (heroOverlay) {
      heroOverlay.addEventListener('click', () => setHeroMenuState(false));
    }
  }

  if (heroContent) {
    window.requestAnimationFrame(() => {
      heroContent.classList.remove('opacity-0', 'translate-y-4');
      heroContent.classList.add('opacity-100', 'translate-y-0');
    });
  }

  const parsePercentValue = (value, fallback = 0) => {
    const numeric = parseFloat(value);
    return Number.isNaN(numeric) ? fallback : numeric;
  };

  const emitParticlesAtLayerPoint = (x, y, options = {}) => {
    if (!fxLayer || prefersReducedMotionQuery.matches) return;
    const { count = 8, radius = 44, drift = -24 } = options;
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'fx-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      const angle = (Math.PI * 2 * (i / count)) + (Math.random() * 0.7 - 0.35);
      const distance = radius * (0.6 + Math.random() * 0.5);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * (radius * 0.32 + Math.random() * 10) + drift;
      const duration = 520 + Math.random() * 300;
      const scale = 0.65 + Math.random() * 0.35;
      particle.style.setProperty('--dx', `${dx}px`);
      particle.style.setProperty('--dy', `${dy}px`);
      particle.style.setProperty('--duration', `${duration}ms`);
      particle.style.setProperty('--scale', scale.toFixed(2));
      fxLayer.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove());
    }
  };

  const emitParticlesAtViewportPoint = (x, y, options = {}) => {
    if (!fxLayer) return;
    const rect = fxLayer.getBoundingClientRect();
    emitParticlesAtLayerPoint(x - rect.left, y - rect.top, options);
  };

  const seedFxLayer = () => {
    if (!fxLayer || prefersReducedMotionQuery.matches) return;
    fxLayer.innerHTML = '';
    const orbCount = 9;
    for (let i = 0; i < orbCount; i += 1) {
      const orb = document.createElement('span');
      orb.className = 'fx-orb';
      const x = 15 + Math.random() * 70;
      const startY = 10 + Math.random() * 50;
      const size = 18 + Math.random() * 36;
      const duration = 12 + Math.random() * 8;
      const delay = Math.random() * 4;
      orb.style.setProperty('--x', `${x}%`);
      orb.style.setProperty('--start-y', `${startY}%`);
      orb.style.setProperty('--size', `${size}px`);
      orb.style.setProperty('--duration', `${duration}s`);
      orb.style.setProperty('--delay', `${delay}s`);
      fxLayer.appendChild(orb);
      orb.addEventListener('animationiteration', () => {
        const rect = fxLayer.getBoundingClientRect();
        const xPercent = parsePercentValue(orb.style.getPropertyValue('--x'), 50);
        const startPercent = parsePercentValue(orb.style.getPropertyValue('--start-y'), 20);
        const xPosition = (xPercent / 100) * rect.width;
        const yPosition = (startPercent / 100) * rect.height - 55;
        emitParticlesAtLayerPoint(xPosition, Math.max(yPosition, 12), {
          count: 6,
          radius: 30,
          drift: -42,
        });
      });
    }
  };

  if (fxLayer) {
    if (typeof window !== 'undefined') {
      window.heroBubbleBurst = (clientX, clientY, options = {}) => {
        emitParticlesAtViewportPoint(clientX, clientY, options);
      };
    }
    seedFxLayer();
    addMotionListener((event) => {
      if (event.matches) {
        fxLayer.innerHTML = '';
        if (heroGlint) {
          heroGlint.classList.remove('animate-glint');
        }
      } else {
        seedFxLayer();
        if (heroButton?.getAttribute('aria-expanded') === 'true') {
          heroGlint?.classList.add('animate-glint');
        }
      }
    });
  }


  const initShopCatalog = () => {
    if (pageKey !== 'shop') return;
    const catalog = document.getElementById('catalog');
    if (!catalog) return;

    const sourceItems = Array.isArray(window.TEMPLATE_SHOP_ITEMS) ? window.TEMPLATE_SHOP_ITEMS : [];
    const items = [
      {
        title: 'Crayon Box Recital',
        category: 'bundle',
        description: 'A ten-piece collection from Black to Violet.',
        subtitle: 'Bundle + individual colors',
        href: 'crayonboxshop.html',
        cta: 'View',
      },
      ...sourceItems.map((item) => ({ ...item, cta: 'Template' })),
    ];

    const createCard = (item) => {
      const article = document.createElement('article');
      article.className = 'item shop-card rounded-xl border border-white/15 bg-slate-950 p-6 shadow-lg ring-1 ring-white/10';
      article.dataset.categories = item.category || 'all';

      if (item.href) {
        article.innerHTML = `<a href="${item.href}" class="block" data-fade-nav><h2 class="text-xl font-semibold">${item.title}</h2><p class="mt-1 text-slate-300 text-sm">${item.subtitle || ''}</p><p class="mt-4 text-sm text-slate-400">${item.description || ''}</p></a>`;
      } else {
        article.innerHTML = `<div class="flex items-start justify-between gap-4"><div><h2 class="text-xl font-semibold">${item.title}</h2><p class="mt-1 text-slate-300 text-sm">${item.difficulty || 'All levels'} · ${(item.category || 'template').toUpperCase()}</p></div><span class="rounded-full bg-brand-400/20 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-inset ring-brand-200/40">${item.cta}</span></div><p class="mt-4 text-sm text-slate-400">${item.description || ''}</p><div class="mt-4 flex flex-wrap gap-2"><a class="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10" href="${item.pdf}" target="_blank" rel="noopener">PDF</a><a class="rounded-full border border-white/20 px-3 py-1.5 text-xs hover:bg-white/10" href="${item.audio}" target="_blank" rel="noopener">Audio</a></div>`;
      }
      return article;
    };

    items.forEach((item) => catalog.appendChild(createCard(item)));

    const buttons = Array.from(document.querySelectorAll('.filter-btn'));
    const clearBtn = document.getElementById('clear-filters');
    const cardNodes = Array.from(catalog.querySelectorAll('.item'));
    const selected = new Set();

    const renderFilters = () => {
      if (selected.size === 0) {
        cardNodes.forEach((el) => el.classList.remove('hidden'));
      } else {
        cardNodes.forEach((el) => {
          const cats = (el.dataset.categories || '').split(',').map((v) => v.trim());
          el.classList.toggle('hidden', !cats.some((cat) => selected.has(cat)));
        });
      }

      buttons.forEach((button) => {
        const filter = button.dataset.filter;
        const active = filter === 'all' ? selected.size === 0 : selected.has(filter);
        button.classList.toggle('bg-white/10', active);
        button.setAttribute('aria-pressed', String(active));
      });
    };

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        if (filter === 'all') selected.clear();
        else if (selected.has(filter)) selected.delete(filter);
        else selected.add(filter);
        renderFilters();
      });
    });

    clearBtn?.addEventListener('click', () => {
      selected.clear();
      renderFilters();
    });

    renderFilters();
  };

  // Cross-page fade transition between shop and sub-shop pages
  const initFadeTransitions = () => {
    const body = document.body;
    if (!body) return;
    // show cards on load
    if (body.classList.contains('cards-init')) {
      window.requestAnimationFrame(() => {
        body.classList.add('cards-show');
      });
    }
    const fadeLinks = document.querySelectorAll('a[data-fade-nav]');
    fadeLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (prefersReducedMotionQuery.matches) {
          // Reduced motion: simple navigation
          return;
        }
        e.preventDefault();
        // Fade out all cards, then navigate
        body.classList.remove('cards-show');
        setTimeout(() => {
          window.location.href = href;
        }, 260);
      });
    });
  };
  initShopCatalog();
  initFadeTransitions();
});
