# -*- coding: utf-8 -*-
# ============================================================
# make_musica_ambiente.py — AMBIENTE RELAJANTE 8-bit para la pantalla de
# selección de equipo (rediseño ARENA). Bosque nuboso al amanecer: pads de
# triángulo lentos, arpegio suave tipo caja de música y pájaros esporádicos.
# Melodía 100% ORIGINAL. Salida: assets/audio/ambiente.mp3
# Re-correr:  python make_musica_ambiente.py
# ============================================================
import numpy as np, lameenc, pathlib

SR = 44100
OUT = pathlib.Path(__file__).parent / "assets" / "audio"
rng = np.random.default_rng(7)

NAMES = {'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'F':5,'F#':6,'Gb':6,
         'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11}
def midi(note):
    i = 2 if note[1] in '#b' else 1
    return (int(note[i:]) + 1) * 12 + NAMES[note[:i]]
def f_of(m): return 440.0 * 2 ** ((m - 69) / 12.0)
def freq(note): return f_of(midi(note))

def tri(f, t):
    p = (f * t) % 1.0
    return 2 * np.abs(2 * p - 1) - 1
def sine(f, t): return np.sin(2 * np.pi * f * t)

def env(n, a=0.02, rel=0.5, sus=0.85):
    e = np.ones(n); ai = max(1, int(a * n)); ri = max(1, int(rel * n))
    e[:ai] = np.linspace(0, 1, ai)
    e[n - ri:] = np.linspace(sus, 0, ri)
    if ai < n - ri: e[ai:n - ri] *= sus
    return e

def tone(note, dur, vol, wave='tri', a=0.02, rel=0.5):
    f = freq(note); n = max(1, int(dur * SR)); t = np.arange(n) / SR
    w = tri(f, t) if wave == 'tri' else sine(f, t)
    # vibrato muy sutil para que respire
    w *= (1 + 0.015 * np.sin(2 * np.pi * 0.9 * t))
    return w * env(n, a=a, rel=rel) * vol

# ---------- composición: Do mayor pentatónico, 52 BPM ----------
BEAT = 60 / 52          # negra lenta
BAR = BEAT * 4
# progresión serena: C - Am - F - G, dos vueltas con color (Em, Fmaj7)
PADS = [
    ['C3','E3','G3'], ['A2','C3','E3'], ['F2','A2','C3'], ['G2','B2','D3'],
    ['C3','E3','G3'], ['E2','G2','B2'], ['F2','A2','C3','E3'], ['G2','B2','D3'],
]
# arpegio caja de música (pentatónica de C): patrón por compás
ARP = [
    ['C5','D5','E5','G5','A5','G5','E5','D5'],
    ['A4','C5','E5','A5','E5','C5','A4','E5'],
    ['F4','A4','C5','F5','C5','A4','F4','C5'],
    ['G4','B4','D5','G5','D5','B4','G4','D5'],
]
# melodía flotante MUY espaciada (entra cada 2 compases)
MEL = [('E5', 2.0), None, ('G5', 1.5), ('A5', 2.5), None, ('D5', 2.0), ('C5', 3.0), None]

total = BAR * len(PADS) * 2          # dos vueltas ≈ 74 s
N = int(total * SR)
mix = np.zeros(N)

def put(buf, sig, at):
    i = int(at * SR)
    j = min(N, i + len(sig))
    if j > i: buf[i:j] += sig[:j - i]

for vuelta in range(2):
    base = vuelta * BAR * len(PADS)
    for c, chord in enumerate(PADS):
        t0 = base + c * BAR
        # pad: acorde entero, ataque lento, cola larga
        for nt in chord:
            put(mix, tone(nt, BAR * 1.05, 0.10, wave='tri', a=0.25, rel=0.35), t0)
        # arpegio de caja de música (solo en la 2ª vuelta entra completo)
        patron = ARP[c % 4]
        vol_arp = 0.055 if vuelta == 0 and c < 4 else 0.075
        for k, nt in enumerate(patron):
            put(mix, tone(nt, BEAT * 0.9, vol_arp, wave='sine', a=0.01, rel=0.7),
                t0 + k * (BAR / 8))
    # melodía flotante
    tm = base
    for m in MEL:
        if m:
            nt, dur = m
            put(mix, tone(nt, dur * BEAT * 1.6, 0.075, wave='sine', a=0.12, rel=0.5), tm)
        tm += BAR

# pájaros esporádicos: chirridos de seno agudos, muy suaves
for _ in range(14):
    at = rng.uniform(2, total - 3)
    f0 = rng.uniform(2100, 3300)
    dur = rng.uniform(0.10, 0.22)
    n = int(dur * SR); t = np.arange(n) / SR
    chirp = np.sin(2 * np.pi * (f0 + 700 * np.sin(2 * np.pi * 11 * t)) * t)
    put(mix, chirp * env(n, a=0.15, rel=0.6, sus=0.5) * rng.uniform(0.014, 0.026), at)

# brisa: ruido rosa MUY tenue, constante
ruido = rng.uniform(-1, 1, N)
b = np.zeros(N); acc = 0.0
for i in range(N):        # filtro paso-bajo de un polo (lento pero N es manejable)
    acc += 0.015 * (ruido[i] - acc); b[i] = acc
mix += b * 0.05

# normalizar + loop suave (crossfade con el final)
mix /= max(1e-9, np.max(np.abs(mix))) * 1.15
fade = int(1.2 * SR)
mix[:fade] *= np.linspace(0, 1, fade)
mix[-fade:] *= np.linspace(1, 0, fade)

pcm = (mix * 32767).astype(np.int16)
enc = lameenc.Encoder()
enc.set_bit_rate(96); enc.set_in_sample_rate(SR); enc.set_channels(1); enc.set_quality(2)
data = enc.encode(pcm.tobytes()) + enc.flush()
out = OUT / "ambiente.mp3"
out.write_bytes(bytes(data))
print(f"OK {out} · {total:.0f}s · {out.stat().st_size // 1024} KB")
