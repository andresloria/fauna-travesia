// ============================================================
// travesiaUI.js — pantalla del prototipo TRAVESÍA (estilo Pokémon Duel).
//
// Vive en su propia página (travesia.html): NO toca la arena ni el juego vivo.
// Habla solo con el motor puro (tablero.js / rueda.js).
//
// Dos decisiones de diseño, aprobadas con mockup:
//   · La RUEDA del animal elegido está SIEMPRE a la vista. Esa es la sal de
//     Duel: antes de meterte a pelear ves tus probabilidades.
//   · El duelo muestra las DOS ruedas girando y dónde cayó cada aguja, para
//     que se entienda POR QUÉ ganaste. Se anima leyendo el LOG del motor
//     (misma lección que la arena: la cola del jugador no sabe de todo).
// ============================================================

import { SP } from '../fauna_roster.js';
import * as T from './tablero.js';
import { ruedaDe, descripcionGajo, probabilidades } from './rueda.js';
import * as AV from './aventura.js';

const ART = (key) => (SP[key] && SP[key].folk)
  ? `assets/folclor/${key}.png` : `assets/animales/${key}.png`;

const COLOR = {
  blanco: '#eaf0f7', dorado: '#ffc861', morado: '#c3a8e8',
  azul: '#7fc8f5', rojo: '#ff5b5b',
};
const NOMBRE_COLOR = {
  blanco: 'daño', dorado: 'prioridad', morado: 'estado',
  azul: 'esquiva', rojo: 'fallo',
};
const BIOMA_N = { bosque: 'Bosque', sabana: 'Sabana', agua: 'Agua', montana: 'Montaña' };
// estados traídos de Duel: no quitan vida (no hay vida), EMPEORAN LA RUEDA
const ESTADO_ICO = { paralizado: '⚡', quemado: '🔥', lento: '🐌' };
const ESTADO_TXT = {
  paralizado: 'Paralizado: su gajo más chico es Fallo',
  quemado: 'Quemado: −10 de daño y su gajo más chico es Fallo',
  lento: 'Lento: se mueve un paso menos',
};

