/* ============================================================
   NexaWeb Solutions — form.js
   Contact form: validation, submission, success & error states
   ============================================================ */

'use strict';

/* ── Validation Rules ─────────────────────────────────────── */
const RULES = {
  name: {
    required: true,
    minLength: 2,
    message: 'Please enter your full name (at least 2 characters).'
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address.'
  },
  company: {
    required: false
  },
  service: {
    required: true,
    message: 'Please select a service you\'re interested in.'
  },
  budget: {
    required: false
  },
  message: {
    required: true,
    minLength: 20,
    message: 'Please provide more detail (at least 20 characters).'
  }
};

/* ── Helpers ──────────────────────────────────────────────── */
function getField(form, name) {
  return form.querySelector(`[name="${name}"]`);
}

function getError(field) {
  return field.closest('.form__group')?.querySelector('.form__error');
}

function showError(field, message) {
  field.classList.add('error');
  field.setAttribute('aria-invalid', 'true');
  const err = getError(field);
  if (err) {
    err.textContent = message;
    err.classList.add('visible');
    err.setAttribute('role', 'alert');
  }
}

function clearError(field) {
  field.classList.remove('error');
  field.removeAttribute('aria-invalid');
  const err = getError(field);
  if (err) {
    err.textContent = '';
    err.classList.remove('visible');
    err.removeAttribute('role');
  }
}

function validateField(name, value) {
  const rule = RULES[name];
  if (!rule) return true;

  if (rule.required && !value.trim()) {
    return rule.message || `${name} is required.`;
  }

  if (value.trim() && rule.minLength && value.trim().length < rule.minLength) {
    return rule.message;
  }

  if (value.trim() && rule.pattern && !rule.pattern.test(value.trim())) {
    return rule.message;
  }

  return true;
}

/* ── Real-time Field Validation ───────────────────────────── */
function attachRealtimeValidation(form) {
  Object.keys(RULES).forEach(name => {
    const field = getField(form, name);
    if (!field) return;

    field.addEventListener('blur', () => {
      const result = validateField(name, field.value);
      if (result !== true) {
        showError(field, result);
      } else {
        clearError(field);
      }
    });

    field.addEventListener('input', () => {
      if (field.classList.contains('error')) {
        const result = validateField(name, field.value);
        if (result === true) clearError(field);
      }
    });
  });
}

/* ── Full Form Validation ─────────────────────────────────── */
function validateForm(form) {
  let valid = true;
  let firstError = null;

  Object.keys(RULES).forEach(name => {
    const field = getField(form, name);
    if (!field) return;

    const result = validateField(name, field.value);
    if (result !== true) {
      showError(field, result);
      if (!firstError) firstError = field;
      valid = false;
    } else {
      clearError(field);
    }
  });

  if (firstError) {
    firstError.focus();
  }

  return valid;
}

/* ── Show Success ─────────────────────────────────────────── */
function showSuccess(form) {
  const formBody  = form.querySelector('.contact__form-body');
  const successEl = form.querySelector('.form__success');

  if (formBody)  formBody.style.display  = 'none';
  if (successEl) successEl.classList.add('visible');

  // Announce for screen readers
  if (successEl) successEl.setAttribute('aria-live', 'polite');
}

/* ── Simulate Submit (since no backend) ──────────────────── */
function simulateSubmit(form, btn) {
  btn.classList.add('loading');
  btn.disabled = true;
  btn.setAttribute('aria-label', 'Sending message…');

  return new Promise(resolve => {
    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;
      btn.setAttribute('aria-label', 'Send message');
      resolve();
    }, 1800);
  });
}

/* ── Init Contact Form ────────────────────────────────────── */
export function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  attachRealtimeValidation(form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    const submitBtn = form.querySelector('[type="submit"]');
    await simulateSubmit(form, submitBtn);
    showSuccess(form);
  });
}