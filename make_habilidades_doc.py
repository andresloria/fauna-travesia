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

# aturdir: el motor guarda UNA clase por efecto, así que un aturdido de varias
# clases se emite como varios efectos de aturdir.
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
# los 62 que faltan crear se detectan solos (no están en MAPA con key)

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
        for cl in ATURDE_CLASES.get(m['aturde'], [None]):
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

    salida, reporte_falta, sin_efecto, aproximadas = {}, [], [], []
    variantes = collections.OrderedDict()

    for animal, lista in por_animal.items():
        key = MAPA.get(animal)
        if not key:
            continue
        # el kit base es el 1º COMPLETO (4 habilidades). El documento trae un par
        # de kits truncados; si todos lo están, se usa el primero tal cual.
        pers, cat, habs = next((k for k in lista if len(k[2]) == 4), lista[0])
        otras = [p for p, c, h in lista if (p, c, h) != (pers, cat, habs)]
        if otras:
            variantes[key] = list(dict.fromkeys(otras))

        out = []
        for r in habs:
            cl, bypass = clases_de(r['clases'])
            efs, falta = efectos_de(r['mecanica'], bypass, r.get('efecto_en', ''))
            if not efs and (key, r['nombre_es']) in APROX:
                efs = APROX[(key, r['nombre_es'])]
                aproximadas.append((animal, r['nombre_es'], r['efecto_en'][:110]))
            desc = describir(efs)
            if efs and not desc:
                raise SystemExit(f'{key}/{r["nombre_es"]}: tiene efectos pero la '
                                 f'descripción salió vacía — no se puede publicar así')
            if not efs:
                sin_efecto.append((animal, r['nombre_es'], r['efecto_en'][:90]))
                desc = '(sin efecto mecánico todavía — ver reporte)'
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
        salida[key] = {'habs': out, 'origen': f'{pers} · {cat}'}

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
    L.append('// Kits alternativos que trae el documento para el mismo animal (otras')
    L.append('// versiones del personaje original). Todavía no se usan.')
    L.append('export const VARIANTES_DOC = ' + js({k: v for k, v in variantes.items()}) + ';')
    L.append('')
    SALIDA.write_text('\n'.join(L), encoding='utf-8')

    # ---- reporte ----
    faltan_crear = sorted({r['animal'] for r in d} - {a for a in MAPA if MAPA.get(a)}
                          - {'Salamanqueja'})
    grupos = {}
    for r in d:
        grupos.setdefault(r['animal'], r['grupo'])

    R = ['# Reporte de habilidades (documento de Andrés)', '',
         f'- Habilidades en el documento: **{len(d)}** · animales: **{len(por_animal)}**',
         f'- Animales que YA existen en el juego y quedaron con kit oficial: **{len(salida)}**',
         f'- Animales que **falta crear**: **{len(faltan_crear)}**', '',
         '## Animales que faltan crear', '',
         '| Animal | Grupo | Habilidades en el doc |', '|---|---|---|']
    for a in faltan_crear:
        R.append(f'| {a} | {grupos[a]} | {sum(1 for r in d if r["animal"] == a)} |')

    R += ['', '## Mecánicas que el motor todavía no hace', '',
          'Estas habilidades se aplicaron **sin** esa parte. La descripción que ve el',
          'jugador NO la menciona, así que el texto no miente; queda pendiente para',
          'cuando el motor las soporte.', '',
          '| Animal | Habilidad | Falta |', '|---|---|---|']
    for animal, key, hab, falta in reporte_falta:
        R.append(f'| {animal} | {hab} | {"; ".join(falta)} |')

    if sin_efecto:
        R += ['', '## Habilidades que quedaron SIN efecto', '',
              'El documento no trae mecánica estructurada para estas (el efecto completo',
              'en inglés describe cosas que hay que codificar a mano).', '',
              '| Animal | Habilidad | Efecto original (EN) |', '|---|---|---|']
        for animal, hab, en in sin_efecto:
            R.append(f'| {animal} | {hab} | {en}… |')

    if aproximadas:
        R += ['', '## Habilidades APROXIMADAS a mano', '',
              'El documento no traía mecánica estructurada para estas (su efecto original',
              'usa reflejos, sellos, invocaciones o vínculos de vida, que el motor no tiene).',
              'Se aproximaron leyendo el efecto completo en inglés. **La descripción que ve',
              'el jugador dice lo que de verdad hace la versión nuestra**, no la original.', '',
              '| Animal | Habilidad | Efecto original (EN) |', '|---|---|---|']
        for animal, hab, en in aproximadas:
            R.append(f'| {animal} | {hab} | {en}… |')

    if variantes:
        R += ['', '## Kits alternativos disponibles (no usados todavía)', '',
              '| Especie | Otras versiones en el documento |', '|---|---|']
        for k, v in variantes.items():
            R.append(f'| {k} | {", ".join(v)} |')

    REPORTE.write_text('\n'.join(R), encoding='utf-8')

    print(f'OK {SALIDA.name}: {len(salida)} especies con kit oficial')
    print(f'   faltan crear: {len(faltan_crear)} animales')
    print(f'   habilidades con mecánica parcial: {len(reporte_falta)}')
    print(f'   habilidades aproximadas a mano: {len(aproximadas)}')
    print(f'   habilidades sin efecto: {len(sin_efecto)}')
    # aviso: aproximaciones escritas para kits que al final no se usaron
    usadas = {(k, h) for k, h, _ in
              [(MAPA[a], n, e) for a, n, e in aproximadas]} if aproximadas else set()
    sobran = [k for k in APROX if k not in {(MAPA[a], n) for a, n, _ in aproximadas}]
    if sobran:
        print(f'   ⚠️ {len(sobran)} aproximaciones sin usar (su kit no quedó de base): '
              + ', '.join(f'{k[0]}/{k[1]}' for k in sobran))
    print(f'OK {REPORTE.name}')


if __name__ == '__main__':
    main()
