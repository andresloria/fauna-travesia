// ============================================================
// engine.js — LÓGICA PURA del juego. NO toca el DOM ni el navegador.
// Todo lo de aquí se puede probar con Node (ver test/) y, lo más
// importante, es lo que correrá en el SERVIDOR cuando hagamos el
// multiplayer (el cliente solo dibuja; el servidor decide).
// ============================================================

import { SP, BIOMES, COUNTRIES, ITEMS, RARE_ITEMS, ABILITIES, RULES } from './data.js';

// ---------- utilidades de azar ----------
export const rnd  = (n) => Math.floor(Math.random() * n);
export const pick = (a) => a[rnd(a.length)];
export function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

// ---------- animales ----------
let UID = 0;
export function mkAnimal(key) {
  const s = SP[key];
  return { uid: ++UID, key, n: s.n, e: s.e, bio: s.bio, ab: s.ab, leg: !!s.leg, ext: !!s.ext,
           atk: s.atk, hp: s.hp, spd: s.spd || 3, level: 1, evo: 0, items: [] };
}
// Sube un nivel. Devuelve true si en este nivel EVOLUCIONÓ (creció extra).
export function levelUp(a) {
  a.level++; a.atk += 1; a.hp += 2;
  if (RULES.EVO_LEVELS.includes(a.level)) { a.atk += 2; a.hp += 3; a.evo++; return true; }
  return false;
}
export function setLevel(a, L) { while (a.level < L) levelUp(a); return a; }

// ---------- dificultad (perillas para balancear) ----------
// Sube por PROFUNDIDAD (países ya cruzados), no por cuál país tocó.
// CURVA ACELERADA: el término d²/RAMP es ~0 en los primeros países (inicio
// SENCILLO) y se dispara al final. Tu poder crece rápido (cada victoria sube de
// nivel a TODO el equipo + capturás + evolucionás), así que el enemigo tiene que
// acelerar para seguir siendo un reto. Bajá RAMP = más difícil; subilo = más fácil.
const RAMP = 10;
const accel = (depth) => depth + Math.floor(depth * depth / RAMP);
// TAMAÑO del equipo enemigo (cuántos animales): rampa lineal y DETERMINISTA.
// Furtivos/traficantes = nº de provincia (depth+1); el Cabecilla siempre uno más.
// Prov.1 (depth0): furtivos 1, jefe 2 · Prov.2: 2 y 3 · … · Prov.5+ (depth4): todos 5.
export function retSize(depth)     { return Math.min(5, depth + 1); }
export function poacherSize(depth) { return Math.min(5, depth + 1); }
export function bossSize(depth)    { return Math.min(5, depth + 2); }
// NIVEL de los enemigos (su fuerza): sube con la curva acelerada (no el tamaño).
export function enemyLevel(depth, isBoss) { return (isBoss ? 2 : 1) + accel(depth); }
export function wildLevel(depth) { return 1 + depth; }
export function poacherLevel(depth) { return enemyLevel(depth, false); }   // traficantes: nivel de furtivo normal (su gracia es el robo + recompensa, no la fuerza)

export function genEnemy(country, size, lvl) {
  const team = [];
  for (let i = 0; i < size; i++) { const a = mkAnimal(pick(country.pool)); setLevel(a, lvl); team.push(a); }
  return team;
}

// Animal salvaje de un nodo de bioma. Muy rara vez (LEG_CHANCE) sale el
// legendario del país en vez de uno del pool normal.
export function rollWild(country, bio, depth) {
  let key;
  if (country.legend && rnd(100) < RULES.LEG_CHANCE * 100) {
    key = country.legend;
  } else {
    const inBio = country.pool.filter(k => SP[k].bio === bio);
    key = pick(inBio.length ? inBio : country.pool);
  }
  const a = mkAnimal(key);
  setLevel(a, wildLevel(depth));
  return a;
}

// ---------- selección de país (al azar, sin repetir hasta agotar la bolsa) ----------
// Devuelve { country, bag } con la bolsa restante ya barajada.
export function drawCountry(bag, avoid = null) {
  let b = (bag && bag.length) ? bag.slice() : shuffle(COUNTRIES.map((_, i) => i));
  if (avoid != null && b[0] === avoid && b.length > 1) b.push(b.shift());
  const idx = b.shift();
  return { country: COUNTRIES[idx], idx, bag: b };
}

// ---------- mapa ramificado (estilo Slay the Spire / Pokelike) ----------
export function generateMap(country, depth = 0) {
  const nodesById = {};
  const node = (r, c, type, bio = null) => {
    const o = { id: ++UID, r, c, type, bio, visited: false, children: [] };
    nodesById[o.id] = o; return o;
  };
  const rows = [];
  rows[0] = [node(0, 1, 'start')];
  const biomes = [...new Set(country.pool.map(k => SP[k].bio))];
  for (let r = 1; r <= 4; r++) {
    const cols = shuffle([0, 1, 2]).slice(0, 2 + rnd(2)).sort((a, b) => a - b);
    rows[r] = cols.map(c => {
      const t = pickType(depth, r);
      return node(r, c, t, t === 'bioma' ? pick(biomes) : null);
    });
  }
  rows[5] = [node(5, 1, 'airport')];

  for (let r = 0; r < 5; r++) {
    rows[r].forEach(n => {
      let kids = rows[r + 1].filter(x => Math.abs(x.c - n.c) <= 1);
      if (!kids.length) kids = [nearest(rows[r + 1], n.c)];
      n.children = kids;
    });
    rows[r + 1].forEach(x => {
      if (!rows[r].some(n => n.children.includes(x))) nearest(rows[r], x.c).children.push(x);
    });
  }
  return { rows, nodesById, startId: rows[0][0].id };
}
function nearest(row, c) { return row.reduce((b, x) => Math.abs(x.c - c) < Math.abs(b.c - c) ? x : b); }
// El mapa tiene filas 1-4 (luego el aeropuerto en la 5). Los ATACANTES (furtivos/
// traficantes) solo aparecen en las ÚLTIMAS casillas (filas 3-4): primero explorás
// y rescatás, y peleás cerca del jefe. Las primeras casillas son pacíficas.
function pickType(depth = 0, row = 4) {
  const r = rnd(100);
  if (row < 3) {
    // primeras casillas: rescate / hallazgo / traslado / refugio (sin atacantes)
    if (r < 58) return 'bioma';
    if (r < 76) return 'tesoro';
    if (r < 88) return 'intercambio';
    return 'descanso';
  }
  // últimas casillas: aparecen los atacantes
  if (r < 30) return 'bioma';
  if (r < 68) return 'combate';
  if (r < 78) return depth >= 3 ? 'cazador' : 'combate';   // traficantes solo de la provincia 4 en adelante
  if (r < 90) return 'tesoro';
  return 'descanso';
}

