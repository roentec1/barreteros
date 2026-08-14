/* ============================================================
   BARRETEROS — EST. 1977 | JavaScript vanilla (sin librerías)
   ============================================================ */
'use strict';

/* ============================================================
   1) CONFIGURACIÓN EDITABLE
   Sustituye los placeholders sin tocar el resto del código.
   ============================================================ */
const CONFIG = {
  // WhatsApp: código de país + número, solo dígitos. Ej: "5218771234567"
  whatsappNumber: "528661633223", // ← NUMERO_WHATSAPP (placeholder)
  whatsappMessage: "Hola Barreteros, quiero obtener información sobre los próximos juegos.",
  email: "[CORREO DEL EQUIPO]",     // ← placeholder

  socialLinks: {
    instagram: "https://www.instagram.com/barreteros_de_barroteran_?igsh=cGp2cmMzbGM1amFs&utm_source=qr&fbclid=IwY2xjawTrMtFwZG9mBWV4dG4DYWVtAjEwAGJyaWQRMUVDOGxYQ05NMVUybGZOUVNzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEe1MGVmrPL5ptRzCcPFMLs1c00hjyTEM_WvAUqI1Wv7UifP5RAq8JvbR_7KZ0_aem_Y1ag2zZdW-Hu2MjOKaDb2A",     // ← https://instagram.com/tu-cuenta
    facebook:  "https://www.facebook.com/profile.php?id=100090063850039",      // ← https://facebook.com/tu-pagina
    whatsapp:  "https://wa.me/528661633223"    // ← mismo formato que whatsappNumber
  },

  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Barroter%C3%A1n%2C+Coahuila%2C+M%C3%A9xico"
};

/* ============================================================
   2) DATOS DE DEMOSTRACIÓN (editar / ampliar libremente)
   ============================================================ */

/* --- Jugadores: agrega nuevos copiando el formato --- */
const JUGADORES = [
  { numero: 10, nombre: "Juan Pérez",               posicion: "Pitcher",  img: "assets/jugadores/pitcher-10.png",  desc: "Brazo derecho con control absoluto en la loma. (Perfil de ejemplo)", extra: "Estadísticas de carrera por documentar." },
  { numero: 7,  nombre: "Carlos «El Rayo» Martínez", posicion: "Bateador", img: "assets/jugadores/bateador-7.png",  desc: "Power hitter que enciende la pizarra. (Perfil de ejemplo)",        extra: "Promedio de bateo por documentar." },
  { numero: 24, nombre: "Miguel Ángel Rodríguez",    posicion: "Receptor", img: "assets/jugadores/receptor-24.png", desc: "El cerebro detrás del home plate. (Perfil de ejemplo)",            extra: "Temporadas con el equipo por documentar." },
  { numero: 3,  nombre: "Luis Hernández",            posicion: "Infielder",img: "assets/jugadores/infielder-3.png", desc: "Guante de oro en el cuadro interior. (Perfil de ejemplo)",         extra: "Jugadas destacadas por documentar." }
];

/* --- Próximos partidos --- */
const PARTIDOS = [
  { dia: "SÁBADO",  fecha: "22 AGO", hora: "7:30 PM", visitante: "Mineros (ejemplo)",  estadio: "Estadio de Barroterán" },
  { dia: "DOMINGO", fecha: "30 AGO", hora: "5:00 PM", visitante: "Vaqueros (ejemplo)", estadio: "Estadio de Barroterán" },
  { dia: "SÁBADO",  fecha: "05 SEP", hora: "7:30 PM", visitante: "Acereros (ejemplo)", estadio: "Estadio de Barroterán" }
];

/* --- Resultados: res = "V" victoria | "D" derrota | "E" empate --- */
const RESULTADOS = [
  { visitante: "Mineros (ejemplo)",   ml: 8, mv: 4, res: "V" },
  { visitante: "Vaqueros (ejemplo)",  ml: 3, mv: 5, res: "D" },
  { visitante: "Acereros (ejemplo)",  ml: 2, mv: 2, res: "E" },
  { visitante: "Rurales (ejemplo)",   ml: 6, mv: 1, res: "V" },
  { visitante: "Cardenales (ejemplo)",ml: 0, mv: 2, res: "D" },
  { visitante: "Sideristas (ejemplo)",ml: 9, mv: 7, res: "V" }
];

