// ============================================================
// engine.test.mjs — pruebas del motor (lógica pura).
// Correr con:  npm test    (o)    node test/engine.test.mjs
// Esto demuestra el valor de tener la lógica separada: se puede
// probar sin navegador. Mismo motor que correrá en el servidor.
// ============================================================

import assert from 'node:assert/strict';
import * as E from '../src/engine.js';
import { COUNTRIES, SECRET, RULES } from '../src/data.js';

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { console.error('  ✗', name, '\n   ', e.message); process.exitCode = 1; }
}

console.log('\nFAUNA · Travesía — tests del motor\n');

test('un animal sube de nivel y evoluciona en Nv3 y Nv6', () => {
  const a = E.mkAnimal('jaguar');           // base 5/4
  E.setLevel(a, 6);
  assert.equal(a.level, 6);
  assert.equal(a.evo, 2, 'debe haber evolucionado 2 veces (Nv3 y Nv6)');
  assert.ok(a.atk > 5 && a.hp > 4, 'sus stats deben haber crecido');
});

test('todas las especies de cada país existen', () => {
  for (const c of COUNTRIES)
    for (const k of c.pool)
      assert.ok(E.SP[k], `falta la especie "${k}" del país ${c.n}`);
});

test('todo mapa generado tiene ruta del inicio al aeropuerto', () => {
  for (let ci = 0; ci < COUNTRIES.length; ci++) {
    const country = COUNTRIES[ci];
    for (let t = 0; t < 100; t++) {
      const map = E.generateMap(country);
      const start = map.nodesById[map.startId];
      const seen = new Set(); const q = [start]; let ok = false;
      while (q.length) {
        const n = q.shift();
        if (n.type === 'airport') { ok = true; break; }
        if (seen.has(n.id)) continue; seen.add(n.id);
        n.children.forEach(c => q.push(c));
      }
      assert.ok(ok, `mapa sin ruta al aeropuerto en ${country.n}`);
    }
  }
});

test('el combate siempre termina con un resultado válido', () => {
  for (let i = 0; i < 500; i++) {
    const c = COUNTRIES[E.rnd(COUNTRIES.length)];
    const A = E.genEnemy(c, 1 + E.rnd(4), 1 + E.rnd(5));
    const B = E.genEnemy(c, 1 + E.rnd(4), 1 + E.rnd(5));
    const { result, steps } = E.fight(A, B);
    assert.ok(['W', 'L', 'T'].includes(result));
    assert.ok(Array.isArray(steps));
  }
});

test('la dificultad escala con la profundidad (no con el país)', () => {
  const avg = (f, d) => { let s = 0; for (let i = 0; i < 2000; i++) s += f(d); return s / 2000; };
  assert.ok(avg(E.retSize, 0) < avg(E.retSize, 6), 'los retadores deben crecer');
  assert.ok(E.enemyLevel(5, false) > E.enemyLevel(0, false), 'el nivel debe subir por profundidad');
});

test('drawCountry sortea sin repetir hasta agotar la bolsa', () => {
  let bag = null; const seen = new Set();
  for (let i = 0; i < COUNTRIES.length; i++) {
    const d = E.drawCountry(bag); bag = d.bag;
    assert.ok(d.country && d.country.pool, 'devuelve un país válido');
    seen.add(d.idx);
  }
  assert.equal(seen.size, COUNTRIES.length, 'recorre todos los países antes de repetir');
});

test('drawCountry no repite el país que acaba de salir', () => {
  for (let t = 0; t < 200; t++) {
    const first = E.drawCountry(null);
    const next = E.drawCountry(first.bag, first.idx);
    assert.notEqual(next.idx, first.idx, 'no debe repetir el último país');
  }
});

test('efecto Primer golpe: tumba sin recibir daño', () => {
  const A = [{ uid: 1, atk: 5, hp: 3, ab: 'first' }];
  const B = [{ uid: 2, atk: 9, hp: 3, ab: null }];
  const { result, steps } = E.fight(A, B);
  assert.equal(result, 'W', 'el de primer golpe gana');
  assert.equal(steps[0].aHp, 3, 'no recibió daño porque tumbó al rival primero');
});

test('velocidad: el más rápido pega primero y puede tumbar sin recibir daño', () => {
  const A = [{ uid: 1, atk: 5, hp: 3, spd: 9, ab: null }];   // rápido
  const B = [{ uid: 2, atk: 9, hp: 3, spd: 1, ab: null }];   // lento pero fuerte
  const { result, steps } = E.fight(A, B);
  assert.equal(result, 'W', 'el más rápido gana el intercambio');
  assert.equal(steps[0].aHp, 3, 'no recibió daño porque pegó primero y tumbó al lento');
});

test('mkAnimal trae velocidad (spd)', () => {
  assert.ok(typeof E.mkAnimal('jaguar').spd === 'number', 'el animal tiene spd numérico');
});

test('efecto Escudo: absorbe el primer golpe', () => {
  const A = [{ uid: 1, atk: 2, hp: 5, ab: 'shield' }];
  const B = [{ uid: 2, atk: 10, hp: 1, ab: null }];
  const { result } = E.fight(A, B);
  assert.equal(result, 'W', 'el escudo absorbe el golpe letal y gana');
});