// Tres animales DIFERENTES para que el jugador elija a cuál rescatar.
// Prioriza los del bioma; si no alcanzan, completa con otras especies del país
// (siempre distintas). Solo repite como último recurso si el país tiene < count.
export function genWildChoices(country, bio, depth, count = 3) {
  const nonLeg = country.pool.filter(k => !SP[k].leg);
  let keys = shuffle(nonLeg.filter(k => SP[k].bio === bio));
  if (keys.length < count) keys = keys.concat(shuffle(nonLeg.filter(k => !keys.includes(k))));
  keys = keys.slice(0, count);
  while (keys.length < count) keys.push(pick(nonLeg));
  return keys.map(k => { const a = mkAnimal(k); setLevel(a, wildLevel(depth)); return a; });
}

// Oferta de intercambio: un animal al azar 2-3 niveles arriba del nivel dado.
export function genTrade(maxLevel) {
  const keys = Object.keys(SP).filter(k => !SP[k].leg);
  const a = mkAnimal(pick(keys));
  setLevel(a, maxLevel + 2 + rnd(2));   // +2 o +3
  return a;
}
export function biomesOf(country) { return [...new Set(country.pool.map(k => SP[k].bio))]; }

// ---------- combate (autobattler con efectos) ----------
// Resuelve la pelea entera y devuelve el resultado + los "pasos" para animar.
// Cada paso reporta el hp resultante de los dos del frente, quién cayó y qué
// efectos se dispararon (fx) para que la UI los muestre.
// result: 'W' (gana tu equipo) | 'L' (gana B) | 'T' (empate, cuenta como derrota)
export function fight(teamA, teamB) {
  const mk = (c) => ({ uid: c.uid, atk: c.atk, hp: c.hp, max: c.hp, spd: c.spd || 0, ab: c.ab, shield: c.ab === 'shield' });
  const A = teamA.map(mk), B = teamB.map(mk);
  let fallenA = 0, fallenB = 0;
  const steps = [];
  let g = 0;

  while (A.length && B.length && g++ < 600) {
    const a = A[0], b = B[0];
    const fx = [];
    const atkA = a.atk + (a.ab === 'rage' ? 2 * fallenA : 0);
    const atkB = b.atk + (b.ab === 'rage' ? 2 * fallenB : 0);

    // un golpe: aplica escudo (absorbe una vez) y púas (devuelve 1 al atacante)
    const hit = (attacker, dmg, defender) => {
      if (defender.shield && dmg > 0) { defender.shield = false; fx.push('shield'); return; }
      defender.hp -= dmg;
      if (defender.ab === 'thorns' && dmg > 0) { attacker.hp -= 1; fx.push('thorns'); }
    };

    // quién pega primero: el de más VELOCIDAD (el efecto 'first' = +100, siempre primero)
    const spdA = a.spd + (a.ab === 'first' ? 100 : 0);
    const spdB = b.spd + (b.ab === 'first' ? 100 : 0);
    const aFirst = spdA > spdB;
    const bFirst = spdB > spdA;
    if (aFirst) {
      hit(a, atkA, b);
      if (b.hp > 0) hit(b, atkB, a); else fx.push('first');
    } else if (bFirst) {
      hit(b, atkB, a);
      if (a.hp > 0) hit(a, atkA, b); else fx.push('first');
    } else {
      hit(a, atkA, b); hit(b, atkB, a);
    }

    // veneno: el portador (si sigue vivo) baja 1 ❤ al enemigo del frente vivo
    if (a.hp > 0 && a.ab === 'poison' && b.hp > 0) { b.hp -= 1; fx.push('poison'); }
    if (b.hp > 0 && b.ab === 'poison' && a.hp > 0) { a.hp -= 1; fx.push('poison'); }
    // regenera: si sobrevivió el turno, +1 ❤ (sin pasar su máximo)
    if (a.hp > 0 && a.ab === 'heal' && a.hp < a.max) { a.hp++; fx.push('heal'); }
    if (b.hp > 0 && b.ab === 'heal' && b.hp < b.max) { b.hp++; fx.push('heal'); }

    const faintA = a.hp <= 0, faintB = b.hp <= 0;
    steps.push({ aUid: a.uid, bUid: b.uid, aHp: a.hp, bHp: b.hp, faintA, faintB, fx });
    if (faintA) { A.shift(); fallenA++; }
    if (faintB) { B.shift(); fallenB++; }
  }

  const result = (A.length && !B.length) ? 'W' : (B.length && !A.length) ? 'L' : 'T';
  return { result, steps };
}

export { SP, BIOMES, COUNTRIES, ITEMS, RARE_ITEMS, ABILITIES, RULES };
