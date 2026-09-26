const detailProperties = typeof module !== 'undefined' ? require('./propiedades.js').properties : properties;

const detailData = {
  'casa-carrasco': { nombre: 'Casa contemporánea en Carrasco', garaje: 2, descripcion: 'Casa de 280 m² con cuatro dormitorios y tres baños. La fachada combina ladrillo y madera, rodeada por un jardín arbolado que da privacidad a los espacios.', caracteristicas: ['Jardín', 'Terraza', 'Garaje', 'Calefacción'] },
  'apartamento-pocitos': { nombre: 'Apartamento luminoso en Pocitos', garaje: 1, descripcion: 'Apartamento de 112 m² con tres dormitorios y dos baños. El comedor recibe luz natural y se integra a una zona de estar pensada para la vida cotidiana.', caracteristicas: ['Garaje', 'Ascensor', 'Calefacción'] },
  'loft-ciudad-vieja': { nombre: 'Loft de escala abierta en Ciudad Vieja', garaje: 0, descripcion: 'Loft de 90 m² con un dormitorio y un baño. Los ventanales altos y la planta abierta permiten organizar el espacio de distintas maneras.', caracteristicas: ['Ambiente integrado', 'Ventanales altos', 'Ascensor'] },
  'apartamento-cordon': { nombre: 'Apartamento abierto en Cordón', garaje: 0, descripcion: 'Apartamento de 84 m² con dos dormitorios y un baño. Los pisos de madera y las ventanas amplias ofrecen una base simple para hacerlo propio.', caracteristicas: ['Pisos de madera', 'Luz natural', 'Ascensor'] },
  'apartamento-punta-carretas': { nombre: 'Apartamento con cocina integrada en Punta Carretas', garaje: 1, descripcion: 'Apartamento de 128 m² con tres dormitorios y dos baños. La cocina con isla se abre a la sala de estar y reúne las actividades del día a día.', caracteristicas: ['Cocina integrada', 'Garaje', 'Ascensor', 'Calefacción'] },
  'casa-parque-miramar': { nombre: 'Casa con jardín en Parque Miramar', garaje: 2, descripcion: 'Casa de 190 m² con tres dormitorios y dos baños. Sus ventanales miran al jardín y conectan las áreas interiores con el espacio al aire libre.', caracteristicas: ['Jardín', 'Garaje', 'Terraza'] },
  'casa-la-tahona': { nombre: 'Casa con piscina en La Tahona', garaje: 2, descripcion: 'Casa de 310 m² con cuatro dormitorios y tres baños. La terraza y la piscina forman un área exterior amplia para disfrutar del jardín.', caracteristicas: ['Piscina', 'Jardín', 'Terraza', 'Garaje'] },
  'casa-punta-gorda': { nombre: 'Casa contemporánea en Punta Gorda', garaje: 2, descripcion: 'Casa de 260 m² con cuatro dormitorios y tres baños. Su fachada de líneas simples incorpora vegetación y una relación directa con el jardín.', caracteristicas: ['Jardín', 'Garaje', 'Calefacción'] },
  'apartamento-parque-rodo': { nombre: 'Apartamento para compartir en Parque Rodó', garaje: 0, descripcion: 'Apartamento de 92 m² con dos dormitorios y un baño. La sala y el comedor comparten un ambiente flexible con buena entrada de luz.', caracteristicas: ['Luz natural', 'Ascensor', 'Calefacción'] },
  'apartamento-buceo': { nombre: 'Apartamento con terraza en Buceo', garaje: 0, descripcion: 'Apartamento de 68 m² con un dormitorio y un baño. La sala se abre a una terraza que suma un espacio exterior a la planta compacta.', caracteristicas: ['Terraza', 'Luz natural', 'Ascensor'] },
  'casa-colinas-carrasco': { nombre: 'Casa con chimenea en Colinas de Carrasco', garaje: 2, descripcion: 'Casa de 210 m² con tres dormitorios y dos baños. La sala con chimenea mira al jardín y ofrece un lugar cómodo para reunirse.', caracteristicas: ['Chimenea', 'Jardín', 'Garaje', 'Calefacción'] },
  'casa-maldonado': { nombre: 'Casa de líneas modernas en Maldonado', garaje: 2, descripcion: 'Casa de 245 m² con cuatro dormitorios y tres baños. La entrada amplia y la composición de volúmenes simples definen su carácter exterior.', caracteristicas: ['Garaje', 'Jardín', 'Terraza'] },
};

