import { createObserver, initLenis, initLoader, initWhatsApp } from '../common.js';
import projectData from '../project-data.js';

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

// ── Asset URLs (CDN) ──
const heroImgUrl = new URL('./public/project-bg@2x.png', import.meta.url).href;
const posterUrl = new URL('./public/28-1@2x.png', import.meta.url).href;
const videoMp4Url = new URL('./public/project-video.mp4', import.meta.url).href;
const videoWebmUrl = new URL('./public/project-video.webm', import.meta.url).href;
const gallery1Url = new URL('./public/Image1@2x.png', import.meta.url).href;
const gallery2Url = new URL('./public/Image2@2x.png', import.meta.url).href;
const gallery3Url = new URL('./public/Image@2x.png', import.meta.url).href;
const galleryImgs = [gallery1Url, gallery2Url, gallery3Url];

const cdn = 'https://res.cloudinary.com/dge8i8jqs';

// ── Project-05 specific assets ──
const p05HeroUrl = `${cdn}/image/upload/q_auto/f_auto/project-asset/project-05/project-05-bg.avif`;
const p05PosterUrl = `${cdn}/image/upload/q_auto/f_auto/project-asset/project-05/project-05-poster.avif`;
const p05VideoMp4Url = `${cdn}/video/upload/q_auto/f_auto/project-asset/project-05/project-05-video.mp4`;
const p05GalleryImgs = Array.from({ length: 24 }, (_, i) =>
  `${cdn}/image/upload/q_auto/f_auto/project-asset/project-05/project-05-img-${String(i + 1).padStart(2, '0')}.avif`
);

// ── Project-01 specific assets ──
const p01HeroUrl = `${cdn}/image/upload/q_auto/f_auto/project-asset/project-01/project-01-bg.avif`;
const p01PosterUrl = `${cdn}/image/upload/q_auto/f_auto/project-asset/project-01/project-01-poster.avif`;
const p01VideoMp4Url = `${cdn}/video/upload/q_auto/f_auto/project-asset/project-01/project-01-video.mp4`;
const p01GalleryImgs = Array.from({ length: 24 }, (_, i) =>
  `${cdn}/image/upload/q_auto/f_auto/project-asset/project-01/project-01-img-${String(i + 1).padStart(2, '0')}.avif`
);

