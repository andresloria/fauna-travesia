// ============================================================
// habilidades.js — MOVESETS del combate por turnos (ver ARENA.md).
// Cada animal: 3 habilidades + esquiva universal. SIN NIVELES y SIN PASIVAS
// (20-jul): están TODAS disponibles siempre; lo único que limita qué podés
// usar es el COSTO EN ENERGÍA DE BIOMA (y la recarga).
// Los números siguen el lenguaje del juego original (vida base 100):
//   básico 15-20 · fuerte 25-30 · pesado 40 · definitiva 100
//   veneno 10-25 por turno (2-4 turnos) · curar 25 · reducir 5-10
//   defensa destructible 20-40 · área 15 · robar 1 energía
//   recargas: 0 básicos · 1 fuertes · 2-3 control · 4 definitivas y esquiva
// ============================================================

import { MOVESETS_GEN } from './movesets_gen.js';
import { MOVESETS_DOC } from './movesets_doc.js';

// ⚠️ VIDA = 100 PARA TODOS y SIN NIVELES (regla ARENA, 20-jul): nada de stats
// ni de progresión por animal. Todos entran en igualdad; la diferencia está
// en el KIT y en cuánta energía de su bioma podés pagar. Ver ARENA.md §3.

// ---------- tipos de energía = biomas ----------
export const ENERGIA = {
  bosque:  { n:'Bosque',  e:'🌳', color:'#3f8f4a' },
  sabana:  { n:'Sabana',  e:'🌾', color:'#c8923f' },
  agua:    { n:'Agua',    e:'🌊', color:'#2f6f8f' },
  montana: { n:'Montaña', e:'⛰️', color:'#8a6f9a' },
  comodin: { n:'Comodín', e:'⚪', color:'#9a9a9a' },   // paga cualquier tipo
};

// ---------- clases de habilidad ----------
export const CLASES = {
  fisico:   'Físico',      natural:'Natural',   toxina:'Toxina',    instinto:'Instinto',
  melee:    'Cuerpo a cuerpo', rango:'A distancia',
  instant:  'Instantáneo', sostenido:'Sostenido', control:'Control', unico:'Único',
};

// ---------- ESQUIVA universal (todos la tienen, siempre) ----------
// En el original TODOS los personajes tienen esta 4ª habilidad.
export const ESQUIVA = {
  n:'Esquivar', desc:'Se vuelve invulnerable 1 turno.',
  costo:['comodin'], recarga:4, clases:['fisico','instant'],
  efectos:[{ t:'invulnerable', turnos:1, obj:'self' }],
};

// ---------- helpers ----------
const dmg   = (v, o='enemigo')            => ({ t:'dano', v, obj:o });
const dot   = (v, turnos, o='enemigo')    => ({ t:'danoTurnos', v, turnos, obj:o });
const cura  = (v, o='aliado')             => ({ t:'curar', v, obj:o });
const defen = (v, o='self')               => ({ t:'defensa', v, obj:o });
const reduc = (v, turnos, o='self')       => ({ t:'reducir', v, turnos, obj:o });
const invul = (turnos, o='self')          => ({ t:'invulnerable', turnos, obj:o });
const stun  = (turnos, o='enemigo', clase=null) => ({ t:'aturdir', turnos, obj:o, clase });
const robar = (n=1)                       => ({ t:'robarEnergia', n, obj:'enemigo' });
const quemar= (n=1)                       => ({ t:'quemarEnergia', n, obj:'enemigo' });
const area  = (v)                         => ({ t:'dano', v, obj:'todos' });
const contra= (v)                         => ({ t:'contraataque', v, obj:'self' });
const ampl  = (v, turnos, o='enemigo')    => ({ t:'amplificar', v, turnos, obj:o });
const limpiar = (o='aliado')              => ({ t:'limpiar', obj:o });

