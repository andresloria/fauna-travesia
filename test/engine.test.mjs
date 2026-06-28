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

const finalHp = (steps, uid) => steps[steps.length - 1].hp[uid];

test('efecto Primer golpe: tumba sin recibir daño', () => {
  const A = [{ uid: 1, atk: 5, hp: 3, ab: 'first' }];
  const B = [{ uid: 2, atk: 9, hp: 3, ab: null }];
  const { result, steps } = E.fight(A, B);
  assert.equal(result, 'W', 'el de primer golpe gana');
  assert.equal(finalHp(steps, 1), 3, 'no recibió daño porque tumbó al rival primero');
});

test('velocidad: el más rápido pega primero y puede tumbar sin recibir daño', () => {
  const A = [{ uid: 1, atk: 5, hp: 3, spd: 9, ab: null }];   // rápido
  const B = [{ uid: 2, atk: 9, hp: 3, spd: 1, ab: null }];   // lento pero fuerte
  const { result, steps } = E.fight(A, B);
  assert.equal(result, 'W', 'el más rápido gana el intercambio');
  assert.equal(finalHp(steps, 1), 3, 'no recibió daño porque pegó primero y tumbó al lento');
});

test('Primer golpe: prioridad UNA vez por pelea, luego manda la velocidad', () => {
  const A = [{ uid: 1, atk: 1, hp: 30, spd: 1, ab: 'first' }];  // lento, pero con prioridad
  const B = [{ uid: 2, atk: 1, hp: 30, spd: 5, ab: null }];     // rápido
  const strikes = E.fight(A, B).steps.filter(s => s.kind === 'strike');
  assert.equal(strikes[0].attacks[0].from, 1, 'la PRIMERA acción es del de primer golpe');
  assert.ok(strikes.some((s, i) => i > 0 && s.attacks[0].from === 2), 'luego el más rápido actúa antes');
});

test('orden: a igual velocidad pega primero el de MENOS ataque', () => {
  const A = [{ uid: 1, atk: 2, hp: 3, spd: 5, ab: null }];   // menos ataque
  const B = [{ uid: 2, atk: 9, hp: 3, spd: 5, ab: null }];   // más ataque, misma velocidad
  const { steps } = E.fight(A, B);
  assert.equal(steps[0].attacks[0].from, 1, 'abre el de menos ataque, no atacan a la vez');
  assert.equal(steps[0].attacks.length, 1, 'cada paso es UN solo atacante (no simultáneo)');
});

test('habilidad: un animal muy ágil a veces ESQUIVA el golpe', () => {
  let dodges = 0;
  for (let i = 0; i < 300; i++) {
    const A = [{ uid: 1, atk: 3, hp: 50, spd: 9, hab: 0 }];
    const B = [{ uid: 2, atk: 1, hp: 50, spd: 1, hab: 8 }];   // mucha habilidad
    if (E.fight(A, B).steps.some(s => s.kind === 'strike' && (s.attacks[0].fx || []).includes('dodge'))) dodges++;
  }
  assert.ok(dodges > 0, 'con habilidad alta debería esquivar alguna vez');
});

test('regenera: al ATACAR cura a un aliado herido', () => {
  const A = [{ uid: 1, atk: 1, hp: 12, spd: 9, ab: 'heal', level: 8 },
             { uid: 2, atk: 1, hp: 12, spd: 9, ab: null }];
  const B = [{ uid: 9, atk: 4, hp: 60, spd: 5, ab: null }];
  const { steps } = E.fight(A, B);
  let healed = false, prev = {};
  for (const s of steps) {
    for (const u of [1, 2]) if (prev[u] !== undefined && s.hp[u] > prev[u]) healed = true;
    prev = s.hp;
  }
  assert.ok(healed, 'el de regenerar subió la vida de un aliado al atacar');
});

test('Escudo = TAUNT: hay que pegarle al del escudo, no al débil', () => {
  const A = [{ uid: 1, atk: 3, hp: 8, spd: 5, ab: null }];
  const B = [{ uid: 2, atk: 1, hp: 6, spd: 1, ab: 'shield' },
             { uid: 3, atk: 1, hp: 1, spd: 1, ab: null }];
  const first = E.fight(A, B).steps.find(s => s.kind === 'strike');
  const atk = first.attacks.find(a => a.from === 1);
  assert.equal(atk.to, 2, 'el atacante apunta al escudo (taunt), no al de 1 ❤');
});

