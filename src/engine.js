// ============================================================
// engine.js — LÓGICA PURA del juego. NO toca el DOM ni el navegador.
// Todo lo de aquí se puede probar con Node (ver test/) y, lo más
// importante, es lo que correrá en el SERVIDOR cuando hagamos el
// multiplayer (el cliente solo dibuja; el servidor decide).
// ============================================================

import { SP, BIOMES, COUNTRIES, ITEMS, RARE_ITEMS, ABILITIES, RARITY, RULES } from './data.js';

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
  return { uid: ++UID, key, n: s.n, e: s.e, bio: s.bio, ab: s.ab, ab2: s.ab2 || null,
           leg: !!s.leg, ext: !!s.ext, rarity: s.rarity || 'comun',
           atk: s.atk, hp: s.hp, spd: s.spd || 3, hab: s.hab || 0, level: 1, evo: 0, items: [] };
}

// ---------- rareza: peso de aparición (común aparece mucho; legendario/extinto casi nunca) ----------
export const rarW = (key) => (RARITY[SP[key].rarity] || RARITY.comun).w;
function weightedKey(keys) {
  let tot = 0; for (const k of keys) tot += rarW(k);
  let r = Math.random() * tot;
  for (const k of keys) { r -= rarW(k); if (r <= 0) return k; }
  return keys[keys.length - 1];
}
function weightedDistinct(keys, count) {
  const pool = keys.slice(), out = [];
  while (out.length < count && pool.length) {
    const k = weightedKey(pool); out.push(k); pool.splice(pool.indexOf(k), 1);
  }
  return out;
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
const RAMP = 8;
const accel = (depth) => depth + Math.floor(depth * depth / RAMP);
// TAMAÑO del equipo enemigo (cuántos animales): rampa lineal y DETERMINISTA.
// Furtivos/traficantes = nº de provincia + 1 (tope 5); el Cabecilla, uno más.
// Prov.1 (depth0): furtivos 2, jefe 3 · Prov.2: 3 y 4 · Prov.3: 4 y 5 · Prov.4+: 5 y 5.
export function retSize(depth)     { return Math.min(5, depth + 2); }
export function poacherSize(depth) { return Math.min(5, depth + 2); }
export function bossSize(depth)    { return Math.min(5, depth + 3); }
// NIVEL de los enemigos (su fuerza): sube con la curva acelerada (no el tamaño).
export function enemyLevel(depth, isBoss) { return (isBoss ? 3 : 2) + accel(depth); }
export function wildLevel(depth) { return 1 + depth; }
export function poacherLevel(depth) { return enemyLevel(depth, false); }   // traficantes: nivel de furtivo normal (su gracia es el robo + recompensa, no la fuerza)

// Equipo enemigo (furtivos/traficantes): NO usan legendarios ni extintos —
// son la fauna común-rara que tienen cautiva. Ponderado por rareza.
export function genEnemy(country, size, lvl) {
  const catchable = country.pool.filter(k => SP[k].rarity !== 'legendario' && SP[k].rarity !== 'extinto');
  const pool = catchable.length ? catchable : country.pool;
  const team = [];
  for (let i = 0; i < size; i++) { const a = mkAnimal(weightedKey(pool)); setLevel(a, lvl); team.push(a); }
  return team;
}

// Animal salvaje de un nodo de bioma. Ponderado por RAREZA: los comunes salen
// mucho; legendarios/extintos casi nunca (pero pueden — un jaguar es un hallazgo).
export function rollWild(country, bio, depth) {
  let inBio = country.pool.filter(k => SP[k].bio === bio);
  if (!inBio.length) inBio = country.pool;
  const a = mkAnimal(weightedKey(inBio));
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

// ---------- mapa RAMIFICADO (elegís tu ruta, estilo Slay the Spire) ----------
// Inicio → MAP_ROWS filas de 3 opciones (elegís 1 por fila) → Cabecilla.
// Las primeras 2 filas (6 casillas) son tranquilas; de la 3 en adelante aparecen
// los cazadores. La ÚLTIMA fila SIEMPRE es: descanso + cazador + una al azar.
export const MAP_ROWS = 5;       // filas de 3 opciones por provincia
export const SAFE_ROWS = 2;      // las primeras N filas son zona tranquila
const MX = [22, 50, 78];         // 3 columnas
export function generateMap(country, depth = 0) {
  const nodesById = {};
  const biomes = biomesOf(country);
  const seq = [];
  const yFor = (r) => 88 - r * (78 / (MAP_ROWS + 1));   // r0 abajo (inicio), última arriba (cabecilla)
  const mk = (r, c, type, bio = null) => {
    const o = { id: ++UID, r, c, type, bio, x: MX[c] ?? 50, y: yFor(r), visited: false, children: [] };
    nodesById[o.id] = o; seq.push(o); return o;
  };
  const rows = [];
  rows[0] = [mk(0, 1, 'start')];
  for (let r = 1; r <= MAP_ROWS; r++) {
    let types;
    if (r === MAP_ROWS) {
      // última fila SIEMPRE: descanso + un cazador + una al azar. El cazador es
      // furtivo temprano y traficante desde la provincia 4 (gate de dificultad).
      const hunter = depth >= 3 ? 'cazador' : 'combate';
      types = shuffle(['descanso', hunter, pickType(depth, r)]);
    } else types = [0, 1, 2].map(() => pickType(depth, r));
    rows[r] = [0, 1, 2].map(c => mk(r, c, types[c], types[c] === 'bioma' ? pick(biomes) : null));
  }
  rows[MAP_ROWS + 1] = [mk(MAP_ROWS + 1, 1, 'airport')];
  // conexiones ramificadas: cada nodo → los de la fila siguiente con |Δcolumna| ≤ 1
  for (let r = 0; r <= MAP_ROWS; r++) {
    rows[r].forEach(n => {
      let kids = rows[r + 1].filter(x => Math.abs(x.c - n.c) <= 1);
      if (!kids.length) kids = [rows[r + 1][0]];
      n.children = kids;
    });
    rows[r + 1].forEach(x => {                 // todo nodo siguiente debe ser alcanzable
      if (!rows[r].some(n => n.children.includes(x)))
        rows[r].reduce((b, n) => Math.abs(n.c - x.c) < Math.abs(b.c - x.c) ? n : b).children.push(x);
    });
  }
  return { rows, nodesById, startId: rows[0][0].id, seq };
}
// `row` = fila (1..MAP_ROWS). Atacantes solo de la fila SAFE_ROWS+1 en adelante.
function pickType(depth = 0, row = 1) {
  const r = rnd(100);
  if (row <= SAFE_ROWS) {
    // zona tranquila: rescate / animal alterado / hallazgo / traslado / sorpresa / refugio.
    if (r < 34) return 'bioma';
    if (r < 54) return 'salvaje';
    if (r < 70) return 'tesoro';
    if (r < 82) return 'intercambio';
    if (r < 93) return 'sorpresa';
    return 'descanso';
  }
  // zona caliente: aparecen los cazadores.
  if (r < 22) return 'bioma';
  if (r < 40) return 'salvaje';
  if (r < 58) return 'combate';
  if (r < 70) return depth >= 3 ? 'cazador' : 'combate';   // traficantes desde la provincia 4
  if (r < 84) return 'sorpresa';
  if (r < 93) return 'tesoro';
  return 'descanso';
}

// Jefe de zona: UN animal MUY fuerte (raro). Si lo vencés, lo rescatás.
export function genZoneBoss(country, depth) {
  const strong = country.pool.filter(k => SP[k].rarity === 'ultrararo' || SP[k].rarity === 'legendario');
  const key = strong.length ? weightedKey(strong) : weightedKey(country.pool);
  const a = mkAnimal(key);
  setLevel(a, enemyLevel(depth, true) + 3);   // muy por encima de un jefe normal
  a.atk += 2; a.hp += 4; a.boss = true;        // boost de jefe de zona
  return [a];
}

// Tres animales DIFERENTES para elegir a cuál rescatar. Prioriza el bioma y
// completa con otras especies del país; SIEMPRE distintas. Ponderado por RAREZA:
// casi siempre comunes/raros; muy de vez en cuando cae un legendario (¡un jaguar!).
export function genWildChoices(country, bio, depth, count = 3) {
  let cand = country.pool.filter(k => SP[k].bio === bio);
  if (cand.length < count) cand = cand.concat(country.pool.filter(k => !cand.includes(k)));
  const keys = weightedDistinct(cand, Math.min(count, cand.length));
  while (keys.length < count) keys.push(pick(country.pool));
  return keys.map(k => { const a = mkAnimal(k); setLevel(a, wildLevel(depth)); return a; });
}

// Oferta de intercambio: un animal 2-3 niveles arriba (no legendario/extinto/starter).
export function genTrade(maxLevel) {
  const keys = Object.keys(SP).filter(k => {
    const v = SP[k]; return !v.starter && v.rarity !== 'legendario' && v.rarity !== 'extinto';
  });
  const a = mkAnimal(weightedKey(keys));
  setLevel(a, maxLevel + 2 + rnd(2));   // +2 o +3
  return a;
}
export function biomesOf(country) { return [...new Set(country.pool.map(k => SP[k].bio))]; }

// ---------- combate por turnos, estratégico (autobattler) ----------
// Cada ronda, TODOS los vivos actúan UNO POR UNO (no simultáneo) en este orden:
//   1) 'primer golpe' (prioridad, una sola vez por pelea), luego
//   2) más VELOCIDAD primero; a igual velocidad, pega primero el de MENOS ATAQUE.
// Objetivo: AL AZAR entre los enemigos, salvo que haya ESCUDO → taunt (50/50 si 2).
// Defensa: el objetivo puede ESQUIVAR según su HABILIDAD (hab): prob = hab*5%, tope 50%.
// Efectos: escudo (taunt + absorbe el 1er golpe), púas (devuelve 1), rage (+2⚔ por
// compañero caído), veneno (al final de ronda), regenera (al ATACAR cura a un aliado
// herido al azar, poco según el nivel del que cura).
// Pasos para animar:
//   { kind:'strike', attacks:[{from,to,dmg,fx:[],healTo?}], faints:[uid], hp:{uid:hp} }
//   { kind:'effect', effects:[{uid,to,type:'poison'}],      faints:[uid], hp:{uid:hp} }
// result: 'W' | 'L' | 'T'.  fallenAUids: uids de A que cayeron (Modo Furtivo).
const DODGE_PER = 0.05, DODGE_MAX = 0.5;
const healAmount = (level) => 1 + Math.floor((level || 1) / 4);   // poco, escala con nivel

export function fight(teamA, teamB) {
  const mk = (c, side) => {
    const abs = [c.ab, c.ab2].filter(Boolean);   // legendarios = 2 habilidades
    return {
      uid: c.uid, side, atk: c.atk, hp: c.hp, max: c.hp, spd: c.spd || 0, hab: c.hab || 0,
      level: c.level || 1, abs,
      shieldAbsorb: abs.includes('shield'),   // absorbe el primer golpe (una vez)
      firstReady: abs.includes('first'),      // prioridad sobre la velocidad (una vez)
      rageStacks: 0,                           // furia: +1 ⚔ por cada ataque que hace
      alive: true,
    };
  };
  const A = teamA.map(c => mk(c, 'A')), B = teamB.map(c => mk(c, 'B'));
  const ALL = [...A, ...B];
  const fallen = { A: 0, B: 0 };
  const steps = [];

  const aliveIn = (arr) => arr.filter(x => x.alive);
  const foesOf = (side) => aliveIn(side === 'A' ? B : A);
  const alliesOf = (side) => aliveIn(side === 'A' ? A : B);
  const hpSnap = () => { const o = {}; ALL.forEach(x => { o[x.uid] = Math.max(0, x.hp); }); return o; };
  const pickTarget = (attacker) => {
    const foes = foesOf(attacker.side);
    if (!foes.length) return null;
    const shields = foes.filter(f => f.abs.includes('shield'));   // taunt
    const poolT = shields.length ? shields : foes;
    return poolT[rnd(poolT.length)];
  };
  const reapFaints = () => {
    const faints = [];
    ALL.forEach(x => { if (x.alive && x.hp <= 0) { x.alive = false; fallen[x.side]++; faints.push(x.uid); } });
    return faints;
  };

  let guard = 0;
  while (aliveIn(A).length && aliveIn(B).length && guard++ < 500) {
    // orden de la ronda: prioridad 'first' → velocidad desc → ATAQUE asc → uid (estable)
    const order = aliveIn(ALL).slice().sort((x, y) =>
      ((y.firstReady ? 1 : 0) - (x.firstReady ? 1 : 0)) || (y.spd - x.spd) || (x.atk - y.atk) || (x.uid - y.uid));
    for (const at of order) {
      if (!at.alive) continue;
      if (!aliveIn(A).length || !aliveIn(B).length) break;
      const tgt = pickTarget(at);
      if (at.firstReady) at.firstReady = false;   // gastó su prioridad aunque no haya a quién pegar
      if (!tgt) continue;

      const fx = [];
      // FURIA: gana +1 ⚔ cada vez que ataca (acumula durante la pelea)
      if (at.abs.includes('rage')) { at.rageStacks++; fx.push('rage'); }
      let dealt = at.atk + at.rageStacks;
      // ESQUIVA por habilidad del defensor
      if (tgt.hab > 0 && Math.random() < Math.min(DODGE_MAX, tgt.hab * DODGE_PER)) {
        dealt = 0; fx.push('dodge');
      } else {
        // ESCUDO: el PRIMER golpe que recibe le hace solo la mitad (luego, normal)
        if (tgt.shieldAbsorb && dealt > 0) { tgt.shieldAbsorb = false; dealt = Math.ceil(dealt / 2); fx.push('shield'); }
        if (dealt > 0) tgt.hp -= dealt;
        if (tgt.abs.includes('thorns') && dealt > 0) { at.hp -= 1; fx.push('thorns'); }
      }
      const atk = { from: at.uid, to: tgt.uid, dmg: dealt, fx };
      // REGENERA: al atacar, cura a un aliado herido al azar (poco)
      if (at.abs.includes('heal')) {
        const hurt = alliesOf(at.side).filter(a => a.hp > 0 && a.hp < a.max);
        if (hurt.length) {
          const al = hurt[rnd(hurt.length)];
          al.hp = Math.min(al.max, al.hp + healAmount(at.level));
          atk.healTo = al.uid; fx.push('heal');
        }
      }
      steps.push({ kind: 'strike', attacks: [atk], faints: reapFaints(), hp: hpSnap() });
    }
    // ----- fin de ronda: veneno (DoT) -----
    const effects = [];
    for (const x of aliveIn(ALL)) {
      if (x.abs.includes('poison')) {
        const foes = foesOf(x.side);
        if (foes.length) { const t = foes[rnd(foes.length)]; t.hp -= 1; effects.push({ uid: x.uid, to: t.uid, type: 'poison' }); }
      }
    }
    if (effects.length) steps.push({ kind: 'effect', effects, faints: reapFaints(), hp: hpSnap() });
  }

  const result = aliveIn(A).length && !aliveIn(B).length ? 'W'
    : aliveIn(B).length && !aliveIn(A).length ? 'L' : 'T';
  const fallenAUids = A.filter(x => !x.alive).map(x => x.uid);
  return { result, steps, fallenAUids };
}

export { SP, BIOMES, COUNTRIES, ITEMS, RARE_ITEMS, ABILITIES, RULES };
