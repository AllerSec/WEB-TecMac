/* ============================================
   TECMAC - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Header Scroll Effect ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // --- Mobile Menu ---
  const toggle = document.querySelector('.header__toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const overlay = document.querySelector('.mobile-menu__overlay');

  if (toggle && mobileMenu) {
    const toggleMenu = () => {
      toggle.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      if (overlay) overlay.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    };

    toggle.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) toggleMenu();
      });
    });
  }

  // --- Hero Slider ---
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  // --- Scroll Reveal ---
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));
  }

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target, 10);
          let count = 0;
          const increment = Math.ceil(target / 60);
          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              entry.target.textContent = target;
              clearInterval(timer);
            } else {
              entry.target.textContent = count;
            }
          }, 30);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObserver.observe(c));
  }

  // --- Gallery Lightbox ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');

  if (galleryItems.length > 0 && lightbox) {
    const lightboxImg = lightbox.querySelector('.lightbox__img');
    const closeBtn = lightbox.querySelector('.lightbox__close');
    const prevBtn = lightbox.querySelector('.lightbox__prev');
    const nextBtn = lightbox.querySelector('.lightbox__next');
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

    const openLightbox = (index) => {
      currentIndex = index;
      lightboxImg.src = images[currentIndex];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.querySelector('.cookie-banner');
  if (cookieBanner && !localStorage.getItem('tecmac_cookies')) {
    setTimeout(() => cookieBanner.classList.add('visible'), 800);

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

  // --- Contact Form ---
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const FORM_URL = 'https://script.google.com/macros/s/AKfycbwREONHpINH6QEITYRrgjAgMyaw1PYdLJIpSjRKRio0Hh12qdW6puYkUeXjCeaz2b6P1Q/exec';

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.contact-form__btn');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
      btn.disabled = true;

      const data = {
        nombre: contactForm.querySelector('[name="nombre"]').value,
        apellidos: contactForm.querySelector('[name="apellidos"]').value,
        email: contactForm.querySelector('[name="email"]').value,
        telefono: contactForm.querySelector('[name="telefono"]').value,
        mensaje: contactForm.querySelector('[name="mensaje"]').value
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
        setTimeout(() => { btn.innerHTML = originalText; btn.disabled = false; }, 3000);
      })
      .catch(() => {
        btn.innerHTML = contactForm.dataset.error || 'Error';
        btn.disabled = false;
        setTimeout(() => { btn.innerHTML = originalText; }, 3000);
      });
    });
  }

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
