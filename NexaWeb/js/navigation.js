/* ============================================================
   NexaWeb Solutions — navigation.js
   Sticky navbar, active page link, mobile menu, focus trap
   ============================================================ */
'use strict';
import { trapFocus } from './utils.js';

/* ── Navbar Scroll State ──────────────────────────────────── */
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on page load
}

/* ── Active Page Link ─────────────────────────────────────── */
function initActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .mobile-menu__link').forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.split('/').pop();
    const isHome = (linkFile === 'index.html' || linkFile === '') &&
                   (currentPath === 'index.html' || currentPath === '');
    if (isHome || (linkFile && linkFile !== 'index.html' && currentPath === linkFile)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ── Mobile Menu ──────────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const closeBtn   = document.querySelector('.mobile-menu__close');
  if (!hamburger || !mobileMenu) return;

  let releaseFocus = null;
  let isOpen = false;

  function openMenu() {
    isOpen = true;
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileMenu.removeAttribute('hidden');
    // Move focus into menu
    const firstLink = mobileMenu.querySelector('.mobile-menu__link');
    if (firstLink) {
      setTimeout(() => firstLink.focus(), 50);
    }
    releaseFocus = trapFocus(mobileMenu);
  }

  function closeMenu() {
    isOpen = false;
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (releaseFocus) {
      releaseFocus();
      releaseFocus = null;
    }
    hamburger.focus();
  }

  hamburger.addEventListener('click', () => {
    if (isOpen) closeMenu(); else openMenu();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMenu();
  });

  // Close when a link is clicked
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ── Init ─────────────────────────────────────────────────── */
export function initNavigation() {
  initNavbarScroll();
  initActiveLink();
  initMobileMenu();
}