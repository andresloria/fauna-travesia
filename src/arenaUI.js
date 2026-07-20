// ============================================================
// arenaUI.js — PANTALLA de combate ARENA (diseño aprobado, calcado del
// original): ventana de juego con fondo de selva, tus filas a la izquierda,
// el rival a la derecha, LISTO + timer + energía arriba, descripción abajo.
// Habla SOLO con src/arena.js (motor puro). game.js la abre con abrirArena().
// ============================================================

import * as A from './arena.js';
import { SP } from './fauna_roster.js';

const ART = (key) => (SP[key] && SP[key].folk) ? `assets/folclor/${key}.png` : `assets/animales/${key}.png`;
const ORBC = { bosque: '#3f8f4a', sabana: '#c8923f', agua: '#2f6f8f', montana: '#8a6f9a', comodin: '#e8e0cc' };
const ORBE = { bosque: '🌳', sabana: '🌾', agua: '🌊', montana: '⛰', comodin: '⚪' };
const ICO = { dano: '💥', danoTurnos: '☣️', curar: '💚', curarTurnos: '💚', defensa: '🛡️', reducir: '🛡️',
  invulnerable: '✨', aturdir: '💫', robarEnergia: '🧛', quemarEnergia: '🔥', contraataque: '🌵',
  amplificar: '⬆️', limpiar: '🧼', exponer: '🎯', modo: '🔆', marcaPermanente: '🩸', darEnergia: '🔋' };
const CLASE_N = { fisico: 'Físico', natural: 'Natural', toxina: 'Toxina', instinto: 'Instinto',
  melee: 'C. cuerpo', rango: 'Distancia', instant: 'Instantáneo', sostenido: 'Sostenido',
  control: 'Control', unico: 'Único' };
const TURNO_SEG = 60;

const orbes = (costo) => !costo || !costo.length
  ? '<span class="ar-free">·</span>'
  : costo.map(c => c === 'TODO'
      ? '<b class="ar-todo">TODA</b>'
      : `<i class="ar-orb" style="background:${ORBC[c]}"></i>`).join('');

const icoDe = (h) => h.esEsquiva ? '🛡' : (ICO[(h.efectos || [])[0]?.t] || '✳️');

