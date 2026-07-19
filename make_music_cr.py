# -*- coding: utf-8 -*-
# ============================================================
# make_music_cr.py — TEMA PRINCIPAL "tico" en 8-bit para el menú/título.
# Sabor Costa Rica: aire de tambito guanacasteco en 6/8, marimba (triángulo
# arpegiado veloz), melodía cuadrada cantable, bajo saltón y un hi-hat de ruido
# para el rebote. Melodía 100% ORIGINAL (sin copiar canciones existentes).
# Salida: assets/audio/tema_tico.mp3. Requiere numpy + lameenc.
# Re-correr:  python make_music_cr.py
# ============================================================
import numpy as np, lameenc, pathlib

SR = 44100
OUT = pathlib.Path(__file__).parent / "assets" / "audio"

NAMES = {'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'F':5,'F#':6,'Gb':6,
         'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11}
def midi(note):
    i = 2 if note[1] in '#b' else 1
    return (int(note[i:]) + 1) * 12 + NAMES[note[:i]]
def f_of(m): return 440.0 * 2 ** ((m - 69) / 12.0)
def freq(note): return f_of(midi(note))

def square(f, t, duty=0.5): return np.where((f * t) % 1.0 < duty, 1.0, -1.0)
def tri(f, t):
    p = (f * t) % 1.0; return 2 * np.abs(2 * p - 1) - 1

def env(n, a=0.006, rel=0.5, sus=0.85):
    e = np.ones(n); ai = max(1, int(a * n)); ri = int(rel * n)
    e[:ai] = np.linspace(0, 1, ai)
    if ri > 0: e[n - ri:] = np.linspace(sus, 0, ri)
    e[ai:n - ri] *= sus
    return e

def tone(f, dur, vol, wave='sq', duty=0.5, rel=0.5, a=0.006):
    n = max(1, int(dur * SR)); t = np.arange(n) / SR
    w = square(f, t, duty) if wave == 'sq' else tri(f, t)
    return w * env(n, a=a, rel=rel) * vol

def noise(dur, vol, rel=0.7):
    n = max(1, int(dur * SR))
    w = np.random.uniform(-1, 1, n)
    return w * env(n, a=0.002, rel=rel, sus=0.6) * vol

# ---------- composición ----------
# 6/8: 6 corcheas por compás, con acento en la 1 y la 4 (dos pulsos con lilt).
# Progresión tica alegre (Fa mayor): F - Bb - C - F  |  Dm - Bb - C7 - F
PROG = ['F2','A#2','C3','F2', 'D2','A#2','C3','F2']

# Melodía ORIGINAL (nota, corcheas). None = silencio. Dos frases de 8 compases.
MEL = [
  # frase A
  ('F4',1),('A4',1),('C5',1), ('A4',1),('C5',1),('F5',1),      # F
  ('D5',2),('C5',1),          ('A4',1),('F4',2),               # Bb
  ('G4',1),('A4',1),('B b'.replace(' ','')+'4' if False else 'A#4',1), ('C5',2),('A4',1),  # C
  ('F4',3),                    ('C5',1),('D5',1),('C5',1),      # F  (pickup a la 2a frase)
  # frase B
  ('D5',1),('F5',1),('D5',1), ('C5',1),('A4',1),('F4',1),      # Dm
  ('A4',2),('G4',1),          ('A4',1),('A#4',2),              # Bb
  ('C5',1),('A#4',1),('A4',1),('G4',2),('E4',1),               # C7 (Bb = 7ma)
  ('F4',6),                                                    # F (resolución larga)
]

def render(bpm=116):
    eighth = (60.0 / bpm) / 2.0            # duración de una corchea
    bar = eighth * 6                       # compás de 6/8
    total = len(PROG) * bar
    buf = np.zeros(int((total + 1.0) * SR))

    def put(sig, at):
        s = int(at * SR); e = s + len(sig)
        if e > len(buf): sig = sig[:len(buf) - s]
        buf[s:s + len(sig)] += sig

    CH = {'F2':[5,9,0],'A#2':[10,2,5],'C3':[0,4,7],'D2':[2,5,9]}  # notas del acorde (clase)
    ROOT = {'F2':midi('F2'),'A#2':midi('A#2'),'C3':midi('C3'),'D2':midi('D2')}

    # --- acompañamiento por compás: marimba + bajo + hi-hat ---
    for ci, ch in enumerate(PROG):
        b0 = ci * bar
        rootm = ROOT[ch]; cls = CH[ch]
        # marimba: 6 corcheas arpegiando el acorde (triángulo, agudo, corto)
        arp = [0,1,2,1,2,1]
        for i in range(6):
            deg = cls[arp[i] % 3]
            f = f_of(rootm + 24 + deg)     # 2 octavas arriba de la raíz
            put(tone(f, eighth*0.9, 0.11, 'tri', rel=0.6, a=0.004), b0 + i*eighth)
        # bajo saltón: raíz en la corchea 1 y quinta en la 4 (los dos pulsos del 6/8)
        put(tone(f_of(rootm), eighth*1.6, 0.20, 'sq', 0.3, 0.45), b0 + 0*eighth)
        put(tone(f_of(rootm+7), eighth*1.4, 0.17, 'sq', 0.3, 0.45), b0 + 3*eighth)
        # hi-hat de ruido en cada corchea (tico bounce), más fuerte en 1 y 4
        for i in range(6):
            v = 0.05 if i in (0,3) else 0.03
            put(noise(eighth*0.35, v, rel=0.8), b0 + i*eighth)

    # --- melodía (square, duty 0.5, brillante) ---
    t = 0.0
    for note, ln in MEL:
        dur = ln * eighth
        if note:
            put(tone(freq(note), dur*0.94, 0.17, 'sq', 0.5, rel=0.42, a=0.005), t)
        t += dur

    y = buf[:int(total * SR)]
    # eco corto para ambiente
    d = int(0.14 * SR); echo = np.zeros_like(y); echo[d:] = y[:-d] * 0.28
    y = y + echo
    # loop suave: pequeño fade in/out en los bordes
    fi = int(0.04*SR); y[:fi] *= np.linspace(0,1,fi); y[-fi:] *= np.linspace(1,0,fi)
    y = y / (np.max(np.abs(y)) + 1e-9) * 0.85
    return y

def save_mp3(y, path, br=112):
    pcm = (y * 32767).astype(np.int16)
    enc = lameenc.Encoder(); enc.set_bit_rate(br); enc.set_in_sample_rate(SR)
    enc.set_channels(1); enc.set_quality(3)
    mp3 = enc.encode(pcm.tobytes()) + enc.flush()
    path.write_bytes(mp3)
    return len(mp3)

if __name__ == "__main__":
    np.random.seed(11)
    OUT.mkdir(parents=True, exist_ok=True)
    y = render()
    # dos vueltas para un loop más largo
    y2 = np.concatenate([y, y])
    size = save_mp3(y2, OUT / "tema_tico.mp3")
    print(f"OK tema_tico.mp3  {round(len(y2)/SR,1)}s  {size//1024} KB")
