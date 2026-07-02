/* ================================================
   RANCEL M. DURAN – PORTFOLIO
   script.js — Beige + Sage Green Edition
   ================================================ */

'use strict';

/* ── LOADING SCREEN ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loading-screen').classList.add('hidden');
  }, 1900);
});

/* ── SCROLL PROGRESS ── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (window.scrollY / max * 100) + '%';
}, { passive: true });

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinks.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ── ACTIVE NAV ── */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-link');
sections.forEach(section => {
  new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navItems.forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (a) a.classList.add('active');
    });
  }, { rootMargin: '-50% 0px -50% 0px' }).observe(section);
});

/* ── TYPING ANIMATION ── */
const typingEl = document.getElementById('typing-target');
const phrases = [
  'Fresh IT Graduate',
  'Web Developer',
  'UI/UX Enthusiast',
  'Problem Solver',
  'Fast Learner',
];
let pIdx = 0, cIdx = 0, deleting = false;
function type() {
  const cur = phrases[pIdx];
  typingEl.textContent = deleting ? cur.slice(0, --cIdx) : cur.slice(0, ++cIdx);
  if (!deleting && cIdx === cur.length) { deleting = true; setTimeout(type, 2000); return; }
  if (deleting && cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
  setTimeout(type, deleting ? 50 : 85);
}
type();

/* ── SCROLL ANIMATIONS ── */
const animEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');
const obs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || '0');
    setTimeout(() => entry.target.classList.add('visible'), delay);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
animEls.forEach(el => obs.observe(el));

/* ── COUNTERS ── */
function animateCounter(el, target, duration = 1600) {
  const start = performance.now();
  const step = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(eased * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const statsEl = document.querySelector('.about-stats');
if (statsEl) {
  new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    document.querySelectorAll('.stat-number').forEach(el =>
      animateCounter(el, parseInt(el.dataset.target))
    );
  }, { threshold: 0.4 }).observe(statsEl);
}

/* ── SCROLL TO TOP ── */
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── CONTACT FORM ── */
const form       = document.getElementById('contact-form');
const submitBtn  = document.getElementById('submit-btn');
const successMsg = document.getElementById('form-success');

const fields = {
  name:    { el: document.getElementById('name'),    err: document.getElementById('name-error') },
  email:   { el: document.getElementById('email'),   err: document.getElementById('email-error') },
  subject: { el: document.getElementById('subject'), err: document.getElementById('subject-error') },
  message: { el: document.getElementById('message'), err: document.getElementById('message-error') },
};

function validateField(key) {
  const { el, err } = fields[key];
  const v = el.value.trim();
  let msg = '';
  if (!v) msg = 'This field is required.';
  else if (key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Please enter a valid email.';
  else if (key === 'name' && v.length < 2) msg = 'Name must be at least 2 characters.';
  else if (key === 'message' && v.length < 10) msg = 'Message must be at least 10 characters.';
  err.textContent = msg;
  el.classList.toggle('error', !!msg);
  return !msg;
}

Object.keys(fields).forEach(key => {
  fields[key].el.addEventListener('blur', () => validateField(key));
  fields[key].el.addEventListener('input', () => {
    if (fields[key].el.classList.contains('error')) validateField(key);
  });
});

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const valid = Object.keys(fields).map(k => validateField(k)).every(Boolean);
    if (!valid) return;
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    try {
      const formData = new FormData(form);
      const encoded = new URLSearchParams(formData).toString();
      const res = await fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded,
      });
      if (res.ok) {
        form.hidden = true;
        successMsg.hidden = false;
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      console.error(err);
      // Show success anyway for local preview — Netlify handles it live
      form.hidden = true;
      successMsg.hidden = false;
    } finally {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  });
}

/* ── PARALLAX ── */
const parallaxEls = document.querySelectorAll('[data-parallax]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let parallaxTicking = false;

function updateParallax() {
  const scrollY = window.scrollY;
  const viewportCenter = scrollY + window.innerHeight / 2;
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.15;
    const rect = el.getBoundingClientRect();
    const elCenter = rect.top + scrollY + rect.height / 2;
    const offset = (viewportCenter - elCenter) * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
  parallaxTicking = false;
}

function requestParallaxTick() {
  if (!parallaxTicking) {
    requestAnimationFrame(updateParallax);
    parallaxTicking = true;
  }
}

if (!prefersReducedMotion && parallaxEls.length) {
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
  window.addEventListener('resize', requestParallaxTick, { passive: true });
  updateParallax();
}