// ============================================================
// PRIMER LOTE — hechos a mano, uno por rol/bioma para validar el sistema.
// key = la misma del roster (src/fauna_roster.js)
// ============================================================
export const MOVESETS = {

  // ---------- BOSQUE ----------
  jaguar: {
    habs:[
      { n:'Zarpazo', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Mordida al cráneo', desc:'40 de daño. Ignora la defensa destructible.',
        costo:['bosque','comodin'], recarga:1, clases:['fisico','melee','instant'],
        efectos:[{ ...dmg(40), ignoraDefensa:true }] },
      { n:'Acecho', desc:'Invulnerable 1 turno. Su próximo Zarpazo pega +20.',
        costo:['montana'], recarga:4, clases:['instinto','unico','instant'],
        efectos:[invul(1), ampl(20,2,'self')] },
    ],
  },
  perezoso: {
    habs:[
      { n:'Zarpa perezosa', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Camuflaje de algas', desc:'Gana 30 de defensa destructible.',
        costo:['bosque'], recarga:3, clases:['natural','instant'], efectos:[defen(30)] },
      { n:'Quietud total', desc:'Todo el equipo recibe 10 menos de daño durante 3 turnos.',
        costo:['bosque','comodin'], recarga:4, clases:['instinto','unico','sostenido'],
        efectos:[reduc(10,3,'equipo')] },
    ],
  },
  rana_ojos_rojos: {
    habs:[
      { n:'Salto', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','rango','instant'], efectos:[dmg(20)] },
      { n:'Colores de aviso', desc:'Un aliado recibe 15 menos de daño durante 3 turnos.',
        costo:['agua'], recarga:3, clases:['instinto','sostenido'], efectos:[reduc(15,3)] },
      { n:'Salto al dosel', desc:'Invulnerable 1 turno y cura 25 a un aliado.',
        costo:['bosque','agua'], recarga:4, clases:['natural','instant'],
        efectos:[invul(1), cura(25)] },
    ],
  },
  ranadardo: {
    habs:[
      { n:'Secreción', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.',
        costo:['comodin'], recarga:0, clases:['toxina','rango','sostenido'], efectos:[dot(15,2)] },
      { n:'Veneno concentrado', desc:'25 de toxina por turno durante 2 turnos.',
        costo:['bosque','comodin'], recarga:2, clases:['toxina','rango','sostenido'], efectos:[dot(25,2)] },
      { n:'Bruma tóxica', desc:'15 de daño a TODOS los enemigos y les roba 1 energía.',
        costo:['bosque','bosque'], recarga:4, clases:['toxina','rango','unico','instant'],
        efectos:[area(15), robar(1)] },
    ],
  },
  serpiente: {   // Terciopelo
    habs:[
      { n:'Mordida', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Veneno hemotóxico', desc:'20 de toxina por turno durante 3 turnos.',
        costo:['bosque','comodin'], recarga:1, clases:['toxina','melee','sostenido'], efectos:[dot(20,3)] },
      { n:'Golpe fulminante', desc:'40 de daño y aturde sus habilidades físicas 1 turno.',
        costo:['bosque','montana'], recarga:3, clases:['fisico','melee','unico','instant'],
        efectos:[dmg(40), stun(1,'enemigo','fisico')] },
    ],
  },

  // ---------- MONTAÑA ----------
  quetzal: {
    habs:[
      { n:'Picotazo', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','rango','instant'], efectos:[dmg(20)] },
      { n:'Vuelo del bosque nuboso', desc:'Cura 25 a un aliado y le quita los efectos dañinos.',
        costo:['montana','comodin'], recarga:2, clases:['natural','rango','instant'],
        efectos:[cura(25), limpiar()] },
      { n:'Manto esmeralda', desc:'Todo el equipo gana 20 de defensa destructible.',
        costo:['montana','montana'], recarga:4, clases:['natural','unico','instant'],
        efectos:[defen(20,'equipo')] },
    ],
  },
  puma: {
    habs:[
      { n:'Salto de caza', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Persecución', desc:'25 de daño por turno durante 2 turnos al mismo enemigo.',
        costo:['montana','comodin'], recarga:1, clases:['fisico','melee','sostenido'], efectos:[dot(25,2)] },
      { n:'Zarpazo definitivo', desc:'Necesita 2 de montaña y gasta TODA tu energía: 100 de daño.',
        costo:['montana','montana','TODO'], recarga:4, clases:['fisico','melee','unico','instant'],
        efectos:[dmg(100)] },
    ],
  },

  // ---------- AGUA ----------
  tortuga: {
    habs:[
      { n:'Embestida', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Refugio en el caparazón', desc:'Invulnerable 1 turno y gana 20 de defensa.',
        costo:['agua'], recarga:3, clases:['fisico','instant'], efectos:[invul(1), defen(20)] },
      { n:'Corriente protectora', desc:'Todo el equipo gana 30 de defensa destructible.',
        costo:['agua','comodin'], recarga:4, clases:['natural','unico','instant'],
        efectos:[defen(30,'equipo')] },
    ],
  },
  cocodrilo: {
    habs:[
      { n:'Dentellada', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Giro de la muerte', desc:'40 de daño y aturde sus habilidades físicas 1 turno.',
        costo:['agua','comodin'], recarga:2, clases:['fisico','melee','instant'],
        efectos:[dmg(40), stun(1,'enemigo','fisico')] },
      { n:'Acecho sumergido', desc:'Invulnerable 1 turno; al salir, 30 de daño a un enemigo.',
        costo:['agua','agua'], recarga:4, clases:['fisico','unico','control'],
        efectos:[invul(1), dmg(30)] },
    ],
  },

  // ---------- SABANA ----------
  venado: {
    habs:[
      { n:'Cornada', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Carrera', desc:'Invulnerable 1 turno.',
        costo:['sabana'], recarga:3, clases:['fisico','instant'], efectos:[invul(1)] },
      { n:'Estampida', desc:'15 de daño a TODOS los enemigos y les quema 1 energía.',
        costo:['sabana','comodin'], recarga:4, clases:['fisico','melee','unico','instant'],
        efectos:[area(15), quemar(1)] },
    ],
  },
  iguana: {
    habs:[
      { n:'Coletazo', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Tomar sol', desc:'Se cura 25 y gana 5 de reducción de daño por 3 turnos.',
        costo:['sabana'], recarga:2, clases:['natural','instant'],
        efectos:[cura(25,'self'), reduc(5,3)] },
      { n:'Quietud pétrea', desc:'Invulnerable 2 turnos, pero no puede atacar mientras dure.',
        costo:['sabana','comodin'], recarga:4, clases:['instinto','unico','control'],
        efectos:[invul(2)] },
    ],
  },

  // ---------- ROBO DE ENERGÍA (el rol que pediste) ----------
  murcielago: {
    habs:[
      { n:'Aleteo', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','rango','instant'], efectos:[dmg(20)] },
      { n:'Sangría', desc:'20 de toxina y le ROBA 1 energía al enemigo.',
        costo:['bosque'], recarga:1, clases:['toxina','rango','unico','instant'],
        efectos:[{ ...dmg(20), toxina:true }, robar(1)] },
      { n:'Enjambre nocturno', desc:'15 a todos los enemigos y roba 1 energía a cada uno.',
        costo:['bosque','montana'], recarga:4, clases:['toxina','rango','unico','instant'],
        efectos:[area(15), robar(1)] },
    ],
  },
  abeja: {
    habs:[
      { n:'Picadura', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','rango','instant'], efectos:[dmg(20)] },
      { n:'Polinizar', desc:'Cura 25 a un aliado y le da 1 energía de bosque.',
        costo:['bosque'], recarga:2, clases:['natural','rango','instant'],
        efectos:[cura(25), { t:'darEnergia', tipo:'bosque', n:1, obj:'aliado' }] },
      { n:'Enjambre', desc:'15 a todos los enemigos; los que reciban daño quedan aturdidos 1 turno.',
        costo:['bosque','sabana'], recarga:4, clases:['fisico','rango','unico','instant'],
        efectos:[area(15), stun(1,'todos')] },
    ],
  },

  // ---------- CONTRAATAQUE ----------
  puercoespin: {
    habs:[
      { n:'Empuje', desc:'20 de daño a un enemigo.',
        costo:['comodin'], recarga:0, clases:['fisico','melee','instant'], efectos:[dmg(20)] },
      { n:'Erizarse', desc:'Contraataque: durante 2 turnos, quien lo ataque recibe 25 de daño.',
        costo:['bosque'], recarga:3, clases:['fisico','unico','control'], efectos:[contra(25)] },
      { n:'Lluvia de púas', desc:'20 de daño a todos los enemigos.',
        costo:['bosque','comodin'], recarga:4, clases:['fisico','rango','instant'], efectos:[area(20)] },
    ],
  },
};

// ---------- utilidades ----------
// PRIORIDAD (21-jul): manda el DOCUMENTO de Andrés (movesets_doc.js, 4
// habilidades por animal, portadas del original). Después los kits a mano de
// abajo y por último los generados por plantilla (movesets_gen.js), que cubren
// las especies que el documento todavía no trae. Juntos: las 136 del roster.
const kitDe = (key) => MOVESETS_DOC[key] || MOVESETS[key] || MOVESETS_GEN[key] || null;

// ¿este animal ya tiene su kit oficial del documento?
export const esKitOficial = (key) => !!MOVESETS_DOC[key];

// Habilidades de un animal: las suyas (+ la esquiva). No hay niveles ni
// pasivas. El 2º argumento se ignora; queda por compatibilidad de llamadas.
export function habsDe(key) {
  const m = kitDe(key);
  if (!m) return { habs: [], esquiva: ESQUIVA };
  return { habs: m.habs, esquiva: ESQUIVA };
}
export const tieneMoveset = (key) => !!kitDe(key);
export const COBERTURA = () => new Set([...Object.keys(MOVESETS_DOC),
  ...Object.keys(MOVESETS), ...Object.keys(MOVESETS_GEN)]).size;
