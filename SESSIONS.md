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

**✅ HECHO (20-jul, tarde): EL TABLERO SE FUE — estructura Naruto-Arena completa.**
Pedido de Andrés: *"el sistema de ir por un tablero lo descartamos; ahora será igual que
Naruto-Arena; ~30 animales fijos y el resto por misiones; música más relajante"*.
- **`src/liga.js`** — el juego nuevo: LIGA por provincias. Rivales al azar del pool de la
  provincia → cada **4 victorias, el cabecilla** (con sus escenas de historia de siempre)
  → 7 provincias → **Monteverde** → **liga libre** donde las 6 leyendas del Tenebroso
  aparecen de jefes (vencerlas las desbloquea). XP por victoria (+2, jefe +4) → nivel
  (tabla 2/5/9/14/20/27/35, cap Nv8) → habilidades. Persistencia en `fauna_liga_v1`.
- **31 animales de BASE** (comunes cubriendo roles y biomas) y **105 con MISIÓN**: las 25
  a mano + `misionAutoDe()` (misiones.js) genera el resto por rango. Progreso real desde
  el log de la arena: rachas con filtros, totales, curado/robado/contraataques, jefes,
  leyendas, "rescatar" = especies GANADAS (las de base no cuentan — la Danta se
  auto-cumplía el día 1, arreglado y verificado).
- **`src/seleccionUI.js`** — la pantalla principal (mockup aprobado): ficha con pasiva +
  4 habilidades (Nv marcado), equipo de 3, refugio con candados y misión visible, perfil
  con récord/racha, modal MISIONES por rango con barras de progreso, avatar 1ª vez.
- **`main.js` reescrito** (el tablero quedó sin usar en game.js/ui.js/engine.js) ·
  index.html nuevo (v=11, "Cómo se juega" del rediseño).
- **`assets/audio/ambiente.mp3`** — música RELAJANTE nueva (make_musica_ambiente.py:
  pads lentos, caja de música pentatónica, pájaros, brisa; 74 s loop) para la selección;
  pelea.ogg sigue en combate.
- **Verificado en navegador**: avatar → selección (136 tiles) → EMPEZAR → escena de
  llegada VN → arena "CAZADORES DE SAN JOSÉ" → victoria → aviso de misión cumplida →
  récord/racha/liberados guardados → 4 wins muestra "¡TE ESPERA DON RUFINO!" con botón
  🚨 ENFRENTAR AL CABECILLA. Cero errores de consola. Puerto local: **5651**.

**✅ HECHO (20-jul, noche): SIN NIVELES, SIN PASIVAS + celular arreglado.**
Pedido de Andrés: *"eliminá los niveles, todos pueden usar todas las habilidades, solo
depende del costo de energía de bioma; eliminá las pasivas, únicamente los ataques"* +
*"en celular se ve cortadísimo, es injugable"*.
- **Fuera niveles y XP**: `habsDe(key)` devuelve siempre las 3 + esquiva. Fuera de
  `arena.js` (mkUnidad sin `nivel`), `liga.js` (sin XP ni `st.animales`), `seleccionUI.js`
  (sin "Nv" ni avisos de subida). La dificultad ahora la da el POOL: en provincias
  avanzadas y contra cabecillas salen especies de rareza mayor (`elegirRivales`).
- **Fuera pasivas**: se borró todo el registro del motor (~60 líneas) y el generador.
- **⚠️ REBALANCE OBLIGADO (medido con `tools/kits.mjs`)**: quitar las pasivas destapó que
  los kits cuyo **básico costaba bioma específico se quedaban sin jugar** (rendían 5% vs
  94% de los que tenían básico gratis). Prueba directa: mismo animal, básico gratis 97%
  vs básico con bioma 0%. **Arreglo: el básico ahora cuesta 1 COMODÍN y pega 20, parejo
  para los 136** (los 14 a mano incluidos). El bioma sigue mandando en la 2ª y 3ª.
  Resultado: roles de **41%–61%** (antes 5%–94%), brecha entre animales en juego real
  **23.6 puntos** (antes 48.6), 0 peleas estancadas (antes 66), combates de 15 turnos
  (antes 23). Puma nerfeado: su definitiva de 100 ahora exige 2 de montaña + toda la
  energía (mataba de un golpe en el turno 1 → 96% de victorias).
- **📱 CELULAR**: la ventana fija de 940×600 se dibujaba **de x=287 a x=654 en una
  pantalla de 375** (casi toda fuera) y a escala 0.39 la letra quedaba en 2px. Ahora:
  (a) la ventana se ancla con `position:absolute; left/top:50%` + `translate(-50%,-50%)`
  para que nunca se salga en escritorio, y (b) **bajo 900px NO se escala**: un @media la
  convierte en columna fluida (marcador → rivales → tus filas → descripción), tiles de
  65×58 y letra de 10px. Verificado en 375×812: ventana de 6→369, **0 desbordes**, sin
  scroll horizontal, y tocar habilidad → objetivos → LISTO funciona.
- 19/19 tests del motor (3 actualizados a la economía nueva).

**✅ HECHO (20-jul, cierre): iconos de habilidad + arreglo de "no se ve".**
- **"eso no se ve"** era `image-rendering: pixelated` sobre sprites de 256px
  mostrados a 46-90px: al REDUCIR, 'pixelated' tira pixeles y rompe el dibujo
  (es el mismo bug que ya se había arreglado para los sprites del juego y se
  coló en las pantallas nuevas). Los sprites reducidos van con `auto`;
  'pixelated' queda SOLO para lo que se amplía (fondos tileados, escenarios).