// geometría del tablero en píxeles
// el tablero Duel son 7 posiciones de ancho por 5 de alto
const SX = 50, SY = 62, MX = 26, MY = 24;
const esc = (txt) => String(txt).replace(/[&<>"]/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const espera = (ms) => new Promise(r => setTimeout(r, ms));

// ---------- la rueda dibujada ----------
// Devuelve el SVG de una rueda. Si se pasa `resaltar`, la rueda se gira para
// que ese gajo quede arriba, bajo la aguja fija.
function donut(gajos, size, resaltar = -1, clase = '') {
  const c = size / 2, r = size * 0.34, grosor = size * 0.22;
  const C = 2 * Math.PI * r;
  const total = gajos.reduce((s, g) => s + g.peso, 0) || 1;
  let cum = 0, giro = 0, aros = '';
  gajos.forEach((g, i) => {
    const len = g.peso / total * C;
    aros += `<circle cx="${c}" cy="${c}" r="${r.toFixed(2)}" fill="none"
      stroke="${COLOR[g.color] || '#888'}" stroke-width="${grosor.toFixed(2)}"
      stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}"
      stroke-dashoffset="${(-cum).toFixed(2)}"></circle>`;
    if (i === resaltar) giro = -((cum + len / 2) / C * 360);
    cum += len;
  });
  const aguja = resaltar >= 0
    ? `<path class="tv-aguja gana" d="M${c} ${c - r - grosor / 2 - 9} l-6 11 h12 z"></path>` : '';
  return `<svg viewBox="0 0 ${size} ${size}" class="${clase}">
    <g transform="rotate(${(-90 + giro).toFixed(2)} ${c} ${c})">${aros}</g>${aguja}</svg>`;
}

const leyenda = (gajos) => {
  const total = gajos.reduce((s, g) => s + g.peso, 0) || 1;
  return gajos.map(g => `<span class="tv-g" title="${esc(g.n)} · ${NOMBRE_COLOR[g.color]}">
      <i style="background:${COLOR[g.color]}"></i>${Math.round(g.peso / total * 100)}%</span>`).join('');
};

// ============================================================
export function montarTravesia(root) {
  let st = null, sel = null, selBanca = null, animando = false;

  const claves = Object.keys(SP);
  const azar = (n) => {
    const pool = [...claves], out = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    return out;
  };
  let miEquipo = azar(6), suEquipo = azar(6);
  let prog = AV.cargar();
  let peleaAct = null;        // la pelea de aventura en curso (null = suelta)

  // ---------------- menú ----------------
  function menu() {
    const prov = AV.provinciaActual(prog);
    root.innerHTML = `
      <div class="tv-top"><span class="tv-turno">TRAVESÍA</span>
        <span class="tv-nro">prototipo</span></div>
      <div class="tv-info" style="min-height:0;flex-direction:column;align-items:stretch">
        <div class="tv-itx">
          <h2>Llegá al refugio del rival</h2>
          <p>Una acción por turno. Las piezas <b>bloquean</b>. Si quedás pegado a un
          enemigo podés pelearlo: giran las dos ruedas y el color decide.</p>
        </div>
      </div>
      <button class="tv-btn go" id="tvAv" style="min-height:58px">
        🌿 AVENTURA · ${esc(prov.flag || '')} ${esc(prov.n)} ${prog.ganoJuego ? '' : `· ${prog.wins}/${AV.PELEAS_PARA_JEFE}`}
      </button>
      <div class="tv-acts">
        <button class="tv-btn" id="tvSuelta" style="flex:1;justify-content:center">⚔ Partida suelta</button>
      </div>
      <div class="tv-bl">Tu refugio · ${prog.desbloqueados.length} animales</div>`;
    root.querySelector('#tvAv').onclick = () => aventura();
    root.querySelector('#tvSuelta').onclick = () => inicio();
  }

  // ---------------- aventura ----------------
  function aventura() {
    const prov = AV.provinciaActual(prog);
    const jefe = AV.tocaJefe(prog);
    const listo = AV.equipoListo(prog);
    root.innerHTML = `
      <div class="tv-top">
        <span class="tv-turno">${esc(prov.flag || '')} ${esc(prov.n)}</span>
        <span class="tv-nro">${prog.record.w}V · ${prog.record.l}D</span>
      </div>
      <div class="tv-info" style="min-height:0;flex-direction:column;align-items:stretch">
        <div class="tv-itx">
          <h2>${jefe ? '🚨 Te espera el cabecilla' : 'Cazadores de ' + esc(prov.n)}</h2>
          <p>${jefe
            ? 'Vencelo y liberás la provincia.'
            : `Ganá <b>${AV.PELEAS_PARA_JEFE - prog.wins}</b> pelea(s) más para que aparezca el cabecilla.`}
          Cada victoria suma un animal a tu refugio.</p>
        </div>
      </div>
      <div class="tv-bl">Tu equipo · ${prog.equipo.length}/${AV.EQUIPO} · tocá para cambiar</div>
      <div class="tv-banca" id="tvEq"></div>
      <div class="tv-acts">
        <button class="tv-btn" id="tvVolver">← Menú</button>
        <button class="tv-btn" id="tvElegir">Elegir equipo</button>
        <button class="tv-btn go" id="tvPelear" ${listo ? '' : 'disabled'}>▶ PELEAR</button>
      </div>`;
    root.querySelector('#tvEq').innerHTML = prog.equipo.length
      ? prog.equipo.map(k => `<div class="tv-b lista" data-ficha="${k}" title="${esc(SP[k].n)}">
           <img src="${ART(k)}" alt="${esc(SP[k].n)}"></div>`).join('')
      : '<span style="font-size:12px;color:var(--tx2)">Elegí 6 animales</span>';
    root.querySelectorAll('[data-ficha]').forEach(el =>
      el.onclick = () => abrirFicha(el.dataset.ficha));
    root.querySelector('#tvVolver').onclick = () => menu();
    root.querySelector('#tvElegir').onclick = () => elegirEquipo();
    root.querySelector('#tvPelear').onclick = () => {
      peleaAct = AV.proximaPelea(prog);
      miEquipo = prog.equipo.slice();
      suEquipo = peleaAct.rivales;
      arrancar();
    };
  }

  // selector de equipo: toda la colección, se tocan 6
  function elegirEquipo() {
    const pinta = () => {
      root.innerHTML = `
        <div class="tv-top"><span class="tv-turno">Tu equipo</span>
          <span class="tv-nro">${prog.equipo.length}/${AV.EQUIPO}</span></div>
        <div class="tv-bl">Elegidos</div>
        <div class="tv-banca" id="tvSel"></div>
        <div class="tv-bl">Refugio · ${prog.desbloqueados.length} animales</div>
        <div class="tv-grid" id="tvTodos"></div>
        <div class="tv-acts">
          <button class="tv-btn" id="tvAtras">← Volver</button>
          <button class="tv-btn go" id="tvOk" ${AV.equipoListo(prog) ? '' : 'disabled'}>Listo</button>
        </div>`;
      root.querySelector('#tvSel').innerHTML = prog.equipo.map(k =>
        `<div class="tv-b sel" data-quitar="${k}" title="${esc(SP[k].n)}">
           <img src="${ART(k)}" alt=""></div>`).join('')
        || '<span style="font-size:12px;color:var(--tx2)">Tocá animales de abajo</span>';
      root.querySelector('#tvTodos').innerHTML = prog.desbloqueados.map(k => {
        const dentro = prog.equipo.includes(k);
        return `<button class="tv-t ${dentro ? 'dentro' : ''}" data-add="${k}" title="${esc(SP[k].n)}">
          <img src="${ART(k)}" alt=""><span>${esc(SP[k].n)}</span></button>`;
      }).join('');
      root.querySelectorAll('[data-quitar]').forEach(el => el.onclick = () => {
        prog.equipo = prog.equipo.filter(k => k !== el.dataset.quitar); AV.guardar(prog); pinta();
      });
      root.querySelectorAll('[data-add]').forEach(el => el.onclick = () => {
        const k = el.dataset.add;
        if (prog.equipo.includes(k)) prog.equipo = prog.equipo.filter(x => x !== k);
        else if (prog.equipo.length < AV.EQUIPO) prog.equipo.push(k);
        AV.guardar(prog); pinta();
      });
      root.querySelector('#tvAtras').onclick = () => aventura();
      root.querySelector('#tvOk').onclick = () => aventura();
    };
    pinta();
  }

  // ---------------- partida suelta ----------------
  function inicio() {
    root.innerHTML = `
      <div class="tv-top"><span class="tv-turno">TRAVESÍA · prototipo</span>
        <span class="tv-nro">6 contra 6</span></div>
      <div class="tv-info" style="min-height:0;flex-direction:column;align-items:stretch">
        <div class="tv-itx">
          <h2>Llegá al refugio del rival</h2>
          <p>Una acción por turno. Las piezas <b>bloquean</b>: no se pasa por encima.
          Si quedás pegado a un enemigo podés pelearlo — giran las dos ruedas y
          el color decide. El que pierde por daño vuelve a la banca.</p>
        </div>
      </div>
      <div class="tv-banca" id="tvPrev"></div>
      <div class="tv-acts">
        <button class="tv-btn" id="tvMenu">←</button>
        <button class="tv-btn" id="tvOtro">🎲 Otro</button>
        <button class="tv-btn go" id="tvYa">▶ JUGAR</button>
      </div>`;
    root.querySelector('#tvPrev').innerHTML = miEquipo.map(k =>
      `<div class="tv-b lista" data-ficha="${k}" title="${esc(SP[k].n)}">
         <img src="${ART(k)}" alt="${esc(SP[k].n)}"></div>`).join('');
    root.querySelectorAll('[data-ficha]').forEach(el =>
      el.onclick = () => abrirFicha(el.dataset.ficha));
    root.querySelector('#tvMenu').onclick = () => { peleaAct = null; menu(); };
    root.querySelector('#tvOtro').onclick = () => { peleaAct = null; miEquipo = azar(6); suEquipo = azar(6); inicio(); };
    root.querySelector('#tvYa').onclick = () => { peleaAct = null; arrancar(); };
  }

  function arrancar() {
    st = T.mkPartida(miEquipo, suEquipo, { abre: 'A' });
    sel = null;
    // Al empezar NADIE está en el tablero: las 6 piezas arrancan en la banca.
    // Se deja uno ya elegido para que las ENTRADAS aparezcan marcadas de una y
    // se vea sin leer nada cuál es la primera jugada. (Sin esto el jugador
    // abría el juego y no encontraba cómo meter un animal.)
    selBanca = st.piezas.find(p => p.lado === 'A')?.uid || null;
    pintar();
    if (st.lado === 'B') turnoIA();
  }

  // ---------------- helpers de estado ----------------
  const mio = (uid) => uid && uid[0] === 'A';
  const nodoPx = (n) => ({ x: MX + n.x * SX, y: MY + n.y * SY });

  // ¿a qué enemigos puedo pelear con la pieza elegida, y con qué acción?
  function opcionesAtaque(uid) {
    const map = new Map();
    const p = T.pieza(st, uid);
    if (!p || p.estado !== 'tablero') return map;
    for (const o of T.enemigosAdyacentes(st, p)) {
      map.set(o.uid, { tipo: 'atacar', uid, objetivo: o.uid });
    }
    for (const destino of T.alcanzables(st, uid)) {
      for (const n of T.vecinos(st, destino)) {
        const o = T.ocupante(st, n);
        if (!o || o.lado === p.lado || map.has(o.uid)) continue;
        map.set(o.uid, { tipo: 'mover', uid, hasta: destino, atacar: o.uid });
      }
    }
    return map;
  }

  // ---------------- pintado ----------------
  function pintar() {
    const t = st.tablero;
    // Las medidas salen de los NODOS REALES, no de filas/cols: así sirve para
    // cualquier tablero. (Con la fórmula vieja, hecha para la rejilla, el
    // tablero de Duel quedaba con la columna derecha cortada por el borde.)
    const todos = Object.values(t.nodos);
    const maxX = todos.reduce((m, n) => Math.max(m, n.x), 0);
    const maxY = todos.reduce((m, n) => Math.max(m, n.y), 0);
    const W = MX * 2 + maxX * SX;
    const H = MY * 2 + maxY * SY;
    const miTurno = st.lado === 'A' && !st.fin && !animando;

    const irA = sel ? T.alcanzables(st, sel) : [];
    const entradasOk = selBanca ? t.entradas.A.filter(e => !T.ocupante(st, e)) : [];
    const ataques = sel ? opcionesAtaque(sel) : new Map();

    // aristas (una sola vez por par)
    const hechas = new Set();
    let aristas = '';
    for (const n of Object.values(t.nodos)) {
      for (const v of n.vecinos) {
        const k = [n.id, v].sort().join('|');
        if (hechas.has(k)) continue;
        hechas.add(k);
        const a = nodoPx(n), b = nodoPx(t.nodos[v]);
        aristas += `<line class="tv-arista" x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"></line>`;
      }
    }

    let nodos = '', marcas = '';
    for (const n of Object.values(t.nodos)) {
      const p = nodoPx(n);
      const cls = n.tipo === 'meta' ? 'meta' : n.tipo === 'entrada' ? 'entrada' : (n.bio || '');
      const rr = n.tipo === 'meta' ? 13 : 9;
      nodos += `<circle class="tv-nodo ${cls}" cx="${p.x}" cy="${p.y}" r="${rr}"></circle>`;
      if (n.id === 'metaB') nodos += `<text x="${p.x}" y="${p.y + 4}" text-anchor="middle"
        font-size="12" fill="#ffc861" pointer-events="none">★</text>`;
      if (n.id === 'metaA') nodos += `<text x="${p.x}" y="${p.y + 4}" text-anchor="middle"
        font-size="11" fill="#7ef0a8" pointer-events="none">🌿</text>`;
      // marcá MIS entradas con el mismo ✦ que nombra el texto de ayuda
      if (t.entradas.A.includes(n.id)) nodos += `<text x="${p.x}" y="${p.y + 3.5}"
        text-anchor="middle" font-size="10" fill="#ffc861" pointer-events="none">✦</text>`;
      const destino = irA.includes(n.id) || entradasOk.includes(n.id);
      if (destino && miTurno) {
        marcas += `<circle class="tv-ir" data-ir="${n.id}" cx="${p.x}" cy="${p.y}" r="15"></circle>`;
      }
    }

    let piezas = '';
    for (const p of st.piezas) {
      if (p.estado !== 'tablero') continue;
      const q = nodoPx(t.nodos[p.nodo]);
      const esMio = p.lado === 'A';
      const cls = [esMio ? '' : 'riv', sel === p.uid ? 'sel' : '', ataques.has(p.uid) ? 'obj' : '']
        .filter(Boolean).join(' ');
      piezas += `<g class="tv-pieza ${cls}" data-uid="${p.uid}">
        <circle cx="${q.x}" cy="${q.y}" r="21" fill="none" pointer-events="all"></circle>
        <circle class="tv-aro" cx="${q.x}" cy="${q.y}" r="15"></circle>
        <image class="tv-sprite" href="${ART(p.key)}" x="${q.x - 13}" y="${q.y - 13}"
          width="26" height="26" preserveAspectRatio="xMidYMid meet"></image>
        <circle class="tv-mpbg" cx="${q.x + 12}" cy="${q.y - 12}" r="6.5"></circle>
        <text class="tv-mp" x="${q.x + 12}" y="${q.y - 9.5}" text-anchor="middle">${T.mpEfectivo(st, p)}</text>
        ${(p.estados || []).length ? `<circle class="tv-estbg" cx="${q.x - 12}" cy="${q.y + 12}" r="6.5"></circle>
          <text class="tv-est" x="${q.x - 12}" y="${q.y + 15}" text-anchor="middle">${
            ESTADO_ICO[p.estados[0].e] || '!'}</text>` : ''}
      </g>`;
    }

    const foco = sel ? T.pieza(st, sel) : (selBanca ? T.pieza(st, selBanca) : null);
    const banca = st.piezas.filter(p => p.lado === 'A' && p.estado === 'banca');

    root.innerHTML = `
      <div class="tv-top">
        <span class="tv-turno ${miTurno ? '' : 'rival'}">${st.fin ? 'Fin' : miTurno ? 'Te toca' : 'Juega el rival…'}</span>
        <span class="tv-nro">turno ${st.turno}</span>
      </div>
      <div class="tv-tablero">
        <svg class="tv-svg" viewBox="0 0 ${W} ${H}">${aristas}${nodos}${piezas}${marcas}</svg>
      </div>
      <div class="tv-info ${foco ? 'abre' : ''}" id="tvInfo">${fichaHTML(foco)}${
        foco ? '<span class="tv-mas">ⓘ</span>' : ''}</div>
      ${banca.length ? `<div class="tv-bl">Banca · tocá uno para meterlo</div>` : ''}
      <div class="tv-banca" id="tvBanca">${banca.map(bancaHTML).join('') || ''}</div>
      <div class="tv-acts">
        <button class="tv-btn" id="tvNuevo">↺ Otra partida</button>
        <button class="tv-btn go" id="tvPasar" ${miTurno ? '' : 'disabled'}>Pasar turno</button>
      </div>`;

    conectar();
  }

  function fichaHTML(p) {
    if (!p) {
      // el texto cambia según lo que de verdad se puede hacer ahora
      const hayMias = T.enTablero(st, 'A').length > 0;
      return `<div class="tv-itx"><h2>${hayMias ? 'Elegí un animal' : 'Meté tu primer animal'}</h2>
        <p>${hayMias
          ? 'Tocá uno tuyo en el tablero para ver a dónde llega y qué hay en su rueda.'
          : 'Tocá un animal de la <b>banca</b> (abajo) y después una <b style="color:#ffc861">entrada</b> ✦ de las esquinas de abajo del tablero.'}</p>
      </div>`;
    }
    const enBanca = p.estado === 'banca';
    const bio = p.estado === 'tablero' ? T.bioDe(st, p.nodo) : null;
    const enCasa = bio && bio === p.rueda.bio;
    return `${donut(p.rueda.gajos, 68, -1, 'tv-rueda')}
      <div class="tv-itx">
        <h2>${esc(SP[p.key]?.n || p.key)}</h2>
        <p>MP ${p.rueda.mp} · ${esc(BIOMA_N[p.rueda.bio] || p.rueda.bio || '—')}${
          enCasa ? ' · <b style="color:#7ef0a8">en su hábitat: falla menos</b>' : ''}</p>
        ${enBanca ? '<p style="color:#ffc861">↓ Tocá una <b>entrada</b> ✦ para meterlo al tablero</p>' : ''}
        ${(p.estados || []).map(x => `<p style="color:#ff9a9a">${ESTADO_ICO[x.e] || ''} ${esc(ESTADO_TXT[x.e] || x.e)}</p>`).join('')}
        <div class="tv-gajos">${leyenda(p.rueda.gajos)}</div>
      </div>`;
  }

  const bancaHTML = (p) => {
    const lista = p.vuelveEn <= st.turno;
    const faltan = Math.max(0, p.vuelveEn - st.turno);
    return `<div class="tv-b ${lista ? 'lista' : 'espera'} ${selBanca === p.uid ? 'sel' : ''}"
        data-banca="${p.uid}" title="${esc(SP[p.key]?.n || p.key)}">
      <img src="${ART(p.key)}" alt="${esc(SP[p.key]?.n || p.key)}">
      ${lista ? '' : `<b>${faltan}</b>`}</div>`;
  };

  // ---------------- ficha completa ----------------
  // Lo que el jugador necesita para decidir: cuánto se mueve y, sobre todo,
  // QUÉ hace cada gajo y con qué probabilidad. El texto se genera de lo que el
  // gajo hace EN TRAVESÍA (ver descripcionGajo): la descripción heredada de la
  // arena hablaría de vida y defensa, que acá no existen.
  const RAREZA = { comun: 'COMÚN', raro: 'RARO', ultrararo: 'ULTRA RARO',
                   legendario: 'LEGENDARIO', mitico: 'MÍTICO' };

  function abrirFicha(key) {
    const sp = SP[key] || {};
    const r = ruedaDe(key);
    const pr = probabilidades(r);
    const filas = r.gajos
      .map((g, i) => ({ g, pct: pr[i].pct }))
      .sort((a, b) => b.pct - a.pct)
      .map(({ g, pct }) => `<div class="tv-f" style="border-left-color:${COLOR[g.color]}">
          <div><b>${esc(g.n)}</b><span>${esc(descripcionGajo(g))}</span></div>
          <em>${Math.round(pct)}%</em>
        </div>`).join('');
    const ov = document.createElement('div');
    ov.className = 'tv-ov';
    ov.innerHTML = `<div class="tv-duelo tv-ficha">
      <div class="tv-fh">
        <img src="${ART(key)}" alt="">
        <div class="tv-fn">
          <h2>${esc(sp.n || key)}</h2>
          <div class="tv-chips">
            <span class="tv-chip rar">${RAREZA[sp.rarity] || (sp.rarity || '').toUpperCase()}</span>
            <span class="tv-chip bio">${esc(BIOMA_N[r.bio] || r.bio || '—')}</span>
          </div>
        </div>
        <div class="tv-mp2"><b>${r.mp}</b><span>MOVIM.</span></div>
      </div>
      ${donut(r.gajos, 128, -1, 'tv-fbig')}
      <div class="tv-flist">${filas}</div>
      <p class="tv-fpie">En nodos de ${esc(BIOMA_N[r.bio] || r.bio || 'su bioma')} falla la mitad</p>
      <button class="tv-btn go" style="width:100%;margin-top:12px">Cerrar</button>
    </div>`;
    document.body.appendChild(ov);
    const cerrar = () => ov.remove();
    ov.querySelector('button').onclick = cerrar;
    ov.onclick = (e) => { if (e.target === ov) cerrar(); };
  }

  // ---------------- interacción ----------------
  function conectar() {
    const miTurno = st.lado === 'A' && !st.fin && !animando;

    root.querySelectorAll('.tv-pieza').forEach(el => el.onclick = () => {
      if (!miTurno) return;
      const uid = el.dataset.uid;
      if (mio(uid)) { sel = sel === uid ? null : uid; selBanca = null; return pintar(); }
      const acc = sel ? opcionesAtaque(sel).get(uid) : null;   // enemigo: pelearlo
      if (acc) hacer(acc);
    });

    root.querySelectorAll('.tv-ir').forEach(el => el.onclick = () => {
      if (!miTurno) return;
      const nodo = el.dataset.ir;
      if (selBanca) return hacer({ tipo: 'entrar', uid: selBanca, hasta: nodo });
      if (sel) return hacer({ tipo: 'mover', uid: sel, hasta: nodo });
    });

    root.querySelectorAll('[data-banca]').forEach(el => el.onclick = () => {
      if (!miTurno) return;
      const uid = el.dataset.banca;
      const p = T.pieza(st, uid);
      if (p.vuelveEn > st.turno) return;                       // todavía se recupera
      selBanca = selBanca === uid ? null : uid; sel = null; pintar();
    });

    const info = root.querySelector('#tvInfo');
    const foco2 = sel ? T.pieza(st, sel) : (selBanca ? T.pieza(st, selBanca) : null);
    if (info && foco2) info.onclick = () => abrirFicha(foco2.key);

    const pasar = root.querySelector('#tvPasar');
    if (pasar) pasar.onclick = () => { if (miTurno) { T.pasarTurno(st); sel = selBanca = null; pintar(); turnoIA(); } };
    const nuevo = root.querySelector('#tvNuevo');
    if (nuevo) nuevo.onclick = () => { miEquipo = azar(6); suEquipo = azar(6); arrancar(); };
  }

  // ---------------- turnos ----------------
  async function hacer(accion) {
    const r = T.jugar(st, accion);
    if (!r.ok) return;
    sel = null; selBanca = null;
    await animar(r.eventos);
    pintar();
    if (st.fin) return fin();
    await turnoIA();
  }

  async function turnoIA() {
    while (!st.fin && st.lado === 'B') {
      animando = true; pintar();
      await espera(420);
      const a = T.accionAuto(st, 'B');
      if (!a) { T.pasarTurno(st); animando = false; pintar(); continue; }
      const r = T.jugar(st, a);
      animando = false;
      if (!r.ok) { T.pasarTurno(st); pintar(); continue; }
      await animar(r.eventos);
      pintar();
    }
    animando = false;
    pintar();
    if (st.fin) fin();
  }

  // ---------------- el duelo, animado desde el LOG ----------------
  async function animar(eventos) {
    for (const e of eventos) {
      if (e.t !== 'duelo') continue;
      animando = true;
      await mostrarDuelo(e);
      animando = false;
    }
  }

  function mostrarDuelo(e) {
    return new Promise(res => {
      const atacanteMio = mio(e.a);
      const pa = T.pieza(st, e.a), pb = T.pieza(st, e.b);
      const nA = esc(SP[pa.key]?.n || pa.key), nB = esc(SP[pb.key]?.n || pb.key);
      const ganaAtacante = e.ganador === 'A';
      const yoGane = e.ganador && (ganaAtacante === atacanteMio);

      let txt, clase = '';
      if (e.tipo === 'ko') {
        const cae = ganaAtacante ? nB : nA;
        txt = `${cae} vuelve a la banca`;
        clase = yoGane ? 'ko' : 'mal';
      } else if (e.tipo === 'estado') {
        txt = `${ganaAtacante ? nB : nA} queda tocado`;
      } else if (!e.ganador) {
        txt = 'Empate: nadie se mueve';
      } else {
        txt = `${ganaAtacante ? nA : nB} se cubre`;
      }

      const ov = document.createElement('div');
      ov.className = 'tv-ov';
      ov.innerHTML = `<div class="tv-duelo">
        <div class="tv-par">
          <div class="tv-lado">
            ${donut(e.ruedaA, 125, e.iA, 'tv-big tv-gira')}
            <h3>${nA}</h3><p style="color:${COLOR[e.colorA]}">${esc(e.gajoA)}${
              e.vecesA > 1 ? ` <b class="tv-x">×${e.vecesA}</b>` : ''}</p>
          </div>
          <div class="tv-vs">vs</div>
          <div class="tv-lado">
            ${donut(e.ruedaB, 125, e.iB, 'tv-big tv-gira')}
            <h3>${nB}</h3><p style="color:${COLOR[e.colorB]}">${esc(e.gajoB)}${
              e.vecesB > 1 ? ` <b class="tv-x">×${e.vecesB}</b>` : ''}</p>
          </div>
        </div>
        <div class="tv-res ${clase}">${txt}</div>
      </div>`;
      document.body.appendChild(ov);
      let listo = false;
      const cerrar = () => { if (listo) return; listo = true; ov.remove(); res(); };
      ov.onclick = cerrar;                       // tocar para saltar
      setTimeout(cerrar, 1900);
    });
  }

  // ---------------- fin ----------------
  function fin() {
    const gane = st.fin === 'A';
    // en aventura el resultado SÍ cuenta: suma al récord, desbloquea un animal
    // y el cabecilla hace avanzar de provincia.
    let extra = '', res = null;
    if (peleaAct) {
      res = AV.registrar(prog, gane, peleaAct);
      if (res.desbloqueo) {
        extra += `<div class="tv-nuevo"><img src="${ART(res.desbloqueo)}" alt="">
          <div><b>${esc(SP[res.desbloqueo]?.n || res.desbloqueo)}</b>
          <span>se une a tu refugio</span></div></div>`;
      }
      if (res.ganoJuego) extra += '<p class="tv-fpie">🏆 ¡Costa Rica libre! Liberaste las 7 provincias.</p>';
      else if (res.avanzo) extra += `<p class="tv-fpie">🌿 ${esc(peleaAct.prov.n)} liberada · sigue ${esc(AV.provinciaActual(prog).n)}</p>`;
    }
    const ov = document.createElement('div');
    ov.className = 'tv-ov';
    ov.innerHTML = `<div class="tv-duelo tv-fin ${gane ? 'win' : 'lose'}">
      <h2>${gane ? '🌿 ¡Llegaste al refugio!' : st.fin === 'empate' ? 'Empate' : '🪤 Te ganaron de mano'}</h2>
      <p>${st.turno} turnos</p>
      ${extra}
      <button class="tv-btn go" id="tvOtra">${peleaAct ? 'Seguir' : 'Otra partida'}</button></div>`;
    document.body.appendChild(ov);
    ov.querySelector('#tvOtra').onclick = () => {
      ov.remove();
      if (peleaAct) { peleaAct = null; return aventura(); }
      miEquipo = azar(6); suEquipo = azar(6); arrancar();
    };
  }

  menu();
}
