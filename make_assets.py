# ============================================================
# make_assets.py — descarga los assets del juego (re-ejecutable).
#   · arte de animales: OpenMoji (CC BY-SA 4.0) -> assets/animales/<key>.svg
#   · siluetas de pais: mapsicon (MIT)          -> assets/paises/<slug>.svg
# Correr:  python make_assets.py
# No toca datos del juego; solo baja archivos a assets/.
# ============================================================
import os, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.abspath(__file__))
OM = "https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji@master/color/svg/{}.svg"
MAP = "https://cdn.jsdelivr.net/gh/djaiss/mapsicon@master/all/{}/vector.svg"

# especie -> codepoint OpenMoji (mismo animal que ya usaba el emoji)
ANIMALS = {
  "perezoso":"1F9A5","tucan":"1F99C","ranadardo":"1F438","jaguar":"1F406",
  "mono":"1F412","tigre":"1F405","koala":"1F428","pangolin":"1F994",
  "leon":"1F981","elefante":"1F418","jirafa":"1F992","guepardo":"1F406",
  "cebra":"1F993","canguro":"1F998","emu":"1F9A4","cobra":"1F40D",
  "hipo":"1F99B","cocodrilo":"1F40A","tiburon":"1F988","pulpo":"1F419",
  "orca":"1F40B","delfin":"1F42C","tortuga":"1F422","anaconda":"1F40D",
  "capibara":"1F9AB","pirana":"1F41F","oso":"1F43B","alce":"1FACE",
  "lobo":"1F43A","buho":"1F989","condor":"1F985","foca":"1F9AD",
  # legendarios (muy raros, atados a un país; ver COUNTRIES[*].legend en data.js)
  "pavoreal":"1F99A","rinoceronte":"1F98F","bisonte":"1F9AC",
  "morfo":"1F98B","calamar":"1F991","llama":"1F999",
  # tanda 2: más variedad
  "gorila":"1F98D","orangutan":"1F9A7","panda":"1F43C","mapache":"1F99D",
  "ardilla":"1F43F","murcielago":"1F987","camello":"1F42B","escorpion":"1F982",
  "gato":"1F408","pinguino":"1F427","lagarto":"1F98E","cangrejo":"1F980",
  "pezglobo":"1F421","abeja":"1F41D","caballo":"1F40E","bufalo":"1F403",
  # extintos (solo en el nivel secreto "Tierra Perdida")
  "mamut":"1F9A3","dino":"1F995","trex":"1F996","dodo":"1F9A4",
}

# pais (slug usado en data.js) -> ISO2 mapsicon  |  None = sin silueta (motivo propio)
COUNTRIES = {
  "costa-rica":"cr","kenia":"ke","australia":"au","canada":"ca",
  "brasil":"br","india":"in","los-andes":"pe","mar-abierto":None,
  "indonesia":"id","egipto":"eg","china":"cn","mexico":"mx","argentina":"ar",
  "antartida":"aq",   # nivel secreto
}

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()

# Ambiente de fondo (Freesound, CC0 = dominio público, sin atribución).
# "Peruvian Amazon birds frogs daytime" de nonamethefish — selva neotropical real.
AUDIO = {
  "selva": "https://cdn.freesound.org/previews/653/653743_8323061-hq.mp3",
}

def save(folder, name, url, ext="svg"):
    path = os.path.join(ROOT, "assets", folder)
    os.makedirs(path, exist_ok=True)
    try:
        data = fetch(url)
        if len(data) < 100 or (ext == "svg" and b"<svg" not in data):
            return f"  ! {name}: respuesta vacia/invalida ({url})"
        with open(os.path.join(path, name + "." + ext), "wb") as f:
            f.write(data)
        return f"  ok {name} ({len(data)//1024 or 1}kb)"
    except urllib.error.HTTPError as e:
        return f"  ! {name}: HTTP {e.code} ({url})"
    except Exception as e:
        return f"  ! {name}: {e}"

print("\nAnimales (OpenMoji):")
for key, cp in ANIMALS.items():
    print(save("animales", key, OM.format(cp)))

print("\nPaises (mapsicon):")
for slug, iso in COUNTRIES.items():
    if iso is None:
        print(f"  - {slug}: sin silueta (usa motivo de oceano en el juego)")
        continue
    print(save("paises", slug, MAP.format(iso)))

print("\nAudio de ambiente (Freesound, CC0):")
for name, url in AUDIO.items():
    print(save("audio", name, url, ext="mp3"))

print("\nListo. Assets en assets/animales/, assets/paises/ y assets/audio/.\n")
