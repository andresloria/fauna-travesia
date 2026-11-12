// ============================================================
// travesia/tablero.js — EL TABLERO (prototipo del modo Travesía).
//
// Adaptación de Pokémon Duel. Lo esencial:
//   · Equipo de 6. Las piezas entran por TUS entradas y tienen que llegar al
//     REFUGIO del rival. Eso es ganar: llegar, no matar.
//   · Una acción por turno (entrar, mover, o mover-y-atacar).
//   · Las piezas BLOQUEAN: no se pasa por encima ni se ocupa su nodo. Ese es
//     el corazón táctico — cerrarle una entrada al rival es una jugada real.
//   · Quedar adyacente a un enemigo permite el DUELO (ver rueda.js).
//   · El que pierde el duelo por DAÑO vuelve a la banca unos turnos.
//
// Motor PURO: cero DOM. El rng se inyecta para que todo sea reproducible.
// ============================================================

import { ruedaDe, ruedaEnBioma, girar, resolverDuelo, evDuelo } from './rueda.js';

export const BIOMAS_T = ['bosque', 'sabana', 'agua', 'montana'];
export const ESPERA_KO = 7;        // acciones que pasa en la banca tras caer
export const LIMITE_TURNOS = 300;  // igual que Duel, para que nada sea eterno
export const EQUIPO = 6;

// ---------- el tablero ----------
// Rejilla de nodos. Fila 0 = lado B (arriba), última fila = lado A (abajo).
// Cada lado tiene 2 entradas en las esquinas y 1 refugio al centro.
export function mkTablero({ filas = 8, cols = 5 } = {}) {
  const nodos = {};
  const add = (id, x, y, tipo = 'normal', bio = null) => {
    nodos[id] = { id, x, y, tipo, bio, vecinos: [] };
  };
  const une = (a, b) => { nodos[a].vecinos.push(b); nodos[b].vecinos.push(a); };

  for (let r = 0; r < filas; r++) {
    for (let c = 0; c < cols; c++) {
      // bioma determinista (sin rng) para que los tests sean reproducibles:
      // ~1 de cada 3 nodos tiene hábitat.
      const bio = (r * cols + c) % 3 === 0 ? BIOMAS_T[(r + c) % 4] : null;
      add(`r${r}c${c}`, c, r + 1, 'normal', bio);
    }
  }
  const mid = Math.floor(cols / 2);
  add('metaB', mid, 0, 'meta');
  add('metaA', mid, filas + 1, 'meta');
  add('eB1', 0, 0, 'entrada');            add('eB2', cols - 1, 0, 'entrada');
  add('eA1', 0, filas + 1, 'entrada');    add('eA2', cols - 1, filas + 1, 'entrada');

  for (let r = 0; r < filas; r++) {
    for (let c = 0; c < cols; c++) {
      if (c + 1 < cols) une(`r${r}c${c}`, `r${r}c${c + 1}`);
      if (r + 1 < filas) une(`r${r}c${c}`, `r${r + 1}c${c}`);
    }
  }
  for (const d of [-1, 0, 1]) {
    const c = mid + d;
    if (c >= 0 && c < cols) { une('metaB', `r0c${c}`); une('metaA', `r${filas - 1}c${c}`); }
  }
  une('eB1', 'r0c0');             une('eB2', `r0c${cols - 1}`);
  une('eA1', `r${filas - 1}c0`);  une('eA2', `r${filas - 1}c${cols - 1}`);

  return { nodos, filas, cols, entradas: { A: ['eA1', 'eA2'], B: ['eB1', 'eB2'] } };
}

// ---------- partida ----------
export function mkPartida(equipoA, equipoB, opts = {}) {
  const rng = opts.rng || Math.random;
  const tablero = opts.tablero || mkTablero(opts);
  const piezas = [];
  const arma = (eq, lado) => eq.forEach((e, i) => {
    const key = e.key || e;
    piezas.push({
      uid: lado + i, key, lado, nodo: null,
      estado: 'banca', vuelveEn: 0, efectos: [],
      rueda: opts.rueda ? opts.rueda(key) : ruedaDe(key),
    });
  });
  arma(equipoA, 'A'); arma(equipoB, 'B');
  return {
    rng, tablero, piezas, turno: 1,
    lado: opts.abre || (rng() < 0.5 ? 'A' : 'B'),
    fin: null, log: [],
  };
}

