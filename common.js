export function createObserver(callback, options = {}) {
  if (Array.isArray(callback)) callback = callback[0];
  return new IntersectionObserver(callback, {
    threshold: options.threshold || 0.15,
    rootMargin: options.rootMargin || '0px',
  });
}

export function initLenis() {
  if (typeof Lenis === 'undefined') return null;
  const lenis = new Lenis({ duration: 1.2, easing: t => Math.min(1, 1.001 - 2 ** (-10 * t)), smoothWheel: true });
  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  let scrollTrack = document.getElementById('scroll-track');
  let scrollThumb = document.getElementById('scroll-thumb');
  if (!scrollTrack) {
    scrollTrack = document.createElement('div');
    scrollTrack.id = 'scroll-track';
    scrollThumb = document.createElement('div');
    scrollThumb.id = 'scroll-thumb';
    scrollTrack.appendChild(scrollThumb);
    document.body.appendChild(scrollTrack);
  }
  scrollThumb = scrollThumb || document.getElementById('scroll-thumb');
  if (scrollTrack && scrollThumb) {
    let hideTimeout;
    function showThumb() {
      scrollThumb.classList.add('visible');
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(() => scrollThumb.classList.remove('visible'), 1000);
    }
    function updateThumb() {
      const trackH = scrollTrack.clientHeight;
      const thumbH = scrollThumb.clientHeight;
      if (!thumbH) { setThumbSize(); return; }
      scrollThumb.style.top = `${lenis.progress * (trackH - thumbH)}px`;
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
  return lenis;
}

export function initLoader(delay = 0) {
  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => { if (loader.parentNode) loader.remove(); }, 800);
      }, delay);
    }
  });
}

export function initWhatsApp() {
  const floatBtn = document.querySelector('.whatsapp-float');
  const popup = document.querySelector('.whatsapp-popup');
  const closeBtn = document.querySelector('.whatsapp-popup-close');
  const openChatBtn = document.querySelector('.whatsapp-open-chat');
  if (!floatBtn || !popup || !closeBtn || !openChatBtn) return;

  const phoneNumber = '919099898794';
  const message = encodeURIComponent('Hi! I would like to book a design consultation with your team. I want to discuss design ideas for my property. Please share your next available slots for a phone call or site visit.');

  floatBtn.addEventListener('click', e => {
    e.stopPropagation();
    popup.classList.toggle('open');
  });
  closeBtn.addEventListener('click', () => popup.classList.remove('open'));
  document.addEventListener('click', e => {
    if (!popup.contains(e.target) && e.target !== floatBtn && !floatBtn.contains(e.target)) {
      popup.classList.remove('open');
    }
  });
  openChatBtn.addEventListener('click', () => {
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  });
}
