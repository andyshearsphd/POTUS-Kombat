// POTUS Kombat: game settings for the Kombat Engine (titles, announcer, music, projectiles, victory poses)
'use strict';
window.GAME = {
  title: 'POTUS KOMBAT',
  subtitle: 'HAIL TO THE KILL',
  ladderGoal: 'THE CAPITOL',
  endingLine: 'The Republic stands. Its enemies do not.',
  mascot: 'lincoln',                                     // head on the title emblem
  toasty: { fighter: 'teddy', text: 'BULLY!' },          // pops in after some uppercuts
  muteKey: 'potus_muted',
  ladder: { mirror: true, endurance: 2 },

  // ---------- the announcer: an old newsreel narrator, crackling over the radio ----------
  calls: { flawless: 'LANDSLIDE VICTORY', choose: 'choose your president' },
  voice: { pitch: 0.85, rate: 1.12, prefer: /Daniel|Fred|Alex|Google US English|Male/i, radio: true },

  // ---------- music: industrial remixes of public-domain tunes ----------
  // Transcribed by ear from memory, so a note here and there may need fixing.
  tunes: [
    // Yankee Doodle (traditional, 1700s)
    { name: 'Yankee Doodle', bpm: 136, chords: 'C G C G C F G C',
      notes: 'C5/2 C5/2 D5/2 E5/2 C5/2 E5/2 D5/2 G4/2 C5/2 C5/2 D5/2 E5/2 C5/4 B4/4 C5/2 C5/2 D5/2 E5/2 F5/2 E5/2 D5/2 C5/2 B4/2 G4/2 A4/2 B4/2 C5/4 C5/4' },
    // Hail to the Chief (James Sanderson, about 1812)
    { name: 'Hail to the Chief', bpm: 128, chords: 'Bb Gm F Bb',
      notes: 'F4/3 G4/1 A4/4 Bb4/6 A4/2 G4/4 F4/3 G4/1 F4/4 D4/4 C4/4 Bb3/4 F4/4 Bb4/4 C5/4 D5/4 C5/4 Bb4/4' },
  ],
  menuTune: { name: 'Hail to the Chief', bpm: 96, chords: 'Bb Gm F Bb',
    notes: 'F4/3 G4/1 A4/4 Bb4/6 A4/2 G4/4 F4/3 G4/1 F4/4 D4/4 C4/4 Bb3/4 F4/4 Bb4/4 C5/4 D5/4 C5/4 Bb4/4' },

  // ---------- projectiles thrown by the presidents ----------
  projectiles: {
    // Washington: a silver dollar skipped low across the floor, like the river legend
    dollar: { speed: 330, y: 18, vy: -150, grav: 900, bounce: 0.82, dmg: 8, w: 7, h: 6, fx: 'trip', life: 2.2, hitSfx: 'ding',
      draw(g, p, s, t) { const w = Math.abs(Math.cos(t * 22)) * 5 + 0.8; g.fillStyle = '#cfd2da'; g.beginPath(); g.ellipse(0, 0, w, 5, 0, 0, Math.PI * 2); g.fill(); g.strokeStyle = '#8a8e98'; g.lineWidth = 0.6; g.stroke(); if (w > 3) { g.fillStyle = '#9aa0aa'; g.fillRect(-1, -2, 2, 4); } } },
    // Lincoln: a split fence rail thrown like a javelin
    rail: { speed: 340, vy: -110, grav: 300, dmg: 11, w: 15, h: 5, fx: 'knock', launch: [240, -330], hitSfx: 'thud', burstGibs: ['chunk'],
      draw(g, p, s, t) { g.rotate(Math.atan2(p.vy, Math.abs(p.vx)) * s); g.scale(s, 1); g.fillStyle = '#6a4a28'; g.fillRect(-18, -2.6, 36, 5.2); g.fillStyle = '#8a6438'; g.fillRect(-18, -2.6, 36, 1.6); g.fillStyle = 'rgba(0,0,0,0.3)'; for (let i = -14; i < 18; i += 7) g.fillRect(i, -2.6, 0.8, 5.2); g.fillStyle = '#c8a070'; g.fillRect(16, -2.6, 2, 5.2); } },
    // Lincoln: the stovepipe hat, out and back like a boomerang
    stovepipe: { speed: 300, boomerang: true, turn: 0.5, dmg: 7, w: 9, h: 10, fx: 'stun', hitSfx: 'punch',
      draw(g, p, s, t) { g.rotate(t * 16); g.fillStyle = '#0c0c10'; g.fillRect(-6, -11, 12, 16); g.fillStyle = '#26262e'; g.fillRect(-2, -11, 3, 16); g.fillStyle = '#050506'; g.fillRect(-6, 1, 12, 3); g.beginPath(); g.ellipse(0, 5, 10, 2.4, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.9)'; g.fillRect(-3, -6, 5, 3); } },
    // FDR: New Deal agencies in steel letters, three at once
    letters: { speed: 300, spread: [-80, 0, 80], dmg: 5, w: 9, h: 6, fx: 'stun', hitSfx: 'clang',
      draw(g, p, s, t) { const word = p.vy < -20 ? 'WPA' : p.vy > 20 ? 'TVA' : 'CCC'; g.rotate(t * 14 * s); g.fillStyle = '#4a4e58'; g.fillRect(-10, -5, 20, 10); g.strokeStyle = '#c8ccd4'; g.lineWidth = 0.8; g.strokeRect(-10, -5, 20, 10); g.fillStyle = '#e8ecf2'; g.font = '7px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText(word, 0, 3); g.textAlign = 'left'; } },
    // FDR: a blazing ember flicked off the cigarette holder
    ember: { speed: 420, y: 92, dmg: 6, w: 6, h: 5, fx: 'stun', fire: true, cool: 1.0, hitSfx: 'fire',
      draw(g, p, s, t) { const r = 3 + Math.sin(t * 40) * 0.6; const gr = g.createRadialGradient(0, 0, 0, 0, 0, r * 2.4); gr.addColorStop(0, 'rgba(255,240,180,1)'); gr.addColorStop(0.4, 'rgba(255,120,30,0.9)'); gr.addColorStop(1, 'rgba(255,40,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r * 2.4, 0, Math.PI * 2); g.fill(); } },
  },

  // ---------- victory poses: each winner celebrates in character ----------
  winPoses(K) {
    const { R, PI, FX, SFX, FLOOR, game, once, fj, hurtH, rnd } = K;
    const bubble = (f, str, fill = 'gold') => game.bubbles.push({ str, x: f.x, y: f.y - hurtH(f) - 22, t: 0, life: 1.8, size: 13, fill });
    return {
      // boot up on the fallen, Delaware-crossing stance, coat whipping in the wind
      washington: { fp: t => ({ liftR: 9, aR: [0.5, -0.9], aL: [0.35, 0.15], head: -0.12, sway: -0.02 }),
        fx(f, t) { if (Math.random() < 0.3) { const c = fj(f, 'chest'); FX.puff(c[0] - 30 - rnd(0, 20), c[1] + rnd(-20, 20), 'rgba(230,235,245,0.5)', 1, 1); } } },
      // leans on the maul and slowly tips the stovepipe
      lincoln: { fp: t => ({ aL: [0.25, 0.1], aR: t > 0.6 && t < 1.8 ? [2.75, 0.45] : [0.4, 0.2], head: t > 0.6 && t < 1.8 ? 0.08 : 0 }),
        draw(g, f) { const h = fj(f, 'handL'); R.line(g, h[0], h[1] - 4, h[0] + 2, FLOOR, '#6a4422', 2.2); g.fillStyle = '#4a4e56'; g.fillRect(h[0] - 3, FLOOR - 9, 9, 9); g.fillStyle = '#7a8088'; g.fillRect(h[0] - 3, FLOOR - 9, 9, 2); } },
      // the Big Stick thrust skyward, spectacles glinting: "Bully!"
      teddy: { fp: t => ({ aR: [2.98, 0.05], aL: [0.6, -1.5], jaw: 0.3 }),
        fx(f, t) { if (once(f, 'b', t, 0.25)) { bubble(f, 'BULLY!'); SFX.say('bully'); } },
        draw(g, f) { const h = fj(f, 'handR'); R.line(g, h[0], h[1] + 6, h[0], h[1] - 38, '#5a3a1a', 3.6); R.ball(g, h[0], h[1] - 40, 3.6, '#4a2e14'); for (let i = 0; i < 4; i++) R.ball(g, h[0] + (i % 2 ? 1.6 : -1.6), h[1] - 6 - i * 8, 1.4, '#4a2e12'); } },
      // chin up, cigarette holder high, the big grin
      fdr: { fp: t => ({ aR: [2.0, 1.4], aL: [0.4, 0.6], head: -0.12, jaw: 0.2 }),
        fx(f, t) { if (Math.random() < 0.25) { const h = fj(f, 'head'); FX.puff(h[0] + 16, h[1] - 8, 'rgba(220,220,225,0.6)', 1, 1); } } },
    };
  },
};
