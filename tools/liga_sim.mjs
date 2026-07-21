// ============================================================
// liga_sim.mjs — SIMULADOR de la liga nueva (rediseño ARENA).
// Juega N ligas completas de punta a punta usando el motor real
// (src/arena.js) y la progresión real (src/liga.js). Mide balance,
// ritmo, desbloqueos y busca cuelgues/excepciones.
//
//   node tools/liga_sim.mjs [partidas] [perfil]
//   perfiles: novato | normal | experto | todos   (default: todos)
// ============================================================

import * as A from '../src/arena.js';
import * as L from '../src/liga.js';
import { SP } from '../src/fauna_roster.js';
import { habsDe } from '../src/habilidades.js';

// Math.max(...arr) revienta la pila con cientos de miles de elementos (con
// 10.000 ligas son 322.000 turnos): reduce() no tiene ese límite.
const mayor = (a) => a.reduce((m, x) => x > m ? x : m, -Infinity);
const menor = (a) => a.reduce((m, x) => x < m ? x : m, Infinity);

const N = Number(process.argv[2] || 1000);
const PERFIL_ARG = process.argv[3] || 'todos';
const MAX_PELEAS = 400;          // tope por liga (para detectar ligas que no terminan)

// ---------- perfiles de jugador ----------
// Cada uno arma el equipo de 3 con otro criterio.
const PERFILES = {
  // toca lo primero que ve
  novato: (st) => barajar(st.desbloqueados).slice(0, 3),
  // elige por kit "que se ve fuerte" (lo que haría un jugador normal leyendo)
  normal: (st) => barajar(st.desbloqueados)
    .sort((a, b) => valorKit(b) - valorKit(a)).slice(0, 3),
  // mejor kit + biomas variados (para no depender de una sola energía)
  experto: (st) => {
    const cand = st.desbloqueados.slice().sort((a, b) => valorKit(b) - valorKit(a));
    const eq = [], biomas = new Set();
    for (const k of cand) {
      if (eq.length === 3) break;
      if (biomas.has(SP[k].bio) && eq.length < 2) continue;   // variar bioma al principio
      eq.push(k); biomas.add(SP[k].bio);
    }
    for (const k of cand) { if (eq.length === 3) break; if (!eq.includes(k)) eq.push(k); }
    return eq;
  },
};
// heurística simple: cuánto "ofrece" el kit de un animal
function valorKit(key) {
  const kit = habsDe(key);
  let v = 0;
  for (const h of kit.habs) for (const f of (h.efectos || [])) {
    if (f.t === 'dano') v += (f.obj === 'todos' ? f.v * 2 : f.v);
    if (f.t === 'danoTurnos') v += f.v * (f.turnos || 1);
    if (f.t === 'curar') v += f.v;
    if (f.t === 'defensa') v += f.v * 0.8;
    if (f.t === 'exponer') v += 25;
    if (f.t === 'aturdir') v += 20;
    if (f.t === 'robarEnergia') v += 12;
    if (f.t === 'modo') v += 25;
  }
  return v;
}
const barajar = (a) => { const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; };

// ---------- una liga completa ----------
function jugarLiga(perfil) {
  const st = L.nuevoEstado();
  st.guia = { name: 'sim', guide: 'hombre' };
  const r = {
    peleas: 0, w: 0, l: 0, jefesW: 0, jefesL: 0, provincias: 0,
    gano: false, desbloqueos: 0, turnos: [], excepciones: [],
    winsPorTipo: { normal: [0, 0], jefe: [0, 0], leyenda: [0, 0] },
    usoAnimal: {}, winAnimal: {}, colgada: false,
  };
  let extra = 0;
  while (r.peleas < MAX_PELEAS) {
    // se juega hasta ganar Monteverde y luego 25 peleas de LIGA LIBRE
    // (ahí es donde aparecen las leyendas del Tenebroso)
    if (st.ganoJuego) { r.gano = true; if (extra++ > 25) break; }
    const equipo = PERFILES[perfil](st).filter(k => L.desbloqueado(st, k));
    if (equipo.length < 3) { r.excepciones.push('equipo incompleto'); break; }
    let pelea, arenaSt;
    try {
      pelea = L.proximaPelea(st);
      arenaSt = A.combateAuto(
        equipo.map(k => ({ key: k })),
        pelea.rivales.map(x => ({ key: x.key })));
      L.registrarResultado(st, pelea, arenaSt, equipo);
    } catch (e) {
      r.excepciones.push(`${e.message} @${pelea?.tipo || '?'}`);
      break;
    }
    const gane = arenaSt.fin === 'A';
    r.peleas++;
    r.turnos.push(arenaSt.turno);
    if (arenaSt.turno >= 200) r.colgada = true;
    const t = pelea.tipo;
    r.winsPorTipo[t][gane ? 0 : 1]++;
    if (gane) r.w++; else r.l++;
    if (t === 'jefe') { if (gane) r.jefesW++; else r.jefesL++; }
    for (const k of equipo) {
      r.usoAnimal[k] = (r.usoAnimal[k] || 0) + 1;
      if (gane) r.winAnimal[k] = (r.winAnimal[k] || 0) + 1;
    }
  }
  r.provincias = Math.min(st.prov, 8);
  r.desbloqueos = st.desbloqueados.length - L.BASE.length;
  r.record = st.record; r.mejorRacha = st.mejorRacha;
  if (r.peleas >= MAX_PELEAS) r.tope = true;
  return r;
}

