// ============================================================
// liga.js — EL JUEGO NUEVO (rediseño 20-jul, estructura Naruto-Arena).
// Se descartó el tablero: ahora es una LIGA de combates por turnos.
//   · Elegís 3 del refugio → peleás contra rivales AL AZAR de la provincia.
//   · Cada 4 victorias te espera el CABECILLA (con su escena de historia).
//   · Vencés al cabecilla → siguiente provincia (7 + Monteverde al final).
//   · Después de Monteverde: liga libre, y las LEYENDAS aparecen de jefes.
//   · ~30 animales fijos desbloqueados; TODOS los demás, por MISIONES.
//   · Vida 100 parejo; ganar da XP → el nivel desbloquea habilidades (1/4/8).
// Persistencia: localStorage 'fauna_liga_v1'. Lógica pura: la UI la consume.
// ============================================================

import { SP, COUNTRIES, SECRET } from './fauna_roster.js';
import { MISIONES, misionAutoDe, rangoDe } from './misiones.js';
import { habsDe } from './habilidades.js';
import { bossOf } from './historia.js';

const LS = 'fauna_liga_v1';
export const WINS_PARA_JEFE = 4;

// ---------- los ~30 desbloqueados de base ----------
// Comunes (y un par de raros accesibles) cubriendo TODOS los roles y biomas.
export const BASE = [
  // básicos de arranque
  'perro', 'gato', 'comemaiz',
  // bosque
  'perezoso', 'pizote', 'mapache', 'martilla', 'olingo', 'zorro_pelon',
  'monocara', 'ardilla', 'murcielago', 'abeja', 'rana_ojos_rojos', 'tucancillo',
  // sabana
  'iguana', 'garrobo', 'armadillo', 'venado', 'bienteveo', 'zopilote_negro',
  // agua
  'tortuga', 'jicotea', 'garza', 'cangrejo', 'mapache_cangrejero', 'sapo_marino',
  // montaña
  'anolis', 'yiguirro', 'comadreja', 'geco',
].filter(k => SP[k]);

// ---------- niveles por XP (ganar = +2 · jefe = +4; cap Nv8) ----------
const XP_NIVEL = [0, 2, 5, 9, 14, 20, 27, 35];   // xp mínimo para Nv 1..8
export const nivelDeXp = (xp) => {
  let nv = 1;
  for (let i = 0; i < XP_NIVEL.length; i++) if (xp >= XP_NIVEL[i]) nv = i + 1;
  return Math.min(8, nv);
};
export const xpParaSiguiente = (xp) => {
  const nv = nivelDeXp(xp);
  return nv >= 8 ? null : XP_NIVEL[nv] - xp;
};

// ---------- estado ----------
export function nuevoEstado() {
  return {
    v: 1,
    guia: null,                        // {name, guide:'hombre'|'mujer'}
    record: { w: 0, l: 0 }, racha: 0, mejorRacha: 0,
    liberados: 0,                      // cada victoria libera a los 3 del rival
    animales: Object.fromEntries(BASE.map(k => [k, { xp: 0 }])),
    desbloqueados: [...BASE],
    prov: 0, winsProv: 0,              // 0-6 provincias · 7 Monteverde · 8+ liga libre
    jefesVencidos: 0, ganoJuego: false,
    folkVencidos: [],
    stats: { curado: 0, robado: 0, contraatacado: 0 },
    rachasMision: {},                  // rachas con filtro, por misión
    totalesMision: {},                 // totales con filtro, por misión
    ultimoEquipo: [],
    vistas: {},                        // escenas de historia ya vistas
    peleasLibres: 0,                   // contador en liga libre (para jefes sorpresa)
  };
}
export function cargar() {
  try {
    const raw = localStorage.getItem(LS);
    if (raw) {
      const st = { ...nuevoEstado(), ...JSON.parse(raw) };
      // migración suave: garantizar la BASE
      for (const k of BASE) if (!st.animales[k]) { st.animales[k] = { xp: 0 }; }
      st.desbloqueados = [...new Set([...st.desbloqueados, ...BASE])];
      return st;
    }
  } catch {}
  return nuevoEstado();
}
export function guardar(st) {
  try { localStorage.setItem(LS, JSON.stringify(st)); } catch {}
}
export const nivelDe = (st, key) => nivelDeXp(st.animales[key]?.xp || 0);
export const desbloqueado = (st, key) => st.desbloqueados.includes(key);

