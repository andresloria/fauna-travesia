# -*- coding: utf-8 -*-
# ============================================================
# make_habilidades_doc.py — KITS OFICIALES desde los documentos de Andrés
# (fauna-travesia-habilidades.json / Fauna-Travesia_Ataques_final.xlsx).
#
# El documento trae 722 habilidades de 100 animales, portadas 1:1 de los
# personajes de Naruto-Arena (4 habilidades por personaje). Este script:
#   1. agrupa por (animal, personaje, categoria) -> kits de 4
#   2. traduce el chakra del original a nuestros 4 biomas
#   3. traduce la "mecanica" estructurada a los efectos de src/arena.js
#   4. escribe src/movesets_doc.js  (kits) y REPORTE_HABILIDADES.md (qué quedó
#      fuera, qué animales faltan crear)
#
# ⚠️ La descripción que ve el jugador se GENERA desde los efectos que de verdad
# quedaron implementados — nunca desde el texto del documento. Así el texto no
# puede prometer algo que el motor no hace. Lo que no se pudo implementar sale
# listado en el reporte, no escondido en una descripción bonita.
#
# Re-correr:  python make_habilidades_doc.py
# Fuente:     ORIGEN (abajo). Si movés el .json, cambiá esa ruta.
# ============================================================
import json, re, unicodedata, collections, pathlib, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

AQUI   = pathlib.Path(__file__).parent
ORIGEN = pathlib.Path(r"C:\Users\Andres\Downloads\fauna-travesia-habilidades.json")
SALIDA = AQUI / "src" / "movesets_doc.js"
REPORTE = AQUI / "REPORTE_HABILIDADES.md"

# ------------------------------------------------------------------
# 1. Chakra del original -> biomas nuestros
#    (el documento dice "sin cambios", así que el mapeo es fijo y 1:1)
# ------------------------------------------------------------------
CHAKRA = {
    'taijutsu':  'bosque',    # cuerpo/fuerza      -> 🌳
    'ninjutsu':  'agua',      # técnica/elemento   -> 🌊
    'bloodline': 'montana',   # linaje/instinto    -> ⛰
    'genjutsu':  'sabana',    # mente/ilusión      -> 🌾
    'random':    'comodin',   # cualquiera         -> ⚪
}

# clases del original -> las nuestras (src/habilidades.js CLASES)
CLASES = {
    'Physical': 'fisico', 'Chakra': 'natural', 'Mental': 'instinto',
    'Melee': 'melee', 'Ranged': 'rango', 'Bane': 'toxina',
}
# estas no son "clases" sino propiedades de la habilidad
BYPASS  = {'Bypassing', 'Uncounterable', 'Unreflectable'}
NO_CLASE = {'Invisible', 'Nonstacking', 'Unremovable', 'Summon', 'Soulbound',
            'Resource', 'Atemporal', 'Necromancy'}

OBJETIVO = {
    'a un enemigo': 'enemigo',
    'a todos los enemigos': 'todos',
    'a los aliados': 'equipo',
    'a un aliado': 'aliado',
    'a sí mismo o a un aliado': 'aliado',
    '': 'self',
}

# ATURDIR: en el original el aturdimiento es POR CLASE ("no puede usar sus
# habilidades físicas"). Medido el 22-jul, eso salía carísimo y no ganaba
# combates: el fondo de la tabla tenía 9x más control que el top, porque
# gastar una habilidad entera en bloquear UNA clase casi nunca corta la jugada
# del rival. Decisión de Andrés: **todo aturdimiento aturde COMPLETO**.
# El detalle de clases queda acá por si hay que volver atrás (`POR_CLASE=True`).
POR_CLASE = False
ATURDE_CLASES = {
    'todas': [None],
    'físicas y de chakra': ['fisico', 'natural'],
    'físicas y mentales': ['fisico', 'instinto'],
    'físicas y de cuerpo a cuerpo': ['fisico', 'melee'],
    'de chakra y mentales': ['natural', 'instinto'],
    'de cuerpo a cuerpo': ['melee'],
    'de chakra': ['natural'],
    'mentales': ['instinto'],
    'físicas': ['fisico'],
}

