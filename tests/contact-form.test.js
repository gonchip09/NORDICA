const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const formLogic = fs.existsSync('js/formulario.js') ? require('../js/formulario.js') : {};

test('contact form identifies missing and malformed values by field', () => {
  assert.equal(typeof formLogic.validateContact, 'function');
  const errors = formLogic.validateContact({
    nombre: ' ', apellido: '', email: 'incorrecto', telefono: '123',
    motivo: '', mensaje: 'hola', aceptacion: false,
  });
  assert.deepEqual(Object.keys(errors).sort(), [
    'aceptacion', 'apellido', 'email', 'mensaje', 'motivo', 'nombre', 'telefono',
  ]);
});

test('contact form accepts valid details and optional empty phone', () => {
  assert.equal(typeof formLogic.validateContact, 'function');
  assert.deepEqual(formLogic.validateContact({
    nombre: 'Ana', apellido: 'Pérez', email: 'ana@example.com', telefono: '',
    motivo: 'vender', mensaje: 'Quiero vender mi propiedad en Montevideo.', aceptacion: true,
  }), {});
});

test('contact form rejects values beyond the visible field limits', () => {
  const errors = formLogic.validateContact({
    nombre: 'a'.repeat(81), apellido: 'b'.repeat(81), email: `${'a'.repeat(250)}@example.com`,
    telefono: '1'.repeat(41), motivo: 'comprar', mensaje: 'a'.repeat(2001), aceptacion: true,
  });
  assert.deepEqual(Object.keys(errors).sort(), ['apellido', 'email', 'mensaje', 'nombre', 'telefono']);
});

test('contact reason only accepts known URL values', () => {
  assert.equal(typeof formLogic.resolveContactReason, 'function');
  assert.equal(formLogic.resolveContactReason('?motivo=tasacion'), 'tasacion');
  assert.equal(formLogic.resolveContactReason('?motivo=vender'), 'vender');
  assert.equal(formLogic.resolveContactReason('?motivo=alquilar_propiedad'), 'alquilar_propiedad');
  assert.equal(formLogic.resolveContactReason('?motivo=desconocido'), '');
});

test('message guidance follows the selected contact reason', () => {
  assert.equal(typeof formLogic.getMessageGuidance, 'function');
  assert.match(formLogic.getMessageGuidance('comprar'), /zona.*presupuesto/i);
  assert.match(formLogic.getMessageGuidance('vender'), /propiedad.*vender/i);
  assert.match(formLogic.getMessageGuidance('alquilar_propiedad'), /propiedad.*disponible/i);
  assert.match(formLogic.getMessageGuidance('tasacion'), /superficie/i);
  assert.match(formLogic.getMessageGuidance(''), /consulta/i);
});
