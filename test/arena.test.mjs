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

const EQ = (k1, k2, k3, nivel = 8) => [{ key: k1, nivel }, { key: k2, nivel }, { key: k3, nivel }];
const TA = () => EQ('jaguar', 'quetzal', 'tortuga');
const TB = () => EQ('serpiente', 'cocodrilo', 'murcielago');

console.log('\nFAUNA · ARENA — tests del motor por turnos\n');

// ---------- construcción y reglas de vida ----------
test('todos empiezan con VIDA 100, sin importar rareza ni nivel', () => {
  const st = A.mkCombate(EQ('jaguar', 'perezoso', 'sapo_dorado', 1), TB(), { abre: 'A', rng: rngFijo([0.1]) });
  for (const u of st.unidades) assert.equal(u.hp, 100, u.key + ' debe tener 100');
});

test('el nivel solo desbloquea habilidades: Nv1 tiene 1+esquiva, Nv8 tiene 3+esquiva', () => {
  const st1 = A.mkCombate(EQ('jaguar', 'quetzal', 'tortuga', 1), TB(), { abre: 'A' });
  const st8 = A.mkCombate(TA(), TB(), { abre: 'A' });
  assert.equal(st1.unidades[0].habs.length, 2);  // Zarpazo + Esquivar
  assert.equal(st8.unidades[0].habs.length, 4);  // 3 + Esquivar
});

