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
def dmg(v, o='enemigo'): return {'t':'dano','v':v,'obj':o}
def dot(v, t, o='enemigo'): return {'t':'danoTurnos','v':v,'turnos':t,'obj':o}
def cura(v, o='aliado'): return {'t':'curar','v':v,'obj':o}
def defen(v, o='self'): return {'t':'defensa','v':v,'obj':o}
def reduc(v, t, o='self'): return {'t':'reducir','v':v,'turnos':t,'obj':o}
def invul(t=1, o='self'): return {'t':'invulnerable','turnos':t,'obj':o}
def stun(t=1, o='enemigo', clase=None): return {'t':'aturdir','turnos':t,'obj':o,'clase':clase}
def robar(n=1): return {'t':'robarEnergia','n':n,'obj':'enemigo'}
def quemar(n=1): return {'t':'quemarEnergia','n':n,'obj':'enemigo'}
def area(v): return {'t':'dano','v':v,'obj':'todos'}
def contra(v): return {'t':'contraataque','v':v,'obj':'self'}
def ampl(v, t, o='self'): return {'t':'amplificar','v':v,'turnos':t,'obj':o}
def limpiar(o='aliado'): return {'t':'limpiar','obj':o}
def exponer(t=2, o='enemigo'): return {'t':'exponer','turnos':t,'obj':o}
def modo(t=4): return {'t':'modo','turnos':t}

