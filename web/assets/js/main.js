/* ============================================
   TECMAC — Main JavaScript
   GSAP 3.12.5 + ScrollTrigger
   Complete rebuild — April 2026
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // GSAP SETUP
  // ============================================
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power3.out' });

  // Reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.globalTimeline.timeScale(0);
    gsap.set('.reveal, .reveal-left, .reveal-right, .reveal-scale', {
      autoAlpha: 1, x: 0, y: 0, scale: 1
    });
  }

  // ============================================
  // SCROLL PROGRESS BAR
  // ============================================
  const scrollBar = document.querySelector('.scroll-progress');
  if (scrollBar) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      scrollBar.style.width = pct + '%';
    }, { passive: true });
  }

  // ============================================
  // BACK TO TOP BUTTON
  // ============================================
  const btt = document.querySelector('.back-to-top');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('visible', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ============================================
  // MOBILE MENU (GSAP animated)
  // ============================================
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
        .fromTo(menuLinks, { autoAlpha: 0, x: 30 }, {
          autoAlpha: 1, x: 0,
          stagger: 0.06,
          duration: 0.4
        }, '-=0.2');
    };

    const closeMenu = () => {
      toggle.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
      document.body.style.overflow = '';

      gsap.to(mobileMenu, {
        x: '100%',
        duration: 0.35,
        ease: 'power3.in',
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

  // ============================================
  // HERO ENTRANCE TIMELINE
  // ============================================
  if (document.querySelector('.hero')) {
    gsap.set(
      ['.hero__tagline', '.hero__title', '.hero__subtitle', '.hero__cta', '.hero__scroll'],
      { autoAlpha: 0, y: 30 }
    );

    const heroTl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power3.out' } });
    heroTl
      .to('.hero__tagline',  { autoAlpha: 1, y: 0, duration: 0.8 })
      .to('.hero__title',    { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.5')
      .to('.hero__subtitle', { autoAlpha: 1, y: 0, duration: 0.8 }, '-=0.5')
      .to('.hero__cta',      { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.4')
      .to('.hero__scroll',   { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.2');
  }

  // ============================================
  // PAGE HEADER ANIMATION (subpages)
  // ============================================
  if (document.querySelector('.page-header')) {
    gsap.set(['.page-header__title', '.page-header__breadcrumb'], { autoAlpha: 0, y: 20 });
    const phTl = gsap.timeline({ delay: 0.3, defaults: { ease: 'power3.out' } });
    phTl
      .to('.page-header__title',      { autoAlpha: 1, y: 0, duration: 0.8 })
      .to('.page-header__breadcrumb', { autoAlpha: 1, y: 0, duration: 0.6 }, '-=0.4');
  }

  // ============================================
  // HERO SLIDER (GSAP crossfade)
  // ============================================
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    let current = 0;
    gsap.set(slides, { autoAlpha: 0 });
    gsap.set(slides[0], { autoAlpha: 1 });

    const nextSlide = () => {
      const prev = current;
      current = (current + 1) % slides.length;
      const tl = gsap.timeline();
      tl.to(slides[prev], { autoAlpha: 0, scale: 1.05, duration: 1.8, ease: 'power2.inOut' })
        .to(slides[current], { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power2.inOut' }, '-=1.8');
    };
    setInterval(nextSlide, 5500);
  } else if (slides.length === 1) {
    gsap.set(slides[0], { autoAlpha: 1 });
  }

  // ============================================
  // HERO MOUSE PARALLAX
  // ============================================
  const hero = document.querySelector('.hero');
  if (hero && !prefersReduced) {
    const heroSlider  = hero.querySelector('.hero__slider');
    const heroContent = hero.querySelector('.hero__content');

    if (heroSlider && heroContent) {
      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const xPos = (e.clientX - rect.left) / rect.width  - 0.5;
        const yPos = (e.clientY - rect.top)  / rect.height - 0.5;

        gsap.to(heroSlider, {
          x: xPos * -18,
          y: yPos * -10,
          duration: 1.2,
          ease: 'power2.out'
        });
        gsap.to(heroContent, {
          x: xPos * 10,
          y: yPos * 5,
          duration: 1.2,
          ease: 'power2.out'
        });
      });

      hero.addEventListener('mouseleave', () => {
        gsap.to([heroSlider, heroContent], {
          x: 0, y: 0,
          duration: 1.5,
          ease: 'power2.out'
        });
      });
    }
  }

  // ============================================
  // SCROLLTRIGGER REVEAL ANIMATIONS
  // ============================================
  if (!prefersReduced) {
    gsap.set('.reveal',       { autoAlpha: 0, y: 40 });
    gsap.set('.reveal-left',  { autoAlpha: 0, x: -50 });
    gsap.set('.reveal-right', { autoAlpha: 0, x: 50 });
    gsap.set('.reveal-scale', { autoAlpha: 0, scale: 0.9 });

    ScrollTrigger.batch('.reveal', {
      onEnter: (batch) => gsap.to(batch, {
        autoAlpha: 1, y: 0,
        stagger: 0.1,
        duration: 0.8
      }),
      start: 'top 88%',
      once: true
    });

    ScrollTrigger.batch('.reveal-left', {
      onEnter: (batch) => gsap.to(batch, {
        autoAlpha: 1, x: 0,
        stagger: 0.08,
        duration: 0.8
      }),
      start: 'top 88%',
      once: true
    });

    ScrollTrigger.batch('.reveal-right', {
      onEnter: (batch) => gsap.to(batch, {
        autoAlpha: 1, x: 0,
        stagger: 0.08,
        duration: 0.8
      }),
      start: 'top 88%',
      once: true
    });

    ScrollTrigger.batch('.reveal-scale', {
      onEnter: (batch) => gsap.to(batch, {
        autoAlpha: 1, scale: 1,
        stagger: 0.06,
        duration: 0.7
      }),
      start: 'top 90%',
      once: true
    });
  }

  // ============================================
  // KEYWORD HIGHLIGHT — activate on scroll
  // ============================================
  document.querySelectorAll('.keyword-highlight').forEach(el => {
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.delayedCall(0.8, () => el.classList.add('active'))
    });
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  document.querySelectorAll('.counter').forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate: function () {
            counter.textContent = Math.round(this.targets()[0].val);
          }
        });
      }
    });
  });

  // ============================================
  // FEATURE CARD HOVER (GSAP)
  // ============================================
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        y: -6,
        boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
        duration: 0.35,
        ease: 'power2.out'
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        y: 0,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        duration: 0.35,
        ease: 'power2.in'
      });
    });
  });

  // ============================================
  // CTA BUTTON ARROW MICRO-INTERACTIONS
  // ============================================
  document.querySelectorAll('.hero__cta, .eng-category__btn, .contact-form__btn, .error-page__btn').forEach(btn => {
    const arrow = btn.querySelector('svg');
    if (arrow) {
      btn.addEventListener('mouseenter', () => gsap.to(arrow, { x: 5, duration: 0.25, ease: 'power2.out' }));
      btn.addEventListener('mouseleave', () => gsap.to(arrow, { x: 0, duration: 0.25, ease: 'power2.in' }));
    }
  });

  // ============================================
  // GALLERY LIGHTBOX (GSAP-powered)
  // ============================================
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
        opacity: 0,
        duration: 0.25,
        onComplete: () => {
          lightbox.style.display = '';
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    };

    const changeSlide = (newIndex) => {
      gsap.to(lightboxImg, {
        opacity: 0, scale: 0.95,
        duration: 0.2,
        onComplete: () => {
          currentIndex = newIndex;
          lightboxImg.src = images[currentIndex];
          gsap.to(lightboxImg, { opacity: 1, scale: 1, duration: 0.3 });
        }
      });
    };

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

    if (prevBtn) prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      changeSlide((currentIndex - 1 + images.length) % images.length);
    });
    if (nextBtn) nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      changeSlide((currentIndex + 1) % images.length);
    });

    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display !== 'flex') return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft'  && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  // ============================================
  // COOKIE BANNER
  // ============================================
  const cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner && !localStorage.getItem('tecmac_cookies')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 1000);

    const acceptBtn = cookieBanner.querySelector('.cookie-banner__btn--accept');
    const rejectBtn = cookieBanner.querySelector('.cookie-banner__btn--reject');

    if (acceptBtn) acceptBtn.addEventListener('click', () => {
      localStorage.setItem('tecmac_cookies', 'accepted');
      cookieBanner.classList.remove('visible');
    });
    if (rejectBtn) rejectBtn.addEventListener('click', () => {
      localStorage.setItem('tecmac_cookies', 'rejected');
      cookieBanner.classList.remove('visible');
    });
  }

  // ============================================
  // CONTACT FORM (Google Sheets)
  // ============================================
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

      fetch(FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(() => {
        contactForm.reset();
        btn.innerHTML = contactForm.dataset.success || 'Enviado';
        setTimeout(() => { btn.innerHTML = originalHTML; btn.disabled = false; }, 3000);
      })
      .catch(() => {
        btn.innerHTML = contactForm.dataset.error || 'Error';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = originalHTML; }, 3000);
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================
  // IMAGE LOAD REVEAL
  // ============================================
  document.querySelectorAll('.feature-card__bg img, .eng-category__preview-thumb img').forEach(img => {
    const reveal = () => img.classList.add('img-loaded');
    if (img.complete && img.naturalHeight !== 0) {
      reveal();
    } else {
      img.addEventListener('load', reveal);
      img.addEventListener('error', reveal);
    }
  });

});