export const rival = (l) => (l === 'A' ? 'B' : 'A');
export const pieza = (st, uid) => st.piezas.find(p => p.uid === uid);
export const enTablero = (st, lado) => st.piezas.filter(p => p.lado === lado && p.estado === 'tablero');
export const enBanca = (st, lado) => st.piezas.filter(p =>
  p.lado === lado && p.estado === 'banca' && p.vuelveEn <= st.turno);
export const ocupante = (st, nodo) =>
  st.piezas.find(p => p.estado === 'tablero' && p.nodo === nodo) || null;
export const vecinos = (st, nodo) => st.tablero.nodos[nodo].vecinos;
// la meta que ESTE lado tiene que alcanzar (la del rival)
export const metaDe = (lado) => (lado === 'A' ? 'metaB' : 'metaA');
export const bioDe = (st, nodo) => st.tablero.nodos[nodo].bio;

export const enemigosAdyacentes = (st, p) => vecinos(st, p.nodo)
  .map(n => ocupante(st, n)).filter(o => o && o.lado !== p.lado);

// A dónde puede llegar esta pieza: BFS hasta su mp, sin atravesar ni pisar
// nodos ocupados (el bloqueo es la mecánica central).
export function alcanzables(st, uid) {
  const p = pieza(st, uid);
  if (!p || p.estado !== 'tablero') return [];
  const vistos = new Set([p.nodo]);
  let borde = [p.nodo];
  const out = [];
  for (let paso = 0; paso < p.rueda.mp; paso++) {
    const sig = [];
    for (const n of borde) {
      for (const v of vecinos(st, n)) {
        if (vistos.has(v)) continue;
        vistos.add(v);
        if (ocupante(st, v)) continue;        // ocupado: ni se pisa ni se cruza
        sig.push(v); out.push(v);
      }
    }
    borde = sig;
  }
  return out;
}

// Distancias desde un nodo a todo el tablero, IGNORANDO ocupación.
// Es la brújula de la IA: "¿qué tan lejos estoy del refugio?".
export function distancias(st, desde) {
  const d = { [desde]: 0 };
  let borde = [desde];
  while (borde.length) {
    const sig = [];
    for (const n of borde) for (const v of vecinos(st, n)) {
      if (d[v] === undefined) { d[v] = d[n] + 1; sig.push(v); }
    }
    borde = sig;
  }
  return d;
}

function noquear(st, p) {
  p.estado = 'banca'; p.nodo = null; p.efectos = [];
  p.vuelveEn = st.turno + ESPERA_KO;
}

// El duelo: giran las dos ruedas (ajustadas por el bioma del nodo donde está
// parada cada una) y el color decide.
function duelo(st, pa, pb) {
  const ev = [];
  const ra = ruedaEnBioma(pa.rueda, bioDe(st, pa.nodo));
  const rb = ruedaEnBioma(pb.rueda, bioDe(st, pb.nodo));
  const ga = girar(ra, st.rng), gb = girar(rb, st.rng);
  const r = resolverDuelo(ga, gb);
  ev.push({
    t: 'duelo', a: pa.uid, b: pb.uid, ganador: r.ganador, tipo: r.tipo,
    gajoA: ga.n, colorA: ga.color, gajoB: gb.n, colorB: gb.color,
  });
  if (r.tipo === 'ko') {
    const perdedor = r.ganador === 'A' ? pb : pa;
    noquear(st, perdedor);
    ev.push({ t: 'ko', uid: perdedor.uid });
  } else if (r.tipo === 'estado') {
    const tocado = r.ganador === 'A' ? pb : pa;
    const g = r.ganador === 'A' ? ga : gb;
    tocado.efectos.push(...g.efectos.filter(f => f.obj === 'enemigo'));
    ev.push({ t: 'estado', uid: tocado.uid });
  }
  return ev;
}

export function pasarTurno(st) {
  st.turno++;
  st.lado = rival(st.lado);
  if (st.turno > LIMITE_TURNOS && !st.fin) st.fin = 'empate';
}

