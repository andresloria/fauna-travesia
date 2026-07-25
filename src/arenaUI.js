// ============================================================
// arenaUI.js — PANTALLA de combate ARENA (diseño v3, 21-jul-2026).
//
// Rediseño completo, aprobado por Andrés:
//   · MÓVIL PRIMERO y layout FLUIDO. Antes era una ventana fija de 940×600 que
//     se escalaba entera: en el teléfono quedaba a escala 0.39 (letra de 2px).
//     Ahora no hay escalado, hay layout: en celular se apila, en escritorio se
//     reparte el espacio (las 3 tiras de habilidades se ven a la vez).
//   · VERTICAL: el rival arriba, vos abajo, como los juegos de móvil.
//   · Se deja el cromado pixel-art de la INTERFAZ (los sprites y los iconos
//     siguen siendo pixel art, que es el arte que tenemos).
//   · ENERGÍA en columna al costado izquierdo, a media altura, con el icono
//     de cada bioma (antes iba abajo con emoji del sistema operativo).
//   · Flechas a los objetivos + resolución animada paso a paso.
//
// Habla SOLO con src/arena.js (motor puro). game.js/liga.js la abren con
// abrirArena() y el contrato NO cambió: opts.onFin(gané, caídos, st).
// ============================================================

import * as A from './arena.js';
import { SP } from './fauna_roster.js';
import { iconoIMG, ICONO_URL } from './iconos.js';

const ART = (key) => (SP[key] && SP[key].folk) ? `assets/folclor/${key}.png` : `assets/animales/${key}.png`;
const BIOMA_ICO = (b) => ICONO_URL('bioma_' + b);
const BIOMA_N = { bosque: 'Bosque', sabana: 'Sabana', agua: 'Agua', montana: 'Montaña', comodin: 'Comodín' };
const CLASE_N = {
  fisico: 'Físico', natural: 'Natural', toxina: 'Toxina', instinto: 'Instinto',
  melee: 'Cuerpo a cuerpo', rango: 'Distancia', instant: 'Instantáneo',
  sostenido: 'Sostenido', control: 'Control', unico: 'Único',
};
const TURNO_SEG = 60;
const MOVIL = () => window.innerWidth < 900;

// ---- iconos SVG de la interfaz ----
// Antes eran emojis del sistema (🛡☣💚✨💫🎯🌵🔆🩸⬆ 🤖🏳👆🪤🏆💀): cada aparato
// los dibuja distinto y el trazo no combina con el resto. Ahora son SVG propios,
// mismo trazo en todos lados, y toman el color del chip por currentColor.
const SVG = (p, s = 12) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const ICO = {
  defensa: '<path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/>',
  reducir: '<path d="M12 3l7 3v5c0 4-3 7-7 8-4-1-7-4-7-8V6z"/><path d="M9 12h6"/>',
  toxina:  '<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z"/><circle cx="12" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>',
  cura:    '<path d="M12 6v12M6 12h12"/>',
  invuln:  '<path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z"/>',
  aturdir: '<path d="M16 8a4.5 4.5 0 1 0 1.2 4.6"/><circle cx="8.5" cy="17" r="1.3" fill="currentColor" stroke="none"/>',
  exponer: '<circle cx="12" cy="12" r="5.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3"/>',
  contra:  '<path d="M10 8L6 12l4 4"/><path d="M6 12h8a4 4 0 0 1 4 4v1.5"/>',
  modo:    '<path d="M13 3c.5 3 3 4 3 7a4 4 0 0 1-8 0c0-2 1-3 2-4 .2 1.8 1.2 2.5 2 2.5-1.2-2 0-4 1-7.5z"/>',
  marca:   '<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="currentColor" stroke="none"/>',
  amp:     '<path d="M12 19V6M6 12l6-6 6 6"/>',
  robot:   '<rect x="5" y="8" width="14" height="10" rx="2"/><path d="M12 8V5M9 13h.01M15 13h.01"/>',
  bandera: '<path d="M6 21V4M6 4h10l-2 3.5L16 11H6"/>',
  toque:   '<path d="M9 11.5V6.5a1.5 1.5 0 0 1 3 0v4M12 10.5V4.5a1.5 1.5 0 0 1 3 0v6M15 10.5V6.5a1.5 1.5 0 0 1 3 0v6a6 6 0 0 1-6 6h-1a5 5 0 0 1-4-2l-2.5-3.2a1.6 1.6 0 0 1 2.4-2.1L9 12"/>',
  trofeo:  '<path d="M8 4h8v4a4 4 0 0 1-8 0z"/><path d="M8 6H5v1a3 3 0 0 0 3 3M16 6h3v1a3 3 0 0 1-3 3M10 12.5h4M12 12.5V16M9 19h6M10 19l.5-3M14 19l-.5-3"/>',
  calavera:'<path d="M6 12a6 6 0 1 1 12 0v3a2 2 0 0 1-2 2h-1v2H9v-2H8a2 2 0 0 1-2-2z"/><circle cx="9.5" cy="11" r="1.4" fill="currentColor" stroke="none"/><circle cx="14.5" cy="11" r="1.4" fill="currentColor" stroke="none"/>',
  trampa:  '<circle cx="12" cy="12" r="7"/><path d="M12 5v3M12 16v3M5 12h3M16 12h3"/>',
};
const icoSVG = (name, s = 12) => SVG(ICO[name] || '', s);

