# -*- coding: utf-8 -*-
# ============================================================
# make_fondo_bosque.py — FONDO de la página: bosque verde tileable.
# Reemplaza el degradado celeste por un bosque de copas en pixel art, al tono
# del juego. Se dibuja a 64x64 y se amplía x2 (vecino-más-cercano) para que el
# pixel quede chunky como los sprites. Es SIN COSTURA: cada árbol que se sale
# por un borde se vuelve a dibujar del otro lado.
#
# Salida: assets/escenarios/fondo_bosque.png (128x128, se repite en el body)
# Re-correr:  python make_fondo_bosque.py
# ============================================================
from PIL import Image, ImageDraw
import pathlib, random

OUT = pathlib.Path(__file__).parent / "assets" / "escenarios" / "fondo_bosque.png"
N = 64          # lienzo nativo
ESCALA = 2      # → 128x128
rnd = random.Random(7)      # fijo: el fondo sale igual siempre

FONDO   = (38, 74, 46)      # verde profundo del sotobosque
COPA_OS = (44, 86, 52)      # copa en sombra
COPA_MD = (58, 110, 62)     # copa media
COPA_CL = (78, 138, 74)     # copa iluminada
TRONCO  = (58, 42, 30)

img = Image.new("RGB", (N, N), FONDO)
d = ImageDraw.Draw(img)


def envuelto(fn):
    """Dibuja la figura 9 veces (centro + los 8 desplazamientos) para que el
    tile no tenga costura en ningún borde."""
    for dx in (-N, 0, N):
        for dy in (-N, 0, N):
            fn(dx, dy)


def arbol(cx, cy, r, con_tronco=True):
    def dibujar(dx, dy):
        x, y = cx + dx, cy + dy
        if con_tronco:
            d.rectangle([x - 1, y + r - 2, x, y + r + 2], fill=TRONCO)
        # copa: tres discos para que no sea un círculo perfecto
        d.ellipse([x - r, y - r, x + r, y + r], fill=COPA_OS)
        d.ellipse([x - r + 1, y - r + 1, x + r - 2, y + r - 2], fill=COPA_MD)
        d.ellipse([x - r + 2, y - r + 1, x + r - 4, y + r - 4], fill=COPA_CL)
    envuelto(dibujar)


def mata(cx, cy, r):
    """arbusto bajo, sin tronco"""
    def dibujar(dx, dy):
        x, y = cx + dx, cy + dy
        d.ellipse([x - r, y - r // 2, x + r, y + r // 2], fill=COPA_OS)
        d.ellipse([x - r + 1, y - r // 2, x + r - 2, y + r // 2 - 1], fill=COPA_MD)
    envuelto(dibujar)


# copas grandes repartidas sin quedar en cuadrícula
# vista desde ARRIBA: solo copas, sin troncos (asomaban como puntitos rojizos)
for cx, cy, r in [(12, 14, 8), (44, 10, 7), (28, 34, 9), (56, 40, 7), (6, 46, 7), (38, 56, 6)]:
    arbol(cx + rnd.randint(-2, 2), cy + rnd.randint(-2, 2), r, con_tronco=False)

# matorral de relleno
for _ in range(10):
    mata(rnd.randrange(N), rnd.randrange(N), rnd.randint(3, 5))

# motitas de luz para que no quede plano
for _ in range(70):
    x, y = rnd.randrange(N), rnd.randrange(N)
    if img.getpixel((x, y)) != FONDO:
        img.putpixel((x, y), COPA_CL)

grande = img.resize((N * ESCALA, N * ESCALA), Image.NEAREST)
grande.save(OUT)
print(f"OK {OUT.name} · {grande.size[0]}x{grande.size[1]} (tileable)")