// Una acción por turno:
//   { tipo:'entrar', uid, hasta }                 desplegar desde la banca
//   { tipo:'mover',  uid, hasta, atacar? }        mover (y opcionalmente pelear)
//   { tipo:'atacar', uid, objetivo }              pelear sin moverse
export function jugar(st, accion) {
  if (st.fin) return { ok: false, error: 'la partida terminó' };
  const p = pieza(st, accion.uid);
  if (!p || p.lado !== st.lado) return { ok: false, error: 'esa pieza no es tuya' };
  const ev = [];

  if (accion.tipo === 'entrar') {
    if (p.estado !== 'banca') return { ok: false, error: 'no está en la banca' };
    if (p.vuelveEn > st.turno) return { ok: false, error: 'todavía se recupera' };
    if (!st.tablero.entradas[p.lado].includes(accion.hasta)) return { ok: false, error: 'no es tu entrada' };
    if (ocupante(st, accion.hasta)) return { ok: false, error: 'entrada ocupada' };
    p.estado = 'tablero'; p.nodo = accion.hasta;
    ev.push({ t: 'entra', uid: p.uid, nodo: p.nodo });
  } else if (accion.tipo === 'mover') {
    if (p.estado !== 'tablero') return { ok: false, error: 'no está en el tablero' };
    if (!alcanzables(st, p.uid).includes(accion.hasta)) return { ok: false, error: 'fuera de alcance' };
    p.nodo = accion.hasta;
    ev.push({ t: 'mueve', uid: p.uid, nodo: p.nodo });
  } else if (accion.tipo !== 'atacar') {
    return { ok: false, error: 'acción desconocida' };
  }

  const objUid = accion.atacar || (accion.tipo === 'atacar' ? accion.objetivo : null);
  if (objUid) {
    const o = pieza(st, objUid);
    if (!o || o.lado === p.lado || o.estado !== 'tablero') return { ok: false, error: 'objetivo inválido' };
    if (p.estado !== 'tablero') return { ok: false, error: 'no está en el tablero' };
    if (!vecinos(st, p.nodo).includes(o.nodo)) return { ok: false, error: 'no está adyacente' };
    ev.push(...duelo(st, p, o));
  }

  if (p.estado === 'tablero' && p.nodo === metaDe(p.lado)) {
    st.fin = p.lado;
    ev.push({ t: 'meta', uid: p.uid, lado: p.lado });
  }
  st.log.push(...ev);
  if (!st.fin) pasarTurno(st);
  return { ok: true, eventos: ev };
}

// ---------- IA ----------
// El corazón de la heurística es LA CARRERA: ¿en cuántas acciones anoto yo, y
// en cuántas anota él? Si él llega antes o igual, correr es perder — toca
// interponerse o sacarlo del tablero. Sin esto el juego es degenerado: los dos
// corren y gana el que abrió.
const turnosPara = (d, mp) => (d === undefined ? 99 : Math.ceil(d / mp));

function tiempoDeAnotar(st, lado, dMeta) {
  let mejor = 99;
  for (const p of enTablero(st, lado)) {
    mejor = Math.min(mejor, turnosPara(dMeta[p.nodo], p.rueda.mp));
  }
  return mejor;
}