// ── Project Data ──
const projects = {
  1: {
    hero: p05HeroUrl,
    title: 'SPRING 3BHK',
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
    video: { poster: p05PosterUrl, sources: [p05VideoMp4Url] },
    gallery: p05GalleryImgs,
  },
  2: {
    hero: heroImgUrl,
    title: 'THE GLASS PAVILION',
    location: 'SATELLITE, 2025',
    brief: 'A minimalist exploration of transparency and reflection. This residence negotiates privacy and openness through carefully calibrated glass planes that dissolve the boundary between interior and landscape.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Maximizing natural light while maintaining thermal comfort in a south-facing corner plot.' },
      { heading: 'THE SOLUTION', text: 'Floor-to-ceiling structural glass panels with integrated deep overhangs and cross-ventilation shafts.' },
      { heading: 'THE PALETTE', text: 'Brushed aluminum, low-iron glass, and warm grey limestone flooring throughout.' },
    ],
    stats: [
      { value: '92%', label: 'Daylight Factor' },
      { value: '40%', label: 'Glass Coverage' },
      { value: '2.5\u00b0C', label: 'Indoor Stability' },
    ],
    video: { poster: posterUrl, sources: [videoMp4Url, videoWebmUrl] },
    gallery: galleryImgs,
  },
  3: {
    hero: heroImgUrl,
    title: 'THE COURTYARD VILLA',
    location: 'PRAHLAD NAGAR, 2022',
    brief: 'A modern reinterpretation of the traditional Indian courtyard home. The design centers on a landscaped water court that cools the surrounding living spaces and anchors the family life.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Integrating a traditional dwelling typology within a tight suburban plot with modern programmatic demands.' },
      { heading: 'THE SOLUTION', text: 'A staggered three-wing layout wrapped around an open-to-sky courtyard with a reflecting pool.' },
      { heading: 'THE PALETTE', text: 'Hand-carved Jaisalmer stone, exposed brick, and oxidized copper cladding.' },
    ],
    stats: [
      { value: '212\u00b0', label: 'Year-Round View' },
      { value: '60%', label: 'Open-to-Sky Ratio' },
      { value: '2x', label: 'Cross Ventilation' },
    ],
    video: { poster: posterUrl, sources: [videoMp4Url, videoWebmUrl] },
    gallery: galleryImgs,
  },
  4: {
    hero: heroImgUrl,
    title: 'THE URBAN NEST',
    location: 'BODAKDEV, 2025',
    brief: 'A compact luxury apartment designed for the modern professional. Every square foot is optimized through custom millwork and hidden storage, creating a serene urban refuge.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Delivering a sense of spaciousness within a constrained 1200 sq ft apartment footprint.' },
      { heading: 'THE SOLUTION', text: 'A continuous fluid plan with sliding partition walls and mirrored surfaces to multiply visual depth.' },
      { heading: 'THE PALETTE', text: 'White oak veneer, matte lacquer, and warm-toned micro-cement.' },
    ],
    stats: [
      { value: '1200\u00b2', label: 'Built Area' },
      { value: '14\u2019', label: 'Peak Ceiling' },
      { value: '40%', label: 'Storage Ratio' },
    ],
    video: { poster: posterUrl, sources: [videoMp4Url, videoWebmUrl] },
    gallery: galleryImgs,
  },
  5: {
    hero: p01HeroUrl,
    title: 'RIVIERA ELITE',
    location: 'SKY CITY TOWNSHIP, 2024',
    brief: 'Currently in the final styling phase. This turnkey project explores the balance between ambient lighting and deep, tactile textures. A study in contrasts \u2014 matte against gloss, rough stone against smooth leather.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Creating drama without darkness \u2014 keeping the interiors moody yet welcoming.' },
      { heading: 'THE SOLUTION', text: 'Layered lighting with dimmable LED tape, cove lighting, and focused accent spots on art and texture.' },
      { heading: 'THE PALETTE', text: 'Charcoal-stained oak, blackened steel, fluted glass, and raw silk upholstery.' },
    ],
    stats: [
      { value: '8', label: 'Lighting Zones' },
      { value: '35%', label: 'Matte Finish' },
      { value: '6', label: 'Art Niches' },
    ],
    video: { poster: p01PosterUrl, sources: [p01VideoMp4Url] },
    gallery: p01GalleryImgs,
  },
  6: {
    hero: heroImgUrl,
    title: 'THE SKY VILLA',
    location: 'SHILAJ, 2021',
    brief: 'A penthouse residence with panoramic city views and a rooftop garden. The design prioritizes indoor-outdoor living with a seamless flow from living spaces to the terrace.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Working within the structural constraints of an existing high-rise while adding a rooftop garden.' },
      { heading: 'THE SOLUTION', text: 'Lightweight steel-frame extensions and a green roof system with native drought-resistant planting.' },
      { heading: 'THE PALETTE', text: 'Terrazzo flooring, teak screens, and powder-coated aluminum joinery.' },
    ],
    stats: [
      { value: '360\u00b0', label: 'City Views' },
      { value: '1500\u00b2', label: 'Terrace Garden' },
      { value: '25\u2019', label: 'Ceiling Height' },
    ],
    video: { poster: posterUrl, sources: [videoMp4Url, videoWebmUrl] },
    gallery: galleryImgs,
  },
  7: {
    hero: heroImgUrl,
    title: 'THE HERITAGE RESIDENCE',
    location: 'GOTA, 2026',
    brief: 'Blending contemporary luxury with classical design motifs. This residence features bespoke brass fittings, imported marble, and hand-painted wall finishes throughout the public spaces.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Harmonizing classical Indian detailing with a modern open-plan lifestyle.' },
      { heading: 'THE SOLUTION', text: 'A central axis plan with formal living zones flanked by informal family spaces, connected by a colonnaded gallery.' },
      { heading: 'THE PALETTE', text: 'Carrara marble, polished brass, hand-carved sandstone jaalis, and silk wall coverings.' },
    ],
    stats: [
      { value: '18\u2019', label: 'Gallery Height' },
      { value: '7', label: 'Bespoke Chandeliers' },
      { value: '4', label: 'Material Palettes' },
    ],
    video: { poster: posterUrl, sources: [videoMp4Url, videoWebmUrl] },
    gallery: galleryImgs,
  },
  8: {
    hero: heroImgUrl,
    title: 'THE GARDEN PAVILION',
    location: 'GOTA, 2026',
    brief: 'A weekend retreat that blurs the line between architecture and landscape. The pavilion sits lightly on the land with a cantilevered roof that shelters both indoor and outdoor rooms.',
    points: [
      { heading: 'THE CHALLENGE', text: 'Minimizing site disturbance while creating a dramatic architectural gesture.' },
      { heading: 'THE SOLUTION', text: 'A steel tree-column structure that lifts the roof 14 feet, with full-height sliding glass walls that disappear into pockets.' },
      { heading: 'THE PALETTE', text: 'Weathering steel, ipe wood decking, glass, and polished concrete floors.' },
    ],
    stats: [
      { value: '3,500\u00b2', label: 'Covered Area' },
      { value: '14\u2019', label: 'Roof Overhang' },
      { value: '100%', label: 'Indoor-Outdoor Flow' },
    ],
    video: { poster: posterUrl, sources: [videoMp4Url, videoWebmUrl] },
    gallery: galleryImgs,
  },
};

