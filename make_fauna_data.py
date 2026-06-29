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

# ---- RAREZA por especie (basado en qué tan común es VERLA en CR) ----
# legendario = súper difíciles + 2 habilidades + mejores stats; extinto = aún más
# raro y más fuerte; el resto baja: ultra raro / raro / común (default).
LEGENDARIO = {"jaguar", "puma", "danta", "aguila_harpia", "manati", "quetzal",
              "lapa", "quetzaldorado", "tiburon_ballena"}
EXTINTO = {"sapo_dorado"}
ULTRARARO = {"manigordo", "caucel", "tigrillo", "leon_brenero", "tolomuco", "grison",
             "oso_hormiguero", "serafin", "nutria", "cabro_monte", "mono_arana",
             "tiburon_martillo", "pez_vela", "marlin", "mantarraya", "cocodrilo", "caiman",
             "boa", "matabuey", "coral", "lapa_verde", "pajaro_campana", "espatula",
             "jabiru", "tantalo", "pavon", "tinamu", "momoto", "trogon", "colibri_talamanca"}
RARO = {"venado", "saino", "chancho_monte", "mono_congo", "mono_titi", "tepezcuintle",
        "guatusa", "armadillo", "puercoespin", "zorro_gris", "coyote", "comadreja",
        "tucan_castano", "cusingo", "tucancillo", "oropendola", "colibri_fuego", "ermitano",
        "jacamar", "tangara_dorada", "carpintero", "saltarin", "martin_pescador", "anhinga",
        "chachalaca", "loro", "rana_cristal", "rana_verdinegra", "rana_granular",
        "rana_gladiadora", "salamandra", "cecilia", "garrobo", "bocaraca", "lora", "cascabel",
        "serpiente_mar", "mica", "bejuquilla", "tortuga_baula", "tortuga_carey", "tortuga_lora",
        "tortuga_cabezona", "mariposa_buho", "escarabajo", "fragata", "ibis", "pelicano", "tarantula"}
# segunda habilidad de cada legendario (los únicos con 2); debe diferir de su `ab`.
LEGEND_AB2 = {
    "jaguar": "first", "puma": "first", "danta": "thorns", "aguila_harpia": "first",
    "manati": "heal", "quetzal": "first", "lapa": "first", "quetzaldorado": "shield",
    "tiburon_ballena": "heal",
}

# ---- STARTERS básicos (siempre se eligen al inicio; NO son fauna silvestre) ----
# def (defensa) neutral/baja: son equilibrados, sin destacar en aguante.
STARTERS = {
    "perro":    {"n": "Perro", "e": "🐕", "atk": 3, "hp": 4, "spd": 4, "hab": 3, "def": 2, "bio": "bosque", "ab": "shield", "starter": True},
    "gato":     {"n": "Gato", "e": "🐈", "atk": 3, "hp": 3, "spd": 5, "hab": 4, "def": 1, "bio": "bosque", "ab": "first", "starter": True},
    "comemaiz": {"n": "Comemaíz", "e": "🐦", "atk": 3, "hp": 4, "spd": 4, "hab": 3, "def": 2, "bio": "sabana", "ab": "heal", "starter": True},
}

