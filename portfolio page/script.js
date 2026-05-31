// ── Utility: Intersection Observer ──
function createObserver(callback, options = {}) {
  if (Array.isArray(callback)) callback = callback[0];
  return new IntersectionObserver(callback, {
    threshold: options.threshold || 0.15,
    rootMargin: options.rootMargin || '0px',
  });
}

// ── Lenis smooth scroll ──
(function () {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // ── Custom scrollbar ──
  const scrollTrack = document.getElementById('scroll-track');
  const scrollThumb = document.getElementById('scroll-thumb');
  if (scrollTrack && scrollThumb && lenis) {
    let hideTimeout, isVisible = false;
    function showThumb() {
      scrollThumb.classList.add('visible');
      isVisible = true;
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => { scrollThumb.classList.remove('visible'); isVisible = false; }, 1000);
    }
    function updateThumb() {
      const progress = lenis.progress;
      const trackH = scrollTrack.clientHeight;
      const thumbH = scrollThumb.clientHeight;
      if (!thumbH) { setThumbSize(); return; }
      const maxTop = trackH - thumbH;
      scrollThumb.style.top = `${progress * maxTop}px`;
    }
    function setThumbSize() {
      const viewportH = window.innerHeight;
      const contentH = document.documentElement.scrollHeight;
      const ratio = viewportH / contentH;
      const trackH = scrollTrack.clientHeight;
      const thumbH = Math.max(30, trackH * ratio);
      scrollThumb.style.height = `${thumbH}px`;
    }
    setThumbSize();
    window.addEventListener('resize', setThumbSize);
    lenis.on('scroll', () => { updateThumb(); showThumb(); });

    let isDragging = false;
    scrollThumb.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = scrollTrack.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const trackH = rect.height;
      const thumbH = scrollThumb.clientHeight;
      const progress = Math.max(0, Math.min(1, (y - thumbH / 2) / (trackH - thumbH)));
      lenis.scrollTo(lenis.limit * progress, { immediate: false, duration: 0.5 });
    });
    document.addEventListener('mouseup', () => { isDragging = false; });

    scrollTrack.addEventListener('click', (e) => {
      if (e.target === scrollThumb) return;
      const rect = scrollTrack.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const trackH = rect.height;
      const thumbH = scrollThumb.clientHeight;
      const progress = Math.max(0, Math.min(1, (y - thumbH / 2) / (trackH - thumbH)));
      lenis.scrollTo(lenis.limit * progress, { immediate: false, duration: 0.5 });
    });
  }

  window.lenis = lenis;
})();

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
  const blanks = [
    { el: document.querySelector('.blank-card'), row: 1 },
    { el: document.querySelector('.blank-card2'), row: 2 },
    { el: document.querySelector('.blank-card3'), row: 3 },
    { el: document.querySelector('.blank-card4'), row: 4 },
  ];
  const cardSlots = [
    { col: 1, row: 1 }, { col: 2, row: 1 },
    { col: 1, row: 2 }, { col: 3, row: 2 },
    { col: 1, row: 3 }, { col: 2, row: 3 },
    { col: 2, row: 4 }, { col: 3, row: 4 },
  ];
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

    cards.forEach(c => { c.style.display = 'none'; c.style.gridColumn = ''; c.style.gridRow = ''; });
    blanks.forEach(b => { b.el.style.display = 'none'; });

    void document.body.offsetHeight;

    const usedRows = new Set();
    visible.forEach((cardIndex, slotIndex) => {
      const card = cards[cardIndex];
      card.style.display = '';
      if (slotIndex < cardSlots.length) {
        const slot = cardSlots[slotIndex];
        card.style.gridColumn = String(slot.col);
        card.style.gridRow = String(slot.row);
        usedRows.add(slot.row);
      }
      cardObserver.observe(card);
    });

    blanks.forEach(b => {
      b.el.style.display = usedRows.has(b.row) ? '' : 'none';
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
window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(function() { if (loader.parentNode) loader.remove(); }, 800);
  }
});