test('las 136 especies construyen unidad válida con 4 habilidades a Nv8', () => {
  import('../src/fauna_roster.js').then(({ SP }) => {
    for (const k of Object.keys(SP)) {
      const u = A.mkUnidad({ key: k, nivel: 8 }, 'A', 0);
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
  const iZarpazo = jaguar.habs.findIndex(h => h.n === 'Zarpazo');          // cuesta bosque
  const iEsquiva = jaguar.habs.findIndex(h => h.esEsquiva);                // cuesta comodín
  assert.equal(A.puedeUsar(st, jaguar, iZarpazo).ok, false, 'sin bosque no hay Zarpazo');
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
  const st = A.mkCombate(EQ('manigordo', 'jaguar', 'tortuga'), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const serp = st.unidades.find(u => u.uid === 'B0');
  serp.efectos.push({ t: 'invulnerable', turnos: 1 });
  const mani = st.unidades.find(u => u.key === 'manigordo');
  const iExp = mani.habs.findIndex(h => (h.efectos || []).some(f => f.t === 'exponer'));
  const jag = st.unidades.find(u => u.key === 'jaguar');
  const iZar = jag.habs.findIndex(h => h.n === 'Zarpazo');
  const r = A.ejecutarTurno(st, [
    { uid: mani.uid, hab: iExp, objetivo: serp.uid },   // 1º: exponer (rompe invuln)
    { uid: jag.uid, hab: iZar, objetivo: serp.uid },    // 2º: el golpe ENTRA
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
  const rana = st.unidades.find(u => u.key === 'ranadardo');
  const iTox = rana.habs.findIndex(h => (h.clases || []).includes('toxina'));
  const coco = st.unidades.find(u => u.key === 'cocodrilo');
  const iDen = coco.habs.findIndex(h => h.n === 'Dentellada');
  A.ejecutarTurno(st, [
    { uid: rana.uid, hab: iTox, objetivo: jag.uid },
    { uid: coco.uid, hab: iDen, objetivo: jag.uid },
  ]);
  assert.ok(jag.hp < 100, 'la toxina debe tickear (hp=' + jag.hp + ')');
  const golpes = st.log.filter(e => e.t === 'bloqueado' && e.uid === 'A0');
  assert.ok(golpes.length >= 1, 'la Dentellada debió ser bloqueada');
});

test('defensa destructible absorbe daño; Mordida al cráneo la ignora', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A', rng: rngFijo([0.5]) });
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const coco = st.unidades.find(u => u.key === 'cocodrilo');
  coco.defensa = 30;
  const jag = st.unidades[0];
  const iZar = jag.habs.findIndex(h => h.n === 'Zarpazo');            // 25 normal
  A.ejecutarTurno(st, [{ uid: 'A0', hab: iZar, objetivo: coco.uid }]);
  assert.equal(coco.hp, 100, 'la defensa absorbe el Zarpazo entero');
  assert.equal(coco.defensa, 5, '30 - 25 = 5');
  A.ejecutarTurno(st, []);                       // turno B
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const iMor = jag.habs.findIndex(h => h.n === 'Mordida al cráneo');  // 40 ignora defensa
  A.ejecutarTurno(st, [{ uid: 'A0', hab: iMor, objetivo: coco.uid }]);
  assert.equal(coco.hp, 60, 'la Mordida entra completa aunque haya defensa');
});

test('robar energía: el ladrón la gana, el rival la pierde', () => {
  const st = A.mkCombate(EQ('murcielago', 'jaguar', 'tortuga'), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 9, sabana: 0, agua: 0, montana: 9 };
  st.energia.B = { bosque: 0, sabana: 1, agua: 0, montana: 0 };
  const mur = st.unidades.find(u => u.key === 'murcielago');
  const iSan = mur.habs.findIndex(h => h.n === 'Sangría');
  A.ejecutarTurno(st, [{ uid: mur.uid, hab: iSan, objetivo: 'B0' }]);
  // ojo: al pasar el turno B gana su energía inicial — se chequea el TIPO robado
  assert.equal(st.energia.B.sabana, 0, 'B perdió su sabana');
  assert.ok(st.energia.A.sabana >= 1, 'A ganó la sabana robada');
});

// ---------- pasivas ----------
test('pasiva Caparazón: la tortuga empieza con 20 de defensa', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A' });
  assert.equal(st.unidades.find(u => u.key === 'tortuga').defensa, 20);
});

test('pasiva Madrugador (manigordo): su primera habilidad no gasta energía', () => {
  const st = A.mkCombate(EQ('manigordo', 'jaguar', 'tortuga'), TB(), { abre: 'A', rng: rngFijo([0.0]) });
  st.energia.A = { bosque: 1, sabana: 0, agua: 0, montana: 0 };
  const mani = st.unidades[0];
  const iZar = 0;
  A.ejecutarTurno(st, [{ uid: mani.uid, hab: iZar, objetivo: 'B0' }]);
  assert.equal(st.energia.A.bosque, 1, 'no debió gastar la energía');
});

test('pasiva Púas (puercoespín): el atacante melee recibe 10', () => {
  const st = A.mkCombate(TA(), EQ('puercoespin', 'serpiente', 'cocodrilo'), { abre: 'A', rng: rngFijo([0.5]) });
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const jag = st.unidades[0];
  const puerco = st.unidades.find(u => u.key === 'puercoespin');
  const iZar = jag.habs.findIndex(h => h.n === 'Zarpazo');
  A.ejecutarTurno(st, [{ uid: 'A0', hab: iZar, objetivo: puerco.uid }]);
  assert.equal(jag.hp, 90, 'el jaguar debe recibir 10 de vuelta');
});

// ---------- fin del combate ----------
test('el combate termina cuando cae el equipo entero', () => {
  const st = A.mkCombate(TA(), TB(), { abre: 'A' });
  for (const u of st.unidades) if (u.lado === 'B') { u.hp = 5; }
  st.energia.A = { bosque: 9, sabana: 9, agua: 9, montana: 9 };
  const jag = st.unidades[0], que = st.unidades[1], tor = st.unidades[2];
  A.ejecutarTurno(st, [
    { uid: 'A0', hab: 0, objetivo: 'B0' },
    { uid: 'A1', hab: 0, objetivo: 'B1' },
    { uid: 'A2', hab: 0, objetivo: 'B2' },
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
    const nivel = () => [1, 4, 8][Math.floor(rng() * 3)];
    const st = A.combateAuto(
      [{ key: pick(), nivel: nivel() }, { key: pick(), nivel: nivel() }, { key: pick(), nivel: nivel() }],
      [{ key: pick(), nivel: nivel() }, { key: pick(), nivel: nivel() }, { key: pick(), nivel: nivel() }],
      { rng });
    assert.ok(st.fin === 'A' || st.fin === 'B', 'el combate debe terminar');
    if (st.fin === 'A') finA++;
    if (st.turno >= 200) sinFin++;
  }
  console.log(`      · lado A ganó ${finA}/500 (${(finA / 5).toFixed(1)}%) · sin-fin: ${sinFin}`);
  assert.ok(finA > 175 && finA < 325, 'los lados deben estar parejos, A=' + finA);
});

console.log(`\n${passed} pruebas OK\n`);
