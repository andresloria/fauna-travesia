# ============================================================
# make_movesets.py — GENERA src/movesets_gen.js: el moveset ARENA de TODOS los
# animales del roster que no tengan kit a mano en src/habilidades.js.
#
# Los numeros vienen del estudio de los 22 personajes reales de Naruto-Arena
# (tools/na_personajes.json + ARENA.md §2b). Lenguaje verificado, vida 100:
#   basico 15-30 cd0 costo 1 · fuerte 25-45 + rider cd1 costo 2
#   MODO 4 turnos (+reduccion, mejora las otras) costo comodin cd 3-4
#   toxina 10-25/turno 2-4t · cura 25 cd0 · defensa 20-40 · AoE 15 (35-45 caro)
#   exponer/marcar GRATIS cd0-1 · esquiva universal: invulnerable 1t comodin cd4
#
# ⚠️ SIN NIVELES y SIN PASIVAS (decision de Andres, 20-jul):
#   TODOS los animales tienen sus 3 habilidades + esquiva DESDE EL PRINCIPIO.
#   Lo unico que decide que podes usar es el COSTO EN ENERGIA DE BIOMA.
#   No hay pasivas: solo ataques. La diferencia entre animales esta en su kit.
#
# Rareza NO toca numeros (vida 100 parejo): sube la COMPLEJIDAD del kit
#   comun      → numeros planos, efectos directos
#   raro       → una habilidad lleva rider (como Neji 64 Palmas)
#   ultrararo  → patron MODO (una habilidad mejora a las otras, como Sharingan)
#   legendario/extinto/mitico → kit unico A MANO en habilidades.js (los que
#   falten salen aqui marcados TODO para no dejar hueco)
#
# Re-correr: python make_movesets.py   (dry-run; --aplicar escribe el .js)
# ============================================================
import json, re, sys, hashlib

RUTA_ROSTER = 'src/fauna_roster.js'
RUTA_BEST   = 'assets/animales/_bestiario.json'
RUTA_HAND   = 'src/habilidades.js'
RUTA_OUT    = 'src/movesets_gen.js'

# ---------- entrada ----------
src = open(RUTA_ROSTER, encoding='utf-8').read()
ROSTER = {}
for m in re.finditer(r'^\s{2}(\w+):\s*\{(.+?)\},?$', src, re.M):
    key, body = m.group(1), m.group(2)
    def g(f, d=None):
        mm = re.search(rf'\b{f}:\s*"([^"]*)"', body)
        return mm.group(1) if mm else d
    ROSTER[key] = {'n': g('n', key), 'bio': g('bio', 'bosque'),
                   'rarity': g('rarity', 'comun'), 'ab': g('ab', 'rage'), 'ab2': g('ab2')}

BEST = {b['slug']: b for b in json.load(open(RUTA_BEST, encoding='utf-8'))}
CAT_EXTRA = {  # los que no estan en el bestiario
    'abeja':'Marinos e insectos','cangrejo':'Marinos e insectos','tiburon':'Marinos e insectos',
    'tarantula':'Marinos e insectos','quetzaldorado':'Aves','perro':'Mamíferos','gato':'Mamíferos',
    'comemaiz':'Aves','f_segua':'Folclor','f_cadejos':'Folclor','f_llorona':'Folclor',
    'f_tulevieja':'Folclor','f_padre':'Folclor','f_carreta':'Folclor',
}
def cat_de(key):
    c = BEST.get(key, {}).get('cat') or CAT_EXTRA.get(key, 'Mamíferos')
    if c.startswith('Mam'): return 'mam'
    if c == 'Aves': return 'ave'
    if c == 'Reptiles': return 'rep'
    if c == 'Anfibios': return 'anf'
    if c == 'Folclor': return 'folk'
    return 'mar'  # marinos e insectos

# los kits a mano NO se regeneran
hand = open(RUTA_HAND, encoding='utf-8').read()
HECHOS = set(re.findall(r'^\s{2}(\w+):\s*\{\s*(?://.*)?$', hand, re.M))

# eleccion determinista de variante (estable entre corridas)
def pick(key, salt, opciones):
    h = int(hashlib.md5(f'{key}:{salt}'.encode()).hexdigest(), 16)
    return opciones[h % len(opciones)]

