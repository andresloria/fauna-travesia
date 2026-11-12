// ============================================================
// travesia.test.mjs — pruebas del motor del modo TRAVESÍA (estilo Pokémon Duel).
// Correr:  node test/travesia.test.mjs
//
// ⚠️ Igual que en la arena: las pruebas de MECÁNICA no nombran habilidades del
// documento (se rompen con cada regeneración de kits y no prueban el motor).
// Acá se usan RUEDAS DE LABORATORIO de un solo gajo, que además hacen el giro
// determinista sin tener que falsear el rng.
// ============================================================
import assert from 'node:assert/strict';
import * as T from '../src/travesia/tablero.js';
import * as R from '../src/travesia/rueda.js';
import { SP } from '../src/fauna_roster.js';

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { console.error('  ✗', name, '\n   ', e.message); process.exitCode = 1; }
}

// ---------- utilidades de laboratorio ----------
const gajo = (n, color, { peso = 1, dano = 0, estrellas = 1, efectos = [] } = {}) =>
  ({ n, color, peso, dano, estrellas, efectos });
const ruedaLab = (gajos, { mp = 2, bio = null } = {}) => ({ key: 'lab', mp, bio, gajos });

// un pasillo recto, que es donde el BLOQUEO se puede probar sin rutas alternas:
//   metaA - eA - n1 - n2 - n3 - eB - metaB
function pasillo() {
  const nodos = {};
  const add = (id, y, tipo = 'normal', bio = null) =>
    (nodos[id] = { id, x: 0, y, tipo, bio, vecinos: [] });
  const une = (a, b) => { nodos[a].vecinos.push(b); nodos[b].vecinos.push(a); };
  ['metaA', 'eA', 'n1', 'n2', 'n3', 'eB', 'metaB'].forEach((id, i) =>
    add(id, i, id.startsWith('meta') ? 'meta' : id.startsWith('e') ? 'entrada' : 'normal'));
  une('metaA', 'eA'); une('eA', 'n1'); une('n1', 'n2');
  une('n2', 'n3'); une('n3', 'eB'); une('eB', 'metaB');
  return { nodos, filas: 3, cols: 1, entradas: { A: ['eA'], B: ['eB'] } };
}

// partida de laboratorio: se le inyecta la rueda de cada pieza por uid
function partidaLab(ruedas, opts = {}) {
  const st = T.mkPartida(['a0', 'a1'], ['b0', 'b1'], {
    tablero: opts.tablero || pasillo(),
    abre: opts.abre || 'A',
    rng: opts.rng || (() => 0.5),
    rueda: () => ruedaLab([gajo('vacío', 'blanco', { dano: 1 })]),
  });
  for (const [uid, r] of Object.entries(ruedas)) T.pieza(st, uid).rueda = r;
  return st;
}
const poner = (st, uid, nodo) => {
  const p = T.pieza(st, uid); p.estado = 'tablero'; p.nodo = nodo; return p;
};

// ---------- tablero ----------
test('el tablero estándar tiene refugios y 2 entradas por lado', () => {
  const t = T.mkTablero();
  assert.ok(t.nodos.metaA && t.nodos.metaB, 'faltan refugios');
  assert.equal(t.entradas.A.length, 2);
  assert.equal(t.entradas.B.length, 2);
  assert.ok(t.nodos.metaB.vecinos.length >= 1, 'el refugio tiene que ser alcanzable');
});

test('cada lado busca el refugio del OTRO', () => {
  assert.equal(T.metaDe('A'), 'metaB');
  assert.equal(T.metaDe('B'), 'metaA');
});

test('alcanzables respeta los puntos de movimiento', () => {
  const st = partidaLab({ A0: ruedaLab([gajo('x', 'blanco', { dano: 1 })], { mp: 2 }) });
  poner(st, 'A0', 'eA');
  const al = T.alcanzables(st, 'A0');
  assert.ok(al.includes('n1') && al.includes('n2'), 'debería llegar a 2 nodos');
  assert.ok(!al.includes('n3'), 'n3 está a 3 pasos, con mp 2 no llega');
});

test('una pieza BLOQUEA: no se la pisa ni se pasa por encima', () => {
  const st = partidaLab({ A0: ruedaLab([gajo('x', 'blanco', { dano: 1 })], { mp: 3 }) });
  poner(st, 'A0', 'eA');
  poner(st, 'B0', 'n1');                       // enemigo tapando el pasillo
  const al = T.alcanzables(st, 'A0');
  assert.ok(!al.includes('n1'), 'no se pisa al que bloquea');
  assert.ok(!al.includes('n2'), 'ni se pasa por encima para seguir');
});

test('no se puede mover fuera de alcance', () => {
  const st = partidaLab({ A0: ruedaLab([gajo('x', 'blanco', { dano: 1 })], { mp: 1 }) });
  poner(st, 'A0', 'eA');
  const r = T.jugar(st, { tipo: 'mover', uid: 'A0', hasta: 'n3' });
  assert.equal(r.ok, false);
});

