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
    heroButton.addEventListener('click', () => {
      const isOpen = heroButton.getAttribute('aria-expanded') === 'true';
      setHeroMenuState(!isOpen);
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

  const seedFxLayer = () => {
    if (!fxLayer || prefersReducedMotionQuery.matches) return;
    fxLayer.innerHTML = '';
    const orbCount = 6;
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
    }
  };

  if (fxLayer) {
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

  // Cross-page fade transition between shop and sub-shop pages
  const initFadeTransitions = () => {
    const body = document.body;
    if (!body) return;
    if (body.classList.contains('fade-init')) {
      window.requestAnimationFrame(() => {
        body.classList.remove('fade-init');
        body.classList.add('fade-in');
      });
    }
    const fadeLinks = document.querySelectorAll('a[data-fade-nav]');
    fadeLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        if (prefersReducedMotionQuery.matches) return;
        const href = link.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        body.classList.add('fade-out');
        setTimeout(() => {
          window.location.href = href;
        }, 220);
      });
    });
  };
  initFadeTransitions();
});