# ------------------------------------------------------------------
# 2. Qué animal del documento es cuál del roster
#    None = todavía no existe en el juego (hay que crearle sprite y ficha)
# ------------------------------------------------------------------
MAPA = {
    'Rana de vidrio': 'rana_cristal', 'Terciopelo': 'serpiente', 'Sapo marino': 'sapo_marino',
    'Mono tití': 'mono_titi', 'Zorro gris': 'zorro_gris', 'Boa': 'boa', 'Coyote': 'coyote',
    'Colibrí garganta de fuego': 'colibri_fuego', 'Basilisco': 'basilisco',
    'Escarabajo Hércules': 'escarabajo', 'Armadillo': 'armadillo', 'Puercoespín': 'puercoespin',
    'Sapo dorado': 'sapo_dorado', 'Mono congo (Aullador)': 'mono_congo',
    'Manigordo (Ocelote)': 'manigordo', 'Puma': 'puma', 'Coral': 'coral',
    'Mariposa búho': 'mariposa_buho', 'Mono araña': 'mono_arana', 'Cascabel': 'cascabel',
    'Lechuza': 'lechuza', 'Jaguar': 'jaguar', 'Águila harpía': 'aguila_harpia',
    'Jaguarundi': 'leon_brenero', 'Rana dardo verdinegra': 'rana_verdinegra',
    'Chancho de monte': 'chancho_monte', 'Mantarraya': 'mantarraya',
    'Salamandra': 'salamandra', 'Tiburón martillo': 'tiburon_martillo',
    'Tapir (Danta)': 'danta', 'Delfín nariz de botella': 'delfin',
    'Cocodrilo americano': 'cocodrilo', 'Mariposa morpho': 'mariposa',
    'Cangrejo terrestre': 'cangrejo', 'Colibrí': 'colibri_talamanca', 'Toboba': 'bocaraca',
    # Salamanqueja y Geco son el mismo bicho: el kit de "Geco" manda (es el
    # nombre de la especie en el roster) y el de Salamanqueja queda de variante.
    'Geco': 'geco', 'Salamanqueja': None,
}
# ------------------------------------------------------------------
# 2b. REASIGNACIÓN (pedido de Andrés, 21-jul): el documento trae 179 kits
#     completos y el juego solo usaba 37 — el resto del roster quedaba con
#     plantillas repetidas. Los kits de animales SIN sprite se reasignan a
#     especies que SÍ tienen sprite, elegidos por afinidad (el grupo del
#     animal del documento, la personalidad del personaje original, o el
#     papel del bicho en el ecosistema). Cada kit se usa UNA sola vez; el
#     generador revienta si dos especies terminan con el mismo.
#     key del roster -> (animal del documento, personaje original)
# ------------------------------------------------------------------
ASIGNADOS = {
    # ---- mamíferos ----
    'perezoso':          ('Pez globo', 'Chōza Akimichi'),            # grandote lento y tanque
    'perezoso_dos':      ('Garrapata', 'Yoroi Akadō'),               # drena despacio
    'monocara':          ('Mono tití', 'Konohamaru Sarutobi'),       # mono juguetón (2º kit)
    'caucel':            ('Coyote', 'Kiba Inuzuka'),                 # felino feral
    'tigrillo':          ('Coyote', 'Kakashi Hatake'),               # gato sigiloso
    'saino':             ('Escarabajo rinoceronte', 'Jirōbō'),       # embestida maciza
    'venado':            ('Araña de seda dorada', 'Shikamaru Nara'), # ¡el clan Nara cría VENADOS!
    'cabro_monte':       ('Mantis orquídea', 'Rock Lee'),            # patadas y salto
    'pizote':            ('Ratonera', 'Misumi Tsurugi'),             # flexible y ladrón
    'mapache':           ('Hormiga león', 'Gaara'),                  # ¡Shukaku ES un mapache-tanuki!
    'mapache_cangrejero':('Hormiga león', 'Rehabilitated Gaara'),    # el hermano de arriba
    'martilla':          ('Salamanqueja', 'Hayate Gekkō'),           # nocturno y veloz
    'olingo':            ('Murciélago pescador', 'C'),               # sensor nocturno
    'tolomuco':          ('Tiburón punta blanca', 'Darui'),          # tranquilo pero letal
    'grison':            ('Cangrejo ermitaño', 'Atsui'),             # tejón fogoso
    'nutria':            ('Sábalo', 'Suigetsu Hōzuki'),              # cuerpo de agua, juguetón
    'comadreja':         ('Murciélago vampiro', 'Karin'),            # muerde y se cura
    'zorro_pelon':       ('Zorro gris', 'Naruto Uzumaki'),           # el zorro del zorro
    'oso_hormiguero':    ('Camarón mantis', 'Asura Path Pain'),      # brazos demoledores
    'serafin':           ('Luciérnaga', 'Fukasaku and Shima'),       # chiquitito y sabio
    'tepezcuintle':      ('Sapo común', 'Dodai'),                    # tanque de goma
    'guatusa':           ('Saltamontes', 'Kin Tsuchi'),              # nerviosa, campanillas
    'ardilla':           ('Grillo', 'Dosu Kinuta'),                  # parlanchina resonante
    'murcielago':        ('Murciélago narigudo', 'Inoichi Yamanaka'),# ecolocación = leer mentes
    'manati':            ('Babosa gigante', 'Tsunade'),              # gigante gentil que cura
    'ballena':           ('Pulpo', 'Killer B'),                      # B rapea, la ballena canta
    # ---- aves ----
    'yiguirro':          ('Cigarra', 'Tayuya'),                      # el cantor nacional, flauta
    'quetzal':           ('Urraca copetona', 'Itachi Uchiha'),       # el ave elegante, cuervos
    'quetzaldorado':     ('Sapo dorado', 'Sage Mode Naruto'),        # DORADO modo sabio (mítico)
    'lapa':              ('Hormiga de fuego', 'Pakura'),             # roja fuego
    'lapa_verde':        ('Hormiga de fuego', 'Torune Aburame'),     # la pareja verde
    'tucan':             ('Escarabajo bombardero', 'Deidara'),       # artista explosivo
    'tucan_castano':     ('Escarabajo bombardero', 'Gari'),          # familia bombardera
    'tucancillo':        ('Escarabajo joya', 'Ginkaku'),             # tucancito joya
    'cusingo':           ('Escarabajo bombardero', 'Jinpachi Munashi'),
    'pajaro_campana':    ('Elanio', 'Temari'),                       # el CAMPANAZO = ondas de viento
    'oropendola':        ('Araña de seda dorada', 'Maki'),           # teje nidos = telas
    'ermitano':          ('Colibrí', 'Hinata Hyūga'),                # colibrí para el colibrí
    'jacamar':           ('Pez aguja', 'Kushimaru Kuriarare'),       # pico-aguja
    'momoto':            ('Mochuelo', 'Hanabi Hyūga'),               # péndulo de precisión
    'tangara_azul':      ('Avispa alfarera', 'Fū Yamanaka'),
    'tangara_dorada':    ('Escarabajo Hércules', 'Kinkaku'),         # el hermano DORADO
    'bienteveo':         ('Gavilán blanco', 'Baki'),                 # cuchillas de viento
    'garza':             ('Raya látigo', 'Haku'),                    # blanca, elegante, espejos
    'espatula':          ('Raya látigo', 'Haku'),                    # (la 2ª copia del kit)
    'jabiru':            ('Langosta', 'Jinin Akebino'),              # golpe contundente
    'tantalo':           ('Pez sapo', 'Gengetsu Hōzuki'),            # espejismo del pantano
    'ibis':              ('Estrella de mar', 'Hidan'),               # el ave ritual
    'pelicano':          ('Armadillo', 'Chōji Akimichi'),            # el buche expansivo
    'fragata':           ('Halcón peregrino', 'Minato Namikaze'),    # el más veloz del cielo
    'caracara':          ('Águila solitaria', 'Nagato'),
    'zopilote_negro':    ('Zopilote rey', 'Ibiki Morino'),           # zope interrogador
    'zopilote_rojo':     ('Garrapata', 'Preta Path Pain'),           # absorbe carroña
    'carpintero':        ('Viuda negra', 'Puppet Master Kankurō'),   # trabaja la madera
    'saltarin':          ('Mantis orquídea', 'Drunken Lee'),         # ¡el que BAILA!
    'trogon':            ('Búho de anteojos', 'Neji Hyūga'),         # porte sereno
    'martin_pescador':   ('Barracuda', 'Chōjūrō'),                   # zambullida precisa
    'anhinga':           ('Barracuda', 'Ameyuri Ringo'),             # pico-espada relámpago
    'tinamu':            ('Estucurú', 'Hiashi Hyūga'),               # el mayor discreto
    'chachalaca':        ('Chinche asesina', 'Sakon and Ukon'),      # el dúo escandaloso
    'loro':              ('Calamar', 'Sai'),                         # imita = copia con tinta
    # ---- anfibios y reptiles ----
    'rana_ojos_rojos':   ('Sapo dorado', 'Sage Mode Jiraiya'),       # la rana ícono, sabia
    'ranadardo':         ('Sapo marino', 'Kurotsuchi'),              # corrosiva
    'rana_lechera':      ('Tortuga candado', 'Izumo and Kotetsu'),   # ¡jarabe pegajoso!
    'rana_tungara':      ('Camarón pistola', 'Utakata'),             # ¡nido de BURBUJAS!
    'rana_gladiadora':   ('Puma', 'A'),                              # la gladiadora, pura fuerza
    'rana_payaso':       ('Mantis religiosa', 'Omoi'),               # el dramático
    'iguana':            ('Escorpión de corteza', 'Rasa'),           # polvo de oro al sol
    'garrobo':           ('Escorpión de corteza', 'Shukaku Gaara'),  # bestia de arena
    'anolis':            ('Avispa esmeralda', 'Ino Yamanaka'),       # despliegue que encanta
    'caiman':            ('Morena', 'Zabuza Momochi'),               # asesino silencioso del agua
    'lora':              ('Cascabel muda', 'Orochimaru'),            # la serpiente del sannin
    'matabuey':          ('Cascabel muda', 'White Snake Orochimaru'),# la víbora mayor
    'serpiente_mar':     ('Raya redonda', 'Shigure'),                # agujas de lluvia
    'mica':              ('Boa', 'Yamato'),                          # constrictora + madera
    'bejuquilla':        ('Tapir (Danta)', 'Hashirama Senju'),       # ¡bejuco = estilo madera!
    # ---- tortugas ----
    'tortuga':           ('Armadillo zopilote', 'Ittan'),            # murallas de tierra
    'tortuga_baula':     ('Ciempiés gigante', 'Kakuzu'),             # la anciana indestructible
    'tortuga_carey':     ('Alacrán', 'Sasori'),                      # su caparazón es arte
    'tortuga_lora':      ('Hormiga león', 'Kazekage Gaara'),         # anida en la ARENA
    'tortuga_cabezona':  ('Hormiga león', 'Regimental Commander Gaara'),
    'jicotea':           ('Mantis religiosa', 'Might Guy'),          # ¡la invocación de Guy ES una tortuga!
    # ---- marinos ----
    'tiburon':           ('Tiburón toro', 'Kisame Hoshigaki'),       # el kit de tiburón al tiburón
    'tiburon_ballena':   ('Pulpo', 'Eight-Tailed B'),                # el gigante tentaculado
    'pez_vela':          ('Halcón peregrino', 'Yondaime Minato'),    # el pez más RÁPIDO del mar
    'marlin':            ('Halcón peregrino', 'Sasuke Uchiha'),      # la espada del mar
    # ---- invertebrados ----
    'mariposa_julia':    ('Libélula', 'Ōnoki'),                      # vuelo que levita
    'hormiga_bala':      ('Hormiga guerrera', 'Animal Path Pain'),   # la hormiga a la hormiga
    'abeja':             ('Avispa parasitoide', 'Shino Aburame'),    # el amo de los bichos
    'tarantula':         ('Araña banana', 'Kidōmaru'),               # la araña a la araña
    # ---- básicos ----
    'perro':             ('Coyote', 'Kiba Inuzuka'),                 # ¡EL kit del perro! (2ª copia)
    'gato':              ('Mono araña', 'Asuma Sarutobi'),           # garras de chakra
    'comemaiz':          ('Zorro gris', 'Naruto Uzumaki'),           # el del montón que sorprende (2ª copia)
    # ---- leyendas del folclor (kits de jefes de nivel S) ----
    'f_cadejos':         ('Zorro gris', 'One-Tailed Naruto'),        # el perro demonio, manto de bestia
    'f_segua':           ('Zorro gris', 'Nine-Tailed Naruto'),       # la transformación monstruosa
    'f_llorona':         ('Boa', 'Naraka Path Pain'),                # el reino de los muertos, el río
    'f_tulevieja':       ('Mariposa morpho', 'Konan of the Rain'),   # ¡el ave bruja de la LLUVIA!
    'f_padre':           ('Chinche asesina', 'Human Path Pain'),     # arranca almas
    'f_carreta':         ('Terciopelo', 'Reanimator Kabuto'),        # levanta a los muertos
}