// costo: un ICONO DEL BIOMA por cada energía que cuesta. Antes eran puntitos de
// color y había que acordarse de cuál era cuál; con el dibujo se lee de una.
const costoHTML = (costo) => !costo || !costo.length
  ? '<span class="ar-gratis">gratis</span>'
  : costo.map(c => c === 'TODO'
      ? '<b class="ar-todo">TODA</b>'
      : `<img class="ar-pt" src="${BIOMA_ICO(c)}" alt="${BIOMA_N[c]}" title="${BIOMA_N[c]}" draggable="false">`).join('');

// ---------- abrirArena: game.js llama esto y se olvida ----------
// opts: { miEquipo:[{key,ref}], rivalEquipo:[{key}], titulo, sub, fondo (url),
//         guiaArt, guiaSub, rivalArt, onFin(gané, caídosRefs, st) }
export function abrirArena(opts) {
  const st = A.mkCombate(opts.miEquipo, opts.rivalEquipo, { abre: Math.random() < 0.5 ? 'A' : 'B' });
  const root = document.createElement('div');
  root.className = 'ar-root';
  document.body.appendChild(root);
  document.body.classList.add('ar-lock');

  // ---------- HOTSEAT (opts.pvp) ----------
  // Sin PvP el jugador es SIEMPRE el lado A y el bot juega B. En hotseat los
  // dos lados son humanos que se pasan el aparato, así que "yo" es el lado que
  // tiene el turno y toda la pantalla se dibuja desde SU punto de vista: sus
  // animales abajo, los del otro arriba.
  const PVP = !!opts.pvp;
  const yo = () => (PVP ? st.lado : 'A');
  const elOtro = () => A.rival(yo());
  const nombreDe = (lado) => PVP
    ? (lado === 'A' ? (opts.jugador1 || 'Jugador 1') : (opts.jugador2 || 'Jugador 2'))
    : (lado === 'A' ? 'Vos' : (opts.titulo || 'Cazadores'));
  let tapado = false;          // la cortina de "pasá el aparato"

  let cola = [];               // [{uid, hab, objetivo}]
  let seleccion = null;        // {uid, hab, aliado?} esperando objetivo
  let activo = null;           // qué animal mío se está mirando (celular)
  let verInfo = null;          // {u, h} de la habilidad que muestra la tarjeta
  let auto = false;
  let timerId = null, timerFin = 0;
  let cerrando = false, animando = false;

  const u$ = (uid) => st.unidades.find(x => x.uid === uid);
  const mios = () => st.unidades.filter(u => u.lado === yo());
  const rivales = () => st.unidades.filter(u => u.lado === elOtro());
  const enCola = (uid) => cola.find(a => a.uid === uid);

  // energía que queda después de pagar lo que ya está en la cola
  const poolRestante = () => {
    const p = { ...st.energia[yo()] };
    for (const acc of cola) A.pagar(p, u$(acc.uid).habs[acc.hab].costo || []);
    return p;
  };

  // ---------------- armado del DOM (una sola vez) ----------------
  root.innerHTML = `
    <div class="ar-esc" id="arEsc">
      <div class="ar-fondo" style="background-image:url('${opts.fondo}')"></div>

      <header class="ar-top">
        <div class="ar-lado" id="arLadoIzq">
          <img src="${opts.guiaArt}" alt="">
          <div><b>—</b><span>${opts.guiaSub || 'Guía de naturaleza'}</span></div>
        </div>
        <div class="ar-reloj">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle class="pista" cx="24" cy="24" r="21"></circle>
            <circle class="barra" cx="24" cy="24" r="21" id="arAnillo"></circle>
          </svg>
          <b id="arSegs">–</b>
        </div>
        <div class="ar-lado der">
          ${opts.rivalArt ? `<img src="${opts.rivalArt}" alt="">` : `<div class="ar-sinart">${icoSVG('trampa', 20)}</div>`}
          <div id="arLadoDer"><b>${opts.titulo || 'Cazadores'}</b><span>${opts.sub || ''}</span></div>
        </div>
      </header>

      <div class="ar-campo">
        <div class="ar-fila" id="arRivales"></div>
        <div class="ar-fila" id="arMios"></div>
      </div>

      <aside class="ar-energia" id="arEnergia" aria-label="Tu energía"></aside>
      <svg class="ar-flechas" id="arFlechas" aria-hidden="true"></svg>

      <div class="ar-abajo">
        <div class="ar-info" id="arInfo"></div>
        <div class="ar-tiras" id="arTiras"></div>
        <div class="ar-habs" id="arHabs"></div>
        <div class="ar-acciones">
          <button class="ar-chico" id="arAuto">${icoSVG('robot', 15)} Auto</button>
          <button class="ar-chico mal" id="arHuir">${icoSVG('bandera', 15)} Rendirse</button>
          <button class="ar-listo" id="arListo">▶ LISTO</button>
        </div>
      </div>
    </div>`;

  const $ = (id) => root.querySelector('#' + id);
  const esc = $('arEsc'), elRivales = $('arRivales'), elMios = $('arMios');
  const elEnergia = $('arEnergia'), elFlechas = $('arFlechas');
  const elInfo = $('arInfo'), elTiras = $('arTiras'), elHabs = $('arHabs');

  // ---------------- pintado ----------------
  function render() {
    if (!activo || !u$(activo) || !u$(activo).viva) {
      const v = mios().find(u => u.viva);
      activo = v ? v.uid : null;
    }
    elRivales.innerHTML = rivales().map(u => tarjeta(u, true)).join('');
    elMios.innerHTML = mios().map(u => tarjeta(u, false)).join('');
    pintarEnergia();
    pintarHabilidades();
    elInfo.innerHTML = infoHTML();

    // en hotseat los nombres cambian de lado según de quién sea el turno
    const izq = root.querySelector('#arLadoIzq div');
    if (izq) izq.innerHTML = `<b>${nombreDe(yo())}</b><span>${PVP ? 'te toca' : (opts.guiaSub || 'Guía de naturaleza')}</span>`;
    const der = root.querySelector('#arLadoDer');
    if (der && PVP) der.innerHTML = `<b>${nombreDe(elOtro())}</b><span>espera</span>`;

    const listo = $('arListo');
    const miTurno = st.lado === yo() && !st.fin && !animando && !tapado;
    listo.disabled = !miTurno;
    listo.textContent = st.fin ? '—' : miTurno ? '▶ LISTO' : 'Turno del rival…';
    const bAuto = $('arAuto');
    if (PVP) bAuto.style.display = 'none'; else bAuto.classList.toggle('on', auto);

    conectar();
    requestAnimationFrame(pintarFlechas);
  }

  function tarjeta(u, esRival) {
    const acc = enCola(u.uid);
    const pct = Math.max(0, Math.round(u.hp / A.VIDA * 100));
    const objetivo = esRival && seleccion && !seleccion.aliado && objetivosValidos().includes(u.uid);
    const objAliado = !esRival && seleccion && seleccion.aliado && u.viva;
    return `<div class="ar-u ${esRival ? 'riv' : ''} ${!esRival && activo === u.uid ? 'act' : ''}
        ${objetivo || objAliado ? 'obj' : ''} ${u.viva ? '' : 'caida'}"
        data-uid="${u.uid}" id="ar-c-${u.uid}">
      ${acc ? `<span class="ar-orden">${cola.indexOf(acc) + 1}</span>` : ''}
      <div class="ar-art">
        <img src="${ART(u.key)}" alt="${u.n}" draggable="false">
        <div class="ar-fx">${fxs(u)}</div>
      </div>
      <div class="ar-nom">${u.n}</div>
      <div class="ar-vida"><i style="width:${pct}%"></i><em>${u.hp}/${A.VIDA}</em></div>
    </div>`;
  }

  function fxs(u) {
    const chip = (name, title, num = '', cls = '') =>
      `<i class="${cls}" title="${title}">${icoSVG(name)}${num !== '' && num != null ? `<b>${num}</b>` : ''}</i>`;
    const out = [];
    if (u.defensa > 0) out.push(chip('defensa', `Defensa ${u.defensa}`, u.defensa));
    for (const f of u.efectos) {
      if (f.t === 'dot') out.push(chip('toxina', `Toxina ${f.v} por turno`, f.turnos, 'mal'));
      if (f.t === 'hot') out.push(chip('cura', 'Curándose', f.turnos));
      if (f.t === 'invulnerable') out.push(chip('invuln', 'Invulnerable'));
      if (f.t === 'aturdir') out.push(chip('aturdir', 'Aturdida', '', 'mal'));
      if (f.t === 'exponer') out.push(chip('exponer', 'Expuesta', '', 'mal'));
      if (f.t === 'reducir') out.push(chip('reducir', `Recibe ${f.v} menos`));
      if (f.t === 'contra') out.push(chip('contra', 'Contraataca'));
      if (f.t === 'modo') out.push(chip('modo', 'Modo activo', f.turnos));
      if (f.t === 'marca') out.push(chip('marca', `Marcada +${f.v}`, '', 'mal'));
      if (f.t === 'amp') out.push(chip('amp', `Amplificado +${f.v}`));
    }
    return out.join('');
  }

  // ---- energía: columna al costado, con el icono de cada bioma ----
  let cambioAbierto = false;    // el selector de bioma del cambio 5→1
  function pintarEnergia() {
    const pool = poolRestante(), total = A.totalE(pool);
    // el CAMBIO (3 cualesquiera → 1 a elección) solo se ofrece con la cola
    // vacía: si ya encolaste, esas 3 podrían estar reservadas para pagar lo
    // encolado y el cambio te rompería la jugada.
    const puedoCambiar = st.lado === yo() && !st.fin && !animando && !tapado
      && cola.length === 0 && A.puedeCambiar(st, yo());
    elEnergia.innerHTML = A.BIOMAS.map(b => `
      <div class="ar-e ${pool[b] ? '' : 'cero'}" title="${BIOMA_N[b]}">
        <img src="${BIOMA_ICO(b)}" alt="${BIOMA_N[b]}" draggable="false">
        <b>${pool[b]}</b>
      </div>`).join('')
      + `<div class="ar-etot" title="Energía total">${total}</div>`
      + `<button class="ar-cambio ${puedoCambiar ? '' : 'off'}" id="arCambio"
           title="Cambiá 3 energías cualesquiera por 1 del tipo que elijás (1 vez por turno)">⇄ 3→1</button>`
      + (cambioAbierto && puedoCambiar ? `<div class="ar-picker">${A.BIOMAS.map(b => `
          <button class="ar-pick" data-bioma="${b}" title="Recibir 1 de ${BIOMA_N[b]}">
            <img src="${BIOMA_ICO(b)}" alt="${BIOMA_N[b]}" draggable="false">
          </button>`).join('')}</div>` : '');
  }

  function pintarHabilidades() {
    const act = u$(activo);
    elHabs.innerHTML = act ? act.habs.map((h, i) => botonHab(act, h, i)).join('') : '';
    elTiras.innerHTML = mios().map(u => `
      <div class="ar-tira ${u.viva ? '' : 'caida'}">
        <span class="ar-quien">${u.n}</span>
        <div class="ar-habs">${u.habs.map((h, i) => botonHab(u, h, i)).join('')}</div>
      </div>`).join('');
  }

  function botonHab(u, h, i) {
    const acc = enCola(u.uid);
    const esta = acc && acc.hab === i;
    const eligiendo = seleccion && seleccion.uid === u.uid && seleccion.hab === i;
    let off = '', motivo = '';
    if (st.lado !== yo() || st.fin || !u.viva || animando) off = 'off';
    else if (u.recargas[h.n] > 0) { off = 'off'; motivo = `↻${u.recargas[h.n]}`; }
    else if (A.aturdida(u, h.clases || [])) { off = 'off'; motivo = 'aturdida'; }
    else if (acc && !esta) off = 'off';
    else if (!esta && !A.alcanza(poolRestante(), [h.costo || []])) { off = 'off'; motivo = 'sin energía'; }
    return `<button class="ar-h ${off} ${esta || eligiendo ? 'on' : ''}"
        data-uid="${u.uid}" data-hab="${i}" title="${h.n}">
      ${iconoIMG(h, u.key)}
      <span class="ar-hn">${h.n}</span>
      <span class="ar-hc">${costoHTML(h.costo)}</span>
      ${motivo ? `<b class="ar-hm">${motivo}</b>` : ''}
    </button>`;
  }

  function infoHTML(par = verInfo) {
    if (!par) return `
      <div class="ar-ico vacio">${icoSVG('toque', 22)}</div>
      <div class="ar-itx">
        <h3>Elegí una habilidad</h3>
        <p>Tocá un animal tuyo para ver sus habilidades, después la habilidad y a quién se la
        tirás. El <b>orden de la cola</b> importa: cada animal usa 1 por turno.</p>
      </div>`;
    const { u, h } = par;
    const clases = (h.clases || []).map(c => CLASE_N[c] || c);
    const perfora = (h.efectos || []).some(f => f.ignoraInvulnerable || f.toxina || f.ignoraDefensa);
    return `
      <button class="ar-cerrar" id="arCerrar" aria-label="Cerrar">✕</button>
      <div class="ar-ico">${iconoIMG(h, u.key)}</div>
      <div class="ar-itx">
        <h3>${h.n} <small>· ${u.n}</small></h3>
        <p>${h.desc || ''}</p>
        <div class="ar-tags">
          <span class="ar-tag costo">${costoHTML(h.costo)}</span>
          <span class="ar-tag">↻ ${h.recarga || 0}</span>
          ${perfora ? '<span class="ar-tag perfora">Perfora</span>' : ''}
          ${clases.map(c => `<span class="ar-tag">${c}</span>`).join('')}
        </div>
      </div>`;
  }

  function objetivosValidos() {
    if (!seleccion) return [];
    return A.objetivosDe(st, u$(seleccion.uid), seleccion.hab);
  }

  // ---- flechas de la cola: de cada animal a su objetivo ----
  function pintarFlechas() {
    const R = esc.getBoundingClientRect();
    elFlechas.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
    const centro = (uid) => {
      const el = root.querySelector('#ar-c-' + uid);
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.left - R.left + b.width / 2, y: b.top - R.top + b.height / 2 };
    };
    let d = '';
    for (const acc of cola) {
      const p1 = centro(acc.uid), p2 = centro(acc.objetivo);
      if (!p1 || !p2) continue;
      if (acc.uid === acc.objetivo) continue;          // se la aplicó a sí mismo
      const my = (p1.y + p2.y) / 2;                    // curva suave en S
      const aliada = acc.objetivo.startsWith(yo());
      d += `<path class="${aliada ? 'ali' : ''}"
              d="M${p1.x},${p1.y} C${p1.x},${my} ${p2.x},${my} ${p2.x},${p2.y}"/>
            <circle class="${aliada ? 'ali' : ''}" cx="${p2.x}" cy="${p2.y}" r="5"/>`;
    }
    elFlechas.innerHTML = d;
  }

  // ---------------- interacción ----------------
  function conectar() {
    root.querySelectorAll('.ar-u:not(.riv)').forEach(el => el.onclick = () => {
      const uid = el.dataset.uid, u = u$(uid);
      if (seleccion && seleccion.aliado) {            // estoy eligiendo aliado
        if (!u.viva) return;
        encolar(seleccion.uid, seleccion.hab, uid);
        return;
      }
      if (seleccion) return;                          // eligiendo enemigo: no cambio de animal
      if (!u.viva) return;
      activo = uid; render();
    });
    root.querySelectorAll('.ar-u.riv').forEach(el => el.onclick = () => {
      if (!seleccion || seleccion.aliado) return;
      const uid = el.dataset.uid;
      if (!objetivosValidos().includes(uid)) return;
      encolar(seleccion.uid, seleccion.hab, uid);
    });
    // pasar el mouse por encima YA muestra qué hace (sin tener que tocarla ni
    // encolarla). Al salir vuelve a lo que estabas mirando, así el panel no
    // parpadea. Solo repinta la tarjeta, no toda la pantalla.
    let infoFijada = verInfo;
    root.querySelectorAll('.ar-h').forEach(el => {
      el.onmouseenter = () => {
        if (st.lado !== yo() || st.fin || animando) return;
        const u = u$(el.dataset.uid);
        elInfo.innerHTML = infoHTML({ u, h: u.habs[+el.dataset.hab] });
        engancharCerrar();
      };
      el.onmouseleave = () => {
        elInfo.innerHTML = infoHTML(infoFijada);
        engancharCerrar();
      };
    });
    root.querySelectorAll('.ar-h').forEach(el => el.onclick = (ev) => {
      ev.stopPropagation();
      if (st.lado !== yo() || st.fin || animando) return;
      const uid = el.dataset.uid, hab = +el.dataset.hab;
      const u = u$(uid), h = u.habs[hab];
      verInfo = { u, h };
      activo = uid;
      const acc = enCola(uid);
      if (acc && acc.hab === hab) {                   // ya estaba en la cola: sacarla
        cola = cola.filter(a => a !== acc); seleccion = null; return render();
      }
      if (acc || el.classList.contains('off')) return render();
      const efs = h.efectos || [];
      if (efs.some(f => f.obj === 'enemigo')) seleccion = { uid, hab };
      else if (efs.some(f => f.obj === 'aliado')) seleccion = { uid, hab, aliado: true };
      else return encolar(uid, hab, uid);             // a sí mismo / al equipo / a todos
      render();
    });
    // cambio de energía 5→1
    const bc = root.querySelector('#arCambio');
    if (bc) bc.onclick = () => {
      if (bc.classList.contains('off')) return;
      cambioAbierto = !cambioAbierto;
      render();
    };
    root.querySelectorAll('.ar-pick').forEach(el => el.onclick = () => {
      if (A.cambiarEnergia(st, yo(), el.dataset.bioma)) { cambioAbierto = false; render(); }
    });

    engancharCerrar();
  }

  function engancharCerrar() {
    const c = root.querySelector('#arCerrar');
    if (c) c.onclick = () => { verInfo = null; render(); };
  }

  function encolar(uid, hab, objetivo) {
    cola.push({ uid, hab, objetivo });
    seleccion = null;
    render();
  }

  $('arListo').onclick = () => jugarTurnoMio();
  $('arAuto').onclick = () => {
    auto = !auto;
    if (auto && st.lado === yo() && !st.fin && !animando) jugarTurnoMio(true); else render();
  };
  $('arHuir').onclick = () => terminar(false, true);

  // ---------------- turnos ----------------
  async function jugarTurnoMio(forzarAuto = false) {
    if (st.lado !== yo() || st.fin || cerrando || animando) return;
    pararTimer();
    const q = (auto || forzarAuto) ? A.colaAuto(st, yo()) : cola;
    if (!q.length && !auto && !forzarAuto) { /* pasar el turno vacío está permitido */ }
    let r = A.ejecutarTurno(st, q);
    if (!r.ok) r = A.ejecutarTurno(st, []);
    cola = []; seleccion = null;
    await animarTurno(r.eventos || []);
    render();
    despuesDelTurno();
  }

  async function turnoRival() {
    if (st.fin || cerrando) return;
    await espera(500);
    const r = A.ejecutarTurno(st, A.colaAuto(st, 'B'));
    await animarTurno(r.eventos || []);
    render();
    despuesDelTurno();
  }

  function despuesDelTurno() {
    if (st.fin) return terminar(st.fin === 'A', false);
    if (PVP) return pasarElAparato();      // hotseat: le toca al otro humano
    if (st.lado === 'B') return turnoRival();
    if (auto) return jugarTurnoMio(true);
    arrancarTimer();
  }

  // ---------------- hotseat: cortina entre jugadores ----------------
  // Sin esto el que espera ve la jugada del otro y el juego pierde la gracia.
  function pasarElAparato() {
    pararTimer();
    tapado = true;
    cola = []; seleccion = null; verInfo = null; activo = null;
    render();
    const cortina = document.createElement('div');
    cortina.className = 'ar-cortina';
    cortina.innerHTML = `<div class="ar-cortbox">
      <div class="ar-cortt">Pasale el aparato a</div>
      <div class="ar-cortn">${nombreDe(st.lado)}</div>
      <div class="ar-cortd">Que el otro no vea tu jugada.</div>
      <button class="ar-listo" id="arListoYa">Estoy listo</button>
    </div>`;
    esc.appendChild(cortina);
    cortina.querySelector('#arListoYa').onclick = () => {
      cortina.remove();
      tapado = false;
      render();
      arrancarTimer();
    };
  }

  // ---------------- resolución animada ----------------
  // El motor ya jugó el turno; acá se RE-CUENTA lo que pasó siguiendo su log
  // de eventos, en orden: el atacante SE LANZA hacia el rival con su flecha,
  // cada golpe sacude y destella al que lo recibe, un bloqueo se ve como
  // ESQUIVE (paso al costado + "¡esquivada!"), las curas suben en verde, las
  // toxinas gotean en violeta y el que cae se desploma.
  const espera = (ms) => new Promise(r => setTimeout(r, ms));

  async function animarTurno(eventos) {
    const VISIBLES = ['usa', 'golpe', 'bloqueado', 'cura', 'toxina', 'contra', 'agotamiento', 'cae'];
    const pasos = (eventos || []).filter(e => VISIBLES.includes(e.t));
    if (!pasos.length) return;
    animando = true;
    render();                                       // apaga botones mientras tanto
    const cartel = document.createElement('div');
    cartel.className = 'ar-cartel';
    cartel.style.display = 'none';
    esc.appendChild(cartel);

    for (const ev of pasos) {
      switch (ev.t) {
        case 'usa': {
          const u = u$(ev.uid);
          cartel.style.display = '';
          cartel.textContent = `${u.n} · ${ev.hab}`;
          if (ev.objetivo && ev.objetivo !== ev.uid) {
            cola = [{ uid: ev.uid, hab: 0, objetivo: ev.objetivo }];  // solo la flecha
            pintarFlechas();
          }
          clase(ev.uid, 'ar-lanza', 420);           // el atacante se lanza
          await espera(400);
          cola = []; pintarFlechas();
          break;
        }
        case 'golpe':
          if (ev.v > 0) {
            clase(ev.uid, 'ar-pega', 420);          // sacudida + destello
            flotante(ev.uid, '-' + ev.v, ev.toxina ? 'tox' : '');
          } else {
            flotante(ev.uid, '🛡 absorbido', 'gris'); // la defensa se lo comió
          }
          await espera(330);
          break;
        case 'bloqueado':                           // ¡el esquive que faltaba!
          clase(ev.uid, 'ar-esquiva', 450);
          flotante(ev.uid, '¡esquivada!', 'esq');
          await espera(400);
          break;
        case 'cura':
          flotante(ev.uid, '+' + ev.v, 'bien');
          await espera(240);
          break;
        case 'toxina':
          clase(ev.uid, 'ar-pega', 300);
          flotante(ev.uid, '-' + ev.v, 'tox');
          await espera(260);
          break;
        case 'contra':
          flotante(ev.uid, '-' + ev.v + ' 🌵');
          await espera(260);
          break;
        case 'agotamiento':
          flotante(ev.uid, '-' + ev.v, 'gris');
          await espera(160);
          break;
        case 'cae':
          clase(ev.uid, 'ar-ko', 600);
          await espera(480);
          break;
      }
    }
    await espera(320);
    cartel.remove();
    animando = false;
  }

  // ponerle una clase de animación a una tarjeta un ratito
  function clase(uid, cls, ms) {
    const el = root.querySelector('#ar-c-' + uid);
    if (!el) return;
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), ms);
  }

  function flotante(uid, txt, tipo = '') {
    const el = root.querySelector('#ar-c-' + uid);
    if (!el) return;
    const R = esc.getBoundingClientRect(), b = el.getBoundingClientRect();
    const g = document.createElement('div');
    g.className = 'ar-golpe' + (tipo ? ' ' + tipo : '');
    g.textContent = txt;
    // corrimiento al azar para que dos números seguidos no se tapen
    g.style.left = (b.left - R.left + b.width / 2 + (Math.random() * 26 - 13)) + 'px';
    g.style.top = (b.top - R.top + b.height * 0.42) + 'px';
    esc.appendChild(g);
    setTimeout(() => g.remove(), 1000);
  }

  // ---------------- reloj de turno ----------------
  function arrancarTimer() {
    pararTimer();
    timerFin = Date.now() + TURNO_SEG * 1000;
    timerId = setInterval(() => {
      pintarTimer();
      if (Date.now() >= timerFin) {
        pararTimer();
        cola = []; seleccion = null;
        A.ejecutarTurno(st, []);                      // se te fue el tiempo: pasás
        render(); despuesDelTurno();
      }
    }, 250);
    pintarTimer();
  }
  function pararTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function pintarTimer() {
    const anillo = $('arAnillo'), segs = $('arSegs');
    if (!anillo) return;
    const queda = timerId ? Math.max(0, (timerFin - Date.now()) / 1000) : TURNO_SEG;
    const f = queda / TURNO_SEG;
    const L = 2 * Math.PI * 21;
    anillo.style.strokeDasharray = L;
    anillo.style.strokeDashoffset = (L * (1 - f)).toFixed(1);
    anillo.classList.toggle('poco', queda <= 10);
    segs.textContent = timerId ? Math.ceil(queda) : '–';
  }

  // ---------------- cierre ----------------
  function terminar(gane, rendicion) {
    if (cerrando) return;
    cerrando = true;
    pararTimer();
    const caidos = mios().filter(u => !u.viva && u.ref != null).map(u => u.ref);
    const fin = document.createElement('div');
    fin.className = 'ar-fin ' + (gane ? 'win' : 'lose');
    fin.innerHTML = `<div class="ar-finbox">
      <div class="ar-fint" style="display:flex;align-items:center;justify-content:center;gap:9px">${gane ? `${icoSVG('trofeo', 22)} ¡Victoria!` : rendicion ? `${icoSVG('bandera', 22)} Te retiraste` : `${icoSVG('calavera', 22)} Derrota`}</div>
      <button class="ar-listo">Continuar</button></div>`;
    esc.appendChild(fin);
    fin.querySelector('button').onclick = () => {
      root.remove();
      document.body.classList.remove('ar-lock');
      opts.onFin(gane, caidos, st);
    };
  }

  const alRedimensionar = () => pintarFlechas();
  window.addEventListener('resize', alRedimensionar);

  // ---------------- arranque ----------------
  render();
  if (PVP) { if (st.lado !== 'A') pasarElAparato(); else arrancarTimer(); }
  else if (st.lado === 'B') turnoRival();
  else arrancarTimer();
  return st;   // (los tests / la consola pueden inspeccionarlo)
}
