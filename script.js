import { createObserver, initLenis, initLoader, initWhatsApp } from './common.js';

// ── Service background shift ──
(function () {
  const section = document.querySelector('.service-section');
  if (!section) return;
  window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
    section.style.background = `linear-gradient(158.41deg, rgb(${Math.round(246 - p * 15)},${Math.round(228 - p * 12)},${Math.round(228 - p * 8)}), rgb(242,244,227) 29.81%, rgb(232,240,245) 65.38%, rgb(225,229,244))`;
  });
})();

// ── Hero Section ──
(function () {
  try {
  const hero = document.querySelector('.hero-section .div');
  if (!hero) { console.error('Hero: .hero-section .div not found'); return; }

  const MIN_DURATION = 8000;
  const cdn = 'https://res.cloudinary.com/dge8i8jqs';
  const video1Url = `${cdn}/video/upload/q_auto/f_auto/index-asset/hero-video-1.mp4`;
  const video2Url = `${cdn}/video/upload/q_auto/f_auto/index-asset/hero-video-2.mp4`;

  const hc = [
    { title: 'RIVIERA ELITE', desc: 'Interior design project successfully completed and handed over to the client. Elegant spaces crafted with premium finishes and meticulous detailing.', status: 'COMPLETED & HANDED OVER', location: 'SKY CITY TOWNSHIP, SHELA', scope: 'INTERIOR', video: video1Url, link: '../project page/project.html?id=5' },
    { title: 'SPRING 3BHK', desc: 'A complete interior transformation delivered and handed over. Designed for modern living with optimized layouts and a curated material palette.', status: 'COMPLETED & HANDED OVER', location: 'SATELLITE, AHMEDABAD', scope: 'INTERIOR', video: video2Url, link: '../project page/project.html?id=1' },
  ];

  let ci = 0;
  let videoStart = 0;
  const tEl = document.querySelector('.content .title');
  const dEl = document.querySelector('.content .description');
  const sEls = document.querySelectorAll('.status-handover-container b');
  const lEl = document.querySelectorAll('.status-handover-container')[1]?.querySelector('b');
  const scEl = document.querySelector('.scope-architecture-container b');
  const kmEl = document.querySelector('.hero-know-more');

  function updateContent(i) {
    const d = hc[i];
    if (!d) return;
    if (tEl) {
      tEl.style.transform = 'translateY(20px)'; tEl.style.opacity = '0'; tEl.style.transition = 'transform 0.6s ease,opacity 0.6s ease';
      setTimeout(() => { tEl.textContent = d.title; tEl.style.transform = 'translateY(0)'; tEl.style.opacity = '1'; }, 100);
    }
    if (dEl) {
      dEl.style.opacity = '0'; dEl.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        dEl.innerHTML = '';
        d.desc.split(' ').forEach((w, i) => {
          const sp = document.createElement('span');
          sp.textContent = w + ' '; sp.style.opacity = '0'; sp.style.transition = `opacity 0.15s ease ${i * 0.04}s`;
          dEl.appendChild(sp); setTimeout(() => { sp.style.opacity = '1'; }, 50);
        });
        dEl.style.opacity = '1';
      }, 300);
    }
    if (sEls[0]) sEls[0].textContent = d.status;
    if (lEl) lEl.textContent = d.location;
    if (scEl) scEl.textContent = d.scope;
    if (kmEl && d.link) kmEl.href = d.link;
  }

  const v = document.getElementById('hero-video');
  if (!v) return;
  v.addEventListener('error', () => { console.error('Video error:', v.error, v.error?.message); });
  v.addEventListener('suspend', () => { console.log('Video suspend'); });
  v.addEventListener('loadstart', () => { console.log('Video loadstart'); });
  v.addEventListener('loadeddata', () => { console.log('Video loadeddata, readyState:', v.readyState); });
  v.addEventListener('canplay', () => { console.log('Video canplay'); });

  function playVideo(i) {
    ci = i;
    videoStart = Date.now();
    v.src = hc[i].video;
    v.load();

    function doPlay() {
      const p = v.play();
      if (p !== undefined) {
        p.catch(e => {
          console.error('Video play failed:', e);
        });
      }
    }

    // Immediate attempt
    doPlay();

    // Retry after page fully settles
    setTimeout(doPlay, 500);
    setTimeout(doPlay, 1500);

    // Retry on the next user interaction (covers all mobile browsers)
    const retryOnce = () => { doPlay(); document.removeEventListener('touchstart', retryOnce); document.removeEventListener('click', retryOnce); };
    document.addEventListener('touchstart', retryOnce, { once: true });
    document.addEventListener('click', retryOnce, { once: true });

    updateContent(i);
  }

  v.addEventListener('ended', () => {
    const elapsed = Date.now() - videoStart;
    const wait = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => playVideo((ci + 1) % hc.length), wait);
  });

  playVideo(0);

  const cp = hero.querySelector('.content-parent');
  if (cp) cp.classList.add('hero-content');
  } catch (e) { console.error('Hero IIFE error:', e); }
})();