# ---------- vocabulario por categoria ----------
# Listas largas a proposito: `pick()` es determinista por animal, asi que a mas
# opciones, menos animales comparten el mismo nombre de habilidad.
V = {
 'mam': {'basico':['Zarpazo','Mordida','Embestida','Manotazo','Tarascada','Dentellada',
                   'Garra rapida','Golpe de hocico','Mordisco','Empujon','Arañazo','Cabezazo'],
         'fuerte':['Mordida profunda','Embestida brutal','Zarpazo doble','Tarascada feroz',
                   'Mordida al hueso','Carga de peso','Garra desgarradora','Salto sobre la presa',
                   'Sacudida mortal','Golpe de lomo'],
         'esquiva':'Se escabulle entre la maleza'},
 'ave': {'basico':['Picotazo','Rasguño en vuelo','Aletazo','Picoteo','Garra en picada',
                   'Golpe de ala','Punzada de pico','Roce de plumas','Tijera de alas'],
         'fuerte':['Picada en picada','Garra certera','Picotazo perforante','Caida en flecha',
                   'Vuelo rasante','Espolon de garra','Torbellino de plumas','Arrebato de altura'],
         'esquiva':'Alza vuelo y esquiva'},
 'rep': {'basico':['Mordida','Coletazo','Tarascada','Latigazo de cola','Mordisco seco',
                   'Golpe de escamas','Enroscada','Chasquido de fauces'],
         'fuerte':['Mordida de presa','Constriccion','Coletazo brutal','Fauces de acero',
                   'Abrazo mortal','Giro de la muerte','Mordida trabada','Azote de cola'],
         'esquiva':'Se camufla y esquiva'},
 'anf': {'basico':['Golpe de lengua','Salto certero','Embestida','Lenguetazo','Brinco corto',
                   'Zarpa humeda','Coletazo de renacuajo'],
         'fuerte':['Salto aplastante','Lengua latigo','Golpe doble','Salto desde el dosel',
                   'Lenguetazo veloz','Caida de peso'],
         'esquiva':'Salta fuera de alcance'},
 'mar': {'basico':['Tenaza','Coletazo','Picadura','Embate','Pinza rapida','Aguijonazo',
                   'Golpe de caparazon','Cabezazo de agua'],
         'fuerte':['Tenaza aplastante','Embate de cardumen','Picadura profunda','Pinza trituradora',
                   'Remolino de agua','Aguijon hundido','Golpe de marea'],
         'esquiva':'Se pierde en el agua'},
 'folk': {'basico':['Zarpazo espectral','Lamento','Golpe de sombra','Caricia helada','Susurro'],
          'fuerte':['Garra de la noche','Aullido desgarrador','Embate espectral','Grito de ultratumba',
                    'Abrazo de niebla'],
          'esquiva':'Se desvanece en la niebla'},
}

# (Las PASIVAS se eliminaron el 20-jul: solo ataques.)

# ---------- helpers de efectos (mismo formato que habilidades.js) ----------
def dmg(v, o='enemigo'): return {'t':'daño','v':v,'obj':o}
def dot(v, t, o='enemigo'): return {'t':'danoTurnos','v':v,'turnos':t,'obj':o}
def cura(v, o='aliado'): return {'t':'curar','v':v,'obj':o}
def defen(v, o='self'): return {'t':'defensa','v':v,'obj':o}
def reduc(v, t, o='self'): return {'t':'reducir','v':v,'turnos':t,'obj':o}
def invul(t=1, o='self'): return {'t':'invulnerable','turnos':t,'obj':o}
def stun(t=1, o='enemigo', clase=None): return {'t':'aturdir','turnos':t,'obj':o,'clase':clase}
def robar(n=1): return {'t':'robarEnergia','n':n,'obj':'enemigo'}
def quemar(n=1): return {'t':'quemarEnergia','n':n,'obj':'enemigo'}
def area(v): return {'t':'daño','v':v,'obj':'todos'}
def contra(v): return {'t':'contraataque','v':v,'obj':'self'}
def ampl(v, t, o='self'): return {'t':'amplificar','v':v,'turnos':t,'obj':o}
def limpiar(o='aliado'): return {'t':'limpiar','obj':o}
def exponer(t=2, o='enemigo'): return {'t':'exponer','turnos':t,'obj':o}
def modo(t=4): return {'t':'modo','turnos':t}