- **ICONOS DE HABILIDAD**: `make_iconos_hab.py` dibuja 24 iconos pixel art
  16×16 (exportados x4 a 64px) → `assets/iconos/`. El mapeo vive en
  `src/iconos.js` y elige en 2 pasos: primero por EFECTO (veneno, escudo,
  curar, robar, quemar, exponer, aturdir, área, modo, marca…) para que el
  jugador aprenda el símbolo sin leer; si es daño simple, por la FORMA del
  ataque (garra/colmillo/pico/ala/cola/tenaza/lengua) según el nombre y, si no
  alcanza, según qué clase de animal es. Verificado: **las 544 habilidades
  mapean a un archivo existente, 0 rotas**. Se muestran solo en divisores
  exactos de 64 (32px en combate, 16px en la ficha) para que no se aliaseen.
- ⚠️ **PixelLab está en $0** (`get_balance`), por eso los iconos son dibujados
  por código. Si se recarga, se pueden reemplazar uno por uno sin tocar nada
  más: el juego solo pide `assets/iconos/<nombre>.png`.
- **Nombres más variados**: el vocabulario de `make_movesets.py` se amplió →
  de 104 nombres únicos a **174** para 408 ranuras (repetición 3.9x → 2.3x).

**✅ HECHO (20-jul, cierre 2): KITS VARIADOS — se corrigió el "copy-paste".**
Andrés: *"no pongas un ataque generico por 1, que todos sean diferentes... que
existan unos que peguen con 1 energia pero de BIOMA... lo hiciste super generico"*.
Tenía razón y mi arreglo anterior (todos con básico de 1 comodín) era **el error
opuesto**. Conté los costos REALES del original (`tools/na_personajes.json`):
  23 habilidades cuestan **1 chakra ESPECÍFICO** ← la categoría de daño más grande
  38 cuestan 1 Random, pero casi todas son el Bloqueo universal y los MODOS
   5 son GRATIS (marcas/setup, nunca daño fuerte) · los combos de 2 y 3 son mixtos
- **17 FORMAS de kit** calcadas de personajes reales (`make_movesets.py`), 2-3 por
  rol, elegidas de forma determinista por animal: *Lee* (castigo sostenido),
  *Sasuke* (dos golpes + MODO), *Kiba* (área sostenida + marca gratis), *Temari*
  (área cara + refugio de equipo), *Kin* (barato encadenado), *Neji* (presión
  con recarga 1), *Sakura*, *Rin*, *Hinata*, *Shino*, *Obito*, *Dosu*, *Gaara*,
  *Chouji*, *Zaku* y dos de púas. Ahora dos animales del mismo rol suelen tener
  estructura de costo, recarga y efectos DISTINTA.
- Reparto de costos resultante: **124 de 1 energía de bioma**, comodín reservado
  para modos/bloqueos, 17 gratis, 15 de 3 energías. Espeja al original.
- **Los combates dejaron de ser rápidos**: de 15 a **24-28 turnos** por pelea.
- **AGOTAMIENTO** (`arena.js`): pasada la ronda 20 todos pierden vida creciente.
  Sin esto, con costos de bioma **138 peleas se estancaban en 200 turnos** entre
  equipos defensivos. Ahora: **0 estancadas** en 30.000 combates.
- Balance por rol: **42.9%–62.5%** (el rol *primer golpe* subió de 35% a 49%
  tras subirle el daño; *veneno* bajó de 80% poniéndole recarga a Dosu).
- `tools/kits.mjs` corregido: medía tríos del MISMO animal, lo que castigaba de
  más a los mono-bioma. Ahora mide el animal + 2 socios fijos (equipo mixto real).

⚠️ **Hallazgo abierto**: en la simulación el perfil "experto" (elige por poder de
kit) ahora rinde PEOR que el que elige al azar. No es que el juego esté mal: es
que **la diversidad de biomas pesa más que el poder bruto del kit**, y la
heurística del simulador no lo sabe. Hay que enseñarle a valorar la cobertura de
energía antes de volver a usar esos números como medida de "jugar bien".

## PRÓXIMOS PASOS (retomar por acá)

0. **"Animales iguales que en Naruto-Arena" — falta el tramo grande**: hoy los
   kits salen de 6 plantillas por rol, así que 2-3 animales comparten nombres y
   estructura. Para que cada especie tenga SU identidad (como Chidori es de
   Sasuke) hace falta una tabla a mano de 136 × 3 movimientos con su biología
   real. Es trabajo de contenido, no de código: el motor y los iconos ya lo
   soportan. Conviene hacerlo por tandas (empezando por los legendarios y los
   30 de base, que son los que más se ven).

1. **Probar el arco completo jugando**: cabecilla → provincia 2 → … → Monteverde →
   liga libre con leyendas (solo probé la 1ª provincia + el estado del jefe).
2. **Kits a mano para los 13 marcados TODO** en `movesets_gen.js` (legendarios + leyendas).
3. **Retirar del repo el juego viejo** (game.js, ui.js, partes de engine.js y sus tests)
   cuando el nuevo esté rodado — o dejarlo como archivo histórico.
4. **Rebalancear con `combateAuto`**: nivel de rivales por provincia vs curva de XP.
5. Pulir la arena: daño flotante, sonido de golpes, indicador de sostenidos/control.
6. Las **fichas educativas** (fichas.js) hoy quedaron fuera del flujo — engancharlas al
   desbloquear una especie nueva (el guía te la presenta).

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