// ── Mobile Menu Toggle ──
document.querySelectorAll('.hamburger-wrapper').forEach(w => w.addEventListener('click', function(e) {
  e.stopPropagation();
  this.closest('.pill-menu')?.classList.toggle('active');
}));
document.querySelectorAll('.menu-item-has-children > a').forEach(a => a.addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  this.parentElement.classList.toggle('active');
}));
document.addEventListener('click', closeMenu);
function closeMenu() {
  document.querySelectorAll('.pill-menu').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('.menu-item-has-children.active').forEach(el => el.classList.remove('active'));
}
document.addEventListener('wheel', closeMenu, { passive: true });
document.addEventListener('touchstart', e => {
  if (!e.target.closest('.pill-menu')) closeMenu();
}, { passive: true });

// ── Service Section: Card Stack ──
(function () {
  const c = document.querySelector('.service-section');
  if (!c) return;
  const h = c.querySelector('.service-main-view');
  const cards = c.querySelectorAll('.interior-card');
  if (!cards.length) return;

  if (h) { h.style.position = 'sticky'; h.style.top = '0'; h.style.zIndex = '1'; h.style.height = '100vh'; h.style.display = 'flex'; h.style.flexDirection = 'column'; h.style.justifyContent = 'center'; }

  cards.forEach((card, i) => {
    card.style.position = 'sticky';
    card.style.top = '0';
    card.style.height = '100vh';
    card.style.zIndex = `${2 + i}`;
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'center';
    card.style.transition = 'transform 0.6s ease';
  });

  c.style.minHeight = `${100 + cards.length * 100}vh`;
  c.style.display = 'flex'; c.style.flexDirection = 'column';
  c.style.justifyContent = 'flex-start';

  // Heading fade-in
  if (h) {
    const o = createObserver(e => { e.forEach(en => { if (en.isIntersecting) { h.style.opacity = '0'; h.style.transform = 'translateY(40px)'; requestAnimationFrame(() => { h.style.transition = 'opacity 0.8s ease,transform 0.8s ease'; h.style.opacity = '1'; h.style.transform = 'translateY(0)'; }); o.unobserve(h); } }); }, { threshold: 0.2 });
    o.observe(h);
  }

  // Custom cursor (on .frame-parent children) — only on devices with a fine pointer
  if (window.matchMedia('(pointer: fine)').matches) {
  const cursorTargets = c.querySelectorAll('.interior-card > .frame-parent');
  cursorTargets.forEach(target => {
    const cur = document.createElement('div');
    cur.className = 'custom-cursor'; cur.textContent = 'VIEW MORE';
    cur.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;border-radius:50%;background:rgba(0,0,0,0.7);color:#fff;font-size:12px;font-family:Geom;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0.5);transition:opacity 0.3s ease,transform 0.3s ease;width:100px;height:100px;backdrop-filter:blur(4px);';
    document.body.appendChild(cur);
    target.addEventListener('mouseenter', () => { cur.style.opacity = '1'; cur.style.transform = 'scale(1)'; target.style.cursor = 'none'; });
    target.addEventListener('mouseleave', () => { cur.style.opacity = '0'; cur.style.transform = 'scale(0.5)'; target.style.cursor = ''; });
    target.addEventListener('mousemove', e => { cur.style.left = e.clientX - 50 + 'px'; cur.style.top = e.clientY - 50 + 'px'; });
  });
  }

  // Doodle canvas
  const cv = document.createElement('canvas');
  cv.className = 'doodle-canvas'; cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:0.06;';
  c.style.position = 'relative'; c.appendChild(cv);

  document.querySelectorAll('.explore-link, .explore-link2').forEach(l => {
    l.addEventListener('mouseenter', () => { l.style.transform = 'translateX(4px)'; l.style.transition = 'transform 0.2s ease'; });
    l.addEventListener('mouseleave', () => { l.style.transform = 'translateX(0)'; l.style.transition = 'transform 0.2s ease'; });
  });
})();