const houseGallery = [
  { src: 'assets/images/historia-interior.jpg', alt: 'Interior contemporáneo abierto hacia el jardín' },
  { src: 'assets/images/apartamento-punta-carretas.jpg', alt: 'Cocina amplia con isla y sala de estar' },
  { src: 'assets/images/casa-colinas-carrasco.jpg', alt: 'Sala con chimenea y vista al jardín' },
  { src: 'assets/images/apartamento-pocitos.jpg', alt: 'Comedor luminoso con materiales naturales' },
  { src: 'assets/images/casa-la-tahona.jpg', alt: 'Terraza y jardín de una casa contemporánea' },
];

const apartmentGallery = [
  { src: 'assets/images/apartamento-pocitos.jpg', alt: 'Comedor con luz natural y mesa de madera' },
  { src: 'assets/images/apartamento-punta-carretas.jpg', alt: 'Cocina integrada y sala de estar' },
  { src: 'assets/images/apartamento-parque-rodo.jpg', alt: 'Sala y comedor en tonos neutros' },
  { src: 'assets/images/apartamento-buceo.jpg', alt: 'Sala abierta hacia una terraza' },
  { src: 'assets/images/loft-ciudad-vieja.jpg', alt: 'Loft con ventanales altos' },
  { src: 'assets/images/apartamento-cordon.jpg', alt: 'Apartamento vacío con piso de madera' },
];

function getPropertyById(id) {
  return detailProperties.find((property) => property.id === id) || null;
}

function getGallery(property) {
  const pool = property.tipo === 'casa' ? houseGallery : apartmentGallery;
  return [
    { src: property.imagen, alt: property.alt, kind: 'listing' },
    ...pool.filter((image) => image.src !== property.imagen).slice(0, 4).map((image) => ({ ...image, kind: 'reference' })),
  ];
}

function getRelatedProperties(property, count = 3) {
  const city = property.ubicacion.split(', ')[1];
  return detailProperties
    .filter((item) => item.id !== property.id)
    .sort((a, b) => {
      const score = (item) => Number(item.tipo === property.tipo) * 4 + Number(item.operacion === property.operacion) * 2 + Number(item.ubicacion.endsWith(city));
      return score(b) - score(a);
    })
    .slice(0, count);
}

function validateVisit(values) {
  const errors = {};
  const name = values.nombre?.trim() || '';
  const email = values.email?.trim() || '';
  const phone = values.telefono?.trim() || '';
  const message = values.mensaje?.trim() || '';
  if (!name) errors.nombre = 'Ingresá tu nombre.';
  else if (name.length > 80) errors.nombre = 'El nombre debe tener 80 caracteres o menos.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Ingresá un email válido.';
  else if (email.length > 254) errors.email = 'El email debe tener 254 caracteres o menos.';
  if (phone && phone.replace(/\D/g, '').length < 7) errors.telefono = 'Ingresá un teléfono válido o dejá el campo vacío.';
  else if (phone.length > 40) errors.telefono = 'El teléfono debe tener 40 caracteres o menos.';
  if (message.length < 10) errors.mensaje = 'Escribí un mensaje de al menos 10 caracteres.';
  else if (message.length > 2000) errors.mensaje = 'El mensaje debe tener 2000 caracteres o menos.';
  return errors;
}

if (typeof module !== 'undefined') module.exports = { getPropertyById, getGallery, getRelatedProperties, validateVisit };

