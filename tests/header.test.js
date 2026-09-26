const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function element() {
  const listeners = {};
  const attributes = {};
  const classes = new Set();
  const styles = {};
  return {
    listeners,
    attributes,
    classList: {
      add(name) { classes.add(name); },
      remove(name) { classes.delete(name); },
      contains(name) { return classes.has(name); },
      toggle(name, force) { if (force) classes.add(name); else classes.delete(name); },
    },
    style: { values: styles, setProperty(name, value) { styles[name] = value; } },
    setAttribute(name, value) { attributes[name] = value; },
    getAttribute(name) { return attributes[name] ?? null; },
    addEventListener(name, listener) { listeners[name] = listener; },
    dispatch(name, event = {}) { listeners[name]?.(event); },
    focus() { this.focused = true; },
  };
}

function loadPage(reduceMotion = false, featuredCards = [], serviceRows = [], storySections = [], processSteps = [], sellCtas = [], footers = []) {
  const toggle = element();
  const nav = element();
  const header = element();
  const word = element();
  word.textContent = 'etapa';
  const links = [element(), element()];
  const documentListeners = {};
  const windowListeners = {};
  const timers = [];
  const observers = [];
  const frames = [];
  const media = { matches: reduceMotion, addEventListener(name, listener) { this.listener = listener; } };
  const document = {
    querySelector(selector) {
      return { '.menu-toggle': toggle, '.site-nav': nav, '.site-header': header, '.hero__word': word }[selector];
    },
    querySelectorAll(selector) {
      if (selector === '.site-nav a') return links;
      if (selector === '.featured-property') return featuredCards;
      if (selector === '.featured-property, .service-row') return [...featuredCards, ...serviceRows];
      if (selector === '.featured-property, .service-row, .story') return [...featuredCards, ...serviceRows, ...storySections];
      if (selector === '.featured-property, .service-row, .story, .process__step') return [...featuredCards, ...serviceRows, ...storySections, ...processSteps];
      if (selector === '.featured-property, .service-row, .story, .process__step, .sell-cta') return [...featuredCards, ...serviceRows, ...storySections, ...processSteps, ...sellCtas];
      if (selector === '.featured-property, .service-row, .story, .process__step, .sell-cta, .site-footer') return [...featuredCards, ...serviceRows, ...storySections, ...processSteps, ...sellCtas, ...footers];
      return [];
    },
    addEventListener(name, listener) { documentListeners[name] = listener; },
  };
  const window = {
    innerWidth: 375,
    innerHeight: 844,
    scrollY: 0,
    addEventListener(name, listener) { windowListeners[name] = listener; },
    requestAnimationFrame(callback) { frames.push(callback); return frames.length; },
    matchMedia() { return media; },
    IntersectionObserver: class {
      constructor(callback) { this.callback = callback; this.observed = []; this.unobserved = []; observers.push(this); }
      observe(target) { this.observed.push(target); }
      unobserve(target) { this.unobserved.push(target); }
    },
  };
  function setTimeout(callback) { const timer = { callback, active: true }; timers.push(timer); return timer; }
  function clearTimeout(timer) { if (timer) timer.active = false; }
  function runNextTimer() {
    const timer = timers.shift();
    assert.ok(timer, 'expected a scheduled animation step');
    if (timer.active) timer.callback();
  }
  vm.runInNewContext(fs.readFileSync('js/main.js', 'utf8'), { document, window, setTimeout, clearTimeout });
  return { toggle, nav, header, word, links, documentListeners, windowListeners, window, media, timers, observers, runNextTimer, runNextFrame() { frames.shift()?.(); } };
}

test('navigation follows scroll and descends without moving at the top', () => {
  const page = loadPage();
  assert.equal(page.header.style.values['--nav-follow'], '0px');
  page.window.scrollY = 400;
  page.windowListeners.scroll();
  page.runNextFrame();
  assert.equal(page.header.style.values['--nav-follow'], '464px');
  assert.equal(page.header.classList.contains('is-scrolled'), true);
  page.window.scrollY = 0;
  page.windowListeners.scroll();
  page.runNextFrame();
  assert.equal(page.header.style.values['--nav-follow'], '0px');
  assert.equal(page.header.classList.contains('is-scrolled'), false);
});