# ------------------------------------------------------------------
# 3. Traducción de una habilidad del documento -> habilidad del motor
# ------------------------------------------------------------------
def costo_de(c):
    """{'taijutsu':1,...} -> ['bosque', ...] en orden estable."""
    out = []
    for k in ('taijutsu', 'bloodline', 'ninjutsu', 'genjutsu', 'random'):
        out += [CHAKRA[k]] * int(c.get(k) or 0)
    return out


def clases_de(lista):
    cl, bypass = [], False
    for c in lista:
        if c in BYPASS:
            bypass = True
        elif c in CLASES and CLASES[c] not in cl:
            cl.append(CLASES[c])
        elif c in NO_CLASE:
            pass
    return cl, bypass


def turnos_en(efecto_en, defecto=2):
    """Cuántos turnos dura, sacado del efecto completo en inglés.

    Varios campos del documento traen el valor pero NO la duración (36
    reducciones de daño, y solo 7 dicen cuántos turnos). Poner 1 por defecto
    dejaba habilidades de recarga 5 que protegían un solo turno — inservibles.
    El texto en inglés SÍ lo dice ("for 4 turns"), que además es la fuente
    autoritativa según la leyenda del Excel, así que se lee de ahí.
    """
    m = re.search(r'[Ff]or (\d+) turns?', efecto_en or '')
    return int(m.group(1)) if m else defecto


def efectos_de(m, bypass, efecto_en=''):
    """mecanica del documento -> efectos de arena.js. Devuelve (efectos, faltantes)."""
    efs, falta = [], []
    obj = OBJETIVO.get(m.get('objetivo') or '', 'enemigo')
    objp = obj if obj in ('enemigo', 'todos') else 'enemigo'   # a quién se le pega
    objs = obj if obj in ('aliado', 'equipo', 'self') else 'self'  # a quién se le da

    for d in (m.get('danos') or []):
        e = {'t': 'dano', 'v': d['valor'], 'obj': objp}
        if d['tipo'] == 'piercing':
            e['ignoraDefensa'] = True
        if d['tipo'] == 'affliction':
            e['toxina'] = True            # atraviesa invulnerabilidad y reducción
        if bypass:
            e['ignoraInvulnerable'] = True
        efs.append(e)

    if m.get('afliccion'):
        efs.append({'t': 'danoTurnos', 'v': m['afliccion'],
                    'turnos': m.get('afliccion_turnos') or turnos_en(efecto_en), 'obj': objp})

    if m.get('aturde'):
        clases = ATURDE_CLASES.get(m['aturde'], [None]) if POR_CLASE else [None]
        for cl in clases:
            e = {'t': 'aturdir', 'turnos': m.get('aturde_turnos') or 1, 'obj': objp}
            if cl:
                e['clase'] = cl
            efs.append(e)

    if m.get('cura'):
        efs.append({'t': 'curar', 'v': m['cura'], 'obj': objs})
    if m.get('cura_turnos'):
        efs.append({'t': 'curarTurnos', 'v': m['cura_turnos'],
                    'turnos': turnos_en(efecto_en, 3), 'obj': objs})
    if m.get('cura_efectos'):
        efs.append({'t': 'limpiar', 'obj': objs})

    if m.get('defensa_destructible'):
        e = {'t': 'defensa', 'v': m['defensa_destructible'], 'obj': objs}
        if m.get('def_permanente'):
            e['permanente'] = True
        efs.append(e)
    elif m.get('def_permanente'):
        falta.append('defensa permanente sin valor')

    if m.get('reduccion'):
        efs.append({'t': 'reducir', 'v': m['reduccion'],
                    'turnos': m.get('reduccion_turnos') or turnos_en(efecto_en), 'obj': objs})

    if m.get('invulnerable'):
        efs.append({'t': 'invulnerable', 'turnos': 1, 'obj': objs})
        if m.get('invuln_clases'):
            falta.append(f"invulnerable solo a {m['invuln_clases']}")

    if m.get('bono'):
        efs.append({'t': 'amplificar', 'v': m['bono']['valor'], 'turnos': 2, 'obj': 'self'})

    if m.get('contraataque'):
        efs.append({'t': 'contraataque', 'v': 25, 'obj': 'self'})

    if m.get('impide_defensa'):
        efs.append({'t': 'exponer', 'turnos': m['impide_defensa'], 'obj': objp})

    if m.get('gana_chakra'):
        g = m['gana_chakra']
        for _ in range(int(g.get('cantidad') or 1)):
            efs.append({'t': 'darEnergia', 'tipo': 'comodin', 'obj': 'self'})

    if m.get('auto_afliccion'):
        efs.append({'t': 'dano', 'v': m['auto_afliccion'], 'obj': 'self', 'toxina': True})

    if m.get('elimina_def'):
        falta.append('elimina defensa enemiga')

    # lo que el motor todavía no sabe hacer
    for k, txt in (('refleja', 'refleja la habilidad al atacante'),
                   ('debilita', 'baja el daño que hace el enemigo'),
                   ('aumenta_costo_enemigo', 'encarece las habilidades del enemigo'),
                   ('requisito', 'requiere otra habilidad activa'),
                   ('afliccion_diferida', 'toxina que estalla después')):
        if m.get(k):
            falta.append(txt)

    return efs, falta


