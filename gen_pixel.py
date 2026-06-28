# ============================================================
# gen_pixel.py — genera el arte pixel de las especies con la API de PixelLab.
#
#   POST https://api.pixellab.ai/v2/create-image-pixflux  (texto -> pixel art)
#   sincrono; devuelve el PNG en base64 (image.base64) + usage.usd.
#
# Uso:
#   export PIXELLAB_TOKEN="..."          (o setearlo en el entorno)
#   python gen_pixel.py tucan quetzal    -> genera esas especies
#   python gen_pixel.py --all            -> genera TODAS las que falten en PNG_ART
#   python gen_pixel.py --list           -> lista las keys disponibles
#
# Guarda en assets/animales/<key>.png (256x256, fondo transparente).
# El token NUNCA va en este archivo: se lee de PIXELLAB_TOKEN.
# ============================================================

import os, sys, json, time, base64, urllib.request, pathlib
from PIL import Image, ImageDraw

API = "https://api.pixellab.ai/v2/create-image-pixflux"
OUT = pathlib.Path(__file__).parent / "assets" / "animales"
SIZE = 256

# Sufijo de estilo comun para que TODO el roster combine entre si.
STYLE = ("full body, centered, facing slightly left, cute detailed pixel art, "
         "clean black outline, soft shading, vibrant colors, transparent background, "
         "single character, no text, no border")

# Prompt por especie (fauna 100% tica). key -> descripcion del animal.
PROMPTS = {
    # --- bosque ---
    "perezoso":   "a three-toed sloth hanging, brown fuzzy fur, sleepy smile",
    "monocara":   "a white-faced capuchin monkey sitting, black body, white face and chest",
    "tucan":      "a keel-billed toucan, black body, yellow chest, huge rainbow beak",
    "ranadardo":  "a tiny blue-jeans poison dart frog, red body, blue legs",
    "serpiente":  "a fer-de-lance terciopelo pit viper coiled, brown diamond pattern",
    "jaguar":     "a spotted jaguar sitting, golden coat with black rosettes",
    "manigordo":  "an ocelot wildcat standing, golden fur with black spots and stripes",
    "pizote":     "a coati (pizote) standing, brown fur, long ringed tail, pointy snout",
    "murcielago": "a small brown bat with spread wings",
    "mariposa":   "a blue morpho butterfly with iridescent blue wings, wings open",
    "abeja":      "a fuzzy honey bee, yellow and black stripes, small wings",
    # --- montana ---
    "quetzal":    "a resplendent quetzal bird, emerald green body, red chest, long tail feathers",
    "puma":       "a tan mountain lion puma sitting, plain sandy coat",
    "coyote":     "a coyote standing, grey-brown fur, pointed ears, bushy tail",
    # --- sabana ---
    "venado":     "a white-tailed deer standing, brown coat, small antlers",
    "saino":      "a collared peccary saino, dark bristly fur, small tusks",
    "iguana":     "a green iguana on a branch, spiky crest, long striped tail",
    "garza":      "a great egret heron, white feathers, long yellow beak, thin legs",
    # --- agua ---
    "cocodrilo":  "an american crocodile, green scaly body, long toothy snout",
    "tortuga":    "a green sea turtle swimming, patterned shell, flippers",
    "ballena":    "a humpback whale, dark blue body, long pectoral fins",
    "delfin":     "a bottlenose dolphin leaping, grey smooth body",
    "tiburon":    "a grey shark swimming, white belly, dorsal fin",
    "cangrejo":   "a bright red halloween crab, big claws raised",
    "basilisco":  "a green basilisk lizard standing on hind legs, crest on head",
    # --- legendarios ---
    "lapa":          "a scarlet macaw parrot, bright red body, blue and yellow wings, majestic",
    "quetzaldorado": "a mythical golden quetzal bird glowing, golden feathers, long tail, radiant aura",
}


def strip_bg(path, thresh=55):
    """Vuelve transparente el fondo plano: flood-fill desde las 4 esquinas
    (respeta blancos internos como ojos, porque solo entra por los bordes)."""
    im = Image.open(path).convert("RGB")
    w, h = im.size
    KEY = (255, 0, 255)  # color imposible en el arte; lo usamos de marca
    for c in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        ImageDraw.floodfill(im, c, KEY, thresh=thresh)
    px = im.load()
    out = Image.new("RGBA", (w, h))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            op[x, y] = (0, 0, 0, 0) if (r, g, b) == KEY else (r, g, b, 255)
    out.save(path)
    trans = sum(1 for p in out.split()[3].getdata() if p == 0)
    return trans