test('entrar: solo en TU entrada y si está libre', () => {
  const st = partidaLab({});
  assert.equal(T.jugar(st, { tipo: 'entrar', uid: 'A0', hasta: 'eB' }).ok, false, 'esa es la entrada rival');
  assert.equal(T.jugar(st, { tipo: 'entrar', uid: 'A0', hasta: 'eA' }).ok, true);
  st.lado = 'A';
  assert.equal(T.jugar(st, { tipo: 'entrar', uid: 'A1', hasta: 'eA' }).ok, false, 'entrada ocupada');
});

test('llegar al refugio rival GANA la partida', () => {
  const st = partidaLab({ A0: ruedaLab([gajo('x', 'blanco', { dano: 1 })], { mp: 1 }) });
  poner(st, 'A0', 'eB');
  const r = T.jugar(st, { tipo: 'mover', uid: 'A0', hasta: 'metaB' });
  assert.equal(r.ok, true);
  assert.equal(st.fin, 'A');
});

test('no se ataca a distancia: hay que estar adyacente', () => {
  const st = partidaLab({});
  poner(st, 'A0', 'eA'); poner(st, 'B0', 'n3');
  const r = T.jugar(st, { tipo: 'atacar', uid: 'A0', objetivo: 'B0' });
  assert.equal(r.ok, false);
});

test('el turno alterna después de cada acción', () => {
  const st = partidaLab({}, { abre: 'A' });
  T.jugar(st, { tipo: 'entrar', uid: 'A0', hasta: 'eA' });
  assert.equal(st.lado, 'B');
});

// ---------- duelos ----------
const duelo = (gA, gB) => {
  const st = partidaLab({ A0: ruedaLab([gA]), B0: ruedaLab([gB]) });
  poner(st, 'A0', 'n1'); poner(st, 'B0', 'n2');
  st.lado = 'A';
  const r = T.jugar(st, { tipo: 'atacar', uid: 'A0', objetivo: 'B0' });
  assert.equal(r.ok, true, r.error);
  return { st, ev: r.eventos.find(e => e.t === 'duelo') };
};

test('el FALLO pierde contra todo', () => {
  const { st, ev } = duelo(gajo('fallo', 'rojo'), gajo('golpe', 'blanco', { dano: 20 }));
  assert.equal(ev.ganador, 'B');
  assert.equal(T.pieza(st, 'A0').estado, 'banca', 'el que falla cae');
});

test('dos FALLOS no hacen nada', () => {
  const { st, ev } = duelo(gajo('fallo', 'rojo'), gajo('fallo', 'rojo'));
  assert.equal(ev.ganador, null);
  assert.equal(T.pieza(st, 'A0').estado, 'tablero');
  assert.equal(T.pieza(st, 'B0').estado, 'tablero');
});

test('el BLANCO más fuerte noquea al más débil', () => {
  const { st } = duelo(gajo('fuerte', 'blanco', { dano: 30 }), gajo('flojo', 'blanco', { dano: 10 }));
  assert.equal(T.pieza(st, 'B0').estado, 'banca');
  assert.equal(T.pieza(st, 'A0').estado, 'tablero');
});

test('blanco contra blanco con el mismo daño: no cae nadie', () => {
  const { st, ev } = duelo(gajo('a', 'blanco', { dano: 20 }), gajo('b', 'blanco', { dano: 20 }));
  assert.equal(ev.ganador, null);
  assert.equal(T.pieza(st, 'A0').estado, 'tablero');
  assert.equal(T.pieza(st, 'B0').estado, 'tablero');
});

test('la ESQUIVA (azul) frena al blanco, pero no lo saca del tablero', () => {
  const { st, ev } = duelo(gajo('esquiva', 'azul'), gajo('golpe', 'blanco', { dano: 40 }));
  assert.equal(ev.ganador, 'A');
  assert.equal(ev.tipo, 'nada');
  assert.equal(T.pieza(st, 'B0').estado, 'tablero', 'esquivar no mata al otro');
});

test('el DORADO perfora la esquiva', () => {
  const { st, ev } = duelo(gajo('esquiva', 'azul'), gajo('dorado', 'dorado', { dano: 25 }));
  assert.equal(ev.ganador, 'B');
  assert.equal(T.pieza(st, 'A0').estado, 'banca');
});

test('el MORADO gana al blanco y deja estado, sin noquear', () => {
  const g = gajo('veneno', 'morado', { efectos: [{ t: 'danoTurnos', v: 5, turnos: 3, obj: 'enemigo' }] });
  const { st, ev } = duelo(g, gajo('golpe', 'blanco', { dano: 40 }));
  assert.equal(ev.ganador, 'A');
  assert.equal(ev.tipo, 'estado');
  assert.equal(T.pieza(st, 'B0').estado, 'tablero', 'el estado no saca la pieza');
  assert.equal(T.pieza(st, 'B0').efectos.length, 1);
});

