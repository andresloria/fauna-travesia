# -*- coding: utf-8 -*-
# ============================================================
# make_musica_pelea.py — MÚSICA DE COMBATE: power metal.
#
# Reemplaza el chiptune 8-bit de las peleas. Todo sintetizado por código
# (numpy), melodía 100% ORIGINAL — nada sampleado ni con copyright.
#
# Los ingredientes del género, uno por uno:
#   · GUITARRAS: acordes de quinta (power chords) de sierra, con dos guitarras
#     desafinadas entre sí unos cents y paneadas a los lados. La distorsión es
#     saturación suave (tanh), que es lo que hace un ampli a válvulas.
#   · PALM MUTE: cada corchea con envolvente corta y seca, el galope del género.
#   · BATERÍA: doble bombo en semicorcheas, caja en 2 y 4, hi-hat en corcheas.
#   · LEAD: melodía rápida en menor armónica (la escala épica) con vibrato,
#     duplicada una tercera arriba = las "guitarras gemelas".
#   · BAJO: la fundamental una octava abajo, siempre.
#
# Progresión: i - VI - VII - i en Mi menor, la más usada del power metal.
# Salida: assets/audio/pelea_metal.mp3 (loop de ~46 s, calza al empalmar)
# Re-correr:  python make_musica_pelea.py
# ============================================================
import numpy as np, lameenc, pathlib

SR = 44100
BPM = 168                       # rápido, como pide el género
BEAT = 60.0 / BPM               # duración de una negra
BAR = BEAT * 4
OUT = pathlib.Path(__file__).parent / "assets" / "audio"
OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(11)

NOTAS = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
def midi(n):
    i = 2 if len(n) > 1 and n[1] == '#' else 1
    return (int(n[i:]) + 1) * 12 + NOTAS[n[:i]]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12.0)

def sierra(f, t, detune=0.0):
    """onda de sierra; detune en cents desafina un poco (dos guitarras nunca
    están perfectamente afinadas entre sí, y de ahí sale el grosor)"""
    f = f * 2 ** (detune / 1200.0)
    return 2.0 * ((f * t) % 1.0) - 1.0

def env(n, ataque, caida, sostiene=0.0):
    """envolvente simple ataque/caída, en muestras"""
    e = np.ones(n)
    a = max(1, int(ataque * SR)); d = max(1, int(caida * SR))
    e[:a] = np.linspace(0, 1, a)
    cola = min(d, n - a)
    if cola > 0:
        e[a:a + cola] = np.linspace(1, sostiene, cola)
        e[a + cola:] = sostiene
    return e

def distorsion(x, ganancia=9.0):
    """saturación suave: el ampli a válvulas comprime en vez de recortar duro"""
    return np.tanh(x * ganancia) / np.tanh(ganancia)

# ---------------- pistas ----------------
LARGO = 32                                   # compases
N = int(BAR * LARGO * SR)
izq = np.zeros(N); der = np.zeros(N)

def poner(buf, x, t0):
    i = int(t0 * SR)
    n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n]

# --- progresión: i VI VII i (Mi menor) por cada 4 compases ---
PROG = ['E2', 'C2', 'D2', 'E2'] * 4

def power_chord(nota, dur, mute):
    """acorde de quinta: fundamental + quinta + octava"""
    n = int(dur * SR); t = np.arange(n) / SR
    m = midi(nota)
    voces = [m, m + 7, m + 12]
    seco = env(n, 0.002, 0.05 if mute else dur * 0.9, 0.0 if mute else 0.55)
    g1 = sum(sierra(hz(v), t, -7) for v in voces)
    g2 = sum(sierra(hz(v), t, +7) for v in voces)
    return distorsion(g1 * seco * .33), distorsion(g2 * seco * .33)

# galope de corcheas con palm mute, con acentos al principio de cada compás
for c in range(LARGO):
    raiz = PROG[c % len(PROG)]
    for octava in range(8):                       # 8 corcheas por compás
        t0 = c * BAR + octava * (BEAT / 2)
        abierto = (octava == 0)                   # la primera suena larga
        dur = BEAT * 1.6 if abierto else BEAT * 0.42
        a, b = power_chord(raiz, dur, mute=not abierto)
        vol = 0.9 if abierto else 0.62
        poner(izq, a * vol, t0); poner(der, b * vol, t0)

