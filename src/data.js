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
  shield:{ n:'Escudo',       sym:'🛡', cls:'shield', desc:'Aguanta el primer golpe que recibiría sin perder vida.' },
  heal:  { n:'Regenera',     sym:'✚', cls:'heal',   desc:'Si sobrevive el turno, recupera 1 ❤ al final.' },
  first: { n:'Primer golpe', sym:'⚡', cls:'first',  desc:'Siempre ataca primero, sin importar la velocidad: puede tumbar al rival sin recibir daño.' },
  rage:  { n:'Furia',        sym:'🔥', cls:'rage',   desc:'+2 ⚔ por cada compañero ya caído en este combate.' },
  thorns:{ n:'Púas',         sym:'🌵', cls:'thorns', desc:'Devuelve 1 de daño a quien lo ataque.' },
};

export const ITEMS = [
  { n:'Hoja medicinal', e:'🌿', atk:0, hp:3 },
  { n:'Fruta madura',   e:'🍌', atk:2, hp:1 },
  { n:'Vendaje',        e:'🩹', atk:0, hp:4 },
  { n:'Néctar',         e:'🍯', atk:2, hp:0 },
];

// Objetos RAROS — recompensa por vencer a traficantes/cazadores.
export const RARE_ITEMS = [
  { n:'Collar GPS',      e:'📡', atk:4, hp:2 },
  { n:'Suero vital',     e:'💉', atk:2, hp:6 },
  { n:'Amuleto boruca',  e:'🪆', atk:3, hp:4 },
  { n:'Piedra esfera',   e:'🪨', atk:2, hp:5 },
];

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
