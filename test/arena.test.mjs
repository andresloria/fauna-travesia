// ============================================================
// arena.test.mjs — pruebas del motor de combate ARENA (reglas Naruto-Arena).
// Correr:  node test/arena.test.mjs
// ============================================================
import assert from 'node:assert/strict';
import * as A from '../src/arena.js';

let passed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓', name); }
  catch (e) { console.error('  ✗', name, '\n   ', e.message); process.exitCode = 1; }
}
// rng determinista
const rngFijo = (seq) => { let i = 0; return () => seq[i++ % seq.length]; };

const EQ = (k1, k2, k3) => [{ key: k1 }, { key: k2 }, { key: k3 }];
const TA = () => EQ('jaguar', 'quetzal', 'tortuga');
const TB = () => EQ('serpiente', 'cocodrilo', 'murcielago');

// ⚠️ Los kits salen del DOCUMENTO (movesets_doc.js) y cambian cuando Andrés
// manda una versión nueva. Un test que busque "Zarpazo" del jaguar se rompe
// sola con cada actualización de datos y NO prueba el motor. Por eso las
// pruebas de mecánica se hacen con este kit de laboratorio, que se le enchufa
// a la unidad: así se prueba el MOTOR, no los datos.
const KIT = () => [
  { n:'LAB golpe',  costo:['comodin'], recarga:0, clases:['fisico','melee'],
    efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
  { n:'LAB perfora', costo:['bosque'], recarga:0, clases:['fisico','melee'],
    efectos:[{ t:'dano', v:40, obj:'enemigo', ignoraDefensa:true }] },
  { n:'LAB toxina', costo:['comodin'], recarga:0, clases:['toxina','rango'],
    efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
  { n:'LAB exponer', costo:['comodin'], recarga:0, clases:['instinto'],
    efectos:[{ t:'exponer', turnos:2, obj:'enemigo' }] },
  { n:'Esquivar', costo:['comodin'], recarga:4, clases:['fisico'], esEsquiva:true,
    efectos:[{ t:'invulnerable', turnos:1, obj:'self' }] },
];
const conKit = (u) => { u.habs = KIT(); return u; };
const iHab = (u, n) => u.habs.findIndex(h => h.n === n);

console.log('\nFAUNA · ARENA — tests del motor por turnos\n');

// ---------- construcción y reglas de vida ----------
test('todos empiezan con VIDA 100, sin importar rareza', () => {
  const st = A.mkCombate(EQ('jaguar', 'perezoso', 'sapo_dorado'), TB(), { abre: 'A', rng: rngFijo([0.1]) });
  for (const u of st.unidades) assert.equal(u.hp, 100, u.key + ' debe tener 100');
});

test('SIN NIVELES: todos entran con TODAS sus habilidades + esquiva', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A' });
  for (const u of st.unidades) {
    // los del documento traen 4 (+esquiva); los de plantilla, 3 (+esquiva)
    assert.ok(u.habs.length === 4 || u.habs.length === 5,
      `${u.key} trae ${u.habs.length} habilidades`);
    assert.equal(u.habs.filter(h => h.esEsquiva).length, 1, u.key + ' debe traer 1 esquiva');
  }
});

test('SIN PASIVAS: ninguna unidad trae pasiva', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A' });
  for (const u of st.unidades) assert.equal(u.pasiva, undefined);
  // la tortuga ya NO arranca con defensa (era la pasiva Caparazón)
  assert.equal(st.unidades.find(u => u.key === 'tortuga').defensa, 0);
});

test('las 136 especies construyen unidad válida con sus habilidades', () => {
  import('../src/fauna_roster.js').then(({ SP }) => {
    for (const k of Object.keys(SP)) {
      const u = A.mkUnidad({ key: k }, 'A', 0);
      assert.equal(u.hp, 100);
      assert.ok(u.habs.length >= 2, k + ' necesita habilidades');
      assert.ok(u.habs[u.habs.length - 1].esEsquiva, k + ' debe cerrar con la Esquiva');
    }
  });
});

// ---------- energía ----------
test('el que abre recibe SOLO 1 energía en su primer turno', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.1]) });
  assert.equal(A.totalE(st.energia.A), 1);
  assert.equal(A.totalE(st.energia.B), 0);
});

