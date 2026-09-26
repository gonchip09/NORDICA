const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function loadScripts(files, globals = {}) {
  const context = vm.createContext(globals);
  context.window = context;
  for (const file of files) vm.runInContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return context;
}

test('shared validation loads with the contact form in classic scripts', () => {
  const context = loadScripts(['js/validacion.js', 'js/formulario.js']);
  assert.equal(typeof context.validateBasicContactFields, 'function');
});

test('shared validation and catalog load with the property detail in classic scripts', () => {
  const context = loadScripts(['js/propiedades.js', 'js/validacion.js', 'js/propiedad.js']);
  assert.equal(typeof context.validateBasicContactFields, 'function');
});
