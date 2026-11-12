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

import { PLACAS, mkMazo } from './plates.js';
import { ruedaDe, ruedaEnBioma, girar, girarCompleto, resolverDuelo, evDuelo,
         ruedaConEstados, estadosDe, tieneEstado } from './rueda.js';

export const BIOMAS_T = ['bosque', 'sabana', 'agua', 'montana'];
// EL CENTRO DE RECUPERACIÓN aguanta 2 piezas. No es un temporizador: cuando
// cae una tercera, la más vieja sale a la banca y se puede volver a meter.
// (Regla del Duel original — es mejor que un timer fijo porque se autorregula:
// nunca podés quedarte con menos de 4 piezas disponibles, y mientras más
// perdés, más rápido vuelven las anteriores.)
export const CENTRO_CAPACIDAD = 2;
// la que sale del centro pierde un turno antes de poder entrar
export const ESPERA_SALIDA = 1;
export const LIMITE_TURNOS = 300;  // igual que Duel, para que nada sea eterno
export const EQUIPO = 6;

// ============================================================
// EL TABLERO DE POKÉMON DUEL (transcrito del tablero original).
//
// No es una rejilla: son DOS ANILLOS CONCÉNTRICOS unidos por 6 radios.
//   · anillo EXTERIOR de 20 nodos — las 4 esquinas son las entradas y en el
//     medio de los lados corto van los dos refugios;
//   · anillo INTERIOR de 8 nodos;
//   · 6 radios: uno desde cada esquina al vértice interior más cercano, más
//     dos desde los puntos pegados a cada refugio al medio interior.
// Total: 26 puntos + 2 refugios, que es exactamente lo que documenta el juego.
//
// Va ROTADO a vertical (los refugios arriba y abajo en vez de a los costados)
// porque en teléfono conviene que lo tuyo quede abajo.
//
// Por qué es mejor que mi rejilla: los radios son CUELLOS DE BOTELLA. Hay
// pocas rutas, así que bloquear y cercar valen de verdad.
// ============================================================
export function mkTablero() {
  const nodos = {};
  const add = (id, x, y, tipo = 'normal', bio = null) =>
    (nodos[id] = { id, x, y, tipo, bio, vecinos: [] });
  const une = (a, b) => { nodos[a].vecinos.push(b); nodos[b].vecinos.push(a); };
  const anillo = (ids) => ids.forEach((id, i) => une(id, ids[(i + 1) % ids.length]));

  // --- anillo exterior (20) --- arriba el lado B, abajo el lado A
  add('eB1', 0, 0, 'entrada'); add('p1_0', 1, 0); add('p2_0', 2, 0);
  add('metaB', 3, 0, 'meta');
  add('p4_0', 4, 0); add('p5_0', 5, 0); add('eB2', 6, 0, 'entrada');
  add('p6_1', 6, 1); add('p6_2', 6, 2); add('p6_3', 6, 3);
  add('eA2', 6, 4, 'entrada'); add('p5_4', 5, 4); add('p4_4', 4, 4);
  add('metaA', 3, 4, 'meta');
  add('p2_4', 2, 4); add('p1_4', 1, 4); add('eA1', 0, 4, 'entrada');
  add('p0_3', 0, 3); add('p0_2', 0, 2); add('p0_1', 0, 1);
  anillo(['eB1', 'p1_0', 'p2_0', 'metaB', 'p4_0', 'p5_0', 'eB2',
          'p6_1', 'p6_2', 'p6_3', 'eA2', 'p5_4', 'p4_4', 'metaA',
          'p2_4', 'p1_4', 'eA1', 'p0_3', 'p0_2', 'p0_1']);

  // --- anillo interior (8) ---
  add('i2_1', 2, 1); add('i3_1', 3, 1); add('i4_1', 4, 1); add('i4_2', 4, 2);
  add('i4_3', 4, 3); add('i3_3', 3, 3); add('i2_3', 2, 3); add('i2_2', 2, 2);
  anillo(['i2_1', 'i3_1', 'i4_1', 'i4_2', 'i4_3', 'i3_3', 'i2_3', 'i2_2']);

  // --- los 6 radios ---
  une('eB1', 'i2_1'); une('eB2', 'i4_1');
  une('eA1', 'i2_3'); une('eA2', 'i4_3');
  une('p4_0', 'i3_1'); une('p2_4', 'i3_3');   // los pegados a cada refugio

  // biomas: fijos (sin rng) para que todo sea reproducible
  const BIO = {
    p1_0: 'agua', p5_0: 'montana', p6_2: 'sabana', p0_2: 'bosque',
    p1_4: 'montana', p5_4: 'agua', p2_0: 'bosque', p4_4: 'sabana',
    i3_1: 'bosque', i2_2: 'sabana', i4_2: 'agua', i3_3: 'montana',
  };
  for (const [id, b] of Object.entries(BIO)) if (nodos[id]) nodos[id].bio = b;

  return { nodos, filas: 4, cols: 6, entradas: { A: ['eA1', 'eA2'], B: ['eB1', 'eB2'] } };
}