# ---- FOLCLOR (EASTER EGG): los 6 seres de la leyenda tica. NO son fauna: pelean
# ellos mismos como si fueran los animales. Tienen 3 HABILIDADES (ab/ab2/ab3) y
# MUCHA vida — un reto real. Rareza "mítico", bioma "noche", excluidos de los pools
# (solo aparecen en el mapa secreto Tenebroso). Arte en assets/folclor/<key>.png.
# `acts` = ataques por ronda (clave para que UN ser sea un reto contra TUS 5): así
# amenaza a todo el equipo. Escala con la dificultad (La Carreta, la final, pega 4 veces).
FOLCLOR = {
    "f_segua":     {"n": "La Segua", "e": "🐴", "atk": 6, "hp": 17, "spd": 8, "hab": 5, "def": 4, "acts": 2, "bio": "noche", "ab": "first",  "ab2": "rage",   "ab3": "poison", "rarity": "mitico", "folk": True},
    "f_cadejos":   {"n": "El Cadejos", "e": "🐕", "atk": 8, "hp": 16, "spd": 7, "hab": 3, "def": 5, "acts": 2, "bio": "noche", "ab": "rage",   "ab2": "first",  "ab3": "thorns", "rarity": "mitico", "folk": True},
    "f_llorona":   {"n": "La Llorona", "e": "😱", "atk": 5, "hp": 21, "spd": 5, "hab": 4, "def": 5, "acts": 2, "bio": "noche", "ab": "poison", "ab2": "heal",   "ab3": "shield", "rarity": "mitico", "folk": True},
    "f_tulevieja": {"n": "La Tulevieja", "e": "🦇", "atk": 7, "hp": 17, "spd": 6, "hab": 6, "def": 4, "acts": 2, "bio": "noche", "ab": "poison", "ab2": "first",  "ab3": "thorns", "rarity": "mitico", "folk": True},
    "f_padre":     {"n": "El Padre sin Cabeza", "e": "⛪", "atk": 6, "hp": 23, "spd": 3, "hab": 2, "def": 7, "acts": 2, "bio": "noche", "ab": "shield", "ab2": "rage",   "ab3": "heal",   "rarity": "mitico", "folk": True},
    "f_carreta":   {"n": "La Carreta sin Bueyes", "e": "🛒", "atk": 7, "hp": 25, "spd": 2, "hab": 1, "def": 7, "acts": 3, "bio": "noche", "ab": "thorns", "ab2": "shield", "ab3": "rage",   "rarity": "mitico", "folk": True},
}

# ---- 1) Los 27 actuales, PRESERVADOS exactos (incluye legendarios) ----
EXISTING = {
    "perezoso":  dict(n="Perezoso", e="🦥", atk=1, hp=7, spd=1, hab=0, bio="bosque", ab="shield"),
    "monocara":  dict(n="Mono carablanca", e="🐒", atk=2, hp=3, spd=8, hab=6, bio="bosque", ab="first"),
    "tucan":     dict(n="Tucán", e="🦜", atk=2, hp=3, spd=8, hab=5, bio="bosque", ab="first"),
    "ranadardo": dict(n="Rana dardo", e="🐸", atk=4, hp=1, spd=4, hab=4, bio="bosque", ab="poison"),
    "serpiente": dict(n="Terciopelo", e="🐍", atk=5, hp=2, spd=6, hab=3, bio="bosque", ab="poison"),
    "jaguar":    dict(n="Jaguar", e="🐆", atk=5, hp=4, spd=7, hab=4, bio="bosque", ab="rage"),
    "manigordo": dict(n="Manigordo", e="🐈", atk=3, hp=3, spd=8, hab=6, bio="bosque", ab="first"),
    "pizote":    dict(n="Pizote", e="🦝", atk=3, hp=4, spd=5, hab=3, bio="bosque", ab="heal"),
    "murcielago":dict(n="Murciélago", e="🦇", atk=3, hp=2, spd=8, hab=7, bio="bosque", ab="first"),
    "mariposa":  dict(n="Morfo azul", e="🦋", atk=2, hp=2, spd=7, hab=7, bio="bosque", ab="first"),
    "abeja":     dict(n="Abeja", e="🐝", atk=3, hp=1, spd=7, hab=6, bio="bosque", ab="poison"),
    "quetzal":   dict(n="Quetzal", e="🐦", atk=2, hp=4, spd=7, hab=5, bio="montana", ab="heal"),
    "puma":      dict(n="Puma", e="🐆", atk=5, hp=5, spd=7, hab=4, bio="montana", ab="rage"),
    "coyote":    dict(n="Coyote", e="🐺", atk=4, hp=3, spd=7, hab=4, bio="montana", ab="rage"),
    "venado":    dict(n="Venado", e="🦌", atk=2, hp=6, spd=7, hab=5, bio="sabana", ab="shield"),
    "saino":     dict(n="Saíno", e="🐗", atk=4, hp=5, spd=4, hab=2, bio="sabana", ab="rage"),
    "iguana":    dict(n="Iguana", e="🦎", atk=2, hp=5, spd=4, hab=2, bio="sabana", ab="thorns"),
    "garza":     dict(n="Garza", e="🐦", atk=2, hp=3, spd=6, hab=4, bio="sabana", ab="first"),
    "cocodrilo": dict(n="Cocodrilo", e="🐊", atk=5, hp=6, spd=3, hab=1, bio="agua", ab="rage"),
    "tortuga":   dict(n="Tortuga verde", e="🐢", atk=1, hp=8, spd=1, hab=0, bio="agua", ab="shield"),
    "ballena":   dict(n="Ballena jorobada", e="🐋", atk=6, hp=8, spd=3, hab=1, bio="agua", ab="rage"),
    "delfin":    dict(n="Delfín", e="🐬", atk=3, hp=3, spd=8, hab=6, bio="agua", ab="heal"),
    "tiburon":   dict(n="Tiburón", e="🦈", atk=6, hp=4, spd=6, hab=3, bio="agua", ab="rage"),
    "cangrejo":  dict(n="Cangrejo", e="🦀", atk=2, hp=5, spd=3, hab=1, bio="agua", ab="thorns"),
    "basilisco": dict(n="Basilisco", e="🦎", atk=3, hp=3, spd=8, hab=6, bio="agua", ab="first"),
    "lapa":      dict(n="Lapa roja", e="🦜", atk=5, hp=6, spd=6, hab=4, bio="bosque", ab="rage", leg=True),
    "quetzaldorado": dict(n="Quetzal Dorado", e="🐦", atk=4, hp=9, spd=8, hab=6, bio="montana", ab="heal", leg=True),
    "tarantula":     dict(n="Tarántula", e="🕷️", atk=4, hp=3, spd=5, hab=4, bio="bosque", ab="poison"),
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
          "armadillo", "danta", "manati", "tiburon_ballena", "tepezcuintle", "perezoso_dos"}
