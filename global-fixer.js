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
      // Padding lateral del footer al minimo (mas espacio para el grid)
      '.footer {',
      '  padding-left: 0 !important;',
      '  padding-right: 0 !important;',
      '}',
      // CRITICO: anular .content-2 max-width 1310 + padding del template
      '.footer .content-2 {',
      '  max-width: 100% !important;',
      '  width: 100% !important;',
      '  padding-left: 90px !important;',
      '  padding-right: 90px !important;',
      '}',
      // Layout del footer: GRID full-width
      '.footer .grid-footer {',
      '  display: grid !important;',
      '  text-align: center !important;',
      '  width: 100% !important;',
      '  max-width: none !important;',
      '  margin: 0 0 30px 0 !important;',
      '  padding: 0 12px !important;',
      '  box-sizing: border-box !important;',
      '  align-items: start !important;',
      '}',
      // Desktop grande (>=1500): 6 cols en una fila
      '@media (min-width: 1500px) {',
      '  .footer .grid-footer {',
      '    grid-template-columns: 200px repeat(5, minmax(200px, 1fr)) !important;',
      '    gap: 50px 22px !important;',
      '  }',
      '}',
      // Desktop normal (1100-1499): 3 cols, logo span entero arriba
      '@media (min-width: 1100px) and (max-width: 1499px) {',
      '  .footer .grid-footer {',
      '    grid-template-columns: repeat(3, minmax(220px, 1fr)) !important;',
      '    gap: 50px 22px !important;',
      '    max-width: 950px !important;',
      '    margin-left: auto !important;',
      '    margin-right: auto !important;',
      '  }',
      '  .footer .div-block-107 { grid-column: 1 / -1 !important; }',
      '}',
      // Email/enlaces largos: permitir wrap dentro de su columna
      '.footer .block-footer .link-footer {',
      '  word-break: break-word !important;',
      '  overflow-wrap: anywhere !important;',
      '  display: block;',
      '}',
      '.footer .grid-footer > * {',
      '  grid-column: auto !important;',
      '  grid-row: auto !important;',
      '  max-width: 100% !important;',
      '  flex: initial !important;',
      '  margin: 0 !important;',
      '  min-width: 0 !important;',
      '}',
      // El bloque del logo: alineado a la izquierda con su contenido
      '.footer .div-block-107 {',
      '  max-width: 100% !important;',
      '  display: flex !important;',
      '  flex-direction: column;',
      '  align-items: flex-start !important;',
      '  text-align: left !important;',
      '}',
      '.footer .brand-footer {',
      '  display: flex !important;',
      '  justify-content: flex-start !important;',
      '  margin-bottom: 0 !important;',
      '}',
      // Descripcion: misma anchura aproximada que el logo (150px alto -> ~280px ancho)
      '.footer .footer-brand-description {',
      '  margin-top: 14px !important;',
      '  margin-bottom: 0 !important;',
      '  line-height: 1.5 !important;',
      '  font-size: 15px !important;',
      '  max-width: 280px !important;',
      '  text-align: left !important;',
      '}',
      '.footer .block-footer {',
      '  text-align: center !important;',
      '}',
      // Titulos de columnas pegados a sus links
      '.footer .title-footer {',
      '  margin-bottom: 8px !important;',
      '}',
      // Filas de texto del footer mas juntas
      '.footer .link-footer {',
      '  padding-top: 3px !important;',
      '  padding-bottom: 3px !important;',
      '  line-height: 1.35 !important;',
      '}',
      // Tablet (768-1199): 2 cols, logo span entero
      '@media (min-width: 768px) and (max-width: 1199px) {',
      '  .footer .grid-footer {',
      '    grid-template-columns: 1fr 1fr !important;',
      '    gap: 40px 30px !important;',
      '    max-width: 700px !important;',
      '    margin-left: auto !important;',
      '    margin-right: auto !important;',
      '  }',
      '  .footer .div-block-107 { grid-column: 1 / -1 !important; }',
      '}',
      // Mobile (<=767px): 1 columna apilada + padding minimo
      '@media (max-width: 767px) {',
      '  .footer { padding-top: 40px !important; padding-bottom: 40px !important; }',
      '  .footer .content-2 {',
      '    padding-left: 20px !important;',
      '    padding-right: 20px !important;',
      '  }',
      '  .footer .grid-footer {',
      '    grid-template-columns: 1fr !important;',
      '    max-width: 100% !important;',
      '    gap: 32px !important;',
      '    padding: 0 !important;',
      '  }',
      '  .footer .div-block-107,',
      '  .footer .block-footer {',
      '    text-align: center !important;',
      '    align-items: center !important;',
      '  }',
      '  .footer .div-block-107 {',
      '    align-items: center !important;',
      '  }',
      '  .footer .footer-brand-description {',
      '    text-align: center !important;',
      '    max-width: 100% !important;',
      '  }',
      '  .footer .brand-footer {',
      '    justify-content: center !important;',
      '  }',
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
      '  margin: 24px 0 6px 0;',
      '  padding: 20px;',
      '  background: #f5f5f5;',
      '  border-radius: 10px;',
      '  text-align: left;',
      '}',
      // Boton Enviar mas pegado al bloque GDPR
      '.form-contact-us input[type="submit"],',
      '.form-contact-us button[type="submit"] {',
      '  margin-top: 8px !important;',
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
    // Asegurar que el contenedor flotante esta por encima de todo
    injectCSS('maquinasa-floating-wa', [
      '.div-block-108 {',
      '  z-index: 9999 !important;',
      '  position: fixed !important;',
      '}',
      '.div-block-108 > a {',
      '  display: block;',
      '}'
    ].join('\n'));
  }

  // =====================================================================
  // F6 + UX — Contact: layout 2 columnas (info existente + form) + map abajo
  // =====================================================================
  // El template tiene 3 columnas: info + mapa + form. Reorganizamos a 2
  // columnas (info + form) y movemos el mapa debajo a ancho completo.
  // Añadimos el boton WhatsApp dentro de la columna info existente.
  function fixContactLayout() {
    if (!/contact-us/.test(location.href)) return;

    // Limpiar inyecciones antiguas de runs previos
    var oldCards = document.querySelectorAll('.maquinasa-contact-info');
    oldCards.forEach(function (el) { if (el.parentNode) el.parentNode.removeChild(el); });

    if (document.querySelector('[data-maquinasa-contact-fixed]')) return;

    var contactsWrapper = document.querySelector('.contacts-wrapper');
    var contentWrapper = document.querySelector('.contacts-content-wrapper');
    var mapWrapper = document.querySelector('.image-location');
    var formWrapper = document.querySelector('.contacts-form-wrapper');

    if (!contactsWrapper || !contentWrapper || !formWrapper) {
      console.warn('[maquinasa] fixContactLayout: faltan elementos', {
        wrapper: !!contactsWrapper,
        content: !!contentWrapper,
        form: !!formWrapper
      });
      return;
    }
    contactsWrapper.setAttribute('data-maquinasa-contact-fixed', '1');
    console.log('%c[maquinasa] CONTACT v2 ACTIVE', 'background:#25d366;color:#fff;padding:4px 12px;border-radius:4px;font-weight:bold;');

    // 1) Mover el mapa DENTRO de la columna info (al final), full width de la columna
    if (mapWrapper && mapWrapper.parentNode !== contentWrapper) {
      contentWrapper.appendChild(mapWrapper);
    }

    // 2) Limpiar cualquier CTA standalone anterior y boton viejo en la columna
    var oldCta = document.querySelector('.maquinasa-wa-cta');
    if (oldCta) oldCta.parentNode.removeChild(oldCta);
    var oldInColumn = contentWrapper.querySelectorAll('.maquinasa-whatsapp-btn');
    oldInColumn.forEach(function (el) { el.parentNode.removeChild(el); });

    // 3) Añadir boton WhatsApp al final de la columna info, despues del mapa
    var waBtn = document.createElement('a');
    waBtn.className = 'maquinasa-whatsapp-btn';
    waBtn.href = 'https://wa.me/34637038528';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.599 5.381l-.999 3.648 3.889-1.728zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.298-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg><span>Contactar por WhatsApp</span>';
    contentWrapper.appendChild(waBtn);

    injectCSS('maquinasa-contact-layout', [
      // Parent: 2 cols equilibradas en desktop
      '.contacts-wrapper {',
      '  display: grid !important;',
      '  grid-template-columns: 1fr 1.2fr !important;',
      '  gap: 60px !important;',
      '  align-items: start !important;',
      '}',
      '.contacts-wrapper > * {',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  margin: 0 !important;',
      '}',
      // Mapa DENTRO de la columna info, full-width de la columna
      // CRITICO: el template pone .image-location { height: 340px } en el
      // wrapper, lo que dejaba 60px de espacio vacio bajo el iframe.
      '.contacts-content-wrapper > .image-location,',
      '.image-location {',
      '  display: block !important;',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  height: auto !important;',
      '  min-height: 0 !important;',
      '  margin: 30px 0 0 0 !important;',
      '  padding: 0 !important;',
      '  box-sizing: border-box;',
      '  line-height: 0 !important;',
      '}',
      '.contacts-content-wrapper > .image-location .w-embed,',
      '.contacts-content-wrapper > .image-location .w-embed.w-iframe,',
      '.contacts-content-wrapper > .image-location iframe {',
      '  width: 100% !important;',
      '  height: 280px !important;',
      '  border-radius: 12px;',
      '  overflow: hidden;',
      '  display: block !important;',
      '  margin: 0 !important;',
      '}',
      // Subir todo el bloque de contacto: padding top minimo
      '.section:has(.contacts-wrapper) {',
      '  padding-top: 0 !important;',
      '  margin-top: 0 !important;',
      '}',
      '.section:has(.contacts-wrapper) .base-container {',
      '  padding-top: 0 !important;',
      '  margin-top: 0 !important;',
      '}',
      '.contacts-wrapper {',
      '  padding-top: 0 !important;',
      '  margin-top: 0 !important;',
      '}',
      // Titulos de la info (Horario, Informacion, Direccion, etc) pegados a su texto
      '.contacts-content-wrapper .heading-address,',
      '.contacts-content-wrapper h4,',
      '.contacts-content-wrapper h5,',
      '.contacts-content-wrapper .heading-cart,',
      '.contacts-content-wrapper .magin-bottom {',
      '  margin-bottom: 6px !important;',
      '  margin-top: 16px !important;',
      '}',
      // Bloques de info: menos margen entre items
      '.contacts-content-wrapper .information-block,',
      '.contacts-content-wrapper .addres-block,',
      '.contacts-content-wrapper .text-contact-us,',
      '.contacts-content-wrapper .subtitle-contact-us {',
      '  margin-bottom: 4px !important;',
      '  margin-top: 0 !important;',
      '  line-height: 1.4 !important;',
      '}',
      '.contacts-content-wrapper .content-top {',
      '  margin-bottom: 8px !important;',
      '}',
      // Subtitle "Contactanos" (form column) pegado al titulo
      '.form-get-in .content-top.vertical {',
      '  margin-bottom: 8px !important;',
      '}',
      '.form-get-in .heading-address,',
      '.form-get-in h4 {',
      '  margin-bottom: 6px !important;',
      '}',
      '.form-get-in .subtitle-contact-us {',
      '  margin-top: 0 !important;',
      '  margin-bottom: 12px !important;',
      '}',
      // Boton WhatsApp al final de la columna, centrado, con buen espacio
      '.contacts-content-wrapper > .maquinasa-whatsapp-btn {',
      '  display: inline-flex !important;',
      '  align-items: center;',
      '  justify-content: center;',
      '  gap: 12px;',
      '  background: #25d366 !important;',
      '  color: #ffffff !important;',
      '  padding: 18px 44px !important;',
      '  border-radius: 50px !important;',
      '  font-size: 17px !important;',
      '  font-weight: 600;',
      '  text-decoration: none !important;',
      '  margin: 60px auto 30px auto !important;',
      '  align-self: center !important;',
      '  box-shadow: 0 6px 20px rgba(37,211,102,.4);',
      '  transition: transform .25s ease, box-shadow .25s ease;',
      '}',
      '.contacts-content-wrapper > .maquinasa-whatsapp-btn:hover {',
      '  transform: translateY(-3px);',
      '  box-shadow: 0 10px 28px rgba(37,211,102,.5);',
      '}',
      // Asegurar que la columna info es flex column para que align-self funcione
      '.contacts-content-wrapper {',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '}',
      '.contacts-content-wrapper .maquinasa-whatsapp-btn:hover {',
      '  transform: translateY(-2px);',
      '  box-shadow: 0 6px 20px rgba(37,211,102,.5);',
      '}',
      // Mobile/tablet: layout completamente stacked + padding lateral
      '@media (max-width: 991px) {',
      '  .contacts-wrapper {',
      '    display: block !important;',
      '    grid-template-columns: 1fr !important;',
      '    padding: 30px 20px !important;',
      '    box-sizing: border-box;',
      '    width: 100% !important;',
      '    max-width: 100% !important;',
      '    gap: 0 !important;',
      '  }',
      '  .contacts-content-wrapper,',
      '  .contacts-form-wrapper {',
      '    display: block !important;',
      '    width: 100% !important;',
      '    max-width: 100% !important;',
      '    margin: 0 0 40px 0 !important;',
      '    padding: 0 !important;',
      '    float: none !important;',
      '    position: static !important;',
      '  }',
      '  .contacts-content-wrapper > .image-location {',
      '    margin: 30px 0 !important;',
      '  }',
      '  .contacts-content-wrapper > .maquinasa-whatsapp-btn {',
      '    margin: 0 auto 80px auto !important;',
      '    display: flex !important;',
      '  }',
      '  .form-get-in {',
      '    width: 100% !important;',
      '    max-width: 100% !important;',
      '    padding: 0 !important;',
      '    margin: 0 !important;',
      '  }',
      '  .form-contact-us-centered, .w-form, .form-contact-us {',
      '    width: 100% !important;',
      '  }',
      '}'
    ].join('\n'));
    log('F6+UX Contact layout reorganizado (2 cols + mapa abajo)');
    return;
  }

  // Zona muerta (codigo antiguo, no ejecutar)

  // =====================================================================
  // F7.2 + F7.3 — Footer: añadir Enlaces de interes + Legal
  // =====================================================================
  function fixFooterExtraLinks() {
    var grid = document.querySelector('.footer .grid-footer');
    if (!grid) return;

    // Dividir la direccion en 2 lineas si esta en una sola
    var addressLink = document.querySelector('.footer .block-footer a.link-footer[href*="maps"]');
    if (addressLink && !addressLink.querySelector('br') &&
        addressLink.textContent.indexOf('Avda') !== -1) {
      addressLink.innerHTML = 'Avda. Balsicas, 43 · Edf. Ribercar<br>30730 San Javier (Murcia)';
    }

    if (grid.querySelector('.maquinasa-footer-interes')) return;

    var interesHTML = [
      '<div class="block-footer maquinasa-footer-interes">',
      '  <h6 class="title-footer">Enlaces de interés</h6>',
      '  <a href="https://www.davidwine.com" target="_blank" rel="noopener" class="link-footer">www.davidwine.com</a>',
      '  <a href="https://www.leonorherza.com" target="_blank" rel="noopener" class="link-footer">www.leonorherza.com</a>',
      '  <a href="https://www.colecciónnake.com" target="_blank" rel="noopener" class="link-footer">www.colecciónnake.com</a>',
      '</div>'
    ].join('\n');

    var legalHTML = [
      '<div class="block-footer maquinasa-footer-legal">',
      '  <h6 class="title-footer">Legal</h6>',
      '  <a href="/aviso-legal" class="link-footer">Aviso Legal</a>',
      '  <a href="/politica-privacidad" class="link-footer">Política de Privacidad</a>',
      '  <a href="/politica-cookies" class="link-footer">Política de Cookies</a>',
      '  <a href="/terminos-condiciones" class="link-footer">Términos y Condiciones</a>',
      '</div>'
    ].join('\n');

    grid.insertAdjacentHTML('beforeend', interesHTML);
    grid.insertAdjacentHTML('beforeend', legalHTML);
    log('F7.2 + F7.3 footer extra links inyectados');
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

  // =====================================================================
  // F9 — Services page: 2 cards (INMOBILIARIA + ASESORAMIENTO),
  //      ocultar slider 'Experiencia', añadir texto + anclas
  // =====================================================================
  // =====================================================================
  // F9.2 / Task 3.2 — Inmobiliaria page: añadir bloque de texto
  // =====================================================================
  // =====================================================================
  // /automacion → redirect a /all-services#asesoramiento
  // =====================================================================
  // El template tiene una pagina /automacion con contenido de coches
  // que ya no aplica. Ningun enlace interno apunta alli, pero si alguien
  // teclea la URL o llega por SEO, lo redirigimos a la landing correcta.
  function fixAutomacionRedirect() {
    if (/\/automacion(\/|$)/.test(location.pathname)) {
      location.replace('/all-services#asesoramiento');
    }
  }

  function fixInmobiliariaPage() {
    if (!/\/inmobiliaria(\/|$)/.test(location.pathname)) return;
    if (document.querySelector('.maquinasa-inmo-page-text')) return;

    // Limpiar cualquier inyeccion antigua dentro de .div-block-3
    var oldInText = document.querySelectorAll('.div-block-3 .maquinasa-inmo-page-text, .div-block-3 .maquinasa-inmobiliaria-text');
    oldInText.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); });

    // El bloque nuevo se inserta como hermano siguiente de
    // .service-details-content-wrapper (ancho completo debajo)
    var topWrapper = document.querySelector('.service-details-content-wrapper');
    if (!topWrapper) return;

    var block = document.createElement('section');
    block.className = 'maquinasa-inmo-page-text';
    block.innerHTML = [
      '<div class="maquinasa-inmo-inner">',
      '  <p class="maquinasa-inmo-lead">En <strong>MAQUINASA</strong>, te ayudamos a que encuentres la propiedad que se ajuste a tus necesidades, ya sea para residir, invertir o emprender tu negocio.</p>',
      '  <div class="maquinasa-inmo-cards">',
      '    <div class="maquinasa-inmo-card">',
      '      <h4>Compra de Inmuebles</h4>',
      '      <p>Te acompañamos en todo el proceso de adquisición, desde la selección de inmuebles rústicos o urbanos hasta la gestión legal y trámites, asegurando una compra segura y exitosa.</p>',
      '    </div>',
      '    <div class="maquinasa-inmo-card">',
      '      <h4>Alquiler de Inmuebles</h4>',
      '      <p>Ponemos a tu disposición una amplia cartera de propiedades en alquiler y te guiamos en cada paso del arrendamiento, garantizando una experiencia transparente y sin preocupaciones para inquilinos y propietarios.</p>',
      '    </div>',
      '  </div>',
      '  <p class="maquinasa-inmo-closing">Confía en <strong>MAQUINASA</strong> para tu próxima compra o alquiler, te garantizamos la máxima profesionalidad y eficiencia.</p>',
      '</div>'
    ].join('\n');

    // Insertar como hermano DESPUES de la section entera (no del
    // wrapper interno), para salir de cualquier flex container padre
    var section = topWrapper.closest('section') || topWrapper.closest('.section');
    var insertRef = section || topWrapper;
    if (insertRef.parentNode) {
      insertRef.parentNode.insertBefore(block, insertRef.nextSibling);
    }

    // Imagen derecha mas grande (sigue igual)
    var img = document.querySelector('.service-details-content-wrapper .image-22');
    if (img) {
      img.removeAttribute('width');
      img.removeAttribute('height');
    }
    injectCSS('maquinasa-inmo-page-css', [
      '.service-details-content-wrapper {',
      '  display: flex !important;',
      '  flex-direction: row !important;',
      '  align-items: flex-start !important;',
      '  justify-content: space-between !important;',
      '  gap: 40px !important;',
      '  position: relative !important;',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '}',
      '.service-details-content-wrapper .div-block-3 {',
      '  flex: 1 1 55% !important;',
      '  max-width: 60% !important;',
      '  width: 60% !important;',
      '  padding-right: 0 !important;',
      '}',
      // Separar h3 del parrafo y alinear el texto al mismo borde izq
      '.service-details-content-wrapper .div-block-3 h3 {',
      '  margin-bottom: 48px !important;',
      '  font-size: 26px !important;',
      '}',
      '.service-details-content-wrapper .div-block-3 .paragraph-2 {',
      '  padding-left: 0 !important;',
      '  margin-top: 0 !important;',
      '  font-size: 19px !important;',
      '  line-height: 1.65 !important;',
      '}',
      // CRITICO: la imagen tiene position:absolute en el template
      // (inset 10% 0 auto auto + max-width 370 + height 400px fijo),
      // lo que la saca del flujo flex. La devolvemos al flujo normal.
      '.service-details-content-wrapper .image-22 {',
      '  position: static !important;',
      '  inset: auto !important;',
      '  top: auto !important;',
      '  right: auto !important;',
      '  bottom: auto !important;',
      '  left: auto !important;',
      '  flex: 0 1 45% !important;',
      '  width: 45% !important;',
      '  max-width: 550px !important;',
      '  height: auto !important;',
      '  min-height: 0 !important;',
      '  border: none !important;',
      '  border-radius: 12px;',
      '  box-shadow: 0 12px 40px rgba(0,0,0,.15);',
      '  object-fit: cover;',
      '  display: block;',
      '}',
      '@media (max-width: 767px) {',
      '  .service-details-content-wrapper {',
      '    flex-direction: column !important;',
      '    gap: 24px !important;',
      '    padding: 0 18px !important;',
      '    box-sizing: border-box !important;',
      '  }',
      '  .service-details-content-wrapper .div-block-3,',
      '  .service-details-content-wrapper .image-22 {',
      '    max-width: 100% !important;',
      '    width: 100% !important;',
      '    flex: 0 0 100% !important;',
      '  }',
      // Reducir fuentes en mobile (mantener legibles pero cabidos)
      '  .service-details-content-wrapper .div-block-3 h3 {',
      '    font-size: 22px !important;',
      '    margin-bottom: 20px !important;',
      '  }',
      '  .service-details-content-wrapper .div-block-3 .paragraph-2 {',
      '    font-size: 16px !important;',
      '    padding-right: 0 !important;',
      '  }',
      // 3 imagenes finales: stacked, sin estirar, con margen lateral
      '  .section.spacing-image-block,',
      '  .section:has(.image-block-services) {',
      '    padding-left: 18px !important;',
      '    padding-right: 18px !important;',
      '  }',
      '  .image-block-services {',
      '    display: flex !important;',
      '    flex-direction: column !important;',
      '    gap: 16px !important;',
      '    grid-template-columns: none !important;',
      '    padding: 16px 0 !important;',
      '  }',
      '  .image-block-services .image-block {',
      '    width: 100% !important;',
      '    height: auto !important;',
      '    max-height: 260px !important;',
      '    aspect-ratio: 16 / 10 !important;',
      '    overflow: hidden !important;',
      '    border-radius: 10px;',
      '  }',
      '  .image-block-services .image-block.centered-block {',
      '    height: auto !important;',
      '    max-height: 320px !important;',
      '    aspect-ratio: 3 / 4 !important;',
      '    transform: none !important;',
      '    width: 65% !important;',
      '    margin: 0 auto !important;',
      '  }',
      // Hero /inmobiliaria: titulo que no se corta por los lados
      '  .section.inmobiliaria {',
      '    padding-top: 60px !important;',
      '    padding-bottom: 60px !important;',
      '    padding-left: 18px !important;',
      '    padding-right: 18px !important;',
      '  }',
      '  .section.inmobiliaria .large-container,',
      '  .section.inmobiliaria .banner-slider-container {',
      '    width: 100% !important;',
      '    max-width: 100% !important;',
      '    padding: 0 !important;',
      '  }',
      '  .section.inmobiliaria .heading,',
      '  .section.inmobiliaria .heading.agricultura,',
      '  .section.inmobiliaria h1 {',
      '    font-size: 34px !important;',
      '    line-height: 1.2 !important;',
      '    word-wrap: normal !important;',
      '    white-space: normal !important;',
      '    max-width: 100% !important;',
      '    padding: 0 8px !important;',
      '    text-align: center !important;',
      '  }',
      '  .image-block-services img,',
      '  .image-block-services .image-19,',
      '  .image-block-services .image-20,',
      '  .image-block-services .image-21 {',
      '    width: 100% !important;',
      '    height: 100% !important;',
      '    object-fit: cover !important;',
      '    display: block;',
      '  }',
      '}',
      // Bloque nuevo debajo del wrapper (intro centrada + 2 cards + cierre)
      '.maquinasa-inmo-page-text {',
      '  display: block;',
      '  width: 100%;',
      '  max-width: 100%;',
      '  padding: 60px 20px;',
      '  margin: 0 auto;',
      '  background: #fafafa;',
      '}',
      '.maquinasa-inmo-inner {',
      '  max-width: 1100px;',
      '  margin: 0 auto;',
      '}',
      '.maquinasa-inmo-lead {',
      '  text-align: center;',
      '  font-size: 26px;',
      '  line-height: 1.5;',
      '  color: #184044;',
      '  max-width: 820px;',
      '  margin: 0 auto 40px auto;',
      '  font-weight: 400;',
      '}',
      '.maquinasa-inmo-lead strong { color: #184044; font-weight: 700; }',
      '.maquinasa-inmo-cards {',
      '  display: grid;',
      '  grid-template-columns: 1fr 1fr;',
      '  gap: 24px;',
      '  margin-bottom: 36px;',
      '}',
      '.maquinasa-inmo-card {',
      '  background: #ffffff;',
      '  border: 1px solid #e4e8ea;',
      '  border-radius: 10px;',
      '  padding: 28px 26px;',
      '  transition: transform .2s ease, box-shadow .2s ease;',
      '}',
      '.maquinasa-inmo-card:hover {',
      '  transform: translateY(-2px);',
      '  box-shadow: 0 8px 24px rgba(24,64,68,.08);',
      '}',
      '.maquinasa-inmo-card h4 {',
      '  font-size: 21px;',
      '  font-weight: 700;',
      '  color: #184044;',
      '  margin: 0 0 12px 0;',
      '  letter-spacing: 0.3px;',
      '}',
      '.maquinasa-inmo-card p {',
      '  font-size: 18px;',
      '  line-height: 1.6;',
      '  color: #555;',
      '  margin: 0;',
      '}',
      '.maquinasa-inmo-closing {',
      '  text-align: center;',
      '  font-size: 19px;',
      '  line-height: 1.6;',
      '  color: #555;',
      '  max-width: 820px;',
      '  margin: 0 auto;',
      '}',
      '.maquinasa-inmo-closing strong { color: #184044; }',
      '@media (max-width: 767px) {',
      '  .maquinasa-inmo-page-text { padding: 40px 18px; }',
      '  .maquinasa-inmo-lead { font-size: 18px; margin-bottom: 28px; }',
      '  .maquinasa-inmo-cards { grid-template-columns: 1fr; gap: 16px; margin-bottom: 28px; }',
      '  .maquinasa-inmo-card { padding: 22px 20px; }',
      '  .maquinasa-inmo-card h4 { font-size: 16px; }',
      '  .maquinasa-inmo-card p { font-size: 14px; }',
      '  .maquinasa-inmo-closing { font-size: 15px; }',
      '}'
    ].join('\n'));

    log('F9.2 /inmobiliaria text block inyectado + imagen grande');
  }

  // Navbar dropdown Servicios: 2 items + abrir en hover (global)
  function fixNavServicesDropdown() {
    var dropdownLinks = document.querySelectorAll('.dropdown-list .dropdown-link, .w-dropdown-list .w-dropdown-link');
    if (dropdownLinks.length) {
      dropdownLinks.forEach(function (link) {
        var t = link.textContent.trim().toLowerCase();
        if (t.indexOf('inmobiliaria') !== -1) {
          link.textContent = 'INMOBILIARIA';
          link.setAttribute('href', '/all-services#inmobiliaria');
          link.style.display = '';
        } else if (t.indexOf('automoci') !== -1) {
          link.textContent = 'ASESORAMIENTO';
          link.setAttribute('href', '/all-services#asesoramiento');
          link.style.display = '';
        } else {
          // borrar (display none) cualquier otro item del dropdown
          link.style.display = 'none';
        }
      });
    }

    // Dropdown CUSTOM: eliminamos el original y construimos uno nuevo
    var headerLinks = document.querySelectorAll('.header-link');
    headerLinks.forEach(function (hl) {
      var dd = hl.querySelector('.w-dropdown');
      if (!dd) return;
      if (hl.getAttribute('data-maquinasa-custom-dd') === '1') return;
      hl.setAttribute('data-maquinasa-custom-dd', '1');

      // BORRAR el dropdown-list original del DOM (no solo ocultarlo)
      var originalList = dd.querySelector('.w-dropdown-list');
      if (originalList && originalList.parentNode) {
        originalList.parentNode.removeChild(originalList);
      }

      // Construir nuestro propio menu
      var customMenu = document.createElement('div');
      customMenu.className = 'maquinasa-custom-menu';
      customMenu.innerHTML = [
        '<a href="/all-services#inmobiliaria" class="maquinasa-custom-menu-item">INMOBILIARIA</a>',
        '<a href="/all-services#asesoramiento" class="maquinasa-custom-menu-item">ASESORAMIENTO</a>'
      ].join('');

      hl.style.position = 'relative';
      hl.appendChild(customMenu);

      // Hover con JS (mas fiable que :hover CSS en layouts complejos)
      var hoverTimeout = null;
      function showMenu() {
        if (hoverTimeout) { clearTimeout(hoverTimeout); hoverTimeout = null; }
        customMenu.style.setProperty('display', 'block', 'important');
      }
      function hideMenu() {
        hoverTimeout = setTimeout(function () {
          customMenu.style.removeProperty('display');
        }, 200);
      }
      hl.addEventListener('mouseenter', showMenu);
      hl.addEventListener('mouseleave', hideMenu);
      customMenu.addEventListener('mouseenter', showMenu);
      customMenu.addEventListener('mouseleave', hideMenu);
    });

    // CSS del menu custom
    injectCSS('maquinasa-custom-dropdown', [
      '.maquinasa-custom-menu {',
      '  position: absolute !important;',
      '  top: 100% !important;',
      '  left: 0 !important;',
      '  right: auto !important;',
      '  transform: none !important;',
      '  background: #184044 !important;',
      '  border-radius: 6px;',
      '  box-shadow: 0 8px 30px rgba(0,0,0,.22);',
      '  padding: 6px 0;',
      '  min-width: 220px;',
      '  display: none;',
      '  z-index: 9999 !important;',
      '  margin-top: 10px;',
      '}',
      '.header-link:hover .maquinasa-custom-menu,',
      '.maquinasa-custom-menu:hover {',
      '  display: block !important;',
      '}',
      '.maquinasa-custom-menu-item {',
      '  display: block !important;',
      '  padding: 12px 22px;',
      '  color: #ffffff !important;',
      '  text-decoration: none !important;',
      '  font-size: 14px;',
      '  font-weight: 600;',
      '  letter-spacing: 0.5px;',
      '  transition: background 0.15s ease;',
      '  white-space: nowrap;',
      '}',
      '.maquinasa-custom-menu-item:hover {',
      '  background: rgba(255,255,255,.12);',
      '  color: #ffffff !important;',
      '}',
      // Ocultar dropdown original para siempre
      '.w-dropdown .w-dropdown-list,',
      '.w-dropdown .dropdown-list {',
      '  display: none !important;',
      '}'
    ].join('\n'));
  }

  function fixServicesPage() {
    fixNavServicesDropdown();
    if (!/all-services/.test(location.href)) return;
    if (document.documentElement.hasAttribute('data-maquinasa-services-fixed')) return;

    var cards = document.querySelectorAll('.block-up');
    if (!cards.length) return;

    // BORRAR del DOM los .cart-block-services vacios (template placeholders)
    // No basta con display:none porque el template puede reinsertar o
    // el layout del flex/grid puede dejar espacio.
    var blocks = document.querySelectorAll('.cart-block-services');
    blocks.forEach(function (b) {
      var hasContent = b.querySelector('.block-up') && b.textContent.trim().length > 0;
      if (!hasContent && b.parentNode) {
        b.parentNode.removeChild(b);
      }
    });

    // Desactivar animaciones de Webflow IX2 en las cards: eliminar data-w-id
    // de las cards y de TODOS los descendientes para que IX2 no las
    // maneje. Tambien resetear style inline que IX2 haya puesto.
    var allCardEls = document.querySelectorAll('.cart-block-services, .cart-block-services *, .services-cart-wrapper *');
    allCardEls.forEach(function (el) {
      el.removeAttribute('data-w-id');
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
      // Forzar visible
      el.style.setProperty('opacity', '1', 'important');
    });

    // Renombrar cards + añadir anclas + actualizar hrefs de "Saber mas"
    cards.forEach(function (card) {
      var h3 = card.querySelector('h3');
      if (!h3) return;
      var text = h3.textContent.trim().toLowerCase();
      var item = card.closest('.collection-item-services-cart, .collection-item-service, .w-dyn-item') || card;
      var saberMas = card.querySelector('a');
      if (text.indexOf('inmobiliaria') !== -1) {
        h3.textContent = 'INMOBILIARIA';
        item.id = 'inmobiliaria';
        // "Saber mas" va a la pagina dedicada /inmobiliaria
        if (saberMas) saberMas.setAttribute('href', '/inmobiliaria');
      } else if (text.indexOf('automoci') !== -1 || text.indexOf('asesoramiento') !== -1) {
        h3.textContent = 'ASESORAMIENTO';
        item.id = 'asesoramiento';
        var p = item.querySelector('p, .paragraph, .text-block');
        if (p) p.textContent = 'Expertos en planificación estratégica y desarrollo de negocio para tu empresa.';
        // "Saber mas" -> /all-services#asesoramiento (ancla en la misma pagina)
        if (saberMas) saberMas.setAttribute('href', '/all-services#asesoramiento');
      } else {
        item.style.display = 'none';
      }
    });

    // Eliminar bloque de texto de /all-services si existe (de runs previos)
    var oldText = document.querySelector('.maquinasa-inmobiliaria-text');
    if (oldText) oldText.parentNode.removeChild(oldText);

    // Ocultar slider "Experiencia, excelencia y compromiso"
    var slider = document.querySelector('.slider-block.w-slider');
    if (slider) {
      var sliderSection = slider.closest('.section') || slider;
      sliderSection.style.display = 'none';
    }
    // Tambien ocultar cualquier h2 con 'Experiencia ... excelencia'
    var allH2 = document.querySelectorAll('h2');
    allH2.forEach(function (h) {
      if (/experiencia.*excelencia/i.test(h.textContent)) {
        var s = h.closest('.section') || h.parentNode;
        if (s) s.style.display = 'none';
      }
    });

    // CSS: bloque texto + scroll-behavior smooth para que las anclas
    // de Home (#inmobiliaria, #asesoramiento) deslicen suavemente
    injectCSS('maquinasa-services-css', [
      'html { scroll-behavior: smooth; }',
      '#inmobiliaria, #asesoramiento { scroll-margin-top: 100px; }',
      // 2 cards juntas, mas anchas, superpuestas al hero (-80px)
      '.services-cart-wrapper {',
      '  display: flex !important;',
      '  flex-wrap: wrap !important;',
      '  justify-content: center !important;',
      '  align-items: stretch !important;',
      '  gap: 30px !important;',
      '  width: 100% !important;',
      '  margin-top: -80px !important;',
      '  position: relative !important;',
      '  z-index: 5 !important;',
      '}',
      // Reducir padding del .section que contiene las cards
      '.section:has(.services-cart-wrapper),',
      '.services-cart-wrapper + .section,',
      '.section.section-heading-services {',
      '  padding-top: 30px !important;',
      '  padding-bottom: 30px !important;',
      '}',
      // Reducir margen entre el bloque de cards y el siguiente section
      '.section .section-title-wrapper { margin-top: 20px !important; margin-bottom: 16px !important; }',
      // .free-trial-wrapper (Contactanos y empieza...) section padding reducido
      '.section:has(.free-trial-wrapper) {',
      '  padding-top: 30px !important;',
      '  padding-bottom: 30px !important;',
      '}',
      '.services-cart-wrapper .cart-block-services {',
      '  flex: 0 1 480px !important;',
      '  width: 480px !important;',
      '  max-width: 48% !important;',
      '  margin: 0 !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '}',
      '.services-cart-wrapper .collection-list-wrapper-services-cart {',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  margin: 0 !important;',
      '}',
      '.services-cart-wrapper .w-dyn-items {',
      '  width: 100% !important;',
      '}',
      '.services-cart-wrapper .collection-item-services-cart {',
      '  width: 100% !important;',
      '}',
      '.services-cart-wrapper .cart-services,',
      '.services-cart-wrapper .block-up {',
      '  width: 100% !important;',
      '  max-width: 100% !important;',
      '  display: flex !important;',
      '  flex-direction: column !important;',
      '  align-items: center !important;',
      '  text-align: center !important;',
      '  height: 100% !important;',
      '  flex: 1 !important;',
      '}',
      // Cart layout: contenido pegado arriba, sin justify-center que separa
      '.services-cart-wrapper .cart-services {',
      '  justify-content: flex-start !important;',
      '  padding-top: 50px !important;',
      '  padding-bottom: 30px !important;',
      '  min-height: 280px !important;',
      '}',
      // Boton "Saber mas" pegado al texto (no al fondo)
      '.services-cart-wrapper .block-up a,',
      '.services-cart-wrapper .block-up .button,',
      '.services-cart-wrapper .cart-services a.button {',
      '  margin: 14px auto 0 auto !important;',
      '  align-self: center !important;',
      '}',
      // Reducir espacio entre texto de card y boton
      '.services-cart-wrapper .block-up p,',
      '.services-cart-wrapper .paragraph-services-cart {',
      '  margin-bottom: 8px !important;',
      '}',
      // Reducir padding del section que contiene las cards en desktop
      '.section:has(.services-cart-wrapper) {',
      '  padding-bottom: 20px !important;',
      '}',
      '.section:has(.services-cart-wrapper) + .section {',
      '  padding-top: 30px !important;',
      '}',
      // Forzar contenido visible (anular animaciones opacity/transform IX2)
      '.services-cart-wrapper .cart-services,',
      '.services-cart-wrapper .block-up,',
      '.services-cart-wrapper .cart-services *,',
      '.services-cart-wrapper .block-up * {',
      '  opacity: 1 !important;',
      '  transform: none !important;',
      '  visibility: visible !important;',
      '}',
      // Quitar transition hover de las cards
      '.services-cart-wrapper .cart-services,',
      '.services-cart-wrapper .cart-block-services {',
      '  transition: none !important;',
      '}',
      '.services-cart-wrapper .cart-services:hover,',
      '.services-cart-wrapper .cart-block-services:hover {',
      '  transform: none !important;',
      '  opacity: 1 !important;',
      '}',
      // ===== MOBILE: services page =====
      '@media (max-width: 767px) {',
      '  .section:has(.services-cart-wrapper),',
      '  .section:has(.cart-block-services) {',
      '    padding-left: 16px !important;',
      '    padding-right: 16px !important;',
      '  }',
      '  .services-cart-wrapper {',
      '    flex-direction: column !important;',
      '    gap: 12px !important;',
      '    padding: 0 15px !important;',
      '    margin-top: -30px !important;',
      '    margin-bottom: 0 !important;',
      '    position: relative !important;',
      '    z-index: 5 !important;',
      '  }',
      '  .services-cart-wrapper .cart-block-services {',
      '    flex: 0 0 auto !important;',
      '    width: 100% !important;',
      '    max-width: 100% !important;',
      '    min-height: 230px !important;',
      '    margin-left: auto !important;',
      '    margin-right: auto !important;',
      '  }',
      '  .services-cart-wrapper .cart-services,',
      '  .services-cart-wrapper .block-up {',
      '    min-height: 230px !important;',
      '    padding: 20px 20px !important;',
      '    justify-content: center !important;',
      '  }',
      // Asegurar que el boton "Saber mas" se muestra
      '  .services-cart-wrapper .block-up a,',
      '  .services-cart-wrapper .cart-services a {',
      '    display: inline-flex !important;',
      '    visibility: visible !important;',
      '    margin-top: 10px !important;',
      '  }',
      // Reducir espacio entre sub-secciones en services mobile
      '  .all-services-banner,',
      '  .section-heading.all-services-banner {',
      '    margin-bottom: 0 !important;',
      '    padding-bottom: 30px !important;',
      '  }',
      '  .heading-services-cart {',
      '    font-size: 22px !important;',
      '    margin-bottom: 10px !important;',
      '  }',
      '  .paragraph-services-cart {',
      '    font-size: 14px !important;',
      '    margin-bottom: 14px !important;',
      '  }',
      '  .services-cart-wrapper .block-up a {',
      '    margin: 14px auto !important;',
      '  }',
      // Reducir h2 (Todos los servicios... y Contactanos y...) en mobile
      '  .heading-span,',
      '  .heading-section-banner,',
      '  h2.heading-span,',
      '  .free-trial-wrapper h2 {',
      '    font-size: 26px !important;',
      '    line-height: 1.2 !important;',
      '    margin-top: 0 !important;',
      '    margin-bottom: 12px !important;',
      '  }',
      '  .heading-span .heading-text-span {',
      '    font-size: inherit !important;',
      '  }',
      // Reducir el doble espacio entre cards y h2 "Todos los servicios" / "Contactanos"
      '  .section-title-wrapper {',
      '    margin-top: 12px !important;',
      '    margin-bottom: 8px !important;',
      '  }',
      '  .section:has(.services-cart-wrapper) {',
      '    padding-top: 10px !important;',
      '    padding-bottom: 10px !important;',
      '  }',
      '  .section:has(.free-trial-wrapper) {',
      '    padding-top: 10px !important;',
      '    padding-bottom: 10px !important;',
      '  }',
      '  .services-cart-wrapper {',
      '    margin-bottom: 0 !important;',
      '  }',
      // ~60-80px total entre cards y siguiente texto
      '  .section:has(.services-cart-wrapper) + .section {',
      '    padding-top: 25px !important;',
      '    padding-bottom: 10px !important;',
      '  }',
      '  .section:has(.services-cart-wrapper) + .section .section-title-wrapper,',
      '  .section:has(.services-cart-wrapper) + .section .heading-span {',
      '    margin-top: 0 !important;',
      '    padding-top: 0 !important;',
      '  }',
      // Cards mobile: contenido pegado arriba tambien
      '  .services-cart-wrapper .cart-services {',
      '    justify-content: flex-start !important;',
      '    padding-top: 30px !important;',
      '    padding-bottom: 20px !important;',
      '    min-height: 220px !important;',
      '  }',
      // Reducir espacio general de los .section en services mobile
      '  .section {',
      '    padding-top: 16px !important;',
      '    padding-bottom: 16px !important;',
      '  }',
      '}',
      '.maquinasa-inmobiliaria-text {',
      '  max-width: 900px;',
      '  margin: 30px auto 50px auto;',
      '  padding: 0 20px;',
      '}',
      '.maquinasa-svc-text-inner {',
      '  background: #f8f8f8;',
      '  border-left: 4px solid #184044;',
      '  padding: 28px 32px;',
      '  border-radius: 8px;',
      '  font-size: 16px;',
      '  line-height: 1.6;',
      '  color: #333;',
      '}',
      '.maquinasa-svc-text-inner p {',
      '  margin: 0 0 16px 0;',
      '}',
      '.maquinasa-svc-text-inner ul {',
      '  list-style: none;',
      '  padding: 0;',
      '  margin: 16px 0;',
      '}',
      '.maquinasa-svc-text-inner li {',
      '  padding: 10px 0 10px 24px;',
      '  position: relative;',
      '  margin-bottom: 8px;',
      '}',
      '.maquinasa-svc-text-inner li:before {',
      '  content: "▸";',
      '  color: #184044;',
      '  font-weight: bold;',
      '  position: absolute;',
      '  left: 0;',
      '  top: 10px;',
      '}',
      '.maquinasa-svc-text-inner strong {',
      '  color: #184044;',
      '}',
      '@media (max-width: 767px) {',
      '  .maquinasa-svc-text-inner {',
      '    padding: 22px 20px;',
      '    font-size: 15px;',
      '  }',
      '}'
    ].join('\n'));

    document.documentElement.setAttribute('data-maquinasa-services-fixed', '1');
    log('F9 services page reorganizado');
  }

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
    fixAutomacionRedirect(); // redirect /automacion -> /all-services#asesoramiento
    fixServicesPage();     // F9 services
    fixInmobiliariaPage(); // F9.2 /inmobiliaria text block
    fixFooterLogoSize();   // F7.1
    fixFooterExtraLinks(); // F7.2 + F7.3
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
