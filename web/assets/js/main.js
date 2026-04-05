/* ============================================
   TECMAC — Main JavaScript v2
   GSAP 3.12.5 + ScrollTrigger + Canvas Particles
   Complete rebuild — April 2026
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── GSAP Setup ──
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.globalTimeline.timeScale(0);
    gsap.set('.reveal, .reveal-left, .reveal-right, .reveal-scale', {
      autoAlpha: 1, x: 0, y: 0, scale: 1
    });
  }

  // ── Page Loader (only on first visit per session) ──
  const loader = document.querySelector('.page-loader');
  let loaderShown = false;
  if (loader) {
    if (sessionStorage.getItem('tecmac_loaded')) {
      loader.remove();
    } else {
      loaderShown = true;
      sessionStorage.setItem('tecmac_loaded', '1');
      const loaderLogo = loader.querySelector('.page-loader__logo');
      const loaderBar = loader.querySelector('.page-loader__bar-inner');
      const loaderTl = gsap.timeline({
        onComplete: () => {
          gsap.to(loader, {
            autoAlpha: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => loader.remove()
          });
        }
      });
      loaderTl
        .to(loaderLogo, { autoAlpha: 1, duration: 0.4 })
        .to(loaderBar, { width: '100%', duration: 0.8, ease: 'power2.inOut' }, '-=0.1')
        .to(loaderLogo, { autoAlpha: 0, y: -10, duration: 0.3 }, '+=0.1');
    }
  }

  // ── Scroll Progress ──
  const scrollBar = document.querySelector('.scroll-progress');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      scrollBar.style.width = ((h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100) + '%';
    }, { passive: true });
  }

  // ── Custom Cursor ──
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  if (cursorDot && cursorRing && !('ontouchstart' in window)) {
    let mouseX = -100, mouseY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.15, ease: 'power2.out' });
      gsap.to(cursorRing, { x: mouseX, y: mouseY, duration: 0.4, ease: 'power2.out' });
    });

    const hoverTargets = 'a, button, .gallery-item, .feature-card, .reference-item, .services-list__item, .eng-category';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });
  }

  // ── Back to Top ──
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── Header Scroll ──
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Mobile Menu (GSAP) ──
  const toggle = document.querySelector('.header__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu__overlay');

  if (toggle && mobileMenu) {
    const menuLinks = mobileMenu.querySelectorAll('a');
    const openMenu = () => {
      toggle.classList.add('open');
      if (overlay) overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      mobileMenu.style.display = 'flex';
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(mobileMenu, { x: '100%' }, { x: '0%', duration: 0.45 })
        .fromTo(menuLinks, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, stagger: 0.06, duration: 0.4 }, '-=0.2');
    };
    const closeMenu = () => {
      toggle.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';
      gsap.to(mobileMenu, {
        x: '100%', duration: 0.35, ease: 'power3.in',
        onComplete: () => { mobileMenu.style.display = ''; }
      });
    };
    toggle.addEventListener('click', () => {
      toggle.classList.contains('open') ? closeMenu() : openMenu();
    });
    if (overlay) overlay.addEventListener('click', closeMenu);
    menuLinks.forEach(link => link.addEventListener('click', () => {
      if (toggle.classList.contains('open')) closeMenu();
    }));
  }

  // ── Hero Particle System (Steel Sparks) ──
  const particleCanvas = document.querySelector('.hero__particles canvas');
  if (!particleCanvas && document.querySelector('.hero__particles')) {
    const canvas = document.createElement('canvas');
    const container = document.querySelector('.hero__particles');
    container.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;

    const resize = () => {
      w = canvas.width = container.offsetWidth;
      h = canvas.height = container.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.life = Math.random() * 200 + 100;
        this.maxLife = this.life;
        this.hue = Math.random() > 0.7 ? 0 : 30;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life--;
        if (this.life <= 0 || this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
      }
      draw() {
        const alpha = (this.life / this.maxLife) * 0.6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.hue === 0) {
          ctx.fillStyle = `rgba(230, 57, 70, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(255, 140, 80, ${alpha * 0.7})`;
        }
        ctx.fill();
      }
    }

    const count = Math.min(80, Math.floor((w * h) / 15000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    // Connection lines
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(230, 57, 70, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animId = requestAnimationFrame(animate);
    };
    if (!prefersReduced) animate();

    // Pause when not visible
    const heroObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !prefersReduced) {
          if (!animId) animate();
        } else {
          cancelAnimationFrame(animId);
          animId = null;
        }
      });
    }, { threshold: 0.1 });
    heroObs.observe(container);
  }

  // ── Hero Entrance Timeline ──
  if (document.querySelector('.hero')) {
    gsap.set(
      ['.hero__tagline', '.hero__title', '.hero__subtitle', '.hero__cta', '.hero__scroll'],
      { autoAlpha: 0, y: 30 }
    );
    const heroTl = gsap.timeline({ delay: loaderShown ? 1.8 : 0.3, defaults: { ease: 'power3.out' } });
    heroTl
      .to('.hero__tagline',  { autoAlpha: 1, y: 0, duration: 0.8 })
      .to('.hero__title',    { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.5')
      .to('.hero__subtitle', { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero__cta',      { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.4')
      .to('.hero__scroll',   { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.2');
  }

  // ── Page Header Animation ──
  if (document.querySelector('.page-header')) {
    gsap.set(['.page-header__title', '.page-header__breadcrumb'], { autoAlpha: 0, y: 20 });
    const phTl = gsap.timeline({ delay: loaderShown ? 1.8 : 0.3, defaults: { ease: 'power3.out' } });
    phTl
      .to('.page-header__title',      { autoAlpha: 1, y: 0, duration: 0.8 })
      .to('.page-header__breadcrumb', { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4');
  }

  // ── Hero Slider ──
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    let current = 0;
    gsap.set(slides, { autoAlpha: 0 });
    gsap.set(slides[0], { autoAlpha: 1, scale: 1 });
    const nextSlide = () => {
      const prev = current;
      current = (current + 1) % slides.length;
      const tl = gsap.timeline();
      tl.to(slides[prev], { autoAlpha: 0, scale: 1.08, duration: 2, ease: 'power2.inOut' })
        .to(slides[current], { autoAlpha: 1, scale: 1, duration: 2, ease: 'power2.inOut' }, '-=2');
    };
    setInterval(nextSlide, 6000);
  } else if (slides.length === 1) {
    gsap.set(slides[0], { autoAlpha: 1 });
  }

  // ── Hero Mouse Parallax ──
  const hero = document.querySelector('.hero');
  if (hero && !prefersReduced) {
    const heroSlider  = hero.querySelector('.hero__slider');
    const heroContent = hero.querySelector('.hero__content');
    if (heroSlider && heroContent) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width - 0.5;
        const yPos = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(heroSlider, { x: xPos * -20, y: yPos * -12, duration: 1.2, ease: 'power2.out' });
        gsap.to(heroContent, { x: xPos * 12, y: yPos * 6, duration: 1.2, ease: 'power2.out' });
      });
      hero.addEventListener('mouseleave', () => {
        gsap.to([heroSlider, heroContent], { x: 0, y: 0, duration: 1.5, ease: 'power2.out' });
      });
    }
  }

  // ── ScrollTrigger Reveals ──
  if (!prefersReduced) {
    gsap.set('.reveal',       { autoAlpha: 0, y: 40 });
    gsap.set('.reveal-left',  { autoAlpha: 0, x: -50 });
    gsap.set('.reveal-right', { autoAlpha: 0, x: 50 });
    gsap.set('.reveal-scale', { autoAlpha: 0, scale: 0.9 });

    ScrollTrigger.batch('.reveal', {
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.8 }),
      start: 'top 88%', once: true
    });
    ScrollTrigger.batch('.reveal-left', {
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.8 }),
      start: 'top 88%', once: true
    });
    ScrollTrigger.batch('.reveal-right', {
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, x: 0, stagger: 0.08, duration: 0.8 }),
      start: 'top 88%', once: true
    });
    ScrollTrigger.batch('.reveal-scale', {
      onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, scale: 1, stagger: 0.06, duration: 0.7 }),
      start: 'top 90%', once: true
    });
  }

  // ── Keyword Highlight on scroll ──
  document.querySelectorAll('.keyword-highlight').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.delayedCall(0.8, () => el.classList.add('active'))
    });
  });

  // ── Counter Animation ──
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    if (isNaN(target)) return;
    ScrollTrigger.create({
      trigger: counter, start: 'top 85%', once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target, duration: 2.2, ease: 'power2.out',
          onUpdate: function() { counter.textContent = Math.round(this.targets()[0].val); }
        });
      }
    });
  });

  // ── Feature Card Hover ──
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -8, boxShadow: '0 16px 48px rgba(0,0,0,0.25)', duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { y: 0, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', duration: 0.4, ease: 'power2.in' });
    });
  });

  // ── CTA Button Micro-interactions ──
  document.querySelectorAll('.hero__cta, .eng-category__btn, .contact-form__btn, .error-page__btn').forEach(btn => {
    const arrow = btn.querySelector('svg');
    if (arrow) {
      btn.addEventListener('mouseenter', () => gsap.to(arrow, { x: 5, duration: 0.25, ease: 'power2.out' }));
      btn.addEventListener('mouseleave', () => gsap.to(arrow, { x: 0, duration: 0.25, ease: 'power2.in' }));
    }
  });

  // ── Magnetic Button Effect ──
  document.querySelectorAll('.hero__cta, .error-page__btn').forEach(btn => {
    if ('ontouchstart' in window) return;
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.15, y: y * 0.15, duration: 0.4, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });

  // ── Services List Stagger on hover ──
  document.querySelectorAll('.services-list__item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      gsap.to(item.querySelector('svg'), { rotation: 360, duration: 0.5, ease: 'power2.out' });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item.querySelector('svg'), { rotation: 0, duration: 0.3, ease: 'power2.in' });
    });
  });

  // ── Gallery Lightbox ──
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const closeBtn    = lightbox.querySelector('.lightbox__close');
    const prevBtn     = lightbox.querySelector('.lightbox__prev');
    const nextBtn     = lightbox.querySelector('.lightbox__next');
    let currentIndex  = 0;
    const images      = Array.from(galleryItems).map(item => item.querySelector('img').src);

    const openLightbox = (index) => {
      currentIndex = index;
      lightboxImg.src = images[currentIndex];
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(lightboxImg, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.1 });
    };

    const closeLightbox = () => {
      gsap.to(lightbox, {
        opacity: 0, duration: 0.25,
        onComplete: () => { lightbox.style.display = ''; document.body.style.overflow = ''; }
      });
    };

    const changeSlide = (newIndex) => {
      gsap.to(lightboxImg, {
        opacity: 0, scale: 0.95, duration: 0.2,
        onComplete: () => {
          currentIndex = newIndex;
          lightboxImg.src = images[currentIndex];
          gsap.to(lightboxImg, { opacity: 1, scale: 1, duration: 0.3 });
        }
      });
    };

    galleryItems.forEach((item, i) => item.addEventListener('click', () => openLightbox(i)));
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); changeSlide((currentIndex - 1 + images.length) % images.length); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); changeSlide((currentIndex + 1) % images.length); });
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft'  && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  // ── Cookie Banner ──
  const cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner && !localStorage.getItem('tecmac_cookies')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1500);
    const acceptBtn = cookieBanner.querySelector('.cookie-banner__btn--accept');
    const rejectBtn = cookieBanner.querySelector('.cookie-banner__btn--reject');
    if (acceptBtn) acceptBtn.addEventListener('click', () => { localStorage.setItem('tecmac_cookies', 'accepted'); cookieBanner.classList.remove('visible'); });
    if (rejectBtn) rejectBtn.addEventListener('click', () => { localStorage.setItem('tecmac_cookies', 'rejected'); cookieBanner.classList.remove('visible'); });
  }

  // ── Contact Form ──
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const FORM_URL = 'https://script.google.com/macros/s/AKfycbwREONHpINH6QEITYRrgjAgMyaw1PYdLJIpSjRKRio0Hh12qdW6puYkUeXjCeaz2b6P1Q/exec';
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.contact-form__btn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
      btn.disabled = true;
      const data = {
        nombre:    contactForm.querySelector('[name="nombre"]').value,
        apellidos: contactForm.querySelector('[name="apellidos"]').value,
        email:     contactForm.querySelector('[name="email"]').value,
        telefono:  contactForm.querySelector('[name="telefono"]').value,
        mensaje:   contactForm.querySelector('[name="mensaje"]').value
      };
      fetch(FORM_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(() => { contactForm.reset(); btn.innerHTML = contactForm.dataset.success || 'Enviado'; setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; }, 3000); })
        .catch(() => { btn.innerHTML = contactForm.dataset.error || 'Error'; btn.disabled = false; setTimeout(() => { btn.innerHTML = originalHTML; }, 3000); });
    });
  }

  // ── Smooth Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ── Image Load Reveal ──
  document.querySelectorAll('.feature-card__bg img, .eng-category__preview-thumb img').forEach(img => {
    const reveal = () => img.classList.add('img-loaded');
    if (img.complete && img.naturalHeight !== 0) reveal();
    else { img.addEventListener('load', reveal); img.addEventListener('error', reveal); }
  });

  // ── Parallax on Page Header BG ──
  const pageHeaderBg = document.querySelector('.page-header__bg');
  if (pageHeaderBg && !prefersReduced) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < 600) {
        gsap.set(pageHeaderBg, { y: scrollY * 0.3 });
      }
    }, { passive: true });
  }

  // ── Tilt Effect on Reference Items ──
  document.querySelectorAll('.reference-item').forEach(item => {
    if ('ontouchstart' in window) return;
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(item, {
        rotationY: x * 8, rotationX: -y * 8,
        duration: 0.4, ease: 'power2.out',
        transformPerspective: 600
      });
    });
    item.addEventListener('mouseleave', () => {
      gsap.to(item, { rotationY: 0, rotationX: 0, duration: 0.6, ease: 'power2.out' });
    });
  });

  // ── Language Auto-Detection (only on root index) ──
  if (window.location.pathname === '/' || window.location.pathname === '/index.html' || window.location.pathname.endsWith('/web/index.html')) {
    const saved = localStorage.getItem('tecmac_lang');
    if (!saved) {
      const lang = (navigator.language || navigator.userLanguage || 'es').toLowerCase();
      let target = null;
      if (lang.startsWith('fr')) target = 'fr/index.html';
      else if (lang.startsWith('en')) target = 'en/index.html';
      // euskara never default
      // else stay on ES (root index.html)
      if (target) {
        localStorage.setItem('tecmac_lang', lang.substring(0, 2));
        window.location.replace(target);
      }
    }
  }

  // ── Prefetch all pages for instant navigation ──
  const prefetchPages = () => {
    document.querySelectorAll('.header__nav a, .footer__links a, .mobile-menu a').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
      }
    });
  };
  if ('requestIdleCallback' in window) {
    requestIdleCallback(prefetchPages);
  } else {
    setTimeout(prefetchPages, 2000);
  }

});
