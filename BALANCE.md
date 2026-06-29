# Estudio de balance — Fauna · Travesía

> Registro del sistema de estadísticas y combate, con números medidos sobre el
> roster real (130 especies) y miles de peleas simuladas con el motor (`src/engine.js`).
> Reproducir las métricas: ver `make_fauna_data.py` (genera el roster) y correr una
> simulación temporal contra `E.fight()` (como la usada para este estudio).
>
> Última revisión: rebalance de habilidades + veneno acumulado + 1 vida.

---

## 1. Las cinco estadísticas

| Stat | Símbolo | Qué hace en combate | Rango | Prom |
|------|---------|---------------------|-------|------|
| **Ataque** | ⚔ | Daño base que pega cada golpe. | 1–8 | 3.2 |
| **Vida** | ❤ | Aguante en puntos de golpe. | 1–11 | 4.3 |
| **Defensa** | 🛡 | **Resta daño a cada golpe (mínimo 1).** Hace al animal duro contra ataques normales. NO frena al veneno. | 0–6 | 2.4 |
| **Velocidad** | 💨 | Orden de ataque en la ronda (más rápido pega antes). | 1–8 | 5.6 |
| **Habilidad** | 🌀 | Probabilidad de **esquivar** (hab×5%, tope 50%). | 0–8 | 3.6 |

El daño de un golpe es: `daño = max(1, (ataque + furia) − defensa del objetivo)`, y encima
puede ser **esquivado** (anula), **reducido a la mitad** por escudo (primer golpe), o
**aumentado por fatiga** (ver §4). El veneno es aparte: ignora la defensa.

---

## 2. Arquetipos: por qué "a veces aguantan mucho y a veces pegan mucho"

Esa variación es **a propósito** — cada especie nace de un *rol* que define su perfil
(`ROLE_BASE` en `make_fauna_data.py`). Es lo que crea la diversidad de cartas:

| Rol | atk | hp | def | spd | hab | Idea | Ejemplos |
|-----|-----|----|----|-----|-----|------|----------|
| **Tanque** | 2 | 8 | 4 | 2 | 1 | Muro: aguanta muchísimo, pega poco | tortuga, danta, manatí, armadillo |
| **Glass** (cristal) | 5 | 1 | 0 | 5 | 4 | Cañón: pega durísimo, se rompe al primer golpe | coral, ranas, hormiga bala |
| **Veloz** | 2 | 3 | 1 | 8 | 7 | Ágil y escurridizo: esquiva, pero frágil | colibrí, monos, mariposas |
| **Depredador** | 5 | 5 | 6 | 6 | 3 | Cazador completo: pega y aguanta | jaguar, puma, águila harpía |
| **Balanceado** | 3 | 4 | 5 | 5 | 2 | Sin extremos | mapache, nutria, perezoso de dos dedos |

Sobre eso hay un *jitter* determinista (±1) por especie para que ni dos del mismo rol
sean idénticos, y los **legendarios/extintos** llevan un boost (ver §6).

**La defensa no rompe el juego, ata la variación a un triángulo de contras** (ver §5).

---

## 3. Habilidades — el rebalance (menos "primer golpe")

**Problema detectado:** *primer golpe* era el comodín por defecto → **53% del roster lo tenía**.

| Habilidad | Antes | Ahora | Qué hace |
|-----------|------:|------:|----------|
| ⚡ Primer golpe | **69 (53%)** | **34 (26%)** | Ataca con prioridad la 1ª vez; después manda la velocidad. |
| 🔥 Furia | 16 (12%) | 34 (26%) | +1 ⚔ cada vez que ataca (se acumula en la pelea). |
| ✚ Regenera | 5 (4%) | 22 (17%) | Al atacar, cura un poco a un aliado herido. |
| ☣ Veneno | 19 (15%) | 19 (15%) | DoT acumulado que ignora defensa (ver §5). |
| 🛡 Escudo | 15 (12%) | 15 (12%) | El 1er golpe recibido pega la mitad. |
| 🌵 Púas | 6 (5%) | 6 (5%) | Devuelve 1 a quien lo golpee. |

Ahora cada **rol** tira a una habilidad coherente (depredador→furia, tanque→escudo,
glass→veneno) y los balanceados/veloces se reparten entre primer golpe / furia /
regenera. **Veneno, púas y escudo quedan temáticos** (solo en serpientes/ranas/insectos,
espinosos, y acorazados) — no se le pone "veneno" a una nutria.