test('el segundo jugador también recibe 1 en SU primer turno; después 1 por vivo', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.1, 0.4, 0.7, 0.9]) });
  A.ejecutarTurno(st, []);                       // A pasa
  assert.equal(A.totalE(st.energia.B), 1, 'primer turno de B = 1');
  A.ejecutarTurno(st, []);                       // B pasa
  assert.equal(A.totalE(st.energia.A), 1 + 3, 'segundo turno de A: +3 (3 vivos)');
});

test('la energía es 25% cada bioma (rng controlado)', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  assert.equal(st.energia.A.bosque, 1);          // 0.0 → primer bioma
  const st2 = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.9]) });
  assert.equal(st2.energia.A.montana, 1);        // 0.9 → último bioma
});

test('matar a un enemigo le baja la economía (menos vivos = menos energía)', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'B', rng: rngFijo([0.2, 0.5, 0.8]) });
  st.unidades.find(u => u.uid === 'B2').viva = false;   // murciélago muerto
  A.ejecutarTurno(st, []);                       // B pasa → llega el turno de A
  st.energia.B = { bosque: 0, sabana: 0, agua: 0, montana: 0 };  // limpiar la inicial
  A.ejecutarTurno(st, []);                       // A pasa → segundo turno de B
  assert.equal(A.totalE(st.energia.B), 2, 'B con 2 vivos gana 2, no 3');
});

// ---------- costos y validación ----------
test('no se puede usar habilidad sin energía; el comodín paga con cualquiera', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.99]) }); // 1 montaña
  const jaguar = st.unidades[0];
  const iMordida = jaguar.habs.findIndex(h => h.n === 'Mordida al cráneo'); // pide bosque
  const iEsquiva = jaguar.habs.findIndex(h => h.esEsquiva);                 // pide comodín
  assert.equal(A.puedeUsar(st, jaguar, iMordida).ok, false, 'sin bosque no hay Mordida');
  assert.equal(A.puedeUsar(st, jaguar, iEsquiva).ok, true, 'el comodín acepta la montaña');
});

test('1 habilidad por animal por turno (la cola lo rechaza)', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const v = A.validarCola(st, 'A', [
    { uid: 'A0', hab: 0, objetivo: 'B0' },
    { uid: 'A0', hab: 1, objetivo: 'B0' },
  ]);
  assert.equal(v.ok, false);
});

// ---------- cola en orden ----------
test('la cola se ejecuta EN ORDEN: exponer primero permite pegarle al invulnerable', () => {
  const st = A.mkCombate(EQ('monocara', 'jaguar', 'tortuga'), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const serp = st.unidades.find(u => u.uid === 'B0');
  serp.efectos.push({ t: 'invulnerable', turnos: 1 });
  const mani = conKit(st.unidades.find(u => u.key === 'monocara'));
  const jag = conKit(st.unidades.find(u => u.key === 'jaguar'));
  const r = A.ejecutarTurno(st, [
    { uid: mani.uid, hab: iHab(mani, 'LAB exponer'), objetivo: serp.uid },  // 1º: rompe invuln
    { uid: jag.uid, hab: iHab(jag, 'LAB golpe'), objetivo: serp.uid },      // 2º: el golpe ENTRA
  ]);
  assert.ok(r.ok);
  assert.ok(serp.hp < 100, 'expuesto: el golpe debe entrar (hp=' + serp.hp + ')');
});

// ---------- recargas ----------
test('recarga: la Esquiva (recarga 4) queda bloqueada 4 turnos', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.5]) });
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const jag = st.unidades[0];
  const iEsq = jag.habs.findIndex(h => h.esEsquiva);
  A.ejecutarTurno(st, [{ uid: 'A0', hab: iEsq, objetivo: 'A0' }]);
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  A.ejecutarTurno(st, []);                       // turno B
  assert.equal(A.puedeUsar(st, jag, iEsq).ok, false, 'aún en recarga');
  // recarga 4 = bloqueada los 4 turnos PROPIOS siguientes → libre en el 5º
  for (let i = 0; i < 8; i++) A.ejecutarTurno(st, []);
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  assert.equal(A.puedeUsar(st, jag, iEsq).ok, true, 'recarga cumplida');
});

