// ── Utility: Intersection Observer ──
function createObserver(callback, options = {}) {
  if (Array.isArray(callback)) callback = callback[0];
  return new IntersectionObserver(callback, {
    threshold: options.threshold || 0.15,
    rootMargin: options.rootMargin || '0px',
  });
}

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

// ── Project Data ──
const projects = {
  1: {
    hero: './public/project-bg@2x.png',
    title: 'PROJECT - 1',
    location: 'SHILAJ, 2021',
    brief: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Balancing an expansive, sun-lit luxury layout within a high-density, extreme-heat urban plot.' },
      { heading: 'THE SOLUTION', text: 'A central, double-height cooling courtyard acting as the thermal engine of the entire home.' },
      { heading: 'THE PALETTE', text: 'A deliberate pairing of raw architectural concrete with polished local Kota stone surfaces.' },
    ],
    stats: [
      { value: '-6\u00b0C', label: 'Natural Cooling Drop' },
      { value: '35%', label: 'Energy Bill Reduction' },
      { value: '85%', label: 'Daylight Autonomy' },
    ],
    video: { poster: './public/28-1@2x.png', sources: ['./public/project-video.mp4', './public/project-video.webm'] },
    gallery: ['./public/Image1@2x.png', './public/Image2@2x.png', './public/Image@2x.png'],
  },
};

// ── Render Project ──
function renderProject(id) {
  const data = projects[id];
  if (!data) return;

  document.getElementById('hero-image').src = data.hero;
  document.getElementById('hero-image').alt = data.title;
  document.getElementById('project-title').textContent = data.title;
  document.getElementById('project-location').textContent = data.location;
  document.getElementById('brief-text').textContent = data.brief || '';

  const pointsEl = document.getElementById('points-section');
  pointsEl.innerHTML = '';
  if (data.points && data.points.length) {
    data.points.forEach(p => {
      const div = document.createElement('div');
      div.className = 'point-item';
      div.innerHTML = `<h2 class="point-heading">${p.heading}</h2><p class="point-text">${p.text}</p>`;
      pointsEl.appendChild(div);
    });
    pointsEl.classList.remove('hidden-section');
  } else {
    pointsEl.classList.add('hidden-section');
  }

  const statsEl = document.getElementById('stats-section');
  statsEl.innerHTML = '';
  if (data.stats && data.stats.length) {
    data.stats.forEach(s => {
      const div = document.createElement('div');
      div.className = 'stat-card';
      div.innerHTML = `<h1 class="stat-value">${s.value}</h1><h2 class="stat-label">${s.label}</h2>`;
      statsEl.appendChild(div);
    });
    statsEl.classList.remove('hidden-section');
  } else {
    statsEl.classList.add('hidden-section');
  }

  const videoEl = document.getElementById('project-video');
  if (data.video) {
    const video = document.getElementById('video-element');
    video.innerHTML = '';
    data.video.sources.forEach(src => {
      const s = document.createElement('source');
      s.src = src;
      s.type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
      video.appendChild(s);
    });
    video.poster = data.video.poster || '';
    video.load();
    videoEl.classList.remove('hidden-section');
  } else {
    videoEl.classList.add('hidden-section');
  }

  const galleryEl = document.getElementById('project-gallery');
  galleryEl.innerHTML = '';
  if (data.gallery && data.gallery.length) {
    data.gallery.forEach(src => {
      const img = document.createElement('img');
      img.className = 'gallery-image';
      img.src = src;
      img.alt = '';
      img.loading = 'lazy';
      galleryEl.appendChild(img);
    });
    galleryEl.classList.remove('hidden-section');
  } else {
    galleryEl.classList.add('hidden-section');
  }
}

// ── Get project ID from URL ──
const params = new URLSearchParams(window.location.search);
const projectId = params.get('id') || '1';
renderProject(projectId);

