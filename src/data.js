// ============================================================
// data.js — CONTENIDO del juego (lo más fácil de tocar).
// Guardianes de Costa Rica: fauna 100% tica, recorrés las 7 provincias
// rescatando y rehabilitando animales, peleás contra furtivos y los liberás.
// No hay lógica acá: solo datos.
// ============================================================

// El ROSTER (SP, COUNTRIES, SECRET) se GENERA con make_fauna_data.py a partir del
// bestiario (126 especies de fauna tica). Para cambiar stats/biomas/efectos o el
// reparto por provincia, editá ese script y re-generá; acá solo se re-exporta.
// Cada especie: n, e (emoji respaldo), atk, hp, spd (velocidad), bio, ab (efecto).
// Arte real en assets/animales/<key>.png.
export { SP, COUNTRIES, SECRET } from './fauna_roster.js';

export const BIOMES = {
  bosque:  { n:'Bosque',  e:'🌳' },
  sabana:  { n:'Sabana',  e:'🌾' },
  agua:    { n:'Agua',    e:'🌊' },
  montana: { n:'Montaña', e:'⛰️' },
  noche:   { n:'Noche',   e:'🌑' },   // easter egg: bioma de los seres del folclor
};

// Efectos roguelike. `sym` es el símbolo de la insignia; `cls` la clase de color.
export const ABILITIES = {
  poison:{ n:'Veneno',       sym:'☣', cls:'poison', desc:'Cada mordida deja una pila de veneno en el enemigo (se acumula). Al final de la ronda pierde ❤ igual al veneno acumulado, IGNORANDO su defensa — derrite a los tanques.' },
  shield:{ n:'Escudo',       sym:'🛡', cls:'shield', desc:'El primer golpe que recibe le hace solo la mitad de daño; después, daño normal.' },
  heal:  { n:'Regenera',     sym:'✚', cls:'heal',   desc:'Al atacar, cura un poco de ❤ a un aliado herido al azar (según su nivel).' },
  first: { n:'Primer golpe', sym:'⚡', cls:'first',  desc:'Ataca con prioridad la primera vez del combate; después manda la velocidad.' },
  rage:  { n:'Furia',        sym:'🔥', cls:'rage',   desc:'Gana +1 ⚔ cada vez que ataca (se acumula durante el combate).' },
  thorns:{ n:'Púas',         sym:'🌵', cls:'thorns', desc:'Devuelve 1 de daño a quien lo ataque.' },
};

// RAREZA (qué tan común es ver la especie). El peso `w` decide la probabilidad de
// que un encuentro sea de ESA rareza (la rareza manda, no el bioma): común 50% /
// raro 30% / ultra raro 15% / legendario 5% / extinto 1%. Los LEGENDARIOS son los
// únicos con 2 habilidades y stats muy superiores; el EXTINTO, el más fuerte de todos.
export const RARITY = {
  comun:     { n:'Común',      w:50,   cls:'r-comun',  color:'#9bab8a' },
  raro:      { n:'Raro',       w:30,   cls:'r-raro',   color:'#5ea8c4' },
  ultrararo: { n:'Ultra raro', w:15,   cls:'r-ultra',  color:'#b07ad0' },
  legendario:{ n:'Legendario', w:5,    cls:'r-legend', color:'#e8b04b' },
  extinto:   { n:'Extinto',    w:1,    cls:'r-ext',    color:'#d8643f' },
  mitico:    { n:'Mítico',     w:0,    cls:'r-mito',   color:'#9b6bd0' },   // easter egg: seres del folclor (no aparecen salvajes)
};

