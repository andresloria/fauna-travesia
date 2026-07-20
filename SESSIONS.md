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

---

## PRÓXIMOS PASOS (retomar por acá)

1. **Motor de combate por turnos** — reemplaza `fight()` de `engine.js`. Reglas completas en
   `ARENA.md` §1-§4. Ojo: `fight()` lo usan `game.js` y `test/engine.test.mjs` (46 tests).
2. **Pantalla de combate** — cola de habilidades (el orden importa), objetivos que se iluminan,
   botón **LISTO** y botón **AUTO** (juega el turno por vos).
3. **Los 116 animales restantes** — hay 14 hechos a mano en `src/habilidades.js` cubriendo todos
   los roles (daño, tanque, veneno, curación, robo de energía, contraataque, área). Plan: escalar
   por arquetipo (bioma + rareza + stats) y dejar a mano los icónicos.
4. **Enganchar misiones a `meta.js`** — el progreso (rachas, contadores) vive en localStorage.
5. **Rebalancear después del combate nuevo** — el simulador está en el scratchpad de la sesión;
   conviene commitearlo como herramienta (`sim.mjs` + `habs.mjs`) si se va a reusar.

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