# ---------- plantillas de kit por rol ----------
# ECONOMIA REAL DE NARUTO-ARENA (contada de tools/na_personajes.json):
#   23 habilidades cuestan 1 chakra ESPECIFICO  ← la categoria de dano mas grande
#   38 cuestan 1 Random, pero casi todas son el Bloqueo universal y los MODOS
#    5 son GRATIS (marcas y setup, nunca dano fuerte)
#   los combos de 2 son [especifico+Random] o [especifico+especifico]
#    2 llegan a 3 energias, y son los golpes en AREA mas fuertes
#
# => El basico cuesta 1 energia DE SU BIOMA (no comodin). El comodin queda para
#    modos, bloqueos y utilidad, como en el original. Eso ademas alarga los
#    combates: no todos pueden pegar todos los turnos.
#
# VARIEDAD: cada rol tiene VARIAS FORMAS de kit, calcadas de un personaje real.
# `pick()` es determinista por animal, asi que dos animales del mismo rol suelen
# tener estructuras distintas de costo, recarga y efectos.
#
# Presupuesto (del original): 1 especifico = 15-25 · 2 = 30-40 · 3 = 35-45 area
#                             1 comodin = modo/bloqueo · gratis = marca/setup

# segundo bioma (para costos mixtos tipo Tai+Blood de Neji)
def otro_bio(key, bio):
    ops = [b for b in ('bosque','sabana','agua','montana') if b != bio]
    return pick(key, 'ob', ops)