def png_art_keys():
    """Lee el set PNG_ART de src/ui.js para saber que ya esta cableado."""
    ui = (pathlib.Path(__file__).parent / "src" / "ui.js").read_text(encoding="utf-8")
    import re
    m = re.search(r"PNG_ART\s*=\s*new Set\(\[(.*?)\]\)", ui, re.S)
    if not m:
        return set()
    return set(re.findall(r"'([^']+)'", m.group(1)))


def _post(desc, token, retries=2):
    body = json.dumps({
        "description": desc,
        "image_size": {"width": SIZE, "height": SIZE},
        "no_background": True,
    }).encode()
    last = None
    for attempt in range(retries + 1):
        try:
            req = urllib.request.Request(API, data=body, method="POST", headers={
                "Authorization": f"Bearer {token}",
                "Content-Type": "application/json",
            })
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)
        except Exception as e:
            last = e
            if attempt < retries:
                time.sleep(2 + attempt * 3)   # backoff
    raise last


def generate(key, token, desc=None):
    if desc is None:
        if key not in PROMPTS:
            print(f"  -- sin prompt para '{key}', la salto")
            return None
        desc = PROMPTS[key] + ", " + STYLE
    data = _post(desc, token)
    b64 = data["image"]["base64"]
    if b64.startswith("data:"):
        b64 = b64.split(",", 1)[1]
    OUT.mkdir(parents=True, exist_ok=True)
    dest = OUT / f"{key}.png"
    dest.write_bytes(base64.b64decode(b64))
    trans = strip_bg(dest)          # recorta el fondo plano a transparente
    usd = (data.get("usage") or {}).get("usd", 0)
    print(f"  OK {key}.png  (${usd}, {trans} px transparentes)")
    return usd


def run_bestiario(token, force=False):
    """Genera TODO el bestiario (126 especies). Salta las que ya tienen PNG
    (resume-friendly) salvo --force. Escribe assets/animales/_bestiario.json."""
    from bestiario_prompts import BESTIARIO
    OUT.mkdir(parents=True, exist_ok=True)
    manifest, total = [], 0
    n_ok = n_skip = n_fail = 0
    N = len(BESTIARIO)
    for i, e in enumerate(BESTIARIO, 1):
        slug = e["slug"]
        dest = OUT / f"{slug}.png"
        rec = {"slug": slug, "cat": e["cat"], "name": e["name"],
               "sci": e.get("sci", ""), "ext": e.get("ext", False)}
        if dest.exists() and not force:
            print(f"[{i}/{N}] skip {slug} (ya existe)")
            rec["status"] = "skip"; n_skip += 1; manifest.append(rec); continue
        try:
            print(f"[{i}/{N}] gen {slug} …")
            u = generate(slug, token, desc=e["prompt"] + ", " + STYLE)
            total += u or 0; rec["status"] = "ok"; n_ok += 1
        except Exception as ex:
            print(f"[{i}/{N}] FAIL {slug}: {ex}")
            rec["status"] = "fail"; n_fail += 1
        manifest.append(rec)
        time.sleep(0.4)
    (OUT / "_bestiario.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n=== BESTIARIO LISTO ===  nuevas:{n_ok}  saltadas:{n_skip}  "
          f"fallidas:{n_fail}  costo:${round(total, 4)}")


def main():
    args = sys.argv[1:]
    if not args or "--list" in args:
        print("Especies disponibles:", ", ".join(sorted(PROMPTS)))
        return
    token = os.environ.get("PIXELLAB_TOKEN")
    if not token:
        sys.exit("ERROR: falta la variable PIXELLAB_TOKEN")
    if "--bestiario" in args:
        run_bestiario(token, force="--force" in args)
        return
    if "--all" in args:
        done = png_art_keys()
        keys = [k for k in PROMPTS if k not in done]
    else:
        keys = args
    print(f"Generando {len(keys)} imagen(es)...")
    total = 0
    for k in keys:
        try:
            u = generate(k, token)
            if u:
                total += u
        except Exception as e:
            print(f"  FAIL {k}: {e}")
    print(f"Listo. Costo total aprox: ${round(total, 4)}")


if __name__ == "__main__":
    main()