// ---------- correr ----------
const perfiles = PERFIL_ARG === 'todos' ? ['novato', 'normal', 'experto'] : [PERFIL_ARG];
const porPerfil = Math.max(1, Math.round(N / perfiles.length));
console.log(`\n🎮 SIMULACIÓN DE LA LIGA — ${N} partidas (${porPerfil} por perfil)\n`);

const globalUso = {}, globalWin = {};
const resumen = {};

for (const perfil of perfiles) {
  const ligas = [];
  const t0 = Date.now();
  for (let i = 0; i < porPerfil; i++) ligas.push(jugarLiga(perfil));
  const ms = Date.now() - t0;

  const suma = (f) => ligas.reduce((s, x) => s + f(x), 0);
  const ganadas = ligas.filter(x => x.gano).length;
  const peleas = suma(x => x.peleas);
  const w = suma(x => x.w), l = suma(x => x.l);
  const turnos = ligas.flatMap(x => x.turnos);
  const exc = ligas.flatMap(x => x.excepciones);
  const colgadas = ligas.filter(x => x.colgada).length;
  const topes = ligas.filter(x => x.tope).length;
  const tipo = { normal: [0, 0], jefe: [0, 0], leyenda: [0, 0] };
  for (const x of ligas) for (const t of Object.keys(tipo)) {
    tipo[t][0] += x.winsPorTipo[t][0]; tipo[t][1] += x.winsPorTipo[t][1];
  }
  for (const x of ligas) {
    for (const k in x.usoAnimal) globalUso[k] = (globalUso[k] || 0) + x.usoAnimal[k];
    for (const k in x.winAnimal) globalWin[k] = (globalWin[k] || 0) + x.winAnimal[k];
  }
  const pct = (a, b) => b ? (a / b * 100).toFixed(1) + '%' : '—';
const med = (a) => a.length ? (a.reduce((s, x) => s + x, 0) / a.length).toFixed(1) : '—';

  resumen[perfil] = { ganadas, peleas, w, l, tipo, ligas };
  console.log(`── ${perfil.toUpperCase()} ${'─'.repeat(46 - perfil.length)}`);
  console.log(`  ligas terminadas (ganó Monteverde): ${ganadas}/${ligas.length} (${pct(ganadas, ligas.length)})`);
  console.log(`  victorias: ${pct(w, w + l)}  ·  ${w}W-${l}L en ${peleas} peleas`);
  console.log(`    · normales:  ${pct(tipo.normal[0], tipo.normal[0] + tipo.normal[1])}  (${tipo.normal[0]}W-${tipo.normal[1]}L)`);
  console.log(`    · cabecillas:${pct(tipo.jefe[0], tipo.jefe[0] + tipo.jefe[1])}  (${tipo.jefe[0]}W-${tipo.jefe[1]}L)`);
  console.log(`    · leyendas:  ${pct(tipo.leyenda[0], tipo.leyenda[0] + tipo.leyenda[1])}  (${tipo.leyenda[0]}W-${tipo.leyenda[1]}L)`);
  console.log(`  peleas por liga: ${med(ligas.map(x => x.peleas))}  ·  turnos por pelea: ${med(turnos)} (máx ${mayor(turnos)})`);
  console.log(`  desbloqueos por liga: ${med(ligas.map(x => x.desbloqueos))}  ·  mejor racha: ${med(ligas.map(x => x.mejorRacha))}`);
  console.log(`  provincias liberadas: ${med(ligas.map(x => x.provincias))}/8`);
  console.log(`  ⚠️  excepciones: ${exc.length}${exc.length ? ' → ' + [...new Set(exc)].slice(0, 3).join(' | ') : ''}`);
  console.log(`  ⚠️  peleas que llegaron al tope de 200 turnos: ${colgadas} · ligas al tope de ${MAX_PELEAS}: ${topes}`);
  console.log(`  (${ms} ms)\n`);
}

// ---------- animales: los mejores y los peores ----------
const filas = Object.keys(globalUso)
  .filter(k => globalUso[k] >= 40)
  .map(k => ({ k, n: SP[k]?.n || k, uso: globalUso[k], wr: (globalWin[k] || 0) / globalUso[k] }))
  .sort((a, b) => b.wr - a.wr);
if (filas.length) {
  console.log('── ANIMALES (≥40 usos) ' + '─'.repeat(30));
  const line = (f) => `     ${f.n.padEnd(26).slice(0, 26)} ${(f.wr * 100).toFixed(1).padStart(5)}%  (${f.uso} usos)`;
  console.log('  🏆 mejores:'); filas.slice(0, 8).forEach(f => console.log(line(f)));
  console.log('  💀 peores:');  filas.slice(-8).reverse().forEach(f => console.log(line(f)));
  const wrs = filas.map(f => f.wr);
  console.log(`  brecha mejor–peor: ${((mayor(wrs) - menor(wrs)) * 100).toFixed(1)} puntos\n`);
}
