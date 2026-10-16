const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

function toggleMenu(forceOpen) {
  const isOpen = typeof forceOpen === 'boolean'
    ? forceOpen
    : navToggle.getAttribute('aria-expanded') !== 'true';

  navToggle.setAttribute('aria-expanded', String(isOpen));
  navMenu.classList.toggle('is-open', isOpen);
}

navToggle.addEventListener('click', () => toggleMenu());

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
    toggleMenu(false);
    navToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (navMenu.classList.contains('is-open') && !event.target.closest('nav')) {
    toggleMenu(false);
  }
});

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function smoothScrollTo(event) {
  const hash = event.currentTarget.getAttribute('href');
  const target = document.querySelector(hash);
  if (!target) return;

  event.preventDefault();
  target.scrollIntoView({ behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
  history.pushState(null, '', hash);

  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1');
  }
  target.focus({ preventScroll: true });

  toggleMenu(false);
}

document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
  link.addEventListener('click', smoothScrollTo);
});

const filterButtons = document.querySelectorAll('.project-filters button');
const projectCards = document.querySelectorAll('#projects article');
const filterStatus = document.getElementById('filter-status');

function filterProjects(category) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const categories = card.dataset.category.split(' ');
    const matches = category === 'all' || categories.includes(category);
    card.hidden = !matches;
    if (matches) visibleCount++;
  });

  filterButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.filter === category));
  });

  filterStatus.textContent =
    `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}`;
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => filterProjects(button.dataset.filter));
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const lightboxClose = lightbox.querySelector('.lightbox-close');
let lastTrigger = null;

function openLightbox(trigger) {
  const image = trigger.querySelector('img');
  const caption = trigger.closest('figure').querySelector('figcaption');

  lightboxImage.src = image.src;
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = caption ? caption.textContent : '';

  lastTrigger = trigger;
  lightbox.showModal();
}

function closeLightbox() {
  lightbox.close();
}

document.querySelectorAll('.lightbox-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => openLightbox(trigger));
});

lightboxClose.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

lightbox.addEventListener('close', () => {
  if (lastTrigger) lastTrigger.focus();
});

const contactForm = document.querySelector('#contact form');
const formStatus = document.getElementById('form-status');
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  name: (value) => (value.trim() ? '' : 'Please enter your name.'),
  email: (value) => {
    if (!value.trim()) return 'Please enter your email address.';
    if (!emailPattern.test(value.trim())) return 'Please enter a valid email address, like name@example.com.';
    return '';
  },
  message: (value) => {
    if (!value.trim()) return 'Please enter a message.';
    if (value.trim().length < 10) return 'Your message should be at least 10 characters.';
    return '';
  },
};

function validateField(field) {
  const error = validators[field.name](field.value);
  const errorElement = document.getElementById(`${field.id}-error`);

  errorElement.textContent = error;
  field.setAttribute('aria-invalid', String(Boolean(error)));
  return !error;
}

function handleSubmit(event) {
  event.preventDefault();
  formStatus.textContent = '';

  const fields = Array.from(contactForm.querySelectorAll('input, textarea'));
  fields.forEach((field) => { field.dataset.touched = 'true'; });
  const invalidFields = fields.filter((field) => !validateField(field));

  if (invalidFields.length > 0) {
    invalidFields[0].focus();
    return;
  }

  formStatus.textContent = 'Thanks! Your message has been sent.';
  contactForm.reset();
  fields.forEach((field) => {
    field.removeAttribute('aria-invalid');
    delete field.dataset.touched;
  });
}

contactForm.querySelectorAll('input, textarea').forEach((field) => {
  field.addEventListener('blur', () => {
    if (field.value.trim()) field.dataset.touched = 'true';
    if (field.dataset.touched) validateField(field);
  });

  field.addEventListener('input', () => {
    formStatus.textContent = '';
    if (field.dataset.touched) validateField(field);
  });
});

contactForm.addEventListener('submit', handleSubmit);