# ---------- plantillas de kit por rol ----------
# ECONOMIA (rebalanceada 20-jul, medida con tools/kits.mjs):
#   El problema: los basicos que costaban energia de bioma ESPECIFICO hacian que
#   un equipo se quedara sin jugar (25% de chance por energia). Medido: los roles
#   con basico gratis rendian 94% y los que pagaban bioma, 5%.
#   Regla nueva, PAREJA para todos los roles:
#     · BASICO: cuesta 1 COMODIN (cualquier energia sirve) → nadie se queda sin
#       jugar nunca. 20 de dano, recarga 0.
#     · SEGUNDA: la firma del rol. Cuesta [bio] o [bio, comodin] → aca SI importa
#       el bioma del equipo. Recarga 1-3.
#     · TERCERA: la grande. Cuesta [bio, comodin] o [bio, bio]. Recarga 3-4.
#   Asi el bioma sigue decidiendo la estrategia (cada cuanto usas lo bueno) pero
#   ningun animal queda inutilizable.
def kit_rage(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico']); f = pick(key, 'f', V[cat]['fuerte'])
    nv1 = {'n': b, 'desc': '20 de dano a un enemigo.',
           'costo': ['comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(20)]}
    if rareza == 'comun':
        nv4 = {'n': f, 'desc': '35 de dano a un enemigo.',
               'costo': [bio], 'recarga': 1, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(35)]}
        nv8 = {'n': pick(key,'u',['Rugido','Frenesi','Carga salvaje','Estampida','Berrinche','Arremetida','Bramido']),
               'desc': '20 de dano a TODOS los enemigos.',
               'costo': [bio,'comodin'], 'recarga': 3, 'clases': ['fisico','instant'], 'efectos': [area(20)]}
    elif rareza == 'raro':
        nv4 = {'n': f, 'desc': '40 de dano y el enemigo pierde 1 energia al azar.',
               'costo': [bio,'comodin'], 'recarga': 1, 'clases': ['fisico','melee','instant'],
               'efectos': [dmg(40), quemar(1)]}
        nv8 = {'n': pick(key,'u',['Frenesi','Rabia del monte','Furia ciega','Descarga animal','Tromba']),
               'desc': '20 de dano a TODOS los enemigos y quema 1 energia.',
               'costo': [bio,bio], 'recarga': 3, 'clases': ['fisico','unico','instant'],
               'efectos': [area(20), quemar(1)]}
    else:
        nv4 = {'n': f, 'desc': '30 de dano. Durante su modo pega +15.',
               'costo': [bio], 'recarga': 0, 'clases': ['fisico','melee','instant'],
               'efectos': [dmg(30)], 'enModo': [dmg(45)]}
        nv8 = {'n': pick(key,'u',['Instinto depredador','Furia ancestral','Sangre en el aire','Modo cazador','Celo']),
               'desc': 'MODO: 4 turnos con 15 menos de dano recibido y sus ataques mejorados.',
               'costo': [bio,'comodin'], 'recarga': 4, 'clases': ['instinto','unico','instant'],
               'efectos': [modo(4), reduc(15,4)]}
    return nv1, nv4, nv8

def kit_first(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico'])
    nv1 = {'n': b, 'desc': '20 de dano a un enemigo.',
           'costo': ['comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(20)]}
    nv4 = {'n': pick(key,'m',['Marcar presa','Acorralar','Hostigar','Rastrear','Cercar','Delatar','Perseguir']),
           'desc': '15 de dano; ademas ese enemigo no puede reducir dano ni volverse invulnerable por 3 turnos.',
           'costo': [bio], 'recarga': 1, 'clases': ['instinto','rango','instant'],
           'efectos': [dmg(15), exponer(3)]}
    if rareza in ('comun','raro'):
        nv8 = {'n': pick(key,'u',['Remolino','Giro defensivo','Torbellino','Barrida','Vuelta rapida']),
               'desc': 'Invulnerable 1 turno y 20 de dano a TODOS los enemigos.',
               'costo': [bio,'comodin'], 'recarga': 3, 'clases': ['fisico','unico','instant'],
               'efectos': [invul(1), area(20)]}
    else:
        nv8 = {'n': pick(key,'u',['Velocidad cegadora','Instinto agudo','Sentidos alerta','Reflejo puro','Ojo fino']),
               'desc': 'MODO: 4 turnos; recibe 15 menos de dano y sus golpes pegan mas.',
               'costo': [bio,'comodin'], 'recarga': 4, 'clases': ['instinto','unico','instant'],
               'efectos': [modo(4), reduc(15,4)]}
    return nv1, nv4, nv8

def kit_heal(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico'])
    nv1 = {'n': b, 'desc': '20 de dano a un enemigo.',
           'costo': ['comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(20)]}
    nv4 = {'n': pick(key,'m',['Cuido de manada','Acicalar','Amparo','Lamer heridas','Abrigo','Companía','Arrimo']),
           'desc': 'Cura 25 a un aliado.',
           'costo': [bio], 'recarga': 1, 'clases': ['natural','instant'], 'efectos': [cura(25)]}
    if rareza in ('comun','raro'):
        nv8 = {'n': pick(key,'u',['Refugio','Cuido constante','Nido seguro','Querencia','Madriguera']),
               'desc': 'Un aliado se cura 10 por turno durante 3 turnos y pierde los efectos daninos.',
               'costo': [bio,'comodin'], 'recarga': 4, 'clases': ['natural','sostenido'],
               'efectos': [{'t':'curarTurnos','v':10,'turnos':3,'obj':'aliado'}, limpiar()]}
    else:
        nv8 = {'n': pick(key,'u',['Canto del bosque','Aliento vital','Savia nueva','Coro del monte','Brote']),
               'desc': 'Todo el equipo gana 15 de defensa destructible y cura 15.',
               'costo': [bio,bio], 'recarga': 4, 'clases': ['natural','unico','instant'],
               'efectos': [defen(15,'equipo'), cura(15,'equipo')]}
    return nv1, nv4, nv8

def kit_poison(key, bio, cat, rareza):
    nv1 = {'n': pick(key,'b',['Toxina','Secrecion','Picadura toxica','Baba acida','Espina ponzoñosa','Roce toxico']),
           'desc': '15 de toxina por turno durante 2 turnos. Atraviesa invulnerabilidad.',
           'costo': ['comodin'], 'recarga': 0, 'clases': ['toxina','sostenido'], 'efectos': [dot(15,2)]}
    if rareza in ('comun','raro'):
        nv4 = {'n': pick(key,'m',['Veneno espeso','Ponzoña','Toxina densa','Savia negra','Emponzoñar']),
               'desc': '25 de toxina por turno durante 2 turnos.',
               'costo': [bio], 'recarga': 1, 'clases': ['toxina','sostenido'], 'efectos': [dot(25,2)]}
        nv8 = {'n': pick(key,'u',['Nube toxica','Brote venenoso','Bruma acida','Miasma','Rocio negro']),
               'desc': '20 de toxina a TODOS los enemigos.',
               'costo': [bio,'comodin'], 'recarga': 3, 'clases': ['toxina','unico','instant'],
               'efectos': [{'t':'dano','v':20,'obj':'todos','toxina':True}]}
    else:
        nv4 = {'n': pick(key,'m',['Drenar','Sangria','Chupar savia','Succion','Sorbo']),
               'desc': '25 de toxina y le ROBA 1 energia al enemigo.',
               'costo': [bio], 'recarga': 1, 'clases': ['toxina','unico','instant'],
               'efectos': [{'t':'dano','v':25,'obj':'enemigo','toxina':True}, robar(1)]}
        nv8 = {'n': pick(key,'u',['Marca letal','Toxina persistente','Herida abierta','Sello ponzoñoso']),
               'desc': '15 de dano y PERMANENTE: ese enemigo recibe +5 de dano el resto del combate. Acumulable.',
               'costo': [bio,'comodin'], 'recarga': 1, 'clases': ['toxina','unico','instant'],
               'efectos': [dmg(15), {'t':'marcaPermanente','v':5,'obj':'enemigo'}]}
    return nv1, nv4, nv8

def kit_shield(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico'])
    nv1 = {'n': b, 'desc': '20 de dano a un enemigo.',
           'costo': ['comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(20)]}
    nv4 = {'n': pick(key,'m',['Acorazarse','Atrincherarse','Plantarse','Encogerse','Hacerse bola','Aguantar']),
           'desc': 'Gana 30 de defensa destructible.',
           'costo': [bio], 'recarga': 3, 'clases': ['natural','instant'], 'efectos': [defen(30)]}
    if rareza in ('comun','raro'):
        nv8 = {'n': pick(key,'u',['Muralla','Cerrar filas','Barrera viva','Escudo de manada','Parapeto']),
               'desc': 'Todo el equipo gana 20 de defensa destructible.',
               'costo': [bio,'comodin'], 'recarga': 4, 'clases': ['natural','unico','instant'],
               'efectos': [defen(20,'equipo')]}
    else:
        nv8 = {'n': pick(key,'u',['Coraza ancestral','Piel de piedra','Caparazon eterno','Corteza dura']),
               'desc': 'PERMANENTE: gana 40 de defensa destructible; se reaplica sola, no se acumula.',
               'costo': [bio,'comodin'], 'recarga': 4, 'clases': ['natural','unico','instant'],
               'efectos': [{'t':'defensa','v':40,'obj':'self','permanente':True}]}
    return nv1, nv4, nv8

def kit_thorns(key, bio, cat, rareza):
    b = pick(key, 'b', V[cat]['basico'])
    nv1 = {'n': b, 'desc': '20 de dano a un enemigo.',
           'costo': ['comodin'], 'recarga': 0, 'clases': ['fisico','melee','instant'], 'efectos': [dmg(20)]}
    nv4 = {'n': pick(key,'m',['Erizarse','Guardia con puas','Espinas al aire','Ponerse tieso']),
           'desc': 'CONTRAATAQUE: 2 turnos, quien lo ataque recibe 25 de dano.',
           'costo': [bio], 'recarga': 3, 'clases': ['fisico','unico','control'], 'efectos': [contra(25)]}
    nv8 = {'n': pick(key,'u',['Lluvia de puas','Represalia total','Andanada de espinas','Devolver el golpe']),
           'desc': '20 de dano a TODOS los enemigos.',
           'costo': [bio,'comodin'], 'recarga': 4, 'clases': ['fisico','rango','instant'], 'efectos': [area(20)]}
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
