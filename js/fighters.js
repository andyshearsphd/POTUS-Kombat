// POTUS Kombat: the roster (bodies, outfits, heads, moves, stats)
'use strict';
const ROSTER = (() => {
  const { R, PI, sh, dims, lit, fillLit, strokes, curls, eye, brow, humanHead, eyesF, humanFront, vNeck, belt } = KIT;

  // ---------- shared bits ----------
  const GOLD = '#c8a040', BRASS = '#d8b048', SHIRT = '#ece8de', BLACK = '#141418';
  const buttons = (g, x, y0, n, gap, c = BRASS, r = 1.1) => { for (let i = 0; i < n; i++) R.ball(g, x, y0 + i * gap, r, c); };
  // a weapon held in the front hand, pointing along the forearm
  function held(g, J, len, draw) {
    const A = J.AF, dx = A.wr[0] - A.el[0], dy = A.wr[1] - A.el[1], a = Math.atan2(dy, dx);
    g.save(); g.translate(A.wr[0], A.wr[1]); g.rotate(a); draw(g, len); g.restore();
  }
  // pince-nez glasses in profile and head on
  function pinceNez(g, gold) {
    g.strokeStyle = gold ? GOLD : '#1a1a1a'; g.lineWidth = 0.7;
    g.beginPath(); g.ellipse(9.4, -12.2, 2.3, 1.9, 0, 0, PI * 2); g.stroke(); g.beginPath(); g.ellipse(4.9, -12.3, 1.8, 1.7, 0, 0, PI * 2); g.stroke();
    g.fillStyle = 'rgba(200,225,255,0.18)'; g.beginPath(); g.ellipse(9.4, -12.2, 2.1, 1.7, 0, 0, PI * 2); g.fill();
    g.strokeStyle = gold ? 'rgba(200,160,64,0.8)' : 'rgba(30,30,30,0.7)'; g.lineWidth = 0.4; g.beginPath(); g.moveTo(6.8, -12); g.quadraticCurveTo(2, -4, -1.5, -9); g.stroke();
  }
  function pinceNezF(g, gold) {
    g.strokeStyle = gold ? GOLD : '#1a1a1a'; g.lineWidth = 0.7;
    for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 3.4, -12.6, 2.3, 1.9, 0, 0, PI * 2); g.stroke(); }
    R.line(g, -1.1, -12.8, 1.1, -12.8, gold ? GOLD : '#1a1a1a', 0.6);
  }

  // =====================================================================================
  // GEORGE WASHINGTON: Continental Army general's uniform, powdered hair tied back
  // =====================================================================================
  const NAVY = '#1c3466', BUFF = '#d6be86', SK_W = '#e8c0a2';
  const washington = {
    id: 'washington', name: 'GEORGE WASHINGTON', short: 'WASHINGTON', him: 'HIM', k: 1.04, term: '1789 TO 1797',
    bio: 'First in war, first in peace, first to put you in the ground.',
    d: dims({ shW: 16, chest: 16, belly: 12, back: 11.5, thighR: 7.6, shR: 6 }),
    col: { torso: NAVY, armU: NAVY, armL: NAVY, cuff: BUFF, hand: SK_W, legU: BUFF, legL: BLACK, foot: BLACK, neck: SK_W },
    mat: { torso: 'cloth', armU: 'cloth', armL: 'cloth', legU: 'cloth', legL: 'suit' },
    stats: { speed: 1.0, power: 1.06, weight: 1.06 },
    torsoDetail(g, d, st, L) {
      // buff waistcoat, buff lapels with brass buttons, white stock at the throat
      R.poly(g, [[d.chest * 0.25, -L * 1.0], [d.chest * 0.95, -L * 0.95], [d.chest * 0.95, -L * 0.05], [d.chest * 0.35, -L * 0.05]], BUFF);
      R.poly(g, [[d.chest * 0.05, -L * 1.02], [d.chest * 0.42, -L * 0.98], [d.chest * 0.38, -L * 0.42], [d.chest * 0.12, -L * 0.5]], sh(BUFF, 0.06));
      buttons(g, d.chest * 0.33, -L * 0.9, 4, L * 0.12);
      buttons(g, d.chest * 0.82, -L * 0.82, 6, L * 0.13, '#e8d8a0', 0.8);
      R.poly(g, [[d.chest * 0.55, -L * 1.04], [d.chest * 0.98, -L * 1.0], [d.chest * 0.85, -L * 0.86], [d.chest * 0.6, -L * 0.9]], SHIRT);
      // gold epaulette with fringe on the shoulder
      g.fillStyle = GOLD; g.beginPath(); g.ellipse(-d.back * 0.1, -L * 1.0, 6.5, 2.4, 0, 0, PI * 2); g.fill();
      for (let i = 0; i < 6; i++) R.line(g, -d.back * 0.1 - 5 + i * 2, -L * 0.99, -d.back * 0.1 - 5.5 + i * 2.1, -L * 0.88, '#e0b850', 0.8);
      R.line(g, -d.back * 1.0, -L * 0.15, d.chest * 0.2, -L * 0.15, 'rgba(0,0,0,0.3)', 1);
    },
    // coat tails behind the hips
    skirt(g, d, J) {
      const h = J.hip, kn = J.LB.knee, b = d.back;
      R.poly(g, [[h[0] - b * 0.95, h[1] - 6], [h[0] - b * 0.2, h[1] - 4], [kn[0] - b * 0.4, kn[1] - 6], [kn[0] - b * 1.3, kn[1] - 2]], sh(NAVY, -0.15));
      R.line(g, kn[0] - b * 1.3, kn[1] - 2, kn[0] - b * 0.4, kn[1] - 6, BUFF, 1.2);
    },
    frontHand(g, d, J, st) {
      if (st.move !== 'swing') return;
      // the cherry-tree hatchet
      held(g, J, 22, (g, L) => {
        R.line(g, -4, 0, L, 0, '#6a4422', 2.2);
        g.fillStyle = '#b8bcc4'; g.beginPath(); g.moveTo(L - 5, -1); g.lineTo(L + 1, -1); g.quadraticCurveTo(L + 6, -6, L + 3, -11); g.lineTo(L - 4, -6); g.closePath(); g.fill();
        g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(L + 1, -9, 1, 6);
      });
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_W, chin: 2, nose: 1.5, eyeC: '#5a6a8a', browC: 'rgba(150,140,130,0.9)', cleanJaw: 1,
        back(g) {
          g.beginPath(); g.ellipse(-3, -16, 13.5, 13, 0, 0, PI * 2); fillLit(g, '#d8d4cc', -3, -16, 14, 0.2, -0.45);
          g.save(); g.clip(); strokes(g, -3, -16, 13, 12, 120, 7, PI + 0.2, 4, 0.18, 0.3); g.restore();
          // the queue, tied with a black ribbon
          R.line(g, -10, -9, -12.5, 1, '#d2cec4', 3.2); R.line(g, -10, -9, -12.5, 1, 'rgba(0,0,0,0.15)', 0.8);
          R.poly(g, [[-10.6, -7], [-14, -9.5], [-13.4, -4.6]], '#141414'); R.poly(g, [[-10.6, -7], [-7.6, -9.6], [-8, -4.6]], '#141414');
        },
        front(g) {
          g.beginPath(); g.moveTo(-7, -8); g.bezierCurveTo(-10.5, -20, -4, -29.5, 3, -29.5); g.bezierCurveTo(9.5, -29.5, 12.5, -26, 11.6, -21.5);
          g.quadraticCurveTo(8, -23, 4.5, -22.5); g.quadraticCurveTo(0.5, -21.5, -2, -17); g.quadraticCurveTo(-3.2, -12, -3, -8); g.closePath();
          fillLit(g, '#ece8e0', 2, -23, 12, 0.22, -0.45);
          g.save(); g.clip(); strokes(g, 2, -23, 11, 7, 90, 9, PI + 0.1, 4, 0.16, 0.3); g.restore();
          // the side rolls over the ear
          for (const y of [-15, -10.8]) { g.beginPath(); g.ellipse(-2.2, y, 3.6, 1.7, 0, 0, PI * 2); fillLit(g, '#f0ece4', -1.5, y, 4.4, 0.2, -0.4); g.strokeStyle = 'rgba(80,70,60,0.35)'; g.lineWidth = 0.5; g.stroke(); }
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.6, 1.5, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.8, 1.2, 5); return; }
          R.line(g, 8.8, -4.9, 11.4, -5.3, 'rgba(90,30,25,0.9)', 0.9);
        },
      });
    },
    sp1: { kind: 'proj', name: 'SILVER DOLLAR SKIP', proj: { kind: 'dollar' } },
    sp2: { kind: 'swing', name: 'CHERRY TREE CHOP', mod: { dmg: 13, fx: 'launch', vy: -720, vx: 170, spin: 1, box: [0, 60, 40, 130] } },
    fatals: [{ id: 'washington', name: 'VALLEY FORGE FREEZE' }],
  };

  // =====================================================================================
  // ABRAHAM LINCOLN: black frock coat, bow tie, chin beard, stovepipe hat
  // =====================================================================================
  const SK_L = '#d2a07c', LBLK = '#17171b';
  const lincoln = {
    id: 'lincoln', name: 'ABRAHAM LINCOLN', short: 'LINCOLN', him: 'HIM', k: 1.1, term: '1861 TO 1865', throw: 'hip',
    bio: 'Rail splitter, wrestler, lawyer. A house divided cannot stand. Neither can you.',
    d: dims({ thigh: 30, shin: 30, torso: 36, upper: 22, fore: 21, hipW: 10, shW: 14, chest: 13.5, belly: 10, back: 10, thighR: 6.2, kneeR: 4.4, ankleR: 3.2, shR: 5.2 }),
    col: { torso: LBLK, armU: LBLK, armL: LBLK, cuff: SHIRT, hand: SK_L, legU: '#1e1e24', legL: '#1e1e24', foot: '#0c0c0e', neck: SK_L },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' }, bicep: 0.12, calf: 0.15,
    stats: { speed: 1.02, power: 1.02, weight: 1.0 },
    torsoDetail(g, d, st, L) {
      R.poly(g, [[d.chest * 0.1, -L * 1.03], [d.chest * 0.9, -L * 1.03], [d.chest * 0.55, -L * 0.55]], SHIRT);
      R.poly(g, [[d.chest * 0.42, -L * 0.98], [d.chest * 0.9, -L * 1.03], [d.chest * 0.88, -L * 0.93]], BLACK);
      g.fillStyle = BLACK; g.beginPath(); g.ellipse(d.chest * 0.66, -L * 0.97, 3.2, 1.6, 0, 0, PI * 2); g.fill();
      R.poly(g, [[d.chest * 0.08, -L * 1.03], [d.chest * 0.48, -L * 0.52], [d.chest * 0.22, -L * 0.7]], '#26262c');
      R.poly(g, [[d.chest * 0.92, -L * 1.03], [d.chest * 0.6, -L * 0.48], [d.chest * 0.98, -L * 0.72]], '#26262c');
      buttons(g, d.chest * 0.62, -L * 0.42, 3, L * 0.1, '#2a2a30', 0.9);
      R.line(g, d.chest * 0.75, -L * 0.6, d.chest * 0.98, -L * 0.52, GOLD, 0.6);
    },
    // frock coat skirts down past the hips
    skirt(g, d, J) {
      const h = J.hip, kF = J.LF.knee, kB = J.LB.knee;
      const mid = [(kF[0] + kB[0]) / 2, (kF[1] + kB[1]) / 2], w = d.hipW;
      R.poly(g, [[h[0] - w * 1.15, h[1] - 8], [h[0] + w * 1.15, h[1] - 8], [mid[0] + w * 1.4 + (kF[0] - kB[0]) * 0.3, h[1] + (mid[1] - h[1]) * 0.75], [mid[0] - w * 1.5, h[1] + (mid[1] - h[1]) * 0.8]], '#1c1c22');
      R.line(g, mid[0] - w * 1.5, h[1] + (mid[1] - h[1]) * 0.8, h[0] - w * 1.15, h[1] - 8, 'rgba(255,255,255,0.06)', 1);
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_L, chin: 3.2, nose: 1.1, eyeC: '#5a4a3a', browC: 'rgba(24,16,10,0.95)',
        back(g) { g.beginPath(); g.ellipse(-3, -15, 12, 12, 0, 0, PI * 2); fillLit(g, '#20160e', -3, -15, 12, 0.12, -0.6); g.save(); g.clip(); strokes(g, -3, -15, 12, 11, 90, 4, PI * 0.6, 4, 0.35, 0.1); g.restore(); },
        front(g) {
          // hollow cheek, the mole, hair at the temple under the hat
          g.fillStyle = 'rgba(70,30,15,0.22)'; g.beginPath(); g.ellipse(5, -6.5, 3.2, 2.4, 0, 0, PI * 2); g.fill();
          g.fillStyle = '#6a3a28'; g.beginPath(); g.arc(7.4, -7.2, 0.6, 0, PI * 2); g.fill();
          g.fillStyle = '#20160e'; g.beginPath(); g.moveTo(-1.6, -9); g.quadraticCurveTo(-3.2, -17, -0.5, -22); g.lineTo(4, -22.5); g.quadraticCurveTo(1.6, -18, 1.2, -9); g.closePath(); g.fill();
          if (st.noHat) return;
          // stovepipe hat
          const hy = -22.5;
          g.fillStyle = '#0c0c10'; g.beginPath(); g.ellipse(2.5, hy, 13.5, 2.6, -0.05, 0, PI * 2); g.fill();
          g.beginPath(); g.moveTo(-6.5, hy); g.lineTo(-5.8, hy - 27); g.quadraticCurveTo(2.5, hy - 29, 11, hy - 27); g.lineTo(11.8, hy); g.closePath();
          const gr = g.createLinearGradient(-6.5, 0, 11.8, 0); gr.addColorStop(0, '#060608'); gr.addColorStop(0.55, '#24242c'); gr.addColorStop(0.7, '#3a3a44'); gr.addColorStop(1, '#0c0c10'); g.fillStyle = gr; g.fill();
          g.fillStyle = '#050506'; g.fillRect(-6.3, hy - 5, 18, 4);
          g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(5, hy - 26, 1.4, 21);
        },
        beard(g) {
          // chin curtain: no mustache
          g.beginPath(); g.moveTo(-1.4, -9); g.quadraticCurveTo(-2.6, -1, 2.6, 4.6); g.quadraticCurveTo(8.5, 8.2, 12.2, 2.4); g.quadraticCurveTo(11.8, 0, 11, -1.6);
          g.quadraticCurveTo(8.4, 2, 5, 1); g.quadraticCurveTo(1.8, -2.4, 1.4, -9); g.closePath();
          fillLit(g, '#1e140c', 3, -2, 9, 0.12, -0.6); g.save(); g.clip(); strokes(g, 3, -2, 9, 7, 90, 5, 1.6, 2, 0.4, 0.12); g.restore();
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.4, 1.4, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.6, 1.2, 5); return; }
          R.line(g, 9, -4.7, 11.4, -4.8, 'rgba(90,30,25,0.85)', 0.8);
        },
      });
    },
    sp1: { kind: 'proj', name: 'RAIL SPLITTER', proj: { kind: 'rail' } },
    sp3: { kind: 'proj', name: 'STOVEPIPE BOOMERANG', proj: { kind: 'stovepipe' } },
    fatals: [{ id: 'lincoln', name: 'HOUSE DIVIDED' }],
  };

  // =====================================================================================
  // THEODORE ROOSEVELT: Rough Rider khakis, polka-dot neckerchief, pince-nez, mustache
  // =====================================================================================
  const KHAKI = '#a48c5c', SK_T = '#e2ae8c';
  const teddy = {
    id: 'teddy', name: 'TEDDY ROOSEVELT', short: 'TEDDY', him: 'HIM', k: 0.98, term: '1901 TO 1909', throw: 'shoulder',
    bio: 'Speaks softly. Carries a big stick. Has never once spoken softly.',
    d: dims({ shW: 17, chest: 18, belly: 14, back: 13, thighR: 8, kneeR: 5.4, shR: 6.6, elbowR: 4.4, upper: 19, fore: 18 }),
    col: { torso: KHAKI, armU: KHAKI, armL: KHAKI, hand: SK_T, legU: '#8a7650', legL: '#5a3a1e', foot: '#2a1a0e', neck: SK_T },
    mat: { torso: 'cloth', armU: 'cloth', armL: 'cloth', legU: 'cloth', legL: 'cloth' }, bicep: 0.35,
    stats: { speed: 0.98, power: 1.1, weight: 1.1 },
    torsoDetail(g, d, st, L) {
      // polka-dot neckerchief
      R.poly(g, [[d.chest * 0.1, -L * 1.04], [d.chest * 0.95, -L * 1.02], [d.chest * 0.7, -L * 0.8]], '#1e3a7a');
      g.fillStyle = '#f0f0f0'; for (let i = 0; i < 7; i++) g.fillRect(d.chest * (0.25 + (i % 4) * 0.17), -L * (1.0 - ((i / 4) | 0) * 0.08), 0.9, 0.9);
      buttons(g, d.chest * 0.75, -L * 0.75, 4, L * 0.15, '#6a5a3a', 0.9);
      g.strokeStyle = 'rgba(60,45,20,0.6)'; g.lineWidth = 0.7; g.strokeRect(d.chest * 0.2, -L * 0.75, 6, 6); g.strokeRect(d.chest * 0.2, -L * 0.75, 6, 2);
      // cartridge belt
      g.fillStyle = '#5a3e1e'; g.fillRect(-d.back * 1.2, -4, d.back * 1.2 + d.chest * 1.2, 4);
      g.fillStyle = '#c8a040'; for (let i = 0; i < 8; i++) g.fillRect(-d.back * 1.0 + i * 3.4, -4.5, 1.3, 2.4);
      g.fillStyle = BRASS; g.fillRect(d.chest * 0.75, -4.2, 3, 4);
    },
    frontHand(g, d, J, st) {
      if (st.move !== 'swing') return;
      // the big stick
      held(g, J, 30, (g, L) => {
        R.line(g, -5, 0, L, 0, '#5a3a1a', 3.6); R.line(g, -5, -0.8, L, -0.8, 'rgba(255,220,180,0.15)', 1);
        for (let i = 0; i < 4; i++) R.ball(g, 4 + i * 7, i % 2 ? 1.6 : -1.6, 1.4, '#4a2e12');
        R.ball(g, L + 1, 0, 3.4, '#4a2e14');
      });
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_T, chin: 1.2, nose: 0.4, eyeC: '#3a4a6a', browC: 'rgba(90,58,32,0.95)',
        back(g) { g.beginPath(); g.ellipse(-3, -17, 11.5, 11, 0, 0, PI * 2); fillLit(g, '#5a3a20', -3, -17, 12, 0.14, -0.55); g.save(); g.clip(); strokes(g, -3, -17, 11, 10, 70, 6, PI, 3, 0.3, 0.12); g.restore(); },
        front(g) {
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-10, -20, -5, -27.5, 2.5, -27.5); g.bezierCurveTo(8.5, -27.5, 11.5, -25, 11, -21.5);
          g.quadraticCurveTo(7, -22.2, 3.5, -21.6); g.quadraticCurveTo(-1, -20.5, -2.6, -16); g.quadraticCurveTo(-3.4, -12, -3.2, -9); g.closePath();
          fillLit(g, '#6a4426', 2, -22, 10, 0.16, -0.55); g.save(); g.clip(); strokes(g, 2, -22, 10, 6, 60, 8, PI + 0.3, 3, 0.3, 0.12); g.restore();
          pinceNez(g, true);
          if (st.move === 'rush') {
            // the ghost of a bull moose rides along on his head
            g.save(); g.globalAlpha = 0.55; g.strokeStyle = '#e8dcc0'; g.lineWidth = 2.2; g.lineCap = 'round';
            for (const sd of [-1, 1]) { const bx = 2 + sd * 4; g.beginPath(); g.moveTo(bx, -26); g.quadraticCurveTo(bx + 10, -34, bx + 18, -30); g.stroke(); for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(bx + 6 + i * 3.5, -31 - i * 0.5); g.lineTo(bx + 8 + i * 3.5, -38 - (i % 2) * 2); g.stroke(); } }
            g.restore();
          }
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.2, -4.4, 1.6, 1.4, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.6, -3.6, 1.2, 5); }
          else { g.fillStyle = '#2a0606'; g.fillRect(8.4, -5.6, 3.8, 2); g.fillStyle = '#f2ecda'; g.fillRect(8.6, -5.6, 3.4, 1.3); g.fillStyle = 'rgba(60,40,30,0.5)'; for (let i = 0; i < 4; i++) g.fillRect(8.9 + i * 0.85, -5.6, 0.2, 1.3); }
          // the mustache
          g.beginPath(); g.moveTo(7.2, -7.8); g.quadraticCurveTo(10.5, -8.9, 13.4, -7.2); g.quadraticCurveTo(13.6, -5.4, 12.2, -5.0); g.quadraticCurveTo(10, -6.2, 7.6, -5.6); g.closePath();
          fillLit(g, '#6e4626', 10, -7, 4, 0.12, -0.5); g.save(); g.clip(); strokes(g, 10, -6.6, 3.5, 1.5, 24, 3, 1.4, 1.4, 0.35, 0.12); g.restore();
        },
      });
    },
    sp1: { kind: 'swing', name: 'BIG STICK', mod: { dmg: 15, vx: 380, vy: -400, t: [0.24, 0.1, 0.3], sfx: 'whoosh' } },
    sp2: { kind: 'rush', name: 'BULL MOOSE CHARGE', mod: { dmg: 13, speed: 380 } },
    fatals: [{ id: 'teddy', name: 'MOUNTED TROPHY' }],
  };

  // =====================================================================================
  // FRANKLIN D. ROOSEVELT: navy suit and naval cape, pince-nez, cigarette holder, armored chair
  // =====================================================================================
  const SUITN = '#28324a', SK_F = '#e2b498';
  const fdr = {
    id: 'fdr', name: 'FRANKLIN D. ROOSEVELT', short: 'FDR', him: 'HIM', k: 1.0, term: '1933 TO 1945', throw: 'spin',
    chair: { metal: '#6a6e78', plate: '#3c4250', tire: '#18181a' },
    bio: 'Four terms, one armored chair, zero fear. The only thing you have to fear is him.',
    d: dims({ shW: 17, chest: 17, belly: 12.5, back: 12, shR: 6.6, elbowR: 4.6, wristR: 3.4, upper: 20, fore: 19, thighR: 5.8, kneeR: 4.2, ankleR: 3 }),
    col: { torso: SUITN, armU: SUITN, armL: SUITN, cuff: SHIRT, hand: SK_F, legU: SUITN, legL: SUITN, foot: BLACK, neck: SK_F },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' }, bicep: 0.4,
    stats: { speed: 0.96, power: 1.1, weight: 1.15 },
    // the naval cape hangs behind the shoulders
    behind(g, d, J) {
      const s = J.sh, h = J.hip;
      R.poly(g, [[s[0] - d.back * 0.5, s[1] - 3], [s[0] - d.back * 2.0, h[1] + 4], [h[0] + d.back * 0.2, h[1] + 2], [s[0] + d.chest * 0.2, s[1]]], '#161c2a');
      R.line(g, s[0] - d.back * 2.0, h[1] + 4, h[0] + d.back * 0.2, h[1] + 2, 'rgba(255,255,255,0.08)', 1);
    },
    torsoDetail(g, d, st, L) {
      R.poly(g, [[d.chest * 0.12, -L * 1.03], [d.chest * 0.88, -L * 1.03], [d.chest * 0.55, -L * 0.55]], SHIRT);
      R.poly(g, [[d.chest * 0.48, -L * 0.98], [d.chest * 0.66, -L * 0.98], [d.chest * 0.62, -L * 0.5], [d.chest * 0.54, -L * 0.45], [d.chest * 0.46, -L * 0.52]], '#6a1a24');
      g.fillStyle = 'rgba(255,255,255,0.18)'; for (let i = 0; i < 5; i++) g.fillRect(d.chest * 0.48, -L * 0.92 + i * 4.5, 2.5, 0.7);
      R.poly(g, [[d.chest * 0.1, -L * 1.03], [d.chest * 0.46, -L * 0.48], [d.chest * 0.22, -L * 0.72]], '#323c56');
      R.poly(g, [[d.chest * 0.9, -L * 1.03], [d.chest * 0.62, -L * 0.45], [d.chest * 0.98, -L * 0.74]], '#323c56');
      g.fillStyle = SHIRT; g.fillRect(-d.back * 0.2, -L * 0.78, 4, 1.6);
      // cape clasp chain across the chest
      R.line(g, -d.back * 0.6, -L * 0.94, d.chest * 0.25, -L * 0.9, GOLD, 0.8);
    },
    frontHand(g, d, J, st) {
      if (st.move !== 'flurry') return;
      // Four Freedoms Spin: the cane whips round and round
      const A = J.AF.wr, a = (st.mt || 0) * 38;
      g.save(); g.globalAlpha = 0.35; g.strokeStyle = '#e8e0c8'; g.lineWidth = 1.4;
      for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(J.sh[0], J.sh[1] + 8, 26 + i * 6, a + i, a + i + 2.2); g.stroke(); }
      g.restore();
      R.line(g, A[0], A[1], A[0] + Math.cos(a) * 28, A[1] + Math.sin(a) * 28, '#2a1a10', 2.2);
      R.ball(g, A[0] + Math.cos(a) * 28, A[1] + Math.sin(a) * 28, 1.8, GOLD);
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_F, chin: 2.8, nose: 0.8, eyeC: '#3a4a6a', browC: 'rgba(90,80,70,0.9)', cleanJaw: 1,
        back(g) { g.beginPath(); g.ellipse(-3, -16, 11.5, 11, 0, 0, PI * 2); fillLit(g, '#7a7470', -3, -16, 12, 0.18, -0.5); g.save(); g.clip(); strokes(g, -3, -16, 11, 10, 70, 5, PI + 0.2, 4, 0.25, 0.25); g.restore(); },
        front(g) {
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-10, -20, -5, -27.5, 1.5, -27.8); g.bezierCurveTo(5.5, -27.8, 7, -26.2, 6.2, -24.5);
          g.quadraticCurveTo(2.5, -23, -0.5, -20.5); g.quadraticCurveTo(-2.8, -15.5, -3, -9); g.closePath();
          fillLit(g, '#8a847e', 0, -22, 9, 0.2, -0.45); g.save(); g.clip(); strokes(g, 0, -22, 9, 6, 50, 9, PI + 0.2, 4, 0.2, 0.25); g.restore();
          pinceNez(g, false);
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.4, 1.6, 1.4, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.6, 1.2, 5); return; }
          // big grin, then the jaunty cigarette holder tilted up
          g.fillStyle = '#2a0606'; g.beginPath(); g.moveTo(7, -5.8); g.quadraticCurveTo(9.8, -2.6, 12.2, -5.6); g.quadraticCurveTo(9.6, -5, 7, -5.8); g.fill();
          g.fillStyle = '#f2ecda'; g.fillRect(7.8, -5.6, 3.6, 1.2);
          R.line(g, 11, -5.2, 21, -12.5, '#141414', 1.1);
          R.line(g, 21, -12.5, 24.2, -14.6, '#f4f0e6', 1.3);
          R.ball(g, 24.6, -14.9, 0.9, '#ff5a20');
        },
      });
    },
    sp1: { kind: 'proj', name: 'ALPHABET SOUP', proj: { kind: 'letters' } },
    sp2: { kind: 'flurry', name: 'FOUR FREEDOMS SPIN', mod: { dmg: 2.6, t: [0.08, 0.8, 0.26] } },
    sp3: { kind: 'proj', name: 'CIGARETTE HOLDER EMBER', proj: { kind: 'ember' } },
    fatals: [{ id: 'fdr', name: 'NEW DEAL' }],
  };

  const FIGHTERS = [washington, lincoln, teddy, fdr];
  const BOSSES = [];

  // ---------- front views for the victory poses ----------
  const FRONT = {
    washington: {
      detail: (g, d, G) => {
        R.poly(g, [[-G.shx * 0.5, G.sY], [G.shx * 0.5, G.sY], [G.shx * 0.42, G.hipY], [-G.shx * 0.42, G.hipY]], BUFF);
        for (const sd of [-1, 1]) R.poly(g, [[sd * G.shx * 0.5, G.sY], [sd * G.shx * 0.95, G.sY + 2], [sd * G.shx * 0.6, G.sY + 22], [sd * G.shx * 0.42, G.sY + 20]], sh(BUFF, 0.08));
        buttons(g, 0, G.sY + 8, 6, 4.5);
        R.poly(g, [[-4, G.sY - 1], [4, G.sY - 1], [0, G.sY + 6]], SHIRT);
      },
      overHead(g, d, G) { for (const sd of [-1, 1]) { g.fillStyle = GOLD; g.beginPath(); g.ellipse(sd * G.shx * 0.95, G.sY + 1, 5, 2.4, 0, 0, PI * 2); g.fill(); for (let i = 0; i < 5; i++) R.line(g, sd * G.shx * 0.95 - 4 + i * 2, G.sY + 2, sd * G.shx * 0.95 - 4 + i * 2, G.sY + 7, '#e0b850', 0.8); } },
      head(g, st) {
        humanFront(g, st, { skin: SK_W, w: 8.8, chin: 1.6, eyeC: '#5a6a8a', browC: 'rgba(150,140,130,0.9)',
          back(g) { g.beginPath(); g.ellipse(0, -17, 13, 12, 0, 0, PI * 2); fillLit(g, '#d8d4cc', 0, -17, 13, 0.2, -0.4); },
          front(g, jaw) {
            g.beginPath(); g.moveTo(-9, -14); g.quadraticCurveTo(-9.5, -27.5, 0, -28.5); g.quadraticCurveTo(9.5, -27.5, 9, -14); g.quadraticCurveTo(5, -22, 0, -22); g.quadraticCurveTo(-5, -22, -9, -14); g.closePath(); fillLit(g, '#ece8e0', 0, -22, 10, 0.2, -0.4);
            for (const sd of [-1, 1]) for (const y of [-15, -10.5]) { g.beginPath(); g.ellipse(sd * 10, y, 2.6, 2, 0, 0, PI * 2); fillLit(g, '#f0ece4', sd * 10, y, 3, 0.2, -0.4); }
            if (!st.dead) R.line(g, -2.6, -4, 2.6, -4, 'rgba(90,30,25,0.9)', 0.9);
          }, mouth() {} });
      },
    },
    lincoln: {
      detail: (g, d, G) => { R.poly(g, [[-4.5, G.sY - 1], [4.5, G.sY - 1], [0, G.sY + 14]], SHIRT); g.fillStyle = BLACK; g.beginPath(); g.ellipse(-2.6, G.sY + 1.5, 2.8, 1.6, 0, 0, PI * 2); g.ellipse(2.6, G.sY + 1.5, 2.8, 1.6, 0, 0, PI * 2); g.fill(); buttons(g, 0, G.sY + 18, 3, 4, '#2a2a30', 0.9); },
      skirt: (g, d, G) => R.poly(g, [[-G.hx * 2.2, G.hipY - 4], [G.hx * 2.2, G.hipY - 4], [G.hx * 2.6, G.hipY + 18 * G.k], [-G.hx * 2.6, G.hipY + 18 * G.k]], '#1c1c22'),
      head(g, st) {
        humanFront(g, st, { skin: SK_L, w: 7.8, chin: 2.6, eyeC: '#5a4a3a', browC: 'rgba(24,16,10,0.95)',
          back(g) { g.beginPath(); g.ellipse(0, -16, 11, 11, 0, 0, PI * 2); fillLit(g, '#20160e', 0, -16, 11, 0.12, -0.6); },
          front(g, jaw) {
            g.fillStyle = 'rgba(70,30,15,0.2)'; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 5, -6.5, 2.4, 2.6, 0, 0, PI * 2); g.fill(); }
            g.fillStyle = '#6a3a28'; g.beginPath(); g.arc(4.2, -6.8, 0.6, 0, PI * 2); g.fill();
            g.beginPath(); g.moveTo(-8, -10); g.quadraticCurveTo(-8.8, 1, 0, 5); g.quadraticCurveTo(8.8, 1, 8, -10); g.lineTo(6.6, -9); g.quadraticCurveTo(6, -1.5, 0, 0.6); g.quadraticCurveTo(-6, -1.5, -6.6, -9); g.closePath(); fillLit(g, '#1e140c', 0, -3, 9, 0.12, -0.6);
            if (!st.dead) R.line(g, -2.4, -3.8, 2.4, -3.8, 'rgba(90,30,25,0.85)', 0.8);
            if (st.noHat) return;
            g.fillStyle = '#0c0c10'; g.beginPath(); g.ellipse(0, -24, 13, 2.8, 0, 0, PI * 2); g.fill();
            const gr = g.createLinearGradient(-8.5, 0, 8.5, 0); gr.addColorStop(0, '#060608'); gr.addColorStop(0.5, '#2a2a32'); gr.addColorStop(1, '#08080a'); g.fillStyle = gr;
            g.beginPath(); g.moveTo(-8.5, -24); g.lineTo(-8, -51); g.lineTo(8, -51); g.lineTo(8.5, -24); g.closePath(); g.fill(); g.fillStyle = '#050506'; g.fillRect(-8.5, -29, 17, 4);
          }, mouth() {} });
      },
    },
    teddy: {
      detail: (g, d, G) => { R.poly(g, [[-5, G.sY - 1], [5, G.sY - 1], [0, G.sY + 9]], '#1e3a7a'); g.fillStyle = '#f0f0f0'; for (let i = 0; i < 5; i++) g.fillRect(-3 + (i % 3) * 3, G.sY + 1 + ((i / 3) | 0) * 3, 0.9, 0.9); buttons(g, 0, G.sY + 12, 4, 5, '#6a5a3a', 0.9); belt(g, G, '#5a3e1e', BRASS); },
      head(g, st) {
        humanFront(g, st, { skin: SK_T, w: 9.2, chin: 0.8, eyeC: '#3a4a6a', browC: 'rgba(90,58,32,0.95)',
          back(g) { g.beginPath(); g.ellipse(0, -18, 11.5, 10.5, 0, 0, PI * 2); fillLit(g, '#5a3a20', 0, -18, 11, 0.14, -0.55); },
          front(g, jaw) {
            g.beginPath(); g.moveTo(-9, -15); g.quadraticCurveTo(-9.5, -27, 0, -27.5); g.quadraticCurveTo(9.5, -27, 9, -15); g.quadraticCurveTo(6, -22, -1, -22.5); g.quadraticCurveTo(-6, -22, -9, -15); g.closePath(); fillLit(g, '#6a4426', 0, -22, 10, 0.16, -0.55);
            pinceNezF(g, true);
            if (!st.dead) { g.fillStyle = '#2a0606'; g.fillRect(-3.4, -5.2, 6.8, 2.6 + jaw); g.fillStyle = '#f2ecda'; g.fillRect(-3.2, -5.2, 6.4, 1.6); }
            g.beginPath(); g.moveTo(-6, -6); g.quadraticCurveTo(0, -8.8, 6, -6); g.quadraticCurveTo(6.4, -4.4, 4.8, -4.6); g.quadraticCurveTo(0, -6.2, -4.8, -4.6); g.quadraticCurveTo(-6.4, -4.4, -6, -6); fillLit(g, '#6e4626', 0, -6, 6, 0.12, -0.5);
          }, mouth() {} });
      },
    },
    fdr: {
      detail: (g, d, G) => { R.poly(g, [[-4.5, G.sY - 1], [4.5, G.sY - 1], [0, G.sY + 14]], SHIRT); R.poly(g, [[-1.4, G.sY], [1.4, G.sY], [1.8, G.sY + 13], [0, G.sY + 15], [-1.8, G.sY + 13]], '#6a1a24'); },
      behind: (g, d, G) => R.poly(g, [[-G.shx * 1.3, G.sY], [G.shx * 1.3, G.sY], [G.shx * 1.7, G.hipY + 6], [-G.shx * 1.7, G.hipY + 6]], '#161c2a'),
      head(g, st) {
        humanFront(g, st, { skin: SK_F, w: 9, chin: 2.4, eyeC: '#3a4a6a', browC: 'rgba(90,80,70,0.9)',
          back(g) { g.beginPath(); g.ellipse(0, -17, 11.5, 10.5, 0, 0, PI * 2); fillLit(g, '#7a7470', 0, -17, 11, 0.18, -0.5); },
          front(g, jaw) {
            g.beginPath(); g.moveTo(-9, -15); g.quadraticCurveTo(-9.5, -27, 0, -27.5); g.quadraticCurveTo(9.5, -27, 9, -15); g.quadraticCurveTo(5, -24, 0, -24.5); g.quadraticCurveTo(-5, -24, -9, -15); g.closePath(); fillLit(g, '#8a847e', 0, -23, 10, 0.2, -0.45);
            pinceNezF(g, false);
            if (!st.dead) { g.fillStyle = '#2a0606'; g.beginPath(); g.moveTo(-3.6, -4.4); g.quadraticCurveTo(0, -1, 3.6, -4.4); g.quadraticCurveTo(0, -3.6, -3.6, -4.4); g.fill(); g.fillStyle = '#f2ecda'; g.fillRect(-2.8, -4.3, 5.6, 1.1); R.line(g, 2.6, -3.6, 12, -11, '#141414', 1.1); R.line(g, 12, -11, 14.6, -13.3, '#f4f0e6', 1.2); R.ball(g, 15, -13.6, 0.9, '#ff5a20'); }
          }, mouth() {} });
      },
    },
  };
  const PORTRAIT = { washington: [0.5, 0.9, 0.86], lincoln: [0.48, 1.05, 0.78], teddy: [0.5, 0.88, 0.9], fdr: [0.42, 0.9, 0.86] };
  return KIT.roster(FIGHTERS, BOSSES, { front: FRONT, portrait: PORTRAIT });
})();
