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
    // Jefferson: a sepia double of himself, like the copy his polygraph machine wrote, charges ahead
    polygraph: { speed: 360, ghost: '#d8c08a', dmg: 10, w: 16, h: 60, fx: 'knock', launch: [240, -300], cool: 1.6, hitSfx: 'punch', word: 'COPIED' },
    // Grant: Vicksburg mortar shells dropping in from offscreen
    mortar: { sky: { count: 3, spread: 46, delay: 0.45, gap: 0.22, speed: 620 }, dmg: 7, w: 9, h: 9, fx: 'knock', launch: [160, -360], fire: true, cool: 1.8, hitSfx: 'big', sfx: 'horn',
      draw(g, p, s, t) { g.fillStyle = '#2a2a2e'; g.beginPath(); g.arc(0, 0, 5.4, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.arc(-1.6, -1.8, 1.8, 0, Math.PI * 2); g.fill(); g.fillStyle = '#ffb040'; g.fillRect(-0.8, -8 - Math.random() * 2, 1.6, 3); } },
    // Cleveland: heavy gold bars, lobbed so they bounce and knock you flat
    goldbar: { speed: 260, vy: -260, grav: 760, bounce: 0.45, dmg: 11, w: 12, h: 7, fx: 'knock', launch: [200, -300], life: 2.4, hitSfx: 'clang',
      draw(g, p, s, t) { g.rotate(t * 7 * s); g.fillStyle = '#b8901c'; g.beginPath(); g.moveTo(-8, 4); g.lineTo(8, 4); g.lineTo(6, -3); g.lineTo(-6, -3); g.closePath(); g.fill(); g.fillStyle = '#f0d060'; g.beginPath(); g.moveTo(-6, -3); g.lineTo(6, -3); g.lineTo(5, -4.5); g.lineTo(-5, -4.5); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,230,0.7)'; g.fillRect(-4, -1, 6, 1); } },
    // Taft: one bang of the Chief Justice's gavel sends a shockwave rolling across the floor
    gavel: { speed: 300, y: 7, low: true, dmg: 8, w: 16, h: 12, fx: 'stun', cool: 1.5, sfx: 'thud', hitSfx: 'clang', word: 'ORDER!',
      draw(g, p, s, t) { for (let i = 0; i < 3; i++) { g.strokeStyle = `rgba(240,220,160,${0.8 - i * 0.22})`; g.lineWidth = 1.8; g.beginPath(); g.ellipse(-s * i * 7, 4, 6 + i * 3, 9 + i * 3 + Math.sin(t * 30) * 1.5, 0, s > 0 ? -1.4 : Math.PI - 1.4, s > 0 ? 1.4 : Math.PI + 1.4); g.stroke(); } g.fillStyle = 'rgba(200,180,120,0.5)'; g.fillRect(-12 * s - 4, 8, 16, 2); } },
    // Coolidge: Rebecca the raccoon springs out of his coat at your face
    raccoon: { speed: 300, vy: -230, grav: 640, dmg: 7, w: 12, h: 10, blind: true, cool: 1.6, sfx: 'chirp', hitSfx: 'gnaw', word: 'RACCOONED',
      draw(g, p, s, t) {
        g.scale(s, 1); const run = Math.sin(t * 30);
        for (let i = 0; i < 5; i++) RIG.ball(g, -9 - i * 2.4, -1 + i * 0.6, 2.2 - i * 0.1, i % 2 ? '#2a2420' : '#8a8078');
        g.fillStyle = '#7a7068'; g.beginPath(); g.ellipse(0, 0, 8, 5, -0.1, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#6a6058'; for (const lx of [-5, 4]) { g.fillRect(lx, 3, 2, 3 + run); g.fillRect(lx + 2, 3, 2, 3 - run); }
        g.fillStyle = '#8a8078'; g.beginPath(); g.ellipse(8, -2, 4.6, 3.8, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#1a1612'; g.beginPath(); g.ellipse(9, -2.4, 3.6, 1.4, 0, 0, Math.PI * 2); g.fill();
        g.fillStyle = '#f0d040'; g.fillRect(9.6, -3, 1, 1); g.fillStyle = '#e8e2d8'; g.beginPath(); g.moveTo(11, -1); g.lineTo(13.4, -0.6); g.lineTo(11, 1); g.fill(); RIG.ball(g, 13.4, -0.6, 0.8, '#141010');
        g.fillStyle = '#5a5048'; g.beginPath(); g.moveTo(6, -5); g.lineTo(7, -8); g.lineTo(8.4, -5.2); g.fill();
        g.strokeStyle = '#f0ece0'; g.lineWidth = 0.5; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(12, 1 + i); g.lineTo(14.6, 2 + i * 1.4); g.stroke(); }
      } },
    // JFK: a tight spiral off the Hyannis Port lawn
    football: { speed: 420, vy: -50, grav: 70, dmg: 9, w: 11, h: 7, fx: 'knock', launch: [220, -300], hitSfx: 'punch', word: 'TOUCHDOWN',
      draw(g, p, s, t) { g.scale(s, 1); g.fillStyle = '#7a3a18'; g.beginPath(); g.ellipse(0, 0, 8, 4.6, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,220,180,0.25)'; g.beginPath(); g.ellipse(-1, -1.6, 5, 1.6, 0, 0, Math.PI * 2); g.fill(); const r = Math.sin(t * 40); g.strokeStyle = '#f0ece0'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(-3, r * 2); g.lineTo(3, r * 2); g.stroke(); for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(i * 1.2, r * 2 - 1); g.lineTo(i * 1.2, r * 2 + 1); g.stroke(); } g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(-12, -0.5, 3, 1); g.fillRect(-16, 1, 2, 0.8); } },
    // Nixon: a bowling ball from the White House lane, rolled low to take the legs
    bowling: { speed: 290, y: 7, low: true, trip: true, dmg: 9, w: 12, h: 12, fx: 'trip', cool: 1.6, hitSfx: 'thud', word: 'STRIKE!',
      draw(g, p, s, t) { g.rotate(t * 14 * s); g.fillStyle = '#16161c'; g.beginPath(); g.arc(0, 0, 7, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(120,130,200,0.35)'; g.beginPath(); g.arc(-2, -2.6, 3, 0, Math.PI * 2); g.fill(); g.fillStyle = '#050508'; for (const [x, y] of [[1.6, -2], [3.4, -0.4], [2, 1.8]]) { g.beginPath(); g.arc(x, y, 0.9, 0, Math.PI * 2); g.fill(); } } },
    // Reagan: Star Wars. A laser from orbit, after a short targeting beep.
    laser: { sky: { count: 1, spread: 0, delay: 0.55, speed: 1500 }, dmg: 13, w: 12, h: 30, fx: 'launch', launch: [140, -620], fire: true, cool: 2.2, sfx: 'ding', hitSfx: 'big', word: 'STAR WARS',
      draw(g, p, s, t) { const gr = g.createLinearGradient(-6, 0, 6, 0); gr.addColorStop(0, 'rgba(255,40,40,0)'); gr.addColorStop(0.5, 'rgba(255,240,240,1)'); gr.addColorStop(1, 'rgba(255,40,40,0)'); g.fillStyle = 'rgba(255,40,60,0.45)'; g.fillRect(-7, -500, 14, 504); g.fillStyle = gr; g.fillRect(-4, -500, 8, 506); g.fillStyle = 'rgba(255,200,200,0.8)'; g.beginPath(); g.arc(0, 4, 8, 0, Math.PI * 2); g.fill(); } },
    // Reagan: a short-range shotgun blast of jelly beans
    jellybeans: { speed: 420, spread: [-90, -45, 0, 45, 90], life: 0.4, dmg: 2.8, w: 5, h: 4, fx: 'stun', cool: 1.2, sfx: 'shot', hitSfx: 'punch',
      draw(g, p, s, t) { const c = ['#e83a3a', '#3ac83a', '#f0d030', '#a040e0', '#f08a20', '#f070b0'][Math.abs(Math.round(p.vy / 45 + 2)) % 6]; g.rotate(t * 20); g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, 3.4, 2.2, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(-1.6, -1.4, 1.6, 0.8); } },
    // Carter: peanuts flicked like bullets
    peanuts: { speed: 440, burst: { n: 6, gap: 0.07, jitter: 40 }, dmg: 2.4, w: 5, h: 4, fx: 'stun', cool: 1.4, sfx: 'chomp', hitSfx: 'punch',
      draw(g, p, s, t) { g.rotate(t * 24); g.fillStyle = '#c8a060'; g.beginPath(); g.ellipse(-1.6, 0, 2.4, 2, 0, 0, Math.PI * 2); g.ellipse(1.6, 0, 2.4, 2, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = 'rgba(90,60,20,0.5)'; g.fillRect(-0.3, -1.6, 0.6, 3.2); } },
    // FDR: New Deal agencies in steel letters, three at once
    letters: { speed: 300, spread: [-80, 0, 80], dmg: 5, w: 9, h: 6, fx: 'stun', hitSfx: 'clang',
      draw(g, p, s, t) { const word = p.vy < -20 ? 'WPA' : p.vy > 20 ? 'TVA' : 'CCC'; g.rotate(t * 14 * s); g.fillStyle = '#4a4e58'; g.fillRect(-10, -5, 20, 10); g.strokeStyle = '#c8ccd4'; g.lineWidth = 0.8; g.strokeRect(-10, -5, 20, 10); g.fillStyle = '#e8ecf2'; g.font = '7px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText(word, 0, 3); g.textAlign = 'left'; } },
    // FDR: a blazing ember flicked off the cigarette holder
    ember: { speed: 420, y: 92, dmg: 6, w: 6, h: 5, fx: 'stun', fire: true, cool: 1.0, hitSfx: 'fire',
      draw(g, p, s, t) { const r = 3 + Math.sin(t * 40) * 0.6; const gr = g.createRadialGradient(0, 0, 0, 0, 0, r * 2.4); gr.addColorStop(0, 'rgba(255,240,180,1)'); gr.addColorStop(0.4, 'rgba(255,120,30,0.9)'); gr.addColorStop(1, 'rgba(255,40,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, r * 2.4, 0, Math.PI * 2); g.fill(); } },
  },

  // ---------- victory poses: each winner celebrates in character ----------
  winPoses(K) {
    const { R, PI, FX, SFX, FLOOR, game, once, fj, hurtH, rnd, lerp } = K;
    const bubble = (f, str, fill = 'gold') => game.bubbles.push({ str, x: f.x, y: f.y - hurtH(f) - 22, t: 0, life: 1.8, size: 13, fill });
    return {
      // boot up on the fallen, Delaware-crossing stance, coat whipping in the wind
      washington: { fp: t => ({ liftR: 9, aR: [0.5, -0.9], aL: [0.35, 0.15], head: -0.12, sway: -0.02 }),
        fx(f, t) { if (Math.random() < 0.3) { const c = fj(f, 'chest'); FX.puff(c[0] - 30 - rnd(0, 20), c[1] + rnd(-20, 20), 'rgba(230,235,245,0.5)', 1, 1); } } },
      // leans on the maul and slowly tips the stovepipe
      lincoln: { fp: t => ({ aL: [0.25, 0.1], aR: t > 0.6 && t < 1.8 ? [2.75, 0.45] : [0.4, 0.2], head: t > 0.6 && t < 1.8 ? 0.08 : 0 }),
        draw(g, f) { const h = fj(f, 'handL'); R.line(g, h[0], h[1] - 4, h[0] + 2, FLOOR, '#6a4422', 2.2); g.fillStyle = '#4a4e56'; g.fillRect(h[0] - 3, FLOOR - 9, 9, 9); g.fillStyle = '#7a8088'; g.fillRect(h[0] - 3, FLOOR - 9, 9, 2); } },
      // signs a parchment with a flourish of the quill
      jefferson: { fp: t => ({ aL: [0.4, 4.0], aR: [0.42 + Math.sin(t * 9) * 0.06, 4.05 + Math.sin(t * 13) * 0.12], head: 0.15 }),
        fx(f, t) { if (once(f, 'sig', t, 1.4)) { bubble(f, 'SIGNED.'); SFX.slash(); } },
        draw(g, f, t) {
          const L = fj(f, 'handL'), Rh = fj(f, 'handR'), px = (L[0] + Rh[0]) / 2, py = Math.max(L[1], Rh[1]) - 2;
          g.fillStyle = '#ecdfba'; g.fillRect(px - 13, py - 9, 26, 18); g.fillStyle = '#d8c89a'; g.fillRect(px - 14, py - 10, 28, 2.4); g.fillRect(px - 14, py + 8, 28, 2.4);
          g.fillStyle = 'rgba(70,45,20,0.6)'; for (let i = 0; i < 4; i++) g.fillRect(px - 10, py - 6 + i * 3, 20, 0.6);
          const n = Math.min(1, t / 1.4); g.strokeStyle = '#2a1a0a'; g.lineWidth = 0.7; g.beginPath(); for (let i = 0; i <= 20 * n; i++) { const x = px - 9 + i * 0.9, y = py + 5 + Math.sin(i * 1.3) * 1.6; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
          R.line(g, Rh[0], Rh[1], Rh[0] + 8, Rh[1] - 14, '#f4f0e6', 1.6); R.line(g, Rh[0] + 2, Rh[1] - 3, Rh[0] + 9, Rh[1] - 16, 'rgba(200,200,190,0.8)', 0.6);
        } },
      // plants the cane, hair whipping in the wind, and glares
      jackson: { fp: t => ({ aR: [0.32, -0.12], aL: [0.3, 0.6], head: 0.05 }),
        fx(f, t) { f.st2.wind = Math.sin(t * 7) * 2.2 + 1.6; if (once(f, 'g', t, 0.6)) bubble(f, 'BY THE ETERNAL!', 'white'); if (Math.random() < 0.3) { const h = fj(f, 'head'); FX.puff(h[0] - 30, h[1] + rnd(-30, 10), 'rgba(220,225,235,0.35)', 1, 1); } },
        draw(g, f) { const h = fj(f, 'handR'); R.line(g, h[0], h[1] - 3, h[0] + 3, FLOOR, '#5a3a1e', 2.2); g.fillStyle = '#c8a040'; g.fillRect(h[0] - 2, h[1] - 5, 4, 3); } },
      // lights the cigar and blows a smoke ring
      grant: { fp: t => ({ aR: t < 1.2 ? [0.45, 2.8] : [0.3, 0.3], aL: t < 1.2 ? [0.5, 2.6] : [0.3, 0.2], head: t > 1.2 ? -0.1 : 0.05 }),
        fx(f, t) {
          f.st2.lit = t > 0.8;
          if (once(f, 'm', t, 0.5)) SFX.fire();
          if (t > 1.5 && once(f, 'ring', t, 1.5)) f.st2.ring = t;
          if (t > 0.8 && Math.random() < 0.2) { const h = fj(f, 'head'); FX.puff(h[0] + 8, h[1] + 6, 'rgba(210,210,215,0.5)', 1, 1); }
        },
        draw(g, f, t) {
          const h = fj(f, 'head');
          if (t > 0.4 && t < 1.1) { const m = fj(f, 'handR'); R.ball(g, m[0] + 1, m[1] - 3, 1.6, '#ffd060'); R.ball(g, m[0] + 1, m[1] - 4, 0.8, '#fff8e0'); }
          if (t > 1.5) { const u = Math.min(1, (t - 1.5) / 1.6); g.strokeStyle = `rgba(230,230,235,${0.75 * (1 - u)})`; g.lineWidth = 2.2; g.beginPath(); g.ellipse(h[0] + 6 + u * 14, h[1] + 2 - u * 34, 3 + u * 9, 1.6 + u * 4, 0, 0, Math.PI * 2); g.stroke(); }
        } },
      // Big Steve Flex: rolls up the sleeves, strongman double biceps
      cleveland: { fp: t => { const u = Math.min(1, t / 0.6), p = 1 + Math.sin(t * 6) * 0.05; return { aR: [lerp(0.3, 1.62, u), lerp(0.2, 1.48, u) * p], aL: [lerp(0.3, 1.62, u), lerp(0.2, 1.48, u) * p], spread: 8, squat: 2, jaw: 0 }; },
        fx(f, t) { if (once(f, 'f', t, 0.7)) { bubble(f, 'BIG STEVE!'); SFX.big(); } },
        draw(g, f, t) { if (t < 0.6) return; for (const side of ['handL', 'handR']) { const h = fj(f, side); g.fillStyle = '#ece8de'; g.fillRect(h[0] - 4, h[1] + 6, 8, 3.5); } } },
      // pats the belly, the floor creaks under him, then he twirls the mustache
      taft: { fp: t => ({ aL: [0.5 + Math.abs(Math.sin(t * 6)) * 0.15, 3.9], aR: t > 1.2 ? [0.6, 2.9] : [0.5 + Math.abs(Math.sin(t * 6 + 1)) * 0.15, 3.8], spread: 7, head: t > 1.2 ? 0.08 : -0.05 }),
        fx(f, t) { f.st2.twirl = t > 1.2 ? 1 + Math.sin(t * 10) * 1.2 : 0; if (once(f, 'c', t, 0.5)) { SFX.creak(); bubble(f, 'CREEEAK...', 'white'); } if (once(f, 'p', t, 1.6)) { SFX.thud(); game.shake = 3; } } },
      // the silent stare. Rebecca peeks out of the coat.
      coolidge: { fp: t => ({ aL: [0.12, 0.05], aR: [0.12, 0.05], spread: 2, head: 0 }),
        fx(f, t) { if (once(f, 's', t, 1.2)) bubble(f, '...', 'white'); if (once(f, 'r', t, 1.0)) SFX.chirp(); } },
      // slams the Buck Stops Here sign down and taps it twice
      truman: { fp: t => { const tap = t > 0.8 && t < 1.8 ? Math.max(0, Math.sin((t - 0.8) * PI * 2)) * 0.3 : 0; return { aR: [1.05 - tap, 3.0], aL: [0.4, 0.3], head: 0.1, jaw: 0.1 }; },
        fx(f, t) { if (once(f, 'sl', t, 0.3)) { SFX.thud(); game.shake = 4; } if (once(f, 'a', t, 1.05)) SFX.blip(); if (once(f, 'b', t, 1.55)) SFX.blip(); if (once(f, 'w', t, 1.9)) bubble(f, 'THE BUCK STOPS HERE!'); },
        draw(g, f) { const h = fj(f, 'handR'), c = fj(f, 'chest'); const sx = (h[0] + c[0]) / 2 + 4, sy = c[1] + 28; g.fillStyle = '#3a2412'; g.fillRect(sx - 18, sy - 8, 36, 16); g.fillStyle = '#5a3a1e'; g.fillRect(sx - 18, sy - 8, 36, 2.4); g.fillStyle = '#e8d8a8'; g.fillRect(sx - 15, sy - 5, 30, 10); g.fillStyle = '#2a1a0a'; g.font = '4.2px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('THE BUCK', sx, sy - 0.6); g.fillText('STOPS HERE!', sx, sy + 3.8); g.textAlign = 'left'; } },
      // sweeps the hair back, flashes the smile, points at you
      jfk: { fp: t => t < 0.9 ? { aR: [2.6, 1.2], aL: [0.3, 0.2], head: -0.08 } : { aR: [1.55, 0.05], aL: [0.3, 0.2], head: 0.05, jaw: 0.15 },
        fx(f, t) { f.st2.sweep = t < 0.9 ? Math.sin(t * 7) * 2 : 0; if (once(f, 'p', t, 1.1)) bubble(f, 'ASK NOT.'); } },
      // Stetson on, he leans in until his face fills the screen
      lbj: { fp: t => ({ aL: [0.5, 0.4], aR: [0.5, 0.4], head: 0.1, squat: Math.min(1, t / 2) * 6 }),
        fx(f, t) { if (once(f, 'y', t, 2.2)) { bubble(f, 'COME HERE, SON.', 'white'); } },
        draw(g, f, t) {
          const u = Math.max(0, Math.min(1, (t - 0.8) / 1.6)); if (u <= 0) return;
          const h = fj(f, 'neck'), def = ROSTER.ALL.lbj;
          g.save(); g.translate(h[0], h[1] + 6 * u); const sc = f.d.k * (1 + u * u * 2.4); g.scale(sc, sc); g.globalAlpha = Math.min(1, u * 3);
          def.front.head(g, { t, jaw: 0 }); g.restore();
        } },
      // both arms up in the double V, jowls shaking
      nixon: { fp: t => ({ aL: [2.55, 0.12], aR: [2.55, 0.12], head: -0.05 }),
        fx(f, t) { f.st2.jowl = Math.sin(t * 22) * 1.4; if (once(f, 'v', t, 0.5)) bubble(f, 'I AM NOT A CROOK!'); },
        draw(g, f) { for (const side of ['handL', 'handR']) { const h = fj(f, side), sd = side === 'handL' ? -1 : 1; RIG.line(g, h[0] - 1.6 * sd, h[1] - 2, h[0] - 4 * sd, h[1] - 10, '#dcaa8c', 1.6); RIG.line(g, h[0] + 1.2 * sd, h[1] - 2, h[0] + 3 * sd, h[1] - 10, '#dcaa8c', 1.6); } } },
      // the head tilt, the wink, "There you go again."
      reagan: { fp: t => ({ aL: [0.3, 0.2], aR: t > 0.6 ? [1.2, 2.2] : [0.3, 0.2], head: 0.18, sway: 0.03 }),
        fx(f, t) { f.st2.wink = t > 1.0 && t < 1.5; if (once(f, 'w', t, 1.6)) bubble(f, 'THERE YOU GO AGAIN.'); } },
      // tosses a peanut up and catches it in that grin
      carter: { fp: t => ({ aR: t % 2 < 0.4 ? [1.4, 1.6] : [0.4, 0.3], aL: [0.3, 0.2], head: (t % 2) > 0.4 && (t % 2) < 1.2 ? -0.2 : 0 }),
        fx(f, t) { const ph = t % 2; f.st2.chomp = ph > 1.1 && ph < 1.4; if (once(f, 'c' + Math.floor(t / 2), ph, 1.15)) SFX.chomp(); },
        draw(g, f, t) {
          const ph = t % 2; if (ph < 0.4 || ph > 1.15) return;
          const h = fj(f, 'handR'), m = fj(f, 'head'), u = (ph - 0.4) / 0.75;
          const x = lerp(h[0], m[0], u), y = lerp(h[1], m[1] + 6, u) - Math.sin(u * PI) * 60;
          g.fillStyle = '#c8a060'; g.beginPath(); g.ellipse(x - 1.6, y, 2.4, 2, 0, 0, PI * 2); g.ellipse(x + 1.6, y, 2.4, 2, 0, 0, PI * 2); g.fill();
        } },
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
