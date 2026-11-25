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

  // ---------- THOMAS JEFFERSON: Wall of Separation ----------
  // A brick wall slams through at the belt line. Top half goes one way, bottom half stays put.
  S.jefferson = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let f = null, pose = null, hh = 0, cutY = 0, cutX = 0, top = null, wall = null;
    const WW = 54, WH = 26;
    s.at(0.6, () => api.bubble('A WALL OF SEPARATION.', A.x, F - 160, { size: 11, life: 1.4, fill: 'white' }));
    s.at(1.0, () => {
      hh = api.hurtH(V); cutY = F - hh * 0.5; cutX = V.x;
      wall = prop({ layer: 'front', x: A.x - A.face * 260, y: cutY, vy: 0, landed: false, draw(g, p) {
        const x0 = p.x - WW / 2, y0 = p.y - WH / 2;
        g.fillStyle = '#7a2a1c'; g.fillRect(x0, y0, WW, WH);
        for (let r = 0; r < 4; r++) for (let c = -1; c < 7; c++) { const bx = x0 + c * 9 + (r % 2 ? 4.5 : 0), by = y0 + r * 6.5; if (bx < x0 - 4 || bx > x0 + WW - 4) continue; g.fillStyle = ['#9a3a24', '#8a3220', '#a8442a'][(r + c + 3) % 3]; g.fillRect(Math.max(x0, bx), by + 0.6, Math.min(8.2, x0 + WW - Math.max(x0, bx)), 5.4); }
        g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 1; g.strokeRect(x0, y0, WW, WH);
        g.fillStyle = 'rgba(255,220,180,0.15)'; g.fillRect(x0, y0, WW, 1.5);
      } });
      api.sfx('whoosh');
    });
    s.at(1.2, () => {
      api.sfx('big'); api.sfx('crunch'); api.sfx('splat'); api.shake(12); api.flash();
      f = still(V); pose = R.resolve(V.d, PS.dizzy(V.t)); V.hidden = true;
      top = prop({ layer: 'back', u: 0, fall: 0, draw(g, p) {
        // bottom half, still standing (then toppling)
        g.save(); g.translate(cutX, F); g.rotate(-A.face * p.fall * 1.45); g.translate(-cutX, -F);
        g.beginPath(); g.rect(cutX - 150, cutY, 300, 400); g.clip(); drawStill(g, f, pose);
        g.fillStyle = '#8a0010'; g.beginPath(); g.ellipse(cutX, cutY + 1, 11 * V.d.k, 3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#e8e0d0'; g.fillRect(cutX - 1.5, cutY - 0.5, 3, 2);
        g.restore();
        // top half, flying off and landing on its back
        const u = p.u, dx = A.face * (30 + u * 70), dy = lerp(0, F - cutY - 14, u) - Math.sin(u * PI) * 70;
        g.save(); g.translate(cutX + dx, cutY + dy); g.rotate(A.face * u * 1.55); g.translate(-cutX, -cutY);
        g.beginPath(); g.rect(cutX - 150, cutY - 400, 300, 400); g.clip(); drawStill(g, f, pose);
        g.fillStyle = '#8a0010'; g.beginPath(); g.ellipse(cutX, cutY - 1, 11 * V.d.k, 3, 0, 0, PI * 2); g.fill();
        g.fillStyle = '#c86070'; for (let i = 0; i < 3; i++) g.fillRect(cutX - 6 + i * 4, cutY - 1, 2.4, 3 + i);
        g.restore();
      } });
      FX.burst(cutX, cutY, 10, ['guts', 'chunk', 'kidney', 'liver', 'bone'], 1.2); FX.drops(3);
    });
    s.at(1.95, () => { api.sfx('thud'); FX.blood(cutX + A.face * 100, F - 6, 24, 0, 0.9); api.shake(5); });
    s.at(2.4, () => { wall.falling = true; });
    s.at(2.9, () => api.sfx('thud'));
    s.at(3.2, () => api.bubble('CHURCH AND STATE. TOP AND BOTTOM.', A.x, F - 160, { size: 10, life: 1.8, fill: 'gold' }));
    s.at(5.0, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 70 * k, dt, api, 120); return; }
      A.scriptPose = t < 1.0 ? P({ hy: 4, lean: -0.1, head: -0.15, aF: [2.7, 0.3], aB: [0.4, 0.3], fF: [12, 0], fB: [-12, 0] })
        : t < 2.0 ? P({ hy: 6, lean: 0.25, head: 0.1, aF: [1.6, 0.05], aB: [0.6, 0.6], fF: [14, 0], fB: [-14, 0] }) : PS.stance(A.t);
      if (!f) V.scriptPose = PS.dizzy(V.t);
      if (wall) {
        if (t < 1.2) wall.x = lerp(A.x - A.face * 260, cutX, (t - 1.0) / 0.2);
        else if (!wall.falling) wall.x = lerp(cutX, cutX + A.face * 26, (t - 1.2) / 0.3);
        else if (!wall.landed) { wall.vy += 1400 * dt; wall.y += wall.vy * dt; if (wall.y >= F - WH / 2) { wall.y = F - WH / 2; wall.landed = true; api.shake(6); FX.dust(wall.x, F, 16); } }
      }
      if (top) {
        top.u = ease((t - 1.2) / 0.75);
        top.fall = t < 2.6 ? 0 : ease((t - 2.6) / 0.5);
        if (t < 2.6 && Math.random() < 0.7) FX.spurt(cutX, cutY, rnd(-0.4, 0.4), 1.2);
        if (t > 3.1 && t < 3.2) FX.blood(cutX - A.face * 30, F - 4, 14, 0, 0.6);
      }
    };
  };

  // ---------- ANDREW JACKSON: Old Hickory ----------
  // The cane goes into the floor and erupts into a hickory tree. The branches find the loser.
  S.jackson = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let planted = false, grow = 0, treeX = 0, lift = 0;
    const branches = [[-0.9, 0.55, 46], [0.8, 0.45, 50], [-0.4, 0.75, 40], [0.5, 0.8, 38], [-1.2, 0.35, 34], [1.15, 0.6, 36], [0.1, 0.95, 44]];
    const spears = [[0.55, -0.35], [0.4, 0.4], [0.75, 0.15], [0.25, -0.1]];
    prop({ layer: 'back', draw(g) {
      if (!planted) return;
      if (grow <= 0) { R.line(g, treeX, F + 2, treeX - A.face * 4, F - 34, '#5a3a1e', 2.4); return; }
      const H = 190 * grow, w = 5 + grow * 9;
      // roots ripping up the floor
      for (let i = -3; i <= 3; i++) R.line(g, treeX, F, treeX + i * 14 * grow, F + 3, '#3a2410', 2.4);
      g.fillStyle = '#4a3018'; g.beginPath(); g.moveTo(treeX - w, F); g.quadraticCurveTo(treeX - w * 0.5, F - H * 0.5, treeX - 2, F - H); g.lineTo(treeX + 2, F - H); g.quadraticCurveTo(treeX + w * 0.5, F - H * 0.5, treeX + w, F); g.fill();
      g.strokeStyle = 'rgba(20,10,4,0.5)'; g.lineWidth = 0.8; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(treeX - w * 0.6 + i * w * 0.24, F); g.lineTo(treeX - 1 + i * 0.4, F - H * 0.9); g.stroke(); }
      for (const [a, at, len] of branches) {
        const by = F - H * at, L = len * grow, ex = treeX + Math.sin(a) * L, ey = by - Math.cos(a) * L * 0.8;
        R.line(g, treeX, by, ex, ey, '#4a3018', 3 * grow + 0.5);
        for (let i = 0; i < 4; i++) { const lx = lerp(treeX, ex, 0.4 + i * 0.18), ly = lerp(by, ey, 0.4 + i * 0.18); g.fillStyle = ['#3a5a1e', '#4a6a24', '#2e4a18'][i % 3]; g.beginPath(); g.ellipse(lx + 3, ly - 3, 5 * grow, 2.4 * grow, a, 0, PI * 2); g.fill(); }
      }
    } });
    // the spikes that come out through the body, drawn in front of it
    prop({ layer: 'front', draw(g) {
      if (grow < 0.55) return;
      const hh = api.hurtH(V), u = Math.min(1, (grow - 0.55) / 0.3);
      for (const [rel, dx] of spears) {
        const y = V.y - hh * rel, x0 = treeX + dx * 10, x1 = x0 + dx * 30 * u, y1 = y - 22 * u;
        R.line(g, x0, y + 10, x1, y1, '#4a3018', 2.6); R.line(g, x1 - 1, y1 + 4, x1, y1, '#8a0010', 2.2);
        if (u > 0.9 && Math.random() < 0.08) FX.blood(x1, y1 + 2, 1, dx, 0.3);
      }
    } });
    s.at(0.6, () => api.bubble('OLD HICKORY NEVER BENDS.', A.x, F - 165, { size: 11, life: 1.3, fill: 'white' }));
    s.at(1.15, () => { planted = true; treeX = V.x - A.face * 6; api.sfx('thud'); api.shake(6); FX.dust(treeX, F, 12); });
    s.at(1.4, () => api.sfx('creak'));
    s.at(1.8, () => { api.sfx('crunch'); api.sfx('big'); api.shake(10); api.flash(); });
    s.at(2.15, () => { api.sfx('splat'); api.sfx('scream'); FX.burst(V.x, V.y - api.hurtH(V) * 0.5, 8, ['guts', 'chunk', 'bone'], 1); FX.drops(3); });
    s.at(3.4, () => api.bubble('TOUGH AS HICKORY. YOU WERE NOT.', A.x, F - 120, { size: 10, life: 1.8, fill: 'gold' }));
    s.at(5.0, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 56 * k, dt, api, 120); return; }
      if (t < 1.15) A.scriptPose = P({ hy: 4, lean: -0.15, head: -0.15, aF: [2.9, 0.2], aB: [0.5, 0.4], fF: [12, 0], fB: [-12, 0] });
      else if (t < 1.8) A.scriptPose = P({ hy: 10, lean: 0.45, head: 0.2, aF: [1.0, 0.1], aB: [0.6, 0.5], fF: [14, 0], fB: [-14, 0] });
      else A.scriptPose = P({ hy: 3, lean: -0.15, head: -0.25, aF: [0.4, 0.2], aB: [0.3, 1.9], fF: [12, 0], fB: [-12, 0] });
      grow = t < 1.8 ? 0 : ease((t - 1.8) / 0.55);
      lift = t < 2.0 ? 0 : ease((t - 2.0) / 0.5) * 70;
      V.y = F - lift; V.ro.noShadow = lift > 4;
      V.scriptPose = t < 2.0 ? PS.dizzy(V.t) : P({ hy: 2, lean: -0.5, head: -0.9, aF: [-0.4, 0.4], aB: [0.6, 0.3], lF: [0.3, 0.6], lB: [-0.2, 0.7] });
      V.ro.dx = t > 2.0 && t < 2.6 ? rnd(-1.5, 1.5) : 0;
      if (t > 2.1 && Math.random() < 0.3) FX.blood(V.x + rnd(-6, 6), V.y - rnd(10, 60), 2, 0, 0.4);
    };
  };

  // ---------- ULYSSES S. GRANT: Unconditional Surrender ----------
  // He accepts the loser's sword. Then their arms, their legs and their head, stacked neatly on a table.
  S.grant = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR, D = V.d, C = V.def.col;
    let sword = null, tableX = 0, hh = 0;
    const parts = [];
    const swordDraw = (g, x, y, a) => { g.save(); g.translate(x, y); g.rotate(a); R.line(g, -6, 0, 30, 0, '#d8dce4', 1.8); R.line(g, -6, -0.5, 30, -0.5, 'rgba(255,255,255,0.6)', 0.5); R.line(g, -6, -4, -6, 4, '#c8a040', 1.6); R.line(g, -12, 0, -6, 0, '#3a2410', 2.2); R.ball(g, -13, 0, 1.4, '#c8a040'); g.restore(); };
    // the pile: table, torso, two legs, two arms, then the head on top
    const piece = (g, p) => {
      g.save(); g.translate(p.x, p.y); g.rotate(p.rot);
      if (p.kind === 'torso') { R.seg(g, [-16 * D.k / 1.1, 0], [16 * D.k / 1.1, 0], D.chest * 0.75, D.belly * 0.7, C.torso, (V.def.mat && V.def.mat.torso) || 'cloth', { seed: 3 }); R.ball(g, -16, 0, 4, '#8a0010'); R.ball(g, 16, 0, 3.4, '#8a0010'); }
      else if (p.kind === 'leg') { R.seg(g, [-D.thigh * 0.5, 0], [D.thigh * 0.5, 0], D.thighR, D.kneeR, C.legU, 'cloth', { seed: 7 }); R.seg(g, [D.thigh * 0.5, 0], [D.thigh * 0.5 + D.shin * 0.9, 0], D.kneeR, D.ankleR, C.legL || C.legU, 'cloth', { seed: 8 }); R.ball(g, D.thigh * 0.5 + D.shin * 0.9 + 3, -1, D.ankleR * 1.3, C.foot || '#111'); R.ball(g, -D.thigh * 0.5, 0, D.thighR * 0.8, '#8a0010'); R.ball(g, -D.thigh * 0.5, 0, D.thighR * 0.3, '#e8e0d0'); }
      else if (p.kind === 'arm') { R.seg(g, [-D.upper * 0.5, 0], [D.upper * 0.5, 0], D.shR * 0.9, D.elbowR, C.armU, 'cloth', { seed: 9 }); R.seg(g, [D.upper * 0.5, 0], [D.upper * 0.5 + D.fore * 0.85, 0], D.elbowR, D.wristR, C.armL || C.armU, 'cloth', { seed: 10 }); R.ball(g, D.upper * 0.5 + D.fore * 0.85 + 2, 0, D.fist * 0.9, C.hand); R.ball(g, -D.upper * 0.5, 0, D.shR * 0.7, '#8a0010'); }
      else if (p.kind === 'head') R.drawHeadAt(g, { def: V.def, d: V.d }, 0, 0, 0, 1, { dead: true, t: 0 });
      g.restore();
    };
    s.at(0.6, () => api.bubble('NO TERMS EXCEPT UNCONDITIONAL SURRENDER.', A.x, F - 160, { size: 9, life: 1.6, fill: 'white' }));
    s.at(1.2, () => { sword = prop({ layer: 'front', st: 'held', x: 0, y: 0, a: 0, draw(g, p) { if (!p.gone) swordDraw(g, p.x, p.y, p.a); } }); api.sfx('clang'); });
    s.at(1.9, () => { sword.st = 'fly'; api.sfx('whoosh'); });
    s.at(2.25, () => { sword.st = 'grant'; api.sfx('ding'); api.bubble('ACCEPTED.', A.x, F - 160, { size: 11, fill: 'gold' }); });
    for (const [i, at] of [[0, 2.7], [1, 2.85], [2, 3.0], [3, 3.15]]) s.at(at, () => { api.sfx('slash'); api.shake(3); FX.blood(V.x, F - api.hurtH(V) * (0.3 + (i % 2) * 0.35), 14, -A.face, 1); });
    s.at(3.3, () => {
      hh = api.hurtH(V); V.hidden = true; api.sfx('splat'); api.sfx('crunch'); api.flash(); api.shake(9);
      tableX = V.x + A.face * 20;
      prop({ layer: 'back', draw(g) {
        g.fillStyle = '#4a2e16'; g.fillRect(tableX - 40, F - 28, 80, 5); g.fillStyle = '#6a4424'; g.fillRect(tableX - 40, F - 28, 80, 1.6);
        for (const sx of [-34, 30]) { g.fillStyle = '#3a2410'; g.fillRect(tableX + sx, F - 23, 4, 23); }
      } });
      const T = F - 28;
      const plan = [['torso', 0, -D.belly * 0.6, 0], ['leg', -4, -D.belly * 1.25 - D.thighR, 0.06], ['leg', 4, -D.belly * 1.25 - D.thighR * 3, -0.05], ['arm', -2, -D.belly * 1.25 - D.thighR * 4 - D.shR, 0.08], ['arm', 2, -D.belly * 1.25 - D.thighR * 4 - D.shR * 2.6, -0.06], ['head', 0, -D.belly * 1.25 - D.thighR * 4 - D.shR * 3.4 - 3 * D.k, 0]];
      plan.forEach(([kind, dx, dy, rot], i) => {
        const p = { kind, x: V.x, y: F - hh * (kind === 'head' ? 0.9 : kind === 'leg' ? 0.25 : 0.6), rot: rnd(-1, 1), x0: 0, y0: 0, tx: tableX + dx, ty: T + dy, trot: rot, at: 3.3 + i * 0.28, done: false };
        p.x0 = p.x; p.y0 = p.y; parts.push(p);
      });
      prop({ layer: 'front', draw(g) { for (const p of parts) piece(g, p); } });
      FX.burst(V.x, F - hh * 0.5, 8, ['guts', 'chunk', 'bone'], 1); FX.drops(3);
    });
    s.at(5.2, () => api.bubble('SURRENDER ACCEPTED.', A.x, F - 150, { size: 12, life: 1.6, fill: 'gold' }));
    s.at(6.4, () => { sword.gone = true; });
    s.at(6.6, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 46 * k, dt, api, 110); return; }
      if (t < 3.3) V.scriptPose = t > 1.2 && t < 2.0 ? P({ hy: 6, lean: 0.25, head: 0.35, aF: [1.5, 0.05], aB: [0.4, 0.4], fF: [10, 0], fB: [-10, 0] }) : PS.dizzy(V.t);
      if (t < 2.25) A.scriptPose = P({ hy: 2, lean: -0.05, head: -0.1, aF: t > 1.9 ? [1.4, 0.3] : [0.3, 0.2], aB: [0.3, 1.9], fF: [10, 0], fB: [-10, 0] });
      else if (t < 3.3) A.scriptPose = P({ hy: 6, lean: 0.3, head: 0.1, aF: [Math.floor((t - 2.6) / 0.15) % 2 ? 2.6 : 1.0, 0.1], aB: [0.6, 0.5], fF: [14, 0], fB: [-14, 0] });
      else A.scriptPose = P({ hy: 2, lean: -0.05, head: -0.1, aF: [0.3, 0.15], aB: [0.3, 1.9], fF: [10, 0], fB: [-10, 0] });
      if (sword) {
        const hv = J(V, 'handFx'), ha = J(A, 'handFx'), e = J(A, 'elbowF');
        if (sword.st === 'held') { sword.x = hv[0]; sword.y = hv[1]; sword.a = A.face > 0 ? PI : 0; }
        else if (sword.st === 'fly') { const u = ease((t - 1.9) / 0.35); sword.x = lerp(hv[0], ha[0], u); sword.y = lerp(hv[1], ha[1], u) - Math.sin(u * PI) * 20; sword.a += dt * 14; }
        else { sword.x = ha[0]; sword.y = ha[1]; sword.a = Math.atan2(ha[1] - e[1], ha[0] - e[0]); }
      }
      for (const p of parts) {
        if (t < p.at) { p.x += (p.x - V.x) * dt * 0.5; continue; }
        const u = ease((t - p.at) / 0.5); p.x = lerp(p.x0, p.tx, u); p.y = lerp(p.y0, p.ty, u) - Math.sin(u * PI) * 60; p.rot = lerp(p.rot, p.trot, u);
        if (u >= 1 && !p.done) { p.done = true; api.sfx('thud'); FX.blood(p.tx, p.ty + 4, 6, 0, 0.4); }
      }
    };
  };

  // ---------- GROVER CLEVELAND: Sheriff's Drop ----------
  // As sheriff of Erie County he pulled the lever himself. A gallows rises, the trap drops, the head stays up.
  S.cleveland = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let rise = 0, open = false, noose = false, popped = false, gx = 0, fallV = 0, headP = null;
    const PH = 40, beam = 150;
    s.at(0.6, () => api.bubble('BY ORDER OF THE SHERIFF OF ERIE COUNTY.', A.x, F - 160, { size: 9, life: 1.5, fill: 'white' }));
    s.at(0.9, () => { gx = V.x; api.sfx('creak'); api.shake(4); });
    s.at(1.9, () => { noose = true; api.sfx('whoosh'); });
    s.at(2.2, () => api.bubble('ANY LAST WORDS? NO? GOOD.', A.x, F - 150, { size: 10, life: 1.2, fill: 'gold' }));
    s.at(3.4, () => { open = true; api.sfx('clang'); api.sfx('thud'); });
    s.at(4.5, () => api.bubble('CASE CLOSED.', A.x, F - 150, { size: 13, life: 1.6, fill: 'gold' }));
    s.at(6.0, () => { s.done = true; });
    const ropeTop = () => F - (PH + beam) * rise;
    prop({ layer: 'back', draw(g) {
      if (rise <= 0) return;
      const top = F - PH * rise, bt = ropeTop();
      // platform, posts, crossbeam, brace
      for (const sx of [-36, 30]) { g.fillStyle = '#4a3420'; g.fillRect(gx + sx, bt, 6, F - bt); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(gx + sx + 4, bt, 2, F - bt); }
      g.fillStyle = '#5a3e24'; g.fillRect(gx - 40, bt - 6, 80, 7); R.line(g, gx + 30, bt + 18, gx + 12, bt, '#4a3420', 3);
      g.fillStyle = '#5a3e24'; g.fillRect(gx - 48, top, 96, 6); g.fillStyle = '#6e4c2c'; g.fillRect(gx - 48, top, 96, 1.5);
      for (let i = 0; i < 4; i++) { g.fillStyle = '#3a2814'; g.fillRect(gx - 44 + i * 26, top + 6, 3, F - top - 6); }
      // trap door
      g.fillStyle = '#1a1008'; g.fillRect(gx - 14, top, 28, 6);
      if (!open) { g.fillStyle = '#6a4828'; g.fillRect(gx - 14, top, 28, 6); g.strokeStyle = 'rgba(0,0,0,0.5)'; g.strokeRect(gx - 14, top, 28, 6); }
      else { g.fillStyle = '#6a4828'; g.fillRect(gx - 14, top, 4, 24); g.fillRect(gx + 10, top, 4, 24); }
      // steps and the lever at the side, toward the sheriff
      const lx = gx - A.face * 46; g.fillStyle = '#3a2814'; g.fillRect(lx - 2, top - 2, 4, 6);
      R.line(g, lx, top, lx + (open ? -A.face * 12 : A.face * 10), top - 22, '#7a7e88', 2); R.ball(g, lx + (open ? -A.face * 12 : A.face * 10), top - 22, 2, '#2a2a2e');
      if (noose && !popped) { const n = J(V, 'neck'); R.line(g, gx, bt + 1, n[0], n[1] - 2, '#c8b080', 1.4); }
      if (popped && headP) { R.line(g, gx, bt + 1, headP.x, headP.y - 4, '#c8b080', 1.4); }
    } });
    prop({ layer: 'front', draw(g) {
      if (noose && !popped) { const n = J(V, 'neck'); g.strokeStyle = '#c8b080'; g.lineWidth = 2; g.beginPath(); g.ellipse(n[0], n[1], 6, 3, 0, 0, PI * 2); g.stroke(); for (let i = 0; i < 5; i++) R.line(g, n[0] - 3 + i * 1.5, n[1] - 4 - i * 2.4, n[0] - 3 + i * 1.5, n[1] - 6 - i * 2.4, '#a89060', 1.6); }
      if (popped && headP) { R.drawHeadAt(g, { def: V.def, d: V.d }, headP.x, headP.y, Math.sin(s.t * 3) * 0.25, 1, { dead: true, t: 0 }); g.strokeStyle = '#c8b080'; g.lineWidth = 2; g.beginPath(); g.ellipse(headP.x, headP.y + 2, 6, 3, 0, 0, PI * 2); g.stroke(); }
    } });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 92 * k, dt, api, 120); return; }
      rise = t < 0.9 ? 0 : ease((t - 0.9) / 0.9);
      if (!open) { V.y = F - PH * rise; V.scriptPose = t > 1.9 ? P({ hy: 0, lean: 0, head: 0.15, aF: [0.1, 0.1], aB: [0.05, 0.1], fF: [3, 0], fB: [-3, 0] }) : PS.dizzy(V.t); V.ro.noShadow = rise > 0.1; }
      A.scriptPose = t < 3.2 ? PS.stance(A.t) : t < 3.7 ? P({ hy: 6, lean: 0.3, head: 0.1, aF: [1.5, 0.2], aB: [0.6, 0.6], fF: [12, 0], fB: [-12, 0] }) : P({ hy: 2, lean: -0.1, head: -0.15, aF: [0.3, 1.9], aB: [0.3, 1.9], fF: [10, 0], fB: [-10, 0] });
      if (open && !popped) {
        fallV += 1300 * dt; V.y += fallV * dt;
        if (V.y > F - PH + 26) {
          popped = true; const n = J(V, 'neck'); headP = { x: n[0], y: n[1] - 6 };
          V.ro.noHead = true; api.sfx('crunch'); api.sfx('splat'); api.shake(10); api.flash();
          FX.burst(n[0], n[1], 6, ['chunk', 'bone'], 0.8); FX.drops(2);
        }
      } else if (popped) {
        if (V.y < F) { fallV += 1300 * dt; V.y = Math.min(F, V.y + fallV * dt); if (V.y >= F) { V.scriptPose = PS.down(V); V.snapPose = true; api.sfx('thud'); FX.blood(V.x, F - 4, 20, 0, 0.8); } }
        if (t < 4.6 && Math.random() < 0.5) { const n = J(V, 'neck'); FX.spurt(n[0], n[1], rnd(-0.5, 0.5), 1); }
        if (headP && Math.random() < 0.1) FX.blood(headP.x, headP.y + 6, 1, 0, 0.2);
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
