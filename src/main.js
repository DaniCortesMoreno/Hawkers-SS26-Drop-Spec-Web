import './style.css';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  const lenis = initLenisSmoothScroll();
  initCustomCursor();
  initHeaderScrollProgress();
  
  // Scrollytelling Experiences with GSAP & ScrollTrigger
  initHeroScrolly();
  initChainedNarrativeScrolly();
  initChainedFeaturesScrolly();
  initMetricCounterScrolly();
  
  // Interactive Components
  initOrderForm();
  initCarousel();
  initFaqAccordion();

  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

/* ==================================================
   1. LENIS SMOOTH SCROLLING (INTEGRATED WITH GSAP)
   ================================================== */
function initLenisSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          const isTop = targetId === '#top' || targetId === '#intro';
          lenis.scrollTo(targetElement, { offset: isTop ? 0 : -76 });
        }
      }
    });
  });

  return lenis;
}

/* ==================================================
   2. CUSTOM SMOOTH CURSOR
   ================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const follower = document.querySelector('.cursor-follower');
  if (!dot || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, input, select, textarea, [role="button"], .service-filter-pill, .btn-editorial-primary, .btn-editorial-secondary, .faq-accordion-item'
  );
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Dark surface detector for cursor inversion
  const darkSections = document.querySelectorAll('.bg-dark-surface, [data-cursor-dark]');
  darkSections.forEach((sec) => {
    sec.addEventListener('mouseenter', () => document.body.classList.add('cursor-dark'));
    sec.addEventListener('mouseleave', () => document.body.classList.remove('cursor-dark'));
  });
}

/* ==================================================
   3. HEADER SCROLL PROGRESS LINE & STATE
   ================================================== */
function initHeaderScrollProgress() {
  const loadingLine = document.querySelector('[data-loading-line]');
  const header = document.querySelector('[data-header]');

  const updateHeader = () => {
    const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / totalScroll)) : 0;

    if (loadingLine) {
      loadingLine.style.transform = `scaleX(${progress})`;
    }

    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }
  };

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Mobile menu toggle
  const mobileOpener = document.querySelector('[data-menu-opener]');
  const mobileDrawer = document.getElementById('ayocin-mobile-drawer');
  const closeMobile = document.getElementById('close-mobile-drawer');

  if (mobileOpener && mobileDrawer) {
    mobileOpener.addEventListener('click', () => {
      mobileDrawer.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
    const hideMobile = () => {
      mobileDrawer.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    if (closeMobile) closeMobile.addEventListener('click', hideMobile);
    mobileDrawer.querySelectorAll('a').forEach((l) => l.addEventListener('click', hideMobile));
  }
}

/* ==================================================
   4. SCROLLYTELLING: HERO INTRO PARALLAX & FADE
   ================================================== */
function initHeroScrolly() {
  const heroSection = document.getElementById('intro');
  const masthead = document.querySelector('.hero-masthead');

  if (!heroSection || !masthead) return;

  gsap.to(masthead, {
    y: -50,
    opacity: 0.25,
    ease: 'none',
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });
}

/* ==================================================
   5. SCROLLYTELLING: CHAINED NARRATIVE (AYOCIN NATIVE STICKY)
   ================================================== */
function initChainedNarrativeScrolly() {
  const narrativeContainer = document.getElementById('narrative-scrolly-container');
  const statements = document.querySelectorAll('.narrative-statement-step');
  const cards = document.querySelectorAll('.narrative-card-step');
  const counterText = document.getElementById('narrative-step-counter');
  const dots = document.querySelectorAll('.narrative-dot');

  if (!narrativeContainer || !statements.length) return;

  const totalSteps = statements.length;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: narrativeContainer,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const step = Math.min(totalSteps - 1, Math.floor(self.progress * totalSteps));
        if (counterText) {
          counterText.textContent = `0${step + 1} / 0${totalSteps}`;
        }
        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === step);
        });
      }
    }
  });

  statements.forEach((stmt, i) => {
    const card = cards[i];

    if (i === 0) {
      gsap.set(stmt, { opacity: 1, y: 0 });
      if (card) gsap.set(card, { opacity: 1, y: 0 });
    } else {
      gsap.set(stmt, { opacity: 0, y: 24 });
      if (card) gsap.set(card, { opacity: 0, y: 16 });

      const prevStmt = statements[i - 1];
      const prevCard = cards[i - 1];

      tl.to([prevStmt, prevCard], {
        opacity: 0,
        y: -24,
        duration: 0.45,
        ease: 'power2.inOut'
      }, `step_${i}`);

      tl.to([stmt, card], {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out'
      }, `step_${i}+=0.15`);
    }

    tl.to({}, { duration: 0.75 });
  });
}