if (typeof document !== 'undefined') {
  const property = getPropertyById(new URLSearchParams(window.location.search).get('id'));
  const title = document.querySelector('#detail-title');
  const content = document.querySelector('#detail-content');
  const missing = document.querySelector('#detail-missing');

  if (!property) {
    title.textContent = 'No encontramos esta propiedad.';
    document.title = 'Propiedad no encontrada — Nórdica Propiedades';
    document.querySelector('#detail-intro-meta').hidden = true;
    missing.hidden = false;
  } else {
    const extra = detailData[property.id];
    document.querySelector('#detail-intro-image').src = property.imagen;
    document.querySelector('#detail-intro-visual').hidden = false;
    document.querySelector('.detail-intro').classList.add('has-image');
    const galleryImages = getGallery(property);
    const price = `${property.moneda} ${new Intl.NumberFormat('es-UY').format(property.precio)}${property.operacion === 'alquilar' ? ' / mes' : ''}`;
    title.textContent = extra.nombre;
    document.title = `${extra.nombre} — Nórdica Propiedades`;
    document.querySelector('meta[name="description"]').content = `${extra.nombre}. ${property.superficie} m², ${property.dormitorios} dormitorios. Proyecto conceptual de Nórdica Propiedades.`;
    document.querySelector('#detail-location').textContent = property.ubicacion;
    document.querySelector('#detail-price').textContent = price;
    document.querySelector('#detail-operation').textContent = property.operacion === 'comprar' ? 'En venta' : 'En alquiler';
    const gallery = document.querySelector('#detail-gallery');
    gallery.innerHTML = galleryImages.map((image, index) => `<figure class="detail-gallery__item"><button class="detail-gallery__trigger" type="button" data-gallery-index="${index}" aria-label="Abrir galería, ${image.kind === 'listing' ? 'imagen del anuncio' : 'referencia visual de otro espacio'}, imagen ${index + 1} de ${galleryImages.length}: ${image.alt}"><img src="${image.src}" alt="${image.alt}" width="1200" height="800" ${index === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"><span class="detail-gallery__badge">${image.kind === 'listing' ? 'Imagen del anuncio' : 'Referencia visual'}</span></button></figure>`).join('');
    document.querySelector('#detail-facts').innerHTML = [
      ['Superficie', `${property.superficie} m²`],
      ['Dormitorios', String(property.dormitorios)], ['Baños', String(property.banos)],
      ['Garaje', extra.garaje ? `${extra.garaje} ${extra.garaje === 1 ? 'lugar' : 'lugares'}` : 'No incluido'],
      ['Tipo', property.tipoTexto], ['Operación', property.operacion === 'comprar' ? 'Venta' : 'Alquiler'],
    ].map(([label, value]) => `<div class="detail-fact"><dt>${label}</dt><dd>${value}</dd></div>`).join('');
    document.querySelector('#detail-description').textContent = extra.descripcion;
    document.querySelector('#detail-features').innerHTML = extra.caracteristicas.map((feature) => `<li>${feature}</li>`).join('');
    document.querySelector('#detail-reference').textContent = `Referencia: ${property.id.toUpperCase()}`;
    document.querySelector('#visit-property').defaultValue = property.id;
    document.querySelector('#detail-related').innerHTML = getRelatedProperties(property).map((item) => `<article class="detail-related__card"><a href="propiedad.html?id=${item.id}"><div class="detail-related__media"><img src="${item.imagen}" alt="${item.alt}" width="1200" height="800" loading="lazy" decoding="async"></div><p>${item.tipoTexto} · ${item.ubicacion}</p><h3>${detailData[item.id].nombre}</h3><span>${item.moneda} ${new Intl.NumberFormat('es-UY').format(item.precio)}${item.operacion === 'alquilar' ? ' / mes' : ''}</span></a></article>`).join('');
    content.hidden = false;

    const viewer = document.querySelector('#photo-viewer');
    const viewerImage = document.querySelector('#photo-viewer-image');
    const viewerCount = document.querySelector('#photo-viewer-count');
    const viewerCaption = document.querySelector('#photo-viewer-caption');
    const thumbnails = document.querySelector('#photo-viewer-thumbnails');
    let activeImage = 0;
    let openingButton = null;

    document.querySelector('#photo-viewer-title').textContent = extra.nombre;
    thumbnails.innerHTML = galleryImages.map((image, index) => `<button type="button" data-gallery-index="${index}" aria-label="Ver ${image.kind === 'listing' ? 'imagen del anuncio' : 'referencia visual de otro espacio'} ${index + 1}: ${image.alt}" aria-pressed="false"><img src="${image.src}" alt="" width="96" height="72" loading="lazy"></button>`).join('');

    function showImage(index) {
      activeImage = (index + galleryImages.length) % galleryImages.length;
      const image = galleryImages[activeImage];
      viewerImage.src = image.src;
      viewerImage.alt = image.alt;
      viewerCount.textContent = `${activeImage + 1} / ${galleryImages.length}`;
      viewerCaption.textContent = `${image.kind === 'listing' ? 'Imagen del anuncio' : 'Referencia visual de otro espacio'} · ${image.alt}`;
      thumbnails.querySelectorAll('button').forEach((button, buttonIndex) => {
        button.setAttribute('aria-pressed', String(buttonIndex === activeImage));
      });
      if (viewer.open) thumbnails.querySelector(`[data-gallery-index="${activeImage}"]`).scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    gallery.addEventListener('click', (event) => {
      const button = event.target.closest('[data-gallery-index]');
      if (!button) return;
      openingButton = button;
      showImage(Number(button.dataset.galleryIndex));
      viewer.showModal();
      document.body.classList.add('photo-viewer-open');
      document.querySelector('#photo-viewer-close').focus();
    });

    thumbnails.addEventListener('click', (event) => {
      const button = event.target.closest('[data-gallery-index]');
      if (button) showImage(Number(button.dataset.galleryIndex));
    });

    document.querySelector('#photo-viewer-previous').addEventListener('click', () => showImage(activeImage - 1));
    document.querySelector('#photo-viewer-next').addEventListener('click', () => showImage(activeImage + 1));
    document.querySelector('#photo-viewer-close').addEventListener('click', () => viewer.close());
    viewer.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        showImage(activeImage + (event.key === 'ArrowRight' ? 1 : -1));
      }
    });
    viewer.addEventListener('click', (event) => {
      if (event.target === viewer) viewer.close();
    });
    viewer.addEventListener('close', () => {
      document.body.classList.remove('photo-viewer-open');
      openingButton?.focus();
    });

    const form = document.querySelector('#visit-form');
    const success = document.querySelector('#visit-success');
    const restart = success.querySelector('button');
    const fields = ['nombre', 'email', 'telefono', 'mensaje'];

    function values() {
      return Object.fromEntries(fields.map((name) => [name, form.elements.namedItem(name).value]));
    }

    function setError(name, message = '') {
      const field = form.elements.namedItem(name);
      document.querySelector(`#visit-${name}-error`).textContent = message;
      if (message) field.setAttribute('aria-invalid', 'true');
      else field.removeAttribute('aria-invalid');
    }

    fields.forEach((name) => {
      const field = form.elements.namedItem(name);
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') setError(name, validateVisit(values())[name]);
      });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const errors = validateVisit(values());
      fields.forEach((name) => setError(name, errors[name]));
      const firstInvalid = fields.find((name) => errors[name]);
      if (firstInvalid) {
        form.elements.namedItem(firstInvalid).focus();
        return;
      }
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    });

    restart.addEventListener('click', () => {
      form.reset();
      fields.forEach((name) => setError(name));
      success.hidden = true;
      form.hidden = false;
      form.elements.namedItem('nombre').focus();
    });

    form.hidden = false;
  }
}
