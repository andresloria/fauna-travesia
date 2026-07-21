// ============================================================
// enganche.mjs — ¿el juego engancha en los primeros minutos?
//
// La simulación de liga mide el arco COMPLETO (horas). Pero un jugador decide
// si sigue jugando en los primeros 10 minutos. Esto mide lo que pasa ahí:
// cuánto tarda la primera recompensa, cuántas peleas hasta el primer jefe,
// y cuánto dura una sesión de verdad en minutos de reloj.
//
//   node tools/enganche.mjs [ligas]
// ============================================================
import * as A from '../src/arena.js';
import * as L from '../src/liga.js';
import { SP } from '../src/fauna_roster.js';

const N = Number(process.argv[2] || 2000);
// Cuánto tarda un humano en decidir un turno. 8 s es generoso: hay que leer
// 3 tiras de habilidades, elegir objetivo y confirmar.
const SEG_POR_TURNO = 8;
const barajar = (a) => { const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; };

const primUnlock = [], primJefe = [], turnos10 = [], derrotasSeguidas = [];
let sinUnlockEn10 = 0, muerteTemprana = 0;

for (let i = 0; i < N; i++) {
  const st = L.nuevoEstado();
  st.guia = { name: 'sim', guide: 'hombre' };
  let peleas = 0, unlock = null, jefe = null, turnosAcum = 0, rachaL = 0, peorRachaL = 0;

  while (peleas < 60 && !(unlock !== null && jefe !== null)) {
    const eq = barajar(st.desbloqueados).slice(0, 3);
    const pelea = L.proximaPelea(st);
    const arena = A.combateAuto(eq.map(k => ({ key: k })), pelea.rivales.map(x => ({ key: x.key })));
    const r = L.registrarResultado(st, pelea, arena, eq);
    peleas++;
    turnosAcum += arena.turno;
    if (arena.fin === 'A') rachaL = 0; else { rachaL++; peorRachaL = Math.max(peorRachaL, rachaL); }
    if (unlock === null && r.desbloqueos.length) unlock = peleas;
    if (jefe === null && pelea.tipo === 'jefe') jefe = peleas;
  }
  if (unlock !== null) primUnlock.push(unlock); else sinUnlockEn10++;
  if (jefe !== null) primJefe.push(jefe);
  turnos10.push(turnosAcum / peleas);
  derrotasSeguidas.push(peorRachaL);
  if (peorRachaL >= 4) muerteTemprana++;
}

const med = (a) => a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0;
const pct = (a, p) => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length * p)] || 0; };
const min = (peleas, tpp) => (peleas * (tpp / 2) * SEG_POR_TURNO / 60);

console.log(`\n⏱  ENGANCHE — ${N} arranques de partida (${SEG_POR_TURNO}s por decisión)\n`);
const tpp = med(turnos10);
console.log(`  turnos por pelea: ${tpp.toFixed(1)}  →  una pelea son ~${(tpp / 2 * SEG_POR_TURNO / 60).toFixed(1)} min de reloj`);
console.log(`\n  PRIMER animal desbloqueado: pelea ${med(primUnlock).toFixed(1)} de media`);
console.log(`     · mediana pelea ${pct(primUnlock, .5)} → ~${min(pct(primUnlock, .5), tpp).toFixed(0)} min de juego`);
console.log(`     · al 25% más lento le toma ${pct(primUnlock, .75)} peleas → ~${min(pct(primUnlock, .75), tpp).toFixed(0)} min`);
console.log(`     · arranques SIN ningún desbloqueo en 60 peleas: ${sinUnlockEn10}`);
console.log(`\n  PRIMER cabecilla: pelea ${med(primJefe).toFixed(1)} → ~${min(med(primJefe), tpp).toFixed(0)} min`);
console.log(`\n  peor racha de derrotas al principio: ${med(derrotasSeguidas).toFixed(1)} de media`);
console.log(`     · partidas con 4+ derrotas seguidas (frustración): ${(muerteTemprana / N * 100).toFixed(1)}%`);

// cuánto dura la LIGA entera en tiempo humano
const PELEAS_LIGA = 96, TURNOS = 26;
console.log(`\n  ⚠️  LIGA COMPLETA: ~${PELEAS_LIGA} peleas × ${TURNOS} turnos`);
console.log(`     = ${(PELEAS_LIGA * TURNOS / 2 * SEG_POR_TURNO / 3600).toFixed(1)} HORAS de juego real`);
