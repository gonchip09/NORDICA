const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const detail = fs.existsSync('js/propiedad.js') ? require('../js/propiedad.js') : {};
const { properties } = require('../js/propiedades.js');

test('every catalog ID resolves to its own detail', () => {
  assert.equal(typeof detail.getPropertyById, 'function');
  for (const property of properties) {
    assert.equal(detail.getPropertyById(property.id)?.id, property.id);
  }
  assert.equal(detail.getPropertyById('inexistente'), null);
});

test('each property has five distinct local gallery images', () => {
  assert.equal(typeof detail.getGallery, 'function');
  for (const property of properties) {
    const gallery = detail.getGallery(property);
    assert.equal(gallery.length, 5, property.id);
    assert.equal(gallery[0].src, property.imagen, property.id);
    assert.equal(gallery[0].kind, 'listing', property.id);
    assert.equal(gallery.slice(1).every((image) => image.kind === 'reference'), true, property.id);
    assert.equal(new Set(gallery.map((image) => image.src)).size, 5, property.id);
    assert.equal(gallery.every((image) => fs.existsSync(image.src)), true, property.id);
  }
});

test('related properties exclude the current ID and favor matching type', () => {
  assert.equal(typeof detail.getRelatedProperties, 'function');
  const current = properties.find((property) => property.id === 'casa-carrasco');
  const related = detail.getRelatedProperties(current, 3);
  assert.equal(related.length, 3);
  assert.equal(related.some((property) => property.id === current.id), false);
  assert.equal(related.every((property) => property.tipo === 'casa'), true);
});

test('visit request validates required fields and optional phone', () => {
  assert.equal(typeof detail.validateVisit, 'function');
  assert.deepEqual(Object.keys(detail.validateVisit({ nombre: '', email: 'x', telefono: '123', mensaje: 'hola' })).sort(), ['email', 'mensaje', 'nombre', 'telefono']);
  assert.deepEqual(detail.validateVisit({ nombre: 'Ana', email: 'ana@example.com', telefono: '', mensaje: 'Quiero coordinar una visita.' }), {});
});

test('visit request rejects values beyond the visible field limits', () => {
  const errors = detail.validateVisit({ nombre: 'a'.repeat(81), email: `${'a'.repeat(250)}@example.com`, telefono: '1'.repeat(41), mensaje: 'a'.repeat(2001) });
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'mensaje', 'nombre', 'telefono']);
});