def kit_rage(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico']); f = pick(key, 'f', V[cat]['fuerte'])
    o = otro_bio(key, bio)
    forma = pick(key, 'forma', ['lee', 'sasuke', 'kiba'])
    if forma == 'lee':          # Rock Lee: castigo sostenido que se acumula
        nv1 = {'n': b, 'desc': '10 de daño por turno durante 3 turnos.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','melee','sostenido'], 'efectos': [dot(10,3)]}
        nv4 = {'n': f, 'desc': '30 de daño a un enemigo.',
               'costo': [bio,'comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(30)]}
        nv8 = {'n': pick(key,'u',['Loto abierto','Ultimo aliento','Arremetida final']),
               'desc': '45 de daño. Ignora la defensa destructible.',
               'costo': [bio,'comodin'], 'recarga': 3, 'clases': ['fisico','melee','unico','instant'],
               'efectos': [{'t':'daño','v':45,'obj':'enemigo','ignoraDefensa':True}]}
    elif forma == 'sasuke':     # Sasuke: dos golpes buenos + MODO que los mejora
        nv1 = {'n': b, 'desc': '30 de daño. Durante su modo pega +15.',
               'costo': [bio,'comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'],
               'efectos': [dmg(30)], 'enModo': [dmg(45)]}
        nv4 = {'n': f, 'desc': '30 de daño que atraviesa la defensa destructible.',
               'costo': [o,'comodin'], 'recarga': 1, 'clases': ['fisico','melee','instant'],
               'efectos': [{'t':'daño','v':30,'obj':'enemigo','ignoraDefensa':True}]}
        nv8 = {'n': pick(key,'u',['Instinto depredador','Furia ancestral','Modo cazador','Sangre en el aire']),
               'desc': 'MODO: 4 turnos con 15 menos de daño recibido y sus golpes mejorados.',
               'costo': ['comodin'], 'recarga': 4, 'clases': ['instinto','unico','instant'],
               'efectos': [modo(4), reduc(15,4)]}
    else:                       # Kiba: golpe fuerte + area sostenida + marca GRATIS
        nv1 = {'n': b, 'desc': '30 de daño a un enemigo.',
               'costo': [bio,'comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(30)]}
        nv4 = {'n': pick(key,'u',['Estampida','Arremetida','Tromba','Bramido']),
               'desc': '15 de daño a TODOS los enemigos por turno durante 3 turnos.',
               'costo': [bio,o], 'recarga': 3, 'clases': ['fisico','unico','sostenido'],
               'efectos': [{'t':'daño','v':15,'obj':'todos'}, dot(15,3)]}
        nv8 = {'n': pick(key,'m',['Marcar presa','Rastrear','Delatar']),
               'desc': 'GRATIS: ese enemigo no puede reducir daño ni volverse invulnerable por 3 turnos.',
               'costo': [], 'recarga': 1, 'clases': ['instinto','rango','instant'],
               'efectos': [exponer(3)]}
    return nv1, nv4, nv8

def kit_first(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico']); f = pick(key, 'f', V[cat]['fuerte'])
    o = otro_bio(key, bio)
    forma = pick(key, 'forma', ['temari', 'kin', 'neji'])
    if forma == 'temari':       # Temari: golpe con cobertura + area cara + refugio de equipo
        nv1 = {'n': b, 'desc': '25 de daño; ademas recibe 10 menos de daño 1 turno.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','rango','instant'],
               'efectos': [dmg(25), reduc(10,1)]}
        nv4 = {'n': f, 'desc': '35 de daño a TODOS los enemigos.',
               'costo': [bio,'comodin','comodin'], 'recarga': 2, 'clases': ['fisico','rango','unico','instant'],
               'efectos': [area(35)]}
        nv8 = {'n': pick(key,'u',['Cortina de polvo','Refugio del viento']),
               'desc': 'TODO tu equipo se vuelve invulnerable 1 turno.',
               'costo': [bio,bio], 'recarga': 5, 'clases': ['instinto','unico','instant'],
               'efectos': [invul(1,'equipo')]}
    elif forma == 'kin':        # Kin: barato pero encadenado (exponer → castigo)
        nv1 = {'n': b, 'desc': '20 de daño a un enemigo.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','rango','instant'], 'efectos': [dmg(20)]}
        nv4 = {'n': pick(key,'m',['Acorralar','Cercar','Hostigar']),
               'desc': '10 de daño; ademas no puede reducir daño ni volverse invulnerable 2 turnos.',
               'costo': ['comodin'], 'recarga': 1, 'clases': ['instinto','rango','instant'],
               'efectos': [dmg(10), exponer(2)]}
        nv8 = {'n': pick(key,'u',['Golpe de gracia','Zarpa oportuna','Rafaga']),
               'desc': '40 de daño y le quema 1 energia al enemigo.',
               'costo': [o,'comodin'], 'recarga': 1, 'clases': ['fisico','unico','instant'],
               'efectos': [dmg(40), quemar(1)]}
    else:                       # Neji: presion constante, todo con recarga 1
        nv1 = {'n': b, 'desc': '25 de daño por turno durante 2 turnos.',
               'costo': [bio,'comodin'], 'recarga': 1, 'clases': ['fisico','melee','sostenido'],
               'efectos': [dot(25,2)]}
        nv4 = {'n': pick(key,'u',['Remolino','Giro defensivo','Torbellino']),
               'desc': 'Invulnerable 1 turno Y 15 de daño a TODOS los enemigos.',
               'costo': [bio], 'recarga': 1, 'clases': ['fisico','unico','instant'],
               'efectos': [invul(1), area(15)]}
        nv8 = {'n': f, 'desc': '40 de daño y el enemigo pierde 1 energia al azar.',
               'costo': [bio,o], 'recarga': 1, 'clases': ['fisico','melee','unico','instant'],
               'efectos': [dmg(40), quemar(1)]}
    return nv1, nv4, nv8

def kit_heal(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico'])
    o = otro_bio(key, bio)
    forma = pick(key, 'forma', ['sakura', 'rin', 'hinata'])
    if forma == 'sakura':       # Sakura: puno que aturde + cura barata + modo
        nv1 = {'n': b, 'desc': '20 de daño y aturde sus habilidades fisicas 1 turno.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','melee','instant'],
               'efectos': [dmg(20), stun(1,'enemigo','fisico')]}
        nv4 = {'n': pick(key,'m',['Cuido de manada','Lamer heridas','Amparo']),
               'desc': 'Cura 25 a un aliado.',
               'costo': [o], 'recarga': 0, 'clases': ['natural','instant'], 'efectos': [cura(25)]}
        nv8 = {'n': pick(key,'u',['Coraje','Segundo aire']),
               'desc': 'MODO: 4 turnos recibiendo 10 menos de daño.',
               'costo': ['comodin'], 'recarga': 4, 'clases': ['instinto','unico','instant'],
               'efectos': [modo(4), reduc(10,4)]}
    elif forma == 'rin':        # Rin: medica pura, cura y limpia
        nv1 = {'n': b, 'desc': '15 de daño que atraviesa la defensa destructible.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','rango','instant'],
               'efectos': [{'t':'daño','v':15,'obj':'enemigo','ignoraDefensa':True}]}
        nv4 = {'n': pick(key,'m',['Acicalar','Abrigo','Arrimo']),
               'desc': 'Cura 25 a un aliado y le quita los efectos daninos.',
               'costo': [o], 'recarga': 0, 'clases': ['natural','instant'], 'efectos': [cura(25), limpiar()]}
        nv8 = {'n': pick(key,'u',['Nido seguro','Querencia','Madriguera']),
               'desc': 'Un aliado se cura 10 por turno durante 3 turnos.',
               'costo': ['comodin','comodin'], 'recarga': 3, 'clases': ['natural','sostenido'],
               'efectos': [{'t':'curarTurnos','v':10,'turnos':3,'obj':'aliado'}]}
    else:                       # Hinata: dano sostenido + area que protege al equipo
        nv1 = {'n': b, 'desc': '20 de daño por turno durante 2 turnos.',
               'costo': [bio,'comodin'], 'recarga': 1, 'clases': ['fisico','melee','sostenido'],
               'efectos': [dot(20,2)]}
        nv4 = {'n': pick(key,'u',['Coro del monte','Canto del bosque','Brote']),
               'desc': '15 de daño a TODOS y tu equipo gana 10 de defensa destructible.',
               'costo': [o,'comodin'], 'recarga': 0, 'clases': ['natural','unico','instant'],
               'efectos': [area(15), defen(10,'equipo')]}
        nv8 = {'n': pick(key,'u',['Aliento vital','Savia nueva']),
               'desc': 'MODO: 4 turnos recibiendo 15 menos de daño.',
               'costo': ['comodin'], 'recarga': 4, 'clases': ['instinto','unico','instant'],
               'efectos': [modo(4), reduc(15,4)]}
    return nv1, nv4, nv8

def kit_poison(key, bio, cat, rareza):
    o = otro_bio(key, bio)
    forma = pick(key, 'forma', ['shino', 'obito', 'dosu'])
    if forma == 'shino':        # Shino: toxina que ROBA energia + muro de equipo
        nv1 = {'n': pick(key,'m',['Drenar','Sangria','Sorbo']),
               'desc': '20 de toxina y le ROBA 1 energia al enemigo.',
               'costo': [bio,'comodin'], 'recarga': 1, 'clases': ['toxina','rango','unico','instant'],
               'efectos': [{'t':'daño','v':20,'obj':'enemigo','toxina':True}, robar(1)]}
        nv4 = {'n': pick(key,'b',['Toxina','Secrecion','Roce toxico']),
               'desc': '15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.',
               'costo': [bio], 'recarga': 0, 'clases': ['toxina','rango','sostenido'], 'efectos': [dot(15,2)]}
        nv8 = {'n': pick(key,'u',['Barrera viva','Parapeto','Enjambre guardian']),
               'desc': 'Todo tu equipo gana 20 de defensa destructible.',
               'costo': [o,'comodin'], 'recarga': 3, 'clases': ['natural','unico','instant'],
               'efectos': [defen(20,'equipo')]}
    elif forma == 'obito':      # Obito: golpe perforante barato + quemadura + modo
        nv1 = {'n': pick(key,'b',['Espina ponzoñosa','Picadura toxica','Baba acida']),
               'desc': '15 de daño que atraviesa la defensa destructible.',
               'costo': ['comodin'], 'recarga': 0, 'clases': ['fisico','rango','instant'],
               'efectos': [{'t':'daño','v':15,'obj':'enemigo','ignoraDefensa':True}]}
        nv4 = {'n': pick(key,'m',['Ponzoña','Emponzoñar','Savia negra']),
               'desc': '20 de toxina por turno durante 2 turnos.',
               'costo': [bio], 'recarga': 1, 'clases': ['toxina','rango','sostenido'], 'efectos': [dot(20,2)]}
        nv8 = {'n': pick(key,'u',['Miasma','Bruma acida','Rocio negro']),
               'desc': 'MODO: 4 turnos recibiendo 15 menos de daño.',
               'costo': ['comodin'], 'recarga': 4, 'clases': ['instinto','unico','instant'],
               'efectos': [modo(4), reduc(15,4)]}
    else:                       # Dosu: expone y deja MARCA permanente (mata tanques)
        nv1 = {'n': pick(key,'b',['Picadura toxica','Toxina','Aguijonazo']),
               'desc': '20 de daño; ademas no puede reducir daño ni volverse invulnerable 2 turnos.',
               'costo': [bio], 'recarga': 1, 'clases': ['toxina','rango','instant'],
               'efectos': [dmg(20), exponer(2)]}
        nv4 = {'n': pick(key,'u',['Marca letal','Herida abierta','Sello ponzoñoso']),
               'desc': '10 de daño y PERMANENTE: ese enemigo recibe +5 de daño el resto del combate. Acumulable.',
               'costo': [o], 'recarga': 1, 'clases': ['toxina','unico','instant'],
               'efectos': [dmg(10), {'t':'marcaPermanente','v':5,'obj':'enemigo'}]}
        nv8 = {'n': pick(key,'u',['Nube toxica','Brote venenoso']),
               'desc': '20 de toxina a TODOS los enemigos.',
               'costo': [bio,'comodin'], 'recarga': 3, 'clases': ['toxina','unico','instant'],
               'efectos': [{'t':'daño','v':20,'obj':'todos','toxina':True}]}
    return nv1, nv4, nv8

def kit_shield(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico'])
    o = otro_bio(key, bio)
    forma = pick(key, 'forma', ['gaara', 'chouji', 'zaku'])
    if forma == 'gaara':        # Gaara: control + defensa GRATIS + coraza permanente
        nv1 = {'n': pick(key,'m',['Atrapar','Enterrar','Trabar']),
               'desc': 'Aturde sus habilidades fisicas 2 turnos.',
               'costo': [bio,'comodin'], 'recarga': 2, 'clases': ['natural','rango','control'],
               'efectos': [stun(2,'enemigo','fisico')]}
        nv4 = {'n': b, 'desc': 'GRATIS: gana 20 de defensa destructible.',
               'costo': [], 'recarga': 2, 'clases': ['natural','instant'], 'efectos': [defen(20)]}
        nv8 = {'n': pick(key,'u',['Coraza ancestral','Caparazon eterno','Piel de piedra']),
               'desc': 'PERMANENTE: 40 de defensa destructible; se reaplica sola.',
               'costo': ['comodin'], 'recarga': 4, 'clases': ['natural','unico','instant'],
               'efectos': [{'t':'defensa','v':40,'obj':'self','permanente':True}]}
    elif forma == 'chouji':     # Chouji: se vuelve intocable mientras arrolla
        nv1 = {'n': b, 'desc': '20 de daño a un enemigo.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(20)]}
        nv4 = {'n': pick(key,'m',['Hacerse bola','Encogerse','Rodar']),
               'desc': 'Invulnerable 2 turnos mientras hace 10 de daño por turno.',
               'costo': [o], 'recarga': 2, 'clases': ['fisico','melee','sostenido'],
               'efectos': [invul(2), dot(10,2)]}
        nv8 = {'n': pick(key,'u',['Cerrar filas','Escudo de manada']),
               'desc': 'Todo tu equipo recibe 10 menos de daño durante 3 turnos.',
               'costo': ['comodin'], 'recarga': 3, 'clases': ['instinto','unico','sostenido'],
               'efectos': [reduc(10,3,'equipo')]}
    else:                       # Zaku: setup barato + contraataque + bombazo en area
        nv1 = {'n': b, 'desc': '25 de daño a un enemigo.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','rango','instant'], 'efectos': [dmg(25)]}
        nv4 = {'n': pick(key,'m',['Guardia con puas','Ponerse tieso','Erizarse']),
               'desc': 'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de daño.',
               'costo': ['comodin'], 'recarga': 2, 'clases': ['fisico','unico','control'],
               'efectos': [contra(25)]}
        nv8 = {'n': pick(key,'u',['Andanada','Estruendo','Onda expansiva']),
               'desc': '45 de daño a TODOS los enemigos.',
               'costo': [bio,'comodin','comodin'], 'recarga': 3, 'clases': ['fisico','rango','unico','instant'],
               'efectos': [area(45)]}
    return nv1, nv4, nv8

def kit_thorns(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico'])
    o = otro_bio(key, bio)
    forma = pick(key, 'forma', ['puas', 'coraza'])
    if forma == 'puas':
        nv1 = {'n': b, 'desc': '20 de daño a un enemigo.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(20)]}
        nv4 = {'n': pick(key,'m',['Erizarse','Espinas al aire']),
               'desc': 'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de daño.',
               'costo': [bio], 'recarga': 3, 'clases': ['fisico','unico','control'], 'efectos': [contra(25)]}
        nv8 = {'n': pick(key,'u',['Lluvia de puas','Andanada de espinas']),
               'desc': '20 de daño a TODOS los enemigos.',
               'costo': [bio,'comodin'], 'recarga': 4, 'clases': ['fisico','rango','instant'], 'efectos': [area(20)]}
    else:
        nv1 = {'n': b, 'desc': '15 de daño por turno durante 2 turnos.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','melee','sostenido'], 'efectos': [dot(15,2)]}
        nv4 = {'n': pick(key,'m',['Ponerse tieso','Guardia con puas']),
               'desc': 'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 30 de daño.',
               'costo': ['comodin'], 'recarga': 2, 'clases': ['fisico','unico','control'], 'efectos': [contra(30)]}
        nv8 = {'n': pick(key,'u',['Devolver el golpe','Represalia total']),
               'desc': 'Todo tu equipo recibe 10 menos de daño durante 3 turnos.',
               'costo': [bio,o], 'recarga': 4, 'clases': ['instinto','unico','sostenido'],
               'efectos': [reduc(10,3,'equipo')]}
    return nv1, nv4, nv8

KITS = {'rage': kit_rage, 'first': kit_first, 'heal': kit_heal,
        'poison': kit_poison, 'shield': kit_shield, 'thorns': kit_thorns}

# ---------- generar ----------
def js_val(v, ind=0):
    if isinstance(v, dict):
        items = ', '.join(f'{k}:{js_val(x)}' for k, x in v.items() if x is not None)
        return '{ ' + items + ' }'
    if isinstance(v, list):
        return '[' + ', '.join(js_val(x) for x in v) + ']'
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, (int, float)): return str(v)
    return "'" + str(v).replace("'", "\\'") + "'"

out_lines = []
stats = {'gen': 0, 'mano': 0, 'todo_a_mano': []}
for key, a in ROSTER.items():
    if key in HECHOS:
        stats['mano'] += 1
        continue
    bio = a['bio'] if a['bio'] in ('bosque','sabana','agua','montana') else 'montana'
    cat = cat_de(key)
    rareza = a['rarity']
    rol = a['ab'] if a['ab'] in KITS else 'rage'
    nv1, nv4, nv8 = KITS[rol](key, bio, cat, rareza)
    marca = ''
    if rareza in ('legendario','extinto','mitico'):
        marca = '  // TODO: kit unico a mano (legendario/mitico) — este es provisional\n'
        stats['todo_a_mano'].append(key)
    habs = []
    for h in (nv1, nv4, nv8):
        hh = {'n': h['n'], 'desc': h['desc'], 'costo': h['costo'],
              'recarga': h['recarga'], 'clases': h['clases'], 'efectos': h['efectos']}
        habs.append('      ' + js_val(hh) + ',')
    out_lines.append(
        f"  {key}: {{\n{marca}"
        f"    habs:[\n" + '\n'.join(habs) + "\n    ],\n  },")
    stats['gen'] += 1

header = f"""// ============================================================
// movesets_gen.js — GENERADO por make_movesets.py. NO editar a mano.
// Kits ARENA para los animales SIN kit propio en habilidades.js.
// Numeros del estudio de Naruto-Arena (tools/na_personajes.json, ARENA.md §2b).
// Vida 100 para todos; la rareza sube la complejidad del kit, no los numeros.
// SIN NIVELES y SIN PASIVAS: las 3 habilidades estan disponibles desde el
// principio; lo unico que limita es el COSTO EN ENERGIA DE BIOMA.
// Re-generar: python make_movesets.py --aplicar
// ============================================================

export const MOVESETS_GEN = {{
{chr(10).join(out_lines)}
}};
"""

print(f"kits generados: {stats['gen']} · a mano (respetados): {stats['mano']} · total: {stats['gen']+stats['mano']}")
print(f"provisionales que piden kit a mano ({len(stats['todo_a_mano'])}): {', '.join(stats['todo_a_mano'])}")

if '--aplicar' in sys.argv:
    open(RUTA_OUT, 'w', encoding='utf-8').write(header)
    print(f"escrito {RUTA_OUT} ({len(header)//1024} KB)")
else:
    print('(dry-run: correr con --aplicar para escribir src/movesets_gen.js)')
