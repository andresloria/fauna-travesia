# -*- coding: utf-8 -*-
# ============================================================
# make_fauna_data.py — construye el ROSTER del juego desde el bestiario.
# Asigna bioma, efecto (ab) y stats (atk/hp/spd) a las 126 especies, PRESERVA
# exactos los 27 ya balanceados a mano + legendarios, arma los pools por
# provincia y escribe src/fauna_roster.js (exporta SP, COUNTRIES, SECRET).
# Re-correr cuando se cambie el bestiario o el balance:  python make_fauna_data.py
# ============================================================

import json, pathlib
from bestiario_prompts import BESTIARIO

ROOT = pathlib.Path(__file__).parent

# Emoji de respaldo por categoría (si algún día falla el PNG)
EMOJI = {"Mamíferos": "🐾", "Aves": "🐦", "Anfibios": "🐸",
         "Reptiles": "🦎", "Marinos e insectos": "🐟"}

# ---- 1) Los 27 actuales, PRESERVADOS exactos (incluye legendarios) ----
EXISTING = {
    "perezoso":  dict(n="Perezoso", e="🦥", atk=1, hp=7, spd=1, bio="bosque", ab="heal"),
    "monocara":  dict(n="Mono carablanca", e="🐒", atk=2, hp=3, spd=8, bio="bosque", ab="first"),
    "tucan":     dict(n="Tucán", e="🦜", atk=2, hp=3, spd=8, bio="bosque", ab="first"),
    "ranadardo": dict(n="Rana dardo", e="🐸", atk=4, hp=1, spd=4, bio="bosque", ab="poison"),
    "serpiente": dict(n="Terciopelo", e="🐍", atk=5, hp=2, spd=6, bio="bosque", ab="poison"),
    "jaguar":    dict(n="Jaguar", e="🐆", atk=5, hp=4, spd=7, bio="bosque", ab="rage"),
    "manigordo": dict(n="Manigordo", e="🐈", atk=3, hp=3, spd=8, bio="bosque", ab="first"),
    "pizote":    dict(n="Pizote", e="🦝", atk=3, hp=4, spd=5, bio="bosque", ab="first"),
    "murcielago":dict(n="Murciélago", e="🦇", atk=3, hp=2, spd=8, bio="bosque", ab="poison"),
    "mariposa":  dict(n="Morfo azul", e="🦋", atk=2, hp=2, spd=7, bio="bosque", ab="first"),
    "abeja":     dict(n="Abeja", e="🐝", atk=3, hp=1, spd=7, bio="bosque", ab="poison"),
    "quetzal":   dict(n="Quetzal", e="🐦", atk=2, hp=4, spd=7, bio="montana", ab="heal"),
    "puma":      dict(n="Puma", e="🐆", atk=5, hp=5, spd=7, bio="montana", ab="rage"),
    "coyote":    dict(n="Coyote", e="🐺", atk=4, hp=3, spd=7, bio="montana", ab="first"),
    "venado":    dict(n="Venado", e="🦌", atk=2, hp=6, spd=7, bio="sabana", ab="shield"),
    "saino":     dict(n="Saíno", e="🐗", atk=4, hp=5, spd=4, bio="sabana", ab="rage"),
    "iguana":    dict(n="Iguana", e="🦎", atk=2, hp=5, spd=4, bio="sabana", ab="thorns"),
    "garza":     dict(n="Garza", e="🐦", atk=2, hp=3, spd=6, bio="sabana", ab="first"),
    "cocodrilo": dict(n="Cocodrilo", e="🐊", atk=5, hp=6, spd=3, bio="agua", ab="first"),
    "tortuga":   dict(n="Tortuga verde", e="🐢", atk=1, hp=8, spd=1, bio="agua", ab="shield"),
    "ballena":   dict(n="Ballena jorobada", e="🐋", atk=6, hp=8, spd=3, bio="agua", ab="rage"),
    "delfin":    dict(n="Delfín", e="🐬", atk=3, hp=3, spd=8, bio="agua", ab="first"),
    "tiburon":   dict(n="Tiburón", e="🦈", atk=6, hp=4, spd=6, bio="agua", ab="rage"),
    "cangrejo":  dict(n="Cangrejo", e="🦀", atk=2, hp=5, spd=3, bio="agua", ab="thorns"),
    "basilisco": dict(n="Basilisco", e="🦎", atk=3, hp=3, spd=8, bio="agua", ab="first"),
    "lapa":      dict(n="Lapa roja", e="🦜", atk=5, hp=6, spd=6, bio="bosque", ab="rage", leg=True),
    "quetzaldorado": dict(n="Quetzal Dorado", e="🐦", atk=4, hp=9, spd=8, bio="montana", ab="heal", leg=True),
}

