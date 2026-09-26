const contactReasons = new Set(['comprar', 'vender', 'alquilar', 'alquilar_propiedad', 'tasacion', 'otro']);

function resolveContactReason(search) {
  const reason = new URLSearchParams(search).get('motivo')?.toLowerCase() || '';
  return contactReasons.has(reason) ? reason : '';
}

function getMessageGuidance(reason) {
  const guidance = {
    comprar: 'Incluí la zona, el tipo de propiedad y tu presupuesto aproximado.',
    vender: 'Contanos dónde está tu propiedad, qué tipo es y cuándo te gustaría vender.',
    alquilar: 'Incluí la zona, el tipo de propiedad y el presupuesto mensual que buscás.',
    alquilar_propiedad: 'Contanos dónde está tu propiedad, qué tipo es y desde cuándo estaría disponible.',
    tasacion: 'Indicá la zona, el tipo de propiedad y su superficie aproximada.',
  };
  return guidance[reason] || 'Contanos qué necesitás y los datos que nos ayuden a entender tu consulta.';
}

function validateContact(values) {
  const errors = {};
  const name = values.nombre?.trim() || '';
  const lastName = values.apellido?.trim() || '';
  const email = values.email?.trim() || '';
  const phone = values.telefono?.trim() || '';
  const message = values.mensaje?.trim() || '';
  if (!name) errors.nombre = 'Ingresá tu nombre.';
  else if (name.length > 80) errors.nombre = 'El nombre debe tener 80 caracteres o menos.';
  if (!lastName) errors.apellido = 'Ingresá tu apellido.';
  else if (lastName.length > 80) errors.apellido = 'El apellido debe tener 80 caracteres o menos.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Ingresá un email válido.';
  else if (email.length > 254) errors.email = 'El email debe tener 254 caracteres o menos.';
  if (phone && phone.replace(/\D/g, '').length < 7) errors.telefono = 'Ingresá un teléfono válido o dejá el campo vacío.';
  else if (phone.length > 40) errors.telefono = 'El teléfono debe tener 40 caracteres o menos.';
  if (!contactReasons.has(values.motivo)) errors.motivo = 'Seleccioná el motivo de tu consulta.';
  if (message.length < 10) errors.mensaje = 'Contanos un poco más (al menos 10 caracteres).';
  else if (message.length > 2000) errors.mensaje = 'El mensaje debe tener 2000 caracteres o menos.';
  if (!values.aceptacion) errors.aceptacion = 'Confirmá que entendés cómo funciona esta demostración.';
  return errors;
}

if (typeof module !== 'undefined') module.exports = { resolveContactReason, getMessageGuidance, validateContact };

if (typeof document !== 'undefined') {
  const form = document.querySelector('#contact-form');

  if (form) {
    const success = document.querySelector('#contact-success');
    const restartButton = success.querySelector('button');
    const messageGuidance = document.querySelector('#mensaje-ayuda');
    const reasonField = form.elements.namedItem('motivo');
    const fieldNames = ['nombre', 'apellido', 'email', 'telefono', 'motivo', 'mensaje', 'aceptacion'];
    const initialReason = resolveContactReason(window.location.search);
    if (initialReason) reasonField.value = initialReason;

    function updateMessageGuidance() {
      messageGuidance.textContent = getMessageGuidance(reasonField.value);
    }
    updateMessageGuidance();
    reasonField.addEventListener('change', updateMessageGuidance);

    function setError(name, message = '') {
      const field = form.elements.namedItem(name);
      const error = document.querySelector(`#${name}-error`);
      error.textContent = message;
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }

    function values() {
      return {
        nombre: form.elements.namedItem('nombre').value,
        apellido: form.elements.namedItem('apellido').value,
        email: form.elements.namedItem('email').value,
        telefono: form.elements.namedItem('telefono').value,
        motivo: form.elements.namedItem('motivo').value,
        mensaje: form.elements.namedItem('mensaje').value,
        aceptacion: form.elements.namedItem('aceptacion').checked,
      };
    }

    fieldNames.forEach((name) => {
      const field = form.elements.namedItem(name);
      const eventName = name === 'motivo' || name === 'aceptacion' ? 'change' : 'input';
      field.addEventListener(eventName, () => {
        if (field.getAttribute('aria-invalid') === 'true') setError(name, validateContact(values())[name]);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const errors = validateContact(values());
      fieldNames.forEach((name) => setError(name, errors[name]));
      const firstInvalid = fieldNames.find((name) => errors[name]);
      if (firstInvalid) {
        form.elements.namedItem(firstInvalid).focus();
        return;
      }

      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    restartButton.addEventListener('click', () => {
      form.reset();
      fieldNames.forEach((name) => setError(name));
      if (initialReason) reasonField.value = initialReason;
      updateMessageGuidance();
      success.hidden = true;
      form.hidden = false;
      form.elements.namedItem('nombre').focus();
    });

    form.hidden = false;
  }
}
