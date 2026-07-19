# -*- coding: utf-8 -*-
# ============================================================
# gen_props.py — genera con PixelLab los PROPS/ESCENARIOS de los mapas
# (árboles, landmarks, flora, tumbas…). NO toca animales ni leyendas del folclor.
#   POST https://api.pixellab.ai/v2/create-image-pixflux
# Uso:
#   export PIXELLAB_TOKEN="..."         (nunca en el archivo)
#   python gen_props.py --list
#   python gen_props.py prop_guanacaste prop_palm
#   python gen_props.py --all           (genera los que falten)
# Guarda en assets/escenarios/<key>.png (256x256, fondo transparente).
# ============================================================
import os, sys, json, base64, urllib.request, pathlib
from PIL import Image

API = "https://api.pixellab.ai/v2/create-image-pixflux"
OUT = pathlib.Path(__file__).parent / "assets" / "escenarios"
SIZE = 128

STYLE = ("pixel art game asset, clean black outline, soft cel shading, vibrant colors, "
         "transparent background, single object centered, no text, no border, no ground shadow")

PROMPTS = {
 "prop_guanacaste": "a large Guanacaste tree, very wide flat umbrella-shaped green canopy, thick short trunk, savanna",
 "prop_mango":      "a mango fruit tree, round leafy green canopy with ripe orange and red mangoes, brown trunk",
 "prop_palm":       "a tall coconut palm tree, curved trunk, green fronds on top, a few coconuts",
 "prop_pine":       "a tall highland cypress conifer tree, conical dark green foliage, brown trunk",
 "prop_cloudtree":  "a tall cloud forest rainforest tree covered in green moss and epiphytes, lush canopy",
 "prop_deadtree":   "a spooky dead bare tree, twisted leafless dark branches, gnarled, haunted",
 "prop_teatro":     "the National Theatre of Costa Rica building, neoclassical facade with white columns and a triangular pediment, cream stone",
 "prop_basilica":   "a byzantine cathedral church with two tall bell towers and a central dome, cross on top, blue grey stone, Basilica de los Angeles",
 "prop_ruins":      "old stone church ruins with broken roman arches, weathered grey stone, moss, Santiago Apostol ruins",
 "prop_volcano":    "a volcano mountain with a smoking crater at the top, grey rocky cone, green forest base, grey smoke plume",
 "prop_lighthouse": "a red and white horizontally striped lighthouse tower with a glowing light beacon on top, small rock base",
 "prop_boat":       "a small wooden fishing boat panga with a single triangular sail, resting on sand",
 "prop_banana":     "a banana plant with big broad drooping green leaves and a hanging bunch of yellow bananas",
 "prop_coffee":     "a round coffee bush plant, green leaves with clusters of ripe red coffee berries",
 "prop_flowers":    "a bush of colorful tropical flowers, pink purple and yellow blossoms with green stems and leaves",
 "prop_guaria":     "a purple guaria morada orchid flower on a green stem, Costa Rica national flower",
 "prop_fern":       "a lush green tropical fern plant with fanned symmetrical fronds",
 "prop_bromeliad":  "a bromeliad epiphyte plant, rosette of green leaves with a bright red flower in the center",
 "prop_cane":       "a cluster of tall green sugarcane stalks, segmented canes with long thin leaves",
 "prop_building":   "a small colorful Costa Rican town house building, two stories, windows, sloped tile roof",
 "prop_tomb":       "an old grey weathered stone tombstone gravestone with a cross carved on it, graveyard",
 "prop_cross":      "an old weathered wooden graveyard cross, slightly leaning, dark wood",
 "prop_rock":       "a grey mossy boulder rock with patches of green moss",
 "prop_bushdry":    "a dry savanna shrub bush, sparse yellowish-green foliage",
 "prop_cacao":      "a cacao branch with ripe orange, red and yellow cocoa pods and green leaves",
}

def gen(key, prompt, token):
    body = json.dumps({
        "description": f"{prompt}, {STYLE}",
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
    png = base64.b64decode(data["image"]["base64"])
    (OUT / f"{key}.png").write_bytes(png)
    usd = data.get("usage", {}).get("usd", 0)
    return usd

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    args = sys.argv[1:]
    if not args or args[0] == "--list":
        for k in PROMPTS: print(("[x]" if (OUT/f"{k}.png").exists() else "[ ]"), k)
        sys.exit(0)
    token = os.environ.get("PIXELLAB_TOKEN")
    if not token: sys.exit("ERROR: falta PIXELLAB_TOKEN en el entorno")
    keys = list(PROMPTS) if args[0] == "--all" else args
    if args[0] == "--all":
        keys = [k for k in PROMPTS if not (OUT/f"{k}.png").exists()]
    total = 0.0
    for k in keys:
        if k not in PROMPTS: print("?? no existe:", k); continue
        try:
            usd = gen(k, PROMPTS[k], token); total += usd
            print(f"OK {k}.png  ${usd:.4f}")
        except Exception as e:
            print(f"FAIL {k}: {e}")
    print(f"--- total ${total:.4f}")