# ------------------------------------------------------------------
# 3b. APROXIMACIONES a mano
#     27 habilidades del documento no traen mecánica estructurada: su efecto
#     original es de los raros del juego de referencia (reflejos, sellos,
#     invocaciones, vínculos de vida). Dejarlas vacías daba 27 botones muertos,
#     así que cada una se aproximó A MANO leyendo su efecto completo en inglés,
#     con lo que el motor SÍ sabe hacer. Salen marcadas en el reporte.
#     clave: (key del roster, nombre de la habilidad)
# ------------------------------------------------------------------
def _d(v, o='enemigo', **k):  return dict(t='dano', v=v, obj=o, **k)
def _dot(v, t, o='enemigo'):  return {'t': 'danoTurnos', 'v': v, 'turnos': t, 'obj': o}
def _cur(v, o='aliado'):      return {'t': 'curar', 'v': v, 'obj': o}
def _curt(v, t, o='aliado'):  return {'t': 'curarTurnos', 'v': v, 'turnos': t, 'obj': o}
def _red(v, t, o='self'):     return {'t': 'reducir', 'v': v, 'turnos': t, 'obj': o}
def _inv(o='self'):           return {'t': 'invulnerable', 'turnos': 1, 'obj': o}
def _atu(t, o='enemigo'):     return {'t': 'aturdir', 'turnos': t, 'obj': o}
def _exp(t, o='enemigo'):     return {'t': 'exponer', 'turnos': t, 'obj': o}
def _def(v, o='self'):        return {'t': 'defensa', 'v': v, 'obj': o}
def _con():                   return {'t': 'contraataque', 'v': 25, 'obj': 'self'}
def _amp(v, t=2):             return {'t': 'amplificar', 'v': v, 'turnos': t, 'obj': 'self'}
def _ene():                   return {'t': 'darEnergia', 'tipo': 'comodin', 'obj': 'self'}
def _quema(o='todos'):        return {'t': 'quemarEnergia', 'n': 1, 'obj': o}
def _marca(v):                return {'t': 'marcaPermanente', 'v': v, 'obj': 'enemigo'}
def _limp(o='aliado'):        return {'t': 'limpiar', 'obj': o}

APROX = {
    # el original duerme al equipo enemigo -> los aturde
    ('serpiente', 'Mordida neurotóxica'):        [_atu(1, 'todos')],
    # "contra la próxima habilidad que le usen" -> contraataque del motor
    ('sapo_marino', 'Contraataque reflejo'):     [_con()],
    ('mono_titi', 'Acicalado social'):           [_red(10, 3)],
    ('mono_titi', 'Defensa reactiva'):           [_con()],
    ('mono_titi', 'Regeneración'):               [_cur(15)],
    # invulnerable a todo el equipo (en el original, a lo que no sea toxina)
    ('zorro_gris', 'Postura defensiva'):         [_inv('equipo')],
    # vínculo de vida: no existe; queda como marca permanente
    ('boa', 'Silbido'):                          [_marca(15)],
    # el bosque encarece las habilidades enemigas -> les quema energía
    ('danta', 'Instinto de manada'):             [_quema()],
    ('colibri_fuego', 'Regeneración'):           [_curt(10, 3)],
    ('escarabajo', 'Regeneración'):              [_cur(25), _limp()],
    ('escarabajo', 'Acopio de energía'):         [_ene(), _amp(10)],
    ('colibri_talamanca', 'Metabolismo acelerado'): [_amp(15, 4)],
    ('armadillo', 'Frenesí'):                    [_ene(), _amp(10, 3)],
    # "dentro del esófago no pueden reducir daño ni volverse invulnerables"
    ('sapo_dorado', 'Secreción de las parótidas'): [_exp(2, 'todos')],
    ('sapo_dorado', 'Defensa reactiva'):         [_con()],
    ('manigordo', 'Contraataque reflejo'):       [_exp(2)],
    ('delfin', 'Coordinación de manada'):        [_inv('aliado')],
    ('mono_arana', 'Coordinación de tropa'):     [_amp(10)],
    ('mono_arana', 'Secreción tóxica'):          [_dot(10, 2, 'todos')],
    ('mono_arana', 'Contraataque reflejo'):      [_con()],
    # remate a un enemigo debilitado -> golpe que atraviesa
    ('mono_arana', 'Recuperación'):              [_d(25, ignoraInvulnerable=True)],
    ('jaguar', 'Toxina corrosiva'):              [_red(10, 4)],
    ('aguila_harpia', 'Caída en picada'):        [_d(45, ignoraDefensa=True)],
    ('leon_brenero', 'Emboscada felina'):        [{'t': 'modo', 'turnos': 4, 'obj': 'self'}, _red(15, 4)],
    ('mantarraya', 'Coletazo'):                  [_red(15, 3)],
    ('geco', 'Sacudida paralizante'):            [_red(15, 2), _cur(15, 'self')],
    # la invocación aguanta la mitad del daño -> defensa destructible
    ('salamandra', 'Secreción cutánea tóxica'):  [_def(30)],
}


# ------------------------------------------------------------------
# 3b-bis. Aproximación AUTOMÁTICA desde el texto en inglés.
#     Con la reasignación entraron ~100 kits nuevos: aproximar a mano cada
#     habilidad rara ya no es viable. Cuando el documento no trae mecánica
#     estructurada, se lee el efecto completo en inglés (la fuente
#     autoritativa según la leyenda del Excel) buscando las frases estándar
#     del juego original. Queda marcada como APROXIMADA en el reporte y la
#     descripción se genera de lo implementado, nunca del texto original.
# ------------------------------------------------------------------
def aprox_desde_en(en):
    t = (en or '').lower()
    if not t:
        return []
    efs = []

    def num(pat, defecto=None):
        m = re.search(pat, t)
        return int(m.group(1)) if m else defecto

    d = num(r'deal(?:s|ing)? (\d+) (?:additional )?(?:piercing |affliction )?damage')
    if d:
        e = {'t': 'dano', 'v': d, 'obj': 'todos' if 'all enemies' in t else 'enemigo'}
        if 'affliction' in t:
            e['toxina'] = True
        if 'piercing' in t:
            e['ignoraDefensa'] = True
        efs.append(e)
    v = num(r'(?:steal\w*|absorb\w*) (\d+) (?:points? of |of their )?health')
    if v:
        efs.append({'t': 'dano', 'v': v, 'obj': 'enemigo'})
        efs.append({'t': 'curar', 'v': v, 'obj': 'self'})
    c = num(r'(?:restor\w+|regain\w*|heal\w*) (\d+) (?:points? of )?health')
    if c:
        efs.append({'t': 'curar', 'v': c, 'obj': 'aliado' if 'an ally' in t else 'self'})
    red = num(r'(\d+) points? of (?:permanent )?damage reduction')
    if red:
        efs.append({'t': 'reducir', 'v': red, 'turnos': turnos_en(en), 'obj': 'self'})
    dd = num(r'(\d+)[a-z\- ]{0,32}destructible (?:defense|barrier)')
    if dd:
        efs.append({'t': 'defensa', 'v': dd, 'obj': 'aliado' if 'an ally' in t else 'self'})
    if 'cannot become invulnerable' in t or 'cannot reduce damage' in t:
        efs.append({'t': 'exponer', 'turnos': turnos_en(en), 'obj': 'enemigo'})
    elif re.search(r'(?:become|becomes|making|makes|will be|grant\w*)[^.]{0,40}invulnerab', t):
        obj = 'aliado' if 'an ally' in t else ('equipo' if re.search(r'(his|her|their) team', t) else 'self')
        efs.append({'t': 'invulnerable', 'turnos': 1, 'obj': obj})
    if re.search(r'\bstunn?(ed|ing|s)?\b', t) and 'ignores stun' not in t and 'cannot be stun' not in t:
        efs.append({'t': 'aturdir', 'turnos': num(r'stunn?\w* for (\d+) turns?', 1), 'obj': 'enemigo'})
    if (re.search(r'\bcounters?\b|\bcountering\b|\breflect', t)
            and 'uncounterable' not in t and 'cannot be counter' not in t):
        efs.append({'t': 'contraataque', 'v': 25, 'obj': 'self'})
    if 'chakra' in t:
        if 'steal' in t or 'absorb' in t:
            efs.append({'t': 'robarEnergia', 'n': 1, 'obj': 'enemigo'})
        elif 'deplete' in t or 'removes' in t:
            efs.append({'t': 'quemarEnergia', 'n': 1, 'obj': 'enemigo'})
        elif re.search(r'gain\w*[^.]{0,25}chakra', t):
            efs.append({'t': 'darEnergia', 'tipo': 'comodin', 'obj': 'self'})
    amp = num(r'(?:strengthen\w+|increas\w+)[^.]{0,28} by (\d+)')
    if amp and 'damage' in t and not any(e['t'] == 'amplificar' for e in efs):
        efs.append({'t': 'amplificar', 'v': amp, 'turnos': 2, 'obj': 'self'})
    deb = num(r'damage is weakened by (\d+)')
    if deb:
        efs.append({'t': 'reducir', 'v': deb, 'turnos': turnos_en(en), 'obj': 'self'})
    return efs


