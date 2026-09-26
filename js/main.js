const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const siteHeader = document.querySelector('.site-header');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let headerFrame = 0;

function syncHeaderPosition() {
  headerFrame = 0;
  const scroll = Math.max(0, window.scrollY);
  const maxDescent = Math.min(window.innerHeight * 0.14, window.innerWidth < 1024 ? 72 : 112);
  const descent = reducedMotion.matches ? 0 : Math.min(scroll * 0.16, maxDescent);
  siteHeader.style.setProperty('--nav-follow', `${Math.round(scroll + descent)}px`);
  siteHeader.classList.toggle('is-scrolled', scroll > 80);
}

function scheduleHeaderPosition() {
  if (!headerFrame) headerFrame = window.requestAnimationFrame(syncHeaderPosition);
}

window.addEventListener('scroll', scheduleHeaderPosition, { passive: true });
syncHeaderPosition();

function closeMenu(restoreFocus = false) {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menú');
  siteNav.classList.remove('is-open');
  if (restoreFocus) menuToggle.focus();
}

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
  } else {
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', 'Cerrar menú');
    siteNav.classList.add('is-open');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && siteNav.classList.contains('is-open')) closeMenu(true);
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => closeMenu());
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) closeMenu();
  scheduleHeaderPosition();
});

const headlineWord = document.querySelector('.hero__word');

if (headlineWord) {
  const words = ['etapa', 'vida', 'casa'];
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let wordIndex = 0;
  let timer;

  function scheduleNextWord() {
    timer = setTimeout(() => {
      headlineWord.classList.add('is-erasing');
      timer = setTimeout(() => {
        wordIndex = (wordIndex + 1) % words.length;
        headlineWord.textContent = words[wordIndex];
        headlineWord.classList.remove('is-erasing');
        headlineWord.classList.add('is-writing');
        timer = setTimeout(() => {
          headlineWord.classList.remove('is-writing');
          scheduleNextWord();
        }, 400);
      }, 320);
    }, 2600);
  }

  function syncMotionPreference() {
    clearTimeout(timer);
    headlineWord.classList.remove('is-erasing');
    headlineWord.classList.remove('is-writing');
    wordIndex = 0;
    headlineWord.textContent = words[0];
    if (!motionPreference.matches) scheduleNextWord();
  }

  motionPreference.addEventListener('change', syncMotionPreference);
  syncMotionPreference();
}

const revealItems = [
  ...document.querySelectorAll('.featured-property, .service-row, .story, .process__step, .sell-cta, .site-footer'),
  ...document.querySelectorAll('.owner-path'),
];

if (revealItems.length && window.IntersectionObserver && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new window.IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -64px 0px' });

  revealItems.forEach((item) => {
    item.classList.add('is-revealing');
    revealObserver.observe(item);
  });
}
