const properties = [
  { id: 'casa-carrasco', titulo: 'Casa entre árboles', tipo: 'casa', tipoTexto: 'Casa', operacion: 'comprar', ubicacion: 'Carrasco, Montevideo', dormitorios: 4, banos: 3, superficie: 280, precio: 690000, moneda: 'USD', imagen: 'assets/images/casa-carrasco.jpg', alt: 'Casa contemporánea de ladrillo y madera entre árboles' },
  { id: 'apartamento-pocitos', titulo: 'Ambientes con luz natural', tipo: 'apartamento', tipoTexto: 'Apartamento', operacion: 'comprar', ubicacion: 'Pocitos, Montevideo', dormitorios: 3, banos: 2, superficie: 112, precio: 285000, moneda: 'USD', imagen: 'assets/images/apartamento-pocitos.jpg', alt: 'Comedor luminoso con mesa de madera y lámparas colgantes' },
  { id: 'loft-ciudad-vieja', titulo: 'Loft de escala abierta', tipo: 'apartamento', tipoTexto: 'Loft', operacion: 'alquilar', ubicacion: 'Ciudad Vieja, Montevideo', dormitorios: 1, banos: 1, superficie: 90, precio: 49000, moneda: 'UYU', imagen: 'assets/images/loft-ciudad-vieja.jpg', alt: 'Loft con ventanales altos y sala de estar de estilo industrial' },
  { id: 'apartamento-cordon', titulo: 'Un espacio para empezar', tipo: 'apartamento', tipoTexto: 'Apartamento', operacion: 'alquilar', ubicacion: 'Cordón, Montevideo', dormitorios: 2, banos: 1, superficie: 84, precio: 36000, moneda: 'UYU', imagen: 'assets/images/apartamento-cordon.jpg', alt: 'Apartamento vacío con piso de madera y ventanas amplias' },
  { id: 'apartamento-punta-carretas', titulo: 'Ambientes para compartir', tipo: 'apartamento', tipoTexto: 'Apartamento', operacion: 'comprar', ubicacion: 'Punta Carretas, Montevideo', dormitorios: 3, banos: 2, superficie: 128, precio: 340000, moneda: 'USD', imagen: 'assets/images/apartamento-punta-carretas.jpg', alt: 'Cocina abierta con isla y sala de estar luminosa' },
  { id: 'casa-parque-miramar', titulo: 'Jardín y vida al aire libre', tipo: 'casa', tipoTexto: 'Casa', operacion: 'comprar', ubicacion: 'Parque Miramar, Canelones', dormitorios: 3, banos: 2, superficie: 190, precio: 420000, moneda: 'USD', imagen: 'assets/images/casa-parque-miramar.jpg', alt: 'Casa moderna con jardín verde y ventanales al exterior' },
  { id: 'casa-la-tahona', titulo: 'Luz junto al jardín', tipo: 'casa', tipoTexto: 'Casa', operacion: 'comprar', ubicacion: 'La Tahona, Canelones', dormitorios: 4, banos: 3, superficie: 310, precio: 850000, moneda: 'USD', imagen: 'assets/images/casa-la-tahona.jpg', alt: 'Casa moderna con terraza, jardín y piscina' },
  { id: 'casa-punta-gorda', titulo: 'Líneas abiertas al paisaje', tipo: 'casa', tipoTexto: 'Casa', operacion: 'comprar', ubicacion: 'Punta Gorda, Montevideo', dormitorios: 4, banos: 3, superficie: 260, precio: 760000, moneda: 'USD', imagen: 'assets/images/casa-punta-gorda.jpg', alt: 'Fachada de una casa contemporánea blanca con vegetación' },
  { id: 'apartamento-parque-rodo', titulo: 'Un lugar para compartir', tipo: 'apartamento', tipoTexto: 'Apartamento', operacion: 'alquilar', ubicacion: 'Parque Rodó, Montevideo', dormitorios: 2, banos: 1, superficie: 92, precio: 42000, moneda: 'UYU', imagen: 'assets/images/apartamento-parque-rodo.jpg', alt: 'Sala y comedor de apartamento con luz natural' },
  { id: 'apartamento-buceo', titulo: 'Rincón junto a la terraza', tipo: 'apartamento', tipoTexto: 'Apartamento', operacion: 'alquilar', ubicacion: 'Buceo, Montevideo', dormitorios: 1, banos: 1, superficie: 68, precio: 38000, moneda: 'UYU', imagen: 'assets/images/apartamento-buceo.jpg', alt: 'Sala pequeña y luminosa abierta hacia una terraza' },
  { id: 'casa-colinas-carrasco', titulo: 'Una casa para reunirse', tipo: 'casa', tipoTexto: 'Casa', operacion: 'comprar', ubicacion: 'Colinas de Carrasco, Canelones', dormitorios: 3, banos: 2, superficie: 210, precio: 560000, moneda: 'USD', imagen: 'assets/images/casa-colinas-carrasco.jpg', alt: 'Sala con chimenea de ladrillo y ventanas hacia el jardín' },
  { id: 'casa-maldonado', titulo: 'Arquitectura de líneas simples', tipo: 'casa', tipoTexto: 'Casa', operacion: 'comprar', ubicacion: 'Maldonado, Maldonado', dormitorios: 4, banos: 3, superficie: 245, precio: 610000, moneda: 'USD', imagen: 'assets/images/casa-maldonado.jpg', alt: 'Casa de líneas modernas con acceso amplio y jardín' },
];

