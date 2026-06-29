# -*- coding: utf-8 -*-
# ============================================================
# escenarios_prompts.py — arte de ESCENARIOS y OBJETOS de Costa Rica para
# las casillas/fondos del juego. Dos tipos:
#   transparent=False -> ESCENA con fondo (paisajes, lugares, biomas, mapa)
#   transparent=True  -> OBJETO recortado (frutas, cazadores, tesoros)
# Se generan a assets/escenarios/<slug>.png  (+ _escenarios.json)
# ============================================================

# Estilos por tipo (se anexan al prompt en el generador)
SCENE_STYLE = ("detailed pixel art landscape background, retro 16-bit game scenery, "
               "vibrant colors, no people, no text, no border")
OBJ_STYLE   = ("centered, cute detailed pixel art, clean black outline, soft shading, "
               "vibrant colors, transparent background, single object, no text, no border")

ESCENARIOS = [
    # ---------------- Lugares famosos por provincia (ESCENAS) ----------------
    {"slug": "lugar_sanjose",    "kind": "lugar", "prov": "San José",    "scene": True,
     "prompt": "the National Theater of Costa Rica, grand neoclassical stone building with arches and statues, plaza in front, blue sky"},
    {"slug": "lugar_alajuela",   "kind": "lugar", "prov": "Alajuela",    "scene": True,
     "prompt": "the Arenal volcano of Costa Rica, perfect green cone, lush jungle at the base, blue sky with a wisp of smoke"},
    {"slug": "lugar_cartago",    "kind": "lugar", "prov": "Cartago",     "scene": True,
     "prompt": "the Basilica of Our Lady of the Angels in Cartago Costa Rica, large byzantine church with twin towers, grey and cream stone, plaza"},
    {"slug": "lugar_cartago_irazu","kind": "lugar","prov": "Cartago",    "scene": True,
     "prompt": "the Irazu volcano crater in Costa Rica, turquoise green crater lake, barren grey volcanic ground"},
    {"slug": "lugar_heredia",    "kind": "lugar", "prov": "Heredia",     "scene": True,
     "prompt": "the Braulio Carrillo cloud forest and Barva volcano in Costa Rica, misty green mountains, dense trees, fog"},
    {"slug": "lugar_guanacaste", "kind": "lugar", "prov": "Guanacaste",  "scene": True,
     "prompt": "Guanacaste tropical dry landscape, Rincon de la Vieja volcano in the distance, golden savanna, a lone wide guanacaste tree"},
    {"slug": "lugar_puntarenas", "kind": "lugar", "prov": "Puntarenas",  "scene": True,
     "prompt": "Manuel Antonio beach Costa Rica, white sand cove, turquoise Pacific sea, green jungle cliffs"},
    {"slug": "lugar_limon",      "kind": "lugar", "prov": "Limón",       "scene": True,
     "prompt": "Tortuguero canals on the Caribbean coast of Costa Rica, winding jungle river, tall palm trees, lush green"},
    {"slug": "lugar_monteverde", "kind": "lugar", "prov": "Monteverde",  "scene": True,
     "prompt": "the Monteverde cloud forest of Costa Rica, mystical misty green jungle, a hanging bridge, lush ferns"},

    # ---------------- Biomas genéricos (ESCENAS, fondo de casillas) ----------------
    {"slug": "bioma_bosque",  "kind": "bioma", "scene": True,
     "prompt": "a lush tropical rainforest national park, tall green trees, vines, soft sunbeams, dense jungle"},
    {"slug": "bioma_montana", "kind": "bioma", "scene": True,
     "prompt": "green volcanic mountains with cloud forest, misty layered peaks, tropical highland"},
    {"slug": "bioma_sabana",  "kind": "bioma", "scene": True,
     "prompt": "tropical dry savanna of Guanacaste, golden tall grass, scattered trees, warm afternoon sky"},
    {"slug": "bioma_agua",    "kind": "bioma", "scene": True,
     "prompt": "a calm tropical river mouth meeting turquoise sea, sandy bank, mangroves and a palm"},

    # ---------------- Tesoros / hallazgos (OBJETOS) ----------------
    {"slug": "tesoro_mochila", "kind": "tesoro", "scene": False,
     "prompt": "a worn explorer leather satchel backpack, open with a warm golden glow inside, adventure loot"},
    {"slug": "tesoro_carreta", "kind": "tesoro", "scene": False,
     "prompt": "a traditional Costa Rican painted oxcart wheel (carreta tipica), colorful ornate geometric patterns"},

    # ---------------- Objetos ticos (frutas y cosas) ----------------
    {"slug": "item_pejibaye", "kind": "item", "scene": False,
     "prompt": "a small pile of pejibaye peach palm fruits, glossy orange and red, tropical Costa Rican food"},
    {"slug": "item_mango",    "kind": "item", "scene": False,
     "prompt": "a ripe tropical mango fruit, red and golden yellow skin, a green leaf"},
    {"slug": "item_banano",   "kind": "item", "scene": False,
     "prompt": "a fresh bunch of yellow bananas"},
    {"slug": "item_pina",     "kind": "item", "scene": False,
     "prompt": "a ripe golden pineapple with green crown"},
    {"slug": "item_cacao",    "kind": "item", "scene": False,
     "prompt": "a cacao pod cut open showing white cocoa beans, brown and orange husk"},
    {"slug": "item_cafe",     "kind": "item", "scene": False,
     "prompt": "a coffee plant branch with bright red ripe coffee cherries and green leaves"},
    {"slug": "item_chonete",  "kind": "item", "scene": False,
     "prompt": "a traditional Costa Rican chonete farmer straw hat, blue and white band"},
    {"slug": "item_guaria",   "kind": "item", "scene": False,
     "prompt": "a purple Guaria Morada orchid, the national flower of Costa Rica, delicate petals"},

    # ---------------- Enemigos: cazador y cabecilla (OBJETOS) ----------------
    {"slug": "cazador",   "kind": "enemigo", "scene": False,
     "prompt": "a sneaky poacher hunter character, khaki clothes and cap, holding a capture net over the shoulder, cartoon villain, full body, not graphic"},
    {"slug": "cabecilla", "kind": "enemigo", "scene": False,
     "prompt": "an imposing poacher boss leader, large burly figure, dark vest and wide hat, holding a net and a sack, menacing cartoon villain, full body, not graphic"},

    # ---------------- Mapa de Costa Rica (ESCENA, fondo del juego) ----------------
    {"slug": "mapa_cr", "kind": "mapa", "scene": True,
     "prompt": "a pixel art map of Costa Rica country, green land shape with mountains, blue Pacific and Caribbean seas on the sides, simple clean game map"},

    # ---------------- Íconos de CASILLA del mapa (OBJETOS, van en los nodos) ----------------
    {"slug": "casilla_bosque",   "kind": "casilla_ic", "scene": False,
     "prompt": "a single lush green rainforest tree with a rounded leafy canopy, simple icon, game map tile emblem"},
    {"slug": "casilla_montana",  "kind": "casilla_ic", "scene": False,
     "prompt": "a green volcanic mountain peak with a small white cloud at the top, simple icon, game map tile emblem"},
    {"slug": "casilla_mar",      "kind": "casilla_ic", "scene": False,
     "prompt": "a single curling ocean wave, turquoise water with white foam crest, simple icon, game map tile emblem"},
    {"slug": "casilla_sabana",   "kind": "casilla_ic", "scene": False,
     "prompt": "a lone flat-topped savanna acacia tree on a tuft of golden grass, warm tones, simple icon, game map tile emblem"},
    {"slug": "casilla_traslado", "kind": "casilla_ic", "scene": False,
     "prompt": "two curved arrows forming a circle, a swap and transfer symbol, green and gold, simple icon, game map tile emblem"},
    {"slug": "casilla_hallazgo", "kind": "casilla_ic", "scene": False,
     "prompt": "an open explorer leather satchel with a warm golden glow and a sparkle inside, treasure find, simple icon, game map tile emblem"},
    {"slug": "casilla_refugio",  "kind": "casilla_ic", "scene": False,
     "prompt": "a cozy little ranger refuge: a small wooden cabin with a green leaf flag and a warm campfire glow beside it, safe rest stop, simple icon, game map tile emblem"},
    {"slug": "casilla_salvaje",  "kind": "casilla_ic", "scene": False,
     "prompt": "a single big green animal paw print footprint icon, four toes and a pad, wildlife track emblem, one centered object on a plain empty background"},
]
