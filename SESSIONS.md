# SESSIONS — bitácora de Fauna · Travesía

Registro de cada tanda de trabajo, para poder ubicarse en cualquier estado del proyecto.
Repo: `github.com/andresloria/fauna-travesia` · Live: `fauna-travesia.vercel.app`

---

## Sesión — 19/20 jul 2026

### Cómo está el juego HOY (lo que está en vivo y funcionando)

**Contenido**
- 136 especies (127 fauna tica + 6 leyendas del folclor + 3 básicos), arte pixel real.
- 7 provincias + Monteverde (final) + **mapa Tenebroso** (easter egg: ir SIEMPRE por la izquierda).
- **130 fichas oficiales** con datos reales (`src/fichas.js`): nombre científico, hábitat tico,
  dieta, dato curioso y estado de conservación. Salen la 1ª vez que rescatás cada especie.
- **8 cabecillas propios**, uno por provincia, con arte y personalidad (`src/historia.js`).
- **Sistema de diálogos** estilo novela visual (`src/dialogo.js`): retrato, placa de nombre,
  palabras resaltadas, hasta 4 opciones con respuesta, botón **SALTAR ⏭ / Esc**.
- Guion completo: llegada / careo / victoria por provincia, entrada + 6 leyendas + cierre del
  Tenebroso, charlas de lugar, y el guía **aconseja** ante un hallazgo raro comparando con tu equipo.

**Aspecto**
- Skin GBA en TODA la interfaz: cielo celeste, paneles crema con borde grueso y bisel,
  tipografía pixel auto-hospedada (Press Start 2P + VT323 en `assets/fonts/`).
- Mapas con identidad por provincia: pasto propio, vista del lugar real al fondo y props de
  PixelLab (Teatro Nacional, Basílica, ruinas, volcán, faro, árbol de Guanacaste, plataneras…).
- **Cartas estilo colección**: marco que brilla según rareza (común nada → raro sutil → ultra
  medio → legendario oro → extinto cobre → **mítico con aura negra**), arte a sangre sobre el
  bioma, corazones de vida y barras de estadísticas.

### Lo que se hizo en esta sesión

**1. Veredicto del juego** — simulador propio, 3000 partidas + 50.000 duelos. Hallazgos:
- `MAX_HEARTS` era 1 → cualquier derrota mataba, y los "+1 corazón" del refugio y del cabecilla
  **no hacían nada** (topados en 1). El juego era una ruleta de 8 tiros (43% llegaba al final).
- **"Primer golpe" rendía 31.7% en 1v1: MENOS que no tener habilidad (32.4%).**
- "Escudo" servía una sola vez por pelea (35.4%). "Veneno" dominaba (84.7%).
- En un **espejo exacto el bando A ganaba el 100%** (el desempate iba por uid).
- **Subir de nivel casi no se sentía**: 2 niveles = +4 puntos de victoria; +2 de defensa = +21.
- El experto y el normal ganaban igual (33.6% vs 36.2%) → **no había estrategia**.

**2. Arreglos (todos medidos, no a ojo)**
- Primer golpe: rearma **cada ronda** + su golpe de prioridad pega **+1**.
- Escudo: amortigua **un tercio del 1er golpe de cada ronda** (con la mitad se volvía OP: 77.6%).
- Desempate **al azar** → espejos a 48-50%.
- El nivel da **defensa cada 3 niveles** → 2 niveles ahora valen **+26 puntos** (antes +4).
- `MAX_HEARTS: 2` — los corazones por fin significan algo.
- `enemyLevel(depth, isBoss, playerLvl)`: **piso que sigue al jugador** sin adelantarlo. Se
  terminaba en Nv~25 contra un cabecilla Nv~15. Efecto: **farmear dejó de ser gratis**
  (el perfil que grindea bajó de 92% a 56.7%).
- Anti-frustración: si todo el equipo queda debilitado, **el más entero se levanta**.
- Reparto de habilidades: de 53 puntos de diferencia a **30**; todas por encima de "sin habilidad".

**3. Diseño del combate nuevo (ARENA)** — ver `ARENA.md`
Estudiado del wiki de Naruto-Arena (reglas + fichas de personajes reales). El lenguaje numérico
está **copiado, no inventado**.

**4. Sistema de misiones** — ver `src/misiones.js`
Rangos D→S derivados de la rareza; la mayoría piden **rachas** (perder reinicia), que es lo que
obliga a armar estrategia.

**5. (20-jul) REGLA: vida 100 para TODOS** — pedido de Andrés. Como el original: ni nivel ni
rareza tocan stats; el nivel solo desbloquea habilidades. Escrito en ARENA.md §3.

**6. (20-jul) Estudio COMPLETO del wiki** — los 22 personajes documentados de Naruto-Arena,
cada habilidad con daño/costo/recarga/clases → `tools/na_personajes.json` (crudo) y
ARENA.md §2b (patrones destilados: el kit-MODO, setup→payoff, exponer como counter de la
esquiva, perforante, invisible, marca permanente…).

