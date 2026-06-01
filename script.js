// ── Utility: Intersection Observer ──
function createObserver(callback, options = {}) {
  if (Array.isArray(callback)) callback = callback[0];
  return new IntersectionObserver(callback, {
    threshold: options.threshold || 0.15,
    rootMargin: options.rootMargin || '0px',
  });
}

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
  const hero = document.querySelector('.hero-section .div');
  if (!hero) return;

  const MIN_DURATION = 8000;
  const video1Url = new URL('./public/hero-video-1.mp4', import.meta.url).href;
  const video2Url = new URL('./public/hero-video-2.mp4', import.meta.url).href;

  const hc = [
    { title: 'THE NOIR RESIDENCE', desc: 'Currently in the final styling phase. This turnkey project in Ahmedabad explores the balance between ambient lighting and deep, tactile textures.', status: 'HANDOVER PHASE', location: 'SATELLITE, AHMEDABAD', scope: 'ARCHITECTURE + INTERIORS', video: video1Url },
    { title: 'THE MONOLITH HOUSE', desc: 'Full Architecture & Turnkey execution. Achieved 40% more natural light via a central atrium. 14 Months from soil-test to shoes-off.', status: 'COMPLETED', location: 'BOPAL, AHMEDABAD', scope: 'ARCHITECTURE + INTERIORS', video: video2Url },
  ];

  let ci = 0;
  let videoStart = 0;
  const tEl = document.querySelector('.content .title');
  const dEl = document.querySelector('.content .description');
  const sEls = document.querySelectorAll('.status-handover-container b');
  const lEl = document.querySelectorAll('.status-handover-container')[1]?.querySelector('b');
  const scEl = document.querySelector('.scope-architecture-container b');

  function updateContent(i) {
    const d = hc[i];
    tEl.style.transform = 'translateY(20px)'; tEl.style.opacity = '0'; tEl.style.transition = 'transform 0.6s ease,opacity 0.6s ease';
    setTimeout(() => { tEl.textContent = d.title; tEl.style.transform = 'translateY(0)'; tEl.style.opacity = '1'; }, 100);
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
    if (sEls[0]) sEls[0].textContent = d.status;
    if (lEl) lEl.textContent = d.location;
    if (scEl) scEl.textContent = d.scope;
  }

  const v = document.createElement('video');
  v.autoplay = true; v.muted = true; v.playsInline = true;
  v.className = 'hero-video';
  hero.insertBefore(v, hero.firstChild);

  function playVideo(i) {
    ci = i;
    videoStart = Date.now();
    v.src = hc[i].video;
    v.play().catch(() => {});
    updateContent(i);
  }

  v.addEventListener('ended', () => {
    const elapsed = Date.now() - videoStart;
    const wait = Math.max(0, MIN_DURATION - elapsed);
    setTimeout(() => playVideo((ci + 1) % hc.length), wait);
  });

  playVideo(0);

  const cp = hero.querySelector('.content-parent');
  cp.classList.add('hero-content');
})();

