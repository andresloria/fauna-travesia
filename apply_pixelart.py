# -*- coding: utf-8 -*-
# ============================================================
# apply_pixelart.py — copia las imágenes hechas a mano por Andrés
# (C:\Users\Andres\Claude\Projects\Fauna\pixelart\<nombre>.png) a
# assets/animales/<slug>.png, mapeando el nombre en español → slug del juego.
# Re-correr si Andrés agrega/renombra imágenes en esa carpeta.
# ============================================================

import os, re, shutil

SRC = r"C:\Users\Andres\Claude\Projects\Fauna\pixelart"
DST = os.path.join(os.path.dirname(__file__), "assets", "animales")

# nombre de archivo del usuario -> slug de la especie en el juego (SP)
MAP = {
    "Ibis blanco.png": "ibis", "Jicotea.png": "jicotea", "Mica.png": "mica",
    "Rabihorcado.png": "fragata", "aguila harpia.png": "aguila_harpia",
    "aninga.png": "anhinga", "ardilla.png": "ardilla", "armadillo.png": "armadillo",
    "ballenajorobada.png": "ballena", "basilisco verde.png": "basilisco",
    "bejuquilla.png": "bejuquilla", "boa.png": "boa", "bocaraca.png": "bocaraca",
    "caiman.png": "caiman", "carablanca.png": "monocara", "caracara.png": "caracara",
    "carpintero.png": "carpintero", "cascabel.png": "cascabel", "causel.png": "caucel",
    "chachalaca.png": "chachalaca", "chanchomonte.png": "chancho_monte",
    "cocodrilo.png": "cocodrilo", "colibri garganta de fuego.png": "colibri_fuego",
    "colibritalamanca.png": "colibri_talamanca", "comadreja.png": "comadreja",
    "comemaiz.png": "comemaiz", "coral.png": "coral", "coyote.png": "coyote",
    "cusingo.png": "cusingo", "danta.png": "danta", "delfin.png": "delfin",
    "escarabajo hercules.png": "escarabajo", "espatularosada.png": "espatula",
    "garrobo.png": "garrobo", "garzareal.png": "garza", "gato.png": "gato",
    "gecko.png": "geco", "grison.png": "grison", "guatusa.png": "guatusa",
    "hormiga bala.png": "hormiga_bala", "iguana verde.png": "iguana",
    "jabiru.png": "jabiru", "jacamarcolaroja.png": "jacamar", "jaguar.png": "jaguar",
    "jaguarundi.png": "leon_brenero", "lagartija.png": "anolis", "lapa roja.png": "lapa",
    "lapa verde.png": "lapa_verde", "lechuza.png": "lechuza", "lorofrenteroja.png": "loro",
    "manaticaribe.png": "manati", "manigordo.png": "manigordo", "mantarraya.png": "mantarraya",
    "mapache.png": "mapache", "mariposa Julia.png": "mariposa_julia",
    "mariposa buho.png": "mariposa_buho", "marlin azul.png": "marlin",
    "martilla.png": "martilla", "martin pescador.png": "martin_pescador",
    "matabuey.png": "matabuey", "momoto.png": "momoto", "monoaraña.png": "mono_arana",
    "monoaullador.png": "mono_congo", "monotiti.png": "mono_titi",
    "morphoazul.png": "mariposa", "mosquero.png": "bienteveo", "murcielago.png": "murcielago",
    "nutria.png": "nutria", "olingo.png": "olingo", "oropendula.png": "oropendola",
    "osohormiguero.png": "oso_hormiguero", "pajaro de campana.png": "pajaro_campana",
    "pelicanopardo.png": "pelicano", "perezoso.png": "perezoso",
    "perezoso2dedos.png": "perezoso_dos", "perro.png": "perro", "pez vela.png": "pez_vela",
    "pizote.png": "pizote", "puercoespin.png": "puercoespin", "puma.png": "puma",
    "quetzal.png": "quetzal", "rana de ojos rojos.png": "rana_ojos_rojos",
    "rana payaso.png": "rana_payaso", "rana tungara.png": "rana_tungara",
    "ranaarbolea gladiadora.png": "rana_gladiadora", "ranabluejeans.png": "ranadardo",
    "ranadardoverde.png": "rana_verdinegra", "ranadecristal.png": "rana_cristal",
    "ranadorada.png": "sapo_dorado", "ranalechera.png": "rana_lechera", "saino.png": "saino",
    "salamandra sin pulmones.png": "salamandra", "saltarin toledo.png": "saltarin",
    "sapo marino.png": "sapo_marino", "serafindeplatanar.png": "serafin",
    "serpiente lora.png": "lora", "serpiente marina.png": "serpiente_mar",
    "tangara azuleja.png": "tangara_azul", "tangaradorada.png": "tangara_dorada",
    "tepezcuintle.png": "tepezcuintle", "terciopelo.png": "serpiente",
    "tiburon martillo.png": "tiburon_martillo", "tiburonballena.png": "tiburon_ballena",
    "tigrillo.png": "tigrillo", "tinamu.png": "tinamu", "tolomuco.png": "tolomuco",
    "tortuga baula.png": "tortuga_baula", "tortuga cabezona.png": "tortuga_cabezona",
    "tortuga carey.png": "tortuga_carey", "tortuga lora.png": "tortuga_lora",
    "tortuga verde.png": "tortuga", "trogon.png": "trogon", "tucan.png": "tucan",
    "tucancillo.png": "tucancillo", "venadocolablanca.png": "venado",
    "yiguirro.png": "yiguirro", "zarigueya.png": "zorro_pelon",
    "zopilote cabecirrojo.png": "zopilote_rojo", "zopilotenegro.png": "zopilote_negro",
    "zorrogris.png": "zorro_gris",
    # "manati.png" se ignora: duplicado de manaticaribe.png
}

# slugs del juego (para reportar cuáles quedan SIN imagen del usuario)
def game_slugs():
    js = open(os.path.join(os.path.dirname(__file__), "src", "fauna_roster.js"), encoding="utf-8").read()
    return [m.group(1) for m in re.finditer(r'^  (\w+): \{', js, re.M)]


def main():
    files = set(os.listdir(SRC))
    copied, missing_files = 0, []
    used_slugs = set()
    for fn, slug in MAP.items():
        if fn not in files:
            missing_files.append(fn); continue
        shutil.copyfile(os.path.join(SRC, fn), os.path.join(DST, slug + ".png"))
        used_slugs.add(slug); copied += 1
    print(f"Copiadas {copied} imágenes del usuario.")
    if missing_files:
        print("OJO, en el MAP pero no en la carpeta:", missing_files)
    # archivos del usuario que no están en el MAP (no se usaron)
    unmapped = [f for f in files if f.endswith(".png") and f not in MAP and f != "manati.png"]
    if unmapped:
        print("Sin mapear (revisar):", unmapped)
    # slugs del juego que NO recibieron imagen del usuario (quedan con la de PixelLab)
    no_user = [s for s in game_slugs() if s not in used_slugs]
    print(f"\nSlugs SIN imagen del usuario ({len(no_user)}) — siguen con PixelLab:")
    print("  " + ", ".join(no_user))


if __name__ == "__main__":
    main()