# --- bajo: la fundamental una octava abajo, en negras ---
for c in range(LARGO):
    m = midi(PROG[c % len(PROG)]) - 12
    for negra in range(4):
        t0 = c * BAR + negra * BEAT
        n = int(BEAT * 0.95 * SR); t = np.arange(n) / SR
        x = (sierra(hz(m), t) * .5 + np.sin(2 * np.pi * hz(m) * t) * .5)
        x *= env(n, 0.004, BEAT * .8, .3) * .5
        poner(izq, x, t0); poner(der, x, t0)

# --- batería ---
def bombo(dur=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 120 * np.exp(-t * 34) + 42               # el golpe: la altura cae rapidísimo
    x = np.sin(2 * np.pi * np.cumsum(f) / SR)
    return x * np.exp(-t * 26) * .95

def caja(dur=0.19):
    n = int(dur * SR); t = np.arange(n) / SR
    ruido = rng.standard_normal(n) * np.exp(-t * 22)
    cuerpo = np.sin(2 * np.pi * 190 * t) * np.exp(-t * 30) * .6
    return (ruido * .8 + cuerpo) * .55

def hihat(dur=0.05, abierto=False):
    n = int(dur * (4 if abierto else 1) * SR); t = np.arange(n) / SR
    return rng.standard_normal(n) * np.exp(-t * (9 if abierto else 60)) * .12

def plato(dur=1.2):
    n = int(dur * SR); t = np.arange(n) / SR
    return rng.standard_normal(n) * np.exp(-t * 3.6) * .20

for c in range(LARGO):
    for s in range(16):                           # semicorcheas
        t0 = c * BAR + s * (BEAT / 4)
        poner(izq, bombo() * .5, t0); poner(der, bombo() * .5, t0)   # DOBLE BOMBO
        if s % 2 == 0:
            h = hihat()
            poner(izq, h * .7, t0); poner(der, h, t0)
    for negra in (1, 3):                          # caja en 2 y 4
        t0 = c * BAR + negra * BEAT
        poner(izq, caja(), t0); poner(der, caja(), t0)
    if c % 4 == 0:                                # plato al abrir cada frase
        poner(izq, plato() * .8, c * BAR); poner(der, plato(), c * BAR)

# --- lead: menor armónica, con vibrato y guitarra gemela una tercera arriba ---
# Mi menor armónica: E F# G A B C D#
ESCALA = ['E4','F#4','G4','A4','B4','C5','D#5','E5','F#5','G5','A5','B5']
FRASES = [
    [0,2,4,6,4,2,4,7],  [7,6,4,2,4,6,7,9],
    [4,6,7,9,7,6,4,2],  [0,4,7,11,9,7,4,2],
]
def lead(nota, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = hz(midi(nota))
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.12)
    x = sierra(f * vib, t) * .6 + np.sin(2 * np.pi * f * vib * t) * .4
    return distorsion(x * env(n, 0.006, dur * .9, .5), 5.0) * .34

for c in range(8, LARGO):                        # entra cuando ya se asentó el riff
    fr = FRASES[(c - 8) % len(FRASES)]
    for i, gi in enumerate(fr):
        t0 = c * BAR + i * (BEAT / 2)
        dur = BEAT * 0.48
        n1 = ESCALA[gi % len(ESCALA)]
        n2 = ESCALA[(gi + 2) % len(ESCALA)]      # la tercera de arriba
        poner(izq, lead(n1, dur), t0)
        poner(der, lead(n2, dur) * .8, t0)

# ---------------- mezcla ----------------
def limitar(x):
    x = np.tanh(x * 0.85)                        # pega el techo sin recortar feo
    return x / (np.max(np.abs(x)) + 1e-9)

izq = limitar(izq); der = limitar(der)

# empalme: los últimos 60 ms se funden con el arranque para que el loop no chasquee
cruce = int(0.06 * SR)
for canal in (izq, der):
    f = np.linspace(0, 1, cruce)
    canal[:cruce] = canal[:cruce] * f + canal[-cruce:] * (1 - f)
izq = izq[:-cruce]; der = der[:-cruce]

inter = np.empty(len(izq) * 2, dtype=np.float32)
inter[0::2] = izq; inter[1::2] = der
pcm = (np.clip(inter, -1, 1) * 32767).astype(np.int16)

enc = lameenc.Encoder()
enc.set_bit_rate(160); enc.set_in_sample_rate(SR); enc.set_channels(2)
enc.set_quality(2)
mp3 = enc.encode(pcm.tobytes()) + enc.flush()
destino = OUT / "pelea_metal.mp3"
destino.write_bytes(mp3)
print(f"OK {destino.name} · {len(izq)/SR:.1f}s · {BPM} BPM · {len(mp3)//1024} KB")
