# -*- coding: utf-8 -*-
# ============================================================
# make_musica_aventura.py — TEMA GENERAL del juego (selección de equipo).
#
# Reemplaza el ambiente relajante 8-bit: Andrés pidió algo MÁS EMOCIONANTE
# para todo el juego (22-jul). Es un tema de AVENTURA: enérgico y luminoso,
# pero distinto del power metal de las peleas (aquél es Mi menor distorsionado
# a 168; éste es Re mayor limpio a 152 — así el salto a la pelea se siente).
#
# Ingredientes:
#   · batería de rock: bombo marcado, caja en 2 y 4, hats corriendo
#   · bajo pulsante en corcheas (el motor del tema)
#   · acordes I–V–vi–IV en Re mayor (la progresión luminosa por excelencia)
#   · arpegio brillante de pluck + melodía heroica que entra en la 2ª vuelta
#   · saturación MUY suave (energía sin volverse metal)
#
# Todo sintetizado con numpy, melodía 100% original.
# Salida: assets/audio/aventura.mp3 (~40 s en loop, empalme sin chasquido)
# Re-correr:  python make_musica_aventura.py
# ============================================================
import numpy as np, lameenc, pathlib

SR = 44100
BPM = 152
BEAT = 60.0 / BPM
BAR = BEAT * 4
LARGO = 24                       # compases
OUT = pathlib.Path(__file__).parent / "assets" / "audio"
rng = np.random.default_rng(23)

NOTAS = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
def midi(n):
    i = 2 if len(n) > 1 and n[1] == '#' else 1
    return (int(n[i:]) + 1) * 12 + NOTAS[n[:i]]
def hz(m): return 440.0 * 2 ** ((m - 69) / 12.0)

def sierra(f, t, detune=0.0):
    f = f * 2 ** (detune / 1200.0)
    return 2.0 * ((f * t) % 1.0) - 1.0

def env(n, ataque, caida, sostiene=0.0):
    e = np.ones(n)
    a = max(1, int(ataque * SR)); d = max(1, int(caida * SR))
    e[:a] = np.linspace(0, 1, a)
    cola = min(d, n - a)
    if cola > 0:
        e[a:a + cola] = np.linspace(1, sostiene, cola)
        e[a + cola:] = sostiene
    return e

def suave(x, g=2.4):
    return np.tanh(x * g) / np.tanh(g)

N = int(BAR * LARGO * SR)
izq = np.zeros(N); der = np.zeros(N)

def poner(buf, x, t0):
    i = int(t0 * SR)
    n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n]

# --- progresión: I V vi IV en Re mayor, un acorde por compás ---
PROG = [('D3', 'maj'), ('A2', 'maj'), ('B2', 'min'), ('G2', 'maj')] * 6

def acorde(nota, tipo):
    m = midi(nota)
    return [m, m + (4 if tipo == 'maj' else 3), m + 7, m + 12]

# --- colchón de acordes: sierra doble suave, medio compás por golpe ---
for c in range(LARGO):
    raiz, tipo = PROG[c % 4]
    voces = acorde(raiz, tipo)
    for mitad in range(2):
        t0 = c * BAR + mitad * (BAR / 2)
        n = int(BAR / 2 * SR * 0.96); t = np.arange(n) / SR
        g1 = sum(sierra(hz(v) * 2, t, -6) for v in voces)     # una octava arriba
        g2 = sum(sierra(hz(v) * 2, t, +6) for v in voces)
        e = env(n, 0.02, BAR / 2, 0.5) * 0.10
        poner(izq, suave(g1 * e), t0); poner(der, suave(g2 * e), t0)

# --- bajo pulsante en corcheas (el motor) ---
for c in range(LARGO):
    raiz, _ = PROG[c % 4]
    m = midi(raiz) - 12
    for oct8 in range(8):
        t0 = c * BAR + oct8 * (BEAT / 2)
        n = int(BEAT * 0.44 * SR); t = np.arange(n) / SR
        # alterna fundamental y octava, como los temas de correr mundo
        f = hz(m + (12 if oct8 % 2 else 0))
        x = sierra(f, t) * .5 + np.sin(2 * np.pi * f * t) * .5
        poner(izq, suave(x * env(n, 0.004, BEAT * .4, .2)) * .34, t0)
        poner(der, suave(x * env(n, 0.004, BEAT * .4, .2)) * .34, t0)

