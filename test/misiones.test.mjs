// ============================================================
// misiones.test.mjs — las misiones que el SIMULADOR no puede probar.
//
// El simulador juega con la IA (colaAuto), que elige habilidades sola: nunca
// va a "ganar sin usar la Esquiva" ni "usando solo toxina". Esas misiones daban
// 0% en la auditoría y parecían rotas. Acá se prueban a mano, armando el
// resultado de la pelea que un jugador SÍ puede lograr.
//
//   node test/misiones.test.mjs
// ============================================================
import assert from 'node:assert/strict';
import * as L from '../src/liga.js';

let ok = 0;
const test = (n, f) => {
  try { f(); ok++; console.log('  ✓', n); }
  catch (e) { console.error('  ✗', n, '\n   ', e.message); process.exitCode = 1; }
};

// --- una pelea de mentira, con las habilidades que YO diga ---
// habs: [{n, clases}] usadas por mi equipo, en orden.
function peleaFalsa({ habsUsadas = [], gane = true, caidosMios = 0, tipo = 'normal' } = {}) {
  const mk = (uid, habs) => ({
    uid, lado: uid[0], key: 'ranadardo', viva: !(uid === 'A2' && caidosMios > 0),
    hp: 100, habs,
  });
  const habsDeUnidad = habsUsadas.map(h => ({ n: h.n, clases: h.clases }));
  const unidades = [
    mk('A0', habsDeUnidad), mk('A1', habsDeUnidad), mk('A2', habsDeUnidad),
    mk('B0', []), mk('B1', []), mk('B2', []),
  ];
  if (caidosMios > 0) unidades[2].viva = false;
  return {
    fin: gane ? 'A' : 'B',
    unidades,
    log: habsUsadas.map(h => ({ t: 'usa', uid: 'A0', hab: h.n })),
  };
}

const TOX = { n: 'Secreción', clases: ['toxina', 'rango'] };
const FIS = { n: 'Zarpazo', clases: ['fisico', 'melee'] };
const ESQ = { n: 'Esquivar', clases: ['fisico'] };

console.log('\nFAUNA · misiones que el simulador no puede probar\n');

test('soloClase: 3 victorias usando SOLO toxina desbloquean la Rana dardo', () => {
  const st = L.nuevoEstado();
  assert.equal(L.desbloqueado(st, 'ranadardo'), false, 'arranca bloqueada');
  for (let i = 0; i < 3; i++)
    L.registrarResultado(st, { tipo: 'normal', prov: { n: 'Cartago' } },
      peleaFalsa({ habsUsadas: [TOX, TOX] }), ['tortuga', 'garza', 'jicotea']);
  assert.equal(L.desbloqueado(st, 'ranadardo'), true, 'debió desbloquearse');
});

test('soloClase: si se cuela UN ataque físico, no cuenta', () => {
  const st = L.nuevoEstado();
  for (let i = 0; i < 3; i++)
    L.registrarResultado(st, { tipo: 'normal', prov: { n: 'Cartago' } },
      peleaFalsa({ habsUsadas: [TOX, FIS] }), ['tortuga', 'garza', 'jicotea']);
  assert.equal(L.desbloqueado(st, 'ranadardo'), false, 'el golpe físico debió romperla');
});

test('soloClase: la Esquiva NO rompe la racha (es universal, no es tu estilo)', () => {
  const st = L.nuevoEstado();
  for (let i = 0; i < 3; i++)
    L.registrarResultado(st, { tipo: 'normal', prov: { n: 'Cartago' } },
      peleaFalsa({ habsUsadas: [TOX, ESQ, TOX] }), ['tortuga', 'garza', 'jicotea']);
  assert.equal(L.desbloqueado(st, 'ranadardo'), true, 'la Esquiva no debía contar');
});

test('sinEsquiva: vencer 3 cabecillas sin esquivar desbloquea el Manigordo', () => {
  const st = L.nuevoEstado();
  for (let i = 0; i < 3; i++)
    L.registrarResultado(st, { tipo: 'jefe', prov: { n: 'Cartago' } },
      peleaFalsa({ habsUsadas: [FIS], tipo: 'jefe' }), ['tortuga', 'garza', 'jicotea']);
  assert.equal(L.desbloqueado(st, 'manigordo'), true, 'debió desbloquearse');
});

test('sinEsquiva: si esquivás en una, esa no cuenta', () => {
  const st = L.nuevoEstado();
  for (let i = 0; i < 3; i++)
    L.registrarResultado(st, { tipo: 'jefe', prov: { n: 'Cartago' } },
      peleaFalsa({ habsUsadas: [FIS, ESQ] }), ['tortuga', 'garza', 'jicotea']);
  assert.equal(L.desbloqueado(st, 'manigordo'), false, 'la Esquiva debió invalidarla');
});

test('las misiones de "ganá el juego" se pueden reintentar en la liga libre', () => {
  const st = L.nuevoEstado();
  st.prov = 8; st.ganoJuego = true;              // ya ganó Monteverde
  st.desbloqueados.push('quetzal');
  L.registrarResultado(st, { tipo: 'jefe', prov: { n: 'Cartago' } },
    peleaFalsa({ habsUsadas: [FIS] }), ['quetzal', 'garza', 'jicotea']);
  assert.equal(L.desbloqueado(st, 'quetzaldorado'), true,
    'el jefe de la liga libre debe dar otra oportunidad');
});

console.log(`\n${ok} pruebas OK\n`);
