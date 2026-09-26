const NEWSLETTER_DELAY_MS = 3000;
const NEWSLETTER_STARTED_KEY = 'nordica-newsletter-started';
const NEWSLETTER_SHOWN_KEY = 'nordica-newsletter-shown';

function getNewsletterDelay(now, storedStart, wasShown) {
  if (wasShown) return null;
  const parsedStart = Number(storedStart);
  const startedAt = Number.isFinite(parsedStart) && parsedStart > 0 && parsedStart <= now ? parsedStart : now;
  return { startedAt, delay: Math.max(0, NEWSLETTER_DELAY_MS - (now - startedAt)) };
}

function isNewsletterEligiblePath(pathname) {
  return pathname === '/' || /\/(?:index|propiedades)\.html$/.test(pathname);
}

if (typeof module !== 'undefined') module.exports = { getNewsletterDelay, isNewsletterEligiblePath };

if (typeof document !== 'undefined' && document.body && typeof HTMLDialogElement !== 'undefined' && isNewsletterEligiblePath(window.location.pathname)) {
  let storedStart = null;
  let wasShown = false;
  try {
    storedStart = sessionStorage.getItem(NEWSLETTER_STARTED_KEY);
    wasShown = sessionStorage.getItem(NEWSLETTER_SHOWN_KEY) === '1';
  } catch {
    // The modal still works when session storage is unavailable.
  }

  const schedule = getNewsletterDelay(Date.now(), storedStart, wasShown);

  if (schedule) {
    try {
      sessionStorage.setItem(NEWSLETTER_STARTED_KEY, String(schedule.startedAt));
    } catch {
      // Storage access is optional.
    }

    const dialog = document.createElement('dialog');
    dialog.className = 'newsletter-dialog';
    dialog.setAttribute('aria-labelledby', 'newsletter-title');
    dialog.setAttribute('aria-describedby', 'newsletter-description');
    dialog.innerHTML = `
      <div class="newsletter-dialog__layout">
        <figure class="newsletter-dialog__visual">
          <img src="assets/images/historia-interior.jpg" width="1800" height="1200" alt="Interior luminoso con ventanales y espacio de estar" decoding="async">
        </figure>
        <div class="newsletter-dialog__content">
          <button class="newsletter-dialog__close" type="button" aria-label="Cerrar novedades"><span class="icon icon--close" aria-hidden="true"></span></button>
          <div class="newsletter-dialog__body">
            <h2 id="newsletter-title">Tu próximo lugar puede estar más cerca.</h2>
            <p id="newsletter-description">Probá cómo sería recibir novedades de propiedades seleccionadas.</p>
            <form class="newsletter-dialog__form">
              <label for="newsletter-email">Tu correo electrónico</label>
              <input id="newsletter-email" name="email" type="email" autocomplete="email" inputmode="email" placeholder="nombre@correo.com" maxlength="254" required>
              <button class="button button--dark" type="submit">Simular suscripción</button>
            </form>
            <div class="newsletter-dialog__success" role="status" hidden>
              <h3>Suscripción simulada.</h3>
              <p>No se envió ni guardó tu correo.</p>
              <a href="propiedades.html">Explorar propiedades <span class="icon icon--arrow-up-right" aria-hidden="true"></span></a>
            </div>
            <p class="newsletter-dialog__note">Demostración: no enviamos ni guardamos tu correo.</p>
            <button class="newsletter-dialog__later" type="button">Ahora no</button>
          </div>
        </div>
      </div>
    `;
    document.body.append(dialog);

    const closeDialog = () => dialog.close();
    dialog.querySelector('.newsletter-dialog__close').addEventListener('click', closeDialog);
    dialog.querySelector('.newsletter-dialog__later').addEventListener('click', closeDialog);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeDialog();
    });
    dialog.querySelector('form').addEventListener('submit', (event) => {
      event.preventDefault();
      dialog.querySelector('form').reset();
      dialog.querySelector('form').hidden = true;
      dialog.querySelector('.newsletter-dialog__success').hidden = false;
      dialog.querySelector('.newsletter-dialog__note').hidden = true;
      dialog.querySelector('.newsletter-dialog__success a').focus();
    });

    function showNewsletter() {
      if (document.hidden) {
        document.addEventListener('visibilitychange', showNewsletter, { once: true });
        return;
      }
      const openDialog = document.querySelector('dialog[open]');
      if (openDialog && openDialog !== dialog) {
        openDialog.addEventListener('close', showNewsletter, { once: true });
        return;
      }
      dialog.showModal();
      try {
        sessionStorage.setItem(NEWSLETTER_SHOWN_KEY, '1');
      } catch {
        // A new page visit may show the modal again if storage is unavailable.
      }
    }

    window.setTimeout(showNewsletter, schedule.delay);
  }
}
