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

  // =====================================================================================
  // THOMAS JEFFERSON: brown coat, red waistcoat, white cravat, sandy-red hair going gray, tied back
  // =====================================================================================
  const SK_J = '#e8b89a', JCOAT = '#4a3424', JVEST = '#8a2a1e', JHAIR = '#b88a6a';
  const jefferson = {
    id: 'jefferson', name: 'THOMAS JEFFERSON', short: 'JEFFERSON', him: 'HIM', k: 1.07, term: '1801 TO 1809',
    bio: 'Wrote that all men are created equal. Then he bought half a continent to fight in.',
    d: dims({ thigh: 29, shin: 28, torso: 35, shW: 14.5, chest: 14.5, belly: 11, back: 10.5, thighR: 6.8, shR: 5.4 }),
    col: { torso: JCOAT, armU: JCOAT, armL: JCOAT, cuff: SHIRT, hand: SK_J, legU: '#5a4430', legL: '#e8e2d4', foot: BLACK, neck: SK_J },
    mat: { torso: 'cloth', armU: 'cloth', armL: 'cloth', legU: 'cloth', legL: 'cloth' },
    stats: { speed: 1.04, power: 0.98, weight: 0.98 },
    torsoDetail(g, d, st, L) {
      // red waistcoat under open lapels, white cravat
      R.poly(g, [[d.chest * 0.2, -L * 1.0], [d.chest * 0.9, -L * 0.98], [d.chest * 0.92, -L * 0.1], [d.chest * 0.3, -L * 0.1]], JVEST);
      buttons(g, d.chest * 0.62, -L * 0.82, 6, L * 0.12, '#d8c8a0', 0.8);
      R.poly(g, [[d.chest * 0.05, -L * 1.02], [d.chest * 0.4, -L * 0.98], [d.chest * 0.32, -L * 0.4], [d.chest * 0.1, -L * 0.5]], sh(JCOAT, 0.12));
      R.poly(g, [[d.chest * 0.45, -L * 1.06], [d.chest * 1.0, -L * 1.02], [d.chest * 0.88, -L * 0.82], [d.chest * 0.6, -L * 0.84]], SHIRT);
      R.poly(g, [[d.chest * 0.62, -L * 0.86], [d.chest * 0.84, -L * 0.84], [d.chest * 0.76, -L * 0.7]], '#f4f0e6');
      R.line(g, -d.back * 1.0, -L * 0.12, d.chest * 0.2, -L * 0.12, 'rgba(0,0,0,0.3)', 1);
    },
    skirt(g, d, J) {
      const h = J.hip, kn = J.LB.knee, b = d.back;
      R.poly(g, [[h[0] - b * 0.95, h[1] - 6], [h[0] - b * 0.2, h[1] - 4], [kn[0] - b * 0.3, kn[1] - 8], [kn[0] - b * 1.2, kn[1] - 4]], sh(JCOAT, -0.15));
    },
    frontHand(g, d, J, st) {
      if (st.move !== 'cgrab') return;
      // the deed to Louisiana, unrolled at arm's length
      held(g, J, 6, (g, L) => {
        g.fillStyle = '#e8dcb8'; g.fillRect(L - 2, -9, 12, 18); g.fillStyle = 'rgba(90,60,30,0.5)'; for (let i = 0; i < 5; i++) g.fillRect(L, -6 + i * 3, 8, 0.6);
        g.fillStyle = '#c8b48a'; g.fillRect(L - 3, -10, 14, 2.4); g.fillRect(L - 3, 8, 14, 2.4);
      });
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_J, chin: 2.2, nose: 1.1, eyeC: '#6a7a6a', browC: 'rgba(150,100,70,0.9)', cleanJaw: 1,
        back(g) {
          g.beginPath(); g.ellipse(-3, -16, 13, 12.5, 0, 0, PI * 2); fillLit(g, JHAIR, -3, -16, 13, 0.2, -0.5);
          g.save(); g.clip(); strokes(g, -3, -16, 12, 11, 110, 11, PI + 0.3, 4, 0.22, 0.25); g.restore();
          R.line(g, -10, -9, -12, 0, sh(JHAIR, -0.1), 3); R.poly(g, [[-10.4, -7], [-13.6, -9.4], [-13, -4.8]], '#141414');
        },
        front(g) {
          g.beginPath(); g.moveTo(-7, -8); g.bezierCurveTo(-10.5, -20, -4, -29, 3, -29); g.bezierCurveTo(9, -29, 12, -25.5, 11.2, -21.5);
          g.quadraticCurveTo(7.5, -23.5, 4, -22.5); g.quadraticCurveTo(0, -21, -2.4, -16); g.quadraticCurveTo(-3.2, -12, -3, -8); g.closePath();
          fillLit(g, sh(JHAIR, 0.06), 2, -23, 12, 0.22, -0.45);
          g.save(); g.clip(); strokes(g, 2, -23, 11, 7, 90, 12, PI + 0.1, 4, 0.2, 0.3); g.restore();
          g.fillStyle = 'rgba(200,170,150,0.35)'; for (let i = 0; i < 6; i++) g.fillRect(-1 + i * 1.6, -26 + (i % 2), 1, 3);
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.6, 1.5, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.8, 1.2, 5); return; }
          g.strokeStyle = 'rgba(100,35,30,0.9)'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(8.6, -5.2); g.quadraticCurveTo(10, -4.6, 11.4, -5.4); g.stroke();
        },
      });
    },
    sp1: { kind: 'cgrab', name: 'LOUISIANA PURCHASE', mod: { hold: 'pull', range: 230, dmg: 12 } },
    sp2: { kind: 'proj', name: 'POLYGRAPH DOUBLE', proj: { kind: 'polygraph' } },
    fatals: [{ id: 'jefferson', name: 'WALL OF SEPARATION' }],
  };

  // =====================================================================================
  // ANDREW JACKSON: black coat, high white collar, a shock of upswept white hair, hickory cane
  // =====================================================================================
  const SK_A = '#e0b496', JKBLK = '#1a1a20', JKHAIR = '#ece8e0';
  const cane = (g, L) => { R.line(g, -6, 0, L, 0, '#5a3a1e', 2.2); R.line(g, -6, -0.6, L, -0.6, 'rgba(255,220,170,0.18)', 0.8); for (let i = 0; i < 4; i++) R.ball(g, 2 + i * 6.5, i % 2 ? 1 : -1, 1.1, '#3a2410'); g.fillStyle = '#c8a040'; g.fillRect(-8, -1.8, 3, 3.6); };
  const jackson = {
    id: 'jackson', name: 'ANDREW JACKSON', short: 'JACKSON', him: 'HIM', k: 1.08, term: '1829 TO 1837',
    bio: 'Fought over a hundred duels, by his own count. Took a bullet to the chest and kept the bullet.',
    d: dims({ thigh: 29, shin: 29, torso: 35, shW: 14, chest: 13.5, belly: 10, back: 10, thighR: 6.2, kneeR: 4.4, shR: 5.2, elbowR: 3.6 }),
    col: { torso: JKBLK, armU: JKBLK, armL: JKBLK, cuff: SHIRT, hand: SK_A, legU: '#22222a', legL: '#22222a', foot: '#0c0c0e', neck: SHIRT },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' },
    stats: { speed: 1.06, power: 1.04, weight: 0.92 },
    torsoDetail(g, d, st, L) {
      // high white collar and stock, white shirt front, black coat lapels
      R.poly(g, [[d.chest * 0.1, -L * 1.06], [d.chest * 0.95, -L * 1.04], [d.chest * 0.65, -L * 0.6], [d.chest * 0.3, -L * 0.62]], SHIRT);
      R.poly(g, [[d.chest * 0.4, -L * 1.1], [d.chest * 0.98, -L * 1.08], [d.chest * 0.9, -L * 0.96], [d.chest * 0.45, -L * 0.98]], '#f4f2ec');
      R.poly(g, [[d.chest * 0.05, -L * 1.03], [d.chest * 0.42, -L * 0.6], [d.chest * 0.2, -L * 0.75]], '#2a2a32');
      R.poly(g, [[d.chest * 0.95, -L * 1.03], [d.chest * 0.62, -L * 0.55], [d.chest * 1.0, -L * 0.78]], '#2a2a32');
      buttons(g, d.chest * 0.7, -L * 0.45, 3, L * 0.11, '#2a2a30', 0.9);
    },
    skirt(g, d, J) {
      const h = J.hip, kn = J.LB.knee, b = d.back;
      R.poly(g, [[h[0] - b * 0.95, h[1] - 6], [h[0] - b * 0.2, h[1] - 4], [kn[0] - b * 0.3, kn[1] - 4], [kn[0] - b * 1.3, kn[1]]], '#121218');
    },
    frontHand(g, d, J, st) {
      if (st.move !== 'flurry') return;
      // Hickory Cane Beatdown: the cane cracks down again and again
      const A = J.AF, a = Math.atan2(A.wr[1] - A.el[1], A.wr[0] - A.el[0]) + Math.sin((st.mt || 0) * 46) * 0.9 - 0.4;
      g.save(); g.translate(A.wr[0], A.wr[1]); g.rotate(a); cane(g, 30); g.restore();
      g.save(); g.globalAlpha = 0.3; g.strokeStyle = '#f0e8d0'; g.lineWidth = 1.2; g.beginPath(); g.arc(A.wr[0], A.wr[1], 28, a - 0.9, a + 0.2); g.stroke(); g.restore();
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_A, chin: 3.2, nose: 1.8, eyeC: '#4a6a8a', browC: 'rgba(200,195,185,0.95)',
        back(g) { g.beginPath(); g.ellipse(-3, -17, 12.5, 12, 0, 0, PI * 2); fillLit(g, JKHAIR, -3, -17, 13, 0.18, -0.45); g.save(); g.clip(); strokes(g, -3, -17, 12, 11, 100, 21, PI * 1.3, 5, 0.2, 0.3); g.restore(); },
        front(g) {
          // the famous upswept shock, standing straight up off the forehead
          const wind = st.wind || 0;
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-11, -20, -9, -30, -4 + wind, -36);
          g.quadraticCurveTo(2 + wind, -38, 7 + wind, -33); g.quadraticCurveTo(11, -28, 10.6, -22.5);
          g.quadraticCurveTo(7, -24, 4, -23); g.quadraticCurveTo(0.5, -21.5, -2, -17); g.quadraticCurveTo(-3.2, -12, -3, -9); g.closePath();
          fillLit(g, JKHAIR, 1, -27, 13, 0.22, -0.4);
          g.save(); g.clip(); strokes(g, 1, -28, 10, 9, 110, 22, -PI * 0.55, 6, 0.18, 0.35); g.restore();
          // the dueling scar across the brow
          R.line(g, 3.5, -19.5, 7.5, -17.6, 'rgba(150,60,50,0.55)', 0.7);
          g.fillStyle = 'rgba(60,20,10,0.25)'; g.beginPath(); g.ellipse(5.4, -6.2, 3.2, 3, 0, 0, PI * 2); g.fill();
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.4, 1.5, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.6, 1.2, 5); return; }
          // the grim downturned line
          g.strokeStyle = 'rgba(90,30,25,0.95)'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(8.6, -4.4); g.quadraticCurveTo(10, -5.4, 11.4, -4.6); g.stroke();
        },
      });
    },
    sp1: { kind: 'flurry', name: 'HICKORY CANE BEATDOWN', mod: { dmg: 2.8, t: [0.07, 0.7, 0.24] }, ai: [0, 80] },
    sp2: { kind: 'cgrab', name: 'SPOILS SYSTEM', mod: { hold: 'drain', dmg: 13 } },
    fatals: [{ id: 'jackson', name: 'OLD HICKORY' }],
  };

  // =====================================================================================
  // ULYSSES S. GRANT: rumpled Union frock coat, shoulder straps, short brown beard, cigar
  // =====================================================================================
  const SK_G = '#d8a684', UBLUE = '#1e2a48', GBEARD = '#5a3a22';
  const grant = {
    id: 'grant', name: 'ULYSSES S. GRANT', short: 'GRANT', him: 'HIM', k: 1.0, term: '1869 TO 1877',
    bio: 'Unconditional Surrender Grant. Twenty cigars a day and not one retreat.',
    d: dims({ shW: 16, chest: 16, belly: 13, back: 12, thighR: 7.4, shR: 6, upper: 19, fore: 18 }),
    col: { torso: UBLUE, armU: UBLUE, armL: UBLUE, cuff: '#2a3658', hand: SK_G, legU: '#2a3450', legL: '#141414', foot: '#0c0c0c', neck: SK_G },
    mat: { torso: 'cloth', armU: 'cloth', armL: 'cloth', legU: 'cloth', legL: 'suit' },
    stats: { speed: 0.98, power: 1.08, weight: 1.06 },
    torsoDetail(g, d, st, L) {
      // double row of brass buttons, half unbuttoned at the top, shoulder strap with stars
      R.poly(g, [[d.chest * 0.25, -L * 1.03], [d.chest * 0.85, -L * 1.03], [d.chest * 0.55, -L * 0.82]], '#e8e2d4');
      R.poly(g, [[d.chest * 0.55, -L * 0.82], [d.chest * 0.95, -L * 0.96], [d.chest * 0.85, -L * 0.7]], sh(UBLUE, 0.15));
      buttons(g, d.chest * 0.42, -L * 0.74, 6, L * 0.11); buttons(g, d.chest * 0.82, -L * 0.7, 6, L * 0.11);
      g.fillStyle = '#141c34'; g.fillRect(-d.back * 0.5, -L * 1.02, 11, 4.5); g.strokeStyle = GOLD; g.lineWidth = 0.8; g.strokeRect(-d.back * 0.5, -L * 1.02, 11, 4.5);
      g.fillStyle = '#e8d070'; for (let i = 0; i < 3; i++) g.fillRect(-d.back * 0.5 + 2 + i * 3.2, -L * 1.02 + 1.6, 1.3, 1.3);
      // rumples
      g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 0.8; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-d.back * 0.6 + i * 5, -L * 0.5 + i * 3); g.quadraticCurveTo(-d.back * 0.3 + i * 5, -L * 0.42 + i * 3, -d.back * 0.1 + i * 5, -L * 0.48 + i * 3); g.stroke(); }
      g.fillStyle = '#c8a040'; g.fillRect(-d.back * 1.1, -4, d.back * 1.1 + d.chest * 1.1, 2.4);
    },
    skirt(g, d, J) {
      const h = J.hip, kF = J.LF.knee, kB = J.LB.knee, mid = [(kF[0] + kB[0]) / 2, (kF[1] + kB[1]) / 2], w = d.hipW;
      R.poly(g, [[h[0] - w * 1.2, h[1] - 6], [h[0] + w * 1.2, h[1] - 6], [mid[0] + w * 1.3 + (kF[0] - kB[0]) * 0.25, h[1] + (mid[1] - h[1]) * 0.7], [mid[0] - w * 1.4, h[1] + (mid[1] - h[1]) * 0.75]], sh(UBLUE, -0.1));
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_G, chin: 1.6, nose: 0.9, eyeC: '#4a5a7a', browC: 'rgba(70,45,25,0.95)',
        back(g) { g.beginPath(); g.ellipse(-3, -16, 11.5, 11, 0, 0, PI * 2); fillLit(g, GBEARD, -3, -16, 12, 0.15, -0.55); g.save(); g.clip(); strokes(g, -3, -16, 11, 10, 80, 31, PI, 4, 0.3, 0.12); g.restore(); },
        front(g) {
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-10, -20, -5, -27.5, 2, -27.5); g.bezierCurveTo(8, -27.5, 11, -25, 10.6, -21.5);
          g.quadraticCurveTo(6.5, -23, 2.5, -22); g.quadraticCurveTo(-1.5, -20.5, -2.8, -15.5); g.quadraticCurveTo(-3.4, -12, -3.2, -9); g.closePath();
          fillLit(g, GBEARD, 2, -22, 10, 0.15, -0.55); g.save(); g.clip(); strokes(g, 2, -22, 10, 6, 60, 32, PI + 0.3, 3, 0.3, 0.12); g.restore();
        },
        beard(g) {
          // short, full beard and mustache
          g.beginPath(); g.moveTo(-1.6, -10); g.quadraticCurveTo(-3, 0, 3, 4.2); g.quadraticCurveTo(9, 6.4, 12, 1.4); g.quadraticCurveTo(12.6, -2, 12.2, -4.2);
          g.quadraticCurveTo(13.2, -6.4, 12.4, -7.6); g.quadraticCurveTo(10, -8.6, 7.6, -7.4); g.quadraticCurveTo(5, -7, 3, -9); g.quadraticCurveTo(1, -9.6, -1.6, -10); g.closePath();
          fillLit(g, GBEARD, 5, -2, 9, 0.12, -0.55); g.save(); g.clip(); strokes(g, 5, -2, 9, 7, 90, 33, 1.6, 2, 0.35, 0.12); g.restore();
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.4, 1.4, 1.2, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.6, 1.2, 5); return; }
          // the cigar
          R.line(g, 10.6, -5, 17.4, -4.2, '#5a3418', 1.8); R.line(g, 10.6, -5.5, 17.4, -4.7, 'rgba(255,200,140,0.2)', 0.5); R.ball(g, 17.8, -4.2, 0.9, '#ff6a20');
        },
        mouth() {},
      });
    },
    sp1: { kind: 'proj', name: 'VICKSBURG BARRAGE', proj: { kind: 'mortar' } },
    sp2: { kind: 'cloud', name: 'CIGAR CLOUD', mod: { dmg: 6 } },
    fatals: [{ id: 'grant', name: 'UNCONDITIONAL SURRENDER' }],
  };

  // =====================================================================================
  // GROVER CLEVELAND: big man in a black frock coat, gold watch chain, walrus mustache
  // =====================================================================================
  const SK_C = '#e8b29a', CHAIR = '#6a5a4a';
  const cleveland = {
    id: 'cleveland', name: 'GROVER CLEVELAND', short: 'CLEVELAND', him: 'HIM', k: 1.06, term: '1885 TO 1889, 1893 TO 1897',
    bio: 'Big Steve. Twenty-two and twenty-four. Vetoed everything, including your face.',
    d: dims({ shW: 17.5, chest: 17.5, belly: 18, back: 13.5, hipW: 12.5, thighR: 8.6, kneeR: 5.6, shR: 6.6, elbowR: 4.6, wristR: 3.5, upper: 19, fore: 18 }),
    col: { torso: '#18181e', armU: '#18181e', armL: '#18181e', cuff: SHIRT, hand: SK_C, legU: '#2a2a30', legL: '#2a2a30', foot: '#0c0c0e', neck: SK_C },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' }, bicep: 0.3,
    stats: { speed: 0.92, power: 1.12, weight: 1.22 },
    torsoDetail(g, d, st, L) {
      R.poly(g, [[d.chest * 0.12, -L * 1.03], [d.chest * 0.88, -L * 1.03], [d.chest * 0.55, -L * 0.62]], SHIRT);
      g.fillStyle = BLACK; g.beginPath(); g.ellipse(d.chest * 0.62, -L * 0.98, 3, 1.5, 0, 0, PI * 2); g.fill();
      // black waistcoat over the belly, with the gold watch chain
      R.poly(g, [[d.chest * 0.2, -L * 0.75], [d.chest * 0.95, -L * 0.8], [d.belly * 1.02, -L * 0.3], [d.chest * 0.9, -L * 0.02], [d.chest * 0.3, -L * 0.02]], '#24242c');
      buttons(g, d.chest * 0.8, -L * 0.62, 4, L * 0.13, '#3a3a44', 0.9);
      g.strokeStyle = GOLD; g.lineWidth = 0.8; g.beginPath(); g.moveTo(d.chest * 0.82, -L * 0.36); g.quadraticCurveTo(d.chest * 0.5, -L * 0.24, d.chest * 0.25, -L * 0.34); g.stroke(); R.ball(g, d.chest * 0.25, -L * 0.34, 1.4, GOLD);
      R.poly(g, [[d.chest * 0.08, -L * 1.03], [d.chest * 0.42, -L * 0.55], [d.chest * 0.2, -L * 0.72]], '#2a2a32');
    },
    skirt(g, d, J) {
      const h = J.hip, kn = J.LB.knee, b = d.back;
      R.poly(g, [[h[0] - b * 1.0, h[1] - 6], [h[0] - b * 0.2, h[1] - 4], [kn[0] - b * 0.3, kn[1] - 6], [kn[0] - b * 1.2, kn[1] - 2]], '#121218');
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_C, chin: 3.6, nose: 0.8, eyeC: '#4a5a6a', browC: 'rgba(80,65,50,0.9)', cleanJaw: 1,
        back(g) { g.beginPath(); g.ellipse(-3, -15, 12, 11, 0, 0, PI * 2); fillLit(g, CHAIR, -3, -15, 12, 0.18, -0.5); g.save(); g.clip(); strokes(g, -3, -15, 11, 10, 60, 41, PI, 3, 0.3, 0.14); g.restore(); },
        front(g) {
          // thin hair combed across the dome, heavy jowls
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-9.5, -18, -6, -25.5, 1, -26); g.bezierCurveTo(5, -26.2, 7.5, -25, 7.8, -23.4);
          g.quadraticCurveTo(4, -23.8, 0.5, -22.6); g.quadraticCurveTo(-2.4, -18, -3, -9); g.closePath(); fillLit(g, CHAIR, 0, -21, 9, 0.18, -0.5);
          g.fillStyle = 'rgba(80,30,20,0.2)'; g.beginPath(); g.ellipse(6, -1, 5.5, 3, 0.2, 0, PI * 2); g.fill();
          g.fillStyle = 'rgba(255,220,200,0.12)'; g.beginPath(); g.ellipse(4, -24, 5, 2, 0, 0, PI * 2); g.fill();
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4, 1.5, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.2, 1.2, 5); }
          // the walrus mustache, hiding the mouth
          g.beginPath(); g.moveTo(6.8, -8); g.quadraticCurveTo(10.6, -9.2, 13.6, -7.4); g.quadraticCurveTo(14.4, -4.4, 12.8, -3); g.quadraticCurveTo(10.6, -4.6, 8, -4); g.quadraticCurveTo(6.4, -5, 6.8, -8); g.closePath();
          fillLit(g, '#6a5644', 10, -6, 5, 0.14, -0.5); g.save(); g.clip(); strokes(g, 10, -6, 4, 2.5, 30, 42, 1.4, 1.8, 0.35, 0.15); g.restore();
        },
      });
    },
    sp1: { kind: 'proj', name: 'GOLD STANDARD', proj: { kind: 'goldbar' } },
    sp2: { kind: 'sneak', name: 'NONCONSECUTIVE', mod: { dmg: 12, steal: 0 } },
    fatals: [{ id: 'cleveland', name: "SHERIFF'S DROP" }],
  };

  // =====================================================================================
  // WILLIAM HOWARD TAFT: the biggest president, three-piece suit, upturned handlebar mustache
  // =====================================================================================
  const SK_TF = '#eab8a0', TSUIT = '#3a3a44', TVEST = '#5a5a66';
  const taft = {
    id: 'taft', name: 'WILLIAM HOWARD TAFT', short: 'TAFT', him: 'HIM', k: 1.05, term: '1909 TO 1913',
    bio: 'President, then Chief Justice. Three hundred and forty pounds of settled law.',
    d: dims({ shW: 18.5, chest: 19, belly: 22, back: 15, hipW: 13.5, thighR: 9.4, kneeR: 6, ankleR: 3.8, shR: 7, elbowR: 4.8, wristR: 3.6, upper: 19, fore: 18, neck: 4 }),
    col: { torso: TSUIT, armU: TSUIT, armL: TSUIT, cuff: SHIRT, hand: SK_TF, legU: TSUIT, legL: TSUIT, foot: '#0c0c0e', neck: SK_TF },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' }, bicep: 0.2,
    stats: { speed: 0.86, power: 1.16, weight: 1.32 },
    torsoDetail(g, d, st, L) {
      R.poly(g, [[d.chest * 0.12, -L * 1.03], [d.chest * 0.88, -L * 1.03], [d.chest * 0.55, -L * 0.68]], SHIRT);
      R.poly(g, [[d.chest * 0.42, -L * 0.98], [d.chest * 0.68, -L * 0.98], [d.chest * 0.6, -L * 0.72], [d.chest * 0.52, -L * 0.7]], '#2a3a5a');
      // grey waistcoat straining over the belly, buttons barely holding, watch chain
      R.poly(g, [[d.chest * 0.25, -L * 0.72], [d.chest * 0.95, -L * 0.8], [d.belly * 1.0, -L * 0.3], [d.chest * 0.95, -L * 0.0], [d.chest * 0.3, -L * 0.0]], TVEST);
      buttons(g, d.chest * 0.92, -L * 0.62, 5, L * 0.12, '#2a2a30', 1);
      g.strokeStyle = GOLD; g.lineWidth = 0.8; g.beginPath(); g.moveTo(d.belly * 0.95, -L * 0.3); g.quadraticCurveTo(d.chest * 0.55, -L * 0.18, d.chest * 0.3, -L * 0.28); g.stroke();
      R.poly(g, [[d.chest * 0.08, -L * 1.03], [d.chest * 0.42, -L * 0.6], [d.chest * 0.2, -L * 0.75]], '#44444e');
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_TF, chin: 4.2, nose: 0.6, eyeC: '#3a4a5a', browC: 'rgba(80,60,40,0.9)', cleanJaw: 1,
        back(g) { g.beginPath(); g.ellipse(-3, -15, 12.5, 11.5, 0, 0, PI * 2); fillLit(g, '#4a3626', -3, -15, 12, 0.18, -0.5); g.save(); g.clip(); strokes(g, -3, -15, 12, 10, 50, 51, PI, 3, 0.3, 0.14); g.restore(); },
        front(g) {
          // short hair, high forehead, round full cheeks and a double chin
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-9.5, -18, -6, -25.5, 0.5, -26); g.bezierCurveTo(3.5, -26.2, 5, -25.4, 4.6, -24); g.quadraticCurveTo(1, -23, -1.6, -19); g.quadraticCurveTo(-3, -14, -3, -9); g.closePath(); fillLit(g, '#4a3626', 0, -21, 9, 0.18, -0.5);
          g.fillStyle = 'rgba(200,90,80,0.18)'; g.beginPath(); g.ellipse(6.5, -7, 3.6, 2.8, 0, 0, PI * 2); g.fill();
          g.fillStyle = 'rgba(80,30,20,0.22)'; g.beginPath(); g.ellipse(6, 2.4, 6, 2.4, 0.15, 0, PI * 2); g.fill();
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.2, 1.5, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.4, 1.2, 5); }
          // the handlebar mustache, ends turned up
          g.beginPath(); g.moveTo(7, -7.6); g.quadraticCurveTo(10.4, -8.8, 13, -7.6); g.quadraticCurveTo(15.6, -7.2, 16.4, -9.6); g.quadraticCurveTo(16.4, -6.2, 13.4, -5.4); g.quadraticCurveTo(10.6, -5.8, 8, -5.2); g.quadraticCurveTo(6.6, -5.8, 7, -7.6); g.closePath();
          fillLit(g, '#5a4230', 11, -7, 5, 0.14, -0.5); g.save(); g.clip(); strokes(g, 11, -7, 4.5, 1.8, 26, 52, 0.1, 2, 0.35, 0.15); g.restore();
        },
      });
    },
    sp1: { kind: 'leap', name: 'PRESIDENTIAL SLAM', mod: { dmg: 15, quake: 1 } },
    sp2: { kind: 'proj', name: 'ORDER IN THE COURT', proj: { kind: 'gavel' } },
    fatals: [{ id: 'taft', name: 'FORE!' }],
  };

  // =====================================================================================
  // CALVIN COOLIDGE: lean and buttoned up in a grey suit, pursed lips, Rebecca the raccoon in his coat
  // =====================================================================================
  const SK_CC = '#ecc0a4', CSUIT = '#4a525e', CHAIRC = '#8a6040';
  const coolidge = {
    id: 'coolidge', name: 'CALVIN COOLIDGE', short: 'COOLIDGE', him: 'HIM', k: 1.0, term: '1923 TO 1929',
    bio: 'Silent Cal. Says nothing. Does nothing. Will still beat you.',
    d: dims({ shW: 14, chest: 13.5, belly: 10.5, back: 10, thighR: 6.6, kneeR: 4.6, shR: 5.2 }),
    col: { torso: CSUIT, armU: CSUIT, armL: CSUIT, cuff: SHIRT, hand: SK_CC, legU: CSUIT, legL: CSUIT, foot: '#1a1410', neck: SK_CC },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' },
    stats: { speed: 1.0, power: 1.0, weight: 0.96 },
    torsoDetail(g, d, st, L) {
      R.poly(g, [[d.chest * 0.15, -L * 1.03], [d.chest * 0.85, -L * 1.03], [d.chest * 0.55, -L * 0.7]], SHIRT);
      R.poly(g, [[d.chest * 0.46, -L * 0.98], [d.chest * 0.64, -L * 0.98], [d.chest * 0.6, -L * 0.62], [d.chest * 0.52, -L * 0.58], [d.chest * 0.44, -L * 0.64]], '#3a2a3a');
      R.poly(g, [[d.chest * 0.1, -L * 1.03], [d.chest * 0.45, -L * 0.62], [d.chest * 0.22, -L * 0.76]], sh(CSUIT, 0.12));
      R.poly(g, [[d.chest * 0.9, -L * 1.03], [d.chest * 0.62, -L * 0.58], [d.chest * 0.98, -L * 0.76]], sh(CSUIT, 0.12));
      buttons(g, d.chest * 0.62, -L * 0.48, 3, L * 0.12, '#2a2e36', 0.9);
      // Rebecca's striped tail hanging out from under the coat
      for (let i = 0; i < 5; i++) R.ball(g, -d.back * 0.9 - i * 0.6, -L * 0.1 + i * 3, 2.2, i % 2 ? '#2a2420' : '#8a8078');
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_CC, chin: 2.6, nose: 2.2, eyeC: '#5a6a7a', browC: 'rgba(130,90,60,0.9)', cleanJaw: 1,
        back(g) { g.beginPath(); g.ellipse(-3, -16, 11.5, 11, 0, 0, PI * 2); fillLit(g, CHAIRC, -3, -16, 12, 0.18, -0.5); g.save(); g.clip(); strokes(g, -3, -16, 11, 10, 60, 61, PI + 0.2, 3, 0.28, 0.16); g.restore(); },
        front(g) {
          // thin hair parted and plastered flat
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-10, -20, -5, -27, 2, -27.2); g.bezierCurveTo(7, -27.2, 10, -25.4, 10, -22.6); g.quadraticCurveTo(5, -24, 1, -22.6); g.quadraticCurveTo(-2.4, -18, -3, -9); g.closePath();
          fillLit(g, CHAIRC, 1, -22, 10, 0.2, -0.5); g.save(); g.clip(); strokes(g, 1, -23, 9, 5, 50, 62, 0.05, 6, 0.25, 0.2); g.restore();
          R.line(g, 0, -27, 5, -25.6, 'rgba(255,230,200,0.3)', 0.6);
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.6, -4.6, 1.4, 1.2, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(10, -3.8, 1.2, 5); return; }
          // the famous thin, pursed, silent mouth
          R.line(g, 9.2, -5, 11.6, -5.2, 'rgba(110,40,35,0.95)', 0.6); g.fillStyle = 'rgba(90,30,20,0.25)'; g.fillRect(9.2, -4.4, 2.2, 0.6);
        },
      });
    },
    sp1: { kind: 'proj', name: 'REBECCA THE RACCOON', proj: { kind: 'raccoon' } },
    sp2: { kind: 'blow', name: 'KEEP COOL', mod: { fx: 'slow', dmg: 5, slowT: 2.6, sfx: 'hiss' } },
    fatals: [{ id: 'coolidge', name: 'LAMPLIGHT OATH' }],
  };

  // =====================================================================================
  // HARRY S. TRUMAN: double-breasted grey suit, bow tie, round glasses, the plain-spoken grin
  // =====================================================================================
  const SK_HT = '#e6b498', HSUIT = '#565a64';
  const signDraw = (g, x, y, a, s = 1) => {
    g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s);
    g.fillStyle = '#3a2412'; g.fillRect(-14, -6, 28, 12); g.fillStyle = '#5a3a1e'; g.fillRect(-14, -6, 28, 2);
    g.fillStyle = '#e8d8a8'; g.fillRect(-12, -4, 24, 8); g.fillStyle = '#2a1a0a'; g.font = '3.4px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('THE BUCK', 0, -0.6); g.fillText('STOPS HERE!', 0, 3); g.textAlign = 'left';
    g.restore();
  };
  const truman = {
    id: 'truman', name: 'HARRY S. TRUMAN', short: 'TRUMAN', him: 'HIM', k: 0.98, term: '1945 TO 1953',
    bio: 'Haberdasher from Missouri. He did not give them hell. He told the truth and they thought it was hell.',
    d: dims({ shW: 15.5, chest: 15.5, belly: 12, back: 11.5 }),
    col: { torso: HSUIT, armU: HSUIT, armL: HSUIT, cuff: SHIRT, hand: SK_HT, legU: HSUIT, legL: HSUIT, foot: '#1a120c', neck: SK_HT },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' },
    stats: { speed: 1.04, power: 1.04, weight: 1.0 },
    torsoDetail(g, d, st, L) {
      R.poly(g, [[d.chest * 0.15, -L * 1.03], [d.chest * 0.85, -L * 1.03], [d.chest * 0.55, -L * 0.72]], SHIRT);
      // bow tie (polka dot) and a pocket square
      g.fillStyle = '#1a2a5a'; g.beginPath(); g.ellipse(d.chest * 0.62, -L * 0.98, 3.4, 1.7, 0, 0, PI * 2); g.fill(); g.fillStyle = '#f0f0f0'; g.fillRect(d.chest * 0.55, -L * 0.99, 0.8, 0.8); g.fillRect(d.chest * 0.7, -L * 0.97, 0.8, 0.8);
      R.poly(g, [[d.chest * 0.08, -L * 1.03], [d.chest * 0.62, -L * 0.5], [d.chest * 0.2, -L * 0.75]], sh(HSUIT, 0.12));
      R.poly(g, [[d.chest * 0.92, -L * 1.03], [d.chest * 0.7, -L * 0.58], [d.chest * 1.0, -L * 0.78]], sh(HSUIT, 0.12));
      buttons(g, d.chest * 0.5, -L * 0.42, 2, L * 0.16, '#2a2a30', 1); buttons(g, d.chest * 0.85, -L * 0.42, 2, L * 0.16, '#2a2a30', 1);
      R.poly(g, [[-d.back * 0.6, -L * 0.82], [-d.back * 0.1, -L * 0.82], [-d.back * 0.3, -L * 0.74]], '#f0ece4');
    },
    frontHand(g, d, J, st) {
      if (st.move !== 'parry') return;
      const A = J.AF; signDraw(g, A.wr[0] + 6, A.wr[1] - 2, -0.1);
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_HT, chin: 1.8, nose: 0.8, eyeC: '#4a5a6a', browC: 'rgba(120,110,100,0.9)', cleanJaw: 1,
        back(g) { g.beginPath(); g.ellipse(-3, -16, 11.5, 11, 0, 0, PI * 2); fillLit(g, '#8a8680', -3, -16, 12, 0.2, -0.5); g.save(); g.clip(); strokes(g, -3, -16, 11, 10, 60, 71, PI + 0.1, 4, 0.25, 0.2); g.restore(); },
        front(g) {
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-10, -20, -5, -27, 2, -27); g.bezierCurveTo(7, -27, 9.6, -25.4, 9.2, -23); g.quadraticCurveTo(4, -23.6, 0, -22); g.quadraticCurveTo(-2.6, -18, -3, -9); g.closePath();
          fillLit(g, '#9a968e', 1, -22, 10, 0.22, -0.45); g.save(); g.clip(); strokes(g, 1, -23, 9, 5, 50, 72, PI + 0.05, 6, 0.2, 0.25); g.restore();
          // round wire-rimmed glasses
          g.strokeStyle = '#2a2a2a'; g.lineWidth = 0.8; g.beginPath(); g.arc(9.2, -12.2, 2.5, 0, PI * 2); g.stroke(); g.beginPath(); g.arc(4.6, -12.3, 2.1, 0, PI * 2); g.stroke();
          g.fillStyle = 'rgba(210,230,255,0.22)'; g.beginPath(); g.arc(9.2, -12.2, 2.3, 0, PI * 2); g.fill();
          R.line(g, 6.7, -12.4, 7, -12.4, '#2a2a2a', 0.6); R.line(g, 2.6, -12.4, -1.5, -11.6, '#2a2a2a', 0.6);
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.4, 1.5, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.6, 1.2, 5); return; }
          g.fillStyle = '#2a0606'; g.beginPath(); g.moveTo(7.6, -5.8); g.quadraticCurveTo(10, -3.4, 12, -5.8); g.quadraticCurveTo(10, -5.2, 7.6, -5.8); g.fill(); g.fillStyle = '#f2ecda'; g.fillRect(8.3, -5.7, 3.2, 1);
        },
      });
    },
    sp1: { kind: 'parry', name: 'THE BUCK STOPS HERE', mod: { word: 'THE BUCK STOPS HERE!' } },
    sp2: { kind: 'rise', name: "GIVE 'EM HELL", mod: { fire: true, dmg: 14 } },
    fatals: [{ id: 'truman', name: 'DEWEY DEFEATS TRUMAN' }],
  };

  // =====================================================================================
  // JOHN F. KENNEDY: slim navy suit, narrow tie, the thick swept hair and the smile
  // =====================================================================================
  const SK_JK = '#e2aa86', JSUIT = '#1e2638', JHAIRK = '#6a4428';
  const jfk = {
    id: 'jfk', name: 'JOHN F. KENNEDY', short: 'JFK', him: 'HIM', k: 1.04, term: '1961 TO 1963',
    bio: 'Ask not what your country can do for you. Ask what he can do to you.',
    d: dims({ thigh: 28, shin: 27, shW: 15.5, chest: 15, belly: 11, back: 11, thighR: 7, shR: 5.6 }),
    col: { torso: JSUIT, armU: JSUIT, armL: JSUIT, cuff: SHIRT, hand: SK_JK, legU: JSUIT, legL: JSUIT, foot: '#0c0c0e', neck: SK_JK },
    mat: { torso: 'suit', armU: 'suit', armL: 'suit', legU: 'suit', legL: 'suit' }, bicep: 0.2,
    stats: { speed: 1.08, power: 1.0, weight: 0.98 },
    torsoDetail(g, d, st, L) {
      R.poly(g, [[d.chest * 0.15, -L * 1.03], [d.chest * 0.85, -L * 1.03], [d.chest * 0.55, -L * 0.6]], SHIRT);
      R.poly(g, [[d.chest * 0.5, -L * 0.98], [d.chest * 0.62, -L * 0.98], [d.chest * 0.6, -L * 0.6], [d.chest * 0.55, -L * 0.56], [d.chest * 0.5, -L * 0.6]], '#14182a');
      g.fillStyle = '#c8a040'; g.fillRect(d.chest * 0.5, -L * 0.74, 2, 0.8);
      R.poly(g, [[d.chest * 0.1, -L * 1.03], [d.chest * 0.46, -L * 0.55], [d.chest * 0.22, -L * 0.76]], sh(JSUIT, 0.14));
      R.poly(g, [[d.chest * 0.9, -L * 1.03], [d.chest * 0.64, -L * 0.52], [d.chest * 0.98, -L * 0.76]], sh(JSUIT, 0.14));
      buttons(g, d.chest * 0.62, -L * 0.42, 2, L * 0.14, '#14182a', 0.9);
      R.poly(g, [[-d.back * 0.6, -L * 0.8], [-d.back * 0.1, -L * 0.8], [-d.back * 0.35, -L * 0.72]], '#f0ece4');
    },
    head(g, st) {
      humanHead(g, st, {
        skin: SK_JK, chin: 1.6, nose: 0.6, eyeC: '#4a6a7a', browC: 'rgba(90,60,35,0.95)', cleanJaw: 1,
        back(g) { g.beginPath(); g.ellipse(-3, -17, 12, 11.5, 0, 0, PI * 2); fillLit(g, JHAIRK, -3, -17, 12, 0.18, -0.5); g.save(); g.clip(); strokes(g, -3, -17, 12, 11, 90, 81, PI + 0.3, 5, 0.28, 0.18); g.restore(); },
        front(g) {
          // the full swept-over hair with the high side part
          g.beginPath(); g.moveTo(-7, -9); g.bezierCurveTo(-10.5, -21, -6, -30, 2, -30.4); g.bezierCurveTo(9, -30.6, 13, -27, 12, -22.6); g.quadraticCurveTo(8.6, -24.6, 5, -23.4); g.quadraticCurveTo(1.4, -22.4, -1.4, -18); g.quadraticCurveTo(-3, -13, -3, -9); g.closePath();
          fillLit(g, JHAIRK, 2, -25, 11, 0.24, -0.45); g.save(); g.clip(); strokes(g, 2, -26, 10, 5, 80, 82, 0.15, 7, 0.25, 0.25); g.restore();
          R.line(g, -2, -29, 6, -28.4, 'rgba(255,220,180,0.25)', 0.8);
        },
        mouth(g) {
          if (st.dead) { g.fillStyle = '#2a0404'; g.beginPath(); g.ellipse(10.4, -4.4, 1.5, 1.3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#8a0010'; g.fillRect(9.8, -3.6, 1.2, 5); return; }
          // the wide grin
          g.fillStyle = '#2a0606'; g.beginPath(); g.moveTo(7, -5.8); g.quadraticCurveTo(10, -2.8, 12.4, -5.8); g.quadraticCurveTo(10, -5, 7, -5.8); g.fill(); g.fillStyle = '#f6f2e6'; g.fillRect(7.8, -5.7, 4, 1.2);
        },
      });
    },
    sp1: { kind: 'proj', name: 'HYANNIS SPIRAL', proj: { kind: 'football' } },
    sp2: { kind: 'rise', name: 'MOON SHOT UPPERCUT', mod: { fire: true, dmg: 13 } },
    fatals: [{ id: 'jfk_heart', name: 'ASK NOT' }, { id: 'jfk_moon', name: 'WE CHOOSE THE MOON' }, { id: 'jfk_pigs', name: 'BAY OF PIGS' }],
  };

  const FIGHTERS = [washington, jefferson, jackson, lincoln, grant, cleveland, teddy, taft, coolidge, fdr, truman, jfk];
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
  FRONT.jefferson = {
    detail: (g, d, G) => {
      R.poly(g, [[-G.shx * 0.45, G.sY], [G.shx * 0.45, G.sY], [G.shx * 0.4, G.hipY - 2], [-G.shx * 0.4, G.hipY - 2]], JVEST);
      buttons(g, 0, G.sY + 9, 6, 4.2, '#d8c8a0', 0.8);
      R.poly(g, [[-5, G.sY - 2], [5, G.sY - 2], [3, G.sY + 7], [0, G.sY + 9], [-3, G.sY + 7]], SHIRT);
      for (const sd of [-1, 1]) R.poly(g, [[sd * G.shx * 0.45, G.sY], [sd * G.shx * 0.9, G.sY + 2], [sd * G.shx * 0.55, G.sY + 20], [sd * G.shx * 0.42, G.sY + 18]], sh(JCOAT, 0.12));
    },
    head(g, st) {
      humanFront(g, st, { skin: SK_J, w: 8.6, chin: 1.8, eyeC: '#6a7a6a', browC: 'rgba(150,100,70,0.9)',
        back(g) { g.beginPath(); g.ellipse(0, -17, 12.5, 12, 0, 0, PI * 2); fillLit(g, JHAIR, 0, -17, 12, 0.2, -0.45); },
        front(g, jaw) {
          g.beginPath(); g.moveTo(-9, -12); g.quadraticCurveTo(-10, -27.5, 0, -28.5); g.quadraticCurveTo(10, -27.5, 9, -12); g.quadraticCurveTo(7, -22, 0, -22.5); g.quadraticCurveTo(-7, -22, -9, -12); g.closePath(); fillLit(g, sh(JHAIR, 0.06), 0, -22, 10, 0.2, -0.4);
          if (!st.dead) { g.strokeStyle = 'rgba(100,35,30,0.9)'; g.lineWidth = 0.9; g.beginPath(); g.moveTo(-2.6, -4.2); g.quadraticCurveTo(0, -3.2, 2.6, -4.2); g.stroke(); }
        }, mouth() {} });
    },
  };
  FRONT.jackson = {
    detail: (g, d, G) => {
      R.poly(g, [[-5, G.sY - 4], [5, G.sY - 4], [4, G.sY + 2], [-4, G.sY + 2]], '#f4f2ec');
      R.poly(g, [[-4.5, G.sY], [4.5, G.sY], [2.5, G.sY + 16], [-2.5, G.sY + 16]], SHIRT);
      buttons(g, 0, G.sY + 20, 3, 4, '#2a2a30', 0.9);
    },
    skirt: (g, d, G) => R.poly(g, [[-G.hx * 2.1, G.hipY - 4], [G.hx * 2.1, G.hipY - 4], [G.hx * 2.4, G.hipY + 14 * G.k], [-G.hx * 2.4, G.hipY + 14 * G.k]], '#121218'),
    head(g, st) {
      humanFront(g, st, { skin: SK_A, w: 7.8, chin: 2.8, eyeC: '#4a6a8a', browC: 'rgba(200,195,185,0.95)', angry: 1,
        back(g) { g.beginPath(); g.ellipse(0, -17, 11.5, 11, 0, 0, PI * 2); fillLit(g, JKHAIR, 0, -17, 11, 0.18, -0.45); },
        front(g, jaw) {
          const w = st.wind || 0;
          g.beginPath(); g.moveTo(-8.6, -14); g.bezierCurveTo(-10, -26, -7 + w, -38, 0 + w, -38); g.bezierCurveTo(7 + w, -38, 10, -26, 8.6, -14); g.quadraticCurveTo(6, -23, 0, -23.5); g.quadraticCurveTo(-6, -23, -8.6, -14); g.closePath();
          fillLit(g, JKHAIR, 0, -28, 12, 0.22, -0.4); g.save(); g.clip(); strokes(g, w * 0.5, -30, 8, 7, 80, 23, -PI / 2 + w * 0.05, 6, 0.16, 0.35); g.restore();
          if (!st.dead) { g.strokeStyle = 'rgba(90,30,25,0.95)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-2.8, -3.4); g.quadraticCurveTo(0, -4.6, 2.8, -3.4); g.stroke(); }
        }, mouth() {} });
    },
  };
  FRONT.grant = {
    detail: (g, d, G) => {
      R.poly(g, [[-3.5, G.sY - 1], [3.5, G.sY - 1], [0, G.sY + 7]], '#e8e2d4');
      buttons(g, -3.6, G.sY + 8, 6, 4.4); buttons(g, 3.6, G.sY + 8, 6, 4.4);
      for (const sd of [-1, 1]) { g.fillStyle = '#141c34'; g.fillRect(sd * G.shx * 0.95 - 5, G.sY - 1, 10, 4); g.strokeStyle = GOLD; g.lineWidth = 0.7; g.strokeRect(sd * G.shx * 0.95 - 5, G.sY - 1, 10, 4); }
      belt(g, G, '#c8a040');
    },
    skirt: (g, d, G) => R.poly(g, [[-G.hx * 2.3, G.hipY - 4], [G.hx * 2.3, G.hipY - 4], [G.hx * 2.6, G.hipY + 16 * G.k], [-G.hx * 2.6, G.hipY + 16 * G.k]], sh(UBLUE, -0.1)),
    head(g, st) {
      humanFront(g, st, { skin: SK_G, w: 8.8, chin: 1.4, eyeC: '#4a5a7a', browC: 'rgba(70,45,25,0.95)',
        back(g) { g.beginPath(); g.ellipse(0, -17, 11.5, 10.5, 0, 0, PI * 2); fillLit(g, GBEARD, 0, -17, 11, 0.15, -0.55); },
        front(g, jaw) {
          g.beginPath(); g.moveTo(-9, -15); g.quadraticCurveTo(-9.5, -27, 0, -27.5); g.quadraticCurveTo(9.5, -27, 9, -15); g.quadraticCurveTo(4, -23, -2, -22.6); g.quadraticCurveTo(-7, -22, -9, -15); g.closePath(); fillLit(g, GBEARD, 0, -22, 10, 0.15, -0.55);
          g.beginPath(); g.moveTo(-8.4, -10); g.quadraticCurveTo(-9, 2, 0, 5); g.quadraticCurveTo(9, 2, 8.4, -10); g.lineTo(6.4, -9); g.quadraticCurveTo(5, -7, 0, -7.4); g.quadraticCurveTo(-5, -7, -6.4, -9); g.closePath(); fillLit(g, GBEARD, 0, -3, 9, 0.12, -0.55);
          g.fillStyle = '#2a0606'; g.fillRect(-2.2, -4.6, 4.4, 1.2 + jaw);
          if (!st.dead && !st.noCigar) { R.line(g, 1.4, -4, 7, -2.6, '#5a3418', 1.8); R.ball(g, 7.4, -2.5, 0.9, st.lit === false ? '#3a2a1a' : '#ff6a20'); }
        }, mouth() {} });
    },
  };
  FRONT.cleveland = {
    detail: (g, d, G) => {
      R.poly(g, [[-4, G.sY - 1], [4, G.sY - 1], [0, G.sY + 9]], SHIRT); g.fillStyle = BLACK; g.beginPath(); g.ellipse(-2.4, G.sY + 1.5, 2.6, 1.5, 0, 0, PI * 2); g.ellipse(2.4, G.sY + 1.5, 2.6, 1.5, 0, 0, PI * 2); g.fill();
      bellyWaist(g, G);
    },
    head(g, st) {
      humanFront(g, st, { skin: SK_C, w: 9.8, chin: 3.4, eyeC: '#4a5a6a', browC: 'rgba(80,65,50,0.9)',
        back(g) { g.beginPath(); g.ellipse(0, -16, 11.5, 10, 0, 0, PI * 2); fillLit(g, CHAIR, 0, -16, 11, 0.18, -0.5); },
        front(g, jaw) {
          g.beginPath(); g.moveTo(-9.5, -15); g.quadraticCurveTo(-9, -26, 0, -26); g.quadraticCurveTo(7, -26, 9, -20); g.quadraticCurveTo(3, -23.6, -4, -22); g.quadraticCurveTo(-8, -20, -9.5, -15); g.closePath(); fillLit(g, CHAIR, 0, -21, 10, 0.18, -0.5);
          g.fillStyle = 'rgba(80,30,20,0.18)'; g.beginPath(); g.ellipse(0, 2.4, 7, 2.2, 0, 0, PI * 2); g.fill();
          g.beginPath(); g.moveTo(-7.5, -4.2); g.quadraticCurveTo(-4, -8.6, 0, -6.8); g.quadraticCurveTo(4, -8.6, 7.5, -4.2); g.quadraticCurveTo(6.6, -2, 4.6, -2.8); g.quadraticCurveTo(0, -4.6, -4.6, -2.8); g.quadraticCurveTo(-6.6, -2, -7.5, -4.2); g.closePath(); fillLit(g, '#6a5644', 0, -5, 7, 0.14, -0.5);
        }, mouth() {} });
    },
  };
  FRONT.taft = {
    detail: (g, d, G) => {
      R.poly(g, [[-4, G.sY - 1], [4, G.sY - 1], [0, G.sY + 8]], SHIRT); R.poly(g, [[-1.2, G.sY], [1.2, G.sY], [1.6, G.sY + 7], [-1.6, G.sY + 7]], '#2a3a5a');
      g.fillStyle = TVEST; g.beginPath(); g.ellipse(0, (G.sY + G.hipY) / 2 + 6, G.shx * 0.7, (G.hipY - G.sY) * 0.46, 0, 0, PI * 2); g.fill();
      buttons(g, 0, G.sY + 13, 5, 4.6, '#2a2a30', 1);
      g.strokeStyle = GOLD; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-G.shx * 0.5, G.sY + 22); g.quadraticCurveTo(0, G.sY + 30, G.shx * 0.5, G.sY + 22); g.stroke();
    },
    head(g, st) {
      humanFront(g, st, { skin: SK_TF, w: 10.4, chin: 3.8, eyeC: '#3a4a5a', browC: 'rgba(80,60,40,0.9)',
        back(g) { g.beginPath(); g.ellipse(0, -16, 12, 10, 0, 0, PI * 2); fillLit(g, '#4a3626', 0, -16, 11, 0.18, -0.5); },
        front(g, jaw) {
          g.beginPath(); g.moveTo(-10, -15); g.quadraticCurveTo(-9.5, -26, 0, -26.4); g.quadraticCurveTo(9.5, -26, 10, -15); g.quadraticCurveTo(7, -22.6, 0, -23.4); g.quadraticCurveTo(-7, -22.6, -10, -15); g.closePath(); fillLit(g, '#4a3626', 0, -21, 10, 0.18, -0.5);
          g.fillStyle = 'rgba(200,90,80,0.16)'; for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(sd * 6, -6, 3, 2.4, 0, 0, PI * 2); g.fill(); }
          g.fillStyle = 'rgba(80,30,20,0.2)'; g.beginPath(); g.ellipse(0, 3, 7, 2, 0, 0, PI * 2); g.fill();
          const tw = st.twirl || 0;
          g.beginPath(); g.moveTo(0, -6.6); g.quadraticCurveTo(-5, -8, -8, -6.4); g.quadraticCurveTo(-10.6, -6 - tw, -11.2, -9 - tw); g.quadraticCurveTo(-11, -4.4, -7, -4.2); g.quadraticCurveTo(-3, -5, 0, -4.6); g.quadraticCurveTo(3, -5, 7, -4.2); g.quadraticCurveTo(11, -4.4, 11.2, -9); g.quadraticCurveTo(10.6, -6, 8, -6.4); g.quadraticCurveTo(5, -8, 0, -6.6); g.closePath();
          fillLit(g, '#5a4230', 0, -6, 8, 0.14, -0.5);
        }, mouth() {} });
    },
  };
  FRONT.coolidge = {
    detail: (g, d, G) => {
      R.poly(g, [[-4, G.sY - 1], [4, G.sY - 1], [0, G.sY + 10]], SHIRT); R.poly(g, [[-1.2, G.sY], [1.2, G.sY], [1.6, G.sY + 12], [0, G.sY + 14], [-1.6, G.sY + 12]], '#3a2a3a');
      buttons(g, 0, G.sY + 18, 3, 4.2, '#2a2e36', 0.9);
    },
    // Rebecca peeks out of the coat
    overHead(g, d, G, st) {
      const t = (st && st.t) || 0, up = Math.min(1, Math.max(0, (t % 4) - 0.8)) * (1 - Math.min(1, Math.max(0, (t % 4) - 2.6))), x = G.shx * 0.45, y = G.sY + 14 - up * 6;
      if (up <= 0.02) return;
      g.save(); g.beginPath(); g.rect(x - 10, y - 12, 20, G.sY + 14 - (y - 12)); g.clip();
      g.fillStyle = '#7a7068'; g.beginPath(); g.ellipse(x, y, 5.5, 4.6, 0, 0, PI * 2); g.fill();
      for (const sd of [-1, 1]) { g.fillStyle = '#5a5048'; g.beginPath(); g.moveTo(x + sd * 2.6, y - 3); g.lineTo(x + sd * 5, y - 7); g.lineTo(x + sd * 5.4, y - 2); g.fill(); }
      g.fillStyle = '#1a1612'; g.beginPath(); g.ellipse(x, y - 0.4, 5, 1.8, 0, 0, PI * 2); g.fill();
      g.fillStyle = '#e8e2d8'; g.fillRect(x - 0.8, y - 3.6, 1.6, 7); g.fillStyle = '#f0d040'; g.fillRect(x - 3, y - 0.8, 1, 1); g.fillRect(x + 2, y - 0.8, 1, 1);
      R.ball(g, x, y + 3, 1, '#141010');
      g.restore();
    },
    head(g, st) {
      humanFront(g, st, { skin: SK_CC, w: 8, chin: 2, eyeC: '#5a6a7a', browC: 'rgba(130,90,60,0.9)',
        back(g) { g.beginPath(); g.ellipse(0, -17, 11, 10.5, 0, 0, PI * 2); fillLit(g, CHAIRC, 0, -17, 11, 0.18, -0.5); },
        front(g, jaw) {
          g.beginPath(); g.moveTo(-8.4, -14); g.quadraticCurveTo(-9, -27, 0, -27.4); g.quadraticCurveTo(9, -27, 8.4, -14); g.quadraticCurveTo(6, -23, -2.6, -23.6); g.quadraticCurveTo(-7, -21, -8.4, -14); g.closePath(); fillLit(g, CHAIRC, 0, -22, 10, 0.2, -0.5);
          if (!st.dead) R.line(g, -2.2, -4, 2.2, -4, 'rgba(110,40,35,0.95)', 0.6);
        }, mouth() {} });
    },
  };
  FRONT.truman = {
    detail: (g, d, G) => {
      R.poly(g, [[-4, G.sY - 1], [4, G.sY - 1], [0, G.sY + 8]], SHIRT); g.fillStyle = '#1a2a5a'; g.beginPath(); g.ellipse(-2.6, G.sY + 1.5, 2.8, 1.5, 0, 0, PI * 2); g.ellipse(2.6, G.sY + 1.5, 2.8, 1.5, 0, 0, PI * 2); g.fill();
      for (const sd of [-1, 1]) R.poly(g, [[sd * 4, G.sY], [sd * G.shx * 0.7, G.sY + 2], [sd * 2, G.sY + 22]], sh(HSUIT, 0.12));
      buttons(g, -3, G.sY + 24, 2, 6, '#2a2a30', 1); buttons(g, 3, G.sY + 24, 2, 6, '#2a2a30', 1);
    },
    head(g, st) {
      humanFront(g, st, { skin: SK_HT, w: 8.6, chin: 1.6, eyeC: '#4a5a6a', browC: 'rgba(120,110,100,0.9)',
        back(g) { g.beginPath(); g.ellipse(0, -17, 11.5, 10.5, 0, 0, PI * 2); fillLit(g, '#8a8680', 0, -17, 11, 0.2, -0.5); },
        front(g, jaw) {
          g.beginPath(); g.moveTo(-9, -14); g.quadraticCurveTo(-9.5, -27, 0, -27.4); g.quadraticCurveTo(9.5, -27, 9, -14); g.quadraticCurveTo(6, -23.4, 0, -23.6); g.quadraticCurveTo(-6, -23.4, -9, -14); g.closePath(); fillLit(g, '#9a968e', 0, -22, 10, 0.22, -0.45);
          g.strokeStyle = '#2a2a2a'; g.lineWidth = 0.8; for (const sd of [-1, 1]) { g.beginPath(); g.arc(sd * 3.4, -12.6, 2.6, 0, PI * 2); g.stroke(); } R.line(g, -0.8, -12.8, 0.8, -12.8, '#2a2a2a', 0.6);
          if (!st.dead) { g.fillStyle = '#2a0606'; g.beginPath(); g.moveTo(-3.4, -4.4); g.quadraticCurveTo(0, -1.4, 3.4, -4.4); g.quadraticCurveTo(0, -3.6, -3.4, -4.4); g.fill(); g.fillStyle = '#f2ecda'; g.fillRect(-2.6, -4.3, 5.2, 1); }
        }, mouth() {} });
    },
  };
  FRONT.jfk = {
    detail: (g, d, G) => {
      R.poly(g, [[-4, G.sY - 1], [4, G.sY - 1], [0, G.sY + 14]], SHIRT); R.poly(g, [[-1, G.sY], [1, G.sY], [1.3, G.sY + 14], [0, G.sY + 16], [-1.3, G.sY + 14]], '#14182a');
      for (const sd of [-1, 1]) R.poly(g, [[sd * 4, G.sY], [sd * G.shx * 0.7, G.sY + 2], [sd * 2.4, G.sY + 18]], sh(JSUIT, 0.14));
      buttons(g, 0, G.sY + 20, 2, 5, '#14182a', 0.9);
    },
    head(g, st) {
      humanFront(g, st, { skin: SK_JK, w: 8.6, chin: 1.4, eyeC: '#4a6a7a', browC: 'rgba(90,60,35,0.95)',
        back(g) { g.beginPath(); g.ellipse(0, -18, 12, 11, 0, 0, PI * 2); fillLit(g, JHAIRK, 0, -18, 12, 0.18, -0.5); },
        front(g, jaw) {
          const sw = st.sweep || 0;
          g.beginPath(); g.moveTo(-9, -13); g.quadraticCurveTo(-11, -30, 0, -31); g.quadraticCurveTo(11, -31, 9.4, -15); g.quadraticCurveTo(7, -23, 0 + sw, -23.4); g.quadraticCurveTo(-4, -24.6, -6.4, -21); g.quadraticCurveTo(-8, -18, -9, -13); g.closePath();
          fillLit(g, JHAIRK, 0, -25, 11, 0.24, -0.45); g.save(); g.clip(); strokes(g, 0, -27, 9, 4, 60, 83, 0.2, 7, 0.25, 0.25); g.restore();
          if (!st.dead) { g.fillStyle = '#2a0606'; g.beginPath(); g.moveTo(-3.8, -4.6); g.quadraticCurveTo(0, -1, 3.8, -4.6); g.quadraticCurveTo(0, -3.8, -3.8, -4.6); g.fill(); g.fillStyle = '#f6f2e6'; g.fillRect(-3, -4.5, 6, 1.2); }
        }, mouth() {} });
    },
  };
  // Cleveland's waistcoat and watch chain over the belly, front on
  function bellyWaist(g, G) {
    g.fillStyle = '#24242c'; g.beginPath(); g.ellipse(0, (G.sY + G.hipY) / 2 + 5, G.shx * 0.62, (G.hipY - G.sY) * 0.44, 0, 0, PI * 2); g.fill();
    buttons(g, 0, G.sY + 12, 4, 5, '#3a3a44', 0.9);
    g.strokeStyle = GOLD; g.lineWidth = 0.8; g.beginPath(); g.moveTo(-G.shx * 0.45, G.sY + 20); g.quadraticCurveTo(0, G.sY + 27, G.shx * 0.45, G.sY + 20); g.stroke(); R.ball(g, G.shx * 0.45, G.sY + 20, 1.4, GOLD);
  }
  const PORTRAIT = { washington: [0.5, 0.9, 0.86], jefferson: [0.5, 0.92, 0.84], jackson: [0.5, 1.0, 0.78], lincoln: [0.48, 1.05, 0.78], grant: [0.5, 0.9, 0.88], cleveland: [0.5, 0.86, 0.88], teddy: [0.5, 0.88, 0.9], taft: [0.5, 0.86, 0.86], coolidge: [0.5, 0.92, 0.86], fdr: [0.42, 0.9, 0.86], truman: [0.5, 0.9, 0.88], jfk: [0.5, 0.94, 0.84] };
  return KIT.roster(FIGHTERS, BOSSES, { front: FRONT, portrait: PORTRAIT });
})();