test('combate por turnos: 3 contra 1 lo gana el trío', () => {
  const A = [{ uid: 1, atk: 2, hp: 4, spd: 5 }, { uid: 2, atk: 2, hp: 4, spd: 5 }, { uid: 3, atk: 2, hp: 4, spd: 5 }];
  const B = [{ uid: 9, atk: 3, hp: 5, spd: 5 }];
  assert.equal(E.fight(A, B).result, 'W', '3 vs 1 lo gana el trío');
});

test('mkAnimal trae velocidad (spd)', () => {
  assert.ok(typeof E.mkAnimal('jaguar').spd === 'number', 'el animal tiene spd numérico');
});

test('efecto Escudo: el primer golpe le hace solo la MITAD', () => {
  const A = [{ uid: 1, atk: 2, hp: 8, spd: 1, ab: 'shield' }];
  const B = [{ uid: 2, atk: 10, hp: 1, spd: 9, ab: null }];   // más rápido: pega primero
  const { result, steps } = E.fight(A, B);
  const hitOnA = steps.find(s => s.kind === 'strike' && s.attacks[0].to === 1);
  assert.equal(hitOnA.hp[1], 3, 'el escudo redujo 10 a la mitad (5): 8 - 5 = 3');
  assert.equal(result, 'W', 'sobrevive el golpe a medias y después gana');
});

test('efecto Veneno: rompe el empate a favor del portador', () => {
  const A = [{ uid: 1, atk: 1, hp: 3, ab: 'poison' }];
  const B = [{ uid: 2, atk: 1, hp: 3, ab: null }];
  assert.equal(E.fight(A, B).result, 'W', 'con stats iguales, el veneno decide');
});

test('todas las especies tienen un efecto válido', () => {
  for (const k in E.SP) assert.ok(E.ABILITIES[E.SP[k].ab], `especie ${k} sin efecto válido`);
});

test('rareza: cada especie tiene rareza válida; legendarios = leg:true + 2 habilidades', () => {
  const RAR = new Set(['comun', 'raro', 'ultrararo', 'legendario', 'extinto']);
  for (const k in E.SP) {
    const v = E.SP[k];
    assert.ok(RAR.has(v.rarity), `especie ${k} sin rareza válida (${v.rarity})`);
    if (v.rarity === 'legendario') { assert.ok(v.leg && v.ab2, `legendario ${k} debe ser leg + tener ab2`); }
    else if (k !== 'sapo_dorado') { assert.ok(!v.ab2, `solo los legendarios tienen 2 habilidades (${k})`); }
  }
});

test('rareza: los comunes aparecen MUCHO más que los legendarios en el rescate', () => {
  const c = COUNTRIES.find(x => x.pool.some(k => E.SP[k].rarity === 'legendario')) || COUNTRIES[0];
  let comun = 0, legend = 0;
  for (let i = 0; i < 4000; i++) {
    for (const a of E.genWildChoices(c, 'bosque', 3, 3)) {
      if (a.rarity === 'comun') comun++; else if (a.rarity === 'legendario') legend++;
    }
  }
  assert.ok(comun > legend * 10, `comunes (${comun}) deben superar por mucho a legendarios (${legend})`);
});

test('starters: perro/gato/comemaíz existen, son básicos y NO están en pools', () => {
  for (const k of ['perro', 'gato', 'comemaiz']) {
    assert.ok(E.SP[k] && E.SP[k].starter, `falta el starter ${k}`);
    for (const c of COUNTRIES) assert.ok(!c.pool.includes(k), `el starter ${k} no debe estar en pools`);
  }
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
  assert.ok(SECRET.pool.includes('quetzaldorado'), 'el Quetzal Dorado aparece en Monteverde');
  assert.ok(E.SP.quetzaldorado && E.SP.quetzaldorado.leg, 'el Quetzal Dorado es legendario');
  const m = E.generateMap(SECRET);
  assert.ok(Object.values(m.nodesById).some(n => n.type === 'airport'), 'Monteverde tiene jefe final');
});