// ── Render Project ──
function animateStats() {
  var cards = document.querySelectorAll('#stats-section .stat-card');
  if (!cards.length) return;
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var card = entry.target;
      obs.unobserve(card);
      var rollers = card.querySelectorAll('.digit-roller');
      var len = rollers.length;
      if (!len) return;
      rollers.forEach(function (roller, idx) {
        var target = parseInt(roller.getAttribute('data-digit'));
        if (isNaN(target)) return;
        var strip = roller.querySelector('.digit-strip');
        if (!strip) return;
        var delay = (len - 1 - idx) * 140;
        setTimeout(function () {
          strip.style.transform = 'translateY(-' + (target * 1.25) + 'em)';
        }, delay);
      });
    });
  }, { threshold: 0.3 });
  cards.forEach(function (c) { obs.observe(c); });
}

function renderProject(id) {
  const data = projects[id];
  if (!data) return;

  if (projectData[id]) {
    data.title = projectData[id].title;
    data.location = projectData[id].location;
  }

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
      var valHtml = '';
      var valStr = s.value;
      var numMatch = valStr.match(/^(-?[\d]+)(\.[\d]+)?(.*)$/);
      if (numMatch) {
        var intPart = numMatch[1];
        var decPart = numMatch[2] || '';
        var suffix = numMatch[3] || '';
        for (var i = 0; i < intPart.length; i++) {
          var ch = intPart[i];
          if (ch === '-') {
            valHtml += '<span class="stat-digit-static">-</span>';
          } else {
            valHtml += '<span class="digit-roller" data-digit="' + ch + '"><span class="digit-strip">';
            for (var d = 0; d <= 9; d++) valHtml += '<span>' + d + '</span>';
            valHtml += '</span></span>';
          }
        }
        if (decPart) {
          valHtml += '<span class="stat-digit-static">.</span>';
          for (var i = 1; i < decPart.length; i++) {
            var ch = decPart[i];
            valHtml += '<span class="digit-roller" data-digit="' + ch + '"><span class="digit-strip">';
            for (var d = 0; d <= 9; d++) valHtml += '<span>' + d + '</span>';
            valHtml += '</span></span>';
          }
        }
        valHtml += '<span class="stat-digit-static">' + suffix + '</span>';
      } else {
        valHtml = '<span class="stat-digit-static">' + valStr + '</span>';
      }
      div.innerHTML = '<h1 class="stat-value">' + valHtml + '</h1><h2 class="stat-label">' + s.label + '</h2>';
      statsEl.appendChild(div);
    });
    statsEl.classList.remove('hidden-section');
    animateStats();
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
  closeMenu();
});
function closeMenu() {
  document.querySelectorAll('.pill-menu').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.menu-item-has-children.active').forEach(el => el.classList.remove('active'));
}
document.addEventListener('wheel', closeMenu, { passive: true });
document.addEventListener('touchstart', e => {
  if (!e.target.closest('.pill-menu')) closeMenu();
}, { passive: true });

