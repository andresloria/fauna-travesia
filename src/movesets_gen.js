// ============================================================
// movesets_gen.js — GENERADO por make_movesets.py. NO editar a mano.
// Kits ARENA para los animales SIN kit propio en habilidades.js.
// Numeros del estudio de Naruto-Arena (tools/na_personajes.json, ARENA.md §2b).
// Vida 100 para todos; la rareza sube la complejidad del kit, no los numeros.
// SIN NIVELES y SIN PASIVAS: las 3 habilidades estan disponibles desde el
// principio; lo unico que limita es el COSTO EN ENERGIA DE BIOMA.
// Re-generar: python make_movesets.py --aplicar
// ============================================================

export const MOVESETS_GEN = {
  perezoso_dos: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorazarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  mono_congo: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Mordida profunda', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Rabia del monte', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['bosque', 'bosque'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  monocara: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  mono_arana: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Aliento vital', desc:'Todo el equipo gana 15 de defensa destructible y cura 15.', costo:['bosque', 'bosque'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:15, obj:'equipo' }, { t:'curar', v:15, obj:'equipo' }] },
    ],
  },
  mono_titi: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  manigordo: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Velocidad cegadora', desc:'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  caucel: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Mordida profunda', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  leon_brenero: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Embestida brutal', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tigrillo: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Embestida brutal', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  danta: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Atrincherarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Piel de piedra', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  saino: {
    habs:[
      { n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Mordida profunda', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['sabana', 'sabana'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  chancho_monte: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Mordida profunda', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['bosque', 'bosque'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  cabro_monte: {
    habs:[
      { n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Zarpazo doble', desc:'30 de dano. Durante su modo pega +15.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['montana', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  pizote: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  mapache: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  mapache_cangrejero: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['agua'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  martilla: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  olingo: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Zarpazo doble', desc:'35 de dano a un enemigo.', costo:['bosque'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { n:'Carga salvaje', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  tolomuco: {
    habs:[
      { n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Zarpazo doble', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  grison: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Mordida profunda', desc:'30 de dano. Durante su modo pega +15.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['sabana', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  nutria: {
    habs:[
      { n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['agua'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Instinto agudo', desc:'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.', costo:['agua', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  comadreja: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['montana', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  zorro_pelon: {
    habs:[
      { n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  oso_hormiguero: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Zarpazo doble', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  serafin: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Instinto agudo', desc:'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  armadillo: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorazarse', desc:'Gana 30 de defensa destructible.', costo:['sabana'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['sabana', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tepezcuintle: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Cerrar filas', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  guatusa: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  ardilla: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  coyote: {
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Embestida brutal', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['montana', 'montana'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  zorro_gris: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['sabana'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  manati: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorazarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Piel de piedra', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  delfin: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Amparo', desc:'Cura 25 a un aliado.', costo:['agua'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  ballena: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Embestida brutal', desc:'35 de dano a un enemigo.', costo:['agua'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  yiguirro: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  lapa: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  lapa_verde: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tucan: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  tucan_castano: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  cusingo: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  tucancillo: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  pajaro_campana: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['montana', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  oropendola: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  colibri_fuego: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['montana', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  colibri_talamanca: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Aliento vital', desc:'Todo el equipo gana 15 de defensa destructible y cura 15.', costo:['montana', 'montana'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:15, obj:'equipo' }, { t:'curar', v:15, obj:'equipo' }] },
    ],
  },
  ermitano: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  jacamar: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  momoto: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Canto del bosque', desc:'Todo el equipo gana 15 de defensa destructible y cura 15.', costo:['sabana', 'sabana'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:15, obj:'equipo' }, { t:'curar', v:15, obj:'equipo' }] },
    ],
  },
  tangara_azul: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  tangara_dorada: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['montana'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['montana', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  bienteveo: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['sabana', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  garza: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['sabana'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  espatula: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['agua', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  jabiru: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['agua'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Aliento vital', desc:'Todo el equipo gana 15 de defensa destructible y cura 15.', costo:['agua', 'agua'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:15, obj:'equipo' }, { t:'curar', v:15, obj:'equipo' }] },
    ],
  },
  tantalo: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['agua'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Velocidad cegadora', desc:'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.', costo:['agua', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  ibis: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picada en picada', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  pelicano: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picotazo perforante', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  fragata: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Garra certera', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Rabia del monte', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  aguila_harpia: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picotazo perforante', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  caracara: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picada en picada', desc:'35 de dano a un enemigo.', costo:['sabana'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  zopilote_negro: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['sabana'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  zopilote_rojo: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picada en picada', desc:'35 de dano a un enemigo.', costo:['sabana'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { n:'Carga salvaje', desc:'20 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  lechuza: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picada en picada', desc:'35 de dano a un enemigo.', costo:['bosque'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { n:'Rugido', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  carpintero: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  saltarin: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  trogon: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Velocidad cegadora', desc:'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  martin_pescador: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['agua'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  anhinga: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picada en picada', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Frenesi', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  tinamu: {
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Instinto agudo', desc:'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.', costo:['bosque', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  chachalaca: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Garra certera', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { n:'Rabia del monte', desc:'20 de dano a TODOS los enemigos y quema 1 energia.', costo:['bosque', 'bosque'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  loro: {
    habs:[
      { n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  rana_verdinegra: {
    habs:[
      { n:'Secrecion', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Veneno espeso', desc:'25 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  rana_cristal: {
    habs:[
      { n:'Salto certero', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  rana_lechera: {
    habs:[
      { n:'Golpe de lengua', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  rana_tungara: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['sabana', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  rana_gladiadora: {
    habs:[
      { n:'Golpe de lengua', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  rana_payaso: {
    habs:[
      { n:'Toxina', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Veneno espeso', desc:'25 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  sapo_marino: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Veneno espeso', desc:'25 de toxina por turno durante 2 turnos.', costo:['sabana'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  sapo_dorado: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Toxina', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Sangria', desc:'25 de toxina y le ROBA 1 energia al enemigo.', costo:['montana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Toxina persistente', desc:'15 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['montana', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  salamandra: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['montana', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  garrobo: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['sabana'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Represalia total', desc:'20 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  basilisco: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['agua'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  anolis: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Guardia con puas', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['bosque'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Represalia total', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  geco: {
    habs:[
      { n:'Tarascada', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Hostigar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  caiman: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Mordida de presa', desc:'30 de dano. Durante su modo pega +15.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['agua', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  boa: {
    habs:[
      { n:'Toxina', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Sangria', desc:'25 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Toxina persistente', desc:'15 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  bocaraca: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponzona', desc:'25 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  lora: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponzona', desc:'25 de toxina por turno durante 2 turnos.', costo:['montana'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Nube toxica', desc:'20 de toxina a TODOS los enemigos.', costo:['montana', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  cascabel: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponzona', desc:'25 de toxina por turno durante 2 turnos.', costo:['sabana'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  matabuey: {
    habs:[
      { n:'Toxina', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Drenar', desc:'25 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Toxina persistente', desc:'15 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  coral: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Drenar', desc:'25 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Marca letal', desc:'15 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  serpiente_mar: {
    habs:[
      { n:'Toxina', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponzona', desc:'25 de toxina por turno durante 2 turnos.', costo:['agua'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  mica: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponzona', desc:'25 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  bejuquilla: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponzona', desc:'25 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  tortuga_baula: {
    habs:[
      { n:'Tarascada', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tortuga_carey: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tortuga_lora: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tortuga_cabezona: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  jicotea: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Atrincherarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tiburon_martillo: {
    habs:[
      { n:'Tenaza', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Picadura profunda', desc:'30 de dano. Durante su modo pega +15.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['agua', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tiburon_ballena: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Embate', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Atrincherarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Coraza ancestral', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  pez_vela: {
    habs:[
      { n:'Embate', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Embate de cardumen', desc:'30 de dano. Durante su modo pega +15.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['agua', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  marlin: {
    habs:[
      { n:'Tenaza', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Tenaza aplastante', desc:'30 de dano. Durante su modo pega +15.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['agua', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  mantarraya: {
    habs:[
      { n:'Tenaza', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['agua'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Canto del bosque', desc:'Todo el equipo gana 15 de defensa destructible y cura 15.', costo:['agua', 'agua'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:15, obj:'equipo' }, { t:'curar', v:15, obj:'equipo' }] },
    ],
  },
  mariposa: {
    habs:[
      { n:'Picadura', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  mariposa_buho: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Giro defensivo', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  mariposa_julia: {
    habs:[
      { n:'Embate', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  hormiga_bala: {
    habs:[
      { n:'Secrecion', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Ponzona', desc:'25 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Nube toxica', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  escarabajo: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Guardia con puas', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['bosque'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Lluvia de puas', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  cangrejo: {
    habs:[
      { n:'Tenaza', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['agua'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Represalia total', desc:'20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  tiburon: {
    habs:[
      { n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Tenaza aplastante', desc:'35 de dano a un enemigo.', costo:['agua'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { n:'Rugido', desc:'20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:3, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  quetzaldorado: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Aliento vital', desc:'Todo el equipo gana 15 de defensa destructible y cura 15.', costo:['montana', 'montana'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:15, obj:'equipo' }, { t:'curar', v:15, obj:'equipo' }] },
    ],
  },
  tarantula: {
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Veneno espeso', desc:'25 de toxina por turno durante 2 turnos.', costo:['bosque'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:25, turnos:2, obj:'enemigo' }] },
      { n:'Brote venenoso', desc:'20 de toxina a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos', toxina:true }] },
    ],
  },
  perro: {
    habs:[
      { n:'Mordida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Cerrar filas', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  gato: {
    habs:[
      { n:'Embestida', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Marcar presa', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['bosque'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Remolino', desc:'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:20, obj:'todos' }] },
    ],
  },
  comemaiz: {
    habs:[
      { n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:1, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['sabana', 'comodin'], recarga:4, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  f_segua: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Zarpazo espectral', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Acorralar', desc:'15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:['montana'], recarga:1, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'exponer', turnos:3, obj:'enemigo' }] },
      { n:'Velocidad cegadora', desc:'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.', costo:['montana', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  f_cadejos: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Zarpazo espectral', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Garra de la noche', desc:'30 de dano. Durante su modo pega +15.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['montana', 'comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  f_llorona: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Toxina', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Drenar', desc:'25 de toxina y le ROBA 1 energia al enemigo.', costo:['montana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Marca letal', desc:'15 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['montana', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  f_tulevieja: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Picadura toxica', desc:'15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.', costo:['comodin'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:15, turnos:2, obj:'enemigo' }] },
      { n:'Sangria', desc:'25 de toxina y le ROBA 1 energia al enemigo.', costo:['montana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { n:'Marca letal', desc:'15 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['montana', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }, { t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  f_padre: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Lamento', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['montana'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { n:'Coraza ancestral', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['montana', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  f_carreta: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    habs:[
      { n:'Lamento', desc:'20 de dano a un enemigo.', costo:['comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['montana'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { n:'Lluvia de puas', desc:'20 de dano a TODOS los enemigos.', costo:['montana', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
};
