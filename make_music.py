# -*- coding: utf-8 -*-
# ============================================================
# make_music.py — genera un tema 8-bit por PROVINCIA (y Monteverde), todos en el
# mismo "hilo" sonoro (mismos instrumentos cuadrados/triangulares, misma mezcla),
# pero con progresión, tono y tempo propios para que cada provincia suene distinta.
# Salida: assets/audio/prov_<slug>.mp3 (+ monteverde.mp3). Requiere numpy + lameenc.
# Re-correr:  python make_music.py
# ============================================================
import numpy as np, lameenc, pathlib

SR = 44100
OUT = pathlib.Path(__file__).parent / "assets" / "audio"

NAMES = {'C':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'F':5,'F#':6,'Gb':6,
         'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,'B':11}
def midi(note):
    i = 2 if note[1] in '#b' else 1
    return (int(note[i:]) + 1) * 12 + NAMES[note[:i]]
def freq(note): return 440.0 * 2 ** ((midi(note) - 69) / 12.0)

def square(f, t, duty=0.5): return np.where((f * t) % 1.0 < duty, 1.0, -1.0)
def tri(f, t):
    p = (f * t) % 1.0; return 2 * np.abs(2 * p - 1) - 1

def env(n, a=0.008, rel=0.55, sus=0.85):
    e = np.ones(n); ai = max(1, int(a * n)); ri = int(rel * n)
    e[:ai] = np.linspace(0, 1, ai)
    if ri > 0: e[n - ri:] = np.linspace(sus, 0, ri)
    e[ai:n - ri] *= sus
    return e

def tone(f, dur, vol, wave='sq', duty=0.5, rel=0.55):
    n = int(dur * SR); t = np.arange(n) / SR
    w = square(f, t, duty) if wave == 'sq' else tri(f, t)
    return w * env(n, rel=rel) * vol

CHORD = {'maj':[0,4,7,12], 'min':[0,3,7,12]}

def render_song(bpm, mode, prog, reps, lead_oct=12, patt=(0,2,1,2,3,2,1,0),
                lead_vol=0.16, rel=0.5, duty=0.5, reggae=False, bass_oct=-12):
    beat = 60.0 / bpm
    eighth = beat / 2
    total_beats = len(prog) * 4 * reps
    buf = np.zeros(int(total_beats * beat * SR) + SR)
    pos = 0  # en muestras
    tones = CHORD[mode]
    for rep in range(reps):
        for ci, root in enumerate(prog):
            rm = midi(root)
            bar_start = pos
            # --- ARPEGIO (lead, square mid) : 8 corcheas por compás ---
            for i in range(8):
                deg = tones[patt[i % len(patt)] % len(tones)]
                f = freq_from_midi(rm + lead_oct + deg)
                nt = tone(f, eighth * 0.96, lead_vol, 'sq', duty, rel)
                s = bar_start + int(i * eighth * SR)
                buf[s:s + len(nt)] += nt[:len(buf) - s]
            # --- BAJO (square grave) ---
            bf = freq_from_midi(rm + bass_oct)
            if reggae:  # skank: golpes en los off-beats (2 y 4 -> corcheas 2,4,6...)
                for i in (1, 3, 5, 7):
                    nt = tone(bf, eighth * 0.5, 0.16, 'sq', 0.4, 0.5)
                    s = bar_start + int(i * eighth * SR); buf[s:s + len(nt)] += nt[:len(buf) - s]
            else:       # raíz en 1 y 3
                for i in (0, 4):
                    nt = tone(bf, beat * 0.9, 0.17, 'sq', 0.3, 0.4)
                    s = bar_start + int(i * eighth * SR); buf[s:s + len(nt)] += nt[:len(buf) - s]
            # --- PAD cálido (triángulo, raíz+quinta sostenida todo el compás) ---
            for d in (0, 7):
                pf = freq_from_midi(rm + d)
                nt = tone(pf, beat * 4 * 0.98, 0.05, 'tri', rel=0.2)
                buf[bar_start:bar_start + len(nt)] += nt[:len(buf) - bar_start]
            pos = bar_start + int(beat * 4 * SR)
    y = buf[:pos]
    # eco suave para ambiente + normalizar
    d = int(0.16 * SR); echo = np.zeros_like(y); echo[d:] = y[:-d] * 0.3
    y = y + echo
    y = y / (np.max(np.abs(y)) + 1e-9) * 0.82
    return y

def freq_from_midi(m): return 440.0 * 2 ** ((m - 69) / 12.0)

def save_mp3(y, path):
    pcm = (y * 32767).astype(np.int16)
    enc = lameenc.Encoder(); enc.set_bit_rate(96); enc.set_in_sample_rate(SR)
    enc.set_channels(1); enc.set_quality(4)
    mp3 = enc.encode(pcm.tobytes()) + enc.flush()
    path.write_bytes(mp3)
    return len(mp3)

# ---- una canción por provincia (mismo hilo, distinto color) ----
SONGS = {
    # San José: capital, alegre y movido (Do mayor, I–V–vi–IV)
    "sanjose":   dict(bpm=112, mode='maj', prog=['C3','G2','A2','F2'], reps=5, patt=(0,2,1,3,2,1,2,0), duty=0.5),
    # Alajuela: aventura volcánica (Sol mayor, I–vi–IV–V)
    "alajuela":  dict(bpm=104, mode='maj', prog=['G2','E2','C2','D2'], reps=5, patt=(0,1,2,3,2,3,1,0), duty=0.5),
    # Cartago: montaña solemne (Re menor, i–VI–III–VII), más lento
    "cartago":   dict(bpm=88,  mode='min', prog=['D2','A#1','F2','C2'], reps=4, patt=(0,1,2,1,3,2,1,0), rel=0.65, duty=0.5),
    # Heredia: bosque nuboso, suave (La mayor, I–iii–IV–V)
    "heredia":   dict(bpm=94,  mode='maj', prog=['A2','C#3','D3','E3'], reps=5, patt=(0,1,2,3,2,1,0,1), lead_oct=0, rel=0.6, duty=0.5),
    # Guanacaste: sabana festiva, rebote (Fa mayor, I–IV–V–IV)
    "guanacaste":dict(bpm=120, mode='maj', prog=['F2','A#2','C3','A#2'], reps=5, patt=(0,2,3,2,1,2,0,2), duty=0.25),
    # Puntarenas: costa Pacífica, brisa (Mi mayor, I–V–IV–I)
    "puntarenas":dict(bpm=98,  mode='maj', prog=['E2','B2','A2','E2'], reps=5, patt=(0,2,1,2,3,1,2,0), duty=0.5),
    # Limón: Caribe, reggae/calypso a contratiempo (La menor, i–VII–III–VI)
    "limon":     dict(bpm=100, mode='min', prog=['A2','G2','C3','F2'], reps=5, patt=(0,2,3,2,0,2,1,0), reggae=True, duty=0.5),
    # Monteverde (final secreto): místico y esperanzador (Mi menor, i–VI–III–VII)
    "monteverde":dict(bpm=84,  mode='min', prog=['E2','C2','G2','D2'], reps=4, patt=(0,2,1,3,2,1,0,2), rel=0.62, duty=0.5),
}

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for slug, cfg in SONGS.items():
        y = render_song(**cfg)
        name = ("prov_" + slug) if slug != "monteverde" else "monteverde"
        size = save_mp3(y, OUT / f"{name}.mp3")
        print(f"OK {name}.mp3  {round(len(y)/SR,1)}s  {size//1024} KB")