// Objetos TICOS — tesoros 🎁 del mapa. Pueden sumar ⚔/❤/🛡(defensa)/💨(velocidad)/
// 🌀(habilidad), OTORGAR una habilidad (`ab`), CURAR/revivir (`cure`), o ser un
// trade-off (más ataque a cambio de menos DEFENSA). Se equipan (máx 3 por animal).
export const ITEMS = [
  { n:'Chonete',        e:'👒', hp:3, def:2 },                 // el sombrero tico: aguante/protección
  { n:'Salsa Lizano',   e:'🥫', atk:4, hp:1 },                 // el sabor que da garra
  { n:'Gallo pinto',    e:'🫘', atk:2, hp:4, def:1 },          // desayuno tico, puro aguante
  { n:'Café chorreado', e:'☕', atk:3, hp:1, spd:2 },          // energía: pega y corre
  { n:'Casado',         e:'🍛', atk:2, hp:4, def:1 },          // plato completo, balanceado
  { n:'Chanclas',       e:'🩴', hp:1, spd:2, hab:1 },          // livianas: agilidad
  { n:'Fresco natural', e:'🥤', atk:1, hp:1, spd:3 },          // cas/tamarindo: velocidad
  { n:'Granizado',      e:'🍧', hp:2, spd:1, hab:2 },          // refresca: reflejos
  { n:'Chile picante',  e:'🌶️', atk:4, def:-2 },              // trade-off: pega más, se cubre menos
  { n:'Sábila',         e:'🌿', hp:2, ab:'heal' },             // otorga Regenera
  { n:'Penca',          e:'🌵', hp:2, def:1, ab:'thorns' },    // otorga Púas + protege
  { n:'Agua de sapo',   e:'🍵', hp:3, cure:true },             // remedio tico: revive a un debilitado
];

// Objetos RAROS y ticos — recompensa por vencer a traficantes/cazadores. Más fuertes.
export const RARE_ITEMS = [
  { n:'Carreta típica',    e:'🛞', atk:6, hp:5 },              // patrimonio: empuje
  { n:'Esfera del Diquís', e:'🪨', hp:8, def:3 },              // poder ancestral: muralla
  { n:'Marimba',           e:'🪇', atk:8, hp:3 },              // el ritmo que envalentona
  { n:'Guaria morada',     e:'🌸', atk:3, hp:7, def:2 },       // la flor nacional
  { n:'Cimarrona',         e:'🎺', atk:3, hp:4, spd:4, hab:2 },// la banda que enardece: ágil
  { n:'Guaro Cacique',     e:'🥃', atk:6, def:-2, spd:6 },     // puro vértigo (trade-off veloz)
  { n:'Cuma',              e:'🔪', atk:7, def:-3, spd:2 },     // machete: filo brutal, te expone
  { n:'Caparazón',         e:'🐚', hp:5, def:3, ab:'shield' }, // otorga Escudo + coraza
];

// Texto de bonus de un objeto: stats que aporta (con signo) + habilidad/cura.
export const itemBonus = (it) => {
  const p = [];
  if (it.atk) p.push(`${it.atk > 0 ? '+' : ''}${it.atk}⚔`);
  if (it.hp)  p.push(`${it.hp > 0 ? '+' : ''}${it.hp}❤`);
  if (it.def) p.push(`${it.def > 0 ? '+' : ''}${it.def}🛡`);
  if (it.spd) p.push(`${it.spd > 0 ? '+' : ''}${it.spd}💨`);
  if (it.hab) p.push(`${it.hab > 0 ? '+' : ''}${it.hab}🌀`);
  if (it.ab && ABILITIES[it.ab]) p.push(`${ABILITIES[it.ab].sym} da ${ABILITIES[it.ab].n}`);
  if (it.cure) p.push('💚 revive');
  return p.join(' ');
};

// Banderas para el avatar del jugador (identidad, sin efecto en el juego).
export const PLAYER_FLAGS = ['🇨🇷','🇲🇽','🇪🇸','🇦🇷','🇨🇴','🇧🇷','🇺🇸','🇨🇦','🇫🇷','🇩🇪','🇯🇵','🇬🇧'];

export const RULES = {
  MAX_TEAM: 5,
  MAX_HEARTS: 1,        // UNA sola vida: perder un combate = fin de la travesía (roguelike duro)
  MAX_ITEMS: 3,        // objetos que se le pueden equipar a un animal
  STARTER_LEVEL: 2,    // nivel inicial de tu primer rescatado
  EVO_LEVELS: [3, 6],  // niveles en los que un animal se RECUPERA (etapa de rehabilitación)
  LEG_CHANCE: 0.02,    // probabilidad de toparte un animal legendario (~2%)
  RUN_LENGTH: 7,       // provincias a recorrer antes de Monteverde (el final)
  PLENO_EVO: 2,        // etapa de rehabilitación a la que se considera "pleno" (listo para liberar)
};