test('mapa ramificado: inicio + 5 filas de 3 + cabecilla; última fila fija', () => {
  for (let t = 0; t < 80; t++) {
    const m = E.generateMap(COUNTRIES[0], 2);
    assert.equal(m.rows.length, E.MAP_ROWS + 2, 'inicio + 5 filas + cabecilla');
    assert.equal(m.rows[0][0].type, 'start');
    assert.equal(m.rows[E.MAP_ROWS + 1][0].type, 'airport', 'el último es el cabecilla');
    for (let r = 1; r <= E.MAP_ROWS; r++) assert.equal(m.rows[r].length, 3, `fila ${r} con 3 opciones`);
    const lastTypes = m.rows[E.MAP_ROWS].map(n => n.type);
    assert.ok(lastTypes.includes('descanso'), 'última fila incluye descanso');
    assert.ok(lastTypes.includes('cazador') || lastTypes.includes('combate'), 'última fila incluye un cazador/furtivo');
    // el inicio ofrece 3 rutas
    assert.equal(m.rows[0][0].children.length, 3, 'desde el inicio elegís entre 3');
  }
});

test('los atacantes (combate/cazador) solo de la fila 3 en adelante', () => {
  for (let t = 0; t < 200; t++) {
    const m = E.generateMap(COUNTRIES[0], 5);   // depth alto: permite cazador
    for (const n of m.seq)
      if (n.type === 'combate' || n.type === 'cazador')
        assert.ok(n.r > E.SAFE_ROWS, `atacante en fila ${n.r}, debería ser > ${E.SAFE_ROWS}`);
  }
});

test('aparecen casillas SORPRESA y de animal salvaje', () => {
  let surp = false, salv = false;
  for (let t = 0; t < 300 && !(surp && salv); t++) {
    for (const n of E.generateMap(COUNTRIES[0], 0).seq) {
      if (n.type === 'sorpresa') surp = true;
      if (n.type === 'salvaje') salv = true;
    }
  }
  assert.ok(surp, 'debería haber casillas sorpresa');
  assert.ok(salv, 'debería haber casillas de animal salvaje');
});

test('jefe de zona: un animal muy fuerte y de nivel alto', () => {
  for (let d = 0; d < 5; d++) {
    const [boss] = E.genZoneBoss(COUNTRIES[5], d);
    assert.ok(boss.boss, 'marcado como jefe');
    assert.ok(boss.level > E.enemyLevel(d, true), 'más nivel que un cabecilla normal');
  }
});

test('genWildChoices ofrece 3 animales válidos y DISTINTOS', () => {
  for (const c of COUNTRIES) for (const bio of ['bosque', 'sabana', 'agua', 'montana']) {
    const ch = E.genWildChoices(c, bio, 2, 3);
    assert.equal(ch.length, 3, '3 opciones');
    assert.equal(new Set(ch.map(a => a.key)).size, 3, `3 especies distintas (${c.n}/${bio})`);
    assert.ok(ch.every(a => a.level >= 1 && a.atk > 0 && !a.starter), 'válidos y no starters');
  }
});

test('Furia: gana +1 ⚔ por cada ataque (se acumula en la pelea)', () => {
  const A = [{ uid: 1, atk: 1, hp: 99, spd: 5, ab: 'rage' }];   // 1 de ataque base, con furia
  const B = [{ uid: 2, atk: 1, hp: 99, spd: 1, ab: null }];
  const dmgs = E.fight(A, B).steps
    .filter(s => s.kind === 'strike' && s.attacks[0].from === 1)
    .map(s => s.attacks[0].dmg);
  assert.equal(dmgs[0], 2, 'primer ataque: 1 base + 1 de furia');
  assert.equal(dmgs[1], 3, 'segundo: acumula otro +1');
  assert.ok(dmgs[2] > dmgs[1], 'sigue creciendo');
});

test('legendario: aplica sus DOS habilidades (jaguar = furia + primer golpe)', () => {
  const lento = [{ uid: 9, atk: 9, hp: 8, spd: 9, ab: null }];   // más rápido y fuerte
  const jaguar = E.mkAnimal('jaguar');                            // ab rage + ab2 first
  assert.equal(jaguar.ab2, 'first', 'el jaguar trae 2ª habilidad');
  jaguar.uid = 1; jaguar.atk = 3; jaguar.hp = 8; jaguar.spd = 1; jaguar.hab = 0;
  // con 'primer golpe' el jaguar (lento) abre el combate pese a su baja velocidad
  const strikes = E.fight([jaguar], lento).steps.filter(s => s.kind === 'strike');
  assert.equal(strikes[0].attacks[0].from, 1, 'abre el jaguar por su 2ª habilidad (primer golpe)');
});

console.log(`\n${passed} pruebas OK\n`);