/* ============================================================
   3) UTILIDADES
   ============================================================ */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   4) HEADER: sombra al scroll + menú hamburguesa
   ============================================================ */
function initHeader() {
  const header = $('.site-header');
  const toggle = $('#menu-toggle');
  const nav    = $('#main-nav');
  const backdrop = $('#nav-backdrop');

  const setShadow = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', setShadow, { passive: true });
  setShadow();

  const abrir  = () => { nav.classList.add('open');  toggle.classList.add('open');  backdrop.hidden = false; toggle.setAttribute('aria-expanded', 'true');  toggle.setAttribute('aria-label', 'Cerrar menú'); };
  const cerrar = () => { nav.classList.remove('open'); toggle.classList.remove('open'); backdrop.hidden = true;  toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); };

  toggle.addEventListener('click', () => nav.classList.contains('open') ? cerrar() : abrir());
  backdrop.addEventListener('click', cerrar);
  $$('.nav-list a').forEach(a => a.addEventListener('click', cerrar));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) cerrar(); });
}

/* ============================================================
   5) ANIMACIONES AL SCROLL (reveal + escalonado)
   ============================================================ */
function initReveal() {
  // Escalonado automático de hijos en contenedores [data-stagger]
  $$('[data-stagger]').forEach(group => {
    $$('.reveal', group).forEach((el, i) => el.style.transitionDelay = `${Math.min(i * 110, 550)}ms`);
  });

  if (reduceMotion) { $$('.reveal').forEach(el => el.classList.add('visible')); return; }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: .15 });

  $$('.reveal').forEach(el => io.observe(el));
}

/* ============================================================
   6) CONTADORES ANIMADOS (estadísticas de la afición)
   ============================================================ */
function initCounters() {
  const nums = $$('.stat-number');
  if (reduceMotion) return; // deja el valor final del HTML

  const animar = el => {
    const target = parseInt(el.dataset.target, 10);
    const start  = parseInt(el.dataset.start || 0, 10);
    const prefix = el.dataset.prefix || '';
    const dur = 1600;
    let t0 = null;

    const paso = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = prefix + Math.round(start + (target - start) * ease);
      if (p < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animar(e.target); io.unobserve(e.target); } });
  }, { threshold: .6 });
  nums.forEach(n => io.observe(n));
}

/* ============================================================
   7) PARALLAX LIGERO DEL HERO
   ============================================================ */
function initParallax() {
  if (reduceMotion) return;
  const capa = $('.hero-parallax');
  let tick = false;
  window.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, window.innerHeight);
      capa.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
      tick = false;
    });
  }, { passive: true });
}

/* ============================================================
   8) RENDERIZADO DE DATOS (jugadores, partidos, resultados)
   ============================================================ */
function renderJugadores() {
  const grid = $('#players-grid');
  grid.innerHTML = JUGADORES.map((j, i) => `
    <div class="reveal" style="transition-delay:${i * 90}ms">
      <article class="player-card" tabindex="0">
        <figure class="player-photo">
          <img src="${j.img}" alt="${j.nombre}, ${j.posicion} de Barreteros" loading="lazy">
          <span class="player-number">#${j.numero}</span>
          <span class="player-pos">${j.posicion}</span>
        </figure>
        <div class="player-info">
          <h3>${j.nombre}</h3>
          <p>${j.desc}</p>
          <p class="player-extra">★ ${j.extra}</p>
        </div>
      </article>
    </div>`).join('');
}

function renderPartidos() {
  const grid = $('#games-grid');
  grid.innerHTML = PARTIDOS.map((p, i) => `
    <div class="reveal" style="transition-delay:${i * 90}ms">
      <article class="game-card">
        <header class="game-top">
          <span class="game-date">${p.dia} ${p.fecha}</span>
          <span class="game-time">${p.hora}</span>
        </header>
        <div class="game-teams">
          <div class="team">
            <img class="team-logo" src="assets/logo.jpg" alt="Escudo de Barreteros">
            <span class="team-name">Barreteros</span>
            <span class="team-tag">Local</span>
          </div>
          <span class="game-vs" aria-label="contra">VS</span>
          <div class="team">
            <span class="team-logo--away" aria-hidden="true">★</span>
            <span class="team-name">${p.visitante}</span>
            <span class="team-tag">Visitante</span>
          </div>
        </div>
        <footer class="game-bottom">
          <span class="game-stadium">📍 ${p.estadio}</span>
          <a href="#contacto" class="btn btn-small">Ver detalles</a>
        </footer>
      </article>
    </div>`).join('');
}

