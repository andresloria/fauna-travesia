// ============================================================
// plates.test.mjs — LAS PLACAS del modo Travesía (las "Plates" de Duel).
// Correr:  node test/plates.test.mjs
// ============================================================
import assert from 'node:assert/strict';
import * as T from '../src/travesia/tablero.js';
import * as P from '../src/travesia/plates.js';

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { console.error('  ✗', name, '\n   ', e.message); process.exitCode = 1; }
}

const gajo = (n, color, { peso = 1, dano = 0, estrellas = 1, efectos = [] } = {}) =>
  ({ n, color, peso, dano, estrellas, efectos });
const ruedaLab = (gajos, { mp = 2, bio = null } = {}) => ({ key: 'lab', mp, bio, gajos });

function partida(placas = P.MAZO_BASE, opts = {}) {
  return T.mkPartida(['a', 'a', 'a'], ['b', 'b', 'b'], {
    abre: 'A', rng: () => 0.5, penalApertura: false, dobleEntrada: false,
    placasA: placas, placasB: placas,
    rueda: () => ruedaLab([gajo('x', 'blanco', { dano: 20 })]),
    ...opts,
  });
}
const poner = (st, uid, nodo) => {
  const p = T.pieza(st, uid); p.estado = 'tablero'; p.nodo = nodo; return p;
};

// ---------- el mazo ----------
test('el mazo respeta el presupuesto de costo 6', () => {
  assert.equal(P.mazoValido(P.MAZO_BASE), true);
  assert.ok(P.costoDe(P.MAZO_BASE) <= P.PRESUPUESTO);
});

test('un mazo que se pasa de costo no vale', () => {
  const caro = ['celo', 'caparazon', 'estampida', 'rescate'];   // 2+2+2+2 = 8
  assert.ok(P.costoDe(caro) > P.PRESUPUESTO);
  assert.equal(P.mazoValido(caro), false);
});

test('no se puede repetir una placa ni pasar de 6', () => {
  assert.equal(P.mazoValido(['rugido', 'rugido']), false);
  assert.equal(P.mazoValido(['atajo', 'hierba', 'rugido', 'celo', 'instinto', 'rescate', 'atajo']), false);
});

// ---------- cuándo se pueden usar ----------
test('las placas van al principio del turno; mover lo cierra', () => {
  const st = partida();
  poner(st, 'A0', 'p1_0');
  assert.equal(T.puedeUsarPlaca(st, 'A', 'rugido'), true);
  T.jugar(st, { tipo: 'mover', uid: 'A0', hasta: 'p2_0' });
  assert.equal(st.lado, 'B', 'mover pasa el turno');
  assert.equal(T.puedeUsarPlaca(st, 'A', 'rugido'), false, 'ya no es tu turno');
});

test('la bandera `movio` cierra las placas dentro del mismo turno', () => {
  // En este motor mover YA pasa el turno, así que `movio` solo muerde cuando
  // una acción no cierra el turno: la segunda entrada encadenada del que
  // responde. Igual se prueba la regla directa.
  const st = partida();
  poner(st, 'A0', 'p1_0');
  st.movio = true;
  assert.equal(T.puedeUsarPlaca(st, 'A', 'rugido'), false);
});

test('en la entrada doble encadenada tampoco se pueden usar placas', () => {
  const st = partida(P.MAZO_BASE, { dobleEntrada: true, abre: 'A' });
  st.lado = 'B';                                  // le toca al que responde
  const r = T.jugar(st, { tipo: 'entrar', uid: 'B0', hasta: 'eB1' });
  assert.equal(r.ok, true, r.error);
  assert.equal(st.lado, 'B', 'encadena: sigue siendo su turno');
  assert.equal(T.puedeUsarPlaca(st, 'B', 'rugido'), false, 'ya entró una: sin placas');
});

test('cada placa se usa UNA sola vez por duelo', () => {
  const st = partida();
  poner(st, 'A0', 'p1_0');
  assert.equal(T.usarPlaca(st, 'A', 'rugido', 'A0').ok, true);
  assert.equal(T.usarPlaca(st, 'A', 'rugido', 'A0').ok, false, 'no se repite');
});

test('se pueden encadenar VARIAS placas antes de mover', () => {
  const st = partida();
  poner(st, 'A0', 'p1_0');
  assert.equal(T.usarPlaca(st, 'A', 'rugido', 'A0').ok, true);
  assert.equal(T.usarPlaca(st, 'A', 'hierba', 'A0').ok, true);
  assert.equal(st.movio, false, 'usar placas no gasta el turno');
});

test('no se puede usar una placa que no está en el mazo', () => {
  const st = partida(['rugido']);
  poner(st, 'A0', 'p1_0');
  assert.equal(T.usarPlaca(st, 'A', 'celo', null).ok, false);
});

// ---------- efectos ----------
test('RUGIDO: +10 de daño a ese animal, solo este turno', () => {
  const st = partida();
  const p = poner(st, 'A0', 'p1_0');
  const antes = T.ruedaActual(st, p).gajos[0].dano;
  T.usarPlaca(st, 'A', 'rugido', 'A0');
  assert.equal(T.ruedaActual(st, p).gajos[0].dano, antes + 10);
  T.pasarTurno(st);
  assert.equal(T.ruedaActual(st, p).gajos[0].dano, antes, 'se va al pasar el turno');
});