// ── Gallery drag scroll + custom cursor ──
(function () {
  const track = document.getElementById('project-gallery');
  if (!track) return;
  const wrapper = track.closest('.gallery-wrapper');
  if (!wrapper) return;
  const gap = 30;
  const leftArrow = '<svg viewBox="0 0 24 24"><path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const rightArrow = '<svg viewBox="0 0 24 24"><path d="M9 6L15 12L9 18" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const cursor = document.createElement('div');
  cursor.className = 'gallery-cursor';
  cursor.innerHTML = rightArrow;
  document.body.appendChild(cursor);
  let isDragging = false, startX = 0, startTranslate = 0, moved = false, translateX = 0;

  function step() {
    const img = track.querySelector('.gallery-image');
    return img ? img.offsetWidth + gap : 860;
  }

  function setTranslate(x) {
    translateX = Math.min(0, Math.max(x, -(track.scrollWidth - wrapper.clientWidth)));
    track.style.transform = 'translateX(' + translateX + 'px)';
  }

  wrapper.addEventListener('mouseenter', () => { cursor.classList.add('visible'); track.style.cursor = 'none'; });
  wrapper.addEventListener('mouseleave', () => { cursor.classList.remove('visible'); track.style.cursor = ''; isDragging = false; });
  wrapper.addEventListener('mousemove', e => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    cursor.innerHTML = x < rect.width / 2 ? leftArrow : rightArrow;
    cursor.style.left = (e.clientX - 50) + 'px';
    cursor.style.top = (e.clientY - 50) + 'px';
    if (isDragging) {
      setTranslate(startTranslate + (e.clientX - startX));
      if (Math.abs(e.clientX - startX) > 10) moved = true;
    }
  });
  wrapper.addEventListener('mousedown', e => { isDragging = true; startX = e.clientX; startTranslate = translateX; moved = false; e.preventDefault(); });
  document.addEventListener('mouseup', () => {
    if (isDragging && !moved) {
      const rect = wrapper.getBoundingClientRect();
      const x = startX - rect.left;
      const target = translateX + (x < rect.width / 2 ? step() : -step());
      track.style.transition = 'transform 0.4s ease';
      setTranslate(target);
      track.addEventListener('transitionend', function h() { track.style.transition = ''; track.removeEventListener('transitionend', h); });
    }
    isDragging = false;
  });
})();

// ── Video custom cursor ──
(function () {
  const video = document.getElementById('video-element');
  if (!video) return;
  const wrapper = video.closest('.video-wrapper');
  if (!wrapper) return;
  const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="white"/></svg>';
  const cursor = document.createElement('div');
  cursor.className = 'video-cursor';
  cursor.innerHTML = playIcon;
  document.body.appendChild(cursor);

  let activated = false;
  let seeking = false;
  let hideTimer = null;
  const BAR = 45;

  function isBar(e) {
    if (!video.hasAttribute('controls')) return false;
    const b = wrapper.getBoundingClientRect();
    return e.clientY - b.top > b.height - BAR;
  }

  function s() { cursor.classList.add('visible'); video.style.cursor = 'none'; }
  function h() { cursor.classList.remove('visible'); video.style.cursor = ''; }

  wrapper.addEventListener('mouseenter', e => {
    if (!video.paused || isBar(e)) return;
    s();
  });
  wrapper.addEventListener('mouseleave', h);
  wrapper.addEventListener('mousemove', e => {
    cursor.style.left = (e.clientX - 50) + 'px';
    cursor.style.top = (e.clientY - 50) + 'px';
    if (!video.paused) { h(); return; }
    if (isBar(e)) { h(); return; }
    s();
  });

  video.addEventListener('click', () => {
    if (!activated) {
      activated = true;
      video.setAttribute('controls', '');
      video.play().catch(() => {});
      return;
    }
    if (!video.hasAttribute('controls') && video.paused && !seeking) {
      video.setAttribute('controls', '');
      video.play().catch(() => {});
    }
  });

  video.addEventListener('seeking', () => { seeking = true; clearTimeout(hideTimer); });
  video.addEventListener('seeked', () => { seeking = false; });
  video.addEventListener('play', () => { clearTimeout(hideTimer); h(); });
  video.addEventListener('pause', () => {
    if (seeking) return;
    hideTimer = setTimeout(() => {
      if (seeking || !video.paused) return;
      video.removeAttribute('controls');
      s();
    }, 80);
  });
  video.addEventListener('ended', () => {
    clearTimeout(hideTimer);
    video.removeAttribute('controls');
    s();
  });
})();

