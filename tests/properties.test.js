const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const catalog = fs.existsSync('js/propiedades.js') ? require('../js/propiedades.js') : {};

const sample = [
  { id: 'casa', operacion: 'comprar', tipo: 'casa', ubicacion: 'Carrasco, Montevideo', dormitorios: 4, precio: 690000 },
  { id: 'cordon', operacion: 'alquilar', tipo: 'apartamento', ubicacion: 'Cordón, Montevideo', dormitorios: 2, precio: 36000 },
  { id: 'pocitos', operacion: 'comprar', tipo: 'apartamento', ubicacion: 'Pocitos, Montevideo', dormitorios: 3, precio: 285000 },
];

test('catalog filters operation, type, location, bedrooms and price together', () => {
  assert.equal(typeof catalog.filterProperties, 'function');
  const result = catalog.filterProperties(sample, {
    operacion: 'comprar', tipo: 'casa', ubicacion: 'carrasco', dormitorios: '3', precio: '700000',
  });
  assert.deepEqual(result.map((property) => property.id), ['casa']);
});

test('location matching ignores accents and case', () => {
  assert.equal(typeof catalog.filterProperties, 'function');
  const result = catalog.filterProperties(sample, { ubicacion: 'CORDON' });
  assert.deepEqual(result.map((property) => property.id), ['cordon']);
});

test('price limits apply to the selected operation currency', () => {
  assert.equal(typeof catalog.filterProperties, 'function');
  assert.deepEqual(catalog.filterProperties(sample, { operacion: 'alquilar', precio: '35000' }), []);
  assert.equal(catalog.filterProperties(sample, { precio: '35000' }).length, 3);
});

test('catalog count uses correct singular and plural', () => {
  assert.equal(typeof catalog.resultLabel, 'function');
  assert.equal(catalog.resultLabel(1), '1 propiedad encontrada');
  assert.equal(catalog.resultLabel(12), '12 propiedades encontradas');
});

test('property prices have one format across sale and rental views', () => {
  assert.equal(catalog.formatPropertyPrice({ moneda: 'USD', precio: 690000, operacion: 'comprar' }), 'USD 690.000');
  assert.equal(catalog.formatPropertyPrice({ moneda: 'UYU', precio: 49000, operacion: 'alquilar' }), 'UYU 49.000 / mes');
});

test('catalog includes twelve unique conceptual listings with local photos', () => {
  assert.equal(Array.isArray(catalog.properties), true);
  assert.equal(catalog.properties.length, 12);
  assert.equal(new Set(catalog.properties.map((property) => property.id)).size, 12);
  assert.equal(catalog.properties.every((property) => fs.existsSync(property.imagen)), true);
});
