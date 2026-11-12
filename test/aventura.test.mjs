// ============================================================
// aventura.test.mjs — progresión del modo AVENTURA de Travesía.
// Correr:  node test/aventura.test.mjs
// ============================================================
import assert from 'node:assert/strict';
import * as AV from '../src/travesia/aventura.js';
import { SP, COUNTRIES } from '../src/fauna_roster.js';

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { console.error('  ✗', name, '\n   ', e.message); process.exitCode = 1; }
}
// localStorage de mentira para poder probar el guardado en node
const mem = {};
globalThis.localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; },
};
const rngFijo = () => 0.5;

test('arranca en San José con el refugio base y equipo de 6', () => {
  const p = AV.nuevoProgreso();
  assert.equal(p.prov, 0);
  assert.equal(AV.provinciaActual(p).n, 'San José');
  assert.ok(p.desbloqueados.length >= 20, 'tiene que haber animales de base');
  assert.equal(p.equipo.length, AV.EQUIPO);
  assert.equal(AV.equipoListo(p), true);
});

test('⚠️ NO comparte el guardado con la campaña de la arena', async () => {
  // la arena usa 'fauna_liga_v1'; si se pisaran, jugar el prototipo borraría
  // el progreso real de Andrés.
  const p = AV.nuevoProgreso();
  p.prov = 5; AV.guardar(p);
  assert.ok(mem['fauna_travesia_v1'], 'tiene que guardar en su propia clave');
  assert.equal(mem['fauna_liga_v1'], undefined, 'NO puede tocar la clave de la liga');
});

test('el rival trae 6 animales de la provincia', () => {
  const p = AV.nuevoProgreso();
  const pelea = AV.proximaPelea(p, rngFijo);
  assert.equal(pelea.rivales.length, AV.EQUIPO);
  for (const k of pelea.rivales) assert.ok(SP[k], k + ' no existe en el roster');
  const pool = COUNTRIES[0].pool;
  for (const k of pelea.rivales) assert.ok(pool.includes(k), k + ' no es de San José');
});

test('el cabecilla aparece después de 3 victorias', () => {
  const p = AV.nuevoProgreso();
  assert.equal(AV.tocaJefe(p), false);
  p.wins = AV.PELEAS_PARA_JEFE;
  assert.equal(AV.tocaJefe(p), true);
  assert.equal(AV.proximaPelea(p, rngFijo).esJefe, true);
});

test('ganar desbloquea un animal y suma al récord', () => {
  const p = AV.nuevoProgreso();
  const antes = p.desbloqueados.length;
  const pelea = AV.proximaPelea(p, rngFijo);
  const r = AV.registrar(p, true, pelea, rngFijo);
  assert.ok(r.desbloqueo, 'tenía que desbloquear algo');
  assert.equal(p.desbloqueados.length, antes + 1);
  assert.equal(p.record.w, 1);
  assert.equal(p.wins, 1);
});

test('perder no desbloquea ni hace retroceder', () => {
  const p = AV.nuevoProgreso();
  const antes = p.desbloqueados.length;
  const r = AV.registrar(p, false, AV.proximaPelea(p, rngFijo), rngFijo);
  assert.equal(r.desbloqueo, null);
  assert.equal(p.desbloqueados.length, antes);
  assert.equal(p.record.l, 1);
  assert.equal(p.wins, 0);
});

test('ganarle al cabecilla avanza de provincia y reinicia la cuenta', () => {
  const p = AV.nuevoProgreso();
  p.wins = AV.PELEAS_PARA_JEFE;
  const pelea = AV.proximaPelea(p, rngFijo);
  const r = AV.registrar(p, true, pelea, rngFijo);
  assert.equal(r.avanzo, true);
  assert.equal(p.prov, 1);
  assert.equal(p.wins, 0);
  assert.equal(AV.provinciaActual(p).n, 'Alajuela');
});

test('la campaña entera se puede terminar y avisa una sola vez', () => {
  const p = AV.nuevoProgreso();
  let avisos = 0;
  for (let i = 0; i < 400 && !p.ganoJuego; i++) {
    const pelea = AV.proximaPelea(p, Math.random);
    const r = AV.registrar(p, true, pelea, Math.random);
    if (r.ganoJuego) avisos++;
  }
  assert.equal(p.ganoJuego, true, 'tenía que poder terminarse');
  assert.equal(avisos, 1, 'el aviso de fin va una sola vez');
  assert.equal(AV.provinciaActual(p).n, 'Monteverde');
});

test('la dificultad sube: más adelante salen rivales más raros', () => {
  const RANK = { comun:0, raro:1, ultrararo:2, legendario:3, extinto:4, mitico:4 };
  const dureza = (prov, jefe) => {
    const p = AV.nuevoProgreso(); p.prov = prov;
    let s = 0, n = 200;
    for (let i = 0; i < n; i++)
      for (const k of AV.rivalesDe(p, jefe, Math.random)) s += RANK[SP[k]?.rarity] ?? 0;
    return s / n;
  };
  assert.ok(dureza(6, false) > dureza(0, false), 'la última provincia tiene que ser más dura');
  assert.ok(dureza(3, true) > dureza(3, false), 'el cabecilla tiene que ser más duro');
});

test('cargar lo guardado devuelve el mismo progreso', () => {
  const p = AV.nuevoProgreso();
  p.prov = 3; p.wins = 2; p.equipo = p.desbloqueados.slice(0, 6);
  AV.guardar(p);
  const q = AV.cargar();
  assert.equal(q.prov, 3);
  assert.equal(q.wins, 2);
  assert.equal(q.equipo.length, 6);
  AV.borrar();
});

console.log('\n' + passed + ' pruebas OK\n');
