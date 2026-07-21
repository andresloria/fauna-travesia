# -*- coding: utf-8 -*-
# ============================================================
# make_iconos_bioma.py — los 4 BIOMAS (= los 4 tipos de energía) + el comodín,
# en pixel art, para la columna de energía de la arena.
#
# Antes la energía se mostraba con emoji (🌳🌾🌊⛰). El emoji lo dibuja el
# sistema operativo: cambia de forma entre Windows, Android e iPhone, y no
# combina con el resto del arte. Estos son dibujos nuestros, iguales en todos
# lados.
#
# 16x16 reales → 128px (x8), mismo trato que make_iconos_v2.py.
# Re-correr:  python make_iconos_bioma.py  → assets/iconos/bioma_<n>.png
# ============================================================
from PIL import Image, ImageFilter
import pathlib

OUT = pathlib.Path(__file__).parent / "assets" / "iconos"
OUT.mkdir(parents=True, exist_ok=True)
ESCALA, MARGEN = 8, 2

P = {
    '.': None,
    'k': (18, 14, 20),
    # bosque
    'g': (108, 216, 132), 'G': (48, 148, 82), 'm': (122, 84, 52),
    # sabana
    'y': (255, 214, 102), 'Y': (206, 158, 46), 'o': (226, 168, 74),
    # agua
    'b': (104, 186, 255), 'B': (44, 118, 186), 'w': (206, 236, 255),
    # montaña
    'p': (188, 168, 214), 'P': (108, 92, 138), 'n': (250, 250, 255),
    # comodín
    'c': (226, 232, 240), 'C': (150, 162, 178),
}

BIOMAS = {
 "bioma_bosque": [                 # copa de árbol + tronco
  "................",
  "......kkkk......",
  ".....kggggk.....",
  "....kgggggGk....",
  "...kgggggggGk...",
  "..kggggggggGGk..",
  "..kgggggggggGk..",
  "...kggggggggk...",
  "..kggggggggGGk..",
  "...kgggggggGk...",
  "....kgggggGk....",
  ".....kkmmkk.....",
  "......kmmk......",
  "......kmmk......",
  ".....kkmmkk.....",
  "................",
 ],
 "bioma_sabana": [                 # matojos de pasto seco
  "................",
  "................",
  "...k......k.....",
  "..kyk....kyk....",
  "..kyk.k..kyk....",
  "..kykkyk.kyk.k..",
  "..kykkykkkykkk..",
  ".kkykkykkkykkyk.",
  ".kyykkyykkyykyk.",
  ".kyokkyokkyokyk.",
  ".kyokkyokkyokyk.",
  ".kYokkYokkYokYk.",
  "..kYkkYkkkYkkYk.",
  "...kkkkkkkkkkk..",
  "................",
  "................",
 ],
 "bioma_agua": [                   # gota con brillo
  "................",
  ".......kk.......",
  "......kwwk......",
  "......kwbk......",
  ".....kwbbbk.....",
  ".....kwbbbk.....",
  "....kwbbbbbk....",
  "....kwbbbbbk....",
  "...kwbbbbbbbk...",
  "...kbbbbbbbBk...",
  "...kbbbbbbbBk...",
  "...kBbbbbbBBk...",
  "....kBbbbBBk....",
  ".....kBBBBk.....",
  "......kkkk......",
  "................",
 ],
 "bioma_montana": [                # dos picos con nieve
  "................",
  "................",
  "........kk......",
  ".......knnk.....",
  "...kk.knnnnk....",
  "..knnkknppnk....",
  "..knnnkppppnk...",
  ".knppnkppppPk...",
  ".knpppkpppPPPk..",
  "kppppppppPPPPk..",
  "kpppppppPPPPPPk.",
  "kppppppPPPPPPPk.",
  "kPPPPPPPPPPPPPk.",
  "kkkkkkkkkkkkkkk.",
  "................",
  "................",
 ],
 "bioma_comodin": [                # rombo neutro: paga cualquier bioma
  "................",
  ".......kk.......",
  "......kwwk......",
  ".....kwccck.....",
  "....kwccccck....",
  "...kwccccccck...",
  "..kwcccccccCCk..",
  ".kwcccccccCCCCk.",
  ".kccccccccCCCCk.",
  "..kcccccccCCCk..",
  "...kcccccCCCk...",
  "....kcccCCCk....",
  ".....kcCCCk.....",
  "......kCCk......",
  ".......kk.......",
  "................",
 ],
}

VECINOS = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)]
CONTORNO = (10, 8, 12, 230)


def render(nombre, filas):
    N = 16 + MARGEN * 2
    img = Image.new("RGBA", (N, N), (0, 0, 0, 0))
    px = img.load()
    ocupados = set()
    for y, fila in enumerate(filas[:16]):
        for x, ch in enumerate(fila[:16]):
            col = P.get(ch)
            if col:
                px[x + MARGEN, y + MARGEN] = (*col, 255)
                ocupados.add((x + MARGEN, y + MARGEN))
    borde = {(x + dx, y + dy) for (x, y) in ocupados for dx, dy in VECINOS
             if 0 <= x + dx < N and 0 <= y + dy < N and (x + dx, y + dy) not in ocupados}
    for p in borde:
        px[p] = CONTORNO

    grande = img.resize((N * ESCALA, N * ESCALA), Image.NEAREST)
    sil = Image.new("RGBA", grande.size, (0, 0, 0, 0))
    sil.paste((0, 0, 0, 150), mask=grande.split()[3])
    som = Image.new("RGBA", grande.size, (0, 0, 0, 0))
    som.paste(sil, (0, int(ESCALA * .9)))
    som = som.filter(ImageFilter.GaussianBlur(ESCALA * .7))
    Image.alpha_composite(som, grande).save(OUT / f"{nombre}.png")


if __name__ == "__main__":
    for nombre, filas in BIOMAS.items():
        malas = [i for i, f in enumerate(filas) if len(f) != 16]
        if malas or len(filas) != 16:
            raise SystemExit(f'{nombre}: filas mal medidas {malas} (total {len(filas)})')
        render(nombre, filas)
    print(f"OK · {len(BIOMAS)} iconos de bioma en {OUT}")