/* ==================================================
   6. SCROLLYTELLING: SERVICIOS PROFESIONALES (AYOCIN NATIVE STICKY)
   ================================================== */
function initChainedFeaturesScrolly() {
  const featuresSection = document.getElementById('features-scrolly-container');
  const featureSteps = document.querySelectorAll('.feature-scrolly-step');
  const imgLayers = document.querySelectorAll('.feature-img-layer');
  const counter = document.querySelector('.scrolly-features-counter');
  const reticle = document.querySelector('.rotated-icon');
  const dots = document.querySelectorAll('.feature-dot');
  const badges = document.querySelectorAll('.feature-step-badge');

  if (!featuresSection || !featureSteps.length) return;

  const totalSteps = featureSteps.length;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: featuresSection,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const activeIdx = Math.min(totalSteps - 1, Math.floor(self.progress * totalSteps));
        if (counter) {
          counter.textContent = `0${activeIdx + 1} / 0${totalSteps}`;
        }
        dots.forEach((dot, idx) => {
          dot.classList.toggle('is-active', idx === activeIdx);
        });
        badges.forEach((badge, idx) => {
          if (idx === activeIdx) {
            badge.classList.add('bg-[#FCF6EC]', 'text-[#211A17]', 'border-[#FCF6EC]', 'font-medium');
            badge.classList.remove('border-dark-token', 'text-dark-muted');
          } else {
            badge.classList.remove('bg-[#FCF6EC]', 'text-[#211A17]', 'border-[#FCF6EC]', 'font-medium');
            badge.classList.add('border-dark-token', 'text-dark-muted');
          }
        });
      }
    }
  });

  featureSteps.forEach((step, i) => {
    const img = imgLayers[i];

    if (i === 0) {
      gsap.set(step, { opacity: 1, y: 0 });
      if (img) gsap.set(img, { opacity: 1 });
    } else {
      gsap.set(step, { opacity: 0, y: 24 });
      if (img) gsap.set(img, { opacity: 0 });

      const prevStep = featureSteps[i - 1];
      const prevImg = imgLayers[i - 1];

      // Card crossfade with subtle vertical slide
      tl.to(prevStep, {
        opacity: 0,
        y: -24,
        duration: 0.45,
        ease: 'power2.inOut'
      }, `feat_${i}`);

      tl.to(step, {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: 'power2.out'
      }, `feat_${i}+=0.15`);

      // Background image simultaneous crossfade (opacity only, no vertical gap!)
      if (prevImg && img) {
        tl.to(prevImg, {
          opacity: 0,
          duration: 0.6,
          ease: 'none'
        }, `feat_${i}`);

        tl.to(img, {
          opacity: 1,
          duration: 0.6,
          ease: 'none'
        }, `feat_${i}`);
      }

      if (reticle) {
        tl.to(reticle, {
          rotation: i * 90,
          duration: 0.6,
          ease: 'power2.out'
        }, `feat_${i}`);
      }
    }

    tl.to({}, { duration: 0.75 });
  });
}

/* ==================================================
   7. SCROLLYTELLING: METRIC COUNTER
   ================================================== */
