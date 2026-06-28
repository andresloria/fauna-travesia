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
    // primeras casillas: rescate / animal salvaje (pelea justa para subir de nivel) / hallazgo / traslado / refugio.
    if (r < 44) return 'bioma';
    if (r < 64) return 'salvaje';   // ~20%: pelea contra un animal salvaje a tu nivel
    if (r < 78) return 'tesoro';
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

// ---------- combate SIMULTÁNEO (autobattler estratégico) ----------
// TODOS los animales de ambos equipos pelean a la vez. En cada ronda actúan por
// orden de VELOCIDAD (mayor primero); los de igual velocidad atacan AL MISMO
// TIEMPO (su daño se calcula con el estado al inicio del "tier" → pueden matarse
// mutuamente). El efecto 'first' (primer golpe) da prioridad por encima de la
// velocidad UNA sola vez por pelea; luego ese animal va por su velocidad normal.
// Objetivo: AL AZAR entre los enemigos vivos, salvo que haya animal(es) con
// ESCUDO → funcionan como TAUNT (hay que pegarles a ellos; 50/50 si hay 2).
// Efectos: escudo (taunt + absorbe el 1er golpe), púas (devuelve 1), rage
// (+2⚔ por compañero caído), veneno y regenera (al final de la ronda).
// Pasos para animar:
//   { kind:'strike', attacks:[{from,to,dmg,fx:[]}], faints:[uid], hp:{uid:hp} }
//   { kind:'effect', effects:[{uid,to?,type}],      faints:[uid], hp:{uid:hp} }
// result: 'W' (gana A) | 'L' (gana B) | 'T' (empate = derrota).
// fallenAUids: uids del equipo A que cayeron (para el Modo Furtivo).
export function fight(teamA, teamB) {
  const mk = (c, side) => ({
    uid: c.uid, side, atk: c.atk, hp: c.hp, max: c.hp, spd: c.spd || 0, ab: c.ab,
    shieldAbsorb: c.ab === 'shield',   // absorbe el primer golpe (una vez)
    firstReady: c.ab === 'first',      // prioridad por encima de la velocidad (una vez)
    alive: true,
  });
  const A = teamA.map(c => mk(c, 'A')), B = teamB.map(c => mk(c, 'B'));
  const ALL = [...A, ...B];
  const fallen = { A: 0, B: 0 };
  const steps = [];

  const aliveIn = (arr) => arr.filter(x => x.alive);
  const foesOf = (side) => aliveIn(side === 'A' ? B : A);
  const hpSnap = () => { const o = {}; ALL.forEach(x => { o[x.uid] = Math.max(0, x.hp); }); return o; };
  const prio = (x) => (x.firstReady ? 1e6 : 0) + x.spd;     // clave de orden del tier
  // objetivo: al azar entre los enemigos; si hay escudo(s), taunt (50/50 si 2)
  const pickTarget = (attacker) => {
    const foes = foesOf(attacker.side);
    if (!foes.length) return null;
    const shields = foes.filter(f => f.ab === 'shield');
    const poolT = shields.length ? shields : foes;
    return poolT[rnd(poolT.length)];
  };
  const reapFaints = () => {
    const faints = [];
    ALL.forEach(x => { if (x.alive && x.hp <= 0) { x.alive = false; fallen[x.side]++; faints.push(x.uid); } });
    return faints;
  };

  let guard = 0;
  while (aliveIn(A).length && aliveIn(B).length && guard++ < 400) {
    // ----- una RONDA: tiers de mayor a menor (prioridad 'first', luego velocidad) -----
    const tiers = [...new Set(aliveIn(ALL).map(prio))].sort((p, q) => q - p);
    for (const k of tiers) {
      if (!aliveIn(A).length || !aliveIn(B).length) break;
      const group = aliveIn(ALL).filter(x => prio(x) === k);
      if (!group.length) continue;
      // SIMULTÁNEO: cada uno elige objetivo y daño con el estado al inicio del tier
      const plan = [];
      for (const at of group) {
        const tgt = pickTarget(at);
        if (!tgt) continue;
        const dmg = at.atk + (at.ab === 'rage' ? 2 * fallen[at.side] : 0);
        plan.push({ at, tgt, dmg });
        if (at.firstReady) at.firstReady = false;   // consume la prioridad (una vez por pelea)
      }
      const attacks = [];
      for (const p of plan) {
        const fx = [];
        let dealt = p.dmg;
        if (p.tgt.alive) {
          if (p.tgt.shieldAbsorb && dealt > 0) { p.tgt.shieldAbsorb = false; dealt = 0; fx.push('shield'); }
          else if (dealt > 0) { p.tgt.hp -= dealt; }
          if (p.tgt.ab === 'thorns' && p.dmg > 0) { p.at.hp -= 1; fx.push('thorns'); }
        }
        attacks.push({ from: p.at.uid, to: p.tgt.uid, dmg: dealt, fx });
      }
      steps.push({ kind: 'strike', attacks, faints: reapFaints(), hp: hpSnap() });
    }
    // ----- fin de ronda: veneno (DoT) y regenera -----
    const effects = [];
    for (const x of aliveIn(ALL)) {
      if (x.ab === 'poison') {
        const foes = foesOf(x.side);
        if (foes.length) { const t = foes[rnd(foes.length)]; t.hp -= 1; effects.push({ uid: x.uid, to: t.uid, type: 'poison' }); }
      }
    }
    for (const x of aliveIn(ALL)) {
      if (x.ab === 'heal' && x.hp < x.max) { x.hp++; effects.push({ uid: x.uid, type: 'heal' }); }
    }
    if (effects.length) steps.push({ kind: 'effect', effects, faints: reapFaints(), hp: hpSnap() });
  }

  const result = aliveIn(A).length && !aliveIn(B).length ? 'W'
    : aliveIn(B).length && !aliveIn(A).length ? 'L' : 'T';
  const fallenAUids = A.filter(x => !x.alive).map(x => x.uid);
  return { result, steps, fallenAUids };
}

export { SP, BIOMES, COUNTRIES, ITEMS, RARE_ITEMS, ABILITIES, RULES };