# ------------------------------------------------------------------
# 3c. De las 4 del documento a las 3 del juego
#     REGLA DEL JUEGO (fijada por Andrés): cada animal usa **3 ataques + la
#     Esquiva universal**. El documento trae 4 porque el juego de referencia
#     le da a cada personaje su propia habilidad de invulnerabilidad además
#     del bloqueo universal.
#     Se comprobó contra los datos: en 32 de 37 kits la 4ª habilidad es
#     EXACTAMENTE eso (su única mecánica es volverse invulnerable), y en los
#     5 restantes también lo es (esos traen dos). Así que se descarta la 4ª
#     y la Esquiva universal de arena.js ocupa su lugar.
# ------------------------------------------------------------------
def solo_invulnerabilidad(r):
    """¿su única mecánica es volverse invulnerable?"""
    m = r['mecanica']
    if not m.get('invulnerable'):
        return False
    return not [k for k, v in m.items()
                if k not in ('invulnerable', 'objetivo', 'invuln_clases')
                and v not in (None, False, [], '')]


# ------------------------------------------------------------------
# 3d. COSTO para las habilidades que en el documento valen 0
#
# En el original, costo 0 = habilidad de PREPARACIÓN: no hace daño, se
# transforma en otra o da cargas ("Once used, this skill becomes…"). Nuestro
# motor no tiene transformaciones, así que la aproximación las volvió ataques
# — y quedaron ATAQUES GRATIS. Medido el 22-jul: 16 habilidades gratis, y sus
# dueños coparon el top del ranking (la Jacamar tenía "15 de daño a TODOS +
# aturde" por cero energía, cada 2 turnos).
#
# La regla: nada que haga daño o ponga un estado duro puede salir gratis. El
# precio NO se inventa — se saca de la economía real del propio documento
# (`tabla_precios`), viendo cuánto cuestan las habilidades de poder parecido.
# ------------------------------------------------------------------
BIOMAS_MOTOR = ('bosque', 'sabana', 'agua', 'montana')


def poder_de(efs):
    """cuánto 'vale' una habilidad, en la misma vara para todas"""
    v = 0
    for f in efs:
        if f['t'] == 'dano':
            v += f['v'] * (3 if f.get('obj') == 'todos' else 1)
        elif f['t'] == 'danoTurnos':
            v += f['v'] * f.get('turnos', 1)
        elif f['t'] in ('curar', 'curarTurnos', 'defensa'):
            v += f.get('v', 0)
        elif f['t'] in ('aturdir', 'exponer', 'invulnerable', 'contraataque', 'marcaPermanente'):
            v += 18
        elif f['t'] in ('reducir', 'amplificar'):
            v += f.get('v', 0)
        elif f['t'] in ('robarEnergia', 'quemarEnergia', 'darEnergia'):
            v += 12
    return v