// ── Gallery drag scroll + custom cursor ──
(function () {
  const track = document.getElementById('project-gallery');
  if (!track) return;
  const wrapper = track.closest('.gallery-wrapper');
  if (!wrapper) return;
  const gap = 30;
  const isFine = window.matchMedia('(pointer: fine)').matches;
  const leftArrow = '<svg viewBox="0 0 24 24"><path d="M15 18L9 12L15 6" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const rightArrow = '<svg viewBox="0 0 24 24"><path d="M9 6L15 12L9 18" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  let cursor;
  if (isFine) {
    cursor = document.createElement('div');
    cursor.className = 'gallery-cursor';
    cursor.innerHTML = rightArrow;
    document.body.appendChild(cursor);
  }
  let isDragging = false, startX = 0, startTranslate = 0, moved = false, translateX = 0;
  let velX = 0, lastX = 0, lastTime = 0;
  let momentumId = null;

  function step() {
    const img = track.querySelector('.gallery-image');
    return img ? img.offsetWidth + gap : 860;
  }

  function setTranslate(x, snap) {
    translateX = Math.min(0, Math.max(x, -(track.scrollWidth - wrapper.clientWidth)));
    track.style.transform = 'translateX(' + translateX + 'px)';
  }

  function pointerStart(clientX) {
    cancelAnimationFrame(momentumId);
    momentumId = null;
    track.style.transition = 'none';
    isDragging = true; startX = clientX; startTranslate = translateX; moved = false;
    lastX = clientX; lastTime = performance.now(); velX = 0;
  }
  function pointerMove(clientX) {
    if (isDragging) {
      const now = performance.now();
      const dx = clientX - lastX;
      const dt = now - lastTime;
      if (dt > 0) velX = dx / dt * 16;
      lastX = clientX; lastTime = now;
      setTranslate(startTranslate + (clientX - startX));
      if (Math.abs(clientX - startX) > 10) moved = true;
    }
  }
  function pointerEnd() {
    if (isDragging) {
      if (!moved) {
        const rect = wrapper.getBoundingClientRect();
        const x = startX - rect.left;
        const target = translateX + (x < rect.width / 2 ? step() : -step());
        track.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        setTranslate(target);
        track.addEventListener('transitionend', function h() { track.style.transition = ''; track.removeEventListener('transitionend', h); });
      } else if (Math.abs(velX) > 0.3) {
        const friction = 0.92;
        const minVel = 0.5;
        const maxT = 0;
        const minT = -(track.scrollWidth - wrapper.clientWidth);
        let v = velX;
        (function momentum() {
          v *= friction;
          if (Math.abs(v) < minVel) return;
          let t = translateX + v;
          if (t > maxT || t < minT) {
            t = Math.max(minT, Math.min(maxT, t));
            const dist = Math.abs(t - translateX);
            track.style.transition = 'transform ' + Math.min(0.3, dist * 0.003) + 's cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            setTranslate(t);
            track.addEventListener('transitionend', function h() { track.style.transition = ''; track.removeEventListener('transitionend', h); });
            return;
          }
          setTranslate(t);
          momentumId = requestAnimationFrame(momentum);
        })();
      }
    }
    isDragging = false;
  }

  if (isFine) {
    wrapper.addEventListener('mouseenter', () => { cursor.classList.add('visible'); track.style.cursor = 'none'; });
    wrapper.addEventListener('mouseleave', () => { cursor.classList.remove('visible'); track.style.cursor = ''; isDragging = false; });
    wrapper.addEventListener('mousemove', e => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      cursor.innerHTML = x < rect.width / 2 ? leftArrow : rightArrow;
      cursor.style.left = (e.clientX - 50) + 'px';
      cursor.style.top = (e.clientY - 50) + 'px';
      if (isDragging) pointerMove(e.clientX);
    });
    wrapper.addEventListener('mousedown', e => { pointerStart(e.clientX); e.preventDefault(); });
    document.addEventListener('mouseup', pointerEnd);
  }
  wrapper.addEventListener('touchstart', e => { pointerStart(e.touches[0].clientX); }, { passive: true });
  wrapper.addEventListener('touchmove', e => { pointerMove(e.touches[0].clientX); }, { passive: true });
  wrapper.addEventListener('touchend', pointerEnd);
})();