// La rejilla vieja queda para poder comparar los dos tableros midiendo.
export function mkTableroRejilla({ filas = 8, cols = 5 } = {}) {
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

const rivalLado = (l) => (l === 'A' ? 'B' : 'A');

// ---------- partida ----------
export function mkPartida(equipoA, equipoB, opts = {}) {
  const rng = opts.rng || Math.random;
  const tablero = opts.tablero || mkTablero(opts);
  const piezas = [];
  const arma = (eq, lado) => eq.forEach((e, i) => {
    const key = e.key || e;
    piezas.push({
      uid: lado + i, key, lado, nodo: null,
      estado: 'banca', vuelveEn: 0, efectos: [], estados: [], heridas: 0, bonus: null,
      rueda: opts.rueda ? opts.rueda(key) : ruedaDe(key),
    });
  });
  arma(equipoA, 'A'); arma(equipoB, 'B');
  return {
    rng, tablero, piezas, turno: 1,
    lado: opts.abre || (rng() < 0.5 ? 'A' : 'B'),
    // Cuántos duelos perdidos aguanta una pieza antes de ir a la banca.
    // 1 = regla de Pokémon Duel (un giro malo y afuera). Subirlo suaviza la
    // suerte, pero OJO: acumular golpes hace que el kit pese más, que es
    // justo lo que infla el desbalance en la arena. Medir antes de cambiarlo.
    centro: { A: [], B: [] },
    // Las placas solo se pueden usar AL PRINCIPIO DEL TURNO: en cuanto movés
    // se cierran (regla del original). `movio` marca eso.
    placas: { A: mkMazo(opts.placasA), B: mkMazo(opts.placasB) },
    movio: false,
    // REGLA DE DUEL: el que abre tiene 1 MP menos en su primer movimiento.
    // Es la compensación del juego original por el tempo de salir primero, y
    // acá hace falta de verdad: el tablero es corto (6 pasos de la entrada al
    // refugio rival) y sin esto abrir gana el 56.3%.
    penalApertura: opts.penalApertura ? (opts.abre || null) : null,
    // piso del MP penalizado: con 1 la penalización pesa ~2 acciones y pasa de
    // largo (abre cae a 28.7%); con 2 solo frena a los más rápidos.
    penalMin: opts.penalMin ?? 2,
    // COMPENSACIÓN POR ABRIR (nuestra, no de Duel): el que responde mete DOS
    // animales en su primer turno. Vale exactamente una acción, que es el
    // tamaño del desbalance. El MP-1 del original resultó demasiado grueso en
    // este tablero corto: o no hace nada (56%) o pasa de largo (28%).
    // ⚠️ ENCENDIDA, y es una decisión MEDIDA (tablero Duel, IA actual):
    //   sin compensar .............. abre gana 60.1%
    //   con entrada doble .......... abre gana 41.0%
    // Ninguna da 50 clavado porque el desbalance vale MEDIA acción y no hay
    // forma de cobrar media acción. 41.0 queda más cerca que 60.1, así que va
    // encendida; igual conviene ALTERNAR quién abre entre partidas, que es lo
    // que lo vuelve justo de verdad en una serie. Se apaga con
    // `dobleEntrada: false`.
    dobleEntrada: opts.dobleEntrada === false ? null : rivalLado(opts.abre || 'A'),
    resistencia: opts.resistencia || 1,
    // turnos que pierde la pieza al salir del centro
    espera: opts.espera ?? ESPERA_SALIDA,
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

// MP de esta pieza AHORA (con la penalización de apertura si corresponde).
export const mpEfectivo = (st, p) =>
  Math.max(1,
    (st.penalApertura === p.lado ? Math.max(st.penalMin ?? 2, p.rueda.mp - 1) : p.rueda.mp)
    - (tieneEstado(p.estados, 'lento') ? 1 : 0)
    + (p.bonus?.mp || 0));   // marcador Mp−1 de Duel y el +1 del Atajo

// A dónde puede llegar esta pieza: BFS hasta su mp, sin atravesar ni pisar
// nodos ocupados (el bloqueo es la mecánica central).
export function alcanzables(st, uid) {
  const p = pieza(st, uid);
  if (!p || p.estado !== 'tablero') return [];
  const vistos = new Set([p.nodo]);
  let borde = [p.nodo];
  const out = [];
  if (p.inmovilHasta && st.turno < p.inmovilHasta) return [];   // entró quieta
  const mp = mpEfectivo(st, p);
  for (let paso = 0; paso < mp; paso++) {
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

// Al centro de recuperación. Si ya había 2, la más vieja sale a la banca.
function alCentro(st, p) {
  p.estado = 'centro'; p.nodo = null; p.efectos = []; p.estados = []; p.heridas = 0; p.vuelveEn = 0;
  const cola = st.centro[p.lado];
  cola.push(p.uid);
  while (cola.length > CENTRO_CAPACIDAD) {
    const q = pieza(st, cola.shift());
    q.estado = 'banca';
    q.vuelveEn = st.turno + (st.espera ?? ESPERA_SALIDA);
  }
}

// CERCO: si TODOS los puntos alrededor de una pieza están tapados por el
// rival, se va al centro sin pelear. Es la segunda forma de sacar piezas y lo
// que le da sentido táctico al bloqueo (ojo con las esquinas: tienen menos
// vecinos, así que ahí es mucho más fácil quedar cercado).
function revisarCercos(st, lado, ev) {
  for (const e of enTablero(st, rival(lado))) {
    const vs = vecinos(st, e.nodo);
    if (!vs.length) continue;
    const cercada = vs.every(n => {
      const o = ocupante(st, n);
      return o && o.lado === lado;
    });
    if (cercada) { alCentro(st, e); ev.push({ t: 'cercado', uid: e.uid }); }
  }
}

// El duelo: giran las dos ruedas (ajustadas por el bioma del nodo donde está
// parada cada una) y el color decide.
// La rueda con la que pelea AHORA: ajustada por el bioma del nodo y degradada
// por los estados que carga (así funcionan los estados en Duel: no quitan
// vida —no hay vida— sino que te empeoran la rueda).
export const ruedaActual = (st, p) => {
  let r = ruedaConEstados(ruedaEnBioma(p.rueda, bioDe(st, p.nodo)), p.estados);
  const extra = (p.bonus?.dano || 0) + (st.bonusEquipo?.[p.lado] || 0);
  if (extra) r = { ...r, gajos: r.gajos.map(g => (g.dano > 0 ? { ...g, dano: g.dano + extra } : g)) };
  return r;
};

function duelo(st, pa, pb) {
  const ev = [];
  const ra = ruedaActual(st, pa);
  const rb = ruedaActual(st, pb);
  // placa Instinto: gira dos veces y se queda con el mejor resultado
  const tirar = (r, p) => {
    const uno = girarCompleto(r, st.rng);
    if (!p.bonus?.regiro) return uno;
    p.bonus.regiro = false;
    const dos = girarCompleto(r, st.rng);
    const vale = (t) => (t.gajo.color === 'rojo' ? -1 : t.gajo.dano);
    return vale(dos) > vale(uno) ? dos : uno;
  };
  const ta = tirar(ra, pa), tb = tirar(rb, pb);
  const ga = ta.gajo, gb = tb.gajo;
  const r = resolverDuelo(ga, gb);
  // El evento va COMPLETO (las dos ruedas ya ajustadas por bioma y el índice
  // del gajo que salió) para que la UI pueda animar el giro leyendo solo el
  // log, sin recalcular nada ni depender del estado posterior de las piezas.
  ev.push({
    t: 'duelo', a: pa.uid, b: pb.uid, ganador: r.ganador, tipo: r.tipo,
    gajoA: ga.n, colorA: ga.color, gajoB: gb.n, colorB: gb.color,
    ruedaA: ra.gajos, ruedaB: rb.gajos,
    iA: ta.i, iB: tb.i, vecesA: ta.veces, vecesB: tb.veces,
  });
  if (r.tipo === 'ko') {
    const perdedor = r.ganador === 'A' ? pb : pa;
    if (perdedor.bonus?.inmune) {                      // placa Caparazón
      perdedor.bonus.inmune = false;
      ev.push({ t: 'aguanta', uid: perdedor.uid });
      return ev;
    }
    perdedor.heridas = (perdedor.heridas || 0) + 1;
    if (perdedor.heridas >= st.resistencia) {
      alCentro(st, perdedor);
      ev.push({ t: 'ko', uid: perdedor.uid });
    } else {
      // aguanta: queda tocada en el tablero (se le curan las heridas si cae)
      ev.push({ t: 'herida', uid: perdedor.uid, heridas: perdedor.heridas,
                aguanta: st.resistencia - perdedor.heridas });
    }
  } else if (r.tipo === 'estado') {
    const tocado = r.ganador === 'A' ? pb : pa;
    const g = r.ganador === 'A' ? ga : gb;
    const nuevos = estadosDe(g).map(x => ({ ...x, hasta: st.turno + x.turnos * 2 }));
    tocado.estados.push(...nuevos);
    ev.push({ t: 'estado', uid: tocado.uid, estados: nuevos.map(x => x.e) });
  }
  return ev;
}

// WAIT WIN: se gana también dejando al rival sin forma de jugar — sin piezas
// en el tablero y sin poder meter ninguna (entradas tapadas, o nada en banca).
// Es lo que vuelve el bloqueo de entradas una jugada ganadora de verdad.
export function sinSalida(st, lado) {
  if (enTablero(st, lado).length) return false;
  if (!enBanca(st, lado).length) return true;                 // nada que meter
  return !st.tablero.entradas[lado].some(e => !ocupante(st, e)); // entradas tapadas
}

export function pasarTurno(st) {
  st.turno++;
  st.movio = false;
  st.bonusEquipo = { A: 0, B: 0 };
  for (const p of st.piezas) p.bonus = null;
  for (const p of st.piezas) {
    if (p.estados && p.estados.length) p.estados = p.estados.filter(x => x.hasta > st.turno);
  }
  st.lado = rival(st.lado);
  if (!st.fin && sinSalida(st, st.lado)) st.fin = rival(st.lado);
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
    if (st.penalApertura === p.lado) st.penalApertura = null;   // se gasta una sola vez
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

  revisarCercos(st, p.lado, ev);

  if (p.estado === 'tablero' && p.nodo === metaDe(p.lado)) {
    st.fin = p.lado;
    ev.push({ t: 'meta', uid: p.uid, lado: p.lado });
  }
  st.movio = true;            // a partir de acá ya no se pueden usar placas
  st.log.push(...ev);
  // el que responde encadena su segunda entrada sin perder el turno
  const encadena = accion.tipo === 'entrar' && st.dobleEntrada === p.lado;
  if (encadena) {
    st.dobleEntrada = null;
    // la segunda entra QUIETA un turno suyo: la entrada doble completa valía
    // una acción y el desbalance era de media (medido: 43% contra 56.3%).
    if (st.quietaAlEncadenar !== false) p.inmovilHasta = st.turno + 2;
  }
  if (!st.fin && !encadena) pasarTurno(st);
  return { ok: true, eventos: ev };
}

// ---------- PLACAS ----------
// Solo al principio del turno (antes de mover), una vez cada una.
export function puedeUsarPlaca(st, lado, id) {
  if (st.fin || st.lado !== lado || st.movio) return false;
  const c = (st.placas[lado] || []).find(x => x.id === id);
  return !!c && !c.usada;
}

export function usarPlaca(st, lado, id, objetivoUid) {
  if (!puedeUsarPlaca(st, lado, id)) return { ok: false, error: 'no se puede usar ahora' };
  const def = PLACAS[id];
  const o = objetivoUid ? pieza(st, objetivoUid) : null;
  const esMia = o && o.lado === lado;
  const ev = [];

  const pideMia = def.obj === 'mia';
  const pideRival = def.obj === 'rival';
  const pideCentro = def.obj === 'centro';
  if (pideMia && (!o || !esMia || o.estado !== 'tablero')) return { ok: false, error: 'elegí un animal tuyo en el tablero' };
  if (pideRival && (!o || esMia || o.estado !== 'tablero')) return { ok: false, error: 'elegí un animal rival en el tablero' };
  if (pideCentro && (!o || !esMia || o.estado !== 'centro')) return { ok: false, error: 'elegí un animal del centro' };

  switch (id) {
    case 'rugido':   o.bonus = { ...(o.bonus || {}), dano: (o.bonus?.dano || 0) + 10 }; break;
    case 'celo':     st.bonusEquipo = { ...(st.bonusEquipo || { A: 0, B: 0 }) };
                     st.bonusEquipo[lado] = (st.bonusEquipo[lado] || 0) + 20; break;
    case 'hierba':   o.estados = []; break;
    case 'caparazon':o.bonus = { ...(o.bonus || {}), inmune: true }; break;
    case 'atajo':    o.bonus = { ...(o.bonus || {}), mp: (o.bonus?.mp || 0) + 1 }; break;
    case 'instinto': o.bonus = { ...(o.bonus || {}), regiro: true }; break;
    case 'rescate': {
      const cola = st.centro[lado];
      const i = cola.indexOf(o.uid);
      if (i >= 0) cola.splice(i, 1);
      o.estado = 'banca'; o.vuelveEn = st.turno;
      break;
    }
    case 'estampida': {
      // lo empuja a un punto libre de al lado, lo más lejos posible de MI meta
      const miMeta = metaDe(rival(lado));
      const d = distancias(st, miMeta);
      const libres = vecinos(st, o.nodo).filter(n => !ocupante(st, n) &&
        st.tablero.nodos[n].tipo !== 'meta');
      if (!libres.length) return { ok: false, error: 'no tiene a dónde ser empujado' };
      libres.sort((a, b) => (d[b] ?? 0) - (d[a] ?? 0));
      o.nodo = libres[0];
      ev.push({ t: 'empuja', uid: o.uid, nodo: o.nodo });
      break;
    }
    default: return { ok: false, error: 'placa desconocida' };
  }

  st.placas[lado].find(x => x.id === id).usada = true;
  ev.push({ t: 'placa', lado, id, uid: objetivoUid || null });
  st.log.push(...ev);
  // usar una placa NO gasta el turno: se puede usar varias y después mover
  if (id === 'estampida') revisarCercos(st, lado, ev);
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

// Qué placa conviene ahora. Se devuelve una sola por llamada; la UI/el bucle
// la aplican y vuelven a preguntar, así puede encadenar varias antes de mover.
export function placaAuto(st, lado = st.lado) {
  if (st.movio || st.fin || st.lado !== lado) return null;
  const libres = (st.placas[lado] || []).filter(x => !x.usada).map(x => x.id);
  if (!libres.length) return null;
  const mios = enTablero(st, lado);
  const otro = rival(lado);
  const dMiMeta = distancias(st, metaDe(otro));
  const dMeta = distancias(st, metaDe(lado));

  // 1) un rival a punto de anotar: empujarlo
  if (libres.includes('estampida')) {
    const amenaza = enTablero(st, otro)
      .find(e => (dMiMeta[e.nodo] ?? 99) <= mpEfectivo(st, e) + 1);
    if (amenaza) return { id: 'estampida', uid: amenaza.uid };
  }
  // 2) alguien mío a un paso de anotar: darle el Atajo
  if (libres.includes('atajo')) {
    const cerca = mios.find(p => {
      const d = dMeta[p.nodo] ?? 99;
      return d > mpEfectivo(st, p) && d <= mpEfectivo(st, p) + 1;
    });
    if (cerca) return { id: 'atajo', uid: cerca.uid };
  }
  // 3) sacar a alguien del centro si quedé con pocas piezas
  if (libres.includes('rescate') && mios.length < 3 && st.centro[lado].length) {
    return { id: 'rescate', uid: st.centro[lado][0] };
  }
  // 4) limpiar un estado feo
  if (libres.includes('hierba')) {
    const tocado = mios.find(p => (p.estados || []).length);
    if (tocado) return { id: 'hierba', uid: tocado.uid };
  }
  // 5) si voy a pelear igual, subir el daño
  const pegado = mios.find(p => enemigosAdyacentes(st, p).length);
  if (pegado) {
    if (libres.includes('rugido')) return { id: 'rugido', uid: pegado.uid };
    if (libres.includes('caparazon')) return { id: 'caparazon', uid: pegado.uid };
    if (libres.includes('instinto')) return { id: 'instinto', uid: pegado.uid };
    if (libres.includes('celo')) return { id: 'celo', uid: null };
  }
  return null;
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

  // 2) sin NADA en el tablero no hay nada que evaluar: hay que entrar
  if (!mios.length && banca.length && libres.length) {
    const r = banca.reduce((a, b) => (b.rueda.mp > a.rueda.mp ? b : a));
    return { tipo: 'entrar', uid: r.uid, hasta: libres[0] };
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

      // ¿pararme acá CERCA a alguien? Lo saca del tablero sin pelear, así que
      // vale más que casi cualquier duelo. (En este tablero los puntos tienen
      // 2 o 3 rutas, así que cercar es de verdad posible.)
      for (const n of vecinos(st, destino)) {
        const o = ocupante(st, n);
        if (!o || o.lado === lado) continue;
        const faltan = vecinos(st, o.nodo).filter(v => v !== destino).filter(v => {
          const q = ocupante(st, v);
          return !(q && q.lado === lado);
        }).length;
        if (faltan === 0) s += 70;                         // queda cercado YA
        else if (faltan === 1) s += 14;                    // a un paso
      }

      // tapar las entradas del rival: si se queda sin piezas arriba y sin
      // entradas libres, pierde por Wait Win.
      if (st.tablero.entradas[otro].includes(destino)) {
        const suyasArriba = enTablero(st, otro).length;
        s += suyasArriba === 0 ? 55 : suyasArriba === 1 ? 16 : 4;
      }

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
  // ENTRAR compite como una jugada más, no antes que todas.
  // (Antes el despliegue cortocircuitaba la evaluación: con un cerco servido
  // la IA igual metía otra pieza. Medido con una posición armada a mano.)
  for (const b of banca) {
    for (const e of libres) {
      // Las entradas están LEJOS del refugio rival, así que por distancia pura
      // entrar siempre perdía contra correr: la IA se quedaba con 1-2 piezas,
      // nadie bloqueaba y las partidas caían a 7 turnos. Con pocas piezas
      // arriba, meter vale mucho (pero menos que un cerco servido).
      let s = -(dMeta[e] ?? 99) * 10 + 10;
      s += mios.length < 3 ? 45 : -55;
      if (defender) s -= 15;                    // con el corredor encima, urge frenarlo
      if (s > mejorS) { mejorS = s; mejor = { tipo: 'entrar', uid: b.uid, hasta: e }; }
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
    for (let g = 0; g < 6; g++) {                  // placas antes de mover
      const pl = placaAuto(st);
      if (!pl) break;
      if (!usarPlaca(st, st.lado, pl.id, pl.uid).ok) break;
    }
    const a = accionAuto(st);
    if (!a) { pasarTurno(st); continue; }
    const r = jugar(st, a);
    if (!r.ok) { pasarTurno(st); }   // la IA propuso algo inválido: no se traba
  }
  if (!st.fin) st.fin = 'empate';
  return st;
}
