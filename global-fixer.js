/* global-fixer.js — Maquinasa
 *
 * Script inyectado en TODAS las paginas de www.maquinasa.es via
 * Webflow Site Settings → Custom Code → Footer.
 *
 * Contiene los fixes globales: headers, home, footer, GDPR, WhatsApp, equipo.
 * Los fixes especificos de /all-services viven en services-fix.js.
 * Los fixes especificos de /propiedad/* viven en properties-fix.js.
 */
(function () {
  'use strict';

  var DEBUG = false;
  function log() { if (DEBUG) console.log.apply(console, ['[maquinasa]'].concat([].slice.call(arguments))); }

  // Helper: inyecta una etiqueta <style> con CSS global
  function injectCSS(id, css) {
    if (document.getElementById(id)) return;
    var style = document.createElement('style');
    style.id = id;
    style.setAttribute('data-maquinasa', '1');
    style.textContent = css;
    document.head.appendChild(style);
  }

  // =====================================================================
  // F2.1 — Home: reducir cards de 3 a 2 (INMOBILIARIA + ASESORAMIENTO)
  // =====================================================================
  // El home tiene 3 cards: Inmobiliaria, Automocion, y una tercera.
  // El cliente quiere dejar solo 2: INMOBILIARIA y ASESORAMIENTO,
  // centradas, con flechas apuntando a /all-services#inmobiliaria y
  // /all-services#asesoramiento.
  function fixHomeCards() {
    var cards = document.querySelectorAll('.home-features-wrap-home-2');
    if (cards.length === 0) return;

    // Card 1: cambiar texto a INMOBILIARIA y actualizar enlace
    if (cards[0]) {
      var h3 = cards[0].querySelector('.heading-cart');
      if (h3) h3.textContent = 'INMOBILIARIA';
      var p = cards[0].querySelector('.paragraph-large');
      if (p) p.textContent = 'Te acompañamos en la compra, venta y alquiler de inmuebles con profesionalidad y transparencia.';
      var arrow = cards[0].querySelector('a.button-arrow');
      if (arrow) arrow.setAttribute('href', '/all-services#inmobiliaria');
    }

    // Card 2: cambiar a ASESORAMIENTO
    if (cards[1]) {
      var h3b = cards[1].querySelector('.heading-cart');
      if (h3b) h3b.textContent = 'ASESORAMIENTO';
      var pb = cards[1].querySelector('.paragraph-large');
      if (pb) pb.textContent = 'Expertos en planificación estratégica y desarrollo de negocio para tu empresa.';
      var arrowb = cards[1].querySelector('a.button-arrow');
      if (arrowb) arrowb.setAttribute('href', '/all-services#asesoramiento');
    }

    // Card 3 (y siguientes): ocultar
    for (var i = 2; i < cards.length; i++) {
      cards[i].style.display = 'none';
    }

    // Centrar el contenedor flex de cards
    injectCSS('maquinasa-home-cards', [
      '.home-features-wrapper.home-2,',
      '.home-features-wrapper {',
      '  justify-content: center !important;',
      '  gap: 30px;',
      '}',
      '.home-features-wrap-home-2 {',
      '  max-width: 400px;',
      '}'
    ].join('\n'));
    log('F2.1 home cards -> 2 centradas');
  }

  // =====================================================================
  // F3.1 — Quienes Somos: añadir seccion "Nuestro Equipo"
  // =====================================================================
  // Se inyecta DESPUES de la seccion que contiene "¿Que nos hace diferentes?"
  // (identificada por h2 con id="provide-assistance"). Layout 50/50 desktop
  // imagen izquierda + texto derecha, stacked mobile.
  function fixTeamSection() {
    if (!/about-us/.test(location.href)) return;
    if (document.querySelector('.maquinasa-team-section')) return;

    // Anchor: buscar el h2 que contiene 'diferentes' (el template tiene
    // 3 h2s con id duplicado #provide-assistance por lo que querySelector
    // por id no sirve). Buscamos por texto en el h2.
    var diffHeading = null;
    var allH2 = document.querySelectorAll('h2');
    for (var i = 0; i < allH2.length; i++) {
      if (/diferentes/i.test(allH2[i].textContent)) {
        diffHeading = allH2[i];
        break;
      }
    }
    if (!diffHeading) {
      // Fallback: usar el grid de bloques (Mision/Vision/Valores) que
      // solo existe en about-us, justo despues del h2 de 'diferentes'.
      var grid = document.querySelector('.grid-content.home-2');
      if (!grid) return;
      diffHeading = grid;
    }

    // Subimos a la .section que contiene la heading y el grid, para
    // inyectar la nueva seccion como hermana (no anidada dentro).
    var insertAfterNode = diffHeading.closest('.section') || diffHeading.parentNode;
    if (!insertAfterNode) return;

    // Forzar "Maquinasa, ¿Que nos hace diferentes?" en una sola linea en desktop
    injectCSS('maquinasa-diferentes-oneline', [
      '@media (min-width: 992px) {',
      '  .heading-span {',
      '    white-space: nowrap;',
      '  }',
      '}'
    ].join('\n'));

    var teamHTML = [
      '<section class="maquinasa-team-section">',
      '  <div class="maquinasa-team-container">',
      '    <div class="maquinasa-team-image-wrap">',
      '      <div class="maquinasa-team-image-placeholder">',
      '        <span>Foto del equipo<br><small>(pendiente del cliente)</small></span>',
      '      </div>',
      '    </div>',
      '    <div class="maquinasa-team-text-wrap">',
      '      <h2 class="maquinasa-team-heading">Nuestro Equipo</h2>',
      '      <p>En MAQUINASA, nuestro equipo está formado por profesionales expertos altamente cualificados con un profundo conocimiento del mercado inmobiliario, así como en el desarrollo de negocio.</p>',
      '      <p>Combinamos años de experiencia en la gestión integral y promoción de inmuebles.</p>',
      '      <p>Nos enorgullece ofrecer un asesoramiento personalizado, garantizando la máxima eficiencia, transparencia y seguridad.</p>',
      '    </div>',
      '  </div>',
      '</section>'
    ].join('\n');

    insertAfterNode.insertAdjacentHTML('afterend', teamHTML);

    injectCSS('maquinasa-team-section-css', [
      '.maquinasa-team-section {',
      '  background-color: #ffffff;',
      '  padding: 80px 20px;',
      '}',
      '.maquinasa-team-container {',
      '  max-width: 1200px;',
      '  margin: 0 auto;',
      '  display: grid;',
      '  grid-template-columns: 1fr 1fr;',
      '  gap: 60px;',
      '  align-items: center;',
      '}',
      '.maquinasa-team-image-wrap {',
      '  width: 100%;',
      '  aspect-ratio: 4 / 3;',
      '}',
      '.maquinasa-team-image-placeholder {',
      '  width: 100%;',
      '  height: 100%;',
      '  background: linear-gradient(135deg, #184044 0%, #2d6a6f 100%);',
      '  border-radius: 12px;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  color: #ffffff;',
      '  text-align: center;',
      '  font-size: 18px;',
      '  font-weight: 600;',
      '  box-shadow: 0 10px 40px rgba(0,0,0,.15);',
      '}',
      '.maquinasa-team-image-placeholder small {',
      '  font-size: 13px;',
      '  font-weight: 400;',
      '  opacity: .8;',
      '}',
      '.maquinasa-team-text-wrap {',
      '  color: #184044;',
      '}',
      '.maquinasa-team-heading {',
      '  font-size: 44px;',
      '  margin: 0 0 24px 0;',
      '  color: #184044;',
      '  line-height: 1.15;',
      '}',
      '.maquinasa-team-text-wrap p {',
      '  font-size: 17px;',
      '  line-height: 1.6;',
      '  margin: 0 0 16px 0;',
      '  color: #333;',
      '}',
      '@media (max-width: 991px) {',
      '  .maquinasa-team-container {',
      '    grid-template-columns: 1fr;',
      '    gap: 40px;',
      '  }',
      '  .maquinasa-team-section {',
      '    padding: 60px 20px;',
      '  }',
      '  .maquinasa-team-heading {',
      '    font-size: 36px;',
      '  }',
      '}',
      '@media (max-width: 479px) {',
      '  .maquinasa-team-heading {',
      '    font-size: 28px;',
      '  }',
      '  .maquinasa-team-text-wrap p {',
      '    font-size: 15px;',
      '  }',
      '}'
    ].join('\n'));

    log('F3.1 Nuestro Equipo section inyectada');
  }

  // =====================================================================
  // F2.3 — Home: ocultar seccion de photo collage
  // =====================================================================
  function fixHomeCollage() {
    injectCSS('maquinasa-home-collage', [
      '.gallery-grid-home-2 {',
      '  display: none !important;',
      '}',
      // Ocultar tambien el contenedor padre si es una section solo para el collage
      '.section:has(> .base-container > .gallery-grid-home-2),',
      '.section:has(.gallery-grid-home-2) {',
      '  display: none !important;',
      '}'
    ].join('\n'));
    log('F2.3 home collage ocultado');
  }

  // =====================================================================
  // F7.1 — Footer: agrandar logo + centrar layout del footer
  // =====================================================================
  // Template original:
  //   .footer-logo { width: 50%; height: 50% }  -> logo pequeno
  //   .grid-footer usa 5 columnas con .div-block-107 spaneando 2
  //     -> logo a la izquierda, contactos a la derecha (no centrado)
  //
  // Forzamos:
  //   - logo a 150px desktop / 100px mobile (img.footer-logo para especifidad)
  //   - grid-footer cambia a flex centrado para que el logo+texto aparezcan
  //     horizontalmente alineados en el centro
  function fixFooterLogoSize() {
    // Paso 1: limpiar atributos HTML del img (height="30", sizes, srcset
    // pequeños) que causan que el navegador cargue/muestre un logo mini.
    function cleanLogoAttrs() {
      var logos = document.querySelectorAll('.footer-logo');
      logos.forEach(function (img) {
        img.removeAttribute('height');
        img.removeAttribute('width');
        img.removeAttribute('sizes');
        // No tocamos srcset para respetar responsive images, solo
        // forzamos el display size via CSS.
      });
    }
    cleanLogoAttrs();
    // Reintento por si el template inserta el logo despues del load
    setTimeout(cleanLogoAttrs, 500);
    setTimeout(cleanLogoAttrs, 1500);

    injectCSS('maquinasa-footer-logo', [
      // Maxima especificidad posible sin inline
      'body .footer img.footer-logo,',
      'body .footer .footer-logo {',
      '  height: 150px !important;',
      '  width: auto !important;',
      '  max-width: 100% !important;',
      '  min-height: 150px !important;',
      '  min-width: 0 !important;',
      '  object-fit: contain !important;',
      '}',
      '@media (max-width: 767px) {',
      '  body .footer img.footer-logo,',
      '  body .footer .footer-logo {',
      '    height: 100px !important;',
      '    min-height: 100px !important;',
      '    width: auto !important;',
      '  }',
      '}',
      // Layout del footer: forzar grid-footer a flex centrado
      '.footer .grid-footer {',
      '  display: flex !important;',
      '  flex-wrap: wrap;',
      '  justify-content: center !important;',
      '  align-items: flex-start !important;',
      '  gap: 40px !important;',
      '  text-align: center !important;',
      '}',
      '.footer .grid-footer > * {',
      '  grid-column: auto !important;',
      '  grid-row: auto !important;',
      '  max-width: none !important;',
      '  margin-left: 0 !important;',
      '  margin-right: 0 !important;',
      '}',
      // El contenedor .div-block-107 tenia max-width:300px y margin-left:65px
      '.footer .div-block-107 {',
      '  max-width: none !important;',
      '  margin-left: 0 !important;',
      '  display: flex !important;',
      '  flex-direction: column;',
      '  align-items: center !important;',
      '}',
      '.footer .brand-footer {',
      '  display: flex !important;',
      '  justify-content: center !important;',
      '  margin-bottom: 20px !important;',
      '}',
      '.footer .block-footer {',
      '  text-align: center !important;',
      '}'
    ].join('\n'));
    log('F7.1 footer logo resized + layout centrado');
  }

  // =====================================================================
  // F1.3 — Headers responsive
  // =====================================================================
  // 1) Mobile: about-us y all-services max 400px alto (NO home).
  // 2) Home mobile: el template pone h1 a 48px con max-width 400px, lo
  //    que desborda en pantallas estrechas. Reducimos font-size, quitamos
  //    max-width, y dejamos que Flexbox haga su trabajo.
  // Envuelve cada palabra del h1 del hero Home en un <span inline-block nowrap>
  // para que NINGUN navegador pueda romperla por la mitad. Las lineas solo
  // pueden romperse entre palabras completas.
  function wrapHeroWordsNoBreak() {
    var target = document.querySelector('.heading-banner-home-2 .bold-text-2') ||
                 document.querySelector('.heading-banner-home-2 strong') ||
                 document.querySelector('.heading-banner-home-2');
    if (!target || target.getAttribute('data-maquinasa-wrapped') === '1') return;
    var text = target.textContent.trim();
    if (!text) return;
    // Creamos un span inline-block con nowrap por cada palabra
    var html = text.split(/\s+/).map(function (word) {
      return '<span style="display:inline-block;white-space:nowrap;">' + word + '</span>';
    }).join(' ');
    target.innerHTML = html;
    target.setAttribute('data-maquinasa-wrapped', '1');
    log('hero h1 words wrapped (no break)');
  }

  function fixHeaderSizes() {
    if (document.documentElement.lang !== 'es') {
      document.documentElement.lang = 'es';
    }
    wrapHeroWordsNoBreak();
    setTimeout(wrapHeroWordsNoBreak, 500);
    setTimeout(wrapHeroWordsNoBreak, 1500);
    injectCSS('maquinasa-header-sizes', [
      // Desktop: ampliar ancho del contenedor del hero Home para que
      // el h1 use mas ancho de la ventana (antes 60% -> ahora 90%).
      '@media (min-width: 992px) {',
      '  .banner-content-home-2 {',
      '    width: 90% !important;',
      '    max-width: 1100px !important;',
      '  }',
      '  .heading-banner-home-2 {',
      '    max-width: 100% !important;',
      '  }',
      '}',
      '@media (min-width: 768px) and (max-width: 991px) {',
      '  .banner-content-home-2 {',
      '    width: 95% !important;',
      '  }',
      '  .heading-banner-home-2 {',
      '    max-width: 100% !important;',
      '  }',
      '}',
      // Banners tipo imagen en mobile: max 400px alto
      '@media (max-width: 767px) {',
      '  .about-us-banner,',
      '  .all-services-banner {',
      '    max-height: 400px !important;',
      '    min-height: 0 !important;',
      '    height: auto !important;',
      '    overflow: hidden;',
      '  }',
      '}',
      // Home hero mobile: fix tipografia y overflow del h1
      '@media (max-width: 767px) {',
      '  .heading-banner-home-2,',
      '  .heading-banner-home-2 *,',
      '  .heading-banner-home-2 .bold-text-2,',
      '  .heading-banner-home-2 strong {',
      '    font-size: 46px !important;',
      '    line-height: 1.15 !important;',
      '    max-width: 100% !important;',
      '    word-wrap: normal !important;',
      '    overflow-wrap: normal !important;',
      '    word-break: keep-all !important;',
      '    -webkit-hyphens: manual !important;',
      '    -ms-hyphens: manual !important;',
      '    hyphens: manual !important;',
      '    white-space: normal !important;',
      '    margin-bottom: 18px !important;',
      '  }',
      '  .paragraph-banner {',
      '    font-size: 15px !important;',
      '    line-height: 1.4 !important;',
      '  }',
      '  .number-counter, .number-counter.size {',
      '    font-size: 32px !important;',
      '  }',
      '  .text-counter {',
      '    font-size: 14px !important;',
      '  }',
      '  .banner-content-home-2 {',
      '    width: 100% !important;',
      '    padding-left: 20px;',
      '    padding-right: 20px;',
      '    box-sizing: border-box;',
      '  }',
      '  .home-banner-section-home-2 {',
      '    flex-direction: column !important;',
      '    min-height: auto !important;',
      '  }',
      '  .button-block-banner-home-2 {',
      '    flex-wrap: wrap !important;',
      '    justify-content: center !important;',
      '    align-items: center !important;',
      '    gap: 10px !important;',
      '  }',
      '  .counter-banner-block {',
      '    flex-wrap: wrap !important;',
      '    justify-content: center !important;',
      '    grid-column-gap: 20px !important;',
      '    gap: 20px !important;',
      '  }',
      '  .banner-content-home-2 {',
      '    align-items: center !important;',
      '    text-align: center !important;',
      '  }',
      '}',
      '@media (max-width: 479px) {',
      '  .heading-banner-home-2,',
      '  .heading-banner-home-2 *,',
      '  .heading-banner-home-2 .bold-text-2,',
      '  .heading-banner-home-2 strong {',
      '    font-size: 38px !important;',
      '    line-height: 1.15 !important;',
      '    word-wrap: normal !important;',
      '    overflow-wrap: normal !important;',
      '    word-break: keep-all !important;',
      '    -webkit-hyphens: manual !important;',
      '    hyphens: manual !important;',
      '  }',
      '  .paragraph-banner {',
      '    font-size: 14px !important;',
      '  }',
      '  .number-counter, .number-counter.size {',
      '    font-size: 28px !important;',
      '  }',
      '  .text-counter {',
      '    font-size: 13px !important;',
      '  }',
      '}'
    ].join('\n'));
    log('F1.3 headers sized (headers mobile + home hero fix)');
  }

  // =====================================================================
  // F5.1 — Contact: añadir bloque GDPR con 2 checkboxes obligatorios
  // =====================================================================
  function fixContactGdpr() {
    if (!/contact-us/.test(location.href)) return;
    if (document.querySelector('.maquinasa-gdpr-block')) return;
    var form = document.querySelector('#email-form, form.form-contact-us');
    if (!form) return;
    var submit = form.querySelector('input[type="submit"], button[type="submit"]');
    if (!submit) return;

    var gdprHTML = [
      '<div class="maquinasa-gdpr-block">',
      '  <h3 class="maquinasa-gdpr-title">PROTECCIÓN DE DATOS</h3>',
      '  <p class="maquinasa-gdpr-intro">En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016, es el Reglamento General de Protección de Datos (RGPD).</p>',
      '  <label class="maquinasa-gdpr-check">',
      '    <input type="checkbox" name="gdpr_comunicaciones" required>',
      '    <span>Consiento que <strong>MAQUINASA, S.L.</strong> pueda enviarme comunicaciones por medios electrónicos (correo electrónico y/o teléfono) relativos a la información solicitada.</span>',
      '  </label>',
      '  <label class="maquinasa-gdpr-check">',
      '    <input type="checkbox" name="gdpr_politica" required>',
      '    <span>He leído y acepto los términos de la <a href="/politica-privacidad" target="_blank">Política de Privacidad</a> y consiento el tratamiento de mis datos.</span>',
      '  </label>',
      '</div>'
    ].join('\n');

    submit.insertAdjacentHTML('beforebegin', gdprHTML);

    form.addEventListener('submit', function (e) {
      var cb1 = form.querySelector('input[name="gdpr_comunicaciones"]');
      var cb2 = form.querySelector('input[name="gdpr_politica"]');
      if ((cb1 && !cb1.checked) || (cb2 && !cb2.checked)) {
        e.preventDefault();
        alert('Debes aceptar ambas casillas de protección de datos para continuar.');
      }
    });

    injectCSS('maquinasa-gdpr-css', [
      '.maquinasa-gdpr-block {',
      '  margin: 30px 0 20px 0;',
      '  padding: 24px;',
      '  background: #f5f5f5;',
      '  border-radius: 10px;',
      '  text-align: left;',
      '}',
      '.maquinasa-gdpr-title {',
      '  font-size: 18px;',
      '  font-weight: 700;',
      '  color: #184044;',
      '  margin: 0 0 12px 0;',
      '  letter-spacing: 0.5px;',
      '}',
      '.maquinasa-gdpr-intro {',
      '  font-size: 13px;',
      '  color: #555;',
      '  margin: 0 0 18px 0;',
      '  line-height: 1.5;',
      '}',
      '.maquinasa-gdpr-check {',
      '  display: flex;',
      '  align-items: flex-start;',
      '  gap: 10px;',
      '  margin-bottom: 12px;',
      '  cursor: pointer;',
      '  font-size: 14px;',
      '  color: #333;',
      '  line-height: 1.5;',
      '}',
      '.maquinasa-gdpr-check input[type="checkbox"] {',
      '  width: 18px;',
      '  height: 18px;',
      '  margin-top: 2px;',
      '  flex-shrink: 0;',
      '  accent-color: #184044;',
      '  cursor: pointer;',
      '}',
      '.maquinasa-gdpr-check a {',
      '  color: #184044;',
      '  font-weight: 600;',
      '  text-decoration: underline;',
      '}',
      '@media (max-width: 479px) {',
      '  .maquinasa-gdpr-block { padding: 18px; }',
      '  .maquinasa-gdpr-title { font-size: 16px; }',
      '  .maquinasa-gdpr-intro { font-size: 12px; }',
      '  .maquinasa-gdpr-check { font-size: 13px; }',
      '}'
    ].join('\n'));
    log('F5.1 GDPR block inyectado');
  }

  // =====================================================================
  // F6 — Boton WhatsApp flotante (todas las paginas)
  // =====================================================================
  // El template tiene .div-block-108 > a con href='#' roto. Lo arreglamos.
  function fixFloatingWhatsApp() {
    var floatingBtn = document.querySelector('.div-block-108 > a');
    if (floatingBtn && floatingBtn.getAttribute('href') !== 'https://wa.me/34637038528') {
      floatingBtn.setAttribute('href', 'https://wa.me/34637038528');
      floatingBtn.setAttribute('target', '_blank');
      floatingBtn.setAttribute('rel', 'noopener');
      log('floating WhatsApp button href fixed');
    }
  }

  // =====================================================================
  // F6 + UX — Contact: layout 2 columnas (info card + formulario)
  // =====================================================================
  function fixContactLayout() {
    if (!/contact-us/.test(location.href)) return;
    if (document.querySelector('.maquinasa-contact-info')) return;

    var wrapper = document.querySelector('.contacts-form-wrapper');
    var formGetIn = document.querySelector('.form-get-in');
    if (!wrapper || !formGetIn) return;

    var WA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.599 5.381l-.999 3.648 3.889-1.728zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>';

    var infoHTML = [
      '<div class="maquinasa-contact-info">',
      '  <h2 class="maquinasa-info-title">¿Hablamos?</h2>',
      '  <p class="maquinasa-info-subtitle">Cuéntanos tu proyecto y te ayudamos a ejecutarlo con la máxima profesionalidad.</p>',
      '  <div class="maquinasa-info-item">',
      '    <div class="maquinasa-info-icon" aria-hidden="true">',
      '      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      '    </div>',
      '    <div class="maquinasa-info-body">',
      '      <div class="maquinasa-info-label">Dirección</div>',
      '      <a class="maquinasa-info-value" href="https://maps.app.goo.gl/hpgKZMsYaaZKNktJ7" target="_blank" rel="noopener">Avda. Balsicas, 43 · Edf. Ribercar<br>30730 San Javier (Murcia)</a>',
      '    </div>',
      '  </div>',
      '  <div class="maquinasa-info-item">',
      '    <div class="maquinasa-info-icon" aria-hidden="true">',
      '      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
      '    </div>',
      '    <div class="maquinasa-info-body">',
      '      <div class="maquinasa-info-label">Teléfono</div>',
      '      <a class="maquinasa-info-value" href="tel:+34968614205">+34 968 614 205</a>',
      '    </div>',
      '  </div>',
      '  <div class="maquinasa-info-item">',
      '    <div class="maquinasa-info-icon" aria-hidden="true">',
      '      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
      '    </div>',
      '    <div class="maquinasa-info-body">',
      '      <div class="maquinasa-info-label">Email</div>',
      '      <a class="maquinasa-info-value" href="mailto:administracion@maquinasa.com">administracion@maquinasa.com</a>',
      '    </div>',
      '  </div>',
      '  <a class="maquinasa-whatsapp-btn" href="https://wa.me/34637038528" target="_blank" rel="noopener">',
      '    ' + WA_SVG,
      '    <span>Contactar por WhatsApp</span>',
      '  </a>',
      '</div>'
    ].join('\n');

    // Insertamos la info card como PRIMER hijo de contacts-form-wrapper
    wrapper.insertAdjacentHTML('afterbegin', infoHTML);

    injectCSS('maquinasa-contact-layout', [
      // Layout 2 columnas en desktop
      '.contacts-form-wrapper {',
      '  display: grid !important;',
      '  grid-template-columns: 1fr 1.2fr !important;',
      '  gap: 60px !important;',
      '  max-width: 1200px !important;',
      '  margin: 80px auto !important;',
      '  padding: 0 20px !important;',
      '  align-items: start !important;',
      '}',
      // Columna izquierda: info card
      '.maquinasa-contact-info {',
      '  background: #184044;',
      '  color: #ffffff;',
      '  padding: 48px 40px;',
      '  border-radius: 16px;',
      '  box-shadow: 0 15px 50px rgba(24,64,68,.25);',
      '}',
      '.maquinasa-info-title {',
      '  font-size: 38px;',
      '  font-weight: 700;',
      '  margin: 0 0 12px 0;',
      '  color: #ffffff;',
      '  line-height: 1.15;',
      '}',
      '.maquinasa-info-subtitle {',
      '  font-size: 16px;',
      '  color: rgba(255,255,255,.8);',
      '  margin: 0 0 36px 0;',
      '  line-height: 1.5;',
      '}',
      '.maquinasa-info-item {',
      '  display: flex;',
      '  align-items: flex-start;',
      '  gap: 16px;',
      '  margin-bottom: 22px;',
      '}',
      '.maquinasa-info-icon {',
      '  flex-shrink: 0;',
      '  width: 44px;',
      '  height: 44px;',
      '  border-radius: 50%;',
      '  background: rgba(255,255,255,.12);',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  color: #ffffff;',
      '}',
      '.maquinasa-info-body {',
      '  flex: 1;',
      '  min-width: 0;',
      '}',
      '.maquinasa-info-label {',
      '  font-size: 12px;',
      '  text-transform: uppercase;',
      '  letter-spacing: 1px;',
      '  color: rgba(255,255,255,.6);',
      '  margin-bottom: 4px;',
      '}',
      '.maquinasa-info-value {',
      '  color: #ffffff !important;',
      '  font-size: 16px;',
      '  font-weight: 500;',
      '  text-decoration: none !important;',
      '  line-height: 1.4;',
      '  word-break: break-word;',
      '  display: inline-block;',
      '}',
      '.maquinasa-info-value:hover {',
      '  text-decoration: underline !important;',
      '}',
      '.maquinasa-contact-info .maquinasa-whatsapp-btn {',
      '  display: flex !important;',
      '  align-items: center;',
      '  justify-content: center;',
      '  gap: 10px;',
      '  background: #25d366 !important;',
      '  color: #ffffff !important;',
      '  padding: 14px 24px !important;',
      '  border-radius: 50px !important;',
      '  font-size: 15px !important;',
      '  font-weight: 600;',
      '  text-decoration: none !important;',
      '  margin: 28px 0 0 0 !important;',
      '  box-shadow: 0 4px 14px rgba(37,211,102,.35);',
      '  transition: transform .2s ease, box-shadow .2s ease;',
      '}',
      '.maquinasa-contact-info .maquinasa-whatsapp-btn:hover {',
      '  transform: translateY(-2px);',
      '  box-shadow: 0 6px 20px rgba(37,211,102,.5);',
      '}',
      // Columna derecha: el formulario, resetear estilos del template
      '.contacts-form-wrapper > .form-get-in {',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  margin: 0 !important;',
      '}',
      // Resetear el tiny-content-top del template que ponia padding raro
      '.contacts-form-wrapper .content-top.vertical {',
      '  margin-bottom: 24px;',
      '}',
      // Mobile/tablet: stacked
      '@media (max-width: 991px) {',
      '  .contacts-form-wrapper {',
      '    grid-template-columns: 1fr !important;',
      '    gap: 40px !important;',
      '    margin: 50px auto !important;',
      '  }',
      '  .maquinasa-contact-info {',
      '    padding: 36px 28px;',
      '  }',
      '  .maquinasa-info-title {',
      '    font-size: 32px;',
      '  }',
      '}',
      '@media (max-width: 479px) {',
      '  .maquinasa-contact-info {',
      '    padding: 28px 22px;',
      '  }',
      '  .maquinasa-info-title {',
      '    font-size: 26px;',
      '  }',
      '  .maquinasa-info-value {',
      '    font-size: 14px;',
      '  }',
      '}'
    ].join('\n'));
    log('F6+UX Contact layout 2 columnas inyectado');
  }

  // =====================================================================
  // F7.4 — Footer: dejar solo Instagram y Facebook (ocultar Twitter y Dribbble)
  // =====================================================================
  // El footer actual tiene 4 iconos: Facebook, Instagram, Twitter, Dribbble.
  // El cliente quiere dejar solo IG y FB. Ocultamos los otros 2 por href
  // para que sea robusto frente a reordenaciones en el DOM.
  //
  // TODO: cuando el cliente mande sus URLs reales de Instagram y Facebook,
  // actualizarlas aqui en lugar de https://www.facebook.com/ genericas.
  function fixFooterSocial() {
    var icons = document.querySelectorAll('.footer-social-icon');
    if (!icons.length) return;
    icons.forEach(function (icon) {
      var href = (icon.getAttribute('href') || '').toLowerCase();
      if (href.indexOf('twitter.com') !== -1 || href.indexOf('x.com') !== -1 ||
          href.indexOf('dribbble.com') !== -1) {
        icon.style.display = 'none';
      }
    });
    log('F7.4 footer social cleaned (solo IG + FB)');
  }

  // =====================================================================
  // Orquestador
  // =====================================================================
  function runAllFixes() {
    fixHeaderSizes();      // F1.3
    fixHomeCards();        // F2.1
    fixHomeCollage();      // F2.3
    fixTeamSection();      // F3.1
    fixContactGdpr();      // F5.1
    fixFloatingWhatsApp(); // F6 floating (all pages)
    fixContactLayout();    // F6 + UX contact page 2-columnas
    fixFooterLogoSize();   // F7.1
    fixFooterSocial();     // F7.4
    // Los siguientes fixes:
    // fixTeamSection();     // F3.1
    // fixContactGdpr();     // F5.1
    // fixWhatsAppContact(); // F6.1/6.2
    // fixFooterLinks();     // F7.2 (enlaces de interes)
    // fixFooterLegal();     // F7.3
  }

  // Ejecutar cuando el DOM este listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllFixes);
  } else {
    runAllFixes();
  }

  log('global-fixer.js loaded');
})();
