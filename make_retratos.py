# -*- coding: utf-8 -*-
# ============================================================
# make_retratos.py — RETRATOS de los guias para la pantalla "¿Quién sos?".
#
# El problema: guia_hombre.png / guia_mujer.png son sprites de CUERPO ENTERO
# (256x256, pixel art nativo). Ahi la cabeza mide ~45px: los ojos son 2 pixeles
# y la barba 4. Mostrando el cuerpo entero no se ve la cara, y achicar empeora
# todo (con 'auto' se emborrona, con 'pixelated' se pierden pixeles).
#
# La solucion: recortar CABEZA + HOMBROS y ampliar x2 con vecino-mas-cercano
# (ampliar pixel art en enteros es SIN perdida). Asi la cabeza pasa de 45px a
# ~90px y se ven el pelo, los anteojos, la barba y los ojos.
#
# Salida: assets/personajes/retrato_guia_<hombre|mujer>.png  (x2, ~254x234)
#   · en escritorio se muestra 1:1
#   · en celular a la mitad exacta (= el recorte nativo, tambien nitido)
# Re-correr:  python make_retratos.py
# ============================================================
from PIL import Image
import pathlib

DIR = pathlib.Path(__file__).parent / "assets" / "personajes"
ESCALA = 2          # ampliacion entera: sin perdida en pixel art
ASPECTO = 1.10      # ancho / alto del recorte
LIENZO_W, LIENZO_H = 124, 114   # tamano nativo comun de los dos retratos


def centro_de_la_cabeza(im):
    """x del centro de la cabeza = centro del contenido en su franja superior."""
    bb = im.getbbox()
    x0, y0, x1, y1 = bb
    alto = y1 - y0
    franja = im.crop((x0, y0, x1, y0 + max(8, int(alto * 0.18))))
    fb = franja.getbbox()          # bbox dentro de la franja (solo la cabeza)
    return x0 + (fb[0] + fb[2]) // 2, y0


def retrato(nombre):
    im = Image.open(DIR / f"guia_{nombre}.png").convert("RGBA")
    cx, y_top = centro_de_la_cabeza(im)
    bb = im.getbbox()
    alto_fig = bb[3] - bb[1]

    # cabeza + hombros: desde un pelin arriba de la coronilla, ~46% de la figura
    alto = int(alto_fig * 0.46)
    ancho = int(alto * ASPECTO)
    top = max(0, y_top - 4)
    left = max(0, min(im.width - ancho, cx - ancho // 2))
    corte = im.crop((left, top, left + ancho, top + alto))

    # lienzo UNIFORME para que los dos retratos midan igual (si no, el marco
    # tendria que cambiar de tamano segun el guia)
    lienzo = Image.new("RGBA", (LIENZO_W, LIENZO_H), (0, 0, 0, 0))
    lienzo.paste(corte, ((LIENZO_W - corte.width) // 2,
                         (LIENZO_H - corte.height) // 2), corte)
    corte = lienzo

    grande = corte.resize((corte.width * ESCALA, corte.height * ESCALA), Image.NEAREST)
    destino = DIR / f"retrato_guia_{nombre}.png"
    grande.save(destino)
    return destino, corte.size, grande.size


if __name__ == "__main__":
    for n in ("hombre", "mujer"):
        d, chico, grande = retrato(n)
        print(f"OK {d.name} · recorte {chico[0]}x{chico[1]} -> x{ESCALA} = {grande[0]}x{grande[1]}")