// ---------- invulnerabilidad, toxina, exponer ----------
test('la Esquiva bloquea daño directo, pero la TOXINA la atraviesa', () => {
  const st = A.mkCombate(TA(), EQ('ranadardo', 'serpiente', 'cocodrilo'), { abre: 'B', rng: rngFijo([0.0]) });
  st.energia.B = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const jag = st.unidades.find(u => u.uid === 'A0');
  jag.efectos.push({ t: 'invulnerable', turnos: 2 });
  const rana = conKit(st.unidades.find(u => u.key === 'ranadardo'));
  const coco = conKit(st.unidades.find(u => u.key === 'cocodrilo'));
  A.ejecutarTurno(st, [
    { uid: rana.uid, hab: iHab(rana, 'LAB toxina'), objetivo: jag.uid },
    { uid: coco.uid, hab: iHab(coco, 'LAB golpe'), objetivo: jag.uid },
  ]);
  const golpes = st.log.filter(e => e.t === 'bloqueado' && e.uid === 'A0');
  assert.ok(golpes.length >= 1, 'el golpe directo debió ser bloqueado');
  assert.equal(jag.hp, 100, 'la toxina aún no tickeó (tickea al cierre del turno del envenenado)');
  A.ejecutarTurno(st, []);   // el turno de A cierra → SU toxina tickea
  assert.ok(jag.hp < 100, 'la toxina debe tickear pese a la invulnerabilidad (hp=' + jag.hp + ')');
});

test('la defensa destructible absorbe daño; el golpe perforante la ignora', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.5]) });
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const coco = st.unidades.find(u => u.key === 'cocodrilo');
  coco.defensa = 30;
  const jag = conKit(st.unidades[0]);
  A.ejecutarTurno(st, [{ uid: 'A0', hab: iHab(jag, 'LAB golpe'), objetivo: coco.uid }]);
  assert.equal(coco.hp, 100, 'la defensa absorbe el golpe entero');
  assert.equal(coco.defensa, 5, '30 - 25 = 5');
  A.ejecutarTurno(st, []);                       // turno B
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  A.ejecutarTurno(st, [{ uid: 'A0', hab: iHab(jag, 'LAB perfora'), objetivo: coco.uid }]);
  assert.equal(coco.hp, 60, 'el perforante entra completo aunque haya defensa');
});

test('robar energía: el ladrón la gana, el rival la pierde', () => {
  const st = A.mkCombate(EQ('murcielago', 'jaguar', 'tortuga'), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 9, sabana: 0, agua: 0, montana: 9 };
  st.energia.B = { bosque: 0, sabana: 1, agua: 0, montana: 0 };
  const mur = st.unidades.find(u => u.key === 'murcielago');
  // kit de laboratorio: el del roster cambia con cada versión del documento
  mur.habs = [{ n: 'LAB roba', costo: ['comodin'], recarga: 0, clases: ['toxina'],
    efectos: [{ t: 'robarEnergia', n: 1, obj: 'enemigo' }] }];
  A.ejecutarTurno(st, [{ uid: mur.uid, hab: 0, objetivo: 'B0' }]);
  // ojo: al pasar el turno B gana su energía inicial — se chequea el TIPO robado
  assert.equal(st.energia.B.sabana, 0, 'B perdió su sabana');
  assert.ok(st.energia.A.sabana >= 1, 'A ganó la sabana robada');
});

// ---------- costo de energía = lo único que limita ----------
test('sin la energía del bioma, la habilidad no se puede usar (aunque exista)', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 0, sabana: 3, agua: 0, montana: 0 };
  const jag = conKit(st.unidades[0]);
  const iMor = iHab(jag, 'LAB perfora');   // pide bosque
  assert.equal(A.puedeUsar(st, jag, iMor).ok, false, 'sin bosque no se puede');
  st.energia.A.bosque = 1;
  assert.equal(A.puedeUsar(st, jag, iMor).ok, true, 'con bosque sí');
  // y el BÁSICO siempre se puede: cuesta comodín (cualquier energía)
  const iZar = iHab(jag, 'LAB golpe');
  st.energia.A = { bosque: 0, sabana: 1, agua: 0, montana: 0 };
  assert.equal(A.puedeUsar(st, jag, iZar).ok, true, 'el básico nunca deja sin jugar');
});

// ---------- compensación por abrir ----------
test('el que RESPONDE arranca con energía extra (compensación por tempo)', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.1]) });
  assert.equal(A.totalE(st.energia.A), 1, 'el que abre recibe 1');
  A.ejecutarTurno(st, []);                         // A pasa -> entra B
  assert.equal(A.totalE(st.energia.B), 1 + A.COMPENSA_SEGUNDO,
    'el que responde recibe 1 + la compensación');
  A.ejecutarTurno(st, []);                         // B pasa -> vuelve A
  assert.equal(A.totalE(st.energia.A), 1 + 3, 'a partir del 2º turno: 1 por vivo, sin extra');
});

