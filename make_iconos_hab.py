# -*- coding: utf-8 -*-
# ============================================================
# make_iconos_hab.py — ICONOS de habilidad en pixel art, dibujados por codigo.
# Cada habilidad del combate muestra un dibujo de LO QUE HACE (garra, colmillo,
# veneno, escudo, curacion, robo de energia...). 16x16 reales, exportados x4
# (64x64) con vecino-mas-cercano para que queden nitidos.
#
# ¿Por que por codigo y no PixelLab? La cuenta de PixelLab esta en $0. Estos
# iconos son gratis, instantaneos y consistentes; si se recarga PixelLab se
# pueden reemplazar uno a uno sin tocar el resto del juego (el mapeo vive en
# src/iconos.js).
#
# Re-correr:  python make_iconos_hab.py     → assets/iconos/<nombre>.png
# ============================================================
from PIL import Image
import pathlib

OUT = pathlib.Path(__file__).parent / "assets" / "iconos"
OUT.mkdir(parents=True, exist_ok=True)
ESCALA = 4          # 16px reales → 64px de archivo

# paleta base compartida (estilo GBA del juego)
P = {
    '.': None,                 # transparente
    'k': (28, 20, 16),         # contorno
    'w': (250, 244, 226),      # brillo
    'c': (236, 226, 198),      # crema
    'g': (90, 168, 107),       # verde
    'G': (47, 110, 62),        # verde oscuro
    'r': (196, 56, 42),        # rojo
    'R': (122, 28, 22),        # rojo oscuro
    'y': (232, 197, 88),       # dorado
    'Y': (166, 130, 40),       # dorado oscuro
    'b': (90, 150, 200),       # azul
    'B': (47, 95, 140),        # azul oscuro
    'p': (150, 110, 180),      # morado
    'P': (95, 65, 125),        # morado oscuro
    'o': (214, 130, 70),       # naranja
    's': (140, 130, 115),      # gris
    'v': (120, 200, 90),       # verde veneno
    'V': (70, 140, 55),        # verde veneno oscuro
}

