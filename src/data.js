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
};

// Efectos roguelike. `sym` es el símbolo de la insignia; `cls` la clase de color.
export const ABILITIES = {
  poison:{ n:'Veneno',       sym:'☣', cls:'poison', desc:'El enemigo del frente pierde 1 ❤ cada turno aunque no lo golpeen.' },
  shield:{ n:'Escudo',       sym:'🛡', cls:'shield', desc:'El primer golpe que recibe le hace solo la mitad de daño; después, daño normal.' },
  heal:  { n:'Regenera',     sym:'✚', cls:'heal',   desc:'Al atacar, cura un poco de ❤ a un aliado herido al azar (según su nivel).' },
  first: { n:'Primer golpe', sym:'⚡', cls:'first',  desc:'Ataca con prioridad la primera vez del combate; después manda la velocidad.' },
  rage:  { n:'Furia',        sym:'🔥', cls:'rage',   desc:'Gana +1 ⚔ cada vez que ataca (se acumula durante el combate).' },
  thorns:{ n:'Púas',         sym:'🌵', cls:'thorns', desc:'Devuelve 1 de daño a quien lo ataque.' },
};

// RAREZA (qué tan común es ver la especie). El peso `w` decide cuánto aparece en
// las zonas de rescate: común sale muchísimo; legendario/extinto casi nunca.
// Los LEGENDARIOS son los únicos con 2 habilidades; los EXTINTOS, los más raros.
export const RARITY = {
  comun:     { n:'Común',      w:100,  cls:'r-comun',  color:'#9bab8a' },
  raro:      { n:'Raro',       w:34,   cls:'r-raro',   color:'#5ea8c4' },
  ultrararo: { n:'Ultra raro', w:9,    cls:'r-ultra',  color:'#b07ad0' },
  legendario:{ n:'Legendario', w:1.8,  cls:'r-legend', color:'#e8b04b' },
  extinto:   { n:'Extinto',    w:0.5,  cls:'r-ext',    color:'#d8643f' },
};

// Objetos TICOS — tesoros 🎁 del mapa. Suman ⚔/❤/💨(velocidad)/🌀(habilidad) al equiparlos.
export const ITEMS = [
  { n:'Chonete',        e:'👒', atk:1, hp:5 },                 // el sombrero tico: aguante
  { n:'Salsa Lizano',   e:'🥫', atk:4, hp:1 },                 // el sabor que da garra
  { n:'Gallo pinto',    e:'🫘', atk:2, hp:4 },                 // desayuno tico, puro aguante
  { n:'Café chorreado', e:'☕', atk:3, hp:1, spd:2 },          // energía: pega y corre
  { n:'Casado',         e:'🍛', atk:3, hp:4 },                 // plato completo, balanceado
  { n:'Agua dulce',     e:'🍯', atk:2, hp:3 },                 // tapa de dulce
  { n:'Chanclas',       e:'🩴', hp:1, spd:2, hab:1 },          // livianas: agilidad
  { n:'Fresco natural', e:'🥤', atk:1, hp:1, spd:3 },          // cas/tamarindo: chispa de velocidad
  { n:'Granizado',      e:'🍧', hp:2, spd:1, hab:2 },          // refresca: reflejos
];

// Objetos RAROS y ticos — recompensa por vencer a traficantes/cazadores. Más fuertes.
export const RARE_ITEMS = [
  { n:'Carreta típica',    e:'🛞', atk:6, hp:5 },              // patrimonio: empuje
  { n:'Esfera del Diquís', e:'🪨', atk:4, hp:8 },              // poder ancestral
  { n:'Marimba',           e:'🪇', atk:8, hp:3 },              // el ritmo que envalentona
  { n:'Guaria morada',     e:'🌸', atk:3, hp:9 },              // la flor nacional
  { n:'Bandera tica',      e:'🇨🇷', atk:6, hp:6 },              // orgullo patrio
  { n:'Cimarrona',         e:'🎺', atk:3, hp:4, spd:4, hab:2 },// la banda que enardece: ágil
  { n:'Guaro Cacique',     e:'🥃', atk:5, hp:1, spd:6 },       // puro vértigo
];

// Texto de bonus de un objeto (solo las stats que aporta).
export const itemBonus = (it) => [
  it.atk ? `+${it.atk}⚔` : '', it.hp ? `+${it.hp}❤` : '',
  it.spd ? `+${it.spd}💨` : '', it.hab ? `+${it.hab}🌀` : '',
].filter(Boolean).join(' ');

// Banderas para el avatar del jugador (identidad, sin efecto en el juego).
export const PLAYER_FLAGS = ['🇨🇷','🇲🇽','🇪🇸','🇦🇷','🇨🇴','🇧🇷','🇺🇸','🇨🇦','🇫🇷','🇩🇪','🇯🇵','🇬🇧'];

export const RULES = {
  MAX_TEAM: 5,
  MAX_HEARTS: 3,
  MAX_ITEMS: 3,        // objetos que se le pueden equipar a un animal
  STARTER_LEVEL: 2,    // nivel inicial de tu primer rescatado
  EVO_LEVELS: [3, 6],  // niveles en los que un animal se RECUPERA (etapa de rehabilitación)
  LEG_CHANCE: 0.02,    // probabilidad de toparte un animal legendario (~2%)
  RUN_LENGTH: 7,       // provincias a recorrer antes de Monteverde (el final)
  PLENO_EVO: 2,        // etapa de rehabilitación a la que se considera "pleno" (listo para liberar)
};