function renderResultados() {
  const lista = $('#results-list');
  const txt = { V: 'Victoria', D: 'Derrota', E: 'Empate' };

  lista.innerHTML = RESULTADOS.map((r, i) => `
    <article class="result-card reveal ${r.res === 'V' ? 'is-win' : r.res === 'D' ? 'is-loss' : 'is-tie'} ${i >= 3 ? 'hidden' : ''}" style="transition-delay:${i * 70}ms">
      <span class="result-badge" aria-hidden="true">${r.res}</span>
      <p class="result-score"><strong>Barreteros ${r.ml}</strong> — ${r.mv} ${r.visitante}</p>
      <span class="result-tag">${txt[r.res]}</span>
    </article>`).join('');

  // Botón "ver todos"
  const btn = $('#btn-all-results');
  btn.addEventListener('click', () => {
    $$('.result-card.hidden', lista).forEach(c => c.classList.remove('hidden'));
    $$('.result-card', lista).forEach(c => c.classList.add('visible'));
    btn.style.display = 'none';
  });
}

/* ============================================================
   9) LIGHTBOX DE GALERÍA (JS puro, teclado incluido)
   ============================================================ */
function initLightbox() {
  const items   = $$('.gallery-item');
  const box     = $('#lightbox');
  const img     = $('#lightbox-img');
  const caption = $('#lightbox-caption');
  let idx = 0, ultimoFoco = null;

  const mostrar = i => {
    idx = (i + items.length) % items.length;
    const el = items[idx];
    img.src = el.dataset.full;
    img.alt = el.dataset.caption;
    caption.textContent = el.dataset.caption;
  };
  const abrir = i => {
    ultimoFoco = document.activeElement;
    mostrar(i); box.hidden = false;
    document.body.style.overflow = 'hidden';
    $('#lightbox-close').focus();
  };
  const cerrar = () => {
    box.hidden = true;
    document.body.style.overflow = '';
    if (ultimoFoco) ultimoFoco.focus();
  };

  items.forEach((el, i) => el.addEventListener('click', () => abrir(i)));
  $('#lightbox-close').addEventListener('click', cerrar);
  $('#lightbox-prev').addEventListener('click', () => mostrar(idx - 1));
  $('#lightbox-next').addEventListener('click', () => mostrar(idx + 1));
  box.addEventListener('click', e => { if (e.target === box) cerrar(); });
  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape')     cerrar();
    if (e.key === 'ArrowLeft')  mostrar(idx - 1);
    if (e.key === 'ArrowRight') mostrar(idx + 1);
  });
}

/* ============================================================
   10) REDES SOCIALES, WHATSAPP Y MAPAS (enlaces configurables)
   ============================================================ */
function initEnlaces() {
  const num = CONFIG.socialLinks.whatsapp !== "NUMERO_WHATSAPP" ? CONFIG.socialLinks.whatsapp : CONFIG.whatsappNumber;
  const wa  = `https://wa.me/${num}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`;

  // WhatsApp: todos los botones preparados
  $$('.js-whatsapp').forEach(a => { a.href = wa; a.target = '_blank'; a.rel = 'noopener noreferrer'; });

  // Redes sociales
  $$('[data-social]').forEach(a => {
    const url = CONFIG.socialLinks[a.dataset.social];
    if (url && !url.startsWith('URL_')) { a.href = url; }
  });

  // Mapas: "cómo llegar" / "abrir en Google Maps"
  $$('.js-maps').forEach(a => { a.href = CONFIG.mapsUrl; if (!a.hasAttribute('target')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } });
}

/* ============================================================
   11) ARRANQUE
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  renderJugadores();
  renderPartidos();
  renderResultados();
  initHeader();
  initReveal();
  initCounters();
  initParallax();
  initLightbox();
  initEnlaces();
});
