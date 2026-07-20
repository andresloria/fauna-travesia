# ARENA — combate por turnos estilo Naruto-Arena, adaptado a Fauna Travesía

Documento de diseño. Reemplaza el combate automático actual (`fight()` en `engine.js`).
Fuente estudiada: `narutoarena.fandom.com` (The Basics + fichas de personajes).
**Todo lo numérico de abajo está copiado del juego original**, no inventado.

---

## 1. Reglas base (del original)

- Equipos de **3**. En Fauna: tenés un refugio de 5 y **elegís 3** antes de cada combate.
- Por turnos. **El primer turno se sortea**; después el orden lo definís vos con la cola.
- Cada animal usa **1 habilidad por turno** (si te alcanza la energía y no está en recarga).
- **Energía**: al empezar tu turno recibís **1 energía por cada animal VIVO**. El primer turno,
  solo 1. Por eso *matar a un enemigo le baja la economía*: es la estrategia central (enfocar
  a uno hasta tumbarlo en vez de repartir daño).
- **Cola de habilidades**: elegís habilidad → se iluminan los objetivos válidos → se encola.
  **El orden importa** (izq→der): si querés romper un escudo antes de pegar, esa va primero.
  Doble clic para sacarla. Botón **LISTO** ejecuta el turno.
- **Recarga (cooldown)**: turnos que la habilidad queda bloqueada tras usarse.
- **Esquiva universal**: TODOS los personajes del original tienen una 4ª habilidad que los hace
  **invulnerables 1 turno, recarga 4**. En Fauna es la **Esquiva** de cada animal.
- **Contraataques**: algunas habilidades se disparan solas cuando te atacan, durante el turno rival.

## 2. Lenguaje numérico extraído (vida base 100)

| Concepto | Valores reales del original |
|---|---|
| Golpe básico barato | **15–20** de daño |
| Golpe fuerte | **25–30** |
| Golpe pesado / caro | **40** |
| Definitiva (gasta toda la energía) | **100** |
| Daño por turno (veneno/sangrado) | **10–25** por turno, **2–4** turnos |
| Curación | **25** |
| Reducción de daño | **5–10** puntos, 3–4 turnos |
| Defensa destructible (escudo con puntos) | **20–40** |
| Daño en área (a todos) | **15** |
| Invulnerabilidad | **1–2** turnos |
| Robo de energía | **1** al azar |
| Recargas | **0** (básicos) · **1** (fuertes repetibles) · **2–3** (control/defensa) · **4** (definitivas y esquiva) |

Ejemplos verificados:
- *Rock Lee · Front Lotus*: 30 daño, recarga 0. *Final Lotus*: 100 gastando toda la energía.
- *Sakura · Mystical Palm*: cura 25, recarga 0. *KO Punch*: 20 + aturde 1 turno.
- *Gaara · Armor of Sand*: +40 de defensa destructible, recarga 4.
- *Shino · Chakra Leech*: 20 de daño de toxina **y roba 1 energía al azar**, recarga 1.
- *Neji · 64 Palmas*: 40 daño **y el enemigo pierde 1 energía al azar**, recarga 1.
- *Neji · Kaiten*: invulnerable 1 turno **y** 15 de daño a TODOS, recarga 1.

## 2b. ESTUDIO COMPLETO — los 22 personajes del wiki (2026-07-20)

**Datos crudos en `tools/na_personajes.json`** (cada habilidad con daño, costo, recarga y
clases, transcrita del wiki). De ahí salen las reglas de diseño de kits:

**REGLA DE ORO: vida 100 para todos, sin excepción.** Un Genin y un Kage tienen la misma
vida; la diferencia es el kit. En Fauna: ni nivel ni rareza tocan stats — el nivel solo
desbloquea habilidades.

**El patrón de kit dominante (Naruto, Sasuke, Hinata, Sakura, Kiba, Dosu, Obito, Lee):**
1. **Golpe básico** — 15-30, costo 1 específico, recarga 0. *Mejora durante el "modo".*
2. **Golpe fuerte / utilidad** — 25-45 con rider (aturdir, robar energía, perforar),
   costo 2, recarga 0-1. A veces *requiere* el modo (Rasengan).
3. **MODO** — buff de 4 turnos, costo 1 comodín, recarga 3-4: +10-15 de reducción de daño
   y **mejora las otras dos habilidades** (Sharingan, Shadow Clones, Byakugan, Inner Sakura,
   Melody Arm, Fifth Gate). Esto es lo que hace que un kit se sienta "de ese personaje".
4. **Esquiva** — invulnerable 1 turno, costo 1 comodín, recarga 4. **Los 22 la tienen.**