export function accionAuto(st, lado = st.lado) {
  const mios = enTablero(st, lado);
  const otro = rival(lado);
  const meta = metaDe(lado);          // la que tengo que alcanzar
  const miMeta = metaDe(otro);        // la que tengo que defender

  // 1) ¿alguien llega al refugio ya? Se gana, no hay nada que pensar.
  for (const p of mios) {
    if (alcanzables(st, p.uid).includes(meta)) return { tipo: 'mover', uid: p.uid, hasta: meta };
  }

  const dMeta = distancias(st, meta);
  const dMiMeta = distancias(st, miMeta);
  const banca = enBanca(st, lado);
  const libres = st.tablero.entradas[lado].filter(e => !ocupante(st, e));

  // 2) desplegar si hay poca gente arriba (sin piezas no se ataca ni se tapa)
  if (banca.length && libres.length && mios.length < 3) {
    const mejor = banca.reduce((a, b) => (b.rueda.mp > a.rueda.mp ? b : a));
    return { tipo: 'entrar', uid: mejor.uid, hasta: libres[0] };
  }

  // 3) la carrera
  // ⚠️ MEDIDO: con `suTiempo <= miTiempo` los DOS lados defendían a la vez
  // (la posición es simétrica) y la partida se congelaba — 68% de empates.
  // Con `<` estricto, el empate de tiempos se resuelve corriendo: el que tiene
  // el turno llega primero, así que atacar es correcto.
  const miTiempo = tiempoDeAnotar(st, lado, dMeta);
  const suTiempo = tiempoDeAnotar(st, otro, dMiMeta);
  const defender = suTiempo < miTiempo;

  // el enemigo más adelantado es a quien hay que frenar
  const enemigos = enTablero(st, otro);
  const corredor = enemigos.length
    ? enemigos.reduce((a, b) =>
        turnosPara(dMiMeta[b.nodo], b.rueda.mp) < turnosPara(dMiMeta[a.nodo], a.rueda.mp) ? b : a)
    : null;

  const dCorredor = corredor ? distancias(st, corredor.nodo) : {};

  let mejor = null, mejorS = -Infinity;
  for (const p of mios) {
    for (const destino of alcanzables(st, p.uid)) {
      const bio = bioDe(st, destino);
      const ra = ruedaEnBioma(p.rueda, bio);

      // ¿a quién podría pelear parado ahí, y me conviene?
      let atacar = null, mejorEv = -Infinity, hayEnemigo = false;
      for (const n of vecinos(st, destino)) {
        const o = ocupante(st, n);
        if (!o || o.lado === lado) continue;
        hayEnemigo = true;
        const ev = evDuelo(ra, ruedaEnBioma(o.rueda, bioDe(st, o.nodo))).ev;
        // al corredor se lo pelea aunque la rueda no favorezca: si anota, se perdió
        const vale = o === corredor && defender ? ev + 0.5 : ev;
        if (vale > mejorEv) { mejorEv = vale; atacar = o.uid; }
      }

      let s;
      if (defender && corredor) {
        // Interceptar al corredor, NO replegarse al propio refugio: medir la
        // distancia AL CORREDOR. (Con -dMiMeta las piezas se amontonaban en su
        // refugio y lo dejaban pasar por un costado.)
        s = -(dCorredor[destino] ?? 99) * 8;
        if (vecinos(st, destino).includes(corredor.nodo)) s += 25;        // pegado: puedo pelearlo
        if ((dMiMeta[destino] ?? 99) < (dMiMeta[corredor.nodo] ?? 99)) s += 12;  // taparle el paso
      } else {
        s = -(dMeta[destino] ?? 99) * 10;
      }
      if (bio && bio === p.rueda.bio) s += 4;              // pelea mejor en su hábitat
      if (atacar && mejorEv > 0) s += mejorEv * 30;
      else if (hayEnemigo) s -= 6;                         // quedar al lado sin ventaja

      if (s > mejorS) {
        mejorS = s;
        const usar = atacar && mejorEv > 0 ? atacar : null;
        mejor = usar ? { tipo: 'mover', uid: p.uid, hasta: destino, atacar: usar }
                     : { tipo: 'mover', uid: p.uid, hasta: destino };
      }
    }
    // pelear sin moverse, si ya está pegado a alguien que le conviene
    for (const o of enemigosAdyacentes(st, p)) {
      const ev = evDuelo(ruedaEnBioma(p.rueda, bioDe(st, p.nodo)),
                         ruedaEnBioma(o.rueda, bioDe(st, o.nodo))).ev;
      const vale = o === corredor && defender ? ev + 0.5 : ev;
      const s = vale * 30 + (defender ? 12 : 0);
      if (vale > 0 && s > mejorS) {
        mejorS = s;
        mejor = { tipo: 'atacar', uid: p.uid, objetivo: o.uid };
      }
    }
  }
  if (mejor) return mejor;

  // 4) no se puede mover nada: meter lo que haya en la banca
  if (banca.length && libres.length) {
    return { tipo: 'entrar', uid: banca[0].uid, hasta: libres[0] };
  }
  return null;                                             // pasa el turno
}

// Juega una partida entera con la IA de los dos lados. Devuelve el estado.
export function jugarAuto(st, maxAcciones = LIMITE_TURNOS) {
  let n = 0;
  while (!st.fin && n++ < maxAcciones) {
    const a = accionAuto(st);
    if (!a) { pasarTurno(st); continue; }
    const r = jugar(st, a);
    if (!r.ok) { pasarTurno(st); }   // la IA propuso algo inválido: no se traba
  }
  if (!st.fin) st.fin = 'empate';
  return st;
}