test('la compensación se puede apagar para medirla (opts.compensa)', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.1]), compensa: 0 });
  A.ejecutarTurno(st, []);
  assert.equal(A.totalE(st.energia.B), 1, 'sin compensación, los dos arrancan con 1');
});

// ---------- cambio de energía (3 cualquiera -> 1 a elección; el original usa 5) ----------
test('cambio de energía: paga 3 cualesquiera y recibe 1 del tipo elegido', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 4, sabana: 2, agua: 0, montana: 0 };
  assert.equal(A.puedeCambiar(st, 'A'), true);
  assert.equal(A.cambiarEnergia(st, 'A', 'agua'), true);
  assert.equal(st.energia.A.agua, 1, 'ganó el agua elegida');
  assert.equal(A.totalE(st.energia.A), 4, '6 - 3 + 1 = 4');
  // solo una vez por turno
  st.energia.A = { bosque: 9, sabana: 0, agua: 0, montana: 0 };
  assert.equal(A.cambiarEnergia(st, 'A', 'agua'), false, 'ya cambió este turno');
  // al turno siguiente puede de nuevo
  A.ejecutarTurno(st, []);   // pasa A
  A.ejecutarTurno(st, []);   // pasa B -> vuelve A
  st.energia.A = { bosque: 9, sabana: 0, agua: 0, montana: 0 };
  assert.equal(A.cambiarEnergia(st, 'A', 'montana'), true, 'turno nuevo, cambio nuevo');
});

test('cambio de energía: con menos de 3 no se puede', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 1, sabana: 1, agua: 0, montana: 0 };
  assert.equal(A.puedeCambiar(st, 'A'), false);
  assert.equal(A.cambiarEnergia(st, 'A', 'agua'), false);
  assert.equal(A.totalE(st.energia.A), 2, 'no tocó nada');
});

// ---------- fin del combate ----------
test('el combate termina cuando cae el equipo entero', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A' });
  for (const u of st.unidades) if (u.lado === 'B') { u.hp = 5; }
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  // kit de laboratorio: el slot 0 pega sí o sí (los del documento no siempre)
  const [a0, a1, a2] = st.unidades.filter(u => u.lado === 'A').map(conKit);
  A.ejecutarTurno(st, [
    { uid: a0.uid, hab: 0, objetivo: 'B0' },
    { uid: a1.uid, hab: 0, objetivo: 'B1' },
    { uid: a2.uid, hab: 0, objetivo: 'B2' },
  ]);
  assert.equal(st.fin, 'A');
});

// ---------- IA / AUTO ----------
test('colaAuto produce colas válidas', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.3, 0.6, 0.9, 0.1]) });
  st.energia.A = { bosque: 2, sabana: 1, agua: 1, montana: 1 };
  const cola = A.colaAuto(st);
  assert.ok(cola.length >= 1, 'con energía debe jugar algo');
  assert.equal(A.validarCola(st, 'A', cola).ok, true);
});

// ---------- fuzz: 500 combates completos ----------
test('500 combates automáticos con equipos al azar: nadie revienta, todos terminan', () => {
  const keys = ['jaguar','quetzal','tortuga','serpiente','cocodrilo','murcielago','manigordo',
    'perezoso','ranadardo','venado','iguana','abeja','puercoespin','rana_ojos_rojos',
    'pizote','mapache','tucan','armadillo','tepezcuintle','nutria','caucel','danta','puma'];
  let finA = 0, sinFin = 0;
  let rng = (() => { let s = 42; return () => { s = (s * 1103515245 + 12345) % 2147483648; return s / 2147483648; }; })();
  for (let g = 0; g < 500; g++) {
    const pick = () => keys[Math.floor(rng() * keys.length)];
    const st = A.combateAuto(
      [{ key: pick() }, { key: pick() }, { key: pick() }],
      [{ key: pick() }, { key: pick() }, { key: pick() }],
      { rng });
    assert.ok(st.fin === 'A' || st.fin === 'B', 'el combate debe terminar');
    if (st.fin === 'A') finA++;
    if (st.turno >= 200) sinFin++;
  }
  console.log(`      · lado A ganó ${finA}/500 (${(finA / 5).toFixed(1)}%) · sin-fin: ${sinFin}`);
  assert.ok(finA > 175 && finA < 325, 'los lados deben estar parejos, A=' + finA);
});

console.log(`\n${passed} pruebas OK\n`);
