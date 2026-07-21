// ============================================================
// auditar_misiones.mjs — ¿se puede desbloquear DE VERDAD cada animal?
//
// No alcanza con que la misión exista: puede pedir algo imposible (una clase de
// habilidad que ningún animal tiene), o depender de un animal que a su vez está
// bloqueado, o exigir tantas victorias seguidas que nadie va a llegar.
// Este script revisa las 136 misiones y marca las que están rotas.
//
//   node tools/auditar_misiones.mjs
// ============================================================
import { SP } from '../src/fauna_roster.js';
import { BASE, misionDeLiga, nuevoEstado } from '../src/liga.js';
import { habsDe } from '../src/habilidades.js';

const keys = Object.keys(SP);
const noBase = keys.filter(k => !BASE.includes(k) && !SP[k].starter);
const problemas = [];
const noSimulables = [];   // misiones que la IA del simulador no puede cumplir
const porTipo = {};
const porRango = {};

// qué clases de habilidad existen de verdad en todo el roster
const clasesQueExisten = new Set();
for (const k of keys) for (const h of habsDe(k).habs) for (const c of (h.clases || [])) clasesQueExisten.add(c);

for (const key of noBase) {
  const m = misionDeLiga(key);
  if (!m) { problemas.push([key, 'SIN MISIÓN', 'no tiene misión: es indesbloqueable']); continue; }
  const o = m.obj;
  porTipo[o.tipo] = (porTipo[o.tipo] || 0) + 1;
  porRango[m.rango] = (porRango[m.rango] || 0) + 1;

  // 1. tipos que el motor de liga.js no sabe evaluar
  const CONOCIDOS = ['racha', 'total', 'vencer', 'liberar', 'rescatar', 'curado',
                     'robado', 'contraatacado', 'ganarJuego', 'vencerFolk'];
  if (!CONOCIDOS.includes(o.tipo))
    problemas.push([key, 'TIPO DESCONOCIDO', `tipo "${o.tipo}": progresoMision devuelve 0 y nunca se cumple`]);

  // 2. filtros que la IA del simulador no puede cumplir: NO son un problema,
  //    pero hay que saber que el % empírico de abajo no vale para ellas.
  //    Se prueban a mano en test/misiones.test.mjs.
  if (o.soloClase || o.sinEsquiva || o.soloUnoVivo)
    noSimulables.push(key);

  // 3. pide una clase de habilidad que ningún animal tiene
  if (o.conClase && !clasesQueExisten.has(o.conClase))
    problemas.push([key, 'CLASE INEXISTENTE', `pide clase "${o.conClase}" y ningún animal la tiene`]);

  // 4. pide tener en el equipo a un animal que no existe
  for (const dep of (o.conEquipo || []))
    if (!SP[dep]) problemas.push([key, 'DEPENDE DE FANTASMA', `pide a "${dep}", que no está en el roster`]);

  // 5. cadena de dependencias: pide un animal que a su vez hay que desbloquear
  const bloqueadas = (o.conEquipo || []).filter(d => SP[d] && !BASE.includes(d));
  if (bloqueadas.length && bloqueadas.length === (o.conEquipo || []).length)
    problemas.push([key, 'DEPENDENCIA', `necesita a ${bloqueadas.join(' o ')}, que también hay que desbloquear`]);

  // 6. rachas absurdas
  if (o.tipo === 'racha' && o.n >= 10)
    problemas.push([key, 'RACHA MUY LARGA', `pide ${o.n} victorias seguidas`]);

  // 7. metas de contadores globales fuera de escala
  if (['curado', 'robado', 'contraatacado', 'liberar'].includes(o.tipo) && o.n > 400)
    problemas.push([key, 'META ALTA', `pide ${o.n} de ${o.tipo}`]);
}

// ============================================================
// Parte 2 — EMPÍRICA: jugar ligas completas y ver quién se desbloquea
// de verdad. Una misión puede ser válida en el papel y aun así no salir
// nunca (racha muy larga, filtro que casi no se da, animal que nadie usa).
// ============================================================
// ⚠️ El perfil importa. Un jugador que arma el equipo AL AZAR nunca va a
// completar "ganá 5 seguidas con equipo de puro agua", y eso NO significa que
// la misión esté rota: significa que pide intención. Por eso se mide con dos
// jugadores y solo se considera ROTA la que ni el cazamisiones logra.
//   azar          — agarra 3 cualesquiera
//   cazamisiones  — elige una misión pendiente y arma el equipo PARA esa misión
async function empirica(n = 60, perfil = 'azar') {
  const A = await import('../src/arena.js');
  const L = await import('../src/liga.js');
  const veces = {};
  for (const k of noBase) veces[k] = 0;
  let ligas = 0;

  for (let i = 0; i < n; i++) {
    const st = L.nuevoEstado();
    st.guia = { name: 'sim', guide: 'hombre' };
    let peleas = 0, extra = 0, objetivo = null;
    while (peleas < 400) {
      if (st.ganoJuego && extra++ > 25) break;

      let eq;
      if (perfil === 'cazamisiones') {
        // ¿sigue pendiente el objetivo? si no, elegir otro
        if (!objetivo || L.desbloqueado(st, objetivo)) {
          const pend = noBase.filter(k => !L.desbloqueado(st, k) && misionDeLiga(k));
          objetivo = pend.length ? pend[Math.floor(Math.random() * pend.length)] : null;
        }
        eq = equipoPara(st, L, objetivo);
      } else {
        eq = barajar(st.desbloqueados).slice(0, 3);
      }
      if (eq.length < 3) break;

      const pelea = L.proximaPelea(st);
      const arena = A.combateAuto(eq.map(k => ({ key: k })), pelea.rivales.map(x => ({ key: x.key })));
      L.registrarResultado(st, pelea, arena, eq);
      peleas++;
    }
    ligas++;
    for (const k of st.desbloqueados) if (k in veces) veces[k]++;
  }
  return { veces, ligas };
}