// ---------- provincia / progresión ----------
export const provinciaActual = (st) =>
  st.prov < 7 ? COUNTRIES[st.prov] : SECRET;    // liga libre: Monteverde de fondo
export const enLigaLibre = (st) => st.prov > 7;
export const tocaJefe = (st) =>
  !enLigaLibre(st) ? st.winsProv >= WINS_PARA_JEFE
                   : (st.peleasLibres + 1) % 5 === 0;   // liga libre: jefe cada 5

const FONDO_PROV = {
  'San José': 'lugar_sanjose', 'Alajuela': 'lugar_alajuela', 'Cartago': 'lugar_cartago',
  'Heredia': 'lugar_heredia', 'Guanacaste': 'lugar_guanacaste',
  'Puntarenas': 'lugar_puntarenas', 'Limón': 'lugar_limon', 'Monteverde': 'lugar_monteverde',
};
export const fondoDe = (prov, esFolk) =>
  esFolk ? 'assets/escenarios/bg_sanatorio.png'
         : `assets/escenarios/${FONDO_PROV[prov.n] || 'bioma_bosque'}.png`;

// nivel de los rivales: sube con la provincia; el jefe pega +2
const nivelRival = (st, esJefe) => {
  const base = Math.min(8, 1 + Math.floor(st.prov * 0.9) + (esJefe ? 2 : 0));
  return Math.max(1, Math.min(8, base + (Math.random() < 0.35 ? 1 : 0) - (Math.random() < 0.25 ? 1 : 0)));
};

const alAzar = (arr, n) => {
  const c = arr.slice();
  for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [c[i], c[j]] = [c[j], c[i]]; }
  return c.slice(0, n);
};

// ---------- la siguiente pelea ----------
export function proximaPelea(st) {
  const prov = enLigaLibre(st) ? COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)] : provinciaActual(st);
  const esJefe = tocaJefe(st);

  // liga libre: los jefes pueden ser LEYENDAS del Tenebroso (para desbloquearlas)
  if (esJefe && enLigaLibre(st)) {
    const pendientes = ['f_carreta', 'f_segua', 'f_cadejos', 'f_tulevieja', 'f_padre', 'f_llorona']
      .filter(k => !st.folkVencidos.includes(k));
    if (pendientes.length && Math.random() < 0.6) {
      const key = pendientes[Math.floor(Math.random() * pendientes.length)];
      return {
        tipo: 'leyenda', key, prov,
        rivales: [{ key, nivel: 8 }],
        titulo: SP[key].n.toUpperCase(), sub: 'Leyenda de Costa Rica',
        bigart: `assets/folclor/${key}.png`, rivalArt: `assets/folclor/${key}.png`,
        fondo: fondoDe(prov, true),
      };
    }
  }

  const pool = prov.pool.filter(k => SP[k]);
  const keys = alAzar(pool, 3);
  const b = esJefe ? bossOf(prov.n) : null;
  return {
    tipo: esJefe ? 'jefe' : 'normal', prov,
    rivales: keys.map(k => ({ key: k, nivel: nivelRival(st, esJefe) })),
    titulo: esJefe ? b.n.toUpperCase() : `CAZADORES DE ${prov.n.toUpperCase()}`,
    sub: esJefe ? b.t : prov.n,
    bigart: esJefe ? `assets/personajes/${b.art}.png` : null,
    rivalArt: esJefe ? `assets/personajes/${b.art}.png` : null,
    fondo: fondoDe(prov, false),
  };
}

