/* ============================================================
   NexaWeb Solutions — main.js
   Entry point: imports and initializes all modules
   ============================================================ */
'use strict';

import { initNavigation }   from './navigation.js';
import { initContactForm }  from './form.js';
import {
  initScrollReveal,
  initCounters,
  initExpertiseBars,
  initSmoothScroll
} from './utils.js';

/* ── FAQ Accordion ────────────────────────────────────────── */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    // Set initial ARIA
    btn.setAttribute('aria-expanded', 'false');
    const answerId = 'faq-answer-' + Math.random().toString(36).slice(2, 7);
    answer.id = answerId;
    btn.setAttribute('aria-controls', answerId);

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn    = other.querySelector('.faq__question');
          const otherAnswer = other.querySelector('.faq__answer');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle this
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });

    // Keyboard support
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });
}

/* ── Active Nav Section Highlight (scroll spy) ───────────── */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__link[href*="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && href.endsWith('#' + id)) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => observer.observe(s));
}

/* ── Initialise on DOM Ready ─────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollReveal();
  initCounters();
  initExpertiseBars();
  initSmoothScroll();
  initFAQ();
  initContactForm();

  // Page-specific init
  const page = document.body.dataset.page;
  if (page === 'home') {
    // Any home-specific logic
  }
});