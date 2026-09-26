const test = require('node:test');
const assert = require('node:assert/strict');

const { getNewsletterDelay, isNewsletterEligiblePath } = require('../js/newsletter.js');

test('newsletter appears three seconds after the first page entry', () => {
  assert.deepEqual(getNewsletterDelay(10000, null, false), { startedAt: 10000, delay: 3000 });
  assert.deepEqual(getNewsletterDelay(11800, '10000', false), { startedAt: 10000, delay: 1200 });
  assert.deepEqual(getNewsletterDelay(13500, '10000', false), { startedAt: 10000, delay: 0 });
});

test('newsletter stays closed after appearing in the same session', () => {
  assert.equal(getNewsletterDelay(13500, '10000', true), null);
});

test('newsletter only appears on exploration pages', () => {
  assert.equal(typeof isNewsletterEligiblePath, 'function');
  assert.equal(isNewsletterEligiblePath('/'), true);
  assert.equal(isNewsletterEligiblePath('/index.html'), true);
  assert.equal(isNewsletterEligiblePath('/propiedades.html'), true);
  assert.equal(isNewsletterEligiblePath('/contacto.html'), false);
  assert.equal(isNewsletterEligiblePath('/propiedad.html'), false);
});