function normalizeText(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

function filterProperties(items, criteria = {}) {
  const location = normalizeText(criteria.ubicacion);
  const bedrooms = Number(criteria.dormitorios) || 0;
  const maxPrice = Number(criteria.precio) || 0;
  return items.filter((property) => {
    if (criteria.operacion && property.operacion !== criteria.operacion) return false;
    if (criteria.tipo && property.tipo !== criteria.tipo) return false;
    if (location && !normalizeText(property.ubicacion).includes(location)) return false;
    if (bedrooms && property.dormitorios < bedrooms) return false;
    if (criteria.operacion && maxPrice && property.precio > maxPrice) return false;
    return true;
  });
}

function resultLabel(count) {
  return `${count} ${count === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}`;
}

if (typeof module !== 'undefined') module.exports = { properties, filterProperties, resultLabel };

if (typeof document !== 'undefined') {
  const form = document.querySelector('#catalog-filters');

  if (form) {
    const grid = document.querySelector('#catalog-grid');
    const count = document.querySelector('#catalog-count');
    const empty = document.querySelector('#catalog-empty');
    const operation = form.elements.namedItem('operacion');
    const price = form.elements.namedItem('precio');
    const priceHelp = document.querySelector('#catalog-price-help');
    const priceOptions = {
      comprar: [[250000, 'Hasta USD 250.000'], [400000, 'Hasta USD 400.000'], [600000, 'Hasta USD 600.000'], [900000, 'Hasta USD 900.000']],
      alquilar: [[35000, 'Hasta UYU 35.000'], [45000, 'Hasta UYU 45.000'], [60000, 'Hasta UYU 60.000'], [80000, 'Hasta UYU 80.000']],
    };

    function setPriceOptions(selectedOperation, selectedPrice = '') {
      const options = priceOptions[selectedOperation];
      price.disabled = !options;
      priceHelp.textContent = selectedOperation === 'comprar'
        ? 'Precios de venta en USD.'
        : selectedOperation === 'alquilar'
          ? 'Alquileres en UYU por mes.'
          : 'Elegí Comprar o Alquilar para filtrar por precio.';
      price.innerHTML = options
        ? `<option value="">Sin límite</option>${options.map(([value, label]) => `<option value="${value}">${label}</option>`).join('')}`
        : '<option value="">Elegí primero</option>';
      if (options?.some(([value]) => String(value) === selectedPrice)) price.value = selectedPrice;
    }

    function currentCriteria() {
      return Object.fromEntries(new FormData(form).entries());
    }

    function cardMarkup(property) {
      const badge = property.operacion === 'comprar' ? 'En venta' : 'En alquiler';
      const priceText = `${property.moneda} ${new Intl.NumberFormat('es-UY').format(property.precio)}${property.operacion === 'alquilar' ? ' / mes' : ''}`;
      return `<article class="catalog-card">
        <a class="catalog-card__link" href="propiedad.html?id=${property.id}">
          <div class="catalog-card__media">
            <img src="${property.imagen}" alt="${property.alt}" width="1200" height="800" loading="lazy" decoding="async">
            <span class="catalog-card__badge">${badge}</span>
          </div>
          <div class="catalog-card__details">
            <p class="catalog-card__location">${property.tipoTexto} · ${property.ubicacion}</p>
            <div class="catalog-card__heading"><h3>${property.titulo}</h3><span aria-hidden="true"><span class="icon icon--arrow-up-right"></span></span></div>
            <p class="catalog-card__price">${priceText}</p>
            <ul class="catalog-card__specs" aria-label="Características de la propiedad"><li>${property.dormitorios} ${property.dormitorios === 1 ? 'dormitorio' : 'dormitorios'}</li><li>${property.banos} ${property.banos === 1 ? 'baño' : 'baños'}</li><li>${property.superficie} m²</li></ul>
          </div>
        </a>
      </article>`;
    }

    function syncUrl(criteria) {
      const params = new URLSearchParams();
      ['operacion', 'tipo', 'ubicacion', 'dormitorios', 'precio'].forEach((name) => {
        const value = String(criteria[name] || '').trim();
        if (value) params.set(name, value);
      });
      const query = params.toString();
      window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
    }

    function render(animate = false) {
      const criteria = currentCriteria();
      const matches = filterProperties(properties, criteria);
      count.textContent = resultLabel(matches.length);
      grid.classList.toggle('is-filtering', animate);
      grid.innerHTML = matches.map(cardMarkup).join('');
      grid.hidden = matches.length === 0;
      empty.hidden = matches.length !== 0;
      syncUrl(criteria);
    }

    function clearFilters() {
      form.reset();
      setPriceOptions('');
      render(true);
    }

    const query = new URLSearchParams(window.location.search);
    ['operacion', 'tipo', 'ubicacion', 'dormitorios'].forEach((name) => {
      const control = form.elements.namedItem(name);
      const value = query.get(name) || '';
      if (control.tagName === 'INPUT' || [...control.options].some((option) => option.value === value)) control.value = value;
    });
    setPriceOptions(operation.value, query.get('precio') || '');

    form.addEventListener('submit', (event) => event.preventDefault());
    form.addEventListener('input', (event) => {
      if (event.target.name === 'ubicacion') render();
    });
    form.addEventListener('change', (event) => {
      if (event.target === operation) setPriceOptions(operation.value);
      render(event.target.name !== 'ubicacion');
    });
    document.querySelector('#catalog-clear').addEventListener('click', clearFilters);
    document.querySelector('#catalog-empty-clear').addEventListener('click', clearFilters);
    render();
  }
}