# ---- 2) Bioma por especie nueva (las del bestiario que no están arriba) ----
BIOME = {
    # mamíferos
    "perezoso_dos": "bosque", "mono_congo": "bosque", "mono_arana": "bosque", "mono_titi": "bosque",
    "caucel": "bosque", "leon_brenero": "bosque", "tigrillo": "bosque", "danta": "bosque",
    "chancho_monte": "bosque", "cabro_monte": "montana", "mapache": "bosque", "mapache_cangrejero": "agua",
    "martilla": "bosque", "olingo": "bosque", "tolomuco": "bosque", "grison": "sabana",
    "nutria": "agua", "comadreja": "montana", "zorro_pelon": "bosque", "oso_hormiguero": "bosque",
    "serafin": "bosque", "armadillo": "sabana", "tepezcuintle": "bosque", "guatusa": "bosque",
    "ardilla": "bosque", "puercoespin": "bosque", "zorro_gris": "sabana", "manati": "agua",
    # aves
    "yiguirro": "bosque", "lapa_verde": "bosque", "tucan_castano": "bosque", "cusingo": "bosque",
    "tucancillo": "bosque", "pajaro_campana": "montana", "oropendola": "bosque", "colibri_fuego": "montana",
    "colibri_talamanca": "montana", "ermitano": "bosque", "jacamar": "bosque", "momoto": "sabana",
    "tangara_azul": "bosque", "tangara_dorada": "montana", "bienteveo": "sabana", "espatula": "agua",
    "jabiru": "agua", "tantalo": "agua", "ibis": "agua", "pelicano": "agua", "fragata": "agua",
    "aguila_harpia": "bosque", "caracara": "sabana", "zopilote_negro": "sabana", "zopilote_rojo": "sabana",
    "lechuza": "bosque", "carpintero": "bosque", "saltarin": "bosque", "trogon": "bosque",
    "martin_pescador": "agua", "anhinga": "agua", "tinamu": "bosque", "pavon": "bosque",
    "chachalaca": "bosque", "loro": "bosque",
    # anfibios
    "rana_ojos_rojos": "bosque", "rana_verdinegra": "bosque", "rana_granular": "bosque",
    "rana_cristal": "bosque", "rana_lechera": "bosque", "rana_tungara": "sabana",
    "rana_gladiadora": "bosque", "rana_payaso": "bosque", "sapo_marino": "sabana",
    "sapo_dorado": "montana", "salamandra": "montana", "cecilia": "bosque",
    # reptiles
    "garrobo": "sabana", "basilisco_comun": "agua", "anolis": "bosque", "geco": "bosque",
    "caiman": "agua", "boa": "bosque", "bocaraca": "bosque", "lora": "montana", "cascabel": "sabana",
    "matabuey": "bosque", "coral": "bosque", "serpiente_mar": "agua", "mica": "bosque",
    "bejuquilla": "bosque", "tortuga_baula": "agua", "tortuga_carey": "agua", "tortuga_lora": "agua",
    "tortuga_cabezona": "agua", "jicotea": "agua",
    # marinos e insectos
    "tiburon_martillo": "agua", "tiburon_ballena": "agua", "pez_vela": "agua", "marlin": "agua",
    "mantarraya": "agua", "mariposa_buho": "bosque", "mariposa_julia": "bosque",
    "hormiga_bala": "bosque", "escarabajo": "bosque",
}

# ---- 3) Roles para stats y conjuntos de efectos ----
VENENO = {"bocaraca", "lora", "cascabel", "matabuey", "coral", "serpiente_mar", "boa",
          "rana_ojos_rojos", "rana_verdinegra", "rana_granular", "rana_payaso",
          "sapo_marino", "sapo_dorado", "hormiga_bala", "cecilia", "mica", "bejuquilla"}
ESCUDO = {"tortuga_baula", "tortuga_carey", "tortuga_lora", "tortuga_cabezona", "jicotea",
          "armadillo", "danta", "manati", "tiburon_ballena", "tepezcuintle"}