**7. (20-jul) Moveset para las 136 especies** — `make_movesets.py` genera
`src/movesets_gen.js` (122 kits por arquetipo: rol × bioma × rareza, números del estudio;
la rareza sube COMPLEJIDAD, no números) + los 14 a mano de `habilidades.js` que siempre
mandan. `habsDe()` ya resuelve contra ambos: **cobertura 136/136**. Quedan 13 marcados
`TODO kit a mano` (legendarios/míticos sin kit propio: danta*, manatí, lapa, águila harpía,
sapo dorado*, tiburón ballena, quetzal dorado y las 6 leyendas). *danta y sapo_dorado tienen
provisional pero merecen kit único.

**8. (20-jul) Mockups aprobados en artifacts** — pantalla de combate CALCADA de la referencia
del original (fondo de selva del juego, tuyos a la izquierda / rival a la derecha / tiles al
medio, LISTO+timer+energía arriba, descripción abajo) y pantalla de armar equipo (ficha al
tocar, refugio abajo, misiones visibles en los bloqueados). Falta implementarlas en el juego.

---

## DECISIÓN GRANDE (20-jul): REDISEÑO TOTAL DEL COMBATE
Andrés: *"vamos a quitar el juego como estaba previsto antes; rediseño total; las mismas
reglas de Naruto-Arena (The Basics)"*. El combate automático (`fight()`) se RETIRA.
Reglas fieles: vida 100 parejo · energía 25% al azar por tipo · 1er turno 1 energía,
después 1 por vivo · cola en orden · recargas · esquiva universal · clases
instant/sostenido/control · toxina atraviesa invulnerabilidad.

**✅ HECHO (20-jul): `src/arena.js` — el motor nuevo, lógica pura** con
`test/arena.test.mjs` (20 pruebas): construcción, economía de energía (matar baja la
economía del rival), cola en orden (exponer→pegar al invulnerable), recargas, toxina vs
esquiva, defensa destructible (+ ignorarla), robar energía, pasivas (Caparazón, Madrugador,
Púas…), IA `colaAuto` + `combateAuto`, y fuzz de 500 combates (52.8% el que abre, 0 cuelgues).
Los 46 tests viejos siguen verdes (el motor viejo aún existe hasta el swap de UI).

**✅ HECHO (20-jul): la PANTALLA de combate + el SWAP.**
- `src/arenaUI.js` + CSS `ar-*` en styles.css: ventana 940×600 escalada entera (estilo
  emulador), fondo de selva del juego, cabecilla grande, tus filas a la izquierda con
  tiles de habilidad, rivales a la derecha, LISTO + timer (60 s; si vence, pasa el turno,
  como el original), energía por bioma, cola con números de orden (click al tile encolado
  la saca), objetivos en amarillo, AUTO (usa `colaAuto`), RENDIRSE, descripción abajo.
- `game.js startBattle()` YA NO usa `E.fight()`: abre la arena con los **3 de mayor nivel**
  en pie y devuelve el resultado a `onBattleEnd()` intacto (corazones, debilitados,
  recompensas, modo furtivo — todo el flujo de siempre).
- Verificado EN NAVEGADOR con clicks reales: seleccionar → objetivos encendidos → cola
  ①② → LISTO pega → AUTO termina el combate → cartel → onFin → el juego siguió sin
  errores de consola. Bug arreglado de paso: las toxinas tickeaban cada medio-turno
  (ahora tickean al cierre del turno del envenenado = 1 vez por ronda, como el original).
- Cache-busting: index.html a `?v=10` · puerto local a **5650**.

## PRÓXIMOS PASOS (retomar por acá)

1. **Pantalla de SELECCIÓN de equipo** (mockup aprobado): elegir 3 del refugio antes de
   pelear (hoy van los 3 de mayor nivel automático) + ficha con pasiva/habs/rangos.
2. **Retirar `E.fight()` del motor** y adaptar los tests viejos que lo cubren (el flujo
   ya no lo usa; sigue solo por los 46 tests).
3. **Kits a mano para los 13 marcados TODO** en `movesets_gen.js` (legendarios + leyendas).
4. **Enganchar misiones a `meta.js`** — rachas/contadores en localStorage.
5. **Rebalancear con `combateAuto`** (ya simula el combate nuevo).
6. Pulir la arena: animaciones de golpe/daño flotante, sonido de combate, y que los
   sostenidos/control muestren de quién dependen.

### Pendientes viejos que siguen abiertos
- Paneles laterales EQUIPO / MOCHILA / PROGRESO (hoy los chips van en fila arriba).
- El **tema tico 8-bit** (`assets/audio/tema_tico.mp3`) está en el repo pero **sin cablear**.
- Con 2 corazones, el bot que juega bien gana **81%** — quedó generoso. Revisar tras ARENA.

### Notas técnicas para el que retome
- **Caché de módulos ES**: el `?v=N` de `index.html` no invalida los imports internos de
  `main.js`. Para ver cambios de `src/*.js` en local hay que **subir el puerto** en
  `.claude/launch.json` (va por 5649).
- El **screenshot del panel de navegador no funciona** en estas sesiones: se verifica por DOM
  (`javascript_tool`), midiendo contraste y desbordes.
- El token de PixelLab se lee **solo** de `PIXELLAB_TOKEN`; nunca va al repo.
- Scripts de arte/música: `gen_props.py`, `gen_bosses.py`, `make_music_cr.py`, `make_fauna_data.py`
  (este último REGENERA `src/fauna_roster.js`: editar el script, no el roster).
