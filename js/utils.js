/* ============================================================
   NexaWeb Solutions — utils.js
   Shared utility helpers: scroll observer, counter, debounce
   ============================================================ */

'use strict';

/* ── Debounce ─────────────────────────────────────────────── */
/**
 * Returns a debounced version of fn that delays execution
 * until wait ms have passed since the last call.
 */
export function debounce(fn, wait = 200) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/* ── Throttle ─────────────────────────────────────────────── */
export function throttle(fn, limit = 100) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

/* ── Scroll Reveal Observer ───────────────────────────────── */
/**
 * Watches elements with .reveal / .reveal-left / .reveal-right
 * and adds .revealed when they enter the viewport.
 */
export function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // Immediately show everything
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
      .forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
}

/* ── Statistics Counter Animation ────────────────────────── */
/**
 * Animates a number from 0 to its target value.
 * Reads data-target attribute from element.
 */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
  const start = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function update(timestamp) {
    const elapsed = timestamp - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutQuart(progress);
    const current = target * eased;

    el.textContent = prefix + current.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = prefix + target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Sets up IntersectionObserver to trigger counter animation
 * when stat elements enter the viewport.
 */
export function initCounters() {
  const counters = document.querySelectorAll('[data-target]');
  if (!counters.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    counters.forEach(el => {
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      el.textContent = prefix + parseFloat(el.dataset.target).toFixed(decimals) + suffix;
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ── Expertise Bar Animation ──────────────────────────────── */
export function initExpertiseBars() {
  const bars = document.querySelectorAll('.expertise__bar-fill[data-width]');
  if (!bars.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    bars.forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width + '%';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => {
    bar.style.width = '0';
    observer.observe(bar);
  });
}

/* ── Trap Focus (for mobile menu) ────────────────────────── */
export function trapFocus(element) {
  const focusableSelectors = [
    'a[href]', 'button:not([disabled])',
    'input:not([disabled])', 'textarea:not([disabled])',
    'select:not([disabled])', '[tabindex]:not([tabindex="-1"])'
  ];

  const focusable = Array.from(
    element.querySelectorAll(focusableSelectors.join(','))
  ).filter(el => !el.closest('[hidden]'));

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  element.addEventListener('keydown', handleKeydown);

  return () => element.removeEventListener('keydown', handleKeydown);
}

/* ── Smooth Scroll to Anchor ─────────────────────────────── */
export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--navbar-height')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}