**Variantes de kit** (para que no todos sean "modo"):
- **Setup → payoff**: Zaku (Airwaves 25 habilita Extreme 45 a TODOS al turno siguiente);
  Gaara (Coffin atrapa → se REEMPLAZA por Burial); Kin (3 campanas que comban entre sí).
- **Control**: Shikamaru (marca gratis 5 turnos → aturdir en área); Ino (aturdir + exponer).
- **Sanador**: Sakura/Rin (cura 25 recarga 0 · cura 10/turno×3 · limpiar toxinas).
- **Tanque**: Gaara (defensa 40 permanente) · Shino (20 al equipo) · Chouji (invulnerable
  mientras pega 10/turno).
- **Muro de contraataque**: Zaku (Wall of Air: contraataca la 1ª habilidad, invisible).

**Mecánicas que existen en el original** (catálogo ampliado para el motor):
- **Perforante** — ignora reducción de daño (Chidori, White Fang); algunas ignoran
  invulnerabilidad (toxinas, Pit Trap, Mind Body Disturbance).
- **Exponer** — "no puede reducir daño ni volverse invulnerable" 1-3 turnos. A menudo
  GRATIS (Dynamic Marking de Kiba, recarga 0): es el counter de la Esquiva.
- **Invisible** — trampas que el rival no ve (Pit Trap, Hair Strand, Implanted Sharingan).
- **Robar vs quemar energía** — Shino roba (la gana), Neji quema (se pierde).
- **Subir costos** (Prison Sand: +1 al rival 1 turno) y **subir recargas** (Hair Strand:
  +1 a todas si ataca).
- **Acumulable permanente** — Sound Manipulation de Dosu: +5 recibido / -5 infligido el
  RESTO de la pelea, apilable. (Es el "counter de tanques".)
- **Inmatable** — Hanabi: 2 turnos sin poder morir, gratis.
- **Autodaño con pago** — Lee pierde 50 de vida por 2 turnos invulnerable + Final Lotus 100;
  Chouji come píldoras (+20 de daño permanente a cambio de 20 de toxina).
- **Daño a un enemigo AL AZAR** (Mind Body Disturbance): castigo no dirigible.

**Economía verificada**: específico para lo firma, comodín para modos/utilidad; habilidades
GRATIS existen y son setup/marca (Meditate, Dynamic Marking, Sand Clone, Tenacity).
AoE barato = 15 · AoE caro (3 energías) = 35-45. Recarga 5 existe (Dust Wind, equipo entero
invulnerable).

## 3. Adaptación a Fauna

### Energía = los 4 biomas (ya existen en el juego)
| Tipo | Color | Sentido |
|---|---|---|
| 🌳 Bosque | verde | fuerza y garra |
| 🌾 Sabana | dorado | velocidad y aguante |
| 🌊 Agua | azul | curación y control |
| ⛰️ Montaña | morado | lo raro y poderoso |
| ⚪ Comodín | gris | paga cualquier tipo |

**Cambio propuesto sobre el original**: en Naruto-Arena cada tipo salía 25% al azar. Acá cada
animal vivo da 1 energía con **50% de que sea la de SU bioma** y 50% al azar. Así **armar el
equipo importa**: equipo puro de bosque = energía fiable pero rígida; mixto = versátil pero
impredecible.

### Estructura de cada animal
- **1 pasiva** — siempre activa, lo distingue (no cuesta energía, no se elige).
- **3 habilidades** — se desbloquean por nivel: **Nv1 · Nv4 · Nv8**.
- **1 esquiva** — invulnerable 1 turno, recarga 4. Todos la tienen desde el principio.
- **Vida = 100 PARA TODOS, SIEMPRE** (regla de Andrés, 20-jul). Como el original: ni el nivel
  ni la rareza tocan la vida ni los stats. Subir de nivel SOLO desbloquea habilidades
  (Nv1/Nv4/Nv8). La diferencia entre un común y un legendario está en su kit, no en números
  inflados — igual que un Genin y un Kage en Naruto-Arena tenían ambos 100.

### Clases (traducidas)
| Original | Fauna |
|---|---|
| Physical | **Físico** — garra, mordida, embestida |
| Chakra | **Natural** — energía del animal |
| Affliction | **Toxina** — persiste y **atraviesa invulnerabilidad** |
| Mental | **Instinto** — miedo, señuelo, aviso |
| Melee / Ranged | **Cuerpo a cuerpo / A distancia** |
| Instant | **Instantáneo** — pasa y ya |
| Action | **Sostenido** — dura varios turnos solo |
| Control | **Control** — dura mientras el usuario siga en pie |
| Unique | **Único** — solo ese animal lo tiene |

