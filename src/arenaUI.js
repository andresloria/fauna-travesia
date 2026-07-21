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

  let cola = [];               // [{uid, hab, objetivo}]
  let seleccion = null;        // {uid, hab, aliado?} esperando objetivo
  let activo = null;           // qué animal mío se está mirando (celular)
  let verInfo = null;          // {u, h} de la habilidad que muestra la tarjeta
  let auto = false;
  let timerId = null, timerFin = 0;
  let cerrando = false, animando = false;

  const u$ = (uid) => st.unidades.find(x => x.uid === uid);
  const mios = () => st.unidades.filter(u => u.lado === 'A');
  const rivales = () => st.unidades.filter(u => u.lado === 'B');
  const enCola = (uid) => cola.find(a => a.uid === uid);

  // energía que queda después de pagar lo que ya está en la cola
  const poolRestante = () => {
    const p = { ...st.energia.A };
    for (const acc of cola) A.pagar(p, u$(acc.uid).habs[acc.hab].costo || []);
    return p;
  };

  // ---------------- armado del DOM (una sola vez) ----------------
  root.innerHTML = `
    <div class="ar-esc" id="arEsc">
      <div class="ar-fondo" style="background-image:url('${opts.fondo}')"></div>

      <header class="ar-top">
        <div class="ar-lado">
          <img src="${opts.guiaArt}" alt="">
          <div><b>Vos</b><span>${opts.guiaSub || 'Guía de naturaleza'}</span></div>
        </div>
        <div class="ar-reloj">
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle class="pista" cx="24" cy="24" r="21"></circle>
            <circle class="barra" cx="24" cy="24" r="21" id="arAnillo"></circle>
          </svg>
          <b id="arSegs">–</b>
        </div>
        <div class="ar-lado der">
          ${opts.rivalArt ? `<img src="${opts.rivalArt}" alt="">` : '<div class="ar-sinart">🪤</div>'}
          <div><b>${opts.titulo || 'Cazadores'}</b><span>${opts.sub || ''}</span></div>
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
          <button class="ar-chico" id="arAuto">🤖 Auto</button>
          <button class="ar-chico mal" id="arHuir">🏳 Rendirse</button>
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

    const listo = $('arListo');
    const miTurno = st.lado === 'A' && !st.fin && !animando;
    listo.disabled = !miTurno;
    listo.textContent = st.fin ? '—' : miTurno ? '▶ LISTO' : 'Turno del rival…';
    $('arAuto').classList.toggle('on', auto);

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
    const out = [];
    if (u.defensa > 0) out.push(`<i title="Defensa ${u.defensa}">🛡${u.defensa}</i>`);
    for (const f of u.efectos) {
      if (f.t === 'dot') out.push(`<i class="mal" title="Toxina ${f.v} por turno">☣${f.turnos}</i>`);
      if (f.t === 'hot') out.push(`<i title="Curándose">💚${f.turnos}</i>`);
      if (f.t === 'invulnerable') out.push('<i title="Invulnerable">✨</i>');
      if (f.t === 'aturdir') out.push('<i class="mal" title="Aturdida">💫</i>');
      if (f.t === 'exponer') out.push('<i class="mal" title="Expuesta">🎯</i>');
      if (f.t === 'reducir') out.push(`<i title="Recibe ${f.v} menos">🛡·</i>`);
      if (f.t === 'contra') out.push('<i title="Contraataca">🌵</i>');
      if (f.t === 'modo') out.push(`<i title="Modo activo">🔆${f.turnos}</i>`);
      if (f.t === 'marca') out.push(`<i class="mal" title="Marcada +${f.v}">🩸</i>`);
      if (f.t === 'amp') out.push(`<i title="Amplificado +${f.v}">⬆</i>`);
    }
    return out.join('');
  }

  // ---- energía: columna al costado, con el icono de cada bioma ----
  function pintarEnergia() {
    const pool = poolRestante(), total = A.totalE(pool);
    elEnergia.innerHTML = A.BIOMAS.map(b => `
      <div class="ar-e ${pool[b] ? '' : 'cero'}" title="${BIOMA_N[b]}">
        <img src="${BIOMA_ICO(b)}" alt="${BIOMA_N[b]}" draggable="false">
        <b>${pool[b]}</b>
      </div>`).join('') + `<div class="ar-etot" title="Energía total">${total}</div>`;
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
    if (st.lado !== 'A' || st.fin || !u.viva || animando) off = 'off';
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
      <div class="ar-ico vacio">👆</div>
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
      const aliada = acc.objetivo.startsWith('A');
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
        if (st.lado !== 'A' || st.fin || animando) return;
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
      if (st.lado !== 'A' || st.fin || animando) return;
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
    if (auto && st.lado === 'A' && !st.fin && !animando) jugarTurnoMio(true); else render();
  };
  $('arHuir').onclick = () => terminar(false, true);

  // ---------------- turnos ----------------
  async function jugarTurnoMio(forzarAuto = false) {
    if (st.lado !== 'A' || st.fin || cerrando || animando) return;
    pararTimer();
    const q = (auto || forzarAuto) ? A.colaAuto(st, 'A') : cola;
    if (!q.length && !auto && !forzarAuto) { /* pasar el turno vacío está permitido */ }
    const antes = instantanea();
    const r = A.ejecutarTurno(st, q);
    if (!r.ok) A.ejecutarTurno(st, []);
    const jugadas = r.ok ? q.slice() : [];
    cola = []; seleccion = null;
    await animarTurno(jugadas, antes);
    render();
    despuesDelTurno();
  }

  async function turnoRival() {
    if (st.fin || cerrando) return;
    await espera(500);
    const q = A.colaAuto(st, 'B');
    const antes = instantanea();
    A.ejecutarTurno(st, q);
    await animarTurno(q, antes);
    render();
    despuesDelTurno();
  }

  function despuesDelTurno() {
    if (st.fin) return terminar(st.fin === 'A', false);
    if (st.lado === 'B') return turnoRival();
    if (auto) return jugarTurnoMio(true);
    arrancarTimer();
  }

  // ---------------- resolución animada ----------------
  // Se juega el turno en el motor y DESPUÉS se muestra qué pasó, jugada por
  // jugada: cartel de quién ataca, su flecha sola, y el daño flotante.
  const espera = (ms) => new Promise(r => setTimeout(r, ms));
  const instantanea = () => Object.fromEntries(st.unidades.map(u => [u.uid, u.hp]));

  async function animarTurno(jugadas, antes) {
    if (!jugadas.length) return;
    animando = true;
    const cartel = document.createElement('div');
    cartel.className = 'ar-cartel';
    esc.appendChild(cartel);
    for (const acc of jugadas) {
      const u = u$(acc.uid);
      const h = u.habs[acc.hab];
      cartel.textContent = `${u.n} · ${h.n}`;
      cola = [acc];                                   // solo la flecha de esta jugada
      render();
      await espera(430);
      cola = [];
      await espera(320);
    }
    // el daño total de la ronda, en cada unidad que lo recibió
    for (const u of st.unidades) {
      const dif = antes[u.uid] - u.hp;
      if (dif > 0) flotante(u.uid, '-' + dif);
      else if (dif < 0) flotante(u.uid, '+' + (-dif), true);
    }
    await espera(750);
    cartel.remove();
    animando = false;
  }

  function flotante(uid, txt, bueno = false) {
    const el = root.querySelector('#ar-c-' + uid);
    if (!el) return;
    const R = esc.getBoundingClientRect(), b = el.getBoundingClientRect();
    const g = document.createElement('div');
    g.className = 'ar-golpe' + (bueno ? ' bien' : '');
    g.textContent = txt;
    g.style.left = (b.left - R.left + b.width / 2) + 'px';
    g.style.top = (b.top - R.top + b.height * 0.42) + 'px';
    esc.appendChild(g);
    el.classList.add('ar-tiembla');
    setTimeout(() => el.classList.remove('ar-tiembla'), 400);
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
      <div class="ar-fint">${gane ? '🏆 ¡Victoria!' : rendicion ? '🏳 Te retiraste' : '💀 Derrota'}</div>
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
  if (st.lado === 'B') turnoRival(); else arrancarTimer();
  return st;   // (los tests / la consola pueden inspeccionarlo)
}
