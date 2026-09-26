function validateBasicContactFields(values) {
  const errors = {};
  const name = values.nombre?.trim() || '';
  const email = values.email?.trim() || '';
  const phone = values.telefono?.trim() || '';

  if (!name) errors.nombre = 'Ingresá tu nombre.';
  else if (name.length > 80) errors.nombre = 'El nombre debe tener 80 caracteres o menos.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Usá un correo con formato nombre@dominio.com.';
  else if (email.length > 254) errors.email = 'El email debe tener 254 caracteres o menos.';
  if (phone && phone.replace(/\D/g, '').length < 7) errors.telefono = 'Ingresá al menos 7 números o dejá el campo vacío.';
  else if (phone.length > 40) errors.telefono = 'El teléfono debe tener 40 caracteres o menos.';

  return errors;
}

if (typeof module !== 'undefined') module.exports = { validateBasicContactFields };