---

## 4. Cómo no se estanca una pelea

- **Daño mínimo 1:** un nivel bajo no puede reventar a uno alto, pero siempre raspa.
- **Fatiga de combate:** desde la ronda 12, cada golpe que conecta pega +1 extra por
  ronda (atraviesa defensa/escudo). En peleas normales (≤10 rondas) **nunca se activa**;
  solo corta los casos degenerados de muro contra muro.

**Medido (3000 peleas al azar, niveles 1–16, equipos de 1–5):**
`pasos promedio 11 · MÁXIMO 55 · 0 tocaron el tope de 500 · 3 empates`. Sin estancamientos.

---

## 5. El triángulo de contras (lo más importante del balance)

Con la defensa y el veneno acumulado, el combate tiene piedra-papel-tijera:

```
   DEFENSA (tanque)  ──vence a──▶  ATAQUE crudo (golpea y ya)
        ▲                                   │
        │ lo cuenta                         │ vence a
        │                                   ▼
   VENENO (ignora def)  ◀──pierde con──  VELOCIDAD (esquiva + pega antes)
```

- **El tanque vence al atacante normal:** tortuga vs coral-*primer golpe* Nv8 → **tanque gana 66%**.
- **El veneno cuenta al tanque** (lo derrite ignorando defensa): un envenenador de ataque
  flojo le gana a un tanque de 🛡8 que por daño normal solo recibiría 1 por golpe.
- **Pero el veneno NO es autowin:** rana-veneno vs tanque Nv8 → **47%** (parejo); rana-veneno
  vs **jaguar (depredador veloz) → 4%** (el rápido la liquida antes de que el veneno acumule).

### Veneno acumulado (el rediseño)
Antes: 1 ❤ fijo por ronda → se sentía inútil. Ahora: **cada mordida deja una pila** de veneno
en el objetivo (acumula, tope 6); al final de cada ronda el envenenado pierde ❤ **igual a las
pilas**, ignorando defensa. Daño total en una pelea de R rondas ≈ 1+2+3+… → escala con la
duración. Es la herramienta diseñada para **derretir tanques**.

---

## 6. Curva por rareza (poder crece con lo difícil de ver)

| Rareza | n | atk | hp | def | Notas |
|--------|--:|----:|---:|----:|-------|
| Común | 44 | 2.9 | 3.6 | 2.1 | el grueso del roster |
| Raro | 47 | 2.9 | 4.3 | 2.3 | |
| Ultra raro | 29 | 3.6 | 4.3 | 2.4 | |
| **Legendario** | 9 | **4.6** | **7.9** | **4.0** | + boost, **2 habilidades** (únicos), súper raros |
| **Extinto** | 1 | **8.0** | 4.0 | 2.0 | el más raro y fuerte (sapo dorado) |

Los legendarios son los que "pegan y aguantan" a la vez — por eso destacan tanto cuando caen.

---

## 7. Dificultad por nivel (medido, equipos 3v3, 400 peleas c/u)

| Enemigo respecto a vos | Ganás | Pasos prom |
|------------------------|------:|-----------:|
| −8 niveles | 100% | 7 |
| −4 | 100% | 11 |
| −2 | 99% | 15 |
| **igualado (0)** | **53%** | 19 |
| +2 | 19% | 18 |
| +4 | 4% | 15 |
| +8 | 0% | 13 |

Igualado ≈ moneda al aire; con ventaja arrasás; en desventaja te cuesta de verdad. La
dificultad del juego sube con la profundidad (curva acelerada en `engine.js`).

---

## 8. Una sola vida

`MAX_HEARTS = 1`. **Perder un combate = fin de la travesía** (roguelike duro). Los animales
debilitados en combate NO cuestan corazón (se recuperan en un refugio 🏕️); solo perder la
pelea entera termina la corrida. Para suavizar, subir `MAX_HEARTS` en `src/data.js`.

---

## 9. Resumen de salud del balance

- ✅ Un Nv bajo ya no revienta a un Nv alto (defensa + mínimo 1).
- ✅ Habilidades repartidas y temáticas (primer golpe 53% → 26%).
- ✅ Veneno útil y con identidad (anti-tanque), sin ser autowin.
- ✅ Triángulo defensa↔ataque↔veneno↔velocidad.
- ✅ Sin peleas eternas (máx 55 pasos en 3000 simulaciones).
- ✅ 42/42 pruebas del motor en verde.
