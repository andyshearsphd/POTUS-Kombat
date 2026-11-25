#!/usr/bin/env python3
"""Builds the announcer's voice clips (voice/*.mp3 + voice/manifest.json) with espeak-ng and ffmpeg.

Run from the repo root after adding a fighter or a spoken line:  python3 tools/make_voice.py
Needs espeak-ng and ffmpeg installed. The voice is a deep robot run through an old-radio filter.
"""
import json, os, re, subprocess, tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'voice')

def slug(t): return re.sub(r'^-+|-+$', '', re.sub(r'[^a-z0-9]+', '-', t.lower()))

# every line the announcer speaks, as the engine passes it to say() (fighter names are added below)
FIXED = ['fight', 'fatality', 'landslide victory', 'choose your president', 'finish him', 'finish it',
         'round one', 'round two', 'round three', 'round four', 'round five',
         'valley forge', 'fore', 'bully']
# shouted lines are slower and deeper
SHOUT = {'fight': (100, 12), 'fatality': (88, 8), 'finish him': (98, 10), 'finish it': (98, 10), 'fore': (95, 30), 'bully': (100, 40)}

src = open(os.path.join(ROOT, 'js', 'fighters.js')).read()
names = re.findall(r"id: '\w+', name: '([^']+)', short:", src)
lines = FIXED + [n.lower() for n in names] + [n.lower() + ' wins' for n in names]

os.makedirs(OUT, exist_ok=True)
FILTER = 'asetrate=22050*0.88,aresample=44100,atempo=1.5,highpass=f=250,lowpass=f=3200,acompressor=threshold=-18dB:ratio=4,volume=2,aecho=0.8:0.6:40:0.25,apad=pad_dur=0.15'
done = []
with tempfile.TemporaryDirectory() as tmp:
    for line in lines:
        k = slug(line); wav = os.path.join(tmp, k + '.wav')
        speed, pitch = SHOUT.get(line, (118, 16))
        spoken = line.replace(' d. ', ' D ').replace(' s. ', ' S ').replace(' f. ', ' F ').replace(' b. ', ' B ')
        subprocess.run(['espeak-ng', '-v', 'en-us+m3', '-s', str(speed), '-p', str(pitch), '-g', '4', '-w', wav, spoken], check=True)
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-af', FILTER, '-b:a', '64k', os.path.join(OUT, k + '.mp3')], check=True)
        done.append(k)
json.dump(done, open(os.path.join(OUT, 'manifest.json'), 'w'), indent=0)
print(f'{len(done)} clips written to voice/')
