// POTUS Kombat: fatalities (scripted timelines). Every one comes from history.
'use strict';
FATAL.add(K => {
  const { R, P, PI, rnd, lerp, pick, ease, walkTo, J, prop, headGib, skullGib } = K;
  const S = {};
  // the victim as a still picture, for props that cut, freeze or mount them
  const still = V => ({ def: V.def, d: V.d, x: V.x, y: V.y, face: V.face, t: V.t, st: Object.assign({}, V.st2, { dead: true }) });
  const drawStill = (g, f, pose, o = {}) => R.digi(g, f.x, f.y, gg => R.draw(gg, f, pose, o), { box: [50, 20, 280, 310] });

  // ---------- GEORGE WASHINGTON: Valley Forge Freeze ----------
  // A blizzard out of the winter of 1777 freezes the loser solid. One salute and they shatter.
  S.washington = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let snow = 0, ice = 0, iceProp = null, gone = false;
    const flakes = Array.from({ length: 140 }, () => ({ x: rnd(0, 1), y: rnd(0, 1), s: rnd(0.6, 1.8), v: rnd(0.5, 1.2) }));
    prop({ layer: 'front', draw(g) {
      if (snow <= 0) return;
      const x0 = api.cam - 20, w = api.W + 40;
      g.fillStyle = `rgba(220,230,255,${0.12 * snow})`; g.fillRect(x0, -200, w, F + 220);
      for (const fl of flakes) { const x = x0 + ((fl.x * w + s.t * 120 * fl.v * snow) % w), y = ((fl.y * 260 + s.t * 90 * fl.v) % 260) - 20; g.fillStyle = `rgba(245,248,255,${0.85 * snow})`; g.fillRect(x, y, fl.s, fl.s); }
    } });
    s.at(0.55, () => { api.say('valley forge'); api.bubble('WINTER QUARTERS.', A.x, F - 160, { size: 12, fill: 'white' }); });
    s.at(0.9, () => {
      iceProp = prop({ layer: 'front', x: V.x, draw(g, p) {
        if (gone || ice <= 0) return;
        const hh = api.hurtH(V) * 1.08, top = F - hh * ice, w = 30 * V.d.k;
        g.fillStyle = 'rgba(170,215,255,0.42)'; g.fillRect(p.x - w / 2, top, w, F - top);
        g.strokeStyle = 'rgba(240,250,255,0.75)'; g.lineWidth = 1; g.strokeRect(p.x - w / 2, top, w, F - top);
        g.fillStyle = 'rgba(255,255,255,0.4)'; g.fillRect(p.x - w / 2 + 2, top + 2, 3, F - top - 4);
        g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 0.6; for (let i = 0; i < 4; i++) { const y = top + (F - top) * (0.2 + i * 0.2); g.beginPath(); g.moveTo(p.x - w / 2, y); g.lineTo(p.x - w / 2 + rnd(6, 14), y + 4); g.lineTo(p.x + rnd(-4, 6), y + 1); g.stroke(); }
      } });
      api.sfx('hiss');
    });
    s.at(1.6, () => api.sfx('creak'));
    s.at(2.5, () => { api.sfx('clang'); api.bubble('ATTEN-HUT.', A.x, F - 160, { size: 12, fill: 'gold' }); });
    s.at(3.0, () => {
      gone = true; V.hidden = true; api.sfx('shatter'); api.sfx('crunch'); api.shake(9); api.flash();
      const hh = api.hurtH(V);
      for (let i = 0; i < 46; i++) FX.gib('shard', V.x + rnd(-14, 14), F - rnd(0, hh), rnd(-420, 420), rnd(-560, -120), { s: rnd(1, 2.4), vr: rnd(-20, 20) });
      for (let i = 0; i < 12; i++) FX.gib(pick(['chunk', 'chunk', 'bone', 'skullfrag']), V.x + rnd(-10, 10), F - rnd(10, hh), rnd(-300, 300), rnd(-420, -100), { s: rnd(0.9, 1.5), vr: rnd(-14, 14) });
      skullGib(V, V.x, F - hh * 0.9, rnd(-120, 120), -520);
      FX.puff(V.x, F - hh * 0.5, 'rgba(235,245,255,0.85)', 26, 5); FX.blood(V.x, F - hh * 0.5, 16, 0, 0.8);
    });
    s.at(3.6, () => api.bubble('DISMISSED.', A.x, F - 160, { size: 13, fill: 'white' }));
    s.at(4.6, () => { s.done = true; });
    s.tick = (t, dt) => {
      snow = t < 0.6 ? 0 : t < 3.2 ? Math.min(1, (t - 0.6) / 0.6) : Math.max(0, 1 - (t - 3.2) / 0.8);
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 66 * k, dt, api, 120); return; }
      if (t < 2.5) { A.scriptPose = P({ hy: 6, lean: -0.05, head: -0.15, aF: [0.5, 1.9], aB: [0.3, 1.8], fF: [12, 0], fB: [-14, 0] }); }
      else if (t < 3.3) A.scriptPose = P({ hy: 6, lean: -0.08, head: -0.1, aF: [2.6, 2.55], aB: [0.2, 0.2], fF: [10, 0], fB: [-10, 0] });
      else A.scriptPose = api.PS.win(A.t);
      if (t < 3.0) {
        ice = t < 0.9 ? 0 : Math.min(1, (t - 0.9) / 1.4);
        V.scriptPose = ice < 1 ? PS.dizzy(V.t * (1 - ice * 0.9)) : V.scriptPose;
        V.ro.dx = ice > 0 && ice < 1 ? rnd(-1.2, 1.2) : 0;
        if (iceProp) iceProp.x = V.x;
      }
    };
  };

  // ---------- ABRAHAM LINCOLN: House Divided ----------
  // One stroke of a rail-splitter's maul, straight down the middle. Neither half can stand.
  S.lincoln = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let maul = false, halves = null, cutX = 0;
    prop({ layer: 'front', draw(g) {
      if (!maul) return;
      const h = J(A, 'handFx'), e = J(A, 'elbowF'), a = Math.atan2(h[1] - e[1], h[0] - e[0]), L = 36 * k;
      g.save(); g.translate(h[0], h[1]); g.rotate(a);
      R.line(g, -10, 0, L, 0, '#6a4422', 2.6);
      g.fillStyle = '#4a4e56'; g.fillRect(L - 3, -6, 8, 12); g.fillStyle = '#7a8088'; g.fillRect(L - 3, -6, 8, 2); g.fillStyle = '#2a2c30'; g.fillRect(L + 4, -6, 1.5, 12);
      g.restore();
    } });
    s.at(0.6, () => { maul = true; api.sfx('whoosh'); api.bubble('FOUR SCORE...', A.x, F - 175, { size: 11, fill: 'white' }); });
    s.at(1.5, () => {
      api.sfx('big'); api.sfx('crunch'); api.sfx('splat'); api.shake(12); api.flash();
      const f = still(V), pose = R.resolve(V.d, PS.dizzy(V.t)), hh = api.hurtH(V);
      cutX = V.x; V.hidden = true;
      halves = prop({ layer: 'back', u: 0, draw(g, p) {
        for (const sd of [-1, 1]) {
          g.save();
          g.translate(cutX + sd * p.u * 12, F); g.rotate(sd * p.u * 1.1); g.translate(-cutX, -F);
          g.beginPath(); g.rect(sd < 0 ? cutX - 140 : cutX, -400, 140, 800); g.clip();
          drawStill(g, f, pose);
          g.fillStyle = '#8a0010'; g.fillRect(cutX - 1.6, F - hh * 1.05, 3.2, hh * 1.05);
          g.fillStyle = '#e0a0a8'; g.fillRect(cutX - 0.6, F - hh * 0.98, 1.2, hh * 0.18);
          g.fillStyle = '#e8e0d0'; for (let i = 0; i < 6; i++) g.fillRect(cutX - 0.8, F - hh * (0.5 + i * 0.06), 1.6, 1.2);
          g.restore();
        }
      } });
      for (let i = 0; i < 4; i++) FX.spurt(cutX, F - hh * (0.3 + i * 0.2), (i % 2 ? 1 : -1), 1.4);
      FX.burst(cutX, F - hh * 0.5, 10, ['guts', 'chunk', 'brain', 'bone', 'kidney'], 1.2); FX.drops(4);
    });
    s.at(2.6, () => { api.sfx('thud'); FX.blood(cutX, F - 6, 30, 0, 1); api.shake(4); });
    s.at(3.0, () => api.bubble('A HOUSE DIVIDED CANNOT STAND.', A.x, F - 175, { size: 11, life: 1.8, fill: 'gold' }));
    s.at(4.6, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 62 * k, dt, api, 120); return; }
      if (t < 1.3) A.scriptPose = P({ hy: 4, lean: -0.2, head: -0.2, aF: [2.95, 0.35], aB: [2.85, 0.45], fF: [14, 0], fB: [-15, 0] });
      else if (t < 2.4) A.scriptPose = P({ hy: 14, lean: 0.6, head: 0.35, aF: [1.3, 0.05], aB: [1.2, 0.15], fF: [18, 0], fB: [-16, 0] });
      else { A.scriptPose = PS.stance(A.t); maul = t < 2.4; }
      if (t < 1.5) V.scriptPose = PS.dizzy(V.t);
      if (halves) { const u = ease((t - 1.5) / 1.05); halves.u = u; if (u < 1 && Math.random() < 0.6) FX.blood(cutX + rnd(-10, 10), F - rnd(10, 90), 2, rnd(-1, 1), 0.6); }
    };
  };

  // ---------- TEDDY ROOSEVELT: Mounted Trophy ----------
  // He tears the head off, stuffs it and hangs it on the wall beside a bull moose.
  S.teddy = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let head = null, plaque = null, spurting = false;
    const drawHead = (g, x, y, rot) => R.drawHeadAt(g, { def: V.def, d: V.d }, x, y, rot, 1, { dead: true, t: 0 });
    s.at(0.7, () => { api.sfx('punch'); api.bubble('HOLD STILL.', A.x, F - 165, { size: 11, fill: 'white' }); });
    s.at(1.5, () => {
      api.sfx('crunch'); api.sfx('scream'); api.shake(8); api.flash();
      V.ro.noHead = true; spurting = true;
      head = prop({ layer: 'front', x: 0, y: 0, rot: 0, mounted: false, draw(g, p) { if (!p.mounted) drawHead(g, p.x, p.y, p.rot); } });
      FX.burst(J(V, 'neck')[0], J(V, 'neck')[1], 6, ['chunk', 'bone'], 1);
    });
    s.at(2.0, () => { V.scriptPose = PS.down(V); V.snapPose = true; api.sfx('thud'); spurting = false; FX.blood(V.x, F - 6, 24, 0, 0.9); });
    s.at(2.1, () => {
      const px = A.x + A.face * 26 * k, py = F - 156;
      plaque = prop({ layer: 'back', x: px, y: py, on: false, draw(g, p) {
        // the moose
        const mx = p.x - A.face * 46;
        g.fillStyle = '#5a3a1a'; g.beginPath(); g.moveTo(mx - 14, p.y - 12); g.lineTo(mx + 14, p.y - 12); g.lineTo(mx + 11, p.y + 16); g.lineTo(mx - 11, p.y + 16); g.closePath(); g.fill();
        g.fillStyle = '#3a2410'; g.beginPath(); g.ellipse(mx, p.y + 2, 7, 10, 0, 0, PI * 2); g.fill(); g.beginPath(); g.ellipse(mx, p.y + 14, 5.5, 6, 0, 0, PI * 2); g.fill();
        g.fillStyle = '#c8b090'; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(mx + sd * 4, p.y - 6); g.quadraticCurveTo(mx + sd * 22, p.y - 18, mx + sd * 26, p.y - 4); g.lineTo(mx + sd * 16, p.y - 8); g.closePath(); g.fill(); for (let i = 0; i < 4; i++) R.line(g, mx + sd * (12 + i * 4), p.y - 12 - i, mx + sd * (14 + i * 4), p.y - 20 - (i % 2) * 2, '#c8b090', 1.4); }
        g.fillStyle = '#100806'; g.fillRect(mx - 4, p.y - 1, 1.4, 1.4); g.fillRect(mx + 3, p.y - 1, 1.4, 1.4);
        // the new trophy
        g.fillStyle = '#5a3a1a'; g.beginPath(); g.moveTo(p.x - 13, p.y - 10); g.lineTo(p.x + 13, p.y - 10); g.lineTo(p.x + 10, p.y + 18); g.lineTo(p.x - 10, p.y + 18); g.closePath(); g.fill();
        g.strokeStyle = '#c8a040'; g.lineWidth = 1; g.stroke();
        g.fillStyle = '#c8a040'; g.fillRect(p.x - 7, p.y + 12, 14, 4); g.fillStyle = '#3a2410'; g.font = '3px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('TROPHY', p.x, p.y + 15.2); g.textAlign = 'left';
        if (p.on) drawHead(g, p.x, p.y + 8, 0);
      } });
      api.sfx('thud');
    });
    s.at(3.0, () => { plaque.on = true; head.mounted = true; api.sfx('clang'); api.shake(4); FX.blood(plaque.x, plaque.y + 14, 6, 0, 0.4); });
    s.at(3.4, () => { api.bubble('BULLY!', A.x, F - 170, { size: 16, fill: 'gold' }); api.say('bully'); });
    s.at(4.8, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.7) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 30 * k, dt, api, 120); return; }
      if (t < 1.5) { A.scriptPose = P({ hy: 6, lean: 0.35, head: 0.1, aF: [1.75, 0.25], aB: [1.6, 0.3], fF: [15, 0], fB: [-15, 0] }); V.ro.dx = (t > 0.9) ? rnd(-2, 2) : 0; V.scriptPose = PS.dizzy(V.t); return; }
      if (spurting) { const n = J(V, 'neck'); FX.spurt(n[0], n[1], -A.face * 0.3, 1.2); V.ro.dx = rnd(-1, 1); }
      if (t < 2.2) { A.scriptPose = P({ hy: 4, lean: -0.25, head: -0.25, aF: [2.9, 0.3], aB: [0.6, 1.8], fF: [13, 0], fB: [-14, 0] }); const h = J(A, 'handFx'); head.x = h[0]; head.y = h[1] + 10; head.rot = Math.sin(t * 20) * 0.1; return; }
      if (t < 3.0) { const u = ease((t - 2.2) / 0.8), h = J(A, 'handFx'); head.x = lerp(h[0], plaque.x, u); head.y = lerp(h[1] + 10, plaque.y + 8, u) - Math.sin(u * PI) * 30; head.rot = u * PI * 2; A.scriptPose = P({ hy: 4, lean: 0.2, aF: [2.3, 0.2], aB: [0.6, 1.8], fF: [14, 0], fB: [-14, 0] }); return; }
      A.scriptPose = P({ hy: 3, lean: -0.15, head: -0.2, aF: [3.05, 0.1], aB: [0.5, 1.9], fF: [12, 0], fB: [-12, 0] });
    };
  };

  // ---------- FDR: New Deal ----------
  // Sliced into a deck of thin cards, shuffled, and dealt across the floor.
  S.fdr = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    const N = 26, cards = [];
    let deck = null, slashes = 0, hh = 0;
    const tint = (V.def.col && V.def.col.torso) || '#8a6a4a';
    s.at(0.5, () => api.bubble('I PLEDGE YOU A NEW DEAL.', A.x, F - 140, { size: 11, life: 1.4, fill: 'white' }));
    for (const [i, at] of [[1, 1.0], [2, 1.18], [3, 1.34]]) s.at(at, () => { slashes = i; api.sfx('slash'); api.shake(3); FX.blood(V.x, F - api.hurtH(V) * (0.25 + i * 0.2), 10, -A.face, 0.8); });
    s.at(1.55, () => {
      hh = api.hurtH(V); V.hidden = true; api.sfx('splat'); api.flash(); api.shake(7);
      FX.burst(V.x, F - hh * 0.5, 6, ['chunk', 'guts'], 1);
      for (let i = 0; i < N; i++) cards.push({ x: V.x + rnd(-8, 8), y: F - hh * (i / N), x0: V.x + rnd(-8, 8), y0: F - hh * (i / N), rot: rnd(-0.4, 0.4), st: 'fall' });
      deck = prop({ layer: 'front', draw(g) {
        for (const c of cards) { g.save(); g.translate(c.x, c.y); g.rotate(c.rot); g.fillStyle = '#f2eee2'; g.fillRect(-3.5, -5, 7, 10); g.fillStyle = tint; g.fillRect(-3.5, -1, 7, 2); g.fillStyle = '#9a000c'; g.fillRect(-3.5, -5, 2 + (c.x0 % 3), 10); g.fillRect(-1, -2, 3, 3); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 0.4; g.strokeRect(-3.5, -5, 7, 10); g.restore(); }
      } });
    });
    s.at(4.7, () => api.bubble('EVERYBODY GETS A CARD.', A.x, F - 140, { size: 11, life: 1.6, fill: 'gold' }));
    s.at(5.8, () => { s.done = true; });
    let dealt = 0;
    s.tick = (t, dt) => {
      if (t < 0.7) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 46 * k, dt, api, 100); return; }
      const hF = J(A, 'handFx'), hB = J(A, 'handBx');
      if (t < 1.55) {
        A.scriptPose = P({ hy: 4, lean: 0.3, head: 0.1, aF: [slashes % 2 ? 2.4 : 1.2, 0.1], aB: [1.2, 0.8], fF: [12, 0], fB: [-12, 0] });
        V.scriptPose = PS.dizzy(V.t); V.ro.dx = slashes ? rnd(-1.5, 1.5) : 0;
        return;
      }
      A.scriptPose = P({ hy: 4, lean: 0.15, head: 0.15, aF: [1.5, 0.7], aB: [1.4, 0.9], fF: [12, 0], fB: [-12, 0] });
      cards.forEach((c, i) => {
        if (t < 2.1) { const u = ease((t - 1.55) / 0.5 + i * 0.004); c.x = lerp(c.x0, V.x, u); c.y = lerp(c.y0, F - 2 - i * 0.6, u); c.rot = lerp(c.rot, 0, u); }
        else if (t < 2.5) { const u = ease((t - 2.1) / 0.4); c.x = lerp(V.x, hF[0], u); c.y = lerp(F - 2 - i * 0.6, hF[1] - i * 0.3, u) - Math.sin(u * PI) * 30; }
        else if (t < 3.4) { const ph = ((t - 2.5) * 6 + i / N) % 1, a = i % 2 ? [hF, hB] : [hB, hF]; c.x = lerp(a[0][0], a[1][0], ph); c.y = lerp(a[0][1], a[1][1], ph) - Math.sin(ph * PI) * 14; c.rot = ph * 0.6; }
        else if (c.st !== 'dealt') { c.x = hF[0]; c.y = hF[1] - i * 0.3; c.rot = 0; }
      });
      if (t > 2.5 && t < 3.4 && Math.random() < 0.3) api.sfx('gnaw');
      if (t >= 3.4) {
        const want = Math.min(N, Math.floor((t - 3.4) / 0.045));
        while (dealt < want) { const c = cards[N - 1 - dealt]; c.st = 'dealt'; c.tx = A.x + A.face * (30 + dealt * 11); c.t0 = t; dealt++; api.sfx('slash'); }
        for (const c of cards) if (c.st === 'dealt') { const u = ease((t - c.t0) / 0.25); c.x = lerp(hF[0], c.tx, u); c.y = lerp(hF[1], F - 1.5, u) - Math.sin(u * PI) * 16; c.rot = u * 1.57 * (c.tx > A.x ? 1 : -1) + (u >= 1 ? 0 : 0); if (u >= 1 && !c.landed) { c.landed = true; FX.blood(c.x, F - 2, 3, 0, 0.3); } }
      }
    };
  };

  return S;
}, { noCenter: [] });
