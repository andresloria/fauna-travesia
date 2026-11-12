// ============================================================
// travesia/aventura.js — MODO AVENTURA del prototipo Travesía.
//
// Estructura copiada de las dos puntas:
//   · de Pokémon Duel, el modo "Quests": etapas, y 3 peleas por etapa;
//   · de tu propio juego, las 7 provincias con sus cazadores y su cabecilla,
//     y la idea de que ganar DESBLOQUEA animales (la progresión es coleccionar).
//
// ⚠️ GUARDA EN SU PROPIA CLAVE (`fauna_travesia_v1`). El modo aventura de la
// arena usa `fauna_liga_v1`: si compartieran clave, jugar el prototipo te
// pisaría el progreso real de la campaña. Son dos juegos distintos.
//
// Lógica PURA: no toca el DOM.
// ============================================================

import { SP, COUNTRIES, SECRET } from '../fauna_roster.js';
import { BASE } from '../liga.js';

const LS = 'fauna_travesia_v1';
export const PELEAS_PARA_JEFE = 3;      // 3 cazadores y después el cabecilla
export const EQUIPO = 6;

const FONDO = {
  'San José': 'lugar_sanjose', 'Alajuela': 'lugar_alajuela', 'Cartago': 'lugar_cartago',
  'Heredia': 'lugar_heredia', 'Guanacaste': 'lugar_guanacaste',
  'Puntarenas': 'lugar_puntarenas', 'Limón': 'lugar_limon', 'Monteverde': 'lugar_monteverde',
};
export const fondoDe = (prov) =>
  `assets/escenarios/${FONDO[prov.n] || 'bioma_bosque'}.png`;

// ---------- progreso ----------
export function nuevoProgreso() {
  return {
    v: 1,
    prov: 0,                       // 0..6 provincias, 7 = Monteverde
    wins: 0,                       // victorias en la provincia actual
    desbloqueados: BASE.slice(),
    equipo: BASE.slice(0, EQUIPO),
    record: { w: 0, l: 0 },
    ganoJuego: false,
  };
}

export function cargar() {
  try {
    const raw = localStorage.getItem(LS);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && p.v === 1 && Array.isArray(p.desbloqueados)) {
        p.desbloqueados = p.desbloqueados.filter(k => SP[k]);
        p.equipo = (p.equipo || []).filter(k => p.desbloqueados.includes(k)).slice(0, EQUIPO);
        return p;
      }
    }
  } catch {}
  return nuevoProgreso();
}
export function guardar(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch {} }
export function borrar() { try { localStorage.removeItem(LS); } catch {} }

export const provinciaActual = (p) => (p.prov < 7 ? COUNTRIES[p.prov] : SECRET);
export const tocaJefe = (p) => p.wins >= PELEAS_PARA_JEFE;
export const desbloqueado = (p, key) => p.desbloqueados.includes(key);
export const equipoListo = (p) => p.equipo.length === EQUIPO;

// ---------- dificultad ----------
// Sin niveles: la dificultad la da el POOL. Igual que en la liga de la arena,
// cuanto más avanzada la provincia (y si es cabecilla) más probable que salgan
// especies de rareza alta, que traen mejores ruedas.
const RANK = { comun: 0, raro: 1, ultrararo: 2, legendario: 3, extinto: 4, mitico: 4 };
const fuerza = (k) => RANK[SP[k]?.rarity] ?? 0;

export function rivalesDe(p, esJefe, rng = Math.random) {
  const prov = provinciaActual(p);
  const pool = (prov.pool || []).filter(k => SP[k]);
  if (!pool.length) return [];
  const orden = pool.slice().sort((a, b) => fuerza(b) - fuerza(a));
  const duros = orden.slice(0, Math.max(3, Math.ceil(orden.length * 0.4)));
  const suaves = orden.slice(-Math.max(3, Math.ceil(orden.length * 0.6)));
  const pDuro = Math.min(0.85, 0.15 + p.prov * 0.09 + (esJefe ? 0.3 : 0));
  const out = [];
  let guarda = 0;
  while (out.length < EQUIPO && guarda++ < 200) {
    const fuente = rng() < pDuro ? duros : suaves;
    const k = fuente[Math.floor(rng() * fuente.length)];
    if (k && !out.includes(k)) out.push(k);
  }
  while (out.length < EQUIPO) out.push(pool[Math.floor(rng() * pool.length)]);
  return out;
}

export function proximaPelea(p, rng = Math.random) {
  const prov = provinciaActual(p);
  const esJefe = tocaJefe(p);
  return {
    prov, esJefe,
    titulo: esJefe ? `Cabecilla de ${prov.n}` : `Cazadores de ${prov.n}`,
    sub: esJefe ? 'el que manda la red' : `${p.wins + 1} de ${PELEAS_PARA_JEFE}`,
    fondo: fondoDe(prov),
    rivales: rivalesDe(p, esJefe, rng),
  };
}

// ---------- resultado ----------
// Ganar desbloquea un animal de la provincia; el cabecilla hace avanzar.
export function registrar(p, gane, pelea, rng = Math.random) {
  const out = { desbloqueo: null, avanzo: false, ganoJuego: false };
  if (!gane) { p.record.l++; guardar(p); return out; }

  p.record.w++;
  const pool = (pelea.prov.pool || []).filter(k => SP[k] && !p.desbloqueados.includes(k));
  if (pool.length) {
    const k = pool[Math.floor(rng() * pool.length)];
    p.desbloqueados.push(k);
    out.desbloqueo = k;
  }

  if (pelea.esJefe) {
    p.wins = 0;
    if (p.prov < 7) { p.prov++; out.avanzo = true; }
    if (p.prov >= 7 && !p.ganoJuego) { p.ganoJuego = true; out.ganoJuego = true; }
  } else {
    p.wins++;
  }
  guardar(p);
  return out;
}