test('morado contra morado: desempatan las estrellas', () => {
  const { ev } = duelo(gajo('m1', 'morado', { estrellas: 3 }), gajo('m2', 'morado', { estrellas: 1 }));
  assert.equal(ev.ganador, 'A');
});

test('el DORADO tiene prioridad sobre el morado', () => {
  const { ev } = duelo(gajo('d', 'dorado', { dano: 10 }), gajo('m', 'morado', { estrellas: 3 }));
  assert.equal(ev.ganador, 'A');
});

test('el que cae va a la BANCA y vuelve varios turnos después', () => {
  const { st } = duelo(gajo('fuerte', 'blanco', { dano: 30 }), gajo('flojo', 'blanco', { dano: 10 }));
  const b = T.pieza(st, 'B0');
  assert.equal(b.estado, 'banca');
  assert.equal(b.nodo, null);
  assert.ok(b.vuelveEn > st.turno, 'tiene que esperar para volver');
});

// ---------- rueda ----------
test('toda especie arma una rueda con sus gajos y su mp', () => {
  const r = R.ruedaDe('jaguar');
  assert.ok(r.gajos.length >= 4, 'kit + esquiva + fallo');
  assert.ok(r.mp >= 1 && r.mp <= 3);
  assert.ok(r.gajos.some(g => g.color === 'azul'), 'siempre hay esquiva');
  assert.ok(r.gajos.some(g => g.color === 'rojo'), 'siempre hay fallo');
});

test('LAS 136 especies pueden noquear: todas tienen un gajo con daño', () => {
  // Si una rueda no pega, su pieza no despeja bloqueos y el tablero se traba:
  // así fue como el prototipo llegó a 68% de empates la primera vez.
  const sinDano = Object.keys(SP).filter(k => R.ruedaDe(k).gajos.every(g => g.dano === 0));
  assert.deepEqual(sinDano, [], 'estas especies no pueden sacar a nadie del tablero');
});

test('toda especie tiene rueda y mp válidos', () => {
  const malas = Object.keys(SP).filter(k => {
    const r = R.ruedaDe(k);
    return !(r.mp >= 1 && r.mp <= 3) || r.gajos.length < 2 || R.pesoTotal(r) <= 0;
  });
  assert.deepEqual(malas, []);
});

test('lo caro sale menos: mayor costo y recarga = gajo más chico', () => {
  const barata = { n: 'a', costo: ['comodin'], recarga: 0, efectos: [{ t: 'dano', v: 10, obj: 'enemigo' }] };
  const cara = { n: 'b', costo: ['bosque', 'bosque'], recarga: 6, efectos: [{ t: 'dano', v: 60, obj: 'enemigo' }] };
  assert.ok(R.pesoDe(barata) > R.pesoDe(cara), 'la barata tiene que salir más seguido');
});

test('en su bioma el animal falla la mitad', () => {
  const r = R.ruedaDe('jaguar');
  const fallo = (x) => x.gajos.find(g => g.color === 'rojo').peso;
  assert.ok(fallo(R.ruedaEnBioma(r, r.bio)) < fallo(r), 'en su hábitat falla menos');
  assert.equal(fallo(R.ruedaEnBioma(r, 'otro')), fallo(r), 'fuera de su hábitat no cambia');
});

test('las probabilidades de la rueda suman 100%', () => {
  const p = R.probabilidades(R.ruedaDe('danta'));
  const suma = p.reduce((s, x) => s + x.pct, 0);
  assert.ok(Math.abs(suma - 100) < 0.5, 'suman ' + suma);
});

test('evDuelo reparte toda la probabilidad', () => {
  const ev = R.evDuelo(R.ruedaDe('jaguar'), R.ruedaDe('perezoso'));
  assert.ok(Math.abs(ev.koGana + ev.koPierde + ev.nada - 1) < 1e-9);
});

// ---------- partidas enteras ----------
test('100 partidas automáticas: todas terminan y ninguna revienta', () => {
  const semilla = (s) => { let x = s >>> 0 || 1;
    return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; };
  const KEYS = ['jaguar', 'quetzal', 'tortuga', 'perezoso', 'danta', 'puma',
    'serpiente', 'cocodrilo', 'murcielago', 'venado', 'armadillo', 'mono_titi'];
  let empates = 0;
  for (let i = 0; i < 100; i++) {
    const rng = semilla(i + 1);
    const st = T.mkPartida(KEYS.slice(0, 6), KEYS.slice(6), { rng, abre: i % 2 ? 'A' : 'B' });
    T.jugarAuto(st);
    assert.ok(st.fin, 'la partida ' + i + ' no terminó');
    if (st.fin === 'empate') empates++;
    for (const p of st.piezas) {
      if (p.estado === 'tablero') assert.ok(p.nodo, 'pieza en tablero sin nodo');
      else assert.equal(p.nodo, null, 'pieza fuera del tablero con nodo');
    }
  }
  assert.ok(empates < 10, 'demasiados empates: ' + empates + '/100 (se traba el tablero)');
});

console.log('\n' + passed + ' pruebas OK\n');