// ── Featured Projects: Carousel (reference) ──
(function () {
  const carousel = document.querySelector('.carousel');
  const list = document.querySelector('.list');
  if (!carousel || !list) return;

  let isAnimating = false;
  let autoplayTimer;

  function showSlide(type) {
    if (isAnimating) return;
    isAnimating = true;

    const items = [...list.children];

    if (type === 'next') {
      list.appendChild(items[0]);
      carousel.classList.add('next');
    } else {
      list.prepend(items[items.length - 1]);
      carousel.classList.add('prev');
    }

    setTimeout(() => {
      carousel.classList.remove('next', 'prev');
      isAnimating = false;
    }, 600);
  }

  function startAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => showSlide('next'), 8000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  document.querySelector('.next-btn')?.addEventListener('click', () => { showSlide('next'); resetAutoplay(); });
  document.querySelector('.prev-btn')?.addEventListener('click', () => { showSlide('prev'); resetAutoplay(); });

  startAutoplay();
})();


// ── About Section ──
(function () {
  const sec = document.querySelector('.about-section');
  if (!sec) return;
  const photo = sec.querySelector('.photo');
  const content3 = sec.querySelector('.content3');
  const line = sec.querySelector('.line');
  const stats = sec.querySelector('.stats2');
  const nums = stats?.querySelectorAll('.blanks, .h23, .h25');
  const cats = stats?.querySelectorAll('.category-labels, .commercial-wrapper, .turnkey-wrapper');

  if (photo) { photo.style.opacity = '0'; photo.style.transform = 'translateX(-40px)'; photo.style.willChange = 'opacity,transform'; }
  if (content3) { content3.style.opacity = '0'; content3.style.transform = 'translateX(-40px)'; }
  if (line) { line.style.opacity = '0'; line.style.transform = 'scaleX(0)'; }
  if (cats && cats.length) cats.forEach(cat => { cat.style.opacity = '0'; cat.style.transform = 'translateY(10px)'; });

  const o = createObserver(e => {
    e.forEach(en => {
      if (en.isIntersecting) {
        if (photo) { photo.style.transition = 'opacity 0.8s ease,transform 0.8s ease'; requestAnimationFrame(() => { photo.style.opacity = '1'; photo.style.transform = 'translateX(0)'; }); }
        if (content3) { content3.style.transition = 'opacity 0.8s ease,transform 0.8s ease'; requestAnimationFrame(() => { content3.style.opacity = '1'; content3.style.transform = 'translateX(0)'; }); }
        if (line) { line.style.transition = 'opacity 0.6s ease,transform 0.6s ease'; requestAnimationFrame(() => { line.style.opacity = '1'; line.style.transform = 'scaleX(1)'; }); }
        if (nums && nums.length) {
          const targets = [];
          nums.forEach((el, i) => { targets[i] = parseInt(el.textContent) || 0; el.textContent = '0'; });
          setTimeout(() => {
            nums.forEach((el, i) => {
              const t = targets[i]; let cur = 0;
              const step = Math.max(1, Math.ceil(t / 90));
              const iv = setInterval(() => { cur += step; if (cur >= t) { cur = t; clearInterval(iv); } el.textContent = cur; }, 30);
            });
          }, 900);
        }
        if (cats && cats.length) {
          cats.forEach((cat, i) => {
            setTimeout(() => { cat.style.transition = 'opacity 0.5s ease,transform 0.5s ease'; cat.style.opacity = '1'; cat.style.transform = 'translateY(0)'; }, 1200 + i * 200);
          });
        }
        o.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  o.observe(sec);
})();

// ── Why Choose Us ──
(function () {
  const sec = document.querySelector('.benefit-section');
  if (!sec) return;
  const h = sec.querySelector('.heading-wrapper');
  const cards = sec.querySelectorAll('.card1, .card2, .card3, .card4, .card5, .card6');

  const o = createObserver(e => {
    e.forEach(en => {
      if (en.isIntersecting) {
        if (h) { h.style.opacity = '0'; h.style.transform = 'translateY(30px)'; requestAnimationFrame(() => { h.style.transition = 'opacity 0.6s ease,transform 0.6s ease'; h.style.opacity = '1'; h.style.transform = 'translateY(0)'; }); }
        cards.forEach((card, i) => {
          card.style.opacity = '0'; card.style.transform = 'translateY(40px)';
          setTimeout(() => { card.style.transition = 'opacity 0.6s ease,transform 0.6s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 300 + i * 200);
        });
        o.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  o.observe(sec);
})();

// ── Testimonial Section ──
(function () {
  const ts = document.querySelector('.testimonial-section');
  if (!ts) return;
  const h = ts.querySelector('.heading5');
  const rp = ts.querySelector('.review-card-parent');
  const cards = rp?.querySelectorAll('.review-card, .review-card2, .review-card3');

  if (h) {
    const o = createObserver(e => { e.forEach(en => { if (en.isIntersecting) { h.style.opacity = '0'; h.style.transform = 'translateX(-40px)'; requestAnimationFrame(() => { h.style.transition = 'opacity 0.8s ease,transform 0.8s ease'; h.style.opacity = '1'; h.style.transform = 'translateX(0)'; }); o.unobserve(h); } }); }, { threshold: 0.2 });
    o.observe(h);
  }

  if (rp && cards && cards.length) {
    const o = createObserver(e => {
      e.forEach(en => {
        if (en.isIntersecting) {
          // Get original positions and spacing
          const positions = []; let totalSpan = 0;
          cards.forEach((c, i) => {
            const left = parseFloat(getComputedStyle(c).left) || 0;
            positions.push(left);
          });
          // Sort by left position to determine order
          const sorted = positions.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
          const sortedPositions = sorted.map(s => s.v);
          const sortedCards = sorted.map(s => cards[s.i]);
          const cardWidth = 375;
          const gap = (sortedPositions[1] - sortedPositions[0] - cardWidth);
          totalSpan = (cardWidth + gap) * cards.length;

          // Clone
          sortedCards.forEach(c => {
            const cl = c.cloneNode(true);
            rp.appendChild(cl);
          });

          let offset = 0, aid, paused = false;
          function scroll() {
            if (!paused) {
              offset -= 0.6;
              if (offset <= -totalSpan) offset = 0;
              const all = rp.querySelectorAll('.review-card, .review-card2, .review-card3');
              all.forEach((c, i) => {
                const baseIdx = i % cards.length;
                const block = Math.floor(i / cards.length);
                c.style.left = sortedPositions[baseIdx] + offset + block * totalSpan + 'px';
              });
            }
            aid = requestAnimationFrame(scroll);
          }
          scroll();
          rp.addEventListener('mouseenter', () => { paused = true; });
          rp.addEventListener('mouseleave', () => { paused = false; });
          o.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    o.observe(rp);
  }
})();

// ── CTA Section ──
(function () {
  const cta = document.querySelector('.cta-section');
  if (!cta) return;
  const form = cta.querySelector('.form-div');
  const hd = cta.querySelector('.heading-div');
  const bw = hd?.querySelector('.build');
  const btn = document.querySelector('.get-a-quote-button3');

  const o = createObserver(e => {
    e.forEach(en => {
      if (en.isIntersecting) {
        if (form) { form.style.opacity = '0'; form.style.transform = 'translateY(40px)'; requestAnimationFrame(() => { form.style.transition = 'opacity 0.8s ease,transform 0.8s ease'; form.style.opacity = '1'; form.style.transform = 'translateY(0)'; }); }
        if (bw) {
          const inner = bw.querySelector('.lets');
          const text = (inner || bw).textContent;
          const parent = inner || bw;
          const fragment = document.createDocumentFragment();
          [...text].forEach((letter, i) => {
            const sp = document.createElement('span');
            sp.textContent = letter;
            sp.style.display = 'inline-block';
            sp.style.transform = 'translateY(100%)';
            sp.style.transition = `transform 0.5s ease ${i * 0.08}s`;
            fragment.appendChild(sp);
          });
          parent.style.display = 'inline-block';
          parent.style.overflow = 'hidden';
          parent.style.verticalAlign = 'bottom';
          parent.style.position = 'relative';
          parent.replaceChildren(fragment);
          parent.querySelectorAll('span').forEach((sp, i) => {
            setTimeout(() => { sp.style.transform = 'translateY(0)'; }, 500 + i * 80);
          });
        }
        o.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  o.observe(cta);

})();

// ── Footer ──
(function () {
  function initFooter(footer) {
    if (!footer) return;
    const glow = document.querySelector('.footer-glow');
    if (glow) {
      const o = createObserver(e => {
        e.forEach(en => {
          if (en.isIntersecting) {
            glow.style.opacity = '1';
            o.unobserve(en.target);
          }
        });
      }, { threshold: 0.2 });
      o.observe(footer);
    }

    const fadeEls = footer.querySelectorAll('.savlot-architects2, .kailash-m-savlot2, .contacts, .footer-links, .termsconditions');
    if (!fadeEls.length) return;

    const o2 = createObserver(e => {
      e.forEach(en => {
        if (en.isIntersecting) {
          const logo = footer.querySelector('.animated-logo');
          if (logo) { logo.classList.add('animate-zoom-in'); logo.style.opacity = '1'; }
          fadeEls.forEach((el, i) => {
            el.style.opacity = '0';
            setTimeout(() => el.classList.add('animate-fade-up'), i * 100);
          });
          o2.unobserve(en.target);
        }
      });
    }, { threshold: 0.15 });
    o2.observe(footer);
  }

  initFooter(document.querySelector('.footer-section'));
  initFooter(document.querySelector('.footer-section-mobile'));
})();

// ── Benefit Cards: Flip Effect ──
const backTexts = {
  card1: 'Every visual element follows a cohesive system — from typography to material palettes — ensuring your project speaks with one clear, refined voice.',
  card2: 'We manage every detail from concept to handover so you don\'t have to. No surprises, no delays — just a smooth, transparent process.',
  card3: 'We source materials directly from trusted makers and mills, guaranteeing quality, traceability, and character that off-the-shelf options can\'t match.',
  card4: 'Tailored for clients seeking a premium lifestyle, this point highlights the transition from standard spaces to high-end, curated environments.',
  card5: 'Complete design flexibility that eliminates rigid templates, allowing every layout, piece of furniture, and material palette to be tailored to your precise vision.',
  card6: 'Years of deep industry knowledge and technical mastery that turn complex structural challenges into seamless, award-winning spaces.',
};

document.querySelectorAll('.card1, .card2, .card3, .card4, .card5, .card6').forEach(card => {
  const cls = card.className.match(/card[1-6]/)[0];
  const inner = document.createElement('div');
  inner.className = 'flip-inner';

  const front = document.createElement('div');
  front.className = 'flip-front';
  const cs = getComputedStyle(card);
  front.style.padding = cs.padding;
  front.style.boxSizing = 'border-box';

  const back = document.createElement('div');
  back.className = 'flip-back';
  back.innerHTML = '<div class="flip-back-content">' + backTexts[cls] + '</div>';

  card.style.padding = '0';
  while (card.firstChild) front.appendChild(card.firstChild);
  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.addEventListener('mouseenter', () => inner.classList.add('flipped'));
  card.addEventListener('mouseleave', () => inner.classList.remove('flipped'));
});

// ── Section heights (must run before Lenis init) ──
['about-section', 'benefit-section', 'testimonial-section', 'cta-section', 'footer-section'].forEach(cls => {
  const el = document.querySelector('.' + cls);
  if (el && !el.style.minHeight) el.style.minHeight = '100vh';
});

// ── Lenis + Scrollbar ──
const lenis = initLenis();

// ── Loading screen ──
initLoader(1500);

// ── WhatsApp Popup ──
initWhatsApp();

// ── Mobile input: prefix on focus, placeholder on blur, digits only ──
(function () {
  var input = document.getElementById('mobile-input');
  if (!input) return;
  input.addEventListener('focus', function () {
    if (this.value === '') this.value = '+91';
  });
  input.addEventListener('blur', function () {
    if (this.value === '+91') this.value = '';
  });
  input.addEventListener('input', function () {
    var val = this.value;
    var cleaned = '';
    for (var i = 0; i < val.length; i++) {
      var ch = val.charAt(i);
      if ((ch >= '0' && ch <= '9') || (ch === '+' && i === 0)) cleaned += ch;
    }
    this.value = cleaned.substring(0, 13);
  });
})();