# ============================================================
# Cada icono: 16 filas de 16 caracteres.
# ============================================================
ICONOS = {

# ---------- ATAQUES FISICOS (varian por tipo de animal) ----------
"garra": [                      # zarpazo: tres tajos
"................",
"..k....k....k...",
".kwk..kwk..kwk..",
".kwk..kwk..kwk..",
".kck..kck..kck..",
"..kck..kck..kck.",
"..kck..kck..kck.",
"...kck..kck..kck",
"...kck..kck..kc.",
"....kk...kk...k.",
"....k....k......",
"................",
"................",
"................",
"................",
"................",
],

"colmillo": [
"................",
".kkkkk....kkkkk.",
"kwwwwwk..kwwwwwk",
"kwwwwwk..kwwwwwk",
"kwwwwwk..kwwwwwk",
".kwwwk....kwwwk.",
".kwwwk....kwwwk.",
"..kwk......kwk..",
"..kwk......kwk..",
"...k........k...",
"................",
"......kkk.......",
".....kwwwk......",
".....kwrrk......",
"......krk.......",
"................",
],

"pico": [                       # picotazo: pico abierto
"................",
"....kk..........",
"...kyyk.........",
"..kyyyyk........",
".kyyyyyyk.......",
"kyyyyyyyyk......",
".kkkkkkkkkk.....",
"..........kk....",
".kkkkkkkkkk.....",
"kYYYYYYYYk......",
".kYYYYYYk.......",
"..kYYYYk........",
"...kYYk.........",
"....kk..........",
"................",
"................",
],

"ala": [
"................",
"..........kkkk..",
".......kkkwwwwk.",
"....kkkwwwwwwwk.",
"..kkwwwwwwwwwck.",
".kwwwwwwwwwccck.",
"kwwwwwwwwccccck.",
"kwwwwwwcccccck..",
"kwwwwcccccck....",
".kwwcccccck.....",
".kcccccck.......",
"..kccck.........",
"..kkk...........",
"................",
"................",
"................",
],

"cola": [
"................",
"............k...",
"...........kwk..",
".........kkwwk..",
"........kwwwwk..",
"......kkwwwwck..",
"....kkwwwwcck...",
"..kkwwwwcck.....",
".kwwwwcck.......",
".kwwcck.........",
".kccck..........",
".kkkk...........",
"................",
"................",
"................",
"................",
],

"tenaza": [                     # tenaza / pinza
"................",
"..kkk......kkk..",
".krrrk....krrrk.",
".krrrk....krrrk.",
"..krrk....krrk..",
"...krrk..krrk...",
"....krrkkrrk....",
".....krrrrk.....",
"......krrk......",
"......krrk......",
".....krrrrk.....",
"....krrRRrrk....",
"....krRRRRrk....",
".....kRRRRk.....",
"......kkkk......",
"................",
],

"lengua": [
"................",
"..kkk...........",
".krrrk..........",
"..krrk..........",
"...krrk.........",
"....krrk........",
".....krrk.......",
"......krrk......",
".......krrkkk...",
"........krrrrk..",
".........krrrk..",
"..........kkk...",
"................",
"................",
"................",
"................",
],

"impacto": [                    # embestida / golpe
"................",
".......k........",
"...k...k...k....",
"....k..k..k.....",
".....kkkkk......",
"...kkkyyykkk....",
"..kyyywwwyyyk...",
"..kyywwwwwyyk...",
"..kyyywwwyyyk...",
"...kkkyyykkk....",
".....kkkkk......",
"....k..k..k.....",
"...k...k...k....",
".......k........",
"................",
"................",
],

# ---------- TOXINA ----------
"veneno": [                     # gota de veneno con calavera
"................",
".......k........",
"......kvk.......",
"......kvk.......",
".....kvvvk......",
".....kvvvk......",
"....kvvvvvk.....",
"...kvvvvvvvk....",
"...kvkvvvkvk....",
"...kvvvvvvvk....",
"...kvvkkkvvk....",
"....kvvvvvk.....",
".....kVVVk......",
"......kkk.......",
"................",
"................",
],

"marca": [                      # marca permanente (herida que no cierra)
"................",
"..k..........k..",
"..kk........kk..",
"...kk......kk...",
"....kRk..kRk....",
".....kRkkRk.....",
"......kRRk......",
"......kRRk......",
".....kRkkRk.....",
"....kRk..kRk....",
"...kk......kk...",
"..kk........kk..",
"..k..........k..",
"................",
"................",
"................",
],

# ---------- CURACION ----------
"curar": [                      # hoja con cruz
"................",
"........kkk.....",
"......kkgggk....",
".....kgggggk....",
"....kggwggggk...",
"...kggwwwgggk...",
"...kggwwwggGk...",
"...kggwggggGk...",
"...kgggggggGk...",
"....kggggGGk....",
".....kgGGGk.....",
"...k..kGGk......",
"..k....kk.......",
".k..............",
"................",
"................",
],

"curar_turnos": [               # varias hojitas (cura por turnos)
"................",
"...kk...........",
"..kggk..........",
"..kggk...kk.....",
"...kk...kggk....",
"........kggk....",
".........kk.....",
"....kk..........",
"...kggk....kk...",
"...kggk...kggk..",
"....kk....kggk..",
"...........kk...",
"................",
"................",
"................",
"................",
],

# ---------- DEFENSA ----------
"escudo": [                     # defensa destructible
"................",
"...kkkkkkkkk....",
"..kbbbbbbbbbk...",
"..kbwwwwwwwbk...",
"..kbwbbbbbwbk...",
"..kbwbbbbbwbk...",
"..kbwbbbbbwbk...",
"..kbwwwwwwwbk...",
"..kbbbbbbbbbk...",
"...kbbbbbbbk....",
"....kbbbbbk.....",
".....kbbbk......",
"......kbk.......",
".......k........",
"................",
"................",
],

"reducir": [                    # escudo tenue (reduce dano)
"................",
"...kk.kkk.kk....",
"..k.bb...bb.k...",
"..kbb.....bbk...",
"..k..bbbbb..k...",
"..kbb.....bbk...",
"..k.bb...bb.k...",
"..kbb.....bbk...",
"..k.bbbbbbb.k...",
"...k.bbbbb.k....",
"....k.bbb.k.....",
".....k.b.k......",
"......k.k.......",
".......k........",
"................",
"................",
],

"invulnerable": [
"................",
"...k......k.....",
"..kwk....kwk....",
"...k..kkk.k.....",
".....kwwwk......",
"...kkwcccwkk....",
"..kwcccccccwk...",
"..kwcccccccwk...",
"..kwcccccccwk...",
"..kwcccccccwk...",
"...kkwcccwkk....",
".....kwwwk......",
"...k..kkk..k....",
"..kwk.....kwk...",
"...k.......k....",
"................",
],

"contra": [
"................",
".......k........",
"....k..k..k.....",
".....k.k.k......",
"..k...kkk...k...",
"...k.kwwwk.k....",
"....kwwwwwk.....",
".kkkkwwwwwkkkk..",
"....kwwwwwk.....",
"...k.kwwwk.k....",
"..k...kkk...k...",
".....k.k.k......",
"....k..k..k.....",
".......k........",
"................",
"................",
],

# ---------- CONTROL ----------
"aturdir": [                    # estrellitas de mareo
"................",
"....k...........",
"...kyk.....k....",
"..kyyyk...kyk...",
"...kyk...kyyyk..",
"....k.....kyk...",
"...........k....",
"................",
"......k.........",
".....kyk........",
"....kyyyk...k...",
".....kyk...kyk..",
"......k...kyyyk.",
"...........kyk..",
"............k...",
"................",
],

"exponer": [                    # mira / diana (rompe la esquiva)
"................",
".......k........",
".......k........",
"....kkkkkkk.....",
"...k...k...k....",
"..k....k....k...",
".k.....k.....k..",
"kkkkkkkrkkkkkkk.",
".k.....k.....k..",
"..k....k....k...",
"...k...k...k....",
"....kkkkkkk.....",
".......k........",
".......k........",
"................",
"................",
],

# ---------- ENERGIA ----------
"robar": [
"................",
"............kk..",
"..........kkyyk.",
".........kyyyyk.",
".........kyywyk.",
".........kyyyyk.",
"..kkk.....kkyyk.",
".kwwwk......kk..",
".kwwwwkk........",
".kwwwwwwk.......",
".kwwwwwwwk......",
"..kwwwwwwk......",
"..kwwwwwk.......",
"...kkkkk........",
"................",
"................",
],

"quemar": [                     # quemar energia (llama)
"................",
".......k........",
"......kok.......",
"......kok.......",
".....kooyk......",
"....kooyyok.....",
"...kooyyyyok....",
"...koyywwyok....",
"..kooywwwyook...",
"..kooyywwyyok...",
"..kooyyyyyyok...",
"...kooyyyyok....",
"...kRooooRk.....",
"....kkRRkk......",
"................",
"................",
],

"modo": [                       # MODO activo (aura)
"......kkk.......",
"....kkyyykk.....",
"...kyyyyyyyk....",
"..kyykkkkkyyk...",
"..kyk.....kyk...",
".kyk..kkk..kyk..",
".kyk.kwwwk.kyk..",
".kyk.kwwwk.kyk..",
".kyk.kwwwk.kyk..",
".kyk..kkk..kyk..",
"..kyk.....kyk...",
"..kyykkkkkyyk...",
"...kyyyyyyyk....",
"....kkyyykk.....",
"......kkk.......",
"................",
],

# ---------- AREA ----------
"area": [
"................",
"....kkkkkkkk....",
"..kk........kk..",
".k....kkkk....k.",
"k...kk....kk...k",
"k..k..kkkk..k..k",
"k.k..k....k..k.k",
"k.k.k.kkkk.k.k.k",
"k.k.k.kwwk.k.k.k",
"k.k.k.kkkk.k.k.k",
"k.k..k....k..k.k",
"k..k..kkkk..k..k",
"k...kk....kk...k",
".k....kkkk....k.",
"..kk........kk..",
"....kkkkkkkk....",
],

"definitiva": [                 # la grande (estrella de impacto)
".......k........",
"..k....k....k...",
"...k..kyk..k....",
"....k.kyk.k.....",
".....kkykk......",
"..kkkkyyykkkk...",
"..kyyyywwyyyyk..",
"kkyywwwwwwwwykk.",
"..kyyyywwyyyyk..",
"..kkkkyyykkkk...",
".....kkykk......",
"....k.kyk.k.....",
"...k..kyk..k....",
"..k....k....k...",
".......k........",
"................",
],

# ---------- ESQUIVA (universal) ----------
"esquiva": [                    # salto / esquive con estelas
"................",
"..........kkk...",
".........kwwwk..",
".........kwwwk..",
"..k.......kkk...",
".k.k....kkkkk...",
"..k....kwwwwwk..",
".k.k..kwwcccwk..",
"..k...kwcccck...",
".k.k..kwcck.....",
"..k...kck.......",
".k.k.kck........",
"..k..kk.........",
"................",
"................",
"................",
],
}


def dibujar(nombre, filas):
    img = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    px = img.load()
    for y, fila in enumerate(filas[:16]):
        for x, ch in enumerate(fila[:16]):
            col = P.get(ch)
            if col:
                px[x, y] = (*col, 255)
    grande = img.resize((16 * ESCALA, 16 * ESCALA), Image.NEAREST)
    destino = OUT / f"{nombre}.png"
    grande.save(destino)
    return destino


if __name__ == "__main__":
    hechos = []
    for nombre, filas in ICONOS.items():
        # aviso si alguna fila quedo mal medida (error de tipeo en el dibujo)
        malas = [i for i, f in enumerate(filas) if len(f) != 16]
        if malas:
            print(f"  ⚠ {nombre}: filas con largo != 16 → {malas}")
        if len(filas) != 16:
            print(f"  ⚠ {nombre}: {len(filas)} filas (deben ser 16)")
        hechos.append(dibujar(nombre, filas))
    print(f"OK · {len(hechos)} iconos en {OUT}")