PUAS   = {"garrobo", "puercoespin", "escarabajo", "anolis", "basilisco_comun"}
REGEN  = {"perezoso_dos", "yiguirro", "martilla", "serafin", "loro", "salamandra"}
FURIA  = {"mono_congo", "leon_brenero", "tolomuco", "caiman", "aguila_harpia", "caracara",
          "tiburon_martillo", "marlin", "pez_vela", "chancho_monte", "pavon", "danta"}
# el resto: 'first' (rápidos/ágiles por defecto)

# Roles de stats (atk, hp, spd) — base por rol, con jitter determinista ±1
TANK    = {"danta", "manati", "tiburon_ballena", "tortuga_baula", "tortuga_carey",
           "tortuga_lora", "tortuga_cabezona", "jicotea", "caiman", "armadillo", "tepezcuintle"}
GLASS   = {"rana_ojos_rojos", "rana_verdinegra", "rana_granular", "rana_payaso", "hormiga_bala",
           "coral", "bocaraca", "serpiente_mar", "sapo_dorado", "cecilia"}
FAST    = {"mono_titi", "mono_arana", "colibri_fuego", "colibri_talamanca", "ermitano",
           "mariposa_buho", "mariposa_julia", "saltarin", "tangara_azul", "tangara_dorada",
           "yiguirro", "bienteveo", "carpintero", "trogon", "momoto", "jacamar", "anolis", "geco",
           "ardilla", "comadreja", "delfin", "loro", "tucan_castano", "cusingo", "tucancillo"}
PRED    = {"caucel", "tigrillo", "leon_brenero", "tolomuco", "grison", "aguila_harpia", "caracara",
           "tiburon_martillo", "marlin", "pez_vela", "boa", "matabuey", "cascabel", "mica", "caiman",
           "mono_congo", "chancho_monte", "pavon"}

ROLE_BASE = {
    "tank":     (2, 8, 2),
    "glass":    (5, 1, 5),
    "fast":     (2, 3, 8),
    "predator": (5, 5, 6),
    "balanced": (3, 4, 5),
}


def jitter(slug, lo, hi):
    return sum(ord(c) for c in slug) % (hi - lo + 1) + lo  # determinista por slug


def role_of(slug):
    if slug in TANK: return "tank"
    if slug in GLASS: return "glass"
    if slug in FAST: return "fast"
    if slug in PRED: return "predator"
    return "balanced"


def ability_of(slug):
    if slug in VENENO: return "poison"
    if slug in ESCUDO: return "shield"
    if slug in PUAS: return "thorns"
    if slug in REGEN: return "heal"
    if slug in FURIA: return "rage"
    return "first"


def stats_of(slug):
    a, h, s = ROLE_BASE[role_of(slug)]
    # jitter suave (±1) para variedad, sin romper el arquetipo
    j = jitter(slug, 0, 2) - 1
    a = max(1, min(6, a + j))
    h = max(1, min(9, h + (jitter(slug + "h", 0, 2) - 1)))
    s = max(1, min(8, s + (jitter(slug + "s", 0, 2) - 1)))
    return a, h, s


# ---- 4) Construir SP ----
SP = {}
for e in BESTIARIO:
    slug = e["slug"]
    if slug in EXISTING:
        SP[slug] = dict(EXISTING[slug]); continue
    a, h, s = stats_of(slug)
    rec = dict(n=e["name"], e=EMOJI.get(e["cat"], "🐾"),
               atk=a, hp=h, spd=s, bio=BIOME.get(slug, "bosque"), ab=ability_of(slug))
    if e.get("ext"): rec["ext"] = True
    SP[slug] = rec
# extras que no están en el bestiario pero sí en el juego (con art propio)
for slug in ("abeja", "cangrejo", "tiburon", "quetzaldorado"):
    if slug not in SP:
        SP[slug] = dict(EXISTING[slug])

# ---- 5) Pools por provincia (por bioma + región), cubriendo TODO el roster ----
PROV = [
    ("🏙️", "San José",   ["bosque", "montana"]),
    ("🌋", "Alajuela",   ["bosque", "agua", "montana"]),
    ("⛰️", "Cartago",    ["montana", "bosque"]),
    ("🌿", "Heredia",    ["montana", "bosque"]),
    ("🌾", "Guanacaste", ["sabana", "agua", "bosque"]),
    ("🌊", "Puntarenas", ["agua", "bosque"]),
    ("🏝️", "Limón",      ["agua", "bosque"]),
]
non_leg = [k for k, v in SP.items() if not v.get("leg")]
by_biome = {}
for k in non_leg:
    by_biome.setdefault(SP[k]["bio"], []).append(k)