def tabla_precios(todas):
    """poder mediano de las habilidades de 1, 2 y 3 de costo (las que SÍ cuestan)"""
    por_costo = collections.defaultdict(list)
    for costo, efs in todas:
        if costo:
            por_costo[min(len(costo), 3)].append(poder_de(efs))
    return {c: sorted(v)[len(v) // 2] for c, v in sorted(por_costo.items()) if v}


def cobrar(efs, precios, bioma):
    """qué costo le toca a una habilidad que vino sin costo"""
    ofensiva = any(f['t'] in ('dano', 'danoTurnos', 'aturdir', 'exponer', 'marcaPermanente')
                   for f in efs)
    if not ofensiva:
        return []                       # buff puro sin daño: puede seguir gratis
    p = poder_de(efs)
    n = 1
    for c in sorted(precios):           # el primer escalón cuyo techo supere su poder
        if p <= precios[c] * 1.35:
            n = c
            break
        n = c
    # la primera del bioma propio (identidad), el resto comodín.
    # ⚠️ Las 6 leyendas del folclor tienen bio "noche", que NO es uno de los 4
    # biomas del motor: un costo así no se puede pagar NUNCA. Se cae a comodín.
    if bioma not in BIOMAS_MOTOR:
        bioma = 'comodin'
    return [bioma] + ['comodin'] * (n - 1)



# ------------------------------------------------------------------
# 3e. PISO DE JUGABILIDAD — que ningún animal se quede mirando
#
# Primero probé subirles el DAÑO a los kits flojos: la brecha bajó 2 puntos y
# nada más. Entonces medí qué predice de verdad ganar (`tools/que_gana.mjs`) y
# el resultado tumbó la teoría: **ningún rasgo del kit correlaciona fuerte con
# ganar** — ni el daño (+0,17), ni perforar (+0,03), ni el área (−0,02).
#
# Lo que SÍ correlaciona es la ACTIVIDAD: cuántas veces el animal consigue
# usar una habilidad por turno (+0,56, el doble que cualquier otra cosa).
#   · León breñero: juega 0,69 veces por turno → gana 77%
#   · Oso hormiguero: juega 0,28 → gana 26%
#
# O sea: los que pierden no son débiles, es que NO PUEDEN JUGAR. Su energía no
# les alcanza y se quedan mirando. Por eso el piso ahora abarata en vez de
# inflar: garantiza que todo animal tenga al menos una habilidad de 1 sola
# energía DE SU BIOMA (la que siempre va a poder pagar) y convierte costos
# específicos de más en comodín, que se paga con cualquier cosa.
# ------------------------------------------------------------------
PISO_FRACCION = 0.92      # piso = 92% de la mediana de ACTIVIDAD estimada
COSTO_MAX_KIT = 5         # ningún kit flojo debería pedir más que esto en total



def actividad_estimada(habs):
    """Probabilidad aproximada de poder JUGAR algo en un turno cualquiera.

    Es lo único que correlaciona fuerte con ganar (+0,56 medido). Se estima
    sin simular: una habilidad de recarga R está disponible 1/(R+1) de los
    turnos, y su costo se paga con probabilidad p. Con la energía repartida
    25% por bioma, un costo específico es bastante más difícil que un comodín.
    """
    libre = 1.0
    for h in habs:
        disp = 1.0 / (h['recarga'] + 1)
        p = 1.0
        for c in h['costo']:
            if c == 'TODO':
                p *= 0.25
            elif c == 'comodin':
                p *= 0.80          # se paga con cualquier cosa
            else:
                p *= 0.45          # hay que tener ESE bioma
        libre *= (1 - disp * p)    # probabilidad de que ESTA no se pueda usar
    return 1 - libre               # ...de que al menos una sí


def valor_por_energia(habs):
    poder = sum(poder_de(h['efectos']) for h in habs)
    costo = sum(len(h['costo']) or 0.5 for h in habs)
    return poder / costo if costo else 0


def abaratar(habs, bioma):
    """hace jugable un kit flojo. Devuelve la lista de cambios hechos."""
    if bioma not in BIOMAS_MOTOR:
        bioma = 'comodin'
    cambios = []

    # 0. LAS RECARGAS son lo que de verdad deja mudo a un animal. De todos los
    #    rasgos medidos, la recarga media es el que más correlaciona con perder
    #    (−0,31). El Mono tití tenía cd4 + cd3 + cd0: una sola habilidad usable
    #    casi todos los turnos, y jugaba 0,30 veces por turno (la media es 0,40).
    #    Un kit flojo no puede tener TODAS sus habilidades en recarga larga.
    if min(h['recarga'] for h in habs) > 0:          # ninguna de uso libre
        libre = min(habs, key=lambda h: h['recarga'])
        cambios.append(f"{libre['n']}: recarga {libre['recarga']} → 0")
        libre['recarga'] = 0
    for h in habs:
        if h['recarga'] >= 4:                        # nada de esperar 4 turnos
            cambios.append(f"{h['n']}: recarga {h['recarga']} → 2")
            h['recarga'] = 2

    # 1. su habilidad más barata pasa a costar 1 SOLA energía de su bioma:
    #    esa es la que va a poder pagar casi siempre
    barata = min(habs, key=lambda h: len(h['costo']))
    if len(barata['costo']) > 1:
        cambios.append(f"{barata['n']}: {len(barata['costo'])} → 1 ({bioma})")
        barata['costo'] = [bioma]

    # 2. el resto: si pide 2+ energías específicas, todas menos la primera
    #    pasan a comodín (pagable con lo que tengas)
    for h in habs:
        if h is barata:
            continue
        esp = [c for c in h['costo'] if c not in ('comodin', 'TODO')]
        if len(esp) >= 2:
            nuevos, visto = [], False
            for c in h['costo']:
                if c in ('comodin', 'TODO'):
                    nuevos.append(c)
                elif not visto:
                    nuevos.append(c); visto = True
                else:
                    nuevos.append('comodin')
            cambios.append(f"{h['n']}: {len(esp)} biomas → 1 + comodines")
            h['costo'] = nuevos

    # 3. si aun así el kit entero pide demasiado, recortar la más cara
    total = sum(len(h['costo']) for h in habs)
    if total > COSTO_MAX_KIT:
        cara = max(habs, key=lambda h: len(h['costo']))
        if len(cara['costo']) > 1:
            cara['costo'] = cara['costo'][:-1]
            cambios.append(f"{cara['n']}: −1 de costo (el kit pedía {total})")
    return cambios


# ------------------------------------------------------------------
# 4. La descripción se escribe DESDE los efectos implementados
# ------------------------------------------------------------------
A_QUIEN = {'enemigo': 'a un enemigo', 'todos': 'a TODOS los enemigos',
           'aliado': 'a un aliado', 'equipo': 'a todo el equipo', 'self': ''}
CLASE_ES = {'fisico': 'físicas', 'natural': 'naturales', 'instinto': 'de instinto',
            'melee': 'de cuerpo a cuerpo', 'toxina': 'de toxina'}


def describir(efs):
    p = []
    for e in efs:
        a = A_QUIEN.get(e.get('obj', 'self'), '')
        t = e['t']
        if t == 'dano':
            if e.get('obj') == 'self':
                s = f"se hace {e['v']} de daño"
            else:
                s = f"{e['v']} de daño {a}".strip()
            extra = []
            if e.get('toxina'):
                extra.append('toxina: atraviesa la invulnerabilidad')
            if e.get('ignoraDefensa'):
                extra.append('ignora la defensa')
            if e.get('ignoraInvulnerable'):
                extra.append('ignora la invulnerabilidad')
            if extra:
                s += f" ({', '.join(extra)})"
            p.append(s)
        elif t == 'danoTurnos':
            p.append(f"{e['v']} de toxina por turno durante {e['turnos']} turnos {a}".strip())
        elif t == 'aturdir':
            q = f"aturde sus habilidades {CLASE_ES[e['clase']]}" if e.get('clase') else 'lo aturde'
            p.append(f"{q} {e['turnos']} turno" + ('s' if e['turnos'] > 1 else ''))
        elif t == 'curar':
            p.append(f"cura {e['v']} " + (a or 'a sí mismo'))
        elif t == 'curarTurnos':
            p.append(f"cura {e['v']} por turno durante {e['turnos']} turnos " + (a or 'a sí mismo'))
        elif t == 'limpiar':
            p.append('le quita los efectos dañinos')
        elif t == 'defensa':
            perm = ' permanente' if e.get('permanente') else ''
            p.append(f"gana {e['v']} de defensa destructible{perm} " + (a or ''))
        elif t == 'reducir':
            p.append(f"recibe {e['v']} menos de daño durante {e['turnos']} turnos " + (a or ''))
        elif t == 'invulnerable':
            p.append('invulnerable 1 turno ' + (a or ''))
        elif t == 'amplificar':
            p.append(f"su próximo golpe pega +{e['v']}")
        elif t == 'contraataque':
            p.append('contraataca: quien lo golpee recibe 25')
        elif t == 'exponer':
            p.append(f"queda expuesto {e['turnos']} turno" + ('s' if e['turnos'] > 1 else '') +
                     ' (no puede volverse invulnerable)')
        elif t == 'darEnergia':
            p.append('gana 1 de energía')
        elif t == 'marcaPermanente':
            p.append(f"lo marca: recibe +{e['v']} de daño de ahí en adelante")
        elif t == 'quemarEnergia':
            p.append('le quema 1 de energía ' + (a or ''))
        elif t == 'robarEnergia':
            p.append('le roba 1 de energía ' + (a or ''))
        elif t == 'modo':
            p.append(f"entra en modo especial {e['turnos']} turnos")
        elif t == 'limpiar':
            pass   # ya cubierto arriba
        else:
            # si aparece un efecto nuevo sin texto, mejor reventar acá que
            # mandar al juego una habilidad con la descripción en blanco
            raise SystemExit(f'describir(): falta el texto para el efecto "{t}"')
    if not p:
        return ''
    def cap(s):
        s = ' '.join(s.split())
        return s[:1].upper() + s[1:]
    return '. '.join(cap(x) for x in p if x.strip()).rstrip('.') + '.'


# ------------------------------------------------------------------
# 5. Armado
# ------------------------------------------------------------------
def main():
    d = json.load(open(ORIGEN, encoding='utf-8'))

    # Agrupar en KITS. Un kit = las 4 habilidades (slots 1..4) de un personaje.
    # ⚠️ No alcanza con (animal, personaje, categoria): el mismo personaje puede
    # traer DOS kits seguidos (versiones distintas con el mismo nombre). Se corta
    # cuando el slot deja de subir — si no, serpiente salía con 9 habilidades.
    por_animal = collections.OrderedDict()
    actual, clave = None, None
    for r in d:
        k = (r['animal'], r['personaje_orig'], r['categoria'])
        if actual is None or k != clave or r['slot'] <= actual[-1]['slot']:
            actual = []
            clave = k
            por_animal.setdefault(r['animal'], []).append((r['personaje_orig'], r['categoria'], actual))
        actual.append(r)
    for lista in por_animal.values():
        for pers, cat, habs in lista:
            habs.sort(key=lambda r: r['slot'])

    salida, reporte_falta, aproximadas, genericas, descartes = {}, [], [], [], []

    # ---- POOL: todos los kits COMPLETOS del documento, en su orden ----
    pool = []
    for animal, lista in por_animal.items():
        for pers, cat, habs in lista:
            if len(habs) == 4:
                pool.append({'animal': animal, 'pers': pers, 'cat': cat,
                             'habs': habs, 'usado': None})

    def tomar(animal, pers=None, para=None):
        for k in pool:
            if k['usado'] is None and k['animal'] == animal and (pers is None or k['pers'] == pers):
                k['usado'] = para
                return k
        return None

    # 1) los que se llaman igual (MAPA): su PRIMER kit completo, como siempre
    plan = []
    for animal, key in MAPA.items():
        if not key:
            continue
        k = tomar(animal, para=key)
        if k:
            plan.append((key, k))
    # 2) los reasignados a mano (ASIGNADOS)
    for key, (animal, pers) in ASIGNADOS.items():
        k = tomar(animal, pers, para=key)
        if not k:
            raise SystemExit(f'ASIGNADOS: ya no queda ningún kit "{animal} · {pers}" para {key}')
        plan.append((key, k))

    for key, kit in plan:
        animal, pers, cat, habs = kit['animal'], kit['pers'], kit['cat'], kit['habs']

        # 4 del documento -> 3 del juego: fuera la esquiva propia (ver §3c)
        descartada = habs[-1]
        habs = habs[:-1]
        descartes.append((animal, key, descartada['nombre_es'],
                          'sí' if solo_invulnerabilidad(descartada) else 'NO — revisar'))

        out = []
        for r in habs:
            cl, bypass = clases_de(r['clases'])
            efs, falta = efectos_de(r['mecanica'], bypass, r.get('efecto_en', ''))
            if not efs and (key, r['nombre_es']) in APROX:      # curadas a mano
                efs = APROX[(key, r['nombre_es'])]
                aproximadas.append((animal, r['nombre_es'], r['efecto_en'][:110]))
            if not efs:                                         # leídas del inglés
                efs = aprox_desde_en(r.get('efecto_en', ''))
                if efs:
                    aproximadas.append((animal, r['nombre_es'], r['efecto_en'][:110]))
            if not efs:                                         # último recurso
                efs = [{'t': 'dano', 'v': 15 + 5 * len(costo_de(r['costo'])), 'obj': 'enemigo'}]
                genericas.append((animal, r['nombre_es'], r['efecto_en'][:110]))
            desc = describir(efs)
            if not desc:
                raise SystemExit(f'{key}/{r["nombre_es"]}: descripción vacía — no se publica así')
            if falta:
                reporte_falta.append((animal, key, r['nombre_es'], falta))
            out.append({
                'n': r['nombre_es'],
                'desc': desc,
                'costo': costo_de(r['costo']),
                'recarga': r['enfriamiento'],
                'clases': cl,
                'efectos': efs,
            })
        salida[key] = {'habs': out, 'origen': f'{animal} → {pers} · {cat}'}

    # ---- 2ª PASADA: ponerle precio a las que vinieron GRATIS (ver §3d) ----
    # Va después de armar todo porque la tabla de precios se saca de la economía
    # real del propio juego, no de números inventados.
    bioma_de = dict(re.findall(r'^\s*([a-z_0-9]+):\s*\{[^\n]*?bio:"([a-z]+)"',
                               (AQUI / 'src' / 'fauna_roster.js').read_text(encoding='utf-8'), re.M))
    precios = tabla_precios([(h['costo'], h['efectos'])
                             for kit in salida.values() for h in kit['habs']])
    cobradas = []
    for key, kit in salida.items():
        for h in kit['habs']:
            if h['costo']:
                continue
            nuevo_costo = cobrar(h['efectos'], precios, bioma_de.get(key, 'bosque'))
            if nuevo_costo:
                h['costo'] = nuevo_costo
                cobradas.append((key, h['n'], poder_de(h['efectos']), nuevo_costo))

    # ---- 3ª PASADA: levantar el fondo de la tabla (ver §3e) ----
    # ⚠️ Antes se elegía por PODER por energía y no servía de nada: cuatro
    # intentos de balanceo automático (subir daño, abaratar costo, sesgar la
    # energía, bajar recargas) movieron la desviación menos de 0,2 puntos. El
    # motivo: estaba arreglando a los animales equivocados. Lo que correlaciona
    # con ganar es la ACTIVIDAD (+0,56), no el poder (+0,17), así que el piso
    # ahora selecciona por ahí.
    act = {k: actividad_estimada(kit['habs']) for k, kit in salida.items()}
    orden = sorted(act.values())
    mediana = orden[len(orden) // 2]
    piso = mediana * PISO_FRACCION
    vpe = act
    levantados = []
    for key, kit in salida.items():
        if act[key] >= piso:
            continue
        antes = act[key]
        cambios = abaratar(kit['habs'], bioma_de.get(key, 'bosque'))
        if cambios:
            levantados.append((key, antes, actividad_estimada(kit['habs']), cambios))

    # ---- ningún costo puede ser IMPAGABLE ----
    for key, kit in salida.items():
        for h in kit['habs']:
            for c in h['costo']:
                if c not in BIOMAS_MOTOR and c not in ('comodin', 'TODO'):
                    raise SystemExit(f'COSTO IMPAGABLE en {key}/{h["n"]}: "{c}" no es un bioma')

    # ---- NINGÚN par de especies puede compartir kit (el reclamo original) ----
    firmas = {}
    for key, kit in salida.items():
        firma = json.dumps([(h['n'], h['efectos']) for h in kit['habs']],
                           ensure_ascii=False, sort_keys=True)
        if firma in firmas:
            raise SystemExit(f'KIT DUPLICADO: "{key}" y "{firmas[firma]}" quedaron con el mismo kit')
        firmas[firma] = key

    # ---- cobertura contra el roster real ----
    roster_js = (AQUI / 'src' / 'fauna_roster.js').read_text(encoding='utf-8')
    roster = set(re.findall(r'^\s*([a-z_0-9]+):\s*\{\s*n:"', roster_js, re.M))
    sin_kit = sorted(roster - set(salida))
    sobrantes = [k for k in pool if k['usado'] is None]

    # ---- JS ----
    def js(v):
        return json.dumps(v, ensure_ascii=False)

    L = []
    L.append('// ============================================================')
    L.append('// movesets_doc.js — GENERADO por make_habilidades_doc.py. NO editar a mano.')
    L.append('// Kits OFICIALES: salen del documento de Andrés (722 habilidades, 100')
    L.append('// animales, portadas de Naruto-Arena). Cada animal trae sus 4 habilidades')
    L.append('// + la esquiva universal que agrega arena.js.')
    L.append('// Chakra -> bioma:  Taijutsu=🌳bosque · Ninjutsu=🌊agua ·')
    L.append('//                   Bloodline=⛰montaña · Genjutsu=🌾sabana · Random=⚪comodín')
    L.append('// ============================================================')
    L.append('')
    L.append('export const MOVESETS_DOC = {')
    for key, kit in salida.items():
        L.append(f'  // {kit["origen"]}')
        L.append(f'  {key}: {{ habs: [')
        for h in kit['habs']:
            L.append(f'    {{ n:{js(h["n"])}, desc:{js(h["desc"])},')
            L.append(f'      costo:{js(h["costo"])}, recarga:{h["recarga"]}, clases:{js(h["clases"])},')
            L.append(f'      efectos:{js(h["efectos"])} }},')
        L.append('  ] },')
    L.append('};')
    L.append('')
    L.append('// Kits del documento que quedaron SIN usar (reserva para especies nuevas).')
    L.append('export const VARIANTES_DOC = ' + js([f"{k['animal']} · {k['pers']}" for k in sobrantes]) + ';')
    L.append('')
    SALIDA.write_text('\n'.join(L), encoding='utf-8')

    # ---- reporte ----
    nombres = dict(re.findall(r'^\s*([a-z_0-9]+):\s*\{\s*n:"([^"]+)"', roster_js, re.M))

    R = ['# Reporte de habilidades (documento de Andrés)', '',
         f'- Kits completos en el documento: **{len(pool)}** ({len(d)} habilidades, {len(por_animal)} animales)',
         f'- Especies del juego con kit del documento: **{len(salida)}** de {len(roster)}',
         f'- Kits sin usar (reserva para especies nuevas): **{len(sobrantes)}**', '',
         '## A quién le tocó cada kit', '',
         'Los kits de animales del documento que no tienen sprite se **reasignaron por',
         'afinidad** a especies del juego que quedaban con kits de plantilla repetidos',
         '(pedido de Andrés, 21-jul). Cada kit se usa UNA sola vez.', '',
         '| Especie del juego | Kit del documento | Personaje original |', '|---|---|---|']
    for key, kit in salida.items():
        R.append(f'| {nombres.get(key, key)} | {kit["origen"].split(" → ")[0]} | '
                 f'{kit["origen"].split(" → ")[-1]} |')

    if sin_kit:
        R += ['', f'## ⚠️ Especies del roster SIN kit del documento ({len(sin_kit)})', '',
              ', '.join(f'`{k}`' for k in sin_kit)]

    if sobrantes:
        R += ['', f'## Kits en reserva ({len(sobrantes)})', '',
              'Para cuando se agreguen especies nuevas al roster.', '']
        for k in sobrantes:
            R.append(f'- {k["animal"]} · {k["pers"]} ({k["cat"]})')

    R += ['', '## Mecánicas que el motor todavía no hace', '',
          'Estas habilidades se aplicaron **sin** esa parte. La descripción que ve el',
          'jugador NO la menciona, así que el texto no miente; queda pendiente para',
          'cuando el motor las soporte.', '',
          '| Animal | Habilidad | Falta |', '|---|---|---|']
    for animal, key, hab, falta in reporte_falta:
        R.append(f'| {animal} | {hab} | {"; ".join(falta)} |')

    if genericas:
        R += ['', '## ⚠️ Habilidades GENÉRICAS (último recurso)', '',
              'Ni la mecánica estructurada ni la lectura del inglés dieron efectos:',
              'quedaron como daño simple según su costo. Candidatas a curarse a mano.', '',
              '| Animal | Habilidad | Efecto original (EN) |', '|---|---|---|']
        for animal, hab, en in genericas:
            R.append(f'| {animal} | {hab} | {en}… |')

    if descartes:
        R += ['', '## La 4ª habilidad que se descartó', '',
              'Regla del juego: **3 ataques + la Esquiva universal**. El documento trae 4',
              'porque el original le da a cada personaje su propia invulnerabilidad además',
              'del bloqueo universal. Se descarta la 4ª y la Esquiva ocupa su lugar.', '',
              'La columna "¿era su esquiva?" dice si esa habilidad no hacía otra cosa que',
              'volver invulnerable — si dice **NO**, se perdió algo y hay que mirarlo.', '',
              '| Animal | Habilidad descartada | ¿era su esquiva? |', '|---|---|---|']
        for animal, key, hab, era in descartes:
            R.append(f'| {animal} | {hab} | {era} |')

    if aproximadas:
        R += ['', '## Habilidades APROXIMADAS', '',
              'El documento no traía mecánica estructurada para estas: se aproximaron',
              'leyendo el efecto completo en inglés. **La descripción que ve el jugador',
              'dice lo que de verdad hace la versión nuestra**, no la original.', '',
              '| Animal | Habilidad | Efecto original (EN) |', '|---|---|---|']
        for animal, hab, en in aproximadas:
            R.append(f'| {animal} | {hab} | {en}… |')

    if cobradas:
        R += ['', f'## Habilidades que estaban GRATIS y ahora cuestan ({len(cobradas)})', '',
              'En el documento valían 0 porque eran de PREPARACIÓN (se transformaban en',
              'otra habilidad). Nuestro motor no tiene eso, así que la aproximación las',
              'volvió ataques — y quedaron ataques gratis. El precio sale de la economía',
              'real del juego (poder mediano por escalón de costo), no de números',
              'inventados.', '',
              f'Escalones medidos: ' + ' · '.join(f'{c} energía → poder {v}' for c, v in precios.items()),
              '', '| Especie | Habilidad | Poder | Costo nuevo |', '|---|---|---|---|']
        for key, n, pod, c in cobradas:
            R.append(f'| {nombres.get(key, key)} | {n} | {pod} | {" + ".join(c)} |')


    if levantados:
        R += ['', f'## Kits LEVANTADOS al piso de poder ({len(levantados)})', '',
              f'Lo que predice ganar NO es el poder del kit sino la ACTIVIDAD: cuántas',
              f'veces el animal consigue jugar por turno (correlación +0,56 contra +0,17',
              f'del daño). Los que perdían no eran débiles: no podían pagar sus propias',
              f'habilidades. Por eso el piso ABARATA en vez de inflar.', '',
              f'Piso = {PISO_FRACCION:.0%} de la mediana de actividad ({piso:.2f}).', '',
              '| Especie | Actividad estimada | Qué se abarató |', '|---|---|---|']
        for key, a, d, cambios in sorted(levantados, key=lambda x: x[1]):
            R.append(f'| {nombres.get(key, key)} | {a:.2f} → **{d:.2f}** | {"; ".join(cambios)} |')

    REPORTE.write_text('\n'.join(R), encoding='utf-8')

    raros = [x for x in descartes if x[3] != 'sí']
    print(f'OK {SALIDA.name}: {len(salida)}/{len(roster)} especies con kit del documento')
    print(f'   habilidades que estaban gratis y ahora cuestan: {len(cobradas)}')
    print(f'   kits levantados al piso: {len(levantados)} (actividad piso {piso:.2f}, mediana {mediana:.2f})')
    print(f'   kits sin usar (reserva): {len(sobrantes)}')
    print(f'   4ª descartada en {len(descartes)} kits · {len(raros)} NO eran su esquiva (ver reporte)')
    print(f'   con mecánica parcial: {len(reporte_falta)} · aproximadas: {len(aproximadas)}'
          f' · genéricas: {len(genericas)}')
    if sin_kit:
        print(f'   ⚠️ especies SIN kit del documento: {len(sin_kit)}: {", ".join(sin_kit)}')
    print(f'OK {REPORTE.name}')


if __name__ == '__main__':
    main()