test('efecto Veneno: rompe el empate a favor del portador', () => {
  const A = [{ uid: 1, atk: 1, hp: 3, ab: 'poison' }];
  const B = [{ uid: 2, atk: 1, hp: 3, ab: null }];
  assert.equal(E.fight(A, B).result, 'W', 'con stats iguales, el veneno decide');
});

test('todas las especies tienen un efecto válido', () => {
  for (const k in E.SP) assert.ok(E.ABILITIES[E.SP[k].ab], `especie ${k} sin efecto válido`);
});

test('los legendarios son leg:true y NO están en ningún pool', () => {
  for (const c of COUNTRIES) {
    if (!c.legend) continue;
    assert.ok(E.SP[c.legend] && E.SP[c.legend].leg, `legendario ${c.legend} de ${c.n} inválido`);
  }
  for (const c of COUNTRIES)
    for (const k of c.pool)
      assert.ok(!E.SP[k].leg, `un legendario (${k}) no debe estar en el pool de ${c.n}`);
});

test('rollWild nunca da legendario en un país sin legendario', () => {
  const noLeg = COUNTRIES.find(c => !c.legend);
  for (let i = 0; i < 3000; i++)
    assert.ok(!E.rollWild(noLeg, 'agua', 2).leg, 'país sin legendario no debe soltar legendarios');
});

test('rollWild puede dar el legendario del país (raro pero posible)', () => {
  const c = COUNTRIES.find(x => x.legend);
  let seen = false;
  for (let i = 0; i < 20000 && !seen; i++) if (E.rollWild(c, 'sabana', 2).leg) seen = true;
  assert.ok(seen, 'con suficientes intentos debe aparecer el legendario del país');
});

test('traficantes: NO aparecen al inicio (prov.1-3), sí más adelante (prov.4+)', () => {
  const has = (depth) => {
    for (let i = 0; i < 500; i++) {
      const m = E.generateMap(COUNTRIES[0], depth);
      if (Object.values(m.nodesById).some(n => n.type === 'cazador')) return true;
    }
    return false;
  };
  assert.ok(!has(0), 'sin traficantes en la provincia 1');
  assert.ok(!has(2), 'sin traficantes en la provincia 3');
  assert.ok(has(3), 'aparecen traficantes desde la provincia 4');
});

test('traficantes: nivel de furtivo normal (no más fuertes) y dan objeto raro', () => {
  for (const d of [3, 4, 6]) assert.equal(E.poacherLevel(d), E.enemyLevel(d, false), 'mismo nivel que un furtivo');
  assert.ok(E.RARE_ITEMS && E.RARE_ITEMS.length > 0, 'hay objetos raros');
});

test('tamaño de equipo: rampa por provincia (furtivos depth+1, jefe depth+2, tope 5)', () => {
  const exp = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 5], [5, 5], [5, 5]];
  for (let d = 0; d < 7; d++) {
    assert.equal(E.retSize(d), exp[d][0], `furtivos provincia ${d + 1}`);
    assert.equal(E.poacherSize(d), exp[d][0], `traficantes provincia ${d + 1}`);
    assert.equal(E.bossSize(d), exp[d][1], `cabecilla provincia ${d + 1}`);
  }
});

test('intercambio: el animal ofrecido es 2-3 niveles más alto y no legendario', () => {
  for (let i = 0; i < 500; i++) {
    const maxLv = 1 + E.rnd(8);
    const a = E.genTrade(maxLv);
    assert.ok(a.level === maxLv + 2 || a.level === maxLv + 3, `nivel ofrecido fuera de rango (${a.level} vs ${maxLv})`);
    assert.ok(!a.leg, 'el intercambio no debe ofrecer legendarios');
  }
});

test('aparecen nodos de intercambio en el mapa', () => {
  let found = false;
  for (let i = 0; i < 400 && !found; i++) {
    const m = E.generateMap(COUNTRIES[0]);
    if (Object.values(m.nodesById).some(n => n.type === 'intercambio')) found = true;
  }
  assert.ok(found, 'debería generarse algún nodo de intercambio');
});

test('Costa Rica: 7 provincias y fauna tica', () => {
  assert.equal(COUNTRIES.length, 7, 'las 7 provincias');
  assert.equal(RULES.RUN_LENGTH, 7, 'la campaña es de 7 provincias');
  assert.ok(E.SP.quetzal && E.SP.perezoso && E.SP.lapa, 'incluye fauna tica');
});

test('final Monteverde: se abre tras las 7 provincias con el Quetzal Dorado', () => {
  assert.ok(SECRET && SECRET.secret, 'existe el final');
  assert.equal(SECRET.legend, 'quetzaldorado', 'su legendario es el Quetzal Dorado');
  assert.ok(E.SP[SECRET.legend] && E.SP[SECRET.legend].leg, 'el Quetzal Dorado es legendario');
  const m = E.generateMap(SECRET);
  assert.ok(Object.values(m.nodesById).some(n => n.type === 'airport'), 'Monteverde tiene jefe final');
});

console.log(`\n${passed} pruebas OK\n`);
