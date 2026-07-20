// ============================================================
// movesets_gen.js — GENERADO por make_movesets.py. NO editar a mano.
// Kits ARENA para los animales SIN kit propio en habilidades.js.
// Numeros del estudio de Naruto-Arena (tools/na_personajes.json, ARENA.md §2b).
// Vida 100 para todos; la rareza sube la complejidad del kit, no los numeros.
// Re-generar: python make_movesets.py --aplicar
// ============================================================

export const MOVESETS_GEN = {
  perezoso_dos: {
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Mordida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acorazarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  mono_congo: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Embestida', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Mordida profunda', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Rabia del monte', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['bosque', 'bosque'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  monocara: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  mono_arana: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Aliento vital', desc:'Todo el equipo gana 10 de defensa destructible y cura 10.', costo:['bosque', 'bosque'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:10, obj:'equipo' }, { t:'curar', v:10, obj:'equipo' }] },
    ],
  },
  mono_titi: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Embestida', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  manigordo: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Velocidad cegadora', desc:'MODO: 4 turnos; su golpe basico pega +10 y no gasta energia.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  caucel: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Mordida', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Mordida profunda', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  leon_brenero: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Embestida brutal', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tigrillo: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Mordida', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Embestida brutal', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  danta: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Coraza', desc:'Empieza cada combate con 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Atrincherarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Piel de piedra', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  saino: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Manotazo', desc:'25 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Mordida profunda', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['sabana', 'sabana'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  chancho_monte: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Embestida', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Mordida profunda', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['bosque', 'bosque'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  cabro_monte: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Manotazo', desc:'25 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Zarpazo doble', desc:'30 de dano. Durante su modo pega +15.', costo:['montana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  pizote: {
    pasiva:{ n:'Instinto de manada', desc:'Al final de su turno, el aliado mas herido recupera 5.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  mapache: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  mapache_cangrejero: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Mordida', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['agua'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  martilla: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Embestida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  olingo: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Embestida', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Zarpazo doble', desc:'35 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { nv:8, n:'Carga salvaje', desc:'15 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:2, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }] },
    ],
  },
  tolomuco: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Manotazo', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Zarpazo doble', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  grison: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Mordida', desc:'25 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Mordida profunda', desc:'30 de dano. Durante su modo pega +15.', costo:['sabana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  nutria: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Instinto agudo', desc:'MODO: 4 turnos; su golpe basico pega +10 y no gasta energia.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  comadreja: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Embestida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['montana', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  zorro_pelon: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Manotazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  oso_hormiguero: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Mordida', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Zarpazo doble', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  serafin: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Mordida', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Instinto agudo', desc:'MODO: 4 turnos; su golpe basico pega +10 y no gasta energia.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  armadillo: {
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acorazarse', desc:'Gana 30 de defensa destructible.', costo:['sabana'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['sabana', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tepezcuintle: {
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Mordida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Cerrar filas', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  guatusa: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  ardilla: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  coyote: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'25 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Embestida brutal', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['montana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['montana', 'montana'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  zorro_gris: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Mordida', desc:'20 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['sabana'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  manati: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Coraza', desc:'Empieza cada combate con 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Zarpazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acorazarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Piel de piedra', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  delfin: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Embestida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Amparo', desc:'Cura 25 a un aliado.', costo:['agua'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['agua', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  ballena: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Embestida', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Embestida brutal', desc:'35 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:2, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }] },
    ],
  },
  yiguirro: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  lapa: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  lapa_verde: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tucan: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  tucan_castano: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  cusingo: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  tucancillo: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  pajaro_campana: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['montana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  oropendola: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  colibri_fuego: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['montana', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  colibri_talamanca: {
    pasiva:{ n:'Instinto de manada', desc:'Al final de su turno, el aliado mas herido recupera 5.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Aliento vital', desc:'Todo el equipo gana 10 de defensa destructible y cura 10.', costo:['montana', 'montana'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:10, obj:'equipo' }, { t:'curar', v:10, obj:'equipo' }] },
    ],
  },
  ermitano: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  jacamar: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  momoto: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Canto del bosque', desc:'Todo el equipo gana 10 de defensa destructible y cura 10.', costo:['sabana', 'sabana'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:10, obj:'equipo' }, { t:'curar', v:10, obj:'equipo' }] },
    ],
  },
  tangara_azul: {
    pasiva:{ n:'Instinto de manada', desc:'Al final de su turno, el aliado mas herido recupera 5.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  tangara_dorada: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['montana'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  bienteveo: {
    pasiva:{ n:'Instinto de manada', desc:'Al final de su turno, el aliado mas herido recupera 5.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['sabana', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  garza: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['sabana'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  espatula: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Garra certera', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  jabiru: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['agua'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Aliento vital', desc:'Todo el equipo gana 10 de defensa destructible y cura 10.', costo:['agua', 'agua'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:10, obj:'equipo' }, { t:'curar', v:10, obj:'equipo' }] },
    ],
  },
  tantalo: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Velocidad cegadora', desc:'MODO: 4 turnos; su golpe basico pega +10 y no gasta energia.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  ibis: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picada en picada', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  pelicano: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picotazo perforante', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  fragata: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Garra certera', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Rabia del monte', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  aguila_harpia: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picotazo perforante', desc:'30 de dano. Durante su modo pega +15.', costo:['bosque', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  caracara: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picada en picada', desc:'35 de dano a un enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:2, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }] },
    ],
  },
  zopilote_negro: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['sabana'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  zopilote_rojo: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['sabana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picada en picada', desc:'35 de dano a un enemigo.', costo:['sabana', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { nv:8, n:'Carga salvaje', desc:'15 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:2, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }] },
    ],
  },
  lechuza: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picada en picada', desc:'35 de dano a un enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { nv:8, n:'Rugido', desc:'15 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:2, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }] },
    ],
  },
  carpintero: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  saltarin: {
    pasiva:{ n:'Instinto de manada', desc:'Al final de su turno, el aliado mas herido recupera 5.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  trogon: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Velocidad cegadora', desc:'MODO: 4 turnos; su golpe basico pega +10 y no gasta energia.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  martin_pescador: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['agua'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  anhinga: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picada en picada', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Frenesi', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['agua', 'agua'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  tinamu: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Instinto agudo', desc:'MODO: 4 turnos; su golpe basico pega +10 y no gasta energia.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  chachalaca: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'25 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Garra certera', desc:'40 de dano y el enemigo pierde 1 energia al azar.', costo:['bosque', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:40, obj:'enemigo' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Rabia del monte', desc:'15 de dano a TODOS los enemigos y quema 1 energia.', costo:['bosque', 'bosque'], recarga:3, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }, { t:'quemarEnergia', n:1, obj:'enemigo' }] },
    ],
  },
  loro: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Aletazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  rana_verdinegra: {
    pasiva:{ n:'Colores de aviso', desc:'Los rivales le pegan 5 menos el primer turno de cada toxina suya.' },
    habs:[
      { nv:1, n:'Secrecion', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Veneno espeso', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['bosque', 'bosque'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  rana_cristal: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Salto certero', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Amparo', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  rana_lechera: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Golpe de lengua', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['bosque'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['bosque', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  rana_tungara: {
    pasiva:{ n:'Instinto de manada', desc:'Al final de su turno, el aliado mas herido recupera 5.' },
    habs:[
      { nv:1, n:'Embestida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['sabana', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  rana_gladiadora: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Golpe de lengua', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  rana_payaso: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Toxina', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Veneno espeso', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['bosque', 'bosque'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  sapo_marino: {
    pasiva:{ n:'Colores de aviso', desc:'Los rivales le pegan 5 menos el primer turno de cada toxina suya.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['sabana'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Veneno espeso', desc:'20 de toxina por turno durante 2 turnos.', costo:['sabana', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['sabana', 'sabana'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  sapo_dorado: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Toxina', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['montana'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Sangria', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Toxina persistente', desc:'PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['montana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  salamandra: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Embestida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Refugio', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['montana', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  garrobo: {
    pasiva:{ n:'Advertencia', desc:'El primer golpe que recibe cada combate se le devuelve a medias.' },
    habs:[
      { nv:1, n:'Mordida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['sabana'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { nv:8, n:'Represalia total', desc:'20 de dano a TODOS los enemigos.', costo:['sabana', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  basilisco: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Mordida', desc:'20 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['agua'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  anolis: {
    pasiva:{ n:'Puas', desc:'Quien lo golpee cuerpo a cuerpo recibe 10 de dano.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Guardia con puas', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['bosque'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { nv:8, n:'Represalia total', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  geco: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Tarascada', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Hostigar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  caiman: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Mordida de presa', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  boa: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Toxina', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Sangria', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Toxina persistente', desc:'PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['bosque'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  bocaraca: {
    pasiva:{ n:'Colores de aviso', desc:'Los rivales le pegan 5 menos el primer turno de cada toxina suya.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['bosque', 'bosque'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  lora: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['montana'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['montana', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Nube toxica', desc:'15 de toxina a TODOS los enemigos.', costo:['montana', 'montana'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  cascabel: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['sabana'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['sabana', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['sabana', 'sabana'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  matabuey: {
    pasiva:{ n:'Colores de aviso', desc:'Los rivales le pegan 5 menos el primer turno de cada toxina suya.' },
    habs:[
      { nv:1, n:'Toxina', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Drenar', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Toxina persistente', desc:'PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['bosque'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  coral: {
    pasiva:{ n:'Colores de aviso', desc:'Los rivales le pegan 5 menos el primer turno de cada toxina suya.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Drenar', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Marca letal', desc:'PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['bosque'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  serpiente_mar: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Toxina', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['agua'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['agua', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['agua', 'agua'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  mica: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['bosque', 'bosque'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  bejuquilla: {
    pasiva:{ n:'Colores de aviso', desc:'Los rivales le pegan 5 menos el primer turno de cada toxina suya.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['bosque', 'bosque'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  tortuga_baula: {
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Tarascada', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tortuga_carey: {
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tortuga_lora: {
    pasiva:{ n:'Coraza', desc:'Empieza cada combate con 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tortuga_cabezona: {
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Mordida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  jicotea: {
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Atrincherarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Muralla', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['agua', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  tiburon_martillo: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Tenaza', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Picadura profunda', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  tiburon_ballena: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Embate', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Atrincherarse', desc:'Gana 30 de defensa destructible.', costo:['agua'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Coraza ancestral', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  pez_vela: {
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Embate', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Embate de cardumen', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  marlin: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Tenaza', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Tenaza aplastante', desc:'30 de dano. Durante su modo pega +15.', costo:['agua', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Furia ancestral', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  mantarraya: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Tenaza', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['agua'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Canto del bosque', desc:'Todo el equipo gana 10 de defensa destructible y cura 10.', costo:['agua', 'agua'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:10, obj:'equipo' }, { t:'curar', v:10, obj:'equipo' }] },
    ],
  },
  mariposa: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Picadura', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  mariposa_buho: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Giro defensivo', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  mariposa_julia: {
    pasiva:{ n:'Madrugador', desc:'Su primera habilidad de cada combate no gasta energia.' },
    habs:[
      { nv:1, n:'Embate', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  hormiga_bala: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Secrecion', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Ponzoña', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Nube toxica', desc:'15 de toxina a TODOS los enemigos.', costo:['bosque', 'bosque'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  escarabajo: {
    pasiva:{ n:'Puas', desc:'Quien lo golpee cuerpo a cuerpo recibe 10 de dano.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Guardia con puas', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['bosque'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { nv:8, n:'Lluvia de puas', desc:'20 de dano a TODOS los enemigos.', costo:['bosque', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  cangrejo: {
    pasiva:{ n:'Puas', desc:'Quien lo golpee cuerpo a cuerpo recibe 10 de dano.' },
    habs:[
      { nv:1, n:'Tenaza', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['agua'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { nv:8, n:'Represalia total', desc:'20 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
  tiburon: {
    pasiva:{ n:'Sangre caliente', desc:'Cuando su vida baja de 50, sus golpes pegan +5.' },
    habs:[
      { nv:1, n:'Coletazo', desc:'25 de dano a un enemigo.', costo:['agua'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Tenaza aplastante', desc:'35 de dano a un enemigo.', costo:['agua', 'comodin'], recarga:1, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:35, obj:'enemigo' }] },
      { nv:8, n:'Rugido', desc:'15 de dano a TODOS los enemigos.', costo:['agua', 'comodin'], recarga:2, clases:['fisico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos' }] },
    ],
  },
  quetzaldorado: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Instinto de manada', desc:'Al final de su turno, el aliado mas herido recupera 5.' },
    habs:[
      { nv:1, n:'Picotazo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Cuido de manada', desc:'Cura 25 a un aliado.', costo:['montana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Aliento vital', desc:'Todo el equipo gana 10 de defensa destructible y cura 10.', costo:['montana', 'montana'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:10, obj:'equipo' }, { t:'curar', v:10, obj:'equipo' }] },
    ],
  },
  tarantula: {
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['bosque'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Veneno espeso', desc:'20 de toxina por turno durante 2 turnos.', costo:['bosque', 'comodin'], recarga:1, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:20, turnos:2, obj:'enemigo' }] },
      { nv:8, n:'Brote venenoso', desc:'15 de toxina a TODOS los enemigos.', costo:['bosque', 'bosque'], recarga:3, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:15, obj:'todos', toxina:true }] },
    ],
  },
  perro: {
    pasiva:{ n:'Coraza', desc:'Empieza cada combate con 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Mordida', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['bosque'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Cerrar filas', desc:'Todo el equipo gana 20 de defensa destructible.', costo:['bosque', 'comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:20, obj:'equipo' }] },
    ],
  },
  gato: {
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Embestida', desc:'20 de dano a un enemigo.', costo:['bosque'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Marcar presa', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Remolino', desc:'Invulnerable 1 turno y 15 de dano a TODOS los enemigos.', costo:['bosque'], recarga:1, clases:['fisico', 'unico', 'instant'], efectos:[{ t:'invulnerable', turnos:1, obj:'self' }, { t:'dano', v:15, obj:'todos' }] },
    ],
  },
  comemaiz: {
    pasiva:{ n:'Piel que sana', desc:'Si no lo atacaron en el turno, recupera 10.' },
    habs:[
      { nv:1, n:'Rasguño en vuelo', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Acicalar', desc:'Cura 25 a un aliado.', costo:['sabana'], recarga:0, clases:['natural', 'instant'], efectos:[{ t:'curar', v:25, obj:'aliado' }] },
      { nv:8, n:'Cuido constante', desc:'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.', costo:['sabana', 'comodin'], recarga:3, clases:['natural', 'sostenido'], efectos:[{ t:'curarTurnos', v:10, turnos:3, obj:'aliado' }, { t:'limpiar', obj:'aliado' }] },
    ],
  },
  f_segua: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Reflejos', desc:'La primera vez que lo atacan cada combate, esquiva el golpe.' },
    habs:[
      { nv:1, n:'Zarpazo espectral', desc:'20 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo' }] },
      { nv:4, n:'Acorralar', desc:'GRATIS: el enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.', costo:[], recarga:0, clases:['instinto', 'rango', 'instant'], efectos:[{ t:'exponer', turnos:3, obj:'enemigo' }] },
      { nv:8, n:'Velocidad cegadora', desc:'MODO: 4 turnos; su golpe basico pega +10 y no gasta energia.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:10, turnos:4, obj:'self' }] },
    ],
  },
  f_cadejos: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Territorial', desc:'El primer golpe que da cada combate pega +10.' },
    habs:[
      { nv:1, n:'Zarpazo espectral', desc:'25 de dano a un enemigo.', costo:['montana'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:25, obj:'enemigo' }] },
      { nv:4, n:'Garra de la noche', desc:'30 de dano. Durante su modo pega +15.', costo:['montana', 'comodin'], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:30, obj:'enemigo' }] },
      { nv:8, n:'Instinto depredador', desc:'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.', costo:['comodin'], recarga:4, clases:['instinto', 'unico', 'instant'], efectos:[{ t:'modo', turnos:4 }, { t:'reducir', v:15, turnos:4, obj:'self' }] },
    ],
  },
  f_llorona: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Piel toxica', desc:'Quien lo golpee cuerpo a cuerpo recibe 5 de toxina por 2 turnos.' },
    habs:[
      { nv:1, n:'Toxina', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['montana'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Drenar', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Marca letal', desc:'PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['montana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  f_tulevieja: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Colores de aviso', desc:'Los rivales le pegan 5 menos el primer turno de cada toxina suya.' },
    habs:[
      { nv:1, n:'Picadura toxica', desc:'10 de toxina por turno durante 3 turnos. Atraviesa invulnerabilidad.', costo:['montana'], recarga:0, clases:['toxina', 'sostenido'], efectos:[{ t:'danoTurnos', v:10, turnos:3, obj:'enemigo' }] },
      { nv:4, n:'Sangria', desc:'20 de toxina y le ROBA 1 energia al enemigo.', costo:['montana', 'comodin'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'dano', v:20, obj:'enemigo', toxina:true }, { t:'robarEnergia', n:1, obj:'enemigo' }] },
      { nv:8, n:'Marca letal', desc:'PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.', costo:['montana'], recarga:1, clases:['toxina', 'unico', 'instant'], efectos:[{ t:'marcaPermanente', v:5, obj:'enemigo' }] },
    ],
  },
  f_padre: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Paciencia', desc:'Si no ataca en el turno, gana 10 de defensa destructible.' },
    habs:[
      { nv:1, n:'Lamento', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Plantarse', desc:'Gana 30 de defensa destructible.', costo:['montana'], recarga:3, clases:['natural', 'instant'], efectos:[{ t:'defensa', v:30, obj:'self' }] },
      { nv:8, n:'Coraza ancestral', desc:'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.', costo:['comodin'], recarga:4, clases:['natural', 'unico', 'instant'], efectos:[{ t:'defensa', v:40, obj:'self', permanente:true }] },
    ],
  },
  f_carreta: {
  // TODO: kit unico a mano (legendario/mitico) — este es provisional
    pasiva:{ n:'Puas', desc:'Quien lo golpee cuerpo a cuerpo recibe 10 de dano.' },
    habs:[
      { nv:1, n:'Lamento', desc:'15 de dano a un enemigo.', costo:[], recarga:0, clases:['fisico', 'melee', 'instant'], efectos:[{ t:'dano', v:15, obj:'enemigo' }] },
      { nv:4, n:'Erizarse', desc:'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.', costo:['montana'], recarga:3, clases:['fisico', 'unico', 'control'], efectos:[{ t:'contraataque', v:25, obj:'self' }] },
      { nv:8, n:'Lluvia de puas', desc:'20 de dano a TODOS los enemigos.', costo:['montana', 'comodin'], recarga:4, clases:['fisico', 'rango', 'instant'], efectos:[{ t:'dano', v:20, obj:'todos' }] },
    ],
  },
};