// ============================================================
// RESULTADO de una pelea → progreso, XP, misiones, desbloqueos.
// `arenaSt` es el estado final de src/arena.js (st.log incluido).
// Devuelve { subidas:[{key,de,a}], desbloqueos:[key], provinciaLiberada, ganoJuego }
// ============================================================
export function registrarResultado(st, pelea, arenaSt, equipo) {
  const gane = arenaSt.fin === 'A';
  const out = { subidas: [], desbloqueos: [], provinciaLiberada: null, ganoJuego: false, leyenda: null };
  st.ultimoEquipo = equipo.slice();

  // ---- resumen de la pelea (para misiones) ----
  const log = arenaSt.log || [];
  const caidosMios = arenaSt.unidades.filter(u => u.lado === 'A' && !u.viva).length;
  const vivosMios = arenaSt.unidades.filter(u => u.lado === 'A' && u.viva).length;
  const useEsquiva = log.some(e => e.t === 'usa' && String(e.uid).startsWith('A') && e.hab === 'Esquivar');
  const curadoAhora = log.filter(e => e.t === 'cura' && String(e.uid).startsWith('A')).reduce((s, e) => s + (e.v || 0), 0);
  const robadoAhora = log.filter(e => e.t === 'robarEnergia' && String(e.uid).startsWith('A')).length;
  const contraAhora = log.filter(e => e.t === 'contra' && String(e.de).startsWith('A')).reduce((s, e) => s + (e.v || 0), 0);
  const caidasB = log.filter(e => e.t === 'cae' && String(e.uid).startsWith('B'));
  const masFuerteB = arenaSt.unidades.filter(u => u.lado === 'B').sort((a, b) => b.nivel - a.nivel)[0];
  const primeroElFuerte = caidasB.length > 0 && masFuerteB && caidasB[0].uid === masFuerteB.uid;
  st.stats.curado += curadoAhora; st.stats.robado += robadoAhora; st.stats.contraatacado += contraAhora;

  // ---- récord, racha, liberados, XP ----
  if (gane) {
    st.record.w++; st.racha++; st.mejorRacha = Math.max(st.mejorRacha, st.racha);
    st.liberados += arenaSt.unidades.filter(u => u.lado === 'B').length;
    const xpGanada = (pelea.tipo === 'normal') ? 2 : 4;
    for (const k of equipo) {
      const a = st.animales[k]; if (!a) continue;
      const antes = nivelDeXp(a.xp);
      a.xp += xpGanada;
      const ahora = nivelDeXp(a.xp);
      if (ahora > antes) out.subidas.push({ key: k, de: antes, a: ahora });
    }
  } else {
    st.record.l++; st.racha = 0;
  }

  // ---- progresión de provincia ----
  if (gane && pelea.tipo === 'jefe') {
    st.jefesVencidos++;
    out.provinciaLiberada = pelea.prov.n;
    if (st.prov === 7) { st.ganoJuego = true; out.ganoJuego = true; }
    st.prov++; st.winsProv = 0;
  } else if (gane && pelea.tipo === 'normal' && !enLigaLibre(st)) {
    st.winsProv++;
  }
  if (gane && pelea.tipo === 'leyenda' && !st.folkVencidos.includes(pelea.key)) {
    st.folkVencidos.push(pelea.key);
    out.leyenda = pelea.key;
  }
  if (enLigaLibre(st)) st.peleasLibres++;

  // ---- misiones: actualizar contadores por misión ----
  const contexto = {
    gane, equipo, caidosMios, vivosMios, useEsquiva, primeroElFuerte,
    biomaPuro: equipo.length === 3 && new Set(equipo.map(k => SP[k]?.bio)).size === 1
      ? SP[equipo[0]].bio : null,
    esJefe: pelea.tipo === 'jefe',
    ganoJuegoAhora: out.ganoJuego,
  };
  for (const key of Object.keys(SP)) {
    if (desbloqueado(st, key)) continue;
    const m = misionDeLiga(key);
    if (!m) continue;
    avanzarMision(st, key, m, contexto);
    if (misionCumplida(st, key, m)) {
      st.desbloqueados.push(key);
      st.animales[key] = st.animales[key] || { xp: 0 };
      out.desbloqueos.push(key);
    }
  }

  guardar(st);
  return out;
}

// ---------- misiones ----------
export const misionDeLiga = (key) => MISIONES[key] || misionAutoDe(key, SP[key]);