// ── Service Section: Card Stack ──
(function () {
  const c = document.querySelector('.service-section');
  if (!c) return;
  const h = c.querySelector('.service-main-view');
  const cards = c.querySelectorAll('.interiro-card');
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

  // Custom cursor (on .frame-parent children)
  const cursorTargets = c.querySelectorAll('.interiro-card > .frame-parent');
  cursorTargets.forEach(target => {
    const cur = document.createElement('div');
    cur.className = 'custom-cursor'; cur.textContent = 'VIEW MORE';
    cur.style.cssText = 'position:fixed;pointer-events:none;z-index:9999;border-radius:50%;background:rgba(0,0,0,0.7);color:#fff;font-size:12px;font-family:Geom;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(0.5);transition:opacity 0.3s ease,transform 0.3s ease;width:100px;height:100px;backdrop-filter:blur(4px);';
    document.body.appendChild(cur);
    target.addEventListener('mouseenter', () => { cur.style.opacity = '1'; cur.style.transform = 'scale(1)'; target.style.cursor = 'none'; });
    target.addEventListener('mouseleave', () => { cur.style.opacity = '0'; cur.style.transform = 'scale(0.5)'; target.style.cursor = ''; });
    target.addEventListener('mousemove', e => { cur.style.left = e.clientX - 50 + 'px'; cur.style.top = e.clientY - 50 + 'px'; });
  });

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
  if (content3) { content3.style.opacity = '0'; content3.style.transform = 'translateX(40px)'; }
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
          (inner || bw).textContent = '';
          const parent = inner || bw;
          parent.style.display = 'inline-block';
          parent.style.overflow = 'hidden';
          parent.style.verticalAlign = 'bottom';
          parent.style.position = 'relative';
          [...text].forEach((letter, i) => {
            const sp = document.createElement('span');
            sp.textContent = letter;
            sp.style.display = 'inline-block';
            sp.style.transform = 'translateY(100%)';
            sp.style.transition = `transform 0.5s ease ${i * 0.08}s`;
            parent.appendChild(sp);
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
  const footer = document.querySelector('.footer-section');
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

  const logo = document.querySelector('.animated-logo');
  const fadeEls = footer.querySelectorAll('.savlot-architects2, .kailash-m-savlot2, .contacts, .footer-links, .termsconditions');

  const o2 = createObserver(e => {
    e.forEach(en => {
      if (en.isIntersecting) {
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

// ── Lenis Smooth Scroll ──
const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);

// ── Custom scrollbar handle ──
const scrollTrack = document.createElement('div');
scrollTrack.id = 'scroll-track';
const scrollThumb = document.createElement('div');
scrollThumb.id = 'scroll-thumb';
scrollTrack.appendChild(scrollThumb);
document.body.appendChild(scrollTrack);

function updateThumb(progress) {
  const trackH = scrollTrack.clientHeight;
  const thumbH = Math.max(30, trackH * 0.15);
  scrollThumb.style.height = thumbH + 'px';
  scrollThumb.style.top = (progress * (trackH - thumbH)) + 'px';
}

let hideTimer;
lenis.on('scroll', ({ progress }) => {
  updateThumb(progress);
  scrollThumb.classList.add('visible');
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => scrollThumb.classList.remove('visible'), 1000);
});

let dragging = false;
scrollThumb.addEventListener('mousedown', (e) => {
  dragging = true;
  scrollThumb.style.cursor = 'grabbing';
  scrollThumb.classList.add('visible');
  clearTimeout(hideTimer);
  e.preventDefault();
});
document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect = scrollTrack.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const trackH = rect.height;
  const thumbH = scrollThumb.clientHeight;
  const progress = Math.max(0, Math.min(1, (y - thumbH / 2) / (trackH - thumbH)));
  lenis.scrollTo(lenis.limit * progress, { immediate: false });
});
document.addEventListener('mouseup', () => {
  if (dragging) {
    dragging = false;
    scrollThumb.style.cursor = 'grab';
  }
});
scrollTrack.addEventListener('mouseenter', () => { scrollThumb.classList.add('visible'); clearTimeout(hideTimer); });
scrollTrack.addEventListener('mouseleave', () => { hideTimer = setTimeout(() => scrollThumb.classList.remove('visible'), 1000); });
scrollTrack.addEventListener('click', (e) => {
  if (e.target === scrollThumb) return;
  const rect = scrollTrack.getBoundingClientRect();
  const y = e.clientY - rect.top;
  const trackH = rect.height;
  const thumbH = scrollThumb.clientHeight;
  const progress = Math.max(0, Math.min(1, (y - thumbH / 2) / (trackH - thumbH)));
  lenis.scrollTo(lenis.limit * progress, { immediate: false, duration: 0.5 });
});

// ── Section heights ──
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.hero-section, .service-section, .project-section, .about-section, .benefit-section, .testimonial-section, .cta-section, .footer-section');
  sections.forEach(s => { if (!s.classList.contains('hero-section')) s.style.minHeight = '100vh'; });
});

// ── Loading screen ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => { loader.remove(); }, 800);
    }, 1500);
  }
});

// ── WhatsApp Popup ──
(function () {
  const floatBtn = document.querySelector('.whatsapp-float');
  const popup = document.querySelector('.whatsapp-popup');
  const closeBtn = document.querySelector('.whatsapp-popup-close');
  const openChatBtn = document.querySelector('.whatsapp-open-chat');
  if (!floatBtn || !popup || !closeBtn || !openChatBtn) return;

  const phoneNumber = '919099898794'; // placeholder
  const message = encodeURIComponent('Hi! I would like to book a design consultation with your team. I want to discuss design ideas for my property. Please share your next available slots for a phone call or site visit.');

  floatBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popup.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    popup.classList.remove('open');
  });

  document.addEventListener('click', (e) => {
    if (!popup.contains(e.target) && e.target !== floatBtn && !floatBtn.contains(e.target)) {
      popup.classList.remove('open');
    }
  });

  openChatBtn.addEventListener('click', () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  });
})();

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
