// A&D Home Care & Aging with Grace AFH — shared behavior

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('in'));
}

// Gallery lightbox
const figures = Array.from(document.querySelectorAll('.gallery-grid figure'));
const lightbox = document.querySelector('.lightbox');
if (figures.length && lightbox) {
  const lbImg = lightbox.querySelector('img');
  const lbCaption = lightbox.querySelector('.caption');
  let current = 0;
  let lastFocus = null;

  function show(i) {
    current = (i + figures.length) % figures.length;
    const fig = figures[current];
    const img = fig.querySelector('img');
    lbImg.src = fig.dataset.full || img.src;
    lbImg.alt = img.alt;
    lbCaption.textContent = fig.querySelector('figcaption').textContent;
  }

  function openLb(i) {
    lastFocus = document.activeElement;
    show(i);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lb-close').focus();
  }

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  figures.forEach((fig, i) => {
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.addEventListener('click', () => openLb(i));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(i); }
    });
  });

  lightbox.querySelector('.lb-close').addEventListener('click', closeLb);
  lightbox.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });
}

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