// arma el mejor equipo posible para cumplir la misión de `objetivo`
function equipoPara(st, L, objetivo) {
  const libres = st.desbloqueados.slice();
  if (!objetivo) return barajar(libres).slice(0, 3);
  const o = misionDeLiga(objetivo).obj;
  let cand = libres;
  if (o.bioma) {                                   // equipo de un solo bioma
    const delBioma = libres.filter(k => SP[k]?.bio === o.bioma);
    if (delBioma.length >= 3) cand = delBioma;
  }
  const eq = [];
  if (o.conEquipo) for (const k of o.conEquipo)    // meter al que la misión pide
    if (libres.includes(k) && !eq.includes(k)) eq.push(k);
  for (const k of barajar(cand)) { if (eq.length >= 3) break; if (!eq.includes(k)) eq.push(k); }
  for (const k of barajar(libres)) { if (eq.length >= 3) break; if (!eq.includes(k)) eq.push(k); }
  return eq.slice(0, 3);
}
const barajar = (a) => { const c = a.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; } return c; };

console.log(`\nAnimales que hay que desbloquear: ${noBase.length} (de ${keys.length} del roster)`);
console.log('por tipo de misión:', porTipo);
console.log('por rango:', porRango);

if (!problemas.length) {
  console.log('\n✅ ninguna misión rota');
} else {
  console.log(`\n⚠️  ${problemas.length} misiones con problema:\n`);
  const grupos = {};
  for (const [k, t, d] of problemas) (grupos[t] = grupos[t] || []).push([k, d]);
  for (const [t, l] of Object.entries(grupos)) {
    console.log(`── ${t} (${l.length})`);
    for (const [k, d] of l) console.log(`   ${(SP[k]?.n || k).padEnd(28)} ${d}`);
  }
}

// ---- correr la parte empírica con los dos perfiles ----
const N = Number(process.argv[2] || 60);
const azar = await empirica(N, 'azar');
const caza = await empirica(N, 'cazamisiones');

const filas = noBase.map(k => ({
  k, n: SP[k].n, m: misionDeLiga(k),
  pAzar: azar.veces[k] / azar.ligas,
  pCaza: caza.veces[k] / caza.ligas,
})).sort((a, b) => a.pCaza - b.pCaza || a.pAzar - b.pAzar);

// las que la IA no puede jugar se sacan del veredicto: su 0% no dice nada
const rotas = filas.filter(f => f.pCaza === 0 && !noSimulables.includes(f.k));
const aParte = filas.filter(f => noSimulables.includes(f.k));
const durisimas = filas.filter(f => f.pCaza > 0 && f.pCaza < 0.2);
const soloIntencion = filas.filter(f => f.pAzar === 0 && f.pCaza >= 0.2);

console.log(`\n=== ¿quién se desbloquea de verdad? (${azar.ligas} ligas por perfil) ===`);
console.log(`  jugando AL AZAR se desbloquean:     ${filas.filter(f => f.pAzar > 0).length}/${filas.length}`);
console.log(`  CAZANDO misiones se desbloquean:    ${filas.filter(f => f.pCaza > 0).length}/${filas.length}`);

if (soloIntencion.length) {
  console.log(`\n👍 piden INTENCIÓN (al azar no salen, cazándolas sí) — están bien: ${soloIntencion.length}`);
  for (const f of soloIntencion.slice(0, 8))
    console.log(`   ${(f.pCaza * 100).toFixed(0).padStart(3)}%  ${f.n.padEnd(26)} ${f.m.obj.tipo} ${f.m.obj.n || ''}`);
}
if (durisimas.length) {
  console.log(`\n⚠️  DURÍSIMAS (ni cazándolas salen 1 de cada 5): ${durisimas.length}`);
  for (const f of durisimas)
    console.log(`   ${(f.pCaza * 100).toFixed(0).padStart(3)}%  ${f.n.padEnd(26)} [${f.m.rango}] ${f.m.desc || ''}`);
}
if (rotas.length) {
  console.log(`\n🚫 ROTAS — no salen ni persiguiéndolas a propósito: ${rotas.length}\n`);
  for (const f of rotas)
    console.log(`   ${f.n.padEnd(26)} [${f.m.rango}] ${f.m.obj.tipo} ${f.m.obj.n || ''} · ${f.m.desc || f.m.n}`);
}
