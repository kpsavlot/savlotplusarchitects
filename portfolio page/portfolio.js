import { createObserver, initLenis, initLoader, initWhatsApp } from '../common.js';

// ── Lenis smooth scroll ──
initLenis();

// ── Floating header on scroll up ──
(function () {
  const original = document.querySelector('.portfolio-header');
  const grid = document.querySelector('.portfolio-filter-parent');
  if (!original || !grid || !window.lenis) return;
  const floating = original.cloneNode(true);
  floating.classList.add('floating-header');
  floating.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  document.body.appendChild(floating);
  const gridTop = grid.getBoundingClientRect().top + window.lenis.animatedScroll;
  window.lenis.on('scroll', (e) => {
    if (e.animatedScroll > gridTop) {
      floating.classList.toggle('visible', e.direction < 0);
    } else {
      floating.classList.remove('visible');
    }
  });
})();

// ── Set hero-parent height per formula ──
(function () {
  const parent = document.querySelector('.portfolio-hero-parent');
  const hero = document.querySelector('.portfolio-hero');
  const filter = document.querySelector('.portfolio-filter');
  if (!parent || !hero || !filter) return;
  function sync() {
    const heroH = hero.offsetHeight;
    const filterH = filter.offsetHeight;
    parent.style.height = `calc(200svh - ${heroH}px + 50px)`;
    hero.style.marginBottom = filterH + 'px';
    filter.style.top = heroH + 'px';
  }
  sync();
  window.addEventListener('resize', sync);
})();

// ── Mobile Menu Toggle ──
document.addEventListener('click', function(e) {
  const wrapper = e.target.closest('.hamburger-wrapper');
  if (wrapper) {
    e.stopPropagation();
    wrapper.closest('.pill-menu')?.classList.toggle('active');
    return;
  }
  const parentLink = e.target.closest('.menu-item-has-children > a');
  if (parentLink) {
    e.preventDefault();
    e.stopPropagation();
    parentLink.parentElement.classList.toggle('active');
    return;
  }
  document.querySelector('.pill-menu')?.classList.remove('active');
  document.querySelectorAll('.menu-item-has-children.active').forEach(el => el.classList.remove('active'));
});

// ── Header animation ──
(function () {
  const logo = document.querySelector('.logo');
  if (!logo) return;
  const obs = createObserver(([entry]) => {
    if (entry.isIntersecting) logo.style.opacity = '1';
  }, { threshold: 0.1 });
  obs.observe(logo);
  logo.style.opacity = '0';
  logo.style.transition = 'opacity 0.8s ease';
})();

// ── Portfolio heading animation ──
(function () {
  const heading = document.querySelector('.the-portfolio');
  if (!heading) return;
  heading.style.opacity = '0';
  heading.style.transform = 'translateY(40px)';
  heading.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  const obs = createObserver(([entry]) => {
    if (entry.isIntersecting) {
      heading.style.opacity = '1';
      heading.style.transform = 'translateY(0)';
    }
  }, { threshold: 0.3 });
  obs.observe(heading);
})();

// ── Card reveal animation (per card) ──
const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      const cp = entry.target.querySelector('[class^="content-parent"]');
      if (cp) cp.classList.add('revealed');
      cardObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

(function () {
  const cards = document.querySelectorAll('.portfolio-card-grid > section');
  if (!cards.length) return;
  cards.forEach(card => cardObserver.observe(card));
})();

// ── Filter interaction ──
(function () {
  const mainBtns = document.querySelectorAll('.main-filter-btn');
  const subBtns = document.querySelectorAll('.sub-filter-btn');
  const cards = document.querySelectorAll('.portfolio-card-grid > section');
  if (!mainBtns.length || !subBtns.length) return;

  let activeMain = 'interior';
  let activeSub = 'all';

  function filterCards() {
    const visible = [];
    cards.forEach((card, i) => {
      card.classList.remove('revealed');
      const cp = card.querySelector('[class^="content-parent"]');
      if (cp) cp.classList.remove('revealed');
      const main = card.dataset.main;
      const sub = card.dataset.sub;
      const matchMain = main === activeMain;
      const matchSub = activeSub === 'all' || sub === activeSub;
      if (matchMain && matchSub) visible.push(i);
    });

    cards.forEach(c => { c.style.display = 'none'; });

    visible.forEach(cardIndex => {
      const card = cards[cardIndex];
      card.style.display = '';
      cardObserver.observe(card);
    });
  }

  function setActiveMain(btn) {
    mainBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeMain = btn.dataset.filter;
    filterCards();
  }

  function setActiveSub(btn) {
    subBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeSub = btn.dataset.filter;
    filterCards();
  }

  mainBtns.forEach(btn => btn.addEventListener('click', () => setActiveMain(btn)));
  subBtns.forEach(btn => btn.addEventListener('click', () => setActiveSub(btn)));

  filterCards();
})();

// ── Footer glow reveal ──
(function () {
  const footer = document.querySelector('.footer-section');
  if (!footer) return;

  const logo = document.querySelector('.animated-logo');
  const fadeEls = footer.querySelectorAll('.savlot-architects2, .kailash-m-savlot2, .contacts, .footer-links, .termsconditions');

  let animated = false;

  function onScroll() {
    if (animated) return;
    const rect = footer.getBoundingClientRect();
    const vh = window.innerHeight;
    if (rect.top < vh * 0.85) {
      animated = true;
      if (logo) { logo.style.opacity = '1'; logo.style.animation = 'zoomIn 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'; }
      fadeEls.forEach((el, i) => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        el.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      });
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  }

  if (logo) { logo.style.opacity = '0'; }
  fadeEls.forEach((el) => { el.style.opacity = '0'; el.style.transform = 'translateY(15px)'; });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();

// ── Loading screen ──
initLoader();

// ── WhatsApp Popup ──
initWhatsApp();

// ── Portfolio card navigation ──
(function () {
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-id]');
    if (!link) return;
    e.preventDefault();
    var id = link.getAttribute('data-id');
    var href = link.getAttribute('href');
    if (href && id) {
      window.location.href = href + '?id=' + id;
    }
  });
})();