test('mobile menu opens and closes from its button', () => {
  const page = loadPage();
  page.toggle.dispatch('click');
  assert.equal(page.toggle.attributes['aria-expanded'], 'true');
  assert.equal(page.nav.classList.contains('is-open'), true);
  page.toggle.dispatch('click');
  assert.equal(page.toggle.attributes['aria-expanded'], 'false');
  assert.equal(page.nav.classList.contains('is-open'), false);
});

test('Escape closes the mobile menu and returns focus', () => {
  const page = loadPage();
  page.toggle.dispatch('click');
  page.documentListeners.keydown({ key: 'Escape' });
  assert.equal(page.nav.classList.contains('is-open'), false);
  assert.equal(page.toggle.focused, true);
});

test('headline replaces only its final word and continues the loop', () => {
  const page = loadPage();
  page.runNextTimer();
  assert.equal(page.word.textContent, 'etapa');
  assert.equal(page.word.classList.contains('is-erasing'), true);
  page.runNextTimer();
  assert.equal(page.word.textContent, 'vida');
  page.runNextTimer();
  page.runNextTimer();
  page.runNextTimer();
  assert.equal(page.word.textContent, 'casa');
});

test('reduced motion keeps the headline readable and static', () => {
  const page = loadPage(true);
  assert.equal(page.word.textContent, 'etapa');
  assert.equal(page.timers.length, 0);
});

test('enabling reduced motion stops an in-progress word change', () => {
  const page = loadPage();
  page.runNextTimer();
  page.media.matches = true;
  page.media.listener();
  assert.equal(page.word.textContent, 'etapa');
  assert.equal(page.word.classList.contains('is-erasing'), false);
  assert.equal(page.timers.every((timer) => !timer.active), true);
});

test('featured properties reveal once as they enter the viewport', () => {
  const cards = [element(), element()];
  const page = loadPage(false, cards);
  assert.equal(cards.every((card) => card.classList.contains('is-revealing')), true);
  assert.equal(page.observers.length, 1);
  page.observers[0].callback([{ target: cards[0], isIntersecting: true }], page.observers[0]);
  assert.equal(cards[0].classList.contains('is-visible'), true);
  assert.equal(cards[1].classList.contains('is-visible'), false);
  assert.deepEqual(page.observers[0].unobserved, [cards[0]]);
});

test('featured properties stay visible with reduced motion', () => {
  const card = element();
  const page = loadPage(true, [card]);
  assert.equal(card.classList.contains('is-revealing'), false);
  assert.equal(page.observers.length, 0);
});

test('services reveal as their rows enter the viewport', () => {
  const rows = [element(), element()];
  const page = loadPage(false, [], rows);
  assert.equal(rows.every((row) => row.classList.contains('is-revealing')), true);
  page.observers[0].callback([{ target: rows[0], isIntersecting: true }], page.observers[0]);
  assert.equal(rows[0].classList.contains('is-visible'), true);
  assert.equal(rows[1].classList.contains('is-visible'), false);
});

test('editorial story becomes visible when it enters the viewport', () => {
  const story = element();
  const page = loadPage(false, [], [], [story]);
  assert.equal(story.classList.contains('is-revealing'), true);
  page.observers[0].callback([{ target: story, isIntersecting: true }], page.observers[0]);
  assert.equal(story.classList.contains('is-visible'), true);
});

test('process steps reveal individually as the visitor scrolls', () => {
  const steps = [element(), element()];
  const page = loadPage(false, [], [], [], steps);
  assert.equal(steps.every((step) => step.classList.contains('is-revealing')), true);
  page.observers[0].callback([{ target: steps[0], isIntersecting: true }], page.observers[0]);
  assert.equal(steps[0].classList.contains('is-visible'), true);
  assert.equal(steps[1].classList.contains('is-visible'), false);
});

test('selling call to action reveals when it enters the viewport', () => {
  const cta = element();
  const page = loadPage(false, [], [], [], [], [cta]);
  assert.equal(cta.classList.contains('is-revealing'), true);
  page.observers[0].callback([{ target: cta, isIntersecting: true }], page.observers[0]);
  assert.equal(cta.classList.contains('is-visible'), true);
});

test('footer wordmark reveals when the footer enters the viewport', () => {
  const footer = element();
  const page = loadPage(false, [], [], [], [], [], [footer]);
  assert.equal(footer.classList.contains('is-revealing'), true);
  page.observers[0].callback([{ target: footer, isIntersecting: true }], page.observers[0]);
  assert.equal(footer.classList.contains('is-visible'), true);
});