// ── Video controls ──
(function () {
  const video = document.getElementById('video-element');
  if (!video) return;
  const wrapper = video.closest('.video-wrapper');
  if (!wrapper) return;
  const isFine = window.matchMedia('(pointer: fine)').matches;
  const playIcon = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="white"/></svg>';

  if (!isFine) {
    const BAR = 45;

    function showControls() { video.controls = true; }

    video.addEventListener('click', function (e) {
      const rect = wrapper.getBoundingClientRect();
      if (e.clientY - rect.top > rect.height - BAR) return;
      if (video.paused) {
        showControls();
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });

    video.addEventListener('seeked', () => { showControls(); });
    video.addEventListener('play', showControls);
    return;
  }

  // ── Desktop only below ──
  let seeking = false;
  const BAR = 45;

  const cursor = document.createElement('div');
  cursor.className = 'video-cursor';
  cursor.innerHTML = playIcon;
  document.body.appendChild(cursor);

  function showPlayCursor() { cursor.classList.add('visible'); video.style.cursor = 'none'; }
  function hidePlayCursor() { cursor.classList.remove('visible'); video.style.cursor = ''; }
  function isBar(e) {
    if (!video.hasAttribute('controls')) return false;
    const b = wrapper.getBoundingClientRect();
    return e.clientY - b.top > b.height - BAR;
  }

  wrapper.addEventListener('mouseenter', e => {
    if (!video.paused || isBar(e)) return;
    showPlayCursor();
  });
  wrapper.addEventListener('mouseleave', hidePlayCursor);
  wrapper.addEventListener('mousemove', e => {
    cursor.style.left = (e.clientX - 50) + 'px';
    cursor.style.top = (e.clientY - 50) + 'px';
    if (!video.paused) { hidePlayCursor(); return; }
    if (isBar(e)) { hidePlayCursor(); return; }
    showPlayCursor();
  });

  function togglePlay() {
    if (video.paused) {
      video.setAttribute('controls', '');
      video.play().catch(() => {});
    } else {
      video.pause();
      video.removeAttribute('controls');
    }
  }

  video.addEventListener('click', togglePlay);
  video.addEventListener('seeked', () => { seeking = false; });
  video.addEventListener('seeking', () => { seeking = true; });
  video.addEventListener('play', hidePlayCursor);
  video.addEventListener('pause', () => {
    if (video.paused && !seeking) {
      setTimeout(() => { if (video.paused) showPlayCursor(); }, 300);
    }
  });
})();

// ── Lenis smooth scroll ──
initLenis();

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
  const gridTop = main.getBoundingClientRect().top + window.lenis.scroll;
  window.lenis.on('scroll', e => {
    if (e.scroll > gridTop) {
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
initLoader();

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

// ── WhatsApp Popup ──
initWhatsApp();
