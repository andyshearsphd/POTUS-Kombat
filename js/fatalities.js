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

  // ---------- WILLIAM HOWARD TAFT: Fore! ----------
  // The first golfing president pops the head off, tees it up and drives it off the screen.
  S.taft = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR, D = A.d, fc = A.face;
    let head = null, tee = null, club = null, golf = false, spurting = false, fj = null, fp = null, gripW = null;
    const drawHead = (g, x, y, rot) => R.drawHeadAt(g, { def: V.def, d: V.d }, x, y, rot, 1, { dead: true, t: 0 });
    // ---- the swing, seen face-on like a golf broadcast. Target is toward the loser (fc). ----
    // geometry of the face-on body (matches the engine's drawFront)
    const geo = hy => { const Lg = (D.thigh + D.shin) * 0.96, hipY = -Lg + hy * k, sY = hipY - D.torso, shx = Math.max(D.shW, D.chest * 0.8); return { sY, shx, S: [0, sY + D.shR * 0.6 + 6 * k], Rh: (D.upper + D.fore) * 0.82 }; };
    // two-bone arm solve: shoulder to a hand target, elbows bent down and out; returns the [a0, a1] the rig wants
    const armTo = (sd, G, T) => {
      const s0 = [sd * G.shx * 0.95, G.sY + D.shR * 0.6], u = D.upper, f = D.fore;
      let dx = T[0] - s0[0], dy = T[1] - s0[1], dist = Math.hypot(dx, dy); const m = Math.min(u + f - 0.01, Math.max(Math.abs(u - f) + 0.01, dist));
      const phi = Math.atan2(dy, dx), al = Math.acos(Math.max(-1, Math.min(1, (u * u + m * m - f * f) / (2 * u * m))));
      const e1 = [s0[0] + Math.cos(phi + al) * u, s0[1] + Math.sin(phi + al) * u], e2 = [s0[0] + Math.cos(phi - al) * u, s0[1] + Math.sin(phi - al) * u];
      const el = e1[1] > e2[1] ? e1 : e2, Tm = [s0[0] + dx / dist * m, s0[1] + dy / dist * m];
      const a0 = Math.atan2((el[0] - s0[0]) * sd, el[1] - s0[1]), b = Math.atan2((Tm[0] - el[0]) * sd, Tm[1] - el[1]);
      return [a0, b - a0];
    };
    // keyframes: [time from T0, hand angle th (0 = hands straight down, + toward target), wrist cock, crouch, body sway, head tilt, trail heel lift]
    const T0 = 3.0, KF = [
      [0.00, 0.10, 0.00, 7, 0.00, 0.00, 0], // address
      [0.32, -0.95, -0.35, 7, -0.02, 0.00, 0], // takeaway
      [0.58, -2.25, -1.55, 6, -0.05, 0.05, 0], // top: hands over the back shoulder, club wrapped behind the head
      [0.66, -2.28, -1.6, 6, -0.05, 0.05, 0], // the pause at the top
      [0.75, -0.85, -1.35, 7, 0.00, 0.03, 0], // downswing with the wrists still cocked (lag)
      [0.79, 0.10, 0.00, 7, 0.02, 0.00, 0], // impact
      [0.87, 1.45, 0.55, 5, 0.05, -0.10, 2], // extension through
      [1.02, 2.45, 1.30, 3, 0.08, -0.30, 5], // high finish, belly out, watching it fly
    ];
    const swing = t => {
      const u = t - T0; let i = 0; while (i < KF.length - 2 && u > KF[i + 1][0]) i++;
      const A0 = KF[i], A1 = KF[i + 1], f = Math.max(0, Math.min(1, (u - A0[0]) / (A1[0] - A0[0]))), e = i === 3 || i === 4 || i === 5 ? f * f : ease(f);
      const v = j => A0[j] + (A1[j] - A0[j]) * e; return { th: v(1), ck: v(2), hy: v(3), sw: v(4), hd: v(5), heel: v(6), seg: i };
    };
    const poseAt = w => {
      const G = geo(w.hy), th = w.th * fc, H = [G.S[0] + Math.sin(th) * G.Rh, G.S[1] + Math.cos(th) * G.Rh];
      // the lead hand sits just above the trail hand on the grip
      const lead = fc, aL = armTo(-1, G, [H[0] + (lead < 0 ? 0 : 0), H[1] - (lead < 0 ? 2 : 0) * k]), aR = armTo(1, G, [H[0], H[1] - (lead > 0 ? 2 : 0) * k]);
      return { aL, aR, hy: w.hy, spread: 9, sway: w.sw * fc, head: w.hd * fc, liftL: fc > 0 ? w.heel : 0, liftR: fc < 0 ? w.heel : 0, jaw: 0, _club: th + w.ck * fc };
    };
    s.at(0.6, () => api.bubble('HOLD STILL. I PLAY TO A TWENTY.', A.x, F - 165, { size: 10, life: 1.2, fill: 'white' }));
    s.at(1.3, () => {
      api.sfx('crunch'); api.sfx('scream'); api.shake(8); api.flash(); V.ro.noHead = true; spurting = true;
      head = prop({ layer: 'front', x: 0, y: 0, rot: 0, vx: 0, vy: 0, st: 'hand', draw(g, p) { drawHead(g, p.x, p.y, p.rot); } });
      FX.burst(J(V, 'neck')[0], J(V, 'neck')[1], 6, ['chunk', 'bone'], 1);
    });
    s.at(1.8, () => { V.x += fc * 96; V.scriptPose = PS.down(V); V.snapPose = true; spurting = false; api.sfx('thud'); FX.blood(V.x, F - 6, 22, 0, 0.9); });
    s.at(2.4, () => {
      // turn to face the camera and take his stance; the ball goes where the club bottoms out
      golf = true; A.hidden = true;
      const w = { th: 0.10, ck: 0, hy: 7, sw: 0, hd: 0, heel: 0 }, G = geo(w.hy), th = w.th * fc, gx = A.x + G.S[0] + Math.sin(th) * G.Rh, gy = A.y + G.S[1] + Math.cos(th) * G.Rh;
      const L = (F - 5 - gy) / Math.cos(th);
      tee = prop({ layer: 'back', x: gx + Math.sin(th) * L, draw(g, p) { g.fillStyle = '#f0ece0'; g.fillRect(p.x - 0.8, F - 8, 1.6, 8); g.fillRect(p.x - 3, F - 9, 6, 1.4); } });
      club = { st: 'held', L, ang: th, x: 0, y: 0, rot: 0, vx: 0, vy: 0, spin: 0, trail: [] };
      api.sfx('whoosh');
    });
    s.at(2.6, () => { head.st = 'tee'; api.sfx('thud'); });
    s.at(T0 + 0.79, () => { head.st = 'fly'; head.vx = fc * 600; head.vy = -440; api.sfx('big'); api.sfx('clang'); api.shake(6); FX.blood(head.x, head.y - 10, 20, fc, 1.2); });
    s.at(T0 + 0.95, () => { api.bubble('FORE!', A.x, F - 185, { size: 24, life: 1.6, fill: 'gold' }); api.say('fore'); });
    // he admires the shot, then flips the driver away; it clatters down and stays on the floor
    s.at(4.9, () => { const [gx, gy] = gripW; club.st = 'free'; club.x = gx; club.y = gy; club.rot = club.ang; club.vx = -fc * 150; club.vy = -280; club.spin = -fc * 10; api.sfx('whoosh'); });
    s.at(5.75, () => { golf = false; A.hidden = false; A.scriptPose = PS.stance(A.t); head.draw = () => {}; });
    s.at(5.8, () => { s.done = true; });
    // the club: grip at the hands, persimmon driver head at the end
    const drawClub = (g, gx, gy, ang, L) => {
      const dx = Math.sin(ang), dy = Math.cos(ang), ex = gx + dx * L, ey = gy + dy * L;
      R.line(g, gx, gy, ex, ey, '#c8ccd4', 1.3); R.line(g, gx - dx * 3, gy - dy * 3, gx + dx * L * 0.18, gy + dy * L * 0.18, '#1a1a1a', 2.4);
      g.save(); g.translate(ex, ey); g.rotate(-ang); g.fillStyle = '#5a3418'; g.beginPath(); g.ellipse(fc * 2.5, 1, 5, 3.2, 0, 0, PI * 2); g.fill(); g.fillStyle = 'rgba(255,220,170,0.35)'; g.fillRect(fc > 0 ? 0 : -5, -1.6, 5, 1); g.restore();
    };
    prop({ layer: 'back', draw(g) {
      if (!golf || !fp) return;
      const behind = club && club.st === 'held' && Math.cos(club.ang) < -0.2;
      if (behind) drawClub(g, gripW[0], gripW[1], club.ang, club.L);
      R.digi(g, A.x, A.y, gg => { fj = R.drawFront(gg, { def: A.def, d: A.d, x: A.x, y: A.y, t: A.t, st: A.st2 }, fp); }, { box: [20, 0, 340, 330] });
      if (fj) gripW = [(fj.handL[0] + fj.handR[0]) / 2, (fj.handL[1] + fj.handR[1]) / 2 + 2 * k];
      if (club && club.st === 'held' && !behind) {
        if (club.trail.length > 1) { g.strokeStyle = 'rgba(235,235,245,0.4)'; g.lineWidth = 3; g.beginPath(); club.trail.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }
        drawClub(g, gripW[0], gripW[1], club.ang, club.L);
      }
    } });
    prop({ layer: 'back', draw(g) { if (club && club.st === 'free') drawClub(g, club.x, club.y, club.rot, club.L); } });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - fc * 30 * k, dt, api, 110); return; }
      if (t < 1.3) { A.scriptPose = P({ hy: 6, lean: 0.35, head: 0.1, aF: [1.75, 0.25], aB: [1.6, 0.3], fF: [15, 0], fB: [-15, 0] }); V.scriptPose = PS.dizzy(V.t); V.ro.dx = t > 0.9 ? rnd(-2, 2) : 0; return; }
      if (spurting) { const n = J(V, 'neck'); FX.spurt(n[0], n[1], -fc * 0.3, 1.2); }
      if (t >= 5.75) { if (head.st === 'fly') { head.vy += 600 * dt; head.x += head.vx * dt; head.y += head.vy * dt; } return; }
      if (!golf) { const h = J(A, 'handFx'); head.x = h[0]; head.y = h[1] + 10; head.rot = Math.sin(t * 16) * 0.1; A.scriptPose = P({ hy: 4, lean: -0.1, head: -0.15, aF: [2.4, 0.3], aB: [0.6, 1.8], fF: [13, 0], fB: [-14, 0] }); return; }
      // body pose for this moment
      let w;
      if (t < 2.6) w = { th: 1.1, ck: 0.3, hy: 2, sw: 0, hd: 0, heel: 0 };           // still holding the head out, about to set it down
      else if (t < T0) { const wg = Math.sin((t - 2.6) * 14) * (t > 2.75 ? 1 : 0); w = { th: 0.10 + wg * 0.06, ck: wg * 0.15, hy: 7, sw: 0, hd: 0, heel: 0 }; } // waggle
      else if (club.st === 'held') w = swing(t);
      else w = { th: Math.max(0, 0.6 - (t - 4.9) * 2) + 0.1, ck: 0, hy: 0, sw: 0, hd: -0.1, heel: 0 };
      fp = poseAt(w);
      if (club.st === 'held') {
        club.ang = t < 2.6 ? fp._club : t < T0 ? club.ang + (fp._club - club.ang) * Math.min(1, dt * 20) : fp._club;
        if (t > T0 + 0.66 && t < T0 + 0.84 && gripW) { club.trail.push([gripW[0] + Math.sin(club.ang) * club.L, gripW[1] + Math.cos(club.ang) * club.L]); if (club.trail.length > 8) club.trail.shift(); } else club.trail.length = 0;
      } else {
        club.vy += 900 * dt; club.x += club.vx * dt; club.y += club.vy * dt; club.rot += club.spin * dt;
        if (club.y > F - 4) { club.y = F - 4; club.vy = 0; club.vx *= 0.4; club.spin = 0; club.rot = fc > 0 ? -PI / 2 : PI / 2; if (!club.landed) { club.landed = true; api.sfx('clang'); } }
      }
      if (head.st === 'hand' && gripW) { head.x = gripW[0] + fc * 6; head.y = gripW[1] + 8; }
      if (head.st === 'tee') { head.x = tee.x; head.y = F - 4; head.rot = 0; }
      if (head.st === 'fly') { head.vy += 600 * dt; head.x += head.vx * dt; head.y += head.vy * dt; head.rot += dt * 20; if (Math.random() < 0.8) FX.blood(head.x, head.y, 1, 0, 0.2); }
    };
  };

  // ---------- CALVIN COOLIDGE: Lamplight Oath ----------
  // Sworn in by his father by kerosene lamp. The lamp does the rest. Then he blows it out and goes to bed.
  S.coolidge = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let lamp = 1, flame = 1, burning = false, ash = 0, bed = 0, x0 = 0;
    const zz = [];
    prop({ layer: 'front', draw(g) {
      if (lamp) {
        const h = J(A, 'handFx'), x = h[0], y = h[1] - 2;
        g.fillStyle = '#8a6a2a'; g.beginPath(); g.ellipse(x, y + 4, 5, 3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#c8a050'; g.fillRect(x - 2, y - 1, 4, 3);
        g.fillStyle = 'rgba(220,235,240,0.45)'; g.beginPath(); g.moveTo(x - 2.4, y - 1); g.quadraticCurveTo(x - 4.4, y - 6, x - 1.6, y - 13); g.lineTo(x + 1.6, y - 13); g.quadraticCurveTo(x + 4.4, y - 6, x + 2.4, y - 1); g.fill();
        if (flame > 0) { const f = flame * (1 + Math.sin(s.t * 40) * 0.15); g.fillStyle = '#ffb030'; g.beginPath(); g.ellipse(x, y - 6, 1.4 * f, 3 * f, 0, 0, PI * 2); g.fill(); g.fillStyle = '#fff0b0'; g.beginPath(); g.ellipse(x, y - 5.6, 0.6 * f, 1.4 * f, 0, 0, PI * 2); g.fill(); glowAt(g, x, y - 6, 26 * f, 'rgba(255,200,110,0.35)'); }
      }
      if (ash > 0) { g.fillStyle = '#4a4848'; g.beginPath(); g.ellipse(x0, F, 8 + ash * 26, 3 + ash * 9, 0, PI, PI * 2); g.fill(); if (ash > 0.8) { g.save(); g.filter = 'brightness(0.42)'; R.skull(g, x0 + 6, F - 7, 6 * V.d.k * (V.def.skullK || 1), 0.3, V.def.skull); g.restore(); } }
      for (const z of zz) { g.globalAlpha = Math.max(0, 1 - z.t / 2); TXT.draw(g, 'Z', z.x + z.t * 10, z.y - z.t * 22, { size: 8 + z.t * 4, fill: 'white' }); g.globalAlpha = 1; }
    } });
    prop({ layer: 'back', draw(g) {
      if (bed <= 0) return;
      const bx = A.x, w = 104, a = bed, hd = -A.face;
      g.globalAlpha = a; g.fillStyle = '#3a2410'; g.fillRect(bx + hd * (w / 2 + 2) - 2.5, F - 40, 5, 40); g.fillRect(bx - hd * (w / 2 + 2) - 2.5, F - 28, 5, 28);
      g.fillStyle = '#e8e4d8'; g.fillRect(bx - w / 2, F - 24, w, 10); g.fillStyle = '#6a2a2a'; g.fillRect(hd > 0 ? bx - w / 2 : bx - w / 2 + 24, F - 25, w - 24, 11);
      g.fillStyle = '#f4f0e6'; g.beginPath(); g.ellipse(bx + hd * (w / 2 - 11), F - 27, 11, 4.5, 0, 0, PI * 2); g.fill();
      g.fillStyle = '#4a2e16'; g.fillRect(bx - w / 2 - 4, F - 14, w + 8, 4); g.globalAlpha = 1;
    } });
    s.at(0.6, () => api.bubble('I DO SOLEMNLY SWEAR...', A.x, F - 160, { size: 11, life: 1.4, fill: 'white' }));
    s.at(1.4, () => {
      burning = true; V.ro.char = true; api.sfx('fire'); api.sfx('big'); api.sfx('scream'); api.shake(10); api.flash();
      const c = J(V, 'chest'), hh = api.hurtH(V); for (let i = 0; i < 140; i++) FX.fire(c[0] + rnd(-45, 45), V.y - rnd(0, hh * 1.4), 1, 2.2);
      FX.puff(c[0], c[1], 'rgba(255,170,60,0.8)', 20, 6);
    });
    s.at(3.2, () => { burning = false; V.ro.skeleton = true; V.ro.ash = true; api.sfx('fire'); });
    s.at(3.9, () => { V.hidden = true; x0 = V.x; api.sfx('crunch'); const hh = api.hurtH(V); for (let i = 0; i < 40; i++) FX.puff(V.x + rnd(-14, 14), F - rnd(0, hh), 'rgba(90,88,86,0.8)', 1, 2); });
    s.at(4.4, () => { api.sfx('whoosh'); const h = J(A, 'handFx'); FX.puff(h[0], h[1] - 8, 'rgba(230,230,235,0.6)', 4, 2); });
    s.at(4.9, () => { lamp = 0; api.sfx('thud'); });
    s.at(5.3, () => api.bubble('GOOD NIGHT.', A.x, F - 120, { size: 12, life: 1.6, fill: 'gold' }));
    s.at(7.1, () => { bed = -1; zz.length = 0; A.y = F; A.ro.noShadow = false; A.scriptPose = PS.stance(A.t); });
    s.at(7.2, () => { s.done = true; });
    s.tick = (t, dt) => {
      for (const z of zz) z.t += dt;
      if (t >= 7.1) return;
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 44 * k, dt, api, 110); return; }
      if (t < 1.4) { A.scriptPose = P({ hy: 4, lean: 0.15, head: 0, aF: [1.5 + (t > 1.1 ? 0.6 : 0), 0.3], aB: [0.3, 0.2], fF: [12, 0], fB: [-12, 0] }); V.scriptPose = PS.dizzy(V.t); return; }
      if (t < 3.2) {
        A.scriptPose = P({ hy: 4, lean: 0, head: 0, aF: [1.3, 0.6], aB: [0.2, 0.1], fF: [12, 0], fB: [-12, 0] });
        V.scriptPose = P({ hy: 5, lean: Math.sin(t * 9) * 0.3, head: Math.sin(t * 13) * 0.5, aF: [2.6 + Math.sin(t * 17) * 0.5, 0.6], aB: [2.4 + Math.cos(t * 15) * 0.5, 0.6], fF: [8 + Math.sin(t * 11) * 5, 0], fB: [-10, 0] });
        V.ro.dx = Math.sin(t * 7) * 4;
        if (burning) for (const j of ['head', 'chest', 'belly', 'handF', 'kneeF', 'kneeB']) if (Math.random() < 0.7) { const p = J(V, j); FX.fire(p[0] + rnd(-4, 4), p[1], 1, 1.1); }
        return;
      }
      if (t < 3.9) { V.scriptPose = PS.down(V); ash = 0; }
      else ash = Math.min(1, (t - 3.9) / 0.4);
      // lamp to the lips, one breath, out
      if (t < 4.9) { A.scriptPose = P({ hy: 4, lean: 0, head: 0.1, aF: [1.9, 1.7], aB: [0.2, 0.1], fF: [12, 0], fB: [-12, 0] }); flame = t < 4.4 ? 1 : Math.max(0, 1 - (t - 4.4) / 0.12); return; }
      bed = Math.min(1, (t - 4.9) / 0.4);
      if (t > 5.3) { A.y = F - 30 + (A.d.thigh + A.d.shin) * 0.9; A.scriptPose = P({ rot: -PI / 2, hyA: 4, aF: [0.2, 1.6], aB: [0.1, 0.3], lF: [0.05, 0.05], lB: [0.0, 0.05], head: -0.2 }); A.ro.noShadow = true; if (Math.random() < dt * 1.4) zz.push({ x: A.x - A.face * 40, y: F - 44, t: 0 }); }
    };
  };
  const glowAt = (g, x, y, r, c) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, PI * 2); g.fill(); };

  // ---------- HARRY S. TRUMAN: Dewey Defeats Truman ----------
  // Rolled up in the early edition, stomped flat, and held up high with that famous grin.
  S.truman = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let paper = 0, roll = null, flat = null, hh = 0;
    const page = (g, x, y, w, h, blood) => {
      g.fillStyle = '#ece6d4'; g.fillRect(x - w / 2, y - h / 2, w, h); g.strokeStyle = 'rgba(0,0,0,0.3)'; g.lineWidth = 0.5; g.strokeRect(x - w / 2, y - h / 2, w, h);
      g.fillStyle = '#141414'; g.font = `${Math.max(3, h * 0.09)}px Anton, Impact, sans-serif`; g.textAlign = 'center'; g.fillText('CHICAGO DAILY TRIBUNE', x, y - h * 0.36);
      g.font = `${Math.max(4, h * 0.2)}px Anton, Impact, sans-serif`; g.fillText('DEWEY DEFEATS', x, y - h * 0.1); g.fillText('TRUMAN', x, y + h * 0.12); g.textAlign = 'left';
      g.fillStyle = 'rgba(40,40,40,0.5)'; for (let i = 0; i < 5; i++) g.fillRect(x - w * 0.42, y + h * 0.2 + i * h * 0.05, w * 0.84, h * 0.02);
      if (blood) { g.fillStyle = 'rgba(140,0,14,0.85)'; g.beginPath(); g.ellipse(x + w * 0.1, y + h * 0.15, w * 0.3, h * 0.2, 0.3, 0, PI * 2); g.fill(); g.fillRect(x - w / 2, y + h * 0.3, 3, 8); g.fillRect(x + w / 2 - 3, y - h * 0.2, 3, 10); }
    };
    s.at(0.6, () => { paper = 1; api.sfx('slash'); api.bubble('EXTRA! EXTRA!', A.x, F - 165, { size: 11, fill: 'white' }); });
    s.at(1.4, () => {
      paper = 0; hh = api.hurtH(V); V.hidden = true; api.sfx('slash'); api.sfx('crunch'); api.shake(5);
      roll = prop({ layer: 'back', x: V.x, h: hh * 1.02, rot: 0, squash: 1, draw(g, p) {
        g.save(); g.translate(p.x, F); g.rotate(p.rot); const H = p.h, w = 30 * V.d.k * (2 - p.squash);
        const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, '#a8a290'); gr.addColorStop(0.5, '#f0ead8'); gr.addColorStop(1, '#a09a88'); g.fillStyle = gr; g.fillRect(-w / 2, -H, w, H);
        g.fillStyle = '#141414'; g.font = '7px Anton, Impact, sans-serif'; g.save(); g.translate(2, -H * 0.5); g.rotate(-PI / 2); g.textAlign = 'center'; g.fillText('DEWEY DEFEATS TRUMAN', 0, 0); g.restore();
        g.fillStyle = 'rgba(40,40,40,0.35)'; for (let i = 0; i < 8; i++) g.fillRect(-w / 2 + 2, -H + 8 + i * H / 9, w - 4, 0.8);
        if (p.squash < 0.9) { g.fillStyle = 'rgba(140,0,14,0.85)'; g.fillRect(-w / 2 - 3, -H, w + 6, 4); g.fillRect(-w / 2 - 3, -4, w + 6, 4); }
        g.restore();
      } });
    });
    s.at(1.9, () => { api.sfx('thud'); api.shake(4); });
    for (const at of [2.5, 2.95, 3.4]) s.at(at, () => { api.sfx('splat'); api.sfx('crunch'); api.shake(8); roll.squash -= 0.28; FX.blood(roll.x - A.face * 4, F - 4, 14, -1, 1); FX.blood(roll.x + A.face * roll.h, F - 4, 14, 1, 1); FX.burst(roll.x + A.face * roll.h * 0.5, F - 6, 3, ['chunk', 'tooth'], 0.6); });
    s.at(3.9, () => { roll.gone = true; roll.draw = () => {}; flat = 1; api.sfx('slash'); });
    s.at(4.4, () => api.bubble("THAT AIN'T THE WAY I HEARD IT!", A.x, F - 175, { size: 10, life: 1.8, fill: 'gold' }));
    s.at(6.1, () => { flat = 0; });
    s.at(6.2, () => { s.done = true; });
    prop({ layer: 'front', draw(g) {
      if (!paper && !flat) return;
      const a = J(A, 'handFx'), b = J(A, 'handBx'), x = (a[0] + b[0]) / 2, y = Math.min(a[1], b[1]) - (flat ? 18 : 0);
      page(g, x, y, flat ? 52 : 40, flat ? 40 : 30, !!flat);
    } });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 50 * k, dt, api, 110); return; }
      if (t < 1.4) { V.scriptPose = PS.dizzy(V.t); A.scriptPose = P({ hy: 4, lean: 0.1, head: 0.05, aF: [1.6, 0.2], aB: [1.5, 0.3], fF: [12, 0], fB: [-12, 0] }); return; }
      if (roll && !roll.gone) {
        roll.rot = t < 1.9 ? A.face * ease((t - 1.4) / 0.5) * PI / 2 : A.face * PI / 2;
        if (t > 1.9) { roll.squash = Math.max(0.2, roll.squash); }
        // walk up onto it and stomp
        if (t > 2.0) {
          const ph = ((t - 2.05) % 0.45) / 0.45, up = Math.sin(ph * PI);
          A.y = F - up * 26; A.scriptPose = P({ hy: 6, lean: 0.1, head: 0.2, aF: [1.2, 0.8], aB: [1.0, 0.8], fF: [10, -up * 8], fB: [-10, 0] });
          A.x = lerp(A.x, roll.x + A.face * 26, dt * 4);
        } else A.scriptPose = PS.stance(A.t);
        return;
      }
      A.y = F;
      A.scriptPose = P({ hy: 3, lean: -0.08, head: -0.2, aF: [2.75, 0.3], aB: [2.65, 0.35], fF: [12, 0], fB: [-12, 0], jaw: 0.3 });
    };
  };

  // ---------- JOHN F. KENNEDY: Ask Not ----------
  S.jfk_heart = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let heart = null, spurting = false;
    s.at(0.6, () => api.bubble('ASK NOT WHAT YOUR COUNTRY CAN DO FOR YOU...', A.x, F - 165, { size: 9, life: 1.5, fill: 'white' }));
    s.at(1.3, () => { api.sfx('punch'); api.sfx('crunch'); api.shake(9); api.flash(); FX.burst(J(V, 'chest')[0], J(V, 'chest')[1], 6, ['chunk', 'bone'], 0.9); });
    s.at(1.7, () => { api.sfx('splat'); spurting = true; heart = prop({ layer: 'front', x: 0, y: 0, draw(g, p) { const b = 1 + Math.max(0, Math.sin(s.t * 14)) * 0.18; g.save(); g.translate(p.x, p.y); g.scale(b, b); g.fillStyle = '#8a0a14'; g.beginPath(); g.moveTo(0, 6); g.bezierCurveTo(-8, 0, -6, -7, -1.5, -5); g.bezierCurveTo(-0.5, -6, 0.5, -6, 1.5, -5); g.bezierCurveTo(6, -7, 8, 0, 0, 6); g.fill(); g.fillStyle = '#c8303a'; g.beginPath(); g.ellipse(-2.5, -2.5, 2, 1.4, -0.4, 0, PI * 2); g.fill(); R.line(g, 1, -5, 2.5, -9, '#6a0a10', 1.6); R.line(g, -1, -5, -2, -9, '#5a0a10', 1.4); g.restore(); } }); });
    s.at(2.3, () => { api.bubble('...ASK WHAT YOU CAN DO FOR YOUR COUNTRY.', A.x, F - 175, { size: 9, life: 1.8, fill: 'gold' }); });
    s.at(2.6, () => { V.scriptPose = PS.down(V); V.snapPose = true; spurting = false; api.sfx('thud'); FX.blood(V.x, F - 6, 24, 0, 1); });
    s.at(3.4, () => { api.sfx('squish'); FX.blood(heart.x, heart.y, 12, 0, 0.8); });
    s.at(4.6, () => { heart.draw = () => {}; });
    s.at(4.8, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 30 * k, dt, api, 110); return; }
      if (t < 1.7) { A.scriptPose = P({ hy: 6, lean: 0.35, head: 0.1, aF: [t > 1.2 ? 1.65 : 1.0, t > 1.2 ? 0.05 : 1.4], aB: [0.6, 1.6], fF: [15, 0], fB: [-15, 0] }); V.scriptPose = PS.dizzy(V.t); if (t > 1.3) V.ro.dx = rnd(-2, 2); return; }
      if (spurting) { const c = J(V, 'chest'); FX.spurt(c[0], c[1], A.face * -0.2, 1.2); V.scriptPose = PS.dizzy(V.t * 0.3); }
      A.scriptPose = P({ hy: 3, lean: -0.15, head: -0.2, aF: [2.85, 0.15], aB: [0.5, 1.9], fF: [12, 0], fB: [-12, 0], jaw: 0.2 });
      const h = J(A, 'handFx'); heart.x = h[0]; heart.y = h[1] - 4;
      if (t > 3.4) { heart.y += 2; }
      if (Math.random() < 0.3) FX.blood(heart.x, heart.y + 4, 1, 0, 0.2);
    };
  };

  // ---------- JOHN F. KENNEDY: We Choose the Moon ----------
  // Strapped to a rocket. Cut to the Moon. The flag goes in what's left.
  const rocket = (g, x, y, s = 1, fire = 0, t = 0) => {
    g.save(); g.translate(x, y); g.scale(s, s);
    if (fire > 0) { for (let i = 0; i < 6; i++) { g.fillStyle = `rgba(255,${140 + i * 18},40,${0.75 - i * 0.1})`; g.beginPath(); g.ellipse(0, 10 + i * 9 * fire, 8 - i * 0.6 + Math.sin(t * 50 + i) * 1.4, 10 * fire, 0, 0, PI * 2); g.fill(); } }
    g.fillStyle = '#2a2a2e'; g.beginPath(); g.moveTo(-10, 6); g.lineTo(10, 6); g.lineTo(7, 0); g.lineTo(-7, 0); g.fill();
    for (const sd of [-1, 1]) { g.fillStyle = '#9a1a1a'; g.beginPath(); g.moveTo(sd * 8, -2); g.lineTo(sd * 15, 8); g.lineTo(sd * 8, 8); g.fill(); }
    const gr = g.createLinearGradient(-8, 0, 8, 0); gr.addColorStop(0, '#9a9a9e'); gr.addColorStop(0.45, '#f4f4f2'); gr.addColorStop(1, '#8a8a8e'); g.fillStyle = gr; g.fillRect(-8, -120, 16, 120);
    g.fillStyle = '#1a1a1e'; for (const y of [-30, -62, -92]) g.fillRect(-8, y, 16, 3);
    g.fillStyle = '#e8e8e4'; g.beginPath(); g.moveTo(-8, -120); g.quadraticCurveTo(0, -150, 8, -120); g.fill(); R.line(g, 0, -146, 0, -160, '#c8c8c8', 1.2);
    g.fillStyle = '#1a2a5a'; g.font = '6px Anton, Impact, sans-serif'; g.save(); g.translate(2, -60); g.rotate(-PI / 2); g.textAlign = 'center'; g.fillText('USA', 0, 0); g.restore();
    g.restore();
  };
  S.jfk_moon = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let rx = 0, ry = F, fire = 0, up = false, vy = 0, crash = -1;
    const stars = Array.from({ length: 90 }, () => [Math.random(), Math.random() * 0.7, Math.random()]);
    s.at(0.6, () => api.bubble('WE CHOOSE TO GO TO THE MOON.', A.x, F - 165, { size: 11, life: 1.5, fill: 'white' }));
    s.at(1.0, () => { rx = V.x + A.face * 18; prop({ layer: 'back', draw(g) { if (!up || ry > -200) rocket(g, rx, ry, 1, fire, s.t); } }); prop({ layer: 'front', draw(g) { if (ry < -200 || rx === 0) return; for (const rel of [0.3, 0.62]) { const y = V.y - api.hurtH(V) * rel; R.line(g, rx - A.face * 26, y, rx, y - 2, '#6a5a3a', 2); } } }); api.sfx('clang'); });
    s.at(1.9, () => { fire = 0.4; api.sfx('fire'); api.sfx('hiss'); });
    s.at(2.4, () => { api.bubble('NOT BECAUSE IT IS EASY...', A.x, F - 160, { size: 10, life: 1.2, fill: 'gold' }); });
    s.at(2.6, () => { up = true; fire = 1; api.sfx('big'); api.sfx('horn'); api.shake(10); });
    s.at(3.6, () => {
      FX.reset();
      api.scene((g, W, H) => {
        const t = s.t;
        g.fillStyle = '#020206'; g.fillRect(0, 0, W, H);
        for (const [x, y, b] of stars) { g.fillStyle = `rgba(255,255,255,${0.4 + b * 0.6})`; g.fillRect(x * W, y * H, 1.2, 1.2); }
        // Earth hanging in the black
        const ex = W * 0.82, ey = H * 0.2; g.fillStyle = '#2a5aa8'; g.beginPath(); g.arc(ex, ey, 20, 0, PI * 2); g.fill(); g.fillStyle = '#3a8a3a'; g.beginPath(); g.ellipse(ex - 5, ey - 3, 7, 9, 0.4, 0, PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.ellipse(ex + 6, ey + 6, 8, 3, -0.3, 0, PI * 2); g.fill(); g.fillStyle = 'rgba(0,0,0,0.55)'; g.beginPath(); g.arc(ex + 8, ey, 20, -PI / 2, PI / 2); g.fill();
        // the Moon's surface
        const sy = H * 0.72; g.fillStyle = '#8a8a8e'; g.beginPath(); g.moveTo(0, sy); for (let x = 0; x <= W; x += 20) g.lineTo(x, sy + Math.sin(x * 0.03) * 4); g.lineTo(W, H); g.lineTo(0, H); g.fill();
        g.fillStyle = '#6a6a6e'; for (const [cx, w] of [[0.15, 30], [0.4, 18], [0.75, 40], [0.9, 14]]) { g.beginPath(); g.ellipse(cx * W, sy + 26, w, w * 0.22, 0, 0, PI * 2); g.fill(); }
        const ix = W * 0.5, iy = sy + 6, ct = 4.6;
        if (t < ct) { const u = (t - 3.6) / (ct - 3.6), x = lerp(W * 0.1, ix, u), y = lerp(-80, iy, u); g.save(); g.translate(x, y); g.rotate(PI * 0.75); rocket(g, 0, 0, 0.5, 1, t); g.restore(); }
        else {
          const u = t - ct;
          g.fillStyle = '#4a4a4e'; g.beginPath(); g.ellipse(ix, iy + 4, 46, 9, 0, 0, PI * 2); g.fill();
          if (u < 0.9) { for (let i = 0; i < 3; i++) { g.fillStyle = `rgba(255,${200 - i * 60},${80 - i * 30},${(1 - u / 0.9) * (0.9 - i * 0.2)})`; g.beginPath(); g.arc(ix, iy, 20 + u * 90 * (1 + i * 0.4), 0, PI * 2); g.fill(); } }
          // bones and a bit of red in the crater
          g.fillStyle = '#e8e0d0'; for (const [dx, dy, r] of [[-18, 2, 0.3], [12, 3, -0.4], [-4, 6, 1.2], [22, 1, 0.8]]) { g.save(); g.translate(ix + dx, iy + dy); g.rotate(r); g.fillRect(-5, -1, 10, 2); R.ball(g, -5, 0, 1.6, '#e8e0d0'); R.ball(g, 5, 0, 1.6, '#e8e0d0'); g.restore(); }
          g.fillStyle = 'rgba(120,0,10,0.8)'; g.beginPath(); g.ellipse(ix + 4, iy + 5, 18, 3, 0, 0, PI * 2); g.fill();
          R.skull(g, ix + 2, iy - 2, 6, 0.4, V.def.skull);
          if (u > 1.0) {
            const fu = Math.min(1, (u - 1.0) / 0.4), top = iy - 70 * fu;
            g.fillStyle = '#c8c8cc'; g.fillRect(ix - 8, top, 1.6, iy - top);
            if (fu >= 1) { for (let i = 0; i < 7; i++) { g.fillStyle = i % 2 ? '#f0eee8' : '#9a1420'; g.fillRect(ix - 6.4, top + 2 + i * 3, 30, 3); } g.fillStyle = '#1e2a5a'; g.fillRect(ix - 6.4, top + 2, 13, 12); g.fillStyle = '#f0eee8'; for (let i = 0; i < 9; i++) g.fillRect(ix - 5 + (i % 3) * 4, top + 4 + ((i / 3) | 0) * 3.6, 0.9, 0.9); R.line(g, ix - 8, top + 2, ix + 24, top + 2, '#c8c8cc', 1); }
          }
        }
        FX.drawParts(g);
      });
    });
    s.at(4.6, () => { api.sfx('big'); api.sfx('crunch'); api.shake(14); api.flash(); });
    s.at(5.7, () => api.sfx('clang'));
        s.at(7.2, () => { api.scene(null); FX.reset(); V.hidden = true; A.scriptPose = PS.win(A.t); api.bubble('...BUT BECAUSE IT IS HARD.', A.x, F - 165, { size: 11, life: 1.6, fill: 'gold' }); });
    s.at(8.6, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 70 * k, dt, api, 120); return; }
      A.scriptPose = t < 2.6 ? PS.stance(A.t) : P({ hy: 3, lean: -0.2, head: -0.5, aF: [2.6, 0.4], aB: [0.4, 0.3], fF: [12, 0], fB: [-12, 0] });
      V.scriptPose = t < 1.0 ? PS.dizzy(V.t) : P({ hy: 0, lean: 0, head: 0.2 + Math.sin(t * 20) * 0.1, aF: [0.1, 0.1], aB: [0.05, 0.1], fF: [3, 0], fB: [-3, 0] });
      if (rx) V.x = rx - A.face * 16;
      if (fire && Math.random() < 0.7) FX.puff(rx + rnd(-14, 14), Math.min(F, ry + 8), 'rgba(220,220,225,0.6)', 1, 4);
      if (up && t < 3.6) { vy -= 900 * dt; ry += vy * dt; V.y = ry; V.ro.noShadow = true; api.shake(4); FX.fire(rx + rnd(-5, 5), ry + 10, 2, 1.2); }
    };
  };

  // ---------- JOHN F. KENNEDY: Bay of Pigs ----------
  // A drove of pigs storms the beach and devours the loser. "Well, that one worked."
  const pig = (g, x, y, dir, ph, bloody) => {
    g.save(); g.translate(x, y); g.scale(dir, 1);
    const leg = Math.sin(ph) * 3;
    g.strokeStyle = '#c87878'; g.lineWidth = 2.4; for (const [lx, o] of [[-8, leg], [-4, -leg], [5, leg], [9, -leg]]) { g.beginPath(); g.moveTo(lx, -6); g.lineTo(lx + o, 0); g.stroke(); }
    g.fillStyle = '#e8a0a0'; g.beginPath(); g.ellipse(0, -11, 14, 7.5, 0, 0, PI * 2); g.fill(); g.fillStyle = 'rgba(255,230,230,0.4)'; g.beginPath(); g.ellipse(-1, -15, 10, 2.4, 0, 0, PI * 2); g.fill();
    g.fillStyle = '#e8a0a0'; g.beginPath(); g.ellipse(14, -12, 6.5, 5.5, 0, 0, PI * 2); g.fill();
    g.fillStyle = '#d88a8a'; g.beginPath(); g.ellipse(20, -11, 2.4, 3, 0, 0, PI * 2); g.fill(); g.fillStyle = '#7a3a3a'; g.fillRect(20, -12.4, 0.9, 1.2); g.fillRect(20, -10.2, 0.9, 1.2);
    g.fillStyle = '#d88a8a'; g.beginPath(); g.moveTo(11, -16); g.lineTo(12.5, -22); g.lineTo(15, -16.6); g.fill();
    g.fillStyle = '#1a0a0a'; g.fillRect(16, -14.4, 1.2, 1.2);
    g.strokeStyle = '#d88a8a'; g.lineWidth = 1; g.beginPath(); g.arc(-15, -13, 2, 0, PI * 1.6); g.stroke();
    if (bloody) { g.fillStyle = 'rgba(140,0,14,0.85)'; g.beginPath(); g.ellipse(19, -9.6, 3.6, 2.4, 0, 0, PI * 2); g.fill(); g.fillRect(17, -8, 1, 3); }
    g.restore();
  };
  S.jfk_pigs = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let pigs = [];
    s.at(0.6, () => { api.bubble('OPERATION ZAPATA. GO.', A.x, F - 160, { size: 11, life: 1.3, fill: 'white' }); });
    s.at(1.0, () => {
      const L = api.cam - 30, Rr = api.cam + api.W + 30;
      pigs = Array.from({ length: 7 }, (_, i) => { const fromL = i % 2 === 0; return { x: fromL ? L - i * 22 : Rr + i * 22, y: F, dir: fromL ? 1 : -1, ph: rnd(0, 6), tx: V.x + (fromL ? -1 : 1) * rnd(10, 34), st: 'run', bloody: false, off: rnd(-3, 3) }; });
      prop({ layer: 'front', draw(g) { for (const p of pigs) pig(g, p.x, p.y + p.off, p.dir, p.ph, p.bloody); } });
      for (let i = 0; i < 4; i++) setTimeout(() => api.sfx('honk'), i * 120);
    });
    s.at(1.9, () => { V.scriptPose = PS.down(V); V.snapPose = true; api.sfx('thud'); api.sfx('scream'); });
    s.at(3.6, () => { V.ro.skeleton = true; V.ro.gore = true; api.sfx('crunch'); FX.burst(V.x, F - 10, 8, ['guts', 'chunk', 'bone'], 0.8); for (const p of pigs) { p.st = 'leave'; p.dir = p.x < V.x ? -1 : 1; } });
    s.at(4.4, () => api.bubble('WELL, THAT ONE WORKED.', A.x, F - 160, { size: 12, life: 2.0, fill: 'gold' }));
    s.at(6.4, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 80 * k, dt, api, 120); return; }
      A.scriptPose = t < 4.4 ? P({ hy: 4, lean: 0, head: 0.1, aF: [0.6, 1.9], aB: [0.6, 1.9], fF: [12, 0], fB: [-12, 0] }) : P({ hy: 3, lean: -0.1, head: -0.2, aF: [1.3, 0.2], aB: [0.3, 0.2], fF: [12, 0], fB: [-12, 0], jaw: 0.2 });
      if (t < 1.9) { V.scriptPose = PS.dizzy(V.t); V.ro.dx = t > 1.5 ? rnd(-2, 2) : 0; }
      for (const p of pigs) {
        if (p.st === 'run') { const dx = p.tx - p.x; p.x += Math.sign(dx) * Math.min(Math.abs(dx), 300 * dt); p.ph += dt * 26; if (Math.abs(dx) < 2) p.st = 'eat'; }
        else if (p.st === 'eat') { p.y = F + Math.sin(t * 30 + p.off) * 1.5; p.ph += dt * 4; p.bloody = true; p.dir = p.x < V.x ? 1 : -1; if (Math.random() < 0.15) { FX.blood(p.x + p.dir * 18, F - 8, 3, p.dir, 0.6); api.sfx('gnaw'); } if (Math.random() < 0.03) FX.gib(pick(['chunk', 'bone', 'guts']), p.x + p.dir * 18, F - 10, rnd(-120, 120), rnd(-260, -100)); }
        else { p.x += p.dir * 340 * dt; p.ph += dt * 26; p.y = F; }
      }
    };
  };

  // ---------- LYNDON B. JOHNSON: All the Way ----------
  // One punch goes in the front and out the back, and comes back holding the spine.
  const spine = (g, x, y, a, n, k) => {
    g.save(); g.translate(x, y); g.rotate(a);
    for (let i = 0; i < n; i++) { const yy = i * 4.2 * k; g.fillStyle = '#e8e0cc'; g.fillRect(-2.6 * k, yy, 5.2 * k, 3.2 * k); g.fillStyle = '#c8bca4'; g.fillRect(2.4 * k, yy + 0.6 * k, 2.4 * k, 1.6 * k); g.fillStyle = 'rgba(150,0,16,0.7)'; g.fillRect(-2.6 * k, yy + 3.2 * k, 5.2 * k, 1 * k); }
    g.fillStyle = '#8a0010'; g.beginPath(); g.ellipse(0, n * 4.2 * k, 3.4 * k, 2.4 * k, 0, 0, PI * 2); g.fill();
    g.restore();
  };
  S.lbj = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let stage = 0, out = null;
    s.at(0.6, () => api.bubble("I'M GOING ALL THE WAY.", A.x, F - 175, { size: 11, life: 1.2, fill: 'white' }));
    s.at(1.3, () => { stage = 1; api.sfx('punch'); api.sfx('crunch'); api.sfx('splat'); api.shake(10); api.flash(); const c = J(V, 'chest'); FX.burst(c[0] + A.face * 14, c[1], 8, ['chunk', 'bone', 'guts'], 1); FX.drops(2); });
    s.at(2.4, () => { stage = 2; api.sfx('crunch'); api.sfx('splat'); api.shake(8); const c = J(V, 'chest'); FX.burst(c[0], c[1], 8, ['chunk', 'guts'], 1); out = { t: 0 }; });
    s.at(2.8, () => { V.scriptPose = PS.down(V); V.snapPose = true; api.sfx('thud'); FX.blood(V.x, F - 6, 30, 0, 1); });
    s.at(3.2, () => api.bubble('ALL THE WAY WITH LBJ.', A.x, F - 175, { size: 12, life: 1.8, fill: 'gold' }));
    // he tosses the spine over his shoulder; it lands on the floor and stays there
    s.at(4.3, () => { const h = J(A, 'handFx'); out = { x: h[0], y: h[1] - 4, vx: -A.face * 110, vy: -240, rot: A.face * 0.15 + PI, landed: false }; stage = 3; api.sfx('whoosh'); });
    s.at(5.0, () => { s.done = true; });
    prop({ layer: 'front', draw(g) {
      const vk = V.d.k;
      if (stage === 1) {
        // the fist out the back, spine bent around it
        const c = J(V, 'chest'), bx = c[0] + A.face * 18 * vk, by = c[1] + 2;
        g.fillStyle = '#8a0010'; g.beginPath(); g.ellipse(bx, by, 5 * vk, 6 * vk, 0, 0, PI * 2); g.fill();
        spine(g, bx + A.face * 4, by - 12 * vk, A.face * 0.4, 6, vk * 0.9);
        RIG.ball(g, bx + A.face * 6, by, 4.4 * k, A.def.col.hand);
      }
      if (stage === 2) { const h = J(A, 'handFx'); spine(g, h[0], h[1] - 4, A.face * 0.15 + PI, 9, vk); }
      if (stage === 3 && out) spine(g, out.x, out.y, out.rot, 9, vk);
    } });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 28 * k, dt, api, 110); return; }
      if (t < 1.3) { A.scriptPose = P({ hy: 6, lean: -0.15, head: -0.1, aF: [0.6, 2.2], aB: [0.8, 1.2], fF: [14, 0], fB: [-15, 0] }); V.scriptPose = PS.dizzy(V.t); return; }
      if (stage === 1) { A.scriptPose = P({ hy: 8, lean: 0.4, head: 0.15, aF: [1.6, 0.0], aB: [0.6, 1.4], fF: [18, 0], fB: [-16, 0] }); V.scriptPose = P({ hy: 6, lean: 0.5, head: 0.6, aF: [0.8, 0.4], aB: [0.6, 0.4], fF: [8, 0], fB: [-8, 0] }); V.ro.dx = rnd(-1, 1); if (Math.random() < 0.6) { const c = J(V, 'chest'); FX.blood(c[0] + A.face * 20, c[1], 2, A.face, 0.6); } return; }
      if (stage === 3) {
        out.vy += 900 * dt; out.x += out.vx * dt; out.y += out.vy * dt;
        if (!out.landed) out.rot += -A.face * 9 * dt;
        if (out.y > F - 4) { out.y = F - 4; out.vx = 0; out.vy = 0; out.rot = -PI / 2; if (!out.landed) { out.landed = true; api.sfx('thud'); FX.blood(out.x, F - 3, 6, 0, 0.4); } }
        A.scriptPose = P({ hy: 3, lean: -0.1, head: -0.2, aF: [0.5, 0.3], aB: [0.5, 1.9], fF: [12, 0], fB: [-12, 0], jaw: 0.2 });
        return;
      }
      A.scriptPose = P({ hy: 3, lean: -0.15, head: -0.25, aF: [2.85, 0.15], aB: [0.5, 1.9], fF: [12, 0], fB: [-12, 0], jaw: 0.2 });
      if (t < 2.8) V.scriptPose = PS.dizzy(V.t * 0.3);
      if (Math.random() < 0.3) { const h = J(A, 'handFx'); FX.blood(h[0], h[1] - 4 + 36 * V.d.k, 1, 0, 0.2); }
    };
  };

  // ---------- RICHARD NIXON: I Am Not a Crook ----------
  // He sweeps the loser's organs into his briefcase, snaps it shut, and throws up the double V.
  S.nixon = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let open = 0, shut = false;
    const organs = [], BR = '#d8b048';
    const ORG = [['#8a0a14', 4, 3.4], ['#a83a3a', 3.4, 2.4], ['#6a2a1a', 5, 3], ['#c87a80', 5.4, 3.6], ['#d89a8a', 6, 2.4], ['#7a1a2a', 3, 2.6], ['#c86070', 4.4, 3]];
    const caseXY = () => { const h = J(A, 'handBx'); return [h[0] + A.face * 2, h[1] + 4]; };
    prop({ layer: 'front', draw(g) {
      const [x, y] = caseXY();
      // briefcase: brown leather, brass clasps, lid swings open
      g.fillStyle = '#4a2e18'; g.fillRect(x - 13, y, 26, 16); g.fillStyle = '#5a3a20'; g.fillRect(x - 13, y, 26, 2.4);
      g.fillStyle = BR; g.fillRect(x - 8, y + 1, 3, 2.4); g.fillRect(x + 5, y + 1, 3, 2.4);
      R.line(g, x - 4, y - 0.4, x - 4, y - 4, '#2a1a0a', 1.4); R.line(g, x + 4, y - 0.4, x + 4, y - 4, '#2a1a0a', 1.4); R.line(g, x - 4, y - 4, x + 4, y - 4, '#2a1a0a', 1.4);
      if (open > 0 && !shut) { g.save(); g.translate(x - 13, y); g.rotate(-open * 1.6); g.fillStyle = '#5a3a20'; g.fillRect(0, -3, 26, 3); g.restore(); g.fillStyle = '#2a1408'; g.fillRect(x - 12, y - 0.6, 24, 2); }
      for (const o of organs) { if (o.in) continue; g.fillStyle = o.c; g.beginPath(); g.ellipse(o.x, o.y, o.w, o.h, o.r, 0, PI * 2); g.fill(); g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.ellipse(o.x - o.w * 0.3, o.y - o.h * 0.3, o.w * 0.3, o.h * 0.25, o.r, 0, PI * 2); g.fill(); }
    } });
    s.at(0.6, () => { api.bubble('LET ME MAKE ONE THING PERFECTLY CLEAR.', A.x, F - 170, { size: 9, life: 1.5, fill: 'white' }); });
    s.at(1.2, () => { open = 1; api.sfx('clang'); });
    ORG.forEach((o, i) => s.at(1.5 + i * 0.17, () => {
      const c = J(V, 'chest'); api.sfx('squish'); FX.blood(c[0], c[1] + rnd(-6, 12), 8, -A.face, 0.9);
      organs.push({ c: o[0], w: o[1] * V.d.k, h: o[2] * V.d.k, x: c[0], y: c[1] + rnd(-6, 14), x0: c[0], y0: c[1] + rnd(-6, 14), t0: s.t, r: rnd(-1, 1), in: false });
    }));
    s.at(2.9, () => { shut = true; api.sfx('clang'); api.sfx('thud'); });
    s.at(3.0, () => { V.scriptPose = PS.down(V); V.snapPose = true; api.sfx('thud'); FX.blood(V.x, F - 6, 26, 0, 1); });
    s.at(3.4, () => { api.bubble('I AM NOT A CROOK.', A.x, F - 175, { size: 14, life: 2, fill: 'gold' }); });
    s.at(5.4, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 34 * k, dt, api, 110); return; }
      if (t < 3.0) V.scriptPose = t < 1.5 ? PS.dizzy(V.t) : P({ hy: 6, lean: 0.35, head: 0.5, aF: [0.6, 0.4], aB: [0.4, 0.4], fF: [8, 0], fB: [-8, 0] });
      if (t < 2.9) {
        const swipe = Math.sin(t * 26);
        A.scriptPose = P({ hy: 6, lean: 0.3, head: 0.15, aF: [1.5 + swipe * 0.35, 0.2 + swipe * 0.3], aB: [0.7, 1.0], fF: [14, 0], fB: [-14, 0] });
        if (t > 1.5 && Math.random() < 0.4) { const c = J(V, 'chest'); FX.spurt(c[0], c[1], -A.face * 0.4, 1); }
      } else A.scriptPose = P({ hy: 3, lean: -0.1, head: -0.2, aF: [2.7, 0.1], aB: [2.6, 0.12], fF: [12, 0], fB: [-12, 0], jaw: 0.2 });
      const [cx, cy] = caseXY();
      for (const o of organs) { const u = ease((t - o.t0) / 0.4); o.x = lerp(o.x0, cx, u); o.y = lerp(o.y0, cy + 2, u) - Math.sin(u * PI) * 26; o.r += dt * 8; if (u >= 1) o.in = true; }
    };
  };

  // ---------- RONALD REAGAN: Tear Down This Wall ----------
  // "Mr. Gorbachev..." He tears the ribcage open like a wall coming down.
  S.reagan = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let ribs = 0, ribsOut = null;
    s.at(0.6, () => api.bubble('MR. GORBACHEV...', A.x, F - 170, { size: 12, life: 1.2, fill: 'white' }));
    s.at(1.3, () => { api.sfx('punch'); api.sfx('crunch'); api.shake(6); });
    s.at(1.9, () => { api.bubble('TEAR DOWN THIS WALL!', A.x, F - 175, { size: 14, life: 1.8, fill: 'gold' }); api.sfx('crunch'); api.sfx('splat'); api.sfx('scream'); api.shake(12); api.flash(); const c = J(V, 'chest'); FX.burst(c[0], c[1], 10, ['chunk', 'bone', 'guts', 'heart', 'lung'], 1.1); FX.drops(3); ribsOut = s.t; });
    s.at(3.2, () => { V.scriptPose = PS.down(V); V.snapPose = true; api.sfx('thud'); FX.blood(V.x, F - 6, 30, 0, 1); });
    s.at(5.0, () => { s.done = true; });
    prop({ layer: 'front', draw(g) {
      if (!ribsOut || V.snapPose && s.t > 3.25) return;
      const c = J(V, 'chest'), vk = V.d.k, u = Math.min(1, (s.t - ribsOut) / 0.35);
      // the open cavity
      g.fillStyle = '#5a0008'; g.beginPath(); g.ellipse(c[0] + A.face * -6 * vk, c[1] + 4, 9 * vk, 12 * vk, 0, 0, PI * 2); g.fill();
      g.fillStyle = '#8a0a14'; g.beginPath(); g.ellipse(c[0] + A.face * -6 * vk, c[1] + 2, 3.6 * vk * (1 + Math.max(0, Math.sin(s.t * 12)) * 0.2), 4 * vk, 0, 0, PI * 2); g.fill();
      // the two halves of the ribcage swung out like gates
      for (const sd of [-1, 1]) {
        g.save(); g.translate(c[0] - A.face * 6 * vk + sd * 8 * vk, c[1] - 6 * vk); g.rotate(sd * u * 1.3);
        g.strokeStyle = '#ece4d0'; g.lineWidth = 1.6 * vk; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-sd * 7 * vk, i * 4 * vk, 7 * vk, sd > 0 ? -0.4 : PI - 0.8, sd > 0 ? 0.8 : PI + 0.4); g.stroke(); }
        g.strokeStyle = 'rgba(140,0,14,0.8)'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 18 * vk); g.stroke();
        g.restore();
      }
    } });
    s.tick = (t, dt) => {
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 28 * k, dt, api, 110); return; }
      if (t < 1.9) { A.scriptPose = P({ hy: 6, lean: 0.3, head: 0.1, aF: [1.6, 0.2], aB: [1.5, 0.3], fF: [15, 0], fB: [-15, 0] }); V.scriptPose = PS.dizzy(V.t); V.ro.dx = t > 1.3 ? rnd(-1.5, 1.5) : 0; return; }
      const u = Math.min(1, (t - 1.9) / 0.35);
      A.scriptPose = P({ hy: 8, lean: -0.1, head: -0.2, aF: [1.6 + u * 0.9, 0.2], aB: [1.5 + u * 0.8, 0.3], fF: [15, 0], fB: [-15, 0] });
      if (t < 3.2) { V.scriptPose = P({ hy: 6, lean: -0.3, head: -0.6, aF: [1.2 + Math.sin(t * 16) * 0.4, 0.4], aB: [1.0, 0.5], fF: [8, 0], fB: [-8, 0] }); V.ro.dx = rnd(-1, 1); if (Math.random() < 0.6) { const c = J(V, 'chest'); FX.spurt(c[0], c[1], rnd(-0.6, 0.6), 1.1); } }
      if (t > 3.6) A.scriptPose = PS.win(A.t);
    };
  };

  // ---------- JIMMY CARTER: Peanut Grinder ----------
  // Into the peanut mill. Out comes red peanut butter, spread on toast.
  S.carter = (s, A, V, api) => {
    const PS = api.PS, k = A.d.k, F = api.FLOOR;
    let mill = 0, mx = 0, crank = 0, inMill = false, paste = 0, toast = 0, jar = 0, bite = 0;
    const HT = 96;
    prop({ layer: 'front', draw(g) {
      if (mill <= 0) return;
      const y0 = F + (1 - mill) * 140;
      g.save(); g.beginPath(); g.rect(mx - 80, -400, 160, F + 400); g.clip();
      // legs, body of the mill, hopper, crank, spout
      g.fillStyle = '#3a2a18'; g.fillRect(mx - 22, y0 - 30, 5, 30); g.fillRect(mx + 17, y0 - 30, 5, 30);
      g.fillStyle = '#6a2a1a'; g.fillRect(mx - 24, y0 - 64, 48, 36); g.fillStyle = '#8a3a22'; g.fillRect(mx - 24, y0 - 64, 48, 4);
      g.fillStyle = '#e8d8a0'; g.fillRect(mx - 16, y0 - 54, 32, 14); g.fillStyle = '#6a2a1a'; g.font = '6px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('PLAINS', mx, y0 - 47.6); g.font = '4px Anton, Impact, sans-serif'; g.fillText('PEANUT CO.', mx, y0 - 42.4); g.textAlign = 'left';
      g.fillStyle = '#7a7e88'; g.beginPath(); g.moveTo(mx - 40, y0 - HT); g.lineTo(mx + 40, y0 - HT); g.lineTo(mx + 14, y0 - 64); g.lineTo(mx - 14, y0 - 64); g.closePath(); g.fill();
      g.fillStyle = '#9a9ea8'; g.fillRect(mx - 40, y0 - HT - 3, 80, 4); g.fillStyle = 'rgba(0,0,0,0.25)'; g.beginPath(); g.moveTo(mx + 10, y0 - HT); g.lineTo(mx + 40, y0 - HT); g.lineTo(mx + 14, y0 - 64); g.closePath(); g.fill();
      const cxk = mx - A.face * 26, cyk = y0 - 56, ca = crank;
      g.fillStyle = '#4a4e56'; g.beginPath(); g.arc(cxk, cyk, 3, 0, PI * 2); g.fill(); R.line(g, cxk, cyk, cxk + Math.cos(ca) * 12, cyk + Math.sin(ca) * 12, '#4a4e56', 2.2); R.line(g, cxk + Math.cos(ca) * 12, cyk + Math.sin(ca) * 12, cxk + Math.cos(ca) * 12 - A.face * 6, cyk + Math.sin(ca) * 12, '#8a6034', 2.6);
      const sx = mx - A.face * 24; g.fillStyle = '#4a4e56'; g.fillRect(sx - (A.face < 0 ? 0 : 10), y0 - 36, 10, 5);
      if (paste > 0) { g.fillStyle = '#8a1a14'; g.fillRect(sx - A.face * 6 - 2, y0 - 32, 4, 20); g.fillStyle = '#a82a1e'; g.fillRect(sx - A.face * 6 - 1, y0 - 32, 1.4, 20); }
      if (jar) { const jx = sx - A.face * 6; g.fillStyle = 'rgba(220,235,240,0.5)'; g.fillRect(jx - 7, F - 14, 14, 14); g.fillStyle = '#8a1a14'; g.fillRect(jx - 6, F - 1 - 12 * Math.min(1, jar), 12, 12 * Math.min(1, jar)); g.fillStyle = '#c8a040'; g.fillRect(jx - 7.5, F - 15, 15, 2.4); }
      g.restore();
    } });
    prop({ layer: 'front', draw(g) {
      if (!toast) return;
      const h = J(A, 'handFx'), x = h[0] + A.face * 2, y = h[1] - 6;
      g.fillStyle = '#c88a40'; g.beginPath(); g.moveTo(x - 7, y + 6); g.lineTo(x + 7, y + 6); g.lineTo(x + 7, y - 4); g.quadraticCurveTo(x + 7, y - 9, x, y - 8); g.quadraticCurveTo(x - 7, y - 9, x - 7, y - 4); g.closePath(); g.fill();
      g.fillStyle = '#e8b870'; g.fillRect(x - 5.6, y - 5, 11.2, 9.6);
      if (toast > 1) { g.fillStyle = '#8a1a14'; g.fillRect(x - 5, y - 4.4, 10 * Math.min(1, toast - 1), 8.4); }
      if (bite) { g.fillStyle = '#1a1014'; g.beginPath(); g.arc(x + A.face * 6, y - 6, 3.6, 0, PI * 2); g.fill(); }
    } });
    s.at(0.6, () => api.bubble('PLAINS, GEORGIA. FINEST PEANUTS IN THE WORLD.', A.x, F - 170, { size: 9, life: 1.5, fill: 'white' }));
    s.at(0.9, () => { mx = V.x + A.face * 50; api.sfx('creak'); api.shake(4); });
    s.at(1.8, () => { api.sfx('whoosh'); });
    s.at(2.3, () => { inMill = true; V.hidden = true; api.sfx('crunch'); api.sfx('scream'); api.shake(6); FX.blood(mx, F - HT, 20, 0, 1.2); });
    for (let i = 0; i < 6; i++) s.at(2.5 + i * 0.22, () => { api.sfx('crunch'); api.shake(3); if (Math.random() < 0.5) FX.gib(pick(['bone', 'tooth', 'chunk']), mx, F - HT, rnd(-80, 80), rnd(-200, -80)); });
    s.at(2.8, () => { paste = 1; jar = 0.01; api.sfx('slurp'); });
    s.at(4.0, () => { paste = 0; });
    s.at(4.2, () => { toast = 1; api.sfx('blip'); });
    s.at(4.6, () => api.sfx('squish'));
    s.at(5.3, () => { bite = 1; api.sfx('chomp'); });
    s.at(5.5, () => api.bubble('MMM. CRUNCHY.', A.x, F - 170, { size: 13, life: 1.8, fill: 'gold' }));
    s.at(6.9, () => { toast = 0; mill = -1; });
    s.at(7.0, () => { s.done = true; });
    s.tick = (t, dt) => {
      if (mill < 0) return;
      mill = t < 0.9 ? 0 : ease((t - 0.9) / 0.7);
      if (jar && paste) jar = Math.min(1, jar + dt * 0.8);
      if (t < 0.6) { V.scriptPose = PS.dizzy(V.t); walkTo(A, V.x - A.face * 30 * k, dt, api, 110); return; }
      if (t < 1.8) { V.scriptPose = PS.dizzy(V.t); A.scriptPose = P({ hy: 8, lean: 0.4, head: 0.1, aF: [1.6, 0.4], aB: [1.5, 0.5], fF: [14, 0], fB: [-15, 0] }); return; }
      if (!inMill) {
        // up over his head and into the hopper
        const u = ease((t - 1.8) / 0.5);
        V.x = lerp(A.x + A.face * 20, mx, u); V.y = F - Math.sin(u * PI * 0.5) * (HT + 10) + u * u * 30; V.ro.noShadow = true;
        V.scriptPose = P({ rot: A.face * -0.9 * u, hyA: 0, aF: [2.6, 0.4], aB: [2.4, 0.5], lF: [0.3, 0.3], lB: [-0.2, 0.4], head: 0.4 });
        A.scriptPose = P({ hy: 4, lean: -0.1, head: -0.3, aF: [2.8, 0.2], aB: [2.7, 0.3], fF: [14, 0], fB: [-14, 0] });
        return;
      }
      if (t < 4.2) {
        // walk to the crank and turn it
        walkTo(A, mx - A.face * 56, dt, api, 120);
        if (Math.abs(A.x - (mx - A.face * 56)) < 2) { crank += dt * 9; A.scriptPose = P({ hy: 6, lean: 0.2, head: 0.1, aF: [1.7 + Math.sin(crank) * 0.35, 0.2 + Math.cos(crank) * 0.25], aB: [0.6, 1.2], fF: [13, 0], fB: [-13, 0] }); }
        else crank += dt * 3;
        return;
      }
      if (t < 5.2) { toast = t > 4.6 ? 1 + (t - 4.6) / 0.5 : 1; A.scriptPose = P({ hy: 4, lean: 0, head: 0.2, aF: [1.6, 1.0], aB: [1.4, 1.2], fF: [12, 0], fB: [-12, 0] }); return; }
      A.scriptPose = P({ hy: 3, lean: -0.05, head: 0, aF: [2.0, 1.6], aB: [0.3, 0.2], fF: [12, 0], fB: [-12, 0], jaw: 0.3 });
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