// ---------- abrirArena: game.js llama esto y se olvida ----------
// opts: { miEquipo:[{key,nivel,ref,n}], rivalEquipo:[{key,nivel}], titulo, sub,
//         fondo (url), bigart (url|null), guiaArt, rivalArt, onFin(won, caidosRefs) }
export function abrirArena(opts) {
  const st = A.mkCombate(opts.miEquipo, opts.rivalEquipo, { abre: Math.random() < 0.5 ? 'A' : 'B' });
  const root = document.createElement('div');
  root.className = 'ar-root';
  document.body.appendChild(root);
  document.body.classList.add('ar-lock');

  let cola = [];               // [{uid, hab, objetivo}]
  let seleccion = null;        // {uid, hab} esperando objetivo
  let auto = false;
  let timerId = null, timerFin = 0;
  let cerrando = false;

  // -------- helpers de estado --------
  const u$ = (uid) => st.unidades.find(x => x.uid === uid);
  const poolRestante = () => {
    const p = { ...st.energia.A };
    for (const acc of cola) {
      const u = u$(acc.uid);
      if (!u.contadores.primeraGratis) A.pagar(p, u.habs[acc.hab].costo || []);
    }
    return p;
  };
  const enCola = (uid) => cola.find(a => a.uid === uid);

  // -------- render --------
  function render() {
    const miTurno = st.lado === 'A' && !st.fin;
    const pool = st.energia.A;
    root.innerHTML = `
    <div class="ar-stage"><div class="ar-win">
      <div class="ar-bg" style="background-image:url('${opts.fondo}')"></div>
      ${opts.bigart ? `<div class="ar-bigart"><img src="${opts.bigart}" alt=""></div>` : ''}

      <div class="ar-top">
        <div class="ar-plate">
          <div class="ar-p"><img src="${opts.guiaArt}" alt=""></div>
          <div><b>VOS</b><span>${opts.guiaSub || 'Guía de naturaleza'}</span></div>
        </div>
        <div class="ar-mid">
          <button class="ar-ready" id="arReady" ${miTurno ? '' : 'disabled'}>
            ${st.fin ? '—' : miTurno ? '▶ LISTO' : 'TURNO RIVAL…'}</button>
          <div class="ar-timer"><i id="arTimer"></i></div>
          <div class="ar-pool">${A.BIOMAS.map(b =>
            `<span class="ar-pe ${pool[b] ? '' : 'z'}"><i style="background:${ORBC[b]}"></i>x${pool[b]}</span>`).join('')}
            <span class="ar-pe tot"><i style="background:#1c1712"></i>x${A.totalE(pool)}</span>
          </div>
        </div>
        <div class="ar-plate r">
          <div class="ar-p">${opts.rivalArt ? `<img src="${opts.rivalArt}" alt="">` : '🪤'}</div>
          <div><b>${opts.titulo || 'CAZADORES'}</b><span>${opts.sub || ''}</span></div>
        </div>
      </div>

      <div class="ar-rows">${st.unidades.filter(u => u.lado === 'A').map(filaMia).join('')}</div>
      <div class="ar-enemies">${st.unidades.filter(u => u.lado === 'B').map(rivalCol).join('')}</div>

      <div class="ar-foot">
        <div class="ar-fbtns">
          <button class="ar-fb ${auto ? 'on' : ''}" id="arAuto">🤖 AUTO ${auto ? 'ON' : 'OFF'}</button>
          <button class="ar-fb mal" id="arHuir">🏳 RENDIRSE</button>
        </div>
        <div class="ar-desc" id="arDesc">${descHTML(null)}</div>
      </div>
    </div></div>`;
    ajustarEscala();
    conectar();
    pintarTimer();
  }

  function filaMia(u) {
    const usable = st.lado === 'A' && !st.fin && u.viva;
    const acc = enCola(u.uid);
    return `<div class="ar-row ${u.viva ? '' : 'muerta'} ${seleccion?.uid === u.uid ? 'activa' : ''}">
      <div class="ar-unit" data-uid="${u.uid}">
        <div class="ar-por ${acc ? 'done' : ''}"><img src="${ART(u.key)}" alt="${u.n}">
          ${acc ? '<b class="ar-tick">✓</b>' : ''}</div>
        <div class="ar-hp">${u.hp}</div>
        <div class="ar-fxs">${fxs(u)}</div>
      </div>
      <div class="ar-strip">${u.habs.map((h, i) => tile(u, h, i, usable)).join('')}</div>
    </div>`;
  }

  function tile(u, h, i, usable) {
    const acc = enCola(u.uid);
    const esta = acc && acc.hab === i;
    let off = '', why = '';
    if (!usable) off = 'off';
    else if (u.recargas[h.n] > 0) { off = 'off'; why = `↻ ${u.recargas[h.n]}`; }
    else if (A.aturdida(u, h.clases || [])) { off = 'off'; why = 'ATURDIDA'; }
    else if (acc && !esta) off = 'off';
    else if (!esta && !u.contadores.primeraGratis &&
             !A.alcanza(poolRestante(), [h.costo || []])) { off = 'off'; why = 'SIN ENERGÍA'; }
    const sel = esta || (seleccion && seleccion.uid === u.uid && seleccion.hab === i);
    const orden = esta ? cola.indexOf(acc) + 1 : null;
    return `<button class="ar-sk ${off} ${sel ? 'sel' : ''} ${h.esEsquiva ? 'esq' : ''}"
      data-uid="${u.uid}" data-hab="${i}" title="${h.n}">
      <span class="ar-ico">${icoDe(h)}</span>
      <span class="ar-skn">${h.n}</span>
      <span class="ar-cost">${orbes(h.costo)}</span>
      ${why ? `<b class="ar-why">${why}</b>` : ''}
      ${orden ? `<span class="ar-ord">${orden}</span>` : ''}
    </button>`;
  }

  function rivalCol(u) {
    const esObjetivo = seleccion && objetivosValidos().includes(u.uid);
    return `<div class="ar-enemy ${u.viva ? '' : 'muerta'} ${esObjetivo ? 'target' : ''}" data-uid="${u.uid}">
      <div class="ar-por"><img src="${ART(u.key)}" alt="${u.n}"></div>
      <div class="ar-hp riv">${u.hp}</div>
      <div class="ar-fxs">${fxs(u)}</div>
    </div>`;
  }

  function fxs(u) {
    const out = [];
    if (u.defensa > 0) out.push(`<i class="ar-fx bien" title="Defensa">🛡${u.defensa}</i>`);
    for (const f of u.efectos) {
      if (f.t === 'dot') out.push(`<i class="ar-fx mal" title="Toxina ${f.v}/turno">☣${f.turnos}</i>`);
      if (f.t === 'hot') out.push(`<i class="ar-fx bien" title="Curándose">💚${f.turnos}</i>`);
      if (f.t === 'invulnerable') out.push(`<i class="ar-fx bien" title="Invulnerable">✨</i>`);
      if (f.t === 'aturdir') out.push(`<i class="ar-fx mal" title="Aturdida">💫</i>`);
      if (f.t === 'exponer') out.push(`<i class="ar-fx mal" title="Expuesta">🎯</i>`);
      if (f.t === 'reducir') out.push(`<i class="ar-fx bien" title="Reduce daño">🛡·</i>`);
      if (f.t === 'contra') out.push(`<i class="ar-fx bien" title="Contraataque">🌵</i>`);
      if (f.t === 'modo') out.push(`<i class="ar-fx bien" title="Modo activo">🔆${f.turnos}</i>`);
      if (f.t === 'marca') out.push(`<i class="ar-fx mal" title="Marcada +${f.v}">🩸</i>`);
      if (f.t === 'amp') out.push(`<i class="ar-fx bien" title="Amplificado +${f.v}">⬆</i>`);
    }
    return out.join('');
  }

  function descHTML(par) {
    if (!par) return `<div class="ar-dtx"><div class="ar-dn">ELEGÍ UNA HABILIDAD</div>
      <div class="ar-dd">Tocá una habilidad para ver qué hace; los objetivos válidos se encienden.
      El orden de la cola importa. Cada animal usa 1 por turno.</div></div>`;
    const { u, h } = par;
    const clases = (h.clases || []).map(c => CLASE_N[c] || c).join(' · ');
    return `
      <div class="ar-dico">${icoDe(h)}</div>
      <div class="ar-dtx">
        <div class="ar-dn">${h.n.toUpperCase()} · ${u.n.toUpperCase()}</div>
        <div class="ar-dd">${h.desc || ''}</div>
        <div class="ar-dtags"><span>${clases}</span>
          <span class="ar-dcost">${orbes(h.costo)} ↻ ${h.recarga || 0}</span></div>
      </div>`;
  }

  function objetivosValidos() {
    if (!seleccion) return [];
    const u = u$(seleccion.uid);
    return A.objetivosDe(st, u, seleccion.hab).filter(uid => uid.startsWith('B'));
  }

  // -------- interacción --------
  function conectar() {
    root.querySelectorAll('.ar-sk').forEach(el => el.onclick = () => {
      if (st.lado !== 'A' || st.fin) return;
      const uid = el.dataset.uid, hab = +el.dataset.hab;
      const u = u$(uid), h = u.habs[hab];
      mostrarDesc({ u, h });
      const acc = enCola(uid);
      if (acc && acc.hab === hab) {           // ya en cola → sacarla
        cola = cola.filter(a => a !== acc); seleccion = null; render(); return;
      }
      if (acc) return;                        // ese animal ya tiene otra en cola
      if (el.classList.contains('off')) return;
      const efs = h.efectos || [];
      const necesitaEnemigo = efs.some(f => f.obj === 'enemigo');
      const necesitaAliado = efs.some(f => f.obj === 'aliado');
      if (necesitaEnemigo) { seleccion = { uid, hab }; render(); mostrarDesc({ u, h }); }
      else if (necesitaAliado) { seleccion = { uid, hab, aliado: true }; render(); mostrarDesc({ u, h }); }
      else { cola.push({ uid, hab, objetivo: uid }); seleccion = null; render(); }
    });
    root.querySelectorAll('.ar-enemy').forEach(el => el.onclick = () => {
      if (!seleccion || seleccion.aliado) return;
      const uid = el.dataset.uid;
      if (!objetivosValidos().includes(uid)) return;
      cola.push({ uid: seleccion.uid, hab: seleccion.hab, objetivo: uid });
      seleccion = null; render();
    });
    root.querySelectorAll('.ar-unit').forEach(el => el.onclick = () => {
      if (!seleccion || !seleccion.aliado) return;
      const uid = el.dataset.uid;
      const o = u$(uid);
      if (!o.viva) return;
      cola.push({ uid: seleccion.uid, hab: seleccion.hab, objetivo: uid });
      seleccion = null; render();
    });
    const ready = root.querySelector('#arReady');
    if (ready) ready.onclick = () => jugarTurnoMio();
    root.querySelector('#arAuto').onclick = () => { auto = !auto; if (auto && st.lado === 'A' && !st.fin) jugarTurnoMio(true); else render(); };
    root.querySelector('#arHuir').onclick = () => terminar(false, true);
  }
  function mostrarDesc(par) { const d = root.querySelector('#arDesc'); if (d) d.innerHTML = descHTML(par); }

  // -------- turnos --------
  function jugarTurnoMio(forzarAuto = false) {
    if (st.lado !== 'A' || st.fin || cerrando) return;
    pararTimer();
    const q = (auto || forzarAuto) ? A.colaAuto(st, 'A') : cola;
    const r = A.ejecutarTurno(st, q);
    if (!r.ok) { A.ejecutarTurno(st, []); }   // cola inválida (raro): pasa el turno
    cola = []; seleccion = null;
    render();
    despuesDelTurno();
  }
  function turnoRival() {
    if (st.fin || cerrando) return;
    setTimeout(() => {
      A.ejecutarTurno(st, A.colaAuto(st, 'B'));
      cola = []; seleccion = null;
      render();
      despuesDelTurno();
    }, 700);
  }
  function despuesDelTurno() {
    if (st.fin) return terminar(st.fin === 'A', false);
    if (st.lado === 'B') return turnoRival();
    if (auto) return jugarTurnoMio(true);
    arrancarTimer();
  }

  // -------- timer (quedarse sin tiempo cancela la cola, como el original) --------
  function arrancarTimer() {
    pararTimer();
    timerFin = Date.now() + TURNO_SEG * 1000;
    timerId = setInterval(() => {
      pintarTimer();
      if (Date.now() >= timerFin) {
        pararTimer();
        cola = []; seleccion = null;
        A.ejecutarTurno(st, []);              // se te fue el tiempo: pasás sin jugar
        render(); despuesDelTurno();
      }
    }, 250);
    pintarTimer();
  }
  function pararTimer() { if (timerId) { clearInterval(timerId); timerId = null; } }
  function pintarTimer() {
    const el = root.querySelector('#arTimer');
    if (!el) return;
    const f = timerId ? Math.max(0, (timerFin - Date.now()) / (TURNO_SEG * 1000)) : 1;
    el.style.width = (f * 100).toFixed(1) + '%';
  }

  // -------- cierre --------
  function terminar(gane, rendicion) {
    if (cerrando) return;
    cerrando = true;
    pararTimer();
    const caidos = st.unidades.filter(u => u.lado === 'A' && !u.viva && u.ref != null).map(u => u.ref);
    const fin = document.createElement('div');
    fin.className = 'ar-fin ' + (gane ? 'win' : 'lose');
    fin.innerHTML = `<div class="ar-finbox">
      <div class="ar-fint">${gane ? '🏆 ¡VICTORIA!' : rendicion ? '🏳 Te retiraste' : '💀 DERROTA'}</div>
      <button class="ar-finbtn">Continuar</button></div>`;
    root.querySelector('.ar-win').appendChild(fin);
    fin.querySelector('.ar-finbtn').onclick = () => {
      root.remove();
      document.body.classList.remove('ar-lock');
      opts.onFin(gane, caidos, st);   // st completo: liga.js saca de ahí las misiones
    };
  }

  function ajustarEscala() {
    const win = root.querySelector('.ar-win');
    const s = Math.min(1, (window.innerWidth - 8) / 940, (window.innerHeight - 8) / 600);
    win.style.transform = `scale(${s})`;
  }
  window.addEventListener('resize', ajustarEscala);

  // -------- arranque --------
  render();
  if (st.lado === 'B') turnoRival(); else arrancarTimer();
  return st;   // (los tests / la consola pueden inspeccionarlo)
}