PUAS   = {"garrobo", "puercoespin", "escarabajo", "anolis", "basilisco_comun"}
# Regenerar (cura aliados): solo los temáticos — la salamandra regenera de verdad;
# el kinkajú (martilla) como apoyo social. El resto pasa a su habilidad por defecto.
REGEN  = {"salamandra", "martilla"}
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

# (atk, hp, spd, hab, def) — los ágiles (fast) tienen poco atk/hp pero mucha
# habilidad; los TANK aguantan (mucha def) y los GLASS pegan pero no resisten (def 0).
# def (DEFENSA): resta daño a cada golpe que reciben (mínimo 1) — los tanques/escudo
# se vuelven duros de verdad, los frágiles caen rápido.
ROLE_BASE = {
    "tank":     (2, 8, 2, 1, 4),
    "glass":    (5, 1, 5, 4, 0),
    "fast":     (2, 3, 8, 7, 1),
    "predator": (5, 5, 6, 3, 2),
    "balanced": (3, 4, 5, 2, 2),
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
    # 1) overrides temáticos (mandan siempre)
    if slug in VENENO: return "poison"
    if slug in ESCUDO: return "shield"
    if slug in PUAS: return "thorns"
    if slug in REGEN: return "heal"
    if slug in FURIA: return "rage"
    # 2) por ROL — antes TODO caía en 'first' (53% del roster). Ahora cada
    #    arquetipo tira a una habilidad coherente y los 'balanced' se reparten
    #    parejo entre las 6, para que 'primer golpe' deje de dominar.
    role = role_of(slug)
    if role == "predator": return "rage"                       # depredadores: furia
    if role == "tank":     return "shield"                     # pesados: escudo
    if role == "glass":    return "poison"                     # frágiles tóxicos: ranas/insectos
    # fast + balanced → SOLO se reparten entre first/furia/regenera, que le quedan
    # bien a cualquier bicho (ágil / fiero / que apoya). NO repartimos veneno/púas/
    # escudo al azar (quedan temáticos) para no ponerle 'veneno' a una nutria.
    if role == "fast":                                         # ágiles: tiran a primer golpe
        return ("first", "first", "heal")[jitter(slug + "fa", 0, 2)]
    return ("first", "rage", "heal", "rage", "first")[jitter(slug + "ba", 0, 4)]


def stats_of(slug):
    a, h, s, hb, df = ROLE_BASE[role_of(slug)]
    # jitter suave (±1) para variedad, sin romper el arquetipo
    j = jitter(slug, 0, 2) - 1
    a = max(1, min(6, a + j))
    h = max(1, min(9, h + (jitter(slug + "h", 0, 2) - 1)))
    s = max(1, min(8, s + (jitter(slug + "s", 0, 2) - 1)))
    hb = max(0, min(8, hb + (jitter(slug + "b", 0, 2) - 1)))
    df = max(0, min(6, df + jitter(slug + "d", 0, 1)))   # +0/+1 (no baja del arquetipo)
    return a, h, s, hb, df


# DEFENSA por defecto para especies que NO pasan por stats_of (las 28 curadas a
# mano + starters). Parte del rol; ESCUDO/PÚAS suben (encajan en defensa) y los
# muy panzudos (hp alto) aguantan un poco más.
def base_def(slug, rec):
    base = {"tank": 4, "glass": 0, "fast": 1, "predator": 2, "balanced": 2}[role_of(slug)]
    ab = rec.get("ab")
    if ab == "shield": base += 2
    elif ab == "thorns": base += 1
    if rec.get("hp", 0) >= 8: base += 1
    return max(0, min(6, base))


# ---- 4) Construir SP ----
SP = {}
for e in BESTIARIO:
    slug = e["slug"]
    if slug in EXISTING:
        SP[slug] = dict(EXISTING[slug]); continue
    a, h, s, hb, df = stats_of(slug)
    rec = dict(n=e["name"], e=EMOJI.get(e["cat"], "🐾"),
               atk=a, hp=h, spd=s, hab=hb, bio=BIOME.get(slug, "bosque"), ab=ability_of(slug))
    rec["def"] = df
    if e.get("ext"): rec["ext"] = True
    SP[slug] = rec
# extras que no están en el bestiario pero sí en el juego (con art propio)
for slug in ("abeja", "cangrejo", "tiburon", "quetzaldorado", "tarantula"):
    if slug not in SP:
        SP[slug] = dict(EXISTING[slug])
# starters básicos (perro/gato/comemaíz)
for slug, rec in STARTERS.items():
    SP[slug] = dict(rec)
# seres del folclor (easter egg) — combatientes especiales con 3 habilidades
for slug, rec in FOLCLOR.items():
    SP[slug] = dict(rec)

# DEFENSA para todo el que no la tenga (las 28 curadas + extras) — por rol/ability.
for slug, rec in SP.items():
    if "def" not in rec:
        rec["def"] = base_def(slug, rec)

# ---- post-proceso: RAREZA, legendarios (2 habilidades + boost) y extintos ----
for slug, rec in SP.items():
    if rec.get("starter"):
        rec["rarity"] = "comun"; continue
    if rec.get("folk"):
        rec["rarity"] = "mitico"; continue   # ya trae sus 3 habilidades y stats
    if slug in EXTINTO:
        # EXTINTO: el más raro y MUY superior — el premio gordo.
        rec["rarity"] = "extinto"; rec["ext"] = True; rec.pop("leg", None)
        rec["atk"] = min(15, rec["atk"] + 6); rec["hp"] = min(24, rec["hp"] + 12)
        rec["def"] = min(10, rec.get("def", 0) + 4); rec["hab"] = min(9, rec.get("hab", 0) + 2)
    elif slug in LEGENDARIO:
        # LEGENDARIO: que se NOTE — stats bastante por encima + sus 2 habilidades.
        rec["rarity"] = "legendario"; rec["leg"] = True
        rec["atk"] = min(12, rec["atk"] + 3); rec["hp"] = min(18, rec["hp"] + 7)
        rec["def"] = min(9, rec.get("def", 0) + 2); rec["hab"] = min(9, rec.get("hab", 0) + 2)
        ab2 = LEGEND_AB2.get(slug)
        if ab2 and ab2 != rec["ab"]:
            rec["ab2"] = ab2
    else:
        rec["rarity"] = ("ultrararo" if slug in ULTRARARO else "raro" if slug in RARO else "comun")
        rec.pop("leg", None)

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
# Pools = TODA la fauna silvestre (incluye legendarios y extintos, que ahora son
# ENCONTRABLES en el bioma pero con tasa bajísima — el peso por rareza lo decide
# el motor). Se excluyen solo los STARTERS (perro/gato/comemaíz).
wild = [k for k, v in SP.items() if not v.get("starter") and not v.get("folk")]
by_biome = {}
for k in wild:
    by_biome.setdefault(SP[k]["bio"], []).append(k)
for b in by_biome:
    by_biome[b].sort()

# Reparto BALANCEADO: cada especie va a la provincia elegible (por bioma) que
# esté menos llena → pools parejos y cobertura total garantizada.
prov_biomes = [biomes for (_, _, biomes) in PROV]
pools = [[] for _ in PROV]
for k in sorted(wild):
    bio = SP[k]["bio"]
    eligible = [i for i, bs in enumerate(prov_biomes) if bio in bs] or list(range(len(PROV)))
    i = min(eligible, key=lambda i: (len(pools[i]), i))
    pools[i].append(k)
# íconos repetidos en 1 provincia extra, para que aparezcan en más de un lado
for k in ("jaguar", "perezoso", "tortuga", "cocodrilo", "tucan", "quetzal", "iguana"):
    if k in wild:
        bio = SP[k]["bio"]
        elig = [i for i, bs in enumerate(prov_biomes) if bio in bs and k not in pools[i]]
        if elig:
            j = min(elig, key=lambda i: (len(pools[i]), i)); pools[j].append(k)

COUNTRIES = []
for i, (flag, name, biomes) in enumerate(PROV):
    COUNTRIES.append({"flag": flag, "n": name, "map": "costa-rica", "pool": pools[i]})

# Monteverde (final): bosque nuboso. Asegurá el Quetzal Dorado en su pool.
mv = [k for k in by_biome.get("montana", []) + by_biome.get("bosque", [])][:16]
if "quetzaldorado" not in mv:
    mv.append("quetzaldorado")
SECRET = {"flag": "☁️", "n": "Monteverde", "map": "costa-rica", "secret": True, "pool": mv}


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
out.append(f"// {len(SP)} especies (con rareza; legendarios con 2 habilidades; + starters)")
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
           f"map:{json.dumps(SECRET['map'])}, secret:true,")
out.append(f"  pool:[{', '.join(json.dumps(k) for k in SECRET['pool'])}],")
out.append("};")
out.append("")

(ROOT / "src" / "fauna_roster.js").write_text("\n".join(out), encoding="utf-8")
import collections
rar = collections.Counter(v.get("rarity") for v in SP.values())
print(f"OK src/fauna_roster.js  SP={len(SP)}  rarezas={dict(rar)}")
legs = [k for k, v in SP.items() if v.get("rarity") == "legendario"]
print("legendarios:", legs)
print("con 2 habilidades:", [k for k, v in SP.items() if v.get("ab2")])
print("starters:", [k for k, v in SP.items() if v.get("starter")])
# chequeo: toda especie silvestre está en algún pool
miss = [k for k in wild if k not in set(x for c in COUNTRIES for x in c['pool'])]
print("sin pool:", miss)