function cumpleFiltro(obj, ctx) {
  if (obj.conEquipo && !obj.conEquipo.some(k => ctx.equipo.includes(k))) return false;
  if (obj.bioma && ctx.biomaPuro !== obj.bioma) return false;
  if (obj.sinCaidos && ctx.caidosMios > 0) return false;
  if (obj.sinEsquiva && ctx.useEsquiva) return false;
  if (obj.soloUnoVivo && ctx.vivosMios !== 1) return false;
  if (obj.primeroElFuerte && !ctx.primeroElFuerte) return false;
  if (obj.conClase) {
    const trae = ctx.equipo.some(k => {
      const kit = habsDe(k, 8);
      return kit.habs.some(h => (h.clases || []).includes(obj.conClase));
    });
    if (!trae) return false;
  }
  if (obj.soloClase) return false;      // (clase única: pendiente de rastreo fino)
  return true;
}

function avanzarMision(st, key, m, ctx) {
  const obj = m.obj;
  switch (obj.tipo) {
    case 'racha':
      if (ctx.gane && cumpleFiltro(obj, ctx)) st.rachasMision[key] = (st.rachasMision[key] || 0) + 1;
      else if (!ctx.gane) st.rachasMision[key] = 0;
      else if (obj.sinCaidos && ctx.caidosMios > 0) st.rachasMision[key] = 0;
      break;
    case 'total':
      if (ctx.gane && cumpleFiltro(obj, ctx)) st.totalesMision[key] = (st.totalesMision[key] || 0) + 1;
      break;
    case 'vencer':
      if (ctx.gane && ctx.esJefe && cumpleFiltro(obj, ctx))
        st.totalesMision[key] = (st.totalesMision[key] || 0) + 1;
      break;
    case 'ganarJuego':
      if (ctx.ganoJuegoAhora && cumpleFiltro(obj, ctx)) st.totalesMision[key] = 1;
      break;
    // liberar / rescatar / curado / robado / contraatacado / vencerFolk:
    // se evalúan directo en progresoMision (contadores globales)
  }
}

export function progresoMision(st, key, m = misionDeLiga(key)) {
  if (!m) return { n: 0, meta: 1 };
  const obj = m.obj;
  switch (obj.tipo) {
    case 'racha':   return { n: Math.min(st.rachasMision[key] || 0, obj.n), meta: obj.n };
    case 'total':
    case 'vencer':  return { n: Math.min(st.totalesMision[key] || 0, obj.n || 1), meta: obj.n || 1 };
    case 'liberar': return { n: Math.min(st.liberados, obj.n), meta: obj.n };
    case 'rescatar': {
      // solo cuentan las especies GANADAS (las ~30 de base no valen, si no
      // misiones como la de la Danta se cumplirían solas el día 1)
      const tengo = st.desbloqueados.filter(k =>
        !BASE.includes(k) && (!obj.bioma || SP[k]?.bio === obj.bioma)).length;
      return { n: Math.min(tengo, obj.n), meta: obj.n };
    }
    case 'curado':  return { n: Math.min(st.stats.curado, obj.n), meta: obj.n };
    case 'robado':  return { n: Math.min(st.stats.robado, obj.n), meta: obj.n };
    case 'contraatacado': return { n: Math.min(st.stats.contraatacado, obj.n), meta: obj.n };
    case 'ganarJuego': return { n: st.totalesMision[key] ? 1 : 0, meta: 1 };
    case 'vencerFolk': return { n: st.folkVencidos.includes(obj.key) ? 1 : 0, meta: 1 };
    default: return { n: 0, meta: obj.n || 1 };
  }
}
export function misionCumplida(st, key, m = misionDeLiga(key)) {
  if (!m) return false;
  const p = progresoMision(st, key, m);
  let ok = p.n >= p.meta;
  if (ok && m.obj.y) {                     // objetivo anidado (ej: sapo dorado)
    const py = progresoMision(st, key, { obj: m.obj.y });
    ok = py.n >= py.meta;
  }
  return ok;
}

// lista para la pantalla de misiones, agrupada por rango
export function listaMisiones(st) {
  const out = { D: [], C: [], B: [], A: [], S: [] };
  for (const key of Object.keys(SP)) {
    if (SP[key].starter) continue;
    if (desbloqueado(st, key)) continue;
    const m = misionDeLiga(key);
    if (!m) continue;
    const p = progresoMision(st, key, m);
    (out[m.rango] || out.D).push({ key, sp: SP[key], m, p });
  }
  return out;
}