# --- batería de rock ---
def bombo():
    n = int(0.12 * SR); t = np.arange(n) / SR
    f = 110 * np.exp(-t * 30) + 44
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 24) * .9

def caja():
    n = int(0.16 * SR); t = np.arange(n) / SR
    return (rng.standard_normal(n) * np.exp(-t * 24) * .7
            + np.sin(2 * np.pi * 200 * t) * np.exp(-t * 30) * .5) * .5

def hat(abierto=False):
    n = int((0.14 if abierto else 0.045) * SR); t = np.arange(n) / SR
    return rng.standard_normal(n) * np.exp(-t * (12 if abierto else 60)) * .11

for c in range(LARGO):
    for negra in range(4):
        t0 = c * BAR + negra * BEAT
        poner(izq, bombo(), t0); poner(der, bombo(), t0)          # bombo en negras
        if negra in (1, 3):
            poner(izq, caja(), t0); poner(der, caja(), t0)        # caja en 2 y 4
    for oct8 in range(8):                                          # hats corriendo
        t0 = c * BAR + oct8 * (BEAT / 2)
        h = hat(abierto=(oct8 == 7))
        poner(izq, h * .8, t0); poner(der, h, t0)

# --- arpegio de pluck brillante (siempre) ---
for c in range(LARGO):
    raiz, tipo = PROG[c % 4]
    voces = acorde(raiz, tipo)
    for s in range(8):
        t0 = c * BAR + s * (BEAT / 2)
        m = voces[[0, 1, 2, 3, 2, 1, 2, 3][s]] + 24
        n = int(BEAT * 0.4 * SR); t = np.arange(n) / SR
        x = np.sin(2 * np.pi * hz(m) * t) * np.exp(-t * 11)
        poner(izq, x * .16 * (s % 2), t0); poner(der, x * .16 * ((s + 1) % 2), t0)

# --- melodía heroica: entra en la 2ª vuelta, pentatónica mayor de Re ---
ESC = ['D4', 'E4', 'F#4', 'A4', 'B4', 'D5', 'E5', 'F#5', 'A5']
FRASES = [
    [2, 3, 5, 3, 2, 1, 0, 1],   [2, 3, 5, 6, 5, 3, 5, 7],
    [5, 6, 7, 6, 5, 3, 2, 3],   [2, 1, 0, 1, 2, 3, 2, 0],
]
def lead(nota, dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = hz(midi(nota))
    vib = 1 + 0.005 * np.sin(2 * np.pi * 5.2 * t) * np.minimum(1, t / 0.1)
    x = sierra(f * vib, t) * .4 + np.sin(2 * np.pi * f * vib * t) * .6
    return suave(x * env(n, 0.008, dur * .85, .4), 3.2) * .26

for c in range(8, LARGO):
    fr = FRASES[(c - 8) % 4]
    for i, gi in enumerate(fr):
        t0 = c * BAR + i * (BEAT / 2)
        poner(izq, lead(ESC[gi], BEAT * .46), t0)
        poner(der, lead(ESC[gi], BEAT * .46) * .85, t0)

# --- mezcla y loop sin chasquido ---
def lim(x):
    x = np.tanh(x * .9)
    return x / (np.max(np.abs(x)) + 1e-9)
izq = lim(izq); der = lim(der)
cruce = int(0.06 * SR)
for canal in (izq, der):
    f = np.linspace(0, 1, cruce)
    canal[:cruce] = canal[:cruce] * f + canal[-cruce:] * (1 - f)
izq = izq[:-cruce]; der = der[:-cruce]

inter = np.empty(len(izq) * 2, dtype=np.float32)
inter[0::2] = izq; inter[1::2] = der
pcm = (np.clip(inter, -1, 1) * 32767).astype(np.int16)
enc = lameenc.Encoder()
enc.set_bit_rate(160); enc.set_in_sample_rate(SR); enc.set_channels(2); enc.set_quality(2)
mp3 = enc.encode(pcm.tobytes()) + enc.flush()
(OUT / "aventura.mp3").write_bytes(mp3)
print(f"OK aventura.mp3 · {len(izq)/SR:.1f}s · {BPM} BPM · {len(mp3)//1024} KB")