// ── Lenis smooth scroll ──
(function () {
  if (typeof Lenis === 'undefined') return;
  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  const scrollTrack = document.getElementById('scroll-track');
  const scrollThumb = document.getElementById('scroll-thumb');
  if (scrollTrack && scrollThumb && lenis) {
    let hideTimeout;
    function showThumb() {
      scrollThumb.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => scrollThumb.classList.remove('visible'), 1000);
    }
    function updateThumb() {
      const progress = lenis.progress;
      const trackH = scrollTrack.clientHeight;
      const thumbH = scrollThumb.clientHeight;
      if (!thumbH) { setThumbSize(); return; }
      scrollThumb.style.top = `${progress * (trackH - thumbH)}px`;
    }
    function setThumbSize() {
      const ratio = window.innerHeight / document.documentElement.scrollHeight;
      scrollThumb.style.height = `${Math.max(30, scrollTrack.clientHeight * ratio)}px`;
    }
    setThumbSize();
    window.addEventListener('resize', setThumbSize);
    lenis.on('scroll', () => { updateThumb(); showThumb(); });

    let isDragging = false;
    scrollThumb.addEventListener('mousedown', e => { isDragging = true; e.preventDefault(); });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const rect = scrollTrack.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const trackH = rect.height;
      const thumbH = scrollThumb.clientHeight;
      const progress = Math.max(0, Math.min(1, (y - thumbH / 2) / (trackH - thumbH)));
      lenis.scrollTo(lenis.limit * progress, { immediate: false, duration: 0.5 });
    });
    document.addEventListener('mouseup', () => { isDragging = false; });
    scrollTrack.addEventListener('click', e => {
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

// ── Floating header ──
(function () {
  const original = document.querySelector('.project-header');
  const main = document.querySelector('.project-main-content');
  if (!original || !main || !window.lenis) return;
  const floating = original.cloneNode(true);
  floating.classList.add('floating-header');
  floating.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  const floatingLogo = floating.querySelector('.logo');
  if (floatingLogo) floatingLogo.style.opacity = '1';
  document.body.appendChild(floating);
  const gridTop = main.getBoundingClientRect().top + window.lenis.animatedScroll;
  window.lenis.on('scroll', e => {
    if (e.animatedScroll > gridTop) {
      floating.classList.toggle('visible', e.direction < 0);
    } else {
      floating.classList.remove('visible');
    }
  });
})();

// ── Footer reveal ──
(function () {
  const footer = document.querySelector('.footer-section');
  if (!footer) return;
  const logo = document.querySelector('.animated-logo');
  const fadeEls = footer.querySelectorAll('.savlot-architects2, .kailash-m-savlot2, .contacts, .footer-links, .termsconditions');
  let animated = false;
  function onScroll() {
    if (animated) return;
    const rect = footer.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
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
  if (logo) logo.style.opacity = '0';
  fadeEls.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(15px)'; });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
})();

// ── Loading screen ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => { if (loader.parentNode) loader.remove(); }, 800);
  }
});

// ── Scroll reveal animations ──
(function () {
  const targets = [
    '.brief-section',
    '.point-item',
    '.stat-card',
    '.project-video',
    '.gallery-wrapper',
    '.explore-section',
  ];
  const els = document.querySelectorAll(targets.join(','));
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((el, i) => {
    const isGallery = el.classList.contains('gallery-wrapper');
    el.classList.add(isGallery ? 'reveal-right' : 'reveal');
    el.style.setProperty('--reveal-delay', `${i * 0.08}s`);
    obs.observe(el);
  });
})();
