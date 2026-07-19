# -*- coding: utf-8 -*-
# ============================================================
# gen_bosses.py — genera con PixelLab los CABECILLAS (un jefe distinto por
# provincia) y los RETRATOS para los diálogos. Misma esencia en todos: líder de
# la red de traficantes de fauna, pixel art, busto mirando al frente.
# NO toca animales ni las leyendas del folclor.
#   POST https://api.pixellab.ai/v2/create-image-pixflux
# Uso:
#   export PIXELLAB_TOKEN="..."      (nunca en el archivo)
#   python gen_bosses.py --all
# Guarda en assets/personajes/<key>.png (transparente).
# ============================================================
import os, sys, json, base64, urllib.request, pathlib

API = "https://api.pixellab.ai/v2/create-image-pixflux"
OUT = pathlib.Path(__file__).parent / "assets" / "personajes"
SIZE = 128

# Esencia COMÚN de todos los cabecillas (para que se sientan del mismo cartel).
ESSENCE = ("villain boss portrait, bust from the chest up, facing the viewer, menacing confident sneer, "
           "wildlife trafficker kingpin, dark green and brown clothing with a red armband, "
           "pixel art character, clean black outline, soft cel shading, transparent background, "
           "no text, no border, single character")

PROMPTS = {
 # --- cabecilla por provincia ---
 "boss_sanjose":   "a slick city crime boss in a dark pinstripe suit with a gold chain, slicked back hair, thin moustache, smoking a cigar",
 "boss_alajuela":  "a burly farm overseer boss with a straw hat, open vest, sunburned face, thick beard, machete on his shoulder",
 "boss_cartago":   "a cold stern boss in a long dark trench coat and scarf, grey beard, highland cold, stone faced",
 "boss_heredia":   "a greedy plantation overseer boss with a wide brim hat and a coiled whip, gold rings, oily smile",
 "boss_guanacaste":"a sabanero cowboy boss with a cowboy hat, leather vest, lasso on his shoulder, weathered tan face",
 "boss_puntarenas":"a sea captain smuggler boss with a captain hat, thick beard, pipe in mouth, anchor tattoo on the neck",
 "boss_limon":     "a dockside port smuggler boss with a cap, gold tooth grin, tank top, thick gold chain",
 "boss_monteverde":"the supreme kingpin, imposing tall figure in a long black coat with fur collar, deep scar across the face, cold cruel eyes, final boss",
 # --- retratos del jugador (para los diálogos) ---
 "retrato_hombre": "a young male costa rican park ranger naturalist guide, khaki shirt, binoculars around the neck, friendly determined face, portrait bust facing viewer",
 "retrato_mujer":  "a young female costa rican park ranger naturalist guide, khaki shirt, ponytail, binoculars around the neck, friendly determined face, portrait bust facing viewer",
}
# los retratos del guía NO son villanos: estilo propio
HERO_STYLE = ("pixel art character portrait, bust from the chest up, facing the viewer, warm friendly expression, "
              "clean black outline, soft cel shading, vibrant colors, transparent background, no text, no border, single character")

def gen(key, prompt, token):
    style = HERO_STYLE if key.startswith("retrato_") else ESSENCE
    body = json.dumps({
        "description": f"{prompt}, {style}",
        "image_size": {"width": SIZE, "height": SIZE},
        "no_background": True,
        "text_guidance_scale": 8.0,
        "outline": "single color black outline",
        "shading": "medium shading",
        "detail": "highly detailed",
    }).encode()
    req = urllib.request.Request(API, data=body, method="POST",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=120) as r:
        data = json.loads(r.read())
    (OUT / f"{key}.png").write_bytes(base64.b64decode(data["image"]["base64"]))
    return data.get("usage", {}).get("usd", 0)

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    args = sys.argv[1:]
    if not args or args[0] == "--list":
        for k in PROMPTS: print(("[x]" if (OUT/f"{k}.png").exists() else "[ ]"), k)
        sys.exit(0)
    token = os.environ.get("PIXELLAB_TOKEN")
    if not token: sys.exit("ERROR: falta PIXELLAB_TOKEN en el entorno")
    keys = [k for k in PROMPTS if not (OUT/f"{k}.png").exists()] if args[0] == "--all" else args
    total = 0.0
    for k in keys:
        if k not in PROMPTS: print("?? no existe:", k); continue
        try:
            usd = gen(k, PROMPTS[k], token); total += usd; print(f"OK {k}.png  ${usd:.4f}", flush=True)
        except Exception as e:
            print(f"FAIL {k}: {e}", flush=True)
    print(f"--- total ${total:.4f}")
