# -*- coding: utf-8 -*-
# ============================================================
# make_iconos_v2.py — RE-RENDER moderno de los iconos de habilidad.
#
# No vuelve a dibujar nada: reusa los mismos dibujos de 16x16 de
# make_iconos_hab.py (ahí vive el arte) y los saca de nuevo con un trato
# pensado para la interfaz NUEVA, que es oscura:
#
#   1. PALETA para fondo oscuro. La original es estilo GBA (cremas y olivas
#      apagados) y sobre los paneles oscuros quedaba embarrada. Se sube el
#      brillo y la saturación.
#   2. CONTORNO de 1 píxel oscuro alrededor de la silueta, para que el dibujo
#      no se funda con el panel.
#   3. SOMBRA suave abajo, para que despegue del fondo.
#   4. 128px (x8) en vez de 64: en pantallas retina el de 64 se veía blando.
#
# Sigue siendo pixel art a propósito: los animales del juego son pixel art y
# unos iconos vectoriales al lado se pelearían con ellos.
#
# Re-correr:  python make_iconos_v2.py   → assets/iconos/<nombre>.png
# (pisa los de make_iconos_hab.py; ese sigue siendo el dueño del DIBUJO)
# ============================================================
from PIL import Image, ImageFilter
import pathlib
import make_iconos_hab as base

OUT = pathlib.Path(__file__).parent / "assets" / "iconos"
OUT.mkdir(parents=True, exist_ok=True)
ESCALA = 8            # 16px reales → 128px de archivo
MARGEN = 2            # píxeles reales de aire para el contorno y la sombra

# --- paleta para fondo OSCURO -------------------------------------------
# misma letra que en make_iconos_hab.py; solo cambian los valores.
P = {
    '.': None,
    'k': (18, 14, 20),         # contorno (más negro que el original)
    'w': (255, 253, 245),      # brillo
    'c': (226, 232, 240),      # antes crema tostado → gris claro frío
    'g': (108, 216, 132),      # verdes más vivos
    'G': (48, 148, 82),
    'r': (255, 96, 84),        # rojos más encendidos
    'R': (176, 42, 36),
    'y': (255, 214, 102),      # dorado
    'Y': (206, 158, 46),
    'b': (104, 186, 255),      # azules
    'B': (44, 118, 186),
    'p': (188, 146, 226),      # morados
    'P': (124, 84, 168),
    'o': (255, 158, 82),       # naranja
    's': (168, 180, 196),      # gris (era pardo)
    'v': (150, 240, 110),      # verde veneno
    'V': (88, 178, 66),
}

CONTORNO = (10, 8, 12, 230)
VECINOS = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)]

# 'k' era el CONTORNO cuando el juego tenía paneles claros, pero varios iconos
# están dibujados casi enteros con esa letra: son dibujos de LÍNEA (el área, el
# exponer, la marca, la esquiva). Sobre los paneles oscuros nuevos desaparecían.
# Cuando 'k' es la mayoría del dibujo, se entiende que es línea y se pinta claro.
LINEA = (232, 238, 246)


def render(nombre, filas):
    N = 16 + MARGEN * 2
    img = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    px = img.load()

    llenos = [ch for f in filas[:16] for ch in f[:16] if ch != '.']
    de_linea = llenos.count('k') > len(llenos) * .6

    # 1. el dibujo, con la paleta nueva
    ocupados = set()
    for y, fila in enumerate(filas[:16]):
        for x, ch in enumerate(fila[:16]):
            col = LINEA if (de_linea and ch == 'k') else P.get(ch)
            if col:
                px[x + MARGEN, y + MARGEN] = (*col, 255)
                ocupados.add((x + MARGEN, y + MARGEN))

    # 2. contorno: pinta el borde de afuera de la silueta
    borde = set()
    for (x, y) in ocupados:
        for dx, dy in VECINOS:
            p = (x + dx, y + dy)
            if 0 <= p[0] < N and 0 <= p[1] < N and p not in ocupados:
                borde.add(p)
    for (x, y) in borde:
        px[x, y] = CONTORNO

    grande = img.resize((N * ESCALA, N * ESCALA), Image.NEAREST)

    # 3. sombra suave: la silueta en negro, desenfocada y corrida hacia abajo
    silueta = Image.new("RGBA", grande.size, (0, 0, 0, 0))
    silueta.paste((0, 0, 0, 150), mask=grande.split()[3])
    sombra = Image.new("RGBA", grande.size, (0, 0, 0, 0))
    sombra.paste(silueta, (0, int(ESCALA * .9)))
    sombra = sombra.filter(ImageFilter.GaussianBlur(ESCALA * .7))

    final = Image.alpha_composite(sombra, grande)
    final.save(OUT / f"{nombre}.png")
    return nombre


if __name__ == "__main__":
    faltan = [c for filas in base.ICONOS.values() for f in filas for c in f if c not in P]
    if faltan:
        raise SystemExit(f'la paleta nueva no cubre: {sorted(set(faltan))}')
    n = [render(nombre, filas) for nombre, filas in base.ICONOS.items()]
    print(f"OK · {len(n)} iconos re-renderizados a {(16 + MARGEN * 2) * ESCALA}px en {OUT}")