test('ÉPOCA DE CELO: +20 a TODO el equipo', () => {
  const st = partida(['celo']);
  const a = poner(st, 'A0', 'p1_0');
  const b = poner(st, 'A1', 'p2_0');
  T.usarPlaca(st, 'A', 'celo', null);
  assert.equal(T.ruedaActual(st, a).gajos[0].dano, 40);
  assert.equal(T.ruedaActual(st, b).gajos[0].dano, 40);
});

test('ATAJO: +1 de movimiento este turno', () => {
  const st = partida(['atajo']);
  const p = poner(st, 'A0', 'p1_0');
  const antes = T.mpEfectivo(st, p);
  T.usarPlaca(st, 'A', 'atajo', 'A0');
  assert.equal(T.mpEfectivo(st, p), antes + 1);
  T.pasarTurno(st);
  assert.equal(T.mpEfectivo(st, p), antes);
});

test('HIERBA MEDICINAL: le saca los estados', () => {
  const st = partida();
  const p = poner(st, 'A0', 'p1_0');
  p.estados = [{ e: 'quemado', turnos: 3, hasta: 99 }];
  T.usarPlaca(st, 'A', 'hierba', 'A0');
  assert.deepEqual(p.estados, []);
});

test('CAPARAZÓN: aguanta un duelo perdido sin ir al centro', () => {
  const st = partida(['caparazon']);
  const a = poner(st, 'A0', 'p1_0');
  const b = poner(st, 'B0', 'p2_0');
  a.rueda = ruedaLab([gajo('flojo', 'blanco', { dano: 20 })]);
  b.rueda = ruedaLab([gajo('fuerte', 'blanco', { dano: 90 })]);
  T.usarPlaca(st, 'A', 'caparazon', 'A0');
  st.lado = 'A';
  const r = T.jugar(st, { tipo: 'atacar', uid: 'A0', objetivo: 'B0' });
  assert.equal(r.ok, true, r.error);
  assert.equal(T.pieza(st, 'A0').estado, 'tablero', 'tenía que aguantar');
  assert.ok(r.eventos.some(e => e.t === 'aguanta'));
});

test('ESTAMPIDA: empuja al rival a un punto libre de al lado', () => {
  const st = partida(['estampida']);
  poner(st, 'A0', 'p1_0');
  const b = poner(st, 'B0', 'i3_1');     // 3 rutas: tiene a dónde ir
  const antes = b.nodo;
  const r = T.usarPlaca(st, 'A', 'estampida', 'B0');
  assert.equal(r.ok, true, r.error);
  assert.notEqual(T.pieza(st, 'B0').nodo, antes, 'tenía que moverse');
  assert.ok(r.eventos.some(e => e.t === 'empuja'));
});

test('RESCATE: saca del centro a la banca', () => {
  const st = partida(['rescate']);
  const b = T.pieza(st, 'A1');
  b.estado = 'centro'; b.nodo = null; st.centro.A.push('A1');
  poner(st, 'A0', 'p1_0');
  assert.equal(T.usarPlaca(st, 'A', 'rescate', 'A1').ok, true);
  assert.equal(b.estado, 'banca');
  assert.equal(st.centro.A.includes('A1'), false);
  assert.ok(T.enBanca(st, 'A').some(x => x.uid === 'A1'), 'ya se puede meter');
});

test('la placa pide el objetivo correcto', () => {
  const st = partida();
  poner(st, 'A0', 'p1_0'); poner(st, 'B0', 'p2_0');
  assert.equal(T.usarPlaca(st, 'A', 'rugido', 'B0').ok, false, 'rugido es para los míos');
  assert.equal(T.usarPlaca(st, 'A', 'estampida', 'A0').ok, false, 'estampida es para el rival');
});

test('300 partidas con placas: todas terminan y nadie revienta', () => {
  const semilla = (s) => { let x = s >>> 0 || 1;
    return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; };
  const KEYS = ['jaguar', 'quetzal', 'tortuga', 'perezoso', 'danta', 'puma',
    'serpiente', 'cocodrilo', 'murcielago', 'venado', 'armadillo', 'mono_titi'];
  let usadas = 0;
  for (let i = 0; i < 300; i++) {
    const rng = semilla(i + 7);
    const st = T.mkPartida(KEYS.slice(0, 6), KEYS.slice(6), { rng, abre: i % 2 ? 'A' : 'B' });
    T.jugarAuto(st);
    assert.ok(st.fin, 'la partida ' + i + ' no terminó');
    usadas += st.log.filter(e => e.t === 'placa').length;
  }
  assert.ok(usadas > 0, 'la IA tiene que usar placas alguna vez');
  console.log('      (la IA usó ' + (usadas / 300).toFixed(1) + ' placas por partida)');
});

console.log('\n' + passed + ' pruebas OK\n');