for b in by_biome:
    by_biome[b].sort()

# Reparto BALANCEADO: cada especie va a la provincia elegible (por bioma) que
# esté menos llena → pools parejos (~18 c/u) y cobertura total garantizada.
prov_biomes = [biomes for (_, _, biomes) in PROV]
pools = [[] for _ in PROV]
for k in sorted(non_leg):
    bio = SP[k]["bio"]
    eligible = [i for i, bs in enumerate(prov_biomes) if bio in bs] or list(range(len(PROV)))
    i = min(eligible, key=lambda i: (len(pools[i]), i))
    pools[i].append(k)
# unos íconos repetidos en 1 provincia extra, para que aparezcan en más de un lado
for k in ("jaguar", "perezoso", "tortuga", "cocodrilo", "tucan", "quetzal"):
    if k in non_leg:
        bio = SP[k]["bio"]
        elig = [i for i, bs in enumerate(prov_biomes) if bio in bs and k not in pools[i]]
        if elig:
            j = min(elig, key=lambda i: (len(pools[i]), i)); pools[j].append(k)

COUNTRIES = []
for i, (flag, name, biomes) in enumerate(PROV):
    c = {"flag": flag, "n": name, "map": "costa-rica"}
    if name in ("Guanacaste", "Puntarenas"):
        c["legend"] = "lapa"
    c["pool"] = pools[i]
    COUNTRIES.append(c)

SECRET = {"flag": "☁️", "n": "Monteverde", "map": "costa-rica", "secret": True,
          "legend": "quetzaldorado",
          "pool": [k for k in by_biome.get("montana", []) + by_biome.get("bosque", [])][:14]}


# ---- 6) Emitir JS ----
def js_obj(d):
    parts = []
    for k, v in d.items():
        fields = ", ".join(
            f"{fk}:{json.dumps(fv, ensure_ascii=False)}" for fk, fv in v.items())
        parts.append(f"  {k}: {{ {fields} }},")
    return "\n".join(parts)


def js_country(c):
    leg = f" legend:{json.dumps(c['legend'])}," if "legend" in c else ""
    sec = " secret:true," if c.get("secret") else ""
    pool = ", ".join(json.dumps(k) for k in c["pool"])
    return (f"  {{ flag:{json.dumps(c['flag'], ensure_ascii=False)}, "
            f"n:{json.dumps(c['n'], ensure_ascii=False)}, map:{json.dumps(c['map'])},"
            f"{sec}{leg} pool:[{pool}] }},")


out = []
out.append("// ============================================================")
out.append("// fauna_roster.js — GENERADO por make_fauna_data.py. NO editar a mano.")
out.append("// Roster completo de fauna tica (126 especies) + pools por provincia.")
out.append("// Stats/bioma/efecto auto-asignados por arquetipo; los 27 base y los")
out.append("// legendarios van con sus valores curados. Re-generar: python make_fauna_data.py")
out.append("// ============================================================")
out.append("")
out.append(f"// {len(SP)} especies ({len(non_leg)} jugables en pools + legendarios)")
out.append("export const SP = {")
out.append(js_obj(SP))
out.append("};")
out.append("")
out.append("export const COUNTRIES = [")
for c in COUNTRIES:
    out.append(js_country(c))
out.append("];")
out.append("")
out.append("export const SECRET = {")
out.append(f"  flag:{json.dumps(SECRET['flag'], ensure_ascii=False)}, n:{json.dumps(SECRET['n'], ensure_ascii=False)}, "
           f"map:{json.dumps(SECRET['map'])}, secret:true, legend:{json.dumps(SECRET['legend'])},")
out.append(f"  pool:[{', '.join(json.dumps(k) for k in SECRET['pool'])}],")
out.append("};")
out.append("")

(ROOT / "src" / "fauna_roster.js").write_text("\n".join(out), encoding="utf-8")
print(f"OK src/fauna_roster.js  SP={len(SP)}  jugables={len(non_leg)}")
for c in COUNTRIES:
    print(f"  {c['n']:11} ({len(c['pool'])}): {', '.join(c['pool'][:6])}…")
print(f"  Monteverde ({len(SECRET['pool'])})")
# chequeo: toda especie no-legendaria está en algún pool
miss = [k for k in non_leg if k not in set(x for c in COUNTRIES for x in c['pool'])]
print("sin pool:", miss)
