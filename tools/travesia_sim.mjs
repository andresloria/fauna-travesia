// ============================================================
// travesia_sim.mjs — mide el prototipo del modo Travesía SIN pantalla.
// Correr:  node tools/travesia_sim.mjs [partidas] [filas]
//
// Lo que contesta:
//   · ¿abrir da ventaja? (el bloqueador de PvP que ya nos mordió en la arena)
//   · ¿cuánto dura una partida?
//   · ¿pasa algo? (duelos y KOs por partida; un juego sin KOs es un desfile)
//   · ¿se empata mucho? (bloqueo total = aburrido)
// ============================================================

import { SP } from '../src/fauna_roster.js';
import { mkPartida, jugarAuto, mkTablero, mkTableroRejilla } from '../src/travesia/tablero.js';

const N = +(process.argv[2] || 300);
const TAB = process.argv[3] || 'duel';        // 'duel' (el original) o 'rejilla'
const mkTab = () => TAB === 'rejilla' ? mkTableroRejilla({ filas: 8, cols: 5 }) : mkTablero();
const PENAL = process.argv[4] || '2';   // piso del MP penalizado, o 'no'
const RESIST = +(process.argv[6] || 1);   // duelos perdidos que aguanta una pieza
const ESPERA = +(process.argv[5] || 7);   // acciones en la banca tras caer

const KEYS = Object.keys(SP);
const rngSemilla = (s) => { let x = s >>> 0 || 1;
  return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; };

const equipo = (rng) => {
  const pool = [...KEYS], out = [];
  while (out.length < 6 && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
};

let ganaAbre = 0, ganaResponde = 0, empates = 0;
let sumTurnos = 0, sumDuelos = 0, sumKOs = 0, sumMetas = 0, sumCercos = 0, sumWait = 0;
const porEspecie = {};   // key -> {j, g}

const t0 = Date.now();
for (let i = 0; i < N; i++) {
  const rng = rngSemilla(i * 2654435761 + 11);
  const A = equipo(rng), B = equipo(rng);
  const abre = rng() < 0.5 ? 'A' : 'B';
  const st = mkPartida(A, B, { rng, abre, resistencia: RESIST, espera: ESPERA, tablero: mkTab(),
    dobleEntrada: PENAL === 'no' ? false : undefined, quietaAlEncadenar: PENAL !== 'libre' });
  jugarAuto(st);

  sumTurnos += st.turno;
  sumDuelos += st.log.filter(e => e.t === 'duelo').length;
  sumKOs += st.log.filter(e => e.t === 'ko').length;
  sumCercos += st.log.filter(e => e.t === 'cercado').length;
  if (st.fin !== 'empate' && !st.log.some(e => e.t === 'meta')) sumWait++;
  if (st.fin === 'empate') empates++;
  else {
    sumMetas++;
    if (st.fin === abre) ganaAbre++; else ganaResponde++;
  }
  for (const [lado, eq] of [['A', A], ['B', B]]) {
    for (const k of eq) {
      porEspecie[k] = porEspecie[k] || { j: 0, g: 0 };
      porEspecie[k].j++;
      if (st.fin === lado) porEspecie[k].g++;
    }
  }
}

const pct = (n, d) => d ? (n / d * 100).toFixed(1) + '%' : '—';
const decididas = ganaAbre + ganaResponde;

console.log('');
console.log('TRAVESÍA — ' + N + ' partidas, tablero ' + TAB + ', penal ' + PENAL + ', resistencia ' + RESIST + '  (' + (Date.now() - t0) + ' ms)');
console.log('─'.repeat(58));
console.log('  gana el que ABRE      ' + pct(ganaAbre, decididas).padStart(7) +
            '   (50% = parejo; >55% hay que compensar)');
console.log('  gana el que RESPONDE  ' + pct(ganaResponde, decididas).padStart(7));
console.log('  empates               ' + pct(empates, N).padStart(7) + '   (alto = se traba el tablero)');
console.log('  turnos por partida    ' + (sumTurnos / N).toFixed(1).padStart(7));
console.log('  duelos por partida    ' + (sumDuelos / N).toFixed(1).padStart(7) + '   (bajo = es un desfile, no un juego)');
console.log('  KOs por partida       ' + (sumKOs / N).toFixed(1).padStart(7));
console.log('  CERCOS por partida    ' + (sumCercos / N).toFixed(2).padStart(7) + '   (sacar sin pelear)');
console.log('  ganadas por WAIT WIN  ' + pct(sumWait, N).padStart(7) + '   (ahogando al rival)');
console.log('');

// ¿qué tan disparejas quedan las especies? La desviación típica es la medida
// honesta (la "brecha mejor-peor" es ruido puro; ya nos engañó en la arena).
const conDatos = Object.entries(porEspecie).filter(([, v]) => v.j >= 8);
const tasas = conDatos.map(([, v]) => v.g / v.j * 100);
if (tasas.length) {
  const media = tasas.reduce((a, b) => a + b, 0) / tasas.length;
  const desv = Math.sqrt(tasas.reduce((a, b) => a + (b - media) ** 2, 0) / tasas.length);
  console.log('  especies medidas      ' + String(tasas.length).padStart(7) + '  (con 8+ partidas)');
  console.log('  victoria media        ' + media.toFixed(1).padStart(7) + '%');
  console.log('  DESVIACIÓN TÍPICA     ' + desv.toFixed(1).padStart(7) + '   (en la arena quedó ~11; menos es mejor)');
  const orden = conDatos.sort((a, b) => b[1].g / b[1].j - a[1].g / a[1].j);
  const linea = ([k, v]) => '      ' + (SP[k]?.n || k).slice(0, 24).padEnd(26) +
    (v.g / v.j * 100).toFixed(0).padStart(3) + '%  (' + v.j + ' part.)';
  console.log('');
  console.log('  MEJORES'); orden.slice(0, 5).forEach(e => console.log(linea(e)));
  console.log('  PEORES');  orden.slice(-5).forEach(e => console.log(linea(e)));
}
console.log('');