## 4. Catálogo de efectos disponibles

Para construir habilidades (ver `src/habilidades.js`):

- `dano` — daño directo
- `danoTurnos` — daño por turno N turnos (toxina: ignora invulnerabilidad)
- `curar` — cura vida a un aliado
- `defensa` — defensa destructible (puntos que absorben daño)
- `reducir` — reduce el daño que recibe, N turnos
- `invulnerable` — no recibe nada, N turnos
- `aturdir` — bloquea habilidades del enemigo, N turnos (se puede limitar por clase)
- `robarEnergia` — le quitás 1 energía al rival **y la ganás vos**
- `quemarEnergia` — el rival pierde 1 energía (no la ganás)
- `area` — afecta a todos los enemigos
- `contraataque` — se dispara si te atacan durante el turno rival
- `amplificar` — el objetivo recibe +X daño de cierta habilidad
- `limpiar` — quita efectos dañinos de un aliado
- `reemplazar` — la habilidad se transforma en otra durante N turnos

## 5. Cómo se consiguen los animales
Misiones (reemplazan el farmeo), como los personajes bloqueados del original:
*"rescatá 3 animales de agua"*, *"ganá un combate sin perder a nadie"*, *"liberá 5 plenos"* →
desbloquean animales nuevos para el refugio.

## 6. Estado de implementación
- [x] Reglas estudiadas y documentadas
- [x] Catálogo de efectos definido (`src/habilidades.js`)
- [x] Primer lote de animales con habilidades a mano
- [ ] Motor de combate por turnos nuevo (reemplaza `fight()`)
- [ ] Pantalla de combate (cola, objetivos, LISTO, AUTO)
- [ ] Los 130 animales
- [ ] Sistema de misiones

---

## 7. MISIONES para desbloquear animales (`src/misiones.js`)

Copiado del original: misiones por **RANGO D → C → B → A → S**, y la mayoría piden
**RACHAS**. La racha es lo que obliga a armar estrategia: no alcanza con jugar mucho,
hay que ganar **sin fallar**.

Misiones reales del original que sirvieron de molde:
- *"Win Four Battles In A Row With Neji"*
- *"Win 5 Battles In A Row With Shikamaru Or Temari In Your Team"*
- *"Win 5 Battles In A Row With At Least One Member Of The Sound Genin"*
- *"Win 15 Battles With Naruto, Sasuke, Or Sakura In Your Team"*
- *"Defeat the Sand Siblings with Hinata / Shino / Kiba on your team"*

**El rango sale de la rareza** (qué tan difícil es ver al animal):
| Rango | Rareza | Sentido |
|---|---|---|
| D | común | Fauna que se ve seguido |
| C | raro | Cuesta un poco más |
| B | ultra raro | Poca gente los ve |
| A | legendario | Encuentro de toda una vida |
| S | extinto / mítico | Ya no deberían existir |

**Tipos de objetivo implementados**: `racha`, `total`, `conEquipo`, `bioma` (equipo entero
de un bioma), `sinCaidos`, `liberar`, `rescatar`, `vencer`, `sinEsquiva`, `soloClase`,
`conClase`, `soloUnoVivo`, `primeroElFuerte`, `curado`, `robado`, `contraatacado`,
`ganarJuego`, `vencerFolk`.

Ejemplos ya escritos:
- **Jaguar (A)**: ganá 6 seguidos con equipo de puro bosque.
- **Quetzal (A)**: liberá 10 animales PLENOS.
- **Puma (A)**: ganá 5 seguidos quedándote con UN solo animal en pie.
- **Sapo dorado (S)**: 12 especies de montaña + ganar el juego sin perder a nadie.
- **Las 6 leyendas (S)**: vencerlas en el mapa Tenebroso.

⚠️ El rango de cada misión **debe coincidir** con la rareza del animal. Hay un chequeo:
`rangoDe(SP[key].rarity) === MISIONES[key].rango`. Ya corrigió 5 desalineadas.

## 8. Estado (actualizado)
- [x] Reglas del combate estudiadas y documentadas
- [x] Catálogo de efectos (`src/habilidades.js`)
- [x] 14 animales con pasiva + 3 habilidades
- [x] Sistema de misiones por rango (`src/misiones.js`) — 25 misiones
- [ ] Motor de combate por turnos nuevo (reemplaza `fight()`)
- [ ] Pantalla de combate (cola de habilidades, objetivos, LISTO, AUTO)
- [ ] Los 116 animales restantes
- [ ] Enganchar el progreso de misiones a `meta.js`
