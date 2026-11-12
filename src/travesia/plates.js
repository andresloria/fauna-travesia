// ============================================================
// travesia/plates.js — LAS PLACAS (las "Plates" de Pokémon Duel).
//
// Reglas del original:
//   · se llevan hasta 6 por equipo, con un presupuesto de COSTO total de 6;
//   · cada una se usa UNA sola vez por duelo;
//   · solo AL PRINCIPIO DE TU TURNO: en cuanto movés, ya no podés usar placas
//     (pero podés usar varias antes de mover);
//   · cuatro familias por color — rojas suben el daño, doradas curan estados o
//     aguantan un golpe, moradas mueven piezas (tablero, banca o centro), y
//     azules dan giros extra.
//
// Acá van tematizadas con cosas ticas, pero los EFECTOS son los del original.
// Lógica pura: no toca el DOM.
// ============================================================

export const PRESUPUESTO = 6;      // costo total del mazo de placas
export const MAX_PLACAS = 6;

export const PLACAS = {
  rugido: {
    id: 'rugido', n: 'Rugido', color: 'roja', costo: 1, obj: 'mia',
    desc: '+10 de daño a un animal tuyo durante este turno.',
  },
  celo: {
    id: 'celo', n: 'Época de celo', color: 'roja', costo: 2, obj: 'ninguno',
    desc: '+20 de daño a TODO tu equipo durante este turno.',
  },
  hierba: {
    id: 'hierba', n: 'Hierba medicinal', color: 'dorada', costo: 1, obj: 'mia',
    desc: 'Le quita todos los estados a un animal tuyo.',
  },
  caparazon: {
    id: 'caparazon', n: 'Caparazón', color: 'dorada', costo: 2, obj: 'mia',
    desc: 'Un animal tuyo aguanta un duelo perdido sin ir al centro.',
  },
  estampida: {
    id: 'estampida', n: 'Estampida', color: 'morada', costo: 2, obj: 'rival',
    desc: 'Empuja a un animal rival a un punto libre de al lado.',
  },
  rescate: {
    id: 'rescate', n: 'Rescate', color: 'morada', costo: 2, obj: 'centro',
    desc: 'Saca un animal del centro y lo manda a la banca, listo para entrar.',
  },
  atajo: {
    id: 'atajo', n: 'Atajo', color: 'morada', costo: 1, obj: 'mia',
    desc: '+1 de movimiento a un animal tuyo durante este turno.',
  },
  instinto: {
    id: 'instinto', n: 'Instinto', color: 'azul', costo: 2, obj: 'mia',
    desc: 'En su próximo duelo de este turno gira dos veces y se queda con lo mejor.',
  },
};

export const LISTA = Object.values(PLACAS);
export const costoDe = (ids) => ids.reduce((s, id) => s + (PLACAS[id]?.costo || 0), 0);

// ¿es un mazo válido? (hasta 6 placas distintas y costo total hasta 6)
export function mazoValido(ids) {
  if (!Array.isArray(ids)) return false;
  if (ids.length > MAX_PLACAS) return false;
  if (new Set(ids).size !== ids.length) return false;
  if (ids.some(id => !PLACAS[id])) return false;
  return costoDe(ids) <= PRESUPUESTO;
}

// El mazo de arranque: costo EXACTO 6 (1+1+2+2). Ojo, que el primero que
// escribí costaba 7 y el propio validador lo rechazaba — lo cazó el test.
export const MAZO_BASE = ['rugido', 'hierba', 'estampida', 'rescate']
  .filter(id => PLACAS[id]);

export const mkMazo = (ids = MAZO_BASE) =>
  ids.filter(id => PLACAS[id]).map(id => ({ id, usada: false }));