function initMetricCounterScrolly() {
  const metricNumEl = document.getElementById('scrolly-metric-num');
  const metricSection = document.getElementById('cifras');

  if (!metricNumEl || !metricSection) return;

  ScrollTrigger.create({
    trigger: metricSection,
    start: 'top 75%',
    once: true,
    onEnter: () => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: 100,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          metricNumEl.textContent = `${Math.floor(obj.val)}%`;
        }
      });
    }
  });
}

/* ==================================================
   8. INTERACTIVE ORDER FORM
   ================================================== */
function initOrderForm() {
  const pills = document.querySelectorAll('.service-filter-pill');
  const form = document.getElementById('order-consultation-form');
  const successMsg = document.getElementById('order-form-success');
  const serviceInput = document.getElementById('selected-service-input');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      if (serviceInput) {
        serviceInput.value = pill.getAttribute('data-service') || '';
      }
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (successMsg) {
        successMsg.classList.remove('hidden');
        form.reset();
        pills.forEach((p, i) => {
          if (i === 0) p.classList.add('is-active');
          else p.classList.remove('is-active');
        });
        setTimeout(() => {
          successMsg.classList.add('hidden');
        }, 6000);
      }
    });
  }
}

/* ==================================================
   9. INTERACTIVE CAROUSEL / SLIDER WITH DRAG & PROGRESS
   ================================================== */
function initCarousel() {
  const carousel = document.querySelector('[data-component="carousel"]');
  const row = carousel ? carousel.querySelector('[data-row]') : null;
  const prevBtn = document.querySelector('[data-control="prev"]');
  const nextBtn = document.querySelector('[data-control="next"]');
  const progressBar = document.getElementById('carousel-progress-bar');
  const counterLabel = document.getElementById('carousel-counter-label');

  if (!row) return;

  const slides = row.querySelectorAll('article');
  const totalSlides = slides.length;

  const updateCarouselProgress = () => {
    const maxScroll = row.scrollWidth - row.clientWidth;
    const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, row.scrollLeft / maxScroll)) : 0;
    if (progressBar) {
      const minWidth = 100 / Math.max(1, totalSlides);
      const currentPercent = minWidth + ratio * (100 - minWidth);
      progressBar.style.width = `${currentPercent}%`;
    }
    if (counterLabel && totalSlides > 0) {
      const idx = Math.min(totalSlides, Math.max(1, Math.round(ratio * (totalSlides - 1)) + 1));
      counterLabel.textContent = `0${idx} / 0${totalSlides} OBRAS`;
    }
  };

  row.addEventListener('scroll', updateCarouselProgress, { passive: true });
  window.addEventListener('resize', updateCarouselProgress);
  updateCarouselProgress();

  const getScrollStep = () => {
    const firstSlide = slides[0];
    return firstSlide ? firstSlide.offsetWidth + 32 : 440;
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      row.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      row.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });
  }

  // Mouse Drag-to-Scroll
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;

  row.addEventListener('mousedown', (e) => {
    isDown = true;
    row.classList.add('is-dragging');
    startX = e.pageX - row.offsetLeft;
    scrollLeftStart = row.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
    row.classList.remove('is-dragging');
  });

  row.addEventListener('mouseleave', () => {
    isDown = false;
    row.classList.remove('is-dragging');
  });

  row.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - row.offsetLeft;
    const walk = (x - startX) * 1.4;
    row.scrollLeft = scrollLeftStart - walk;
  });
}

/* ==================================================
   10. NUMBERED FAQ ACCORDION
   ================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');

  faqItems.forEach((item) => {
    item.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      faqItems.forEach((other) => {
        other.classList.remove('is-open');
        const icon = other.querySelector('.faq-icon');
        if (icon) icon.textContent = '+';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        const icon = item.querySelector('.faq-icon');
        if (icon) icon.textContent = '×';
      }
    });
  });
}
