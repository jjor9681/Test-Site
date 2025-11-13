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
  initFadeTransitions();
});
