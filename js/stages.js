// POTUS Kombat: arenas, painted in the dark early-90s Mortal Kombat style (night, storms, hard light),
// then dithered like a digitized backdrop.
'use strict';
(() => {
  const { R, PI, H, AWX, BW, CX, FY, rand, rr, shade, setSeed, vg, hgf, glow, shadowRect, speckle, grime, wall, bricks, stones, win, stars, clouds, fog, vignette, pfloor, treeline, tree, moon, lamp } = STAGES.kit;

  // ---------- painting helpers for this game ----------
  // gilt picture frame with a dark old portrait inside (generic figures, not copies of real paintings)
  function portrait(g, x, y, w, h, seed, wig) {
    g.fillStyle = '#6a4a14'; g.fillRect(x - 4, y - 4, w + 8, h + 8);
    hgf(g, x - 4, y - 4, w + 8, 4, ['#8a6420', '#e8c060', '#8a6420']); hgf(g, x - 4, y + h, w + 8, 4, ['#5a3a0a', '#b88a30', '#5a3a0a']);
    g.fillStyle = '#b8903a'; g.fillRect(x - 4, y, 3, h); g.fillRect(x + w + 1, y, 3, h);
    vg(g, x, y, w, h, ['#2a2418', '#1a1610', '#0e0c08']);
    // sitter: shoulders, coat, head, hair
    setSeed(seed);
    const cx = x + w / 2, hy = y + h * 0.38;
    g.fillStyle = rand() < 0.5 ? '#1a1a22' : '#22180e'; g.beginPath(); g.ellipse(cx, y + h, w * 0.46, h * 0.42, 0, PI, 0); g.fill();
    g.fillStyle = '#d8d0c0'; g.beginPath(); g.moveTo(cx - 4, y + h * 0.62); g.lineTo(cx + 4, y + h * 0.62); g.lineTo(cx, y + h * 0.78); g.fill();
    g.fillStyle = '#a07a5a'; g.beginPath(); g.ellipse(cx, hy, w * 0.17, h * 0.15, 0, 0, PI * 2); g.fill();
    g.fillStyle = wig ? '#c8c0b0' : '#2a2018'; g.beginPath(); g.ellipse(cx, hy - h * 0.06, w * 0.2, h * 0.12, 0, PI, 0); g.fill();
    if (wig) { g.beginPath(); g.ellipse(cx - w * 0.17, hy + 2, 3, 4, 0, 0, PI * 2); g.ellipse(cx + w * 0.17, hy + 2, 3, 4, 0, 0, PI * 2); g.fill(); }
    g.fillStyle = 'rgba(20,12,6,0.5)'; g.fillRect(cx - w * 0.1, hy - 1, w * 0.07, 1.6); g.fillRect(cx + w * 0.04, hy - 1, w * 0.07, 1.6);
    speckle(g, x, y, w, h, w * h / 4, 0.3, 0.08);
    g.fillStyle = 'rgba(255,220,150,0.08)'; g.fillRect(x, y, w, h * 0.3);
    return { x: cx, y: hy - 1, w };
  }
  // an American flag on a pole, drooping in folds
  function usFlag(g, x, top) {
    g.fillStyle = '#7a6a40'; g.fillRect(x - 1, top, 2, FY - top); R.ball(g, x, top - 2, 2.4, '#d8b040');
    const fw = 40, fh = 60;
    for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#e8e0d0' : '#9a1420'; g.beginPath(); g.moveTo(x + 1, top + 4 + i * fh / 13); g.quadraticCurveTo(x + fw * 0.6, top + 10 + i * fh / 13 + 8, x + 12, top + 4 + (i + 1) * fh / 13 + 14); g.lineTo(x + 1, top + 4 + (i + 1) * fh / 13); g.fill(); }
    g.fillStyle = '#1e2a5a'; g.beginPath(); g.moveTo(x + 1, top + 4); g.quadraticCurveTo(x + 18, top + 10, x + 14, top + 34); g.lineTo(x + 1, top + 30); g.fill();
    g.fillStyle = '#f0eee8'; for (let i = 0; i < 12; i++) g.fillRect(x + 3 + (i % 3) * 4, top + 8 + ((i / 3) | 0) * 5, 0.9, 0.9);
    shadowRect(g, x + 1, top + 4, 20, fh + 10, 0.35);
  }
  function blueFlag(g, x, top) {
    g.fillStyle = '#7a6a40'; g.fillRect(x - 1, top, 2, FY - top); R.ball(g, x, top - 2, 2.4, '#d8b040');
    g.fillStyle = '#1a2a6a'; g.beginPath(); g.moveTo(x - 1, top + 4); g.quadraticCurveTo(x - 30, top + 18, x - 24, top + 66); g.lineTo(x - 1, top + 60); g.fill();
    g.fillStyle = '#e8d090'; g.beginPath(); g.arc(x - 12, top + 30, 6, 0, PI * 2); g.fill(); g.fillStyle = '#1a2a6a'; g.beginPath(); g.arc(x - 12, top + 30, 3.6, 0, PI * 2); g.fill();
    g.fillStyle = '#e8d090'; for (let i = 0; i < 8; i++) R.line(g, x - 2, top + 62 - i, x - 1 - i * 3, top + 68 - i * 0.4, '#d8b040', 0.8);
  }
  function drape(g, x, y, w, h, c) {
    for (let i = 0; i < 6; i++) { const xx = x + i * w / 6; hgf(g, xx, y, w / 6 + 0.5, h, [shade(c, -0.45), c, shade(c, 0.2), shade(c, -0.3)]); }
    g.fillStyle = shade(c, -0.2); g.beginPath(); g.moveTo(x - 2, y); g.quadraticCurveTo(x + w / 2, y + 16, x + w + 2, y); g.lineTo(x + w + 2, y + 6); g.quadraticCurveTo(x + w / 2, y + 22, x - 2, y + 6); g.fill();
    R.line(g, x + w * 0.2, y + h * 0.55, x + w * 0.8, y + h * 0.58, '#e8c060', 1.4);
  }

  // =====================================================================================
  // THE OVAL OFFICE at midnight, in a thunderstorm
  // =====================================================================================
  const OVAL = { windows: [CX - 76, CX, CX + 76], portraits: [] };
  function oval(B, F) {
    setSeed(17);
    vg(B, 0, 0, BW, H, ['#0a0806', '#1c160e', '#2a2216', '#140e08']);
    // curved cream walls under a heavy cornice, lit from low lamps
    for (let x = 0; x < BW; x += 2) { const u = (x - CX) / (BW / 2), curve = 1 - u * u * 0.35; B.fillStyle = shade('#a8987a', -0.45 + curve * 0.4 - Math.abs(u) * 0.2); B.fillRect(x, 26, 2, FY - 26); }
    grime(B, 0, 26, BW, FY - 26, 60, 0.12);
    hgf(B, 0, 14, BW, 14, ['#3a2e1c', '#8a7454', '#3a2e1c']); B.fillStyle = '#e8d8a8'; B.fillRect(0, 24, BW, 1.4); B.fillStyle = 'rgba(0,0,0,0.5)'; B.fillRect(0, 28, BW, 4);
    for (let i = 0; i < 40; i++) { B.fillStyle = 'rgba(255,240,200,0.12)'; B.fillRect(i * 32 + 6, 18, 18, 4); }
    // pilasters
    for (const x of [CX - 520, CX - 400, CX - 250, CX - 140, CX + 140, CX + 250, CX + 400, CX + 520]) { hgf(B, x - 8, 32, 16, FY - 32, ['rgba(0,0,0,0.35)', 'rgba(255,240,210,0.14)', 'rgba(0,0,0,0.4)']); B.fillStyle = 'rgba(232,216,168,0.3)'; B.fillRect(x - 10, 32, 20, 4); }
    // dark wood wainscot
    vg(B, 0, FY - 46, BW, 46, ['#3a2414', '#2a180c', '#1a0e06']);
    for (let x = 10; x < BW; x += 54) { B.strokeStyle = 'rgba(255,200,140,0.12)'; B.lineWidth = 1; B.strokeRect(x, FY - 40, 44, 30); B.strokeStyle = 'rgba(0,0,0,0.5)'; B.strokeRect(x + 1, FY - 39, 44, 30); }
    B.fillStyle = '#5a3a1e'; B.fillRect(0, FY - 48, BW, 3);
    // three tall windows behind the desk, storm outside, gold drapes
    for (const x of OVAL.windows) {
      const wy = 44, ww = 46, wh = FY - 62 - wy;
      vg(B, x - ww / 2, wy, ww, wh, ['#0c1426', '#1a2a48', '#2a3a5a']);
      B.fillStyle = 'rgba(160,180,220,0.18)'; for (let i = 0; i < 40; i++) B.fillRect(x - ww / 2 + rr(0, ww), wy + rr(0, wh), 0.6, rr(4, 10));
      B.fillStyle = '#e8e0c8'; for (let i = 1; i < 3; i++) B.fillRect(x - ww / 2 + i * ww / 3 - 0.6, wy, 1.2, wh); for (let j = 1; j < 6; j++) B.fillRect(x - ww / 2, wy + j * wh / 6, ww, 1.2);
      B.strokeStyle = '#efe6cc'; B.lineWidth = 2.5; B.strokeRect(x - ww / 2, wy, ww, wh);
      drape(B, x - ww / 2 - 16, wy - 8, 16, wh + 30, '#a87e22'); drape(B, x + ww / 2, wy - 8, 16, wh + 30, '#a87e22');
    }
    // portraits whose eyes follow you (see live)
    OVAL.portraits = [[CX - 330, 60, 1, 1], [CX + 300, 60, 2, 0], [CX - 470, 66, 3, 1], [CX + 450, 66, 4, 0], [CX - 600, 72, 5, 0]].map(([x, y, s, wig]) => portrait(B, x, y, 40, 54, s, wig));
    // flags beside the desk
    usFlag(B, CX - 128, FY - 120); blueFlag(B, CX + 128, FY - 120);
    // the Resolute desk: dark carved oak, the seal on the kneehole panel
    const dx = CX, dw = 120, dh = 44, dy = FY - dh;
    vg(B, dx - dw / 2, dy, dw, dh, ['#5a3418', '#3a200c', '#22120a']);
    B.fillStyle = '#6a4020'; B.fillRect(dx - dw / 2 - 4, dy - 4, dw + 8, 5);
    for (const sx of [-1, 1]) { B.strokeStyle = 'rgba(255,190,120,0.2)'; B.lineWidth = 1; B.strokeRect(dx + sx * 38 - 14, dy + 8, 28, 30); B.strokeRect(dx + sx * 38 - 10, dy + 12, 20, 22); }
    B.fillStyle = '#2a160a'; B.fillRect(dx - 16, dy + 6, 32, 38);
    B.fillStyle = '#c8a050'; B.beginPath(); B.arc(dx, dy + 20, 9, 0, PI * 2); B.fill(); B.fillStyle = '#3a2a14'; B.beginPath(); B.arc(dx, dy + 20, 6.5, 0, PI * 2); B.fill(); B.fillStyle = '#c8a050'; B.fillRect(dx - 3, dy + 17, 6, 6);
    // desk lamps and phone
    for (const sx of [-44, 44]) { B.fillStyle = '#c8a040'; B.fillRect(dx + sx - 1, dy - 18, 2, 14); B.fillStyle = '#1a4a2a'; B.beginPath(); B.moveTo(dx + sx - 9, dy - 18); B.lineTo(dx + sx + 9, dy - 18); B.lineTo(dx + sx + 6, dy - 24); B.lineTo(dx + sx - 6, dy - 24); B.fill(); glow(B, dx + sx, dy - 12, 34, 'rgba(255,210,130,0.55)'); }
    B.fillStyle = '#141414'; B.fillRect(dx + 14, dy - 7, 12, 4);
    glow(B, CX, FY - 20, 260, 'rgba(255,190,110,0.12)');
    fog(B, FY - 40, 60, 'rgba(40,30,20,0.25)');
    vignette(B, BW);
    // floor: deep blue carpet with the oval rug and its gold border
    pfloor(F, 'stone', '#1c2440', '#0a0e1c', { rows: 8, span: 60, edge: '#3a2a16' });
    const cx = AWX / 2, cy = FY + 26;
    F.fillStyle = 'rgba(20,34,80,0.55)'; F.beginPath(); F.ellipse(cx, cy, 430, 30, 0, 0, PI * 2); F.fill();
    F.strokeStyle = '#b8903a'; F.lineWidth = 3; F.beginPath(); F.ellipse(cx, cy, 430, 30, 0, 0, PI * 2); F.stroke();
    F.strokeStyle = 'rgba(232,192,96,0.4)'; F.lineWidth = 1; F.beginPath(); F.ellipse(cx, cy, 410, 26, 0, 0, PI * 2); F.stroke();
    F.fillStyle = 'rgba(210,180,100,0.35)'; F.beginPath(); F.ellipse(cx, cy, 70, 7, 0, 0, PI * 2); F.fill();
    F.fillStyle = 'rgba(40,30,20,0.4)'; F.beginPath(); F.ellipse(cx, cy, 52, 5, 0, 0, PI * 2); F.fill();
    speckle(F, 0, FY, AWX, H - FY, 1200, 0.25, 0.06);
  }

  // =====================================================================================
  // shared bits for the new arenas
  // =====================================================================================
  const SKINS = ['#e8c0a0', '#d8a888', '#c08a68', '#8a5a3a', '#5a3a24', '#f0d0b8'];
  const prng = sd => () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  function marble(g, x, y, w, h, c) {
    vg(g, x, y, w, h, [shade(c, 0.08), c, shade(c, -0.25)]);
    g.strokeStyle = 'rgba(120,110,100,0.18)'; g.lineWidth = 0.6;
    for (let i = 0; i < w * h / 900; i++) { let px = x + rand() * w, py = y + rand() * h; g.beginPath(); g.moveTo(px, py); for (let j = 0; j < 4; j++) { px += rr(-10, 10); py += rr(-6, 6); g.lineTo(px, py); } g.stroke(); }
  }
  function column(g, x, top, bot, w, c) {
    hgf(g, x - w / 2, top, w, bot - top, [shade(c, -0.45), shade(c, 0.1), c, shade(c, -0.35)]);
    g.fillStyle = 'rgba(0,0,0,0.12)'; for (let i = 1; i < 5; i++) g.fillRect(x - w / 2 + i * w / 5, top, 0.8, bot - top);
    g.fillStyle = shade(c, 0.05); g.fillRect(x - w / 2 - 3, top - 5, w + 6, 5); g.fillRect(x - w / 2 - 3, bot - 4, w + 6, 4);
  }
  function grassFloor(F, c1, c2, o = {}) {
    vg(F, 0, FY, AWX, H - FY, [c1, c2]);
    for (let i = 0; i < 2600; i++) { F.fillStyle = rand() < 0.5 ? (o.light || 'rgba(200,230,160,0.12)') : 'rgba(0,0,0,0.2)'; F.fillRect(rand() * AWX, FY + rand() * (H - FY), 1, 1 + (rand() < 0.3)); }
    const dg = F.createLinearGradient(0, FY, 0, FY + 20); dg.addColorStop(0, 'rgba(0,0,0,0.4)'); dg.addColorStop(1, 'rgba(0,0,0,0)'); F.fillStyle = dg; F.fillRect(0, FY, AWX, 20);
  }

  // =====================================================================================
  // MOUNT RUSHMORE at sunrise. The mountain is sculpted, not outlined: the four heads, Washington's
  // coat, the cliffs and the rubble are one height map, lit by a low sun from the left with cast
  // shadows, then the pines are painted on top.
  // =====================================================================================
  let NOISE = null;
  function vnoise(x, y) {
    if (!NOISE) { NOISE = new Float32Array(256 * 256); const r = prng(977); for (let i = 0; i < NOISE.length; i++) NOISE[i] = r(); }
    const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, x0 = xi & 255, x1 = (xi + 1) & 255, y0 = (yi & 255) * 256, y1 = ((yi + 1) & 255) * 256;
    const a = NOISE[y0 + x0], b = NOISE[y0 + x1], c = NOISE[y1 + x0], d = NOISE[y1 + x1], u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y, o) { let s = 0, a = 1, n = 0; for (let i = 0; i < o; i++) { s += vnoise(x, y) * a; n += a; a *= 0.5; x = x * 2.03 + 17.1; y = y * 2.03 + 3.7; } return s / n; }
  // jittered-cell (Worley) lookup: nearest and second-nearest feature point, and the nearest cell's id
  function cells(x, y) {
    const xi = Math.floor(x), yi = Math.floor(y); let d1 = 9, d2 = 9, id = 0, ox = 0, oy = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const cx = xi + i, cy = yi + j, h = ((cx * 374761393 + cy * 668265263) ^ 0x5bd1e995) >>> 0, r1 = ((h * 2654435761) >>> 0) / 4294967296, r2 = ((h * 2246822519) >>> 0) / 4294967296;
      const dx = cx + 0.15 + r1 * 0.7 - x, dy = cy + 0.15 + r2 * 0.7 - y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < d1) { d2 = d1; d1 = d; id = h; ox = dx; oy = dy; } else if (d < d2) d2 = d;
    }
    return [d1, d2, id, ox, oy];
  }
  const gs = (u, v, cu, cv, su, sv) => { const a = (u - cu) / su, b = (v - cv) / sv, e = a * a + b * b; return e > 12 ? 0 : Math.exp(-e); };
  const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  // one carved head as a relief: u across (viewer's right is +), v down, the eye line at v = 0,
  // all in head heights. Returns how far the stone stands out at (u, v), or -1 off the head.
  function headRelief(u, v, o) {
    if (v < o.top || v > o.chin) return -1;
    // outline: round crown, straight temples and cheeks, the jaw tapering to a squared chin
    let w = o.a;
    if (v < o.sk) { const t = (o.sk - v) / (o.sk - o.top); w *= Math.sqrt(Math.max(0, 1 - Math.pow(t, 2.2))); }
    else if (v > o.jaw) { const t = (v - o.jaw) / (o.chin - o.jaw); w = o.a - (o.a - o.chinW) * Math.pow(t, o.jp || 1.6); if (v > o.chin - 0.06) w *= Math.sqrt(Math.max(0, 1 - ((v - o.chin + 0.06) / 0.06) ** 2)); }
    if (o.wig && v > -0.3 && v < 0.34) w += o.wig * Math.sqrt(Math.max(0, 1 - ((v - 0.02) / 0.32) ** 2));
    if (o.beard && v > 0.1) w = Math.max(w, (o.a - (v - 0.1) * 0.32) * (v > o.chin - 0.08 ? Math.sqrt(Math.max(0, 1 - ((v - o.chin + 0.08) / 0.08) ** 2)) : 1));
    const au = Math.abs(u); if (au >= w) return -1;
    // the skull: an ellipsoid, deep enough to turn the corner at the cheekbones
    const q = au / w; let z = o.D * Math.pow(1 - Math.pow(q, 2.1), 0.5);
    if (v < -0.1) { const t = (-0.1 - v) / (-0.1 - o.top); z *= Math.sqrt(Math.max(0, 1 - t * t * 0.85)); }
    // the face plane stands forward of the skull from the brow down to the chin
    z += 0.05 * Math.exp(-((au / 0.25) ** 4)) * sstep(-0.16, -0.06, v) * (1 - 0.6 * sstep(o.chin - 0.12, o.chin, v));
    // hair: a raised mass, combed in long shallow waves; a roll over each ear for the wigs
    const hairAt = o.hairline + o.hairCurve * u * u, side = o.wigSide ? sstep(o.wigSide - 0.04, o.wigSide + 0.02, au) * sstep(0.32, 0.12, v) : 0;
    const hm = Math.max(sstep(0, o.hairEdge || 0.08, hairAt - v), side);
    z -= (o.groove ?? 0.014) * Math.exp(-(((v - hairAt) / 0.014) ** 2)) * (1 - side);
    if (hm > 0) z += hm * (o.hairZ * (0.75 + 0.5 * vnoise(u * 18 + 40, v * 18)) - 0.016 * Math.abs(Math.sin((u * o.comb[0] + v * o.comb[1]) * 34 + Math.sin(v * 12 + u * 6) * 2)));
    if (o.part != null && v < hairAt) z -= 0.02 * Math.exp(-(((u - o.part) / 0.012) ** 2));
    if (o.roll) z += o.roll * (gs(au, v, o.a - 0.02, 0.04, 0.08, 0.16) + 0.8 * gs(au, v, o.a - 0.03, 0.22, 0.07, 0.07)) * (1 - 0.35 * Math.abs(Math.sin(v * 38)));
    // the brow: a heavy shelf over the eyes, a little notch between them
    z += o.brow * Math.exp(-(((v + 0.085 - o.browArch * u * u) / 0.04) ** 2)) * Math.exp(-((au / 0.27) ** 4)) * (1 - 0.3 * Math.exp(-((u / 0.03) ** 2)));
    // sockets, eyeballs, the upper lids, the carved iris with its peg
    const ex = o.ex, rE = Math.hypot((au - ex) / 0.072, v / 0.06);
    z -= o.sock * 1.3 * Math.exp(-rE * rE * 0.9);
    const rb = Math.hypot((au - ex) / 0.056, (v - 0.014) / 0.032); if (rb < 1) z += o.sock * 0.7 * Math.sqrt(1 - rb * rb);
    z += 0.016 * gs(au, v, ex, -0.012, 0.05, 0.011);
    const ix = ex + (u < 0 ? -o.look : o.look); z -= 0.006 * gs(au, v, ix, 0.012, 0.012, 0.011);
    // the nose: planed sides from the bridge to a broad base, a bulb at the tip, nostril wings, undercut
    if (v > -0.08 && v < o.nose + 0.1) {
      const nt = Math.max(0, Math.min(1, (v + 0.05) / (o.nose + 0.05)));
      let hn = o.nz * 1.2 * (0.5 + 0.5 * nt), nw = 0.026 + (o.nb + 0.016) * Math.pow(nt, 1.5);
      if (v > o.nose) { const f = Math.exp(-(((v - o.nose) / 0.022) ** 2)); hn *= f; }
      z += hn * Math.pow(Math.max(0, 1 - au / nw), 1.15);
      z += o.nz * 0.22 * gs(u, v, 0, o.nose - 0.025, 0.04, 0.035);
      z += o.nz * 0.36 * gs(au, v, o.nb + 0.012, o.nose - 0.015, 0.03, 0.026);
    }
    // cheekbones and hollows, the muzzle, soft cheek masses beside the mouth
    z += o.cheek * gs(au, v, 0.19, 0.1, 0.08, 0.07) - o.hollow * gs(au, v, 0.17, 0.3, 0.07, 0.1);
    z += 0.05 * gs(u, v, 0, o.mouth - 0.01, 0.17, 0.12);
    z += o.fold * gs(au, v, 0.15, o.mouth - 0.02, 0.05, 0.07);
    // lips, the mouth line and the chin
    const mv = o.mouth + o.smile * u * u;
    z += 0.028 * gs(u, v, 0, mv - 0.024, 0.11, 0.022);
    z -= 0.036 * Math.exp(-(((v - mv) / 0.01) ** 2)) * Math.exp(-((u / (o.mw + 0.02)) ** 6));
    z += 0.032 * gs(u, v, 0, mv + 0.03, 0.09, 0.022) - 0.022 * gs(u, v, 0, mv + 0.07, 0.07, 0.02);
    z += o.chinB * gs(u, v, 0, o.chin - 0.08, 0.09, 0.055);
    z -= 0.02 * gs(au, v, 0.31, -0.12, 0.05, 0.08);
    // Roosevelt's mustache and pince-nez; Lincoln's beard along the jaw and chin
    if (o.stache) { const sv = o.nose + 0.055 + 1.3 * u * u; z += o.stache * 1.3 * Math.exp(-(((v - sv) / 0.045) ** 2)) * Math.exp(-((u / 0.16) ** 6)) * (1 - 0.06 * Math.abs(Math.sin(u * 70))); }
    if (o.specs) { const r = Math.hypot(au - ex, (v - 0.008) * 1.1); z += 0.01 * Math.exp(-(((r - 0.062) / 0.007) ** 2)) * (v > 0 ? 1 : 0); }
    if (o.beard) {
      const bl = o.mouth + 0.065 - (o.mouth + 0.065 - 0.1) * Math.pow(Math.min(1, au / 0.3), 1.4);
      z += sstep(-0.02, 0.09, v - bl) * (o.beard - 0.004 * Math.abs(Math.sin(u * 60 + v * 10)));
    }
    return z;
  }
  const RUSH_HEADS = [
    // Lincoln, set apart on the right, turned a little to his right; long face, deep eyes, the jaw beard
    { x: 746, y: 76, H: 80, yaw: -0.3, pitch: 0.02, roll: 0.02, z0: -4, o: { top: -0.42, chin: 0.62, sk: -0.12, jaw: 0.22, a: 0.37, chinW: 0.18, D: 0.6, nb: 0.07, hairline: -0.22, hairCurve: 0.7, hairZ: 0.09, hairEdge: 0.03, comb: [0.4, 1], part: -0.12, ex: 0.125, look: 0.01, brow: 0.075, browArch: 0.4, sock: 0.085, nose: 0.23, nz: 0.14, cheek: 0.03, hollow: 0.04, fold: 0.02, mouth: 0.36, mw: 0.09, smile: 0.15, chinB: 0.02, beard: 0.04 } },
    // Roosevelt, deep in his recess: glasses, the big mustache
    { x: 662, y: 88, H: 66, yaw: -0.1, pitch: 0.04, roll: -0.02, z0: -15, o: { top: -0.4, chin: 0.6, sk: -0.12, jaw: 0.22, a: 0.4, chinW: 0.22, D: 0.58, nb: 0.075, hairline: -0.26, hairCurve: 0.5, hairZ: 0.02, comb: [1, 0.2], ex: 0.135, look: -0.005, brow: 0.065, browArch: 0.3, sock: 0.07, nose: 0.21, nz: 0.13, cheek: 0.035, hollow: 0.01, fold: 0.012, mouth: 0.38, mw: 0.09, smile: 0, chinB: 0.045, stache: 0.07, specs: 1 } },
    // Jefferson, behind Washington's right shoulder, turned to his left and lifting his chin
    { x: 604, y: 66, H: 72, yaw: 0.34, pitch: -0.2, roll: -0.1, z0: -5, o: { top: -0.42, chin: 0.58, sk: -0.12, jaw: 0.22, a: 0.39, chinW: 0.2, D: 0.6, nb: 0.07, hairline: -0.24, hairCurve: 0.8, hairZ: 0.03, groove: 0.004, comb: [1, 0.5], ex: 0.125, look: 0.01, brow: 0.05, browArch: 0.3, sock: 0.065, nose: 0.21, nz: 0.14, cheek: 0.03, hollow: 0.01, fold: 0.012, mouth: 0.35, mw: 0.085, smile: -0.1, chinB: 0.04, roll: 0.05, wigSide: 0.31, wig: 0.03 } },
    // Washington out front: broad face, strong brow, straight nose, firm mouth, the wig with its side roll
    { x: 532, y: 46, H: 84, yaw: 0.05, pitch: 0, roll: 0, z0: 5, o: { top: -0.39, chin: 0.61, sk: -0.12, jaw: 0.26, a: 0.385, chinW: 0.27, jp: 2, D: 0.62, nb: 0.08, hairline: -0.24, hairCurve: 0.5, hairZ: 0.04, comb: [1, 0.35], ex: 0.135, look: 0, brow: 0.07, browArch: 0.3, sock: 0.075, nose: 0.21, nz: 0.15, cheek: 0.03, hollow: 0.01, fold: 0.014, mouth: 0.37, mw: 0.1, smile: 0.1, chinB: 0.05, roll: 0.1, wigSide: 0.31, wig: 0.07 } },
  ];
  function rushmoreRelief(B, flat) {
    const S = 2, W2 = BW * S, H2 = FY * S, N = W2 * H2;
    const Z = new Float32Array(N).fill(-1e4), M = new Uint8Array(N);   // 0 sky, 1 cliff, 2 carved, 3 rubble, 4 weathered schist
    // the skyline, in back-layer pixels
    const RIDGE = [[0, 104], [90, 84], [180, 66], [260, 50], [340, 36], [400, 22], [450, 12], [490, 10], [520, 16], [565, 34], [600, 46], [630, 58], [665, 64], [690, 70], [712, 66], [735, 56], [790, 34], [830, 22], [870, 18], [910, 22], [960, 36], [1040, 52], [1140, 70], [1280, 88]];
    const ridge = x => { for (let i = 1; i < RIDGE.length; i++) if (x <= RIDGE[i][0]) { const [x0, y0] = RIDGE[i - 1], [x1, y1] = RIDGE[i], t = (x - x0) / (x1 - x0); return y0 + (y1 - y0) * (t * t * (3 - 2 * t)); } return 88; };
    const talusTop = x => 140 + ((x - 664) / 110) ** 2 * 44;
    // the mountain is shaped at the back layer's own resolution, then smoothly enlarged
    const Z1 = new Float32Array(BW * FY), M1 = new Uint8Array(BW * FY), TOP = new Float32Array(W2);
    for (let x = 0; x < W2; x++) TOP[x] = flat ? -1 : ridge(x / S) + (fbm(x / S / 22, 1.7, 3) - 0.5) * 12;
    for (let Y = 0; Y < FY; Y++) for (let X = 0; X < BW; X++) {
      const i = Y * BW + X;
      if (flat) { M1[i] = 1; continue; }
      const top = TOP[X * S]; if (Y < top - 2) continue;
      // jointed granite: big blocks, each a slightly tilted plane, thin cracks between, sheeting along the slope
      const near = Math.exp(-(((X - 640) / 170) ** 2)), sc = 1 / (46 + 24 * near);
      const wx = (fbm(X / 34, Y / 34 + 9, 2) - 0.5) * 1.4, wy = (fbm(X / 34 + 5, Y / 34, 2) - 0.5) * 1.4, [d1, d2, id, ox, oy] = cells(X * sc * 0.7 + wx, Y * sc * 1.6 + wy), r1 = (id % 1000) / 1000, r2 = ((id >>> 10) % 1000) / 1000;
      let z = (r1 - 0.5) * 5 * (1 - near * 0.7) - (ox * (r2 - 0.5) + oy * (r1 - 0.4)) * 5 * (1 - near * 0.6);
      z -= 0.9 * (1 - near) * Math.exp(-((d2 - d1) / 0.025));
      z += (fbm(X / 40, Y / 26, 3) - 0.5) * 9 + (fbm(X / 8, Y / 8, 2) - 0.5) * 3;
      const d = Y - top, Rr = 18; if (d < Rr) z -= Rr - Math.sqrt(Math.max(0, Rr * Rr - (Rr - d) * (Rr - d)));
      // Roosevelt's recess and the deep cleft that sets Lincoln apart
      z -= 15 * sstep(1, 0.55, Math.hypot((X - 662) / 56, (Y - 92) / 80));
      z -= 22 * Math.exp(-(((X - 703 - (Y - 70) * 0.12) / 7) ** 2)) * sstep(52, 70, Y) * sstep(160, 120, Y);
      // the flanks stand forward of the carved face
      z += 8 * sstep(470, 380, X) + 6 * sstep(800, 880, X);
      Z1[i] = z; M1[i] = Y > 146 + fbm(X / 30, 9, 2) * 18 && X > 330 && X < 600 ? 4 : 1;
      // Washington's coat: a broad chest, a collar round the neck, folds running down from it
      { const e = 1 - ((X - 520) / 160) ** 2 - ((Y - 152) / 84) ** 2;
        if (e > 0) {
          let zc = 34 * Math.sqrt(e) - 16 + (fbm(X / 30, Y / 30 + 5, 3) - 0.5) * 8 - 18 * sstep(150, 178, Y + (fbm(X / 20, 4, 2) - 0.5) * 24);
          const fold = (ax, ay, bx, by, side) => { const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy), s = ((X - ax) * dy - (Y - ay) * dx) / L * side; return s > -4 && s < 22 ? 3.2 * Math.sin(Math.min(1, (s + 4) / 8) * PI / 2) * (1 - Math.max(0, s) / 22) : 0; };
          zc += fold(526, 106, 440, 188, 1) + fold(554, 104, 616, 186, -1);
          if (Y < 112 && Math.abs(X - 535) < 24) zc = Math.max(zc, 14 * Math.sqrt(1 - ((X - 535) / 24) ** 2) + 2);
          zc += 3.4 * Math.exp(-(((Math.hypot((X - 535) / 34, (Y - 100) / 14) - 1) / 0.25) ** 2)) * (Y > 100 ? 1 : 0);
          if (zc > Z1[i]) { Z1[i] = zc; M1[i] = 2; }
        }
      }
      // the talus slope of blasted rubble below the faces
      const tt = talusTop(X) + (fbm(X / 12, 7, 2) - 0.5) * 8;
      if (Y > tt) {
        const [r1d, r2d] = cells(X / 3.2, Y / 2.6), zt = 6 + (Y - tt) * 0.7 + 1.6 * (1 - Math.min(1, r1d * 1.6)) - 1.2 * Math.exp(-((r2d - r1d) / 0.06));
        if (zt > Z1[i]) { Z1[i] = zt; M1[i] = 3; }
      }
    }
    for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
      if (y / S < TOP[x]) continue;
      const fx = Math.min(BW - 1.001, Math.max(0, (x - 0.5) / S)), fy = Math.min(FY - 1.001, Math.max(0, (y - 0.5) / S)), x0 = fx | 0, y0 = fy | 0, tx = fx - x0, ty = fy - y0, k = y0 * BW + x0;
      const i = y * W2 + x; Z[i] = S * ((Z1[k] * (1 - tx) + Z1[k + 1] * tx) * (1 - ty) + (Z1[k + BW] * (1 - tx) + Z1[k + BW + 1] * tx) * ty);
      M[i] = M1[((y / S) | 0) * BW + ((x / S) | 0)] || 1;
    }
    // the heads: sample each relief finely, turn it, and keep whatever stands out farthest
    const HID = new Int8Array(N).fill(-1);
    RUSH_HEADS.forEach((hd, k) => {
      const o = hd.o, s = hd.H * S, step = 1 / (s * 1.45), uw = o.a + 0.06, cy = Math.cos(hd.yaw), sy = Math.sin(hd.yaw), cp = Math.cos(hd.pitch), sp = Math.sin(hd.pitch), cr = Math.cos(hd.roll), sr = Math.sin(hd.roll);
      for (let v = o.top; v <= o.chin + 0.02; v += step) for (let u = -uw; u <= uw; u += step) {
        const h = headRelief(u, v, o); if (h < 0) continue;
        let px = u, py = v, pz = h;
        let t = px * cy + pz * sy; pz = -px * sy + pz * cy; px = t;
        t = py * cp - pz * sp; pz = py * sp + pz * cp; py = t;
        t = px * cr - py * sr; py = px * sr + py * cr; px = t;
        const X = Math.round(hd.x * S + px * s), Yp = Math.round(hd.y * S + py * s);
        if (X < 0 || X >= W2 || Yp < 0 || Yp >= H2) continue;
        const i = Yp * W2 + X, zz = (hd.z0 - o.D * hd.H * 0.55) * S + pz * s;
        if (zz > Z[i]) { Z[i] = zz; M[i] = 2; HID[i] = k; }
      }
    });
    // light: a low morning sun from the left, cast shadows by marching toward it through the height map
    const L = [-0.58, -0.4, 0.71], ln = Math.hypot(...L); L[0] /= ln; L[1] /= ln; L[2] /= ln;
    const lxy = Math.hypot(L[0], L[1]), sdx = L[0] / lxy, sdy = L[1] / lxy, slope = L[2] / lxy;
    const lit = new Float32Array(N), ao = new Float32Array(N); const PM = new Float32Array(N);   // the tallest stone above and to the left of each point: the sun's rays only travel that way
    for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) { const i = y * W2 + x; let m = Z[i]; if (x) m = Math.max(m, PM[i - 1]); if (y) m = Math.max(m, PM[i - W2]); PM[i] = m; }
    // ambient occlusion from a blurred height map (summed-area table)
    { const sat = new Float64Array((W2 + 1) * (H2 + 1)), R0 = 10;
      for (let y = 0; y < H2; y++) { let row = 0; for (let x = 0; x < W2; x++) { const zz = Z[y * W2 + x]; row += zz < -5e3 ? -40 : zz; sat[(y + 1) * (W2 + 1) + x + 1] = sat[y * (W2 + 1) + x + 1] + row; } }
      for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
        const i = y * W2 + x; if (M[i] === 0) continue;
        const xa = Math.max(0, x - R0), xb = Math.min(W2, x + R0 + 1), ya = Math.max(0, y - R0), yb = Math.min(H2, y + R0 + 1);
        const avg = (sat[yb * (W2 + 1) + xb] - sat[ya * (W2 + 1) + xb] - sat[yb * (W2 + 1) + xa] + sat[ya * (W2 + 1) + xa]) / ((xb - xa) * (yb - ya));
        ao[i] = Math.max(0.35, Math.min(1, 1 - (avg - Z[i]) * 0.018));
      }
    }
    for (let y = 0; y < H2; y++) for (let x = 0; x < W2; x++) {
      const i = y * W2 + x; if (M[i] === 0) continue;
      const z = Z[i];
      let a1 = x > 0 ? Z[i - 1] : z, a2 = x > 1 ? Z[i - 2] : z, b1 = x < W2 - 1 ? Z[i + 1] : z, b2 = x < W2 - 2 ? Z[i + 2] : z, c1 = y > 0 ? Z[i - W2] : z, c2 = y > 1 ? Z[i - 2 * W2] : z, e1 = y < H2 - 1 ? Z[i + W2] : z, e2 = y < H2 - 2 ? Z[i + 2 * W2] : z;
      if (Math.abs(a1 - z) > 40) a1 = z; if (Math.abs(a2 - z) > 40) a2 = z; if (Math.abs(b1 - z) > 40) b1 = z; if (Math.abs(b2 - z) > 40) b2 = z;
      if (Math.abs(c1 - z) > 40) c1 = z; if (Math.abs(c2 - z) > 40) c2 = z; if (Math.abs(e1 - z) > 40) e1 = z; if (Math.abs(e2 - z) > 40) e2 = z;
      const zL = (a1 + a2) / 2, zR = (b1 + b2) / 2, zU = (c1 + c2) / 2, zD = (e1 + e2) / 2;
      let nx = -(zR - zL) / 3, ny = -(zD - zU) / 3, nz = 1; const nl = Math.hypot(nx, ny, nz); nx /= nl; ny /= nl; nz /= nl;
      let dif = nx * L[0] + ny * L[1] + nz * L[2];
      if (dif > 0) {
        let sh = 1;
        for (let k = 1, dd = 1; k < 70; k++, dd += 1 + k * 0.08) {
          const sx = Math.round(x + sdx * dd), sy2 = Math.round(y + sdy * dd); if (sx < 0 || sy2 < 0 || sx >= W2) break;
          const zr = z + dd * slope, j = sy2 * W2 + sx; if (zr > PM[j]) break; const over = Z[j] - zr;
          if (M[j] && over > 0) { sh = Math.min(sh, Math.max(0, 1 - over / 3)); if (sh <= 0) break; }
        }
        dif *= sh;
      } else dif = 0;
      lit[i] = dif;
      ao[i] *= 0.6 + 0.4 * Math.max(0, -ny * 0.5 + nz * 0.7);
    }
    // stone colors: pale carved granite, mottled natural cliff, gray rubble, dark weathered schist.
    // The cliff pales toward the carving so the finished stone and the raw rock blend.
    const img = B.getImageData(0, 0, BW, FY), D = img.data;
    const SUN = [1.55, 1.12, 0.64], SKY = [0.22, 0.28, 0.46], alb = [0, 0, 0, 0, 0];
    for (let y = 0; y < FY; y++) for (let x = 0; x < BW; x++) {
      let r = 0, g = 0, b = 0, cov = 0, done = 0;
      for (let q = 0; q < 4; q++) {
        const i = (y * 2 + (q >> 1)) * W2 + x * 2 + (q & 1), m = M[i]; if (!m) continue;
        cov++;
        if (!(done & (1 << m))) {
          done |= 1 << m;
          if (m === 2) { const n = fbm(x / 14, y / 3, 3), st = fbm(x / 1.5, y / 40, 2); alb[2] = 0.82 + (n - 0.5) * 0.12 - (st > 0.72 ? 0.08 : 0); }
          else if (m === 1) { const n = fbm(x / 18, y / 12, 3), st = fbm(x / 3, y / 46, 2), near = Math.exp(-(((x - 640) / 150) ** 2)) * sstep(170, 60, y); alb[1] = (0.66 + (n - 0.5) * 0.36 - Math.max(0, st - 0.55) * 0.7) * (1 - near * 0.5) + (0.8 + (n - 0.5) * 0.12) * near * 0.5; }
          else if (m === 3) { const [, , cid] = cells(x / 3.2, y / 2.6); alb[3] = 0.4 + ((cid % 100) / 100) * 0.24; }
          else alb[4] = 0.34 + fbm(x / 4, y / 26 + x / 40, 3) * 0.22;
        }
        let a0 = alb[m], a1, a2;
        if (m === 3) { a1 = a0 * 0.98; a2 = a0 * 0.98; } else if (m === 4) { a1 = a0 * 0.9; a2 = a0 * 0.82; } else { a1 = a0 * 0.89; a2 = a0 * 0.77; }
        if (HID[i] === 1) { a0 *= 0.96; a1 *= 0.95; }
        const li = lit[i], am = ao[i];
        r += a0 * (SKY[0] * am + SUN[0] * li); g += a1 * (SKY[1] * am + SUN[1] * li); b += a2 * (SKY[2] * am + SUN[2] * li);
      }
      if (!cov) continue;
      const p = (y * BW + x) * 4, k = cov / 4, tone = c => Math.min(255, 255 * Math.pow(c / cov, 0.9));
      D[p] = D[p] * (1 - k) + tone(r) * k; D[p + 1] = D[p + 1] * (1 - k) + tone(g) * k; D[p + 2] = D[p + 2] * (1 - k) + tone(b) * k; D[p + 3] = 255;
    }
    B.putImageData(img, 0, 0);
  }
  // a ponderosa pine catching the sun on its left side
  function ponderosa(g, x, y, h) {
    // a tall straight trunk, open clumps of needles hung from short limbs, sun on the left
    g.fillStyle = '#4a2c18'; g.beginPath(); g.moveTo(x - h * 0.035, y); g.lineTo(x - h * 0.012, y - h * 0.95); g.lineTo(x + h * 0.012, y - h * 0.95); g.lineTo(x + h * 0.035, y); g.fill();
    const n = 7 + (h / 6 | 0);
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), cy = y - h * (0.28 + t * 0.7), reach = h * (0.26 * (1 - t) + 0.07) * rr(0.6, 1.2), sd = i % 2 ? 1 : -1, cx = x + sd * reach * 0.55;
      R.line(g, x, cy + h * 0.03, cx, cy, '#3a2414', Math.max(0.6, h * 0.018));
      for (let k = 0; k < 3; k++) {
        const bx = cx + rr(-reach, reach) * 0.45, by = cy + rr(-1, 1) * h * 0.025, rw = reach * rr(0.35, 0.6), rh = h * rr(0.045, 0.07);
        g.fillStyle = shade('#1c3418', rr(-0.25, 0.05)); g.beginPath(); g.ellipse(bx, by, rw, rh, rr(-0.2, 0.2), 0, PI * 2); g.fill();
        g.fillStyle = 'rgba(200,170,90,0.35)'; g.beginPath(); g.ellipse(bx - rw * 0.4, by - rh * 0.3, rw * 0.45, rh * 0.5, 0, 0, PI * 2); g.fill();
      }
    }
  }
  function rushmore(B, F) {
    setSeed(31);
    // a cloudless deep blue morning sky
    vg(B, 0, 0, BW, FY, ['#0a3a9e', '#1656c0', '#2a74d4', '#5a9ae0']);
    rushmoreRelief(B);
    // ponderosa pines on the rubble and along the foot of the mountain
    for (const [x, y, h] of [[598, 168, 22], [640, 150, 18], [690, 160, 24], [726, 172, 28], [770, 176, 26], [812, 166, 30], [852, 178, 24], [560, 182, 20], [300, 176, 28], [340, 182, 24], [930, 178, 30], [980, 172, 26], [1060, 180, 34], [160, 178, 30], [220, 170, 22], [1160, 176, 30]]) ponderosa(B, x, y, h);
    for (let i = 0; i < 70; i++) ponderosa(B, rr(0, BW), FY - rr(-2, 8), rr(14, 30));
    vignette(B, BW);
    // the Grand View Terrace: warm granite pavers
    pfloor(F, 'stone', '#c8b498', '#7a6a56', { rows: 7, span: 54 });
  }

  // =====================================================================================
  // VALLEY FORGE: the winter camp, log huts, campfires, snow coming down
  // =====================================================================================
  function valleyforge(B, F) {
    setSeed(41);
    vg(B, 0, 0, BW, FY, ['#0a0e1a', '#1a2234', '#3a4458', '#6a7488']);
    stars(B, 80, 60);
    clouds(B, 10, 80, 10, 'rgba(60,70,90,0.6)', 'rgba(180,190,210,0.3)', 0);
    // snowy hills and bare trees
    B.fillStyle = '#c8d0dc'; B.beginPath(); B.moveTo(0, 140); for (let x = 0; x <= BW; x += 40) B.lineTo(x, 132 + Math.sin(x * 0.006) * 14); B.lineTo(BW, FY); B.lineTo(0, FY); B.fill();
    for (let i = 0; i < 40; i++) { const x = rr(0, BW), y = rr(126, 150), h = rr(20, 50); R.line(B, x, y, x, y - h, '#1a1612', 1.4); for (let j = 0; j < 4; j++) R.line(B, x, y - h * (0.4 + j * 0.15), x + rr(-10, 10), y - h * (0.55 + j * 0.15), '#1a1612', 0.8); }
    // log huts with snow roofs and smoke
    for (const hx of [120, 330, 560, 820, 1060, 1210]) {
      const w = 70, top = FY - 46;
      for (let r = 0; r < 6; r++) { B.fillStyle = r % 2 ? '#4a3220' : '#5a3e28'; B.fillRect(hx - w / 2, top + 10 + r * 6, w, 6); B.fillStyle = 'rgba(0,0,0,0.3)'; B.fillRect(hx - w / 2, top + 15 + r * 6, w, 1); }
      B.fillStyle = '#e8eef4'; B.beginPath(); B.moveTo(hx - w / 2 - 6, top + 12); B.lineTo(hx, top - 8); B.lineTo(hx + w / 2 + 6, top + 12); B.fill();
      B.fillStyle = '#1a1208'; B.fillRect(hx - 7, top + 26, 14, 20); win(B, hx + 16, top + 22, 8, 8, true, '#ffb060');
    }
    fog(B, FY - 30, 40, 'rgba(200,210,230,0.25)');
    vignette(B, BW);
    // trampled snow
    vg(F, 0, FY, AWX, H - FY, ['#aab4c4', '#d8e0ea']);
    for (let i = 0; i < 200; i++) { F.fillStyle = 'rgba(80,90,110,0.18)'; F.beginPath(); F.ellipse(rand() * AWX, FY + rand() * 54, rr(2, 6), rr(1, 2), 0, 0, PI * 2); F.fill(); }
    for (let i = 0; i < 20; i++) { F.fillStyle = 'rgba(120,20,20,0.3)'; F.beginPath(); F.ellipse(rand() * AWX, FY + 10 + rand() * 40, rr(1, 3), 1, 0, 0, PI * 2); F.fill(); }
    speckle(F, 0, FY, AWX, H - FY, 1600, 0.15, 0.3);
  }
  const VF_FIRES = [230, 700, 940];

  // =====================================================================================
  // GETTYSBURG: the field after the battle, split-rail fence, cannons, smoke and a red dusk
  // =====================================================================================
  function gettysburg(B, F) {
    setSeed(51);
    vg(B, 0, 0, BW, FY, ['#1a0e10', '#4a1a14', '#8a3a1e', '#c8682a']);
    clouds(B, 20, 100, 12, 'rgba(60,30,30,0.6)', 'rgba(230,120,60,0.3)', 1);
    // ridge line and the tree that marks the center
    B.fillStyle = '#2a2414'; B.beginPath(); B.moveTo(0, 150); for (let x = 0; x <= BW; x += 30) B.lineTo(x, 146 + Math.sin(x * 0.01) * 6); B.lineTo(BW, FY); B.lineTo(0, FY); B.fill();
    treeline(B, 150, 30, '#1a1a0e', 14, 30);
    tree(B, 880, 150, 60, '#1e2010');
    // stone wall and rail fence
    stones(B, 0, FY - 20, BW, 12, '#6a6458', 12, 6);
    for (let x = 0; x < BW; x += 46) { R.line(B, x, FY - 40, x + 23, FY - 24, '#4a3420', 2); R.line(B, x + 23, FY - 24, x + 46, FY - 40, '#4a3420', 2); R.line(B, x, FY - 32, x + 46, FY - 30, '#5a3e24', 2); }
    // cannons
    for (const cx of [CX - 230, CX + 250]) {
      R.line(B, cx - 30, FY - 14, cx + 20, FY - 28, '#8a6a3a', 6); R.line(B, cx - 28, FY - 16, cx + 18, FY - 29, 'rgba(255,220,160,0.35)', 1.4); R.ball(B, cx - 30, FY - 14, 4, '#8a6a3a');
      for (const wx of [cx - 10, cx + 2]) { B.strokeStyle = '#3a2410'; B.lineWidth = 2; B.beginPath(); B.arc(wx, FY - 10, 10, 0, PI * 2); B.stroke(); for (let i = 0; i < 6; i++) R.line(B, wx, FY - 10, wx + Math.cos(i) * 10, FY - 10 + Math.sin(i) * 10, '#3a2410', 0.8); }
    }
    fog(B, FY - 60, 70, 'rgba(180,150,130,0.3)');
    vignette(B, BW);
    grassFloor(F, '#4a4a24', '#2a2a14', { light: 'rgba(220,200,120,0.12)' });
    for (let i = 0; i < 30; i++) { F.fillStyle = 'rgba(90,60,30,0.4)'; F.beginPath(); F.ellipse(rand() * AWX, FY + 6 + rand() * 46, rr(4, 12), rr(1, 3), 0, 0, PI * 2); F.fill(); }
  }

  // =====================================================================================
  // LINCOLN MEMORIAL REFLECTING POOL: on the steps at night, the monument down the water
  // =====================================================================================
  function reflecting(B, F) {
    setSeed(61);
    vg(B, 0, 0, BW, FY, ['#04060e', '#0c1428', '#1a2a48', '#2a3a58']);
    stars(B, 150, 100); moon(B, 300, 40, 9);
    // the obelisk, its red lights, the long pool
    const ox = CX + 170;
    B.fillStyle = '#d8d4c8'; B.beginPath(); B.moveTo(ox - 7, 130); B.lineTo(ox - 5, 52); B.lineTo(ox, 44); B.lineTo(ox + 5, 52); B.lineTo(ox + 7, 130); B.fill();
    hgf(B, ox - 7, 44, 14, 86, ['rgba(0,0,0,0)', 'rgba(255,255,255,0.15)', 'rgba(0,0,0,0.4)']);
    glow(B, ox, 70, 80, 'rgba(200,210,240,0.2)');
    treeline(B, 132, 40, '#0e1810', 8, 18);
    vg(B, 0, 132, BW, FY - 132 - 18, ['#14203a', '#0a1222']);
    // reflection of the obelisk
    B.globalAlpha = 0.35; B.fillStyle = '#d8d4c8'; B.beginPath(); B.moveTo(ox - 9, 134); B.lineTo(ox - 5, 166); B.lineTo(ox + 5, 166); B.lineTo(ox + 9, 134); B.fill(); B.globalAlpha = 1;
    for (let i = 0; i < 60; i++) { B.fillStyle = 'rgba(200,210,240,0.12)'; B.fillRect(rr(0, BW), rr(134, FY - 20), rr(6, 24), 0.7); }
    // the steps with lamp posts
    for (let i = 0; i < 4; i++) { B.fillStyle = shade('#c8c4b8', -0.3 + i * 0.06); B.fillRect(0, FY - 18 + i * 4.5, BW, 4.5); B.fillStyle = 'rgba(0,0,0,0.3)'; B.fillRect(0, FY - 18 + i * 4.5, BW, 1); }
    for (const x of [100, 400, 880, 1180]) lamp(B, x, FY - 18, 50);
    vignette(B, BW);
    // marble plaza
    pfloor(F, 'stone', '#b8b4a8', '#6a6860', { rows: 7, span: 60 });
  }

  // =====================================================================================
  // WHITE HOUSE BOWLING ALLEY: the two-lane alley in the basement, wood paneling, pins at the back
  // =====================================================================================
  function bowling(B, F) {
    setSeed(71);
    vg(B, 0, 0, BW, FY, ['#140c08', '#2a1a10', '#3a2416']);
    // wood-paneled walls
    for (let x = 0; x < BW; x += 18) { hgf(B, x, 20, 18, FY - 40, [shade('#6a4428', rr(-0.2, 0.05)), shade('#7a5030', rr(-0.1, 0.1)), shade('#5a3a20', rr(-0.2, 0))]); B.fillStyle = 'rgba(0,0,0,0.35)'; B.fillRect(x, 20, 1, FY - 40); }
    B.fillStyle = '#2a1a0c'; B.fillRect(0, 14, BW, 8); B.fillStyle = '#c8a040'; B.fillRect(0, 21, BW, 1.4);
    // presidential seal and a framed photo row
    R.ball(B, CX, 54, 18, '#c8a050'); R.ball(B, CX, 54, 14, '#1e2a5a'); B.fillStyle = '#c8a050'; B.beginPath(); B.moveTo(CX, 44); B.lineTo(CX + 8, 58); B.lineTo(CX - 8, 58); B.fill();
    for (const x of [CX - 300, CX - 240, CX + 240, CX + 300]) { B.fillStyle = '#1a1208'; B.fillRect(x - 16, 40, 32, 24); B.fillStyle = '#5a5248'; B.fillRect(x - 13, 43, 26, 18); B.fillStyle = 'rgba(255,255,255,0.12)'; B.fillRect(x - 13, 43, 26, 5); }
    // the two lanes running back to the pin decks
    for (const lx of [CX - 150, CX + 150]) {
      B.fillStyle = '#0a0604'; B.fillRect(lx - 70, 78, 140, FY - 78);
      B.fillStyle = '#c8a070'; B.beginPath(); B.moveTo(lx - 30, 86); B.lineTo(lx + 30, 86); B.lineTo(lx + 64, FY); B.lineTo(lx - 64, FY); B.fill();
      for (let i = 0; i < 12; i++) { B.fillStyle = 'rgba(90,50,20,0.25)'; B.beginPath(); B.moveTo(lx - 30 + i * 5, 86); B.lineTo(lx - 29 + i * 5, 86); B.lineTo(lx - 62 + i * 10.6, FY); B.lineTo(lx - 64 + i * 10.6, FY); B.fill(); }
      B.fillStyle = 'rgba(255,240,210,0.25)'; B.beginPath(); B.moveTo(lx - 6, 86); B.lineTo(lx + 6, 86); B.lineTo(lx + 16, FY); B.lineTo(lx - 16, FY); B.fill();
      for (let i = 0; i < 7; i++) R.poly(B, [[lx - 9 + i * 3, 140 + (i % 2) * 6], [lx - 7.6 + i * 3, 134 + (i % 2) * 6], [lx - 6.2 + i * 3, 140 + (i % 2) * 6]], '#2a3a6a');
      B.fillStyle = '#1a1008'; B.fillRect(lx - 42, 74, 84, 16); glow(B, lx, 90, 60, 'rgba(255,230,180,0.4)');
      B.fillStyle = '#e8d070'; B.font = '7px Anton, Impact, sans-serif'; B.textAlign = 'center'; B.fillText('THE PRESIDENT\'S LANE', lx, 85); B.textAlign = 'left';
    }
    vignette(B, BW);
    // polished maple approach
    vg(F, 0, FY, AWX, H - FY, ['#8a5e34', '#b8844c']);
    for (let x = 0; x < AWX; x += 6) { F.fillStyle = `rgba(60,30,10,${rr(0.05, 0.2)})`; F.fillRect(x, FY, 1, H - FY); }
    for (const dx of [-300, -150, 0, 150, 300]) for (let i = 0; i < 3; i++) { F.fillStyle = '#2a3a6a'; F.beginPath(); F.moveTo(AWX / 2 + dx + i * 8 - 8, FY + 30); F.lineTo(AWX / 2 + dx + i * 8 - 4, FY + 24); F.lineTo(AWX / 2 + dx + i * 8, FY + 30); F.fill(); }
    F.fillStyle = 'rgba(255,240,200,0.12)'; F.fillRect(0, FY + 8, AWX, 4);
    const dg = F.createLinearGradient(0, FY, 0, FY + 20); dg.addColorStop(0, 'rgba(0,0,0,0.4)'); dg.addColorStop(1, 'rgba(0,0,0,0)'); F.fillStyle = dg; F.fillRect(0, FY, AWX, 20);
  }

  // =====================================================================================
  // CAPITOL ROTUNDA: under the dome, the fresco up top, statues around the ring
  // =====================================================================================
  function rotunda(B, F) {
    setSeed(81);
    vg(B, 0, 0, BW, FY, ['#2a2418', '#4a4030', '#6a5c44', '#3a3022']);
    // the dome's coffered underside and the fresco oculus
    for (let r = 0; r < 6; r++) { const y = 4 + r * 9; for (let x = (r % 2) * 20; x < BW; x += 40) { B.fillStyle = shade('#8a7a5a', -0.2 - r * 0.04); B.fillRect(x + 4, y, 32, 7); B.fillStyle = 'rgba(0,0,0,0.35)'; B.fillRect(x + 4, y + 6, 32, 1); } }
    vg(B, CX - 160, 0, 320, 30, ['#a89060', '#6a8090', '#a89060']); B.fillStyle = 'rgba(255,240,210,0.25)'; B.beginPath(); B.ellipse(CX, 10, 140, 18, 0, 0, PI * 2); B.fill();
    for (let i = 0; i < 14; i++) { B.fillStyle = ['rgba(200,160,120,0.4)', 'rgba(120,140,170,0.4)', 'rgba(230,220,200,0.4)'][i % 3]; B.beginPath(); B.ellipse(CX - 120 + i * 18, 14 + Math.sin(i) * 4, 6, 4, 0, 0, PI * 2); B.fill(); }
    // frieze band
    B.fillStyle = '#b8a888'; B.fillRect(0, 58, BW, 14); for (let x = 0; x < BW; x += 22) { B.fillStyle = 'rgba(60,50,30,0.35)'; B.fillRect(x + 4, 60, 2, 10); B.beginPath(); B.ellipse(x + 13, 65, 4, 4, 0, 0, PI * 2); B.fill(); }
    // walls, columns, the big paintings and statues on plinths
    marble(B, 0, 72, BW, FY - 72, '#c8bca0');
    for (let x = 40; x < BW; x += 130) column(B, x, 76, FY - 8, 16, '#d8ccb0');
    for (const x of [170, 430, 850, 1110]) { B.fillStyle = '#6a4a14'; B.fillRect(x - 46, 90, 92, 56); B.fillStyle = '#8a6420'; B.fillRect(x - 44, 92, 88, 52); vg(B, x - 40, 96, 80, 44, ['#5a4a32', '#3a3024', '#2a2018']); for (let i = 0; i < 8; i++) { B.fillStyle = ['#8a3a2a', '#2a3a5a', '#d8d0c0', '#4a3a2a'][i % 4]; B.fillRect(x - 34 + i * 9, 116 + (i % 3) * 2, 5, 18); B.fillStyle = '#c8a088'; B.beginPath(); B.arc(x - 31.5 + i * 9, 113 + (i % 3) * 2, 2.6, 0, PI * 2); B.fill(); } }
    for (const x of [300, 980]) { B.fillStyle = '#8a8478'; B.fillRect(x - 12, FY - 26, 24, 22); B.fillStyle = '#b8b4a8'; B.fillRect(x - 6, FY - 70, 12, 44); B.beginPath(); B.arc(x, FY - 76, 6, 0, PI * 2); B.fill(); B.fillRect(x - 10, FY - 66, 20, 14); }
    // velvet ropes
    for (let x = 0; x < BW; x += 80) { B.fillStyle = '#c8a040'; B.fillRect(x - 1.5, FY - 20, 3, 18); R.ball(B, x, FY - 21, 2.4, '#e8c860'); B.strokeStyle = '#8a1a24'; B.lineWidth = 2; B.beginPath(); B.moveTo(x, FY - 16); B.quadraticCurveTo(x + 40, FY - 6, x + 80, FY - 16); B.stroke(); }
    glow(B, CX, 30, 300, 'rgba(255,230,180,0.15)');
    vignette(B, BW);
    // the compass-rose marble floor
    pfloor(F, 'check', '#c8bca0', '#5a5040', { rows: 8, span: 40 });
    const cx = AWX / 2, cy = FY + 26; F.fillStyle = 'rgba(140,30,40,0.55)'; F.beginPath(); F.ellipse(cx, cy, 120, 12, 0, 0, PI * 2); F.fill(); F.strokeStyle = '#c8a050'; F.lineWidth = 1.4; F.beginPath(); F.ellipse(cx, cy, 120, 12, 0, 0, PI * 2); F.stroke();
    F.fillStyle = '#e8d8a0'; for (let i = 0; i < 8; i++) { const a = i * PI / 4; F.beginPath(); F.moveTo(cx, cy); F.lineTo(cx + Math.cos(a) * 100, cy + Math.sin(a) * 9); F.lineTo(cx + Math.cos(a + 0.2) * 30, cy + Math.sin(a + 0.2) * 3); F.fill(); }
  }

  // =====================================================================================
  // HOUSE CHAMBER, JOINT SESSION: the three-tier walnut rostrum with the flag hung behind the
  // Speaker, the bronze fasces, the Mace, the galleries, and the members in their rows on each side
  // =====================================================================================
  // a member of Congress from the waist up: seated, half risen or on their feet clapping and cheering.
  // Hs is the person's standing height in pixels, rail is where the row in front hides them.
  function member(g, x, rail, Hs, p, up, t) {
    const hip = rail + Hs * 0.06 - up * Hs * 0.26, sh = hip - Hs * 0.3, hr = Hs * 0.062, hc = sh - Hs * 0.03 - hr * 1.05, sw = Hs * 0.125;
    // arms behind the jacket's front edge: resting, clapping at the chest, or thrown up
    const lw = Math.max(1.4, Hs * 0.05), clap = p.cheer === 'clap', hands = [];
    for (const sd of [-1, 1]) {
      const ax = x + sd * sw * 0.86, ay = sh + Hs * 0.02;
      let ex2, ey2, hx, hy;
      if (up > 0.5 && !clap) { const w = Math.sin(t * 7 + p.ph + sd) * Hs * 0.03; ex2 = ax + sd * Hs * 0.06; ey2 = ay - Hs * 0.13; hx = ax + sd * Hs * 0.05 + w; hy = ay - Hs * 0.27; }
      else if (up > 0.5) { const s = (1 + Math.sin(t * 17 + p.ph)) * Hs * 0.022 + Hs * 0.005; ex2 = ax + sd * Hs * 0.05; ey2 = ay + Hs * 0.11; hx = x + sd * s; hy = ay + Hs * 0.06; }
      else { ex2 = ax + sd * Hs * 0.02; ey2 = ay + Hs * 0.13; hx = x + sd * Hs * 0.06; hy = ay + Hs * 0.24; }
      R.line(g, ax, ay, ex2, ey2, shade(p.coat, -0.15), lw); R.line(g, ex2, ey2, hx, hy, shade(p.coat, -0.15), lw * 0.9);
      hands.push([hx, hy]);
    }
    // jacket, shirt and tie (or a blouse), lapels
    g.fillStyle = p.coat; g.beginPath(); g.moveTo(x - sw * 0.92, hip + 2); g.lineTo(x - sw, sh + Hs * 0.03); g.quadraticCurveTo(x - sw, sh - Hs * 0.005, x - sw * 0.45, sh - Hs * 0.012); g.lineTo(x + sw * 0.45, sh - Hs * 0.012); g.quadraticCurveTo(x + sw, sh - Hs * 0.005, x + sw, sh + Hs * 0.03); g.lineTo(x + sw * 0.92, hip + 2); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,240,220,0.12)'; g.fillRect(x - sw, sh, sw * 0.5, hip - sh);
    g.fillStyle = p.shirt; g.beginPath(); g.moveTo(x - sw * 0.3, sh - Hs * 0.01); g.lineTo(x + sw * 0.3, sh - Hs * 0.01); g.lineTo(x, sh + Hs * 0.12); g.fill();
    if (p.tie) { g.fillStyle = p.tie; g.beginPath(); g.moveTo(x - Hs * 0.012, sh); g.lineTo(x + Hs * 0.012, sh); g.lineTo(x + Hs * 0.017, sh + Hs * 0.1); g.lineTo(x, sh + Hs * 0.12); g.lineTo(x - Hs * 0.017, sh + Hs * 0.1); g.fill(); }
    g.strokeStyle = shade(p.coat, -0.35); g.lineWidth = Math.max(0.6, Hs * 0.01); g.beginPath(); g.moveTo(x - sw * 0.32, sh - Hs * 0.01); g.lineTo(x - Hs * 0.01, sh + Hs * 0.16); g.moveTo(x + sw * 0.32, sh - Hs * 0.01); g.lineTo(x + Hs * 0.01, sh + Hs * 0.16); g.stroke();
    if (p.pin) { g.fillStyle = '#e8c860'; g.fillRect(x - sw * 0.55, sh + Hs * 0.04, Math.max(1, Hs * 0.012), Math.max(1, Hs * 0.012)); }
    // neck, head, face, hair
    g.fillStyle = shade(p.skin, -0.18); g.fillRect(x - hr * 0.45, hc + hr * 0.6, hr * 0.9, sh - hc - hr * 0.5);
    g.fillStyle = p.skin; g.beginPath(); g.ellipse(x, hc, hr * 0.86, hr * 1.05, 0, 0, PI * 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,0.18)'; g.beginPath(); g.ellipse(x + hr * 0.3, hc + hr * 0.1, hr * 0.5, hr * 0.9, 0, -PI / 2, PI / 2); g.fill();
    const ey = hc - hr * 0.05, es = Math.max(0.9, hr * 0.17);
    g.fillStyle = '#1a1210'; g.fillRect(x - hr * 0.42, ey, es, es); g.fillRect(x + hr * 0.42 - es, ey, es, es);
    if (up > 0.5 && p.cheer !== 'clap') { g.fillStyle = '#4a1a14'; g.beginPath(); g.ellipse(x, hc + hr * 0.5, hr * 0.26, hr * 0.2, 0, 0, PI * 2); g.fill(); }
    else { g.fillStyle = shade(p.skin, -0.35); g.fillRect(x - hr * 0.25, hc + hr * 0.48, hr * 0.5, Math.max(0.7, hr * 0.1)); }
    g.fillStyle = p.hair;
    if (p.style === 0) { g.beginPath(); g.ellipse(x, hc - hr * 0.45, hr * 0.9, hr * 0.62, 0, PI, 0); g.fill(); g.fillRect(x - hr * 0.9, hc - hr * 0.5, hr * 0.2, hr * 0.6); g.fillRect(x + hr * 0.7, hc - hr * 0.5, hr * 0.2, hr * 0.6); }
    else if (p.style === 1) { g.fillRect(x - hr * 0.9, hc - hr * 0.3, hr * 0.22, hr * 0.7); g.fillRect(x + hr * 0.68, hc - hr * 0.3, hr * 0.22, hr * 0.7); }
    else if (p.style === 2) { g.beginPath(); g.ellipse(x, hc - hr * 0.35, hr * 1.05, hr * 0.8, 0, PI * 1.05, PI * 1.95); g.fill(); g.beginPath(); g.moveTo(x - hr * 1.0, hc - hr * 0.5); g.quadraticCurveTo(x - hr * 1.3, hc + hr * 0.8, x - hr * 0.8, hc + hr * 1.3); g.lineTo(x - hr * 0.7, hc); g.fill(); g.beginPath(); g.moveTo(x + hr * 1.0, hc - hr * 0.5); g.quadraticCurveTo(x + hr * 1.3, hc + hr * 0.8, x + hr * 0.8, hc + hr * 1.3); g.lineTo(x + hr * 0.7, hc); g.fill(); }
    else { g.beginPath(); g.ellipse(x, hc - hr * 0.55, hr * 0.92, hr * 0.6, 0, PI, 0); g.fill(); g.beginPath(); g.ellipse(x - hr * 0.2, hc - hr * 0.75, hr * 0.7, hr * 0.35, -0.3, 0, PI * 2); g.fill(); }
    // hands last so claps and waves read in front of the jacket
    g.fillStyle = p.skin; for (const [hx, hy] of hands) { g.beginPath(); g.arc(hx, hy, Math.max(1, Hs * 0.022), 0, PI * 2); g.fill(); }
  }
  const HOUSE_ROWS = [0, 1, 2, 3].map(r => ({ rail: FY - 10 - r * 25, Hs: 98 - r * 13, inner: 192 + r * 24 }));
  const HOUSE_SEATS = (() => {
    const rnd = prng(113), pick = a => a[(rnd() * a.length) | 0], out = [];
    const SUITS = ['#1a1c24', '#22283a', '#2e3240', '#1a1a1a', '#34383e', '#20283a', '#3a3e48'], BRIGHT = ['#b0242e', '#1e3c8a', '#e8e4dc', '#2a7a8a', '#6a2a7a', '#c8a040', '#1a1a22'];
    const HAIR = ['#1a1208', '#3a2a1a', '#8a8680', '#c8c4bc', '#6a4428', '#d8c08a', '#2a1a10', '#e8e4dc'];
    HOUSE_ROWS.forEach((row, r) => {
      const gap = row.Hs * 0.31;
      for (const sd of [-1, 1]) for (let x = CX + sd * row.inner; x > 120 && x < BW - 120; x += sd * gap) {
        const woman = rnd() < 0.32, xx = x + (rnd() - 0.5) * 3;
        out.push({ r, x: xx, empty: rnd() < 0.06, coat: woman ? pick(BRIGHT) : pick(SUITS), shirt: woman ? (rnd() < 0.5 ? '#f0ece4' : '#2a2a30') : rnd() < 0.85 ? '#f0ece4' : '#a8c0e0', tie: woman ? null : pick(['#8a1a24', '#1a2a6a', '#c8a040', '#2a5a3a', '#6a1a2a', '#3a4a8a']),
          skin: pick(SKINS), hair: pick(HAIR), style: woman ? (rnd() < 0.7 ? 2 : 3) : rnd() < 0.18 ? 1 : 0, pin: rnd() < 0.5, ph: rnd() * 6, eager: rnd(), cheer: rnd() < 0.55 ? 'clap' : 'wave' });
      }
    });
    return out;
  })();
  // the blue leather chairs, the walnut rail in front of each row
  function houseChair(g, x, row) { const Hs = row.Hs, w = Hs * 0.15, top = row.rail - Hs * 0.44; g.fillStyle = '#1c2c5a'; g.beginPath(); g.moveTo(x - w, row.rail); g.lineTo(x - w, top + w * 0.6); g.quadraticCurveTo(x - w, top, x, top); g.quadraticCurveTo(x + w, top, x + w, top + w * 0.6); g.lineTo(x + w, row.rail); g.fill(); g.fillStyle = 'rgba(160,180,230,0.18)'; g.fillRect(x - w * 0.8, top + w * 0.4, w * 0.4, row.rail - top - w * 0.4); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(x + w * 0.5, top + w * 0.4, w * 0.5, row.rail - top - w * 0.4); }
  function houseRail(g, row) {
    for (const sd of [-1, 1]) {
      const x0 = sd < 0 ? 0 : CX + row.inner - row.Hs * 0.2, x1 = sd < 0 ? CX - row.inner + row.Hs * 0.2 : BW;
      vg(g, x0, row.rail - 2, x1 - x0, 13, ['#8a5a30', '#5a3618', '#2a180a']); g.fillStyle = '#b88050'; g.fillRect(x0, row.rail - 2, x1 - x0, 1.2);
    }
  }
  function rostrumTier(g, hw, top, bot) {
    vg(g, CX - hw, top, hw * 2, bot - top, ['#6a4020', '#4a2a12', '#2a160a']);
    g.fillStyle = '#8a5a30'; g.fillRect(CX - hw - 2, top - 3, hw * 2 + 4, 4); g.fillStyle = '#c89060'; g.fillRect(CX - hw - 2, top - 3, hw * 2 + 4, 1);
    const n = Math.round(hw / 16); for (let i = 0; i < n * 2; i++) { const x = CX - hw + 4 + i * (hw * 2 - 8) / (n * 2); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x, top + 4, 1.2, bot - top - 7); g.fillStyle = 'rgba(255,200,150,0.1)'; g.fillRect(x + 1.2, top + 4, 1, bot - top - 7); }
    g.fillStyle = 'rgba(0,0,0,0.4)'; g.fillRect(CX - hw, bot - 2, hw * 2, 2);
  }
  // the Speaker's desk on the top tier and the President's lectern with its microphones in front of it
  function rostrumTop(g) {
    rostrumTier(g, 94, 98, 124);
    vg(g, CX - 15, 104, 30, 20, ['#7a4a24', '#4a2a12']); g.fillStyle = '#9a6a3a'; g.fillRect(CX - 17, 102, 34, 3);
    for (const dx of [-6, 6]) { R.line(g, CX + dx, 102, CX + dx * 1.4, 92, '#1a1a1a', 0.9); g.fillStyle = '#2a2a2a'; g.fillRect(CX + dx * 1.4 - 1.2, 89, 2.4, 3.6); }
  }
  const HOUSE_LEADERS = [{ x: CX - 26, coat: '#1a1c24', shirt: '#f0ece4', tie: '#8a1a24', skin: SKINS[0], hair: '#c8c4bc', style: 0, ph: 1, eager: 0.5, cheer: 'clap' }, { x: CX + 26, coat: '#22283a', shirt: '#f0ece4', tie: '#1a2a6a', skin: SKINS[1], hair: '#8a8680', style: 1, ph: 2, eager: 0.7, cheer: 'clap' }];
  function house(B, F) {
    setSeed(91);
    // ceiling: coffers around the stained-glass skylight
    vg(B, 0, 0, BW, 16, ['#3a2e1a', '#6a5634']);
    for (let x = 0; x < BW; x += 22) { B.fillStyle = 'rgba(0,0,0,0.3)'; B.fillRect(x, 0, 2, 16); B.fillStyle = 'rgba(232,200,120,0.25)'; B.fillRect(x + 4, 3, 14, 9); }
    vg(B, CX - 150, 0, 300, 14, ['#b89848', '#e8d090', '#a88838']); B.fillStyle = '#7a5a20'; B.fillRect(CX - 150, 13, 300, 2);
    // the gallery: a balcony of visitors all the way round
    vg(B, 0, 16, BW, 36, ['#3a2c1c', '#4a3824']);
    const gal = prng(57);
    for (let x = 6; x < BW; x += 9) { if (Math.abs(x - CX) < 150) continue; member(B, x + gal() * 3, 46, 30, { coat: ['#2a2a32', '#5a3a2a', '#3a4a6a', '#6a2a2a', '#2a4a3a'][(gal() * 5) | 0], shirt: '#e8e0d0', skin: SKINS[(gal() * 6) | 0], hair: ['#1a1208', '#6a4428', '#8a8680'][(gal() * 3) | 0], style: (gal() * 4) | 0, ph: 0 }, 0, 0); }
    vg(B, 0, 44, BW, 8, ['#c8a060', '#8a6030', '#4a2e14']); for (let x = 0; x < BW; x += 6) { B.fillStyle = 'rgba(40,20,8,0.5)'; B.fillRect(x, 46, 1.2, 6); }
    // cream walls with marble pilasters, doors under the gallery
    vg(B, 0, 52, BW, FY - 52, ['#a89070', '#c8b08a', '#8a7454']);
    for (let x = 30; x < BW; x += 96) { if (Math.abs(x - CX) < 190) continue; hgf(B, x - 9, 52, 18, FY - 52, ['#5a5040', '#9a8a70', '#c8b898', '#6a5c48']); B.fillStyle = '#e8d8b0'; B.fillRect(x - 11, 52, 22, 4); }
    for (const x of [CX - 430, CX + 430, CX - 610, CX + 610]) { B.fillStyle = '#3a2412'; B.fillRect(x - 16, 74, 32, 60); B.fillStyle = '#5a3a1e'; B.fillRect(x - 13, 78, 12, 52); B.fillRect(x + 1, 78, 12, 52); B.fillStyle = '#c8a040'; B.fillRect(x - 3, 102, 2, 4); B.fillRect(x + 1, 102, 2, 4); }
    // behind the rostrum: dark marble pilasters, IN GOD WE TRUST, the flag between the fasces
    vg(B, CX - 160, 16, 320, FY - 16, ['#4a4236', '#6a5e4a', '#4a4236']);
    for (const dx of [-150, -96, 96, 150]) hgf(B, CX + dx - 9, 16, 18, 110, ['#2a2620', '#5a5246', '#3a342a']);
    B.fillStyle = '#e8c860'; B.font = 'bold 8px Georgia, serif'; B.textAlign = 'center'; B.fillText('IN GOD WE TRUST', CX, 26); B.textAlign = 'left';
    { const fx = CX - 26, fy = 31, fw = 52, fh = 74;   // hung vertically: stripes run down, the union at the upper left
      for (let i = 0; i < 13; i++) { const x0 = fx + i * fw / 13; hgf(B, x0, fy, fw / 13 + 0.4, fh, i % 2 ? ['#d8d0c0', '#f4f0e8', '#d8d0c0'] : ['#8a1018', '#b81c28', '#8a1018']); }
      B.fillStyle = '#1e2a5a'; B.fillRect(fx, fy, fw * 7 / 13, fh * 0.42);
      B.fillStyle = '#f0eee8'; for (let r = 0; r < 9; r++) for (let c = 0; c < 5; c++) B.fillRect(fx + 2.5 + c * 5 + (r % 2) * 2.4, fy + 2.5 + r * 3.2, 1, 1);
      for (let i = 0; i < 6; i++) { B.fillStyle = 'rgba(0,0,0,0.12)'; B.fillRect(fx + 4 + i * 9, fy, 2, fh); }
      B.fillStyle = '#c8a040'; B.fillRect(fx - 3, fy - 3, fw + 6, 3);
    }
    for (const sd of [-1, 1]) {   // the bronze fasces: a bundle of rods bound with straps, an axe blade at the top
      const x = CX + sd * 52, top = 34, bot = 104;
      hgf(B, x - 5, top, 10, bot - top, ['#4a3010', '#c89a40', '#e8c060', '#7a5418']);
      B.fillStyle = 'rgba(40,24,6,0.6)'; for (let i = -2; i <= 2; i++) B.fillRect(x + i * 2 - 0.4, top, 0.8, bot - top);
      for (const yy of [top + 10, (top + bot) / 2, bot - 10]) { B.fillStyle = '#8a6420'; B.fillRect(x - 6, yy, 12, 3); }
      B.fillStyle = '#d8b050'; B.beginPath(); B.moveTo(x - sd * 5, top + 2); B.quadraticCurveTo(x - sd * 14, top + 8, x - sd * 5, top + 16); B.fill();
    }
    // the Mace of the House on its green marble pedestal at the Speaker's right: a silver eagle on a globe
    { const x = CX - 118; vg(B, x - 7, 104, 14, 46, ['#2a5a40', '#1a3a28']); B.fillStyle = '#4a8a64'; B.fillRect(x - 8, 104, 16, 2);
      for (let i = -2; i <= 2; i++) R.line(B, x + i * 1.2, 104, x + i * 0.8, 62, '#1a1210', 1.1); B.fillStyle = '#c8ccd4'; B.fillRect(x - 3, 72, 6, 2); B.fillRect(x - 3, 88, 6, 2);
      R.ball(B, x, 58, 5, '#d8dce4'); B.fillStyle = '#e8ecf4'; B.beginPath(); B.moveTo(x, 53); B.lineTo(x - 7, 48); B.lineTo(x - 2, 52); B.lineTo(x, 47); B.lineTo(x + 2, 52); B.lineTo(x + 7, 48); B.closePath(); B.fill(); }
    // the rostrum: three tiers of carved walnut, each wider and lower than the one above
    rostrumTier(B, 170, 152, FY); rostrumTier(B, 132, 124, 152);
    // the Speaker's and Vice President's high-backed chairs on the top tier
    for (const dx of [-26, 26]) { B.fillStyle = '#2a1a10'; B.beginPath(); B.moveTo(CX + dx - 11, 98); B.lineTo(CX + dx - 11, 64); B.quadraticCurveTo(CX + dx, 56, CX + dx + 11, 64); B.lineTo(CX + dx + 11, 98); B.fill(); B.fillStyle = '#4a2a1a'; B.fillRect(CX + dx - 8, 66, 16, 30); }
    rostrumTop(B);
    // the seal on the lowest tier
    R.ball(B, CX, 168, 11, '#c8a050'); R.ball(B, CX, 168, 8.5, '#1e2a5a'); B.fillStyle = '#e8d090'; B.beginPath(); B.moveTo(CX, 162); B.lineTo(CX - 6, 167); B.lineTo(CX - 2, 167); B.lineTo(CX, 174); B.lineTo(CX + 2, 167); B.lineTo(CX + 6, 167); B.fill();
    glow(B, CX, 60, 260, 'rgba(255,230,180,0.14)');
    vignette(B, BW);
    // the well of the House: deep blue carpet with gold stars
    pfloor(F, 'stone', '#24346a', '#121a3a', { rows: 7, span: 70 });
    F.fillStyle = 'rgba(230,200,100,0.45)'; for (let i = 0; i < 70; i++) { const x = rand() * AWX, y = FY + 6 + rand() * 48; F.beginPath(); for (let j = 0; j < 5; j++) { const a = -PI / 2 + j * PI * 4 / 5; F.lineTo(x + Math.cos(a) * 2.6, y + Math.sin(a) * 1.5); } F.fill(); }
  }

  // =====================================================================================
  // THE STATEN ISLAND FERRY at dusk: the open stern deck of the orange ferry crossing the harbor,
  // Lower Manhattan lighting up on one side, the Statue of Liberty floodlit on the other
  // =====================================================================================
  const HARBOR = 140;   // the waterline on the back layer
  // a tower with its windows coming on for the evening
  function tower(g, x, w, top, c, o = {}) {
    const base = HARBOR + 2;
    hgf(g, x, top, w, base - top, [shade(c, 0.12), c, shade(c, -0.25)]);
    const cols = Math.max(2, Math.floor(w / 3)), rows = Math.floor((base - top - 3) / 3);
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const v = rand(); if (v > (o.lit || 0.4)) continue;
      g.fillStyle = v < 0.06 ? 'rgba(200,220,255,0.75)' : `rgba(255,${200 + (rand() * 40) | 0},${110 + (rand() * 60) | 0},${0.5 + rand() * 0.45})`;
      g.fillRect(x + 1.2 + k * (w - 2) / cols, top + 2.5 + r * 3, 1, 1.4);
    }
    if (o.glow) { g.fillStyle = 'rgba(255,170,120,0.22)'; g.fillRect(x + w * 0.6, top, w * 0.4, base - top); }
  }
  // One World Trade Center: chamfered corners make long triangles of glass, the spire on top
  function oneWTC(g, x, top) {
    const bw = 30, tw = 17, base = HARBOR + 2;
    g.fillStyle = '#3a4a6a'; g.beginPath(); g.moveTo(x - bw / 2, base); g.lineTo(x - tw / 2, top); g.lineTo(x + tw / 2, top); g.lineTo(x + bw / 2, base); g.fill();
    // the sunset caught in the west face, the facets alternating light and shade
    const lg = g.createLinearGradient(0, top, 0, base); lg.addColorStop(0, '#f0b890'); lg.addColorStop(0.5, '#a88aa8'); lg.addColorStop(1, '#4a5a7a');
    g.fillStyle = lg; g.beginPath(); g.moveTo(x - tw / 2, top); g.lineTo(x + tw / 2, top); g.lineTo(x, base); g.fill();
    g.fillStyle = 'rgba(20,30,60,0.45)'; g.beginPath(); g.moveTo(x + tw / 2, top); g.lineTo(x + bw / 2, base); g.lineTo(x, base); g.fill();
    g.fillStyle = 'rgba(255,220,200,0.25)'; g.beginPath(); g.moveTo(x - tw / 2, top); g.lineTo(x - bw / 2, base); g.lineTo(x, base); g.fill();
    for (let y = top + 3; y < base; y += 3) { const w = tw + (bw - tw) * (y - top) / (base - top); g.fillStyle = 'rgba(20,24,40,0.25)'; g.fillRect(x - w / 2, y, w, 0.6); }
    g.fillStyle = '#8a9ab0'; g.fillRect(x - tw / 2, top - 3, tw, 3); g.fillStyle = '#c8d0e0'; g.fillRect(x - 1, top - 34, 2, 31); g.fillRect(x - 3, top - 6, 6, 3);
    return [x, top - 34];
  }
  // the Statue of Liberty on her island: the star fort, the granite pedestal, the copper-green figure, torch high
  function liberty(g, x) {
    const base = HARBOR;
    // island and trees
    g.fillStyle = '#1a2418'; g.beginPath(); g.moveTo(x - 90, base + 2); g.quadraticCurveTo(x, base - 12, x + 90, base + 2); g.fill();
    for (let i = 0; i < 26; i++) { const tx = x + rr(-80, 80); g.fillStyle = shade('#1e3420', rr(-0.2, 0.1)); g.beginPath(); g.arc(tx, base - 4 - rr(0, 6) * (1 - Math.abs(tx - x) / 90), rr(3, 6), 0, PI * 2); g.fill(); }
    // Fort Wood's star-shaped walls
    g.fillStyle = '#8a7e6a'; g.beginPath(); g.moveTo(x - 34, base - 4); g.lineTo(x - 26, base - 12); g.lineTo(x - 14, base - 9); g.lineTo(x, base - 14); g.lineTo(x + 14, base - 9); g.lineTo(x + 26, base - 12); g.lineTo(x + 34, base - 4); g.fill();
    g.fillStyle = 'rgba(255,220,170,0.3)'; g.fillRect(x - 30, base - 10, 60, 2);
    // the pedestal, floodlit from below
    const pt = base - 58, pb = base - 12;
    const pg = g.createLinearGradient(0, pt, 0, pb); pg.addColorStop(0, '#8a7c66'); pg.addColorStop(1, '#e8d4a8');
    g.fillStyle = pg; g.beginPath(); g.moveTo(x - 17, pb); g.lineTo(x - 13, pt + 8); g.lineTo(x + 13, pt + 8); g.lineTo(x + 17, pb); g.fill();
    g.fillStyle = '#b8a888'; g.fillRect(x - 15, pt + 4, 30, 4); g.fillStyle = '#d8c8a0'; g.fillRect(x - 12, pt, 24, 5); g.fillRect(x - 16, pb - 16, 32, 3);
    g.fillStyle = 'rgba(40,30,20,0.55)'; for (const dx of [-8, -3, 2, 7]) g.fillRect(x + dx, pt + 12, 2, 8);
    g.fillStyle = 'rgba(0,0,0,0.25)'; g.beginPath(); g.moveTo(x + 4, pb); g.lineTo(x + 3, pt + 8); g.lineTo(x + 13, pt + 8); g.lineTo(x + 17, pb); g.fill();
    // the figure: robe in long folds, the tablet in her left arm, the right arm raised with the torch
    const ft = pt, sy = ft - 40, CU = '#5aa48e', LT = '#9adcc8', DK = '#2a5e52';
    const rg = g.createLinearGradient(x - 9, 0, x + 9, 0); rg.addColorStop(0, LT); rg.addColorStop(0.45, CU); rg.addColorStop(1, DK);
    g.fillStyle = rg; g.beginPath(); g.moveTo(x - 9, ft); g.quadraticCurveTo(x - 10, sy + 20, x - 7, sy + 2); g.quadraticCurveTo(x, sy - 2, x + 7, sy + 2); g.quadraticCurveTo(x + 10, sy + 20, x + 9, ft); g.fill();
    g.strokeStyle = 'rgba(20,60,50,0.55)'; g.lineWidth = 0.7; for (const dx of [-5, -2, 1, 4, 6.5]) { g.beginPath(); g.moveTo(x + dx * 0.7, sy + 8); g.quadraticCurveTo(x + dx, sy + 24, x + dx * 1.1, ft); g.stroke(); }
    g.strokeStyle = 'rgba(20,60,50,0.6)'; g.beginPath(); g.moveTo(x - 7, sy + 6); g.quadraticCurveTo(x, sy + 14, x + 8, sy + 10); g.stroke();
    // tablet
    g.fillStyle = '#7ac4b0'; g.beginPath(); g.moveTo(x + 4, sy + 9); g.lineTo(x + 10, sy + 7); g.lineTo(x + 12, sy + 24); g.lineTo(x + 6, sy + 26); g.fill(); g.fillStyle = DK; g.beginPath(); g.moveTo(x + 10, sy + 7); g.lineTo(x + 12, sy + 24); g.lineTo(x + 13, sy + 23); g.lineTo(x + 11, sy + 6); g.fill();
    R.line(g, x + 6, sy + 5, x + 6, sy + 14, CU, 2.6);
    // raised right arm and torch
    R.line(g, x - 5, sy + 2, x - 8, sy - 12, CU, 3.2); R.line(g, x - 8, sy - 12, x - 9, sy - 24, LT, 2.8);
    g.fillStyle = '#c8a050'; g.fillRect(x - 11, sy - 29, 4, 4); g.fillStyle = '#ffd070'; g.beginPath(); g.moveTo(x - 12, sy - 29); g.quadraticCurveTo(x - 9, sy - 38, x - 6, sy - 29); g.fill();
    // head and the crown of seven rays
    g.fillStyle = CU; g.beginPath(); g.ellipse(x, sy - 4, 3.4, 4, 0, 0, PI * 2); g.fill(); g.fillStyle = LT; g.beginPath(); g.ellipse(x - 1, sy - 4, 1.8, 3, 0, 0, PI * 2); g.fill();
    g.fillStyle = CU; for (let i = 0; i < 7; i++) { const a = -PI / 2 + (i - 3) * 0.36; g.beginPath(); g.moveTo(x + Math.cos(a - 0.12) * 3.4, sy - 6 + Math.sin(a - 0.12) * 3); g.lineTo(x + Math.cos(a) * 9, sy - 6 + Math.sin(a) * 8); g.lineTo(x + Math.cos(a + 0.12) * 3.4, sy - 6 + Math.sin(a + 0.12) * 3); g.fill(); }
    glow(g, x, sy + 10, 60, 'rgba(160,255,220,0.18)');
    return [x - 9, sy - 33];
  }
  // a little silhouette of the Brooklyn Bridge far up the East River
  function brooklynBridge(g, x0, x1) {
    const deck = HARBOR - 6, t0 = x0 + (x1 - x0) * 0.25, t1 = x0 + (x1 - x0) * 0.75, th = 22, col = 'rgba(70,70,96,0.85)';
    g.fillStyle = col; g.fillRect(x0, deck, x1 - x0, 2);
    for (const tx of [t0, t1]) { g.fillRect(tx - 4, deck - th, 8, th + 6); g.fillStyle = 'rgba(255,170,130,0.5)'; g.fillRect(tx - 2.5, deck - th + 6, 1.6, 7); g.fillRect(tx + 0.9, deck - th + 6, 1.6, 7); g.fillStyle = col; }
    g.strokeStyle = col; g.lineWidth = 0.6;
    for (const [a, b] of [[x0, t0], [t0, t1], [t1, x1]]) for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(a, a === x0 ? deck : deck - th + 2); g.quadraticCurveTo((a + b) / 2, deck - (a === t0 ? 2 : th * 0.5) + k, b, b === x1 ? deck : deck - th + 2); g.stroke(); }
  }
  const FERRY = { spire: [0, 0], torch: [0, 0], lamps: [] };
  // the white pipe rails and their stanchions (redrawn over the wake each frame)
  function ferryRail(g) {
    for (const y of [138, 150]) { g.fillStyle = '#dcd8d0'; g.fillRect(0, y, BW, 2); g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(0, y + 2, BW, 0.8); }
    for (let x = 8; x < BW; x += 40) { g.fillStyle = '#a8a49c'; g.fillRect(x - 1.5, 136, 3, 30); g.fillStyle = '#f0ece4'; g.fillRect(x - 0.8, 136, 1.2, 30); }
  }
  function ferry(B, F) {
    setSeed(141);
    // dusk: deep blue overhead, the last of the sunset low over New Jersey behind the statue
    vg(B, 0, 0, BW, HARBOR, ['#0c1230', '#22224a', '#5a3058', '#c0604a', '#f09a50']);
    glow(B, 960, HARBOR, 360, 'rgba(255,150,80,0.32)');
    stars(B, 60, 50);
    // long streaks of cloud catching the sunset underneath
    for (let i = 0; i < 16; i++) { const x = rr(0, BW), y = rr(36, 118), w = rr(60, 200), h = rr(1.5, 4); B.fillStyle = `rgba(60,36,70,${rr(0.25, 0.45)})`; B.beginPath(); B.ellipse(x, y, w, h, 0, 0, PI * 2); B.fill(); B.fillStyle = `rgba(255,${140 + (rand() * 50) | 0},110,${rr(0.2, 0.4)})`; B.beginPath(); B.ellipse(x + w * 0.1, y + h * 0.6, w * 0.8, h * 0.45, 0, 0, PI * 2); B.fill(); }
    // far shores: low and hazy, a few lights
    B.fillStyle = '#2a2440'; B.beginPath(); B.moveTo(0, HARBOR); for (let x = 0; x <= BW; x += 20) B.lineTo(x, HARBOR - 3 - fbmLite(x) * 6); B.lineTo(BW, HARBOR); B.fill();
    for (let i = 0; i < 90; i++) { B.fillStyle = `rgba(255,210,150,${rr(0.3, 0.8)})`; B.fillRect(rr(0, BW), HARBOR - rr(1, 6), 1, 1); }
    // Lower Manhattan: a wall of towers, the tallest in the middle, the Brooklyn Bridge beyond
    brooklynBridge(B, 620, 760);
    const towers = [[168, 14, 104], [184, 16, 92], [200, 12, 110], [214, 18, 84], [232, 14, 100], [248, 20, 78], [268, 16, 96], [286, 22, 70], [308, 14, 88], [322, 18, 64], [340, 16, 76], [356, 20, 58], [376, 14, 66], [452, 22, 50], [474, 18, 72], [494, 16, 58], [512, 24, 68], [538, 14, 80], [554, 20, 86], [576, 16, 98], [594, 20, 110], [612, 14, 118]];
    for (const [x, w, top] of towers) tower(B, x, w, top, ['#2a3050', '#343a58', '#3a3450', '#2a2a44', '#40405a'][(rand() * 5) | 0], { lit: 0.42, glow: rand() < 0.5 });
    // 40 Wall Street's green pyramid roof and spire, 70 Pine's stepped crown
    tower(B, 520, 16, 58, '#3a3a52', { lit: 0.4 }); B.fillStyle = '#3a7a6a'; B.beginPath(); B.moveTo(518, 58); B.lineTo(528, 42); B.lineTo(538, 58); B.fill(); B.fillStyle = '#c8d8d0'; B.fillRect(527.4, 30, 1.2, 12);
    tower(B, 470, 18, 56, '#4a4258', { lit: 0.45 }); B.fillStyle = '#4a4258'; B.fillRect(473, 48, 12, 8); B.fillRect(476, 40, 6, 8); B.fillStyle = '#d8c8b0'; B.fillRect(478.4, 28, 1.2, 12);
    // the Woolworth Building's pale Gothic crown farther uptown
    tower(B, 390, 14, 60, '#6a6478', { lit: 0.35 }); B.fillStyle = '#7a7488'; B.beginPath(); B.moveTo(391, 60); B.lineTo(397, 46); B.lineTo(403, 60); B.fill(); B.fillRect(396.4, 38, 1.2, 9);
    FERRY.spire = oneWTC(B, 430, 34);
    tower(B, 446, 18, 66, '#3a4462', { lit: 0.5 }); tower(B, 404, 16, 74, '#33405e', { lit: 0.45 });
    // Battery Park's trees along the water
    for (let x = 160; x < 630; x += 5) { B.fillStyle = shade('#14201a', rr(-0.2, 0.2)); B.beginPath(); B.arc(x, HARBOR - rr(0, 3), rr(2.5, 4.5), 0, PI * 2); B.fill(); }
    FERRY.torch = liberty(B, 850);
    // the harbor: dark water carrying the city's lights and the sunset
    vg(B, 0, HARBOR, BW, FY - HARBOR, ['#3a2e4a', '#1e2240', '#121830']);
    for (const [x, w] of towers) { for (let i = 0; i < 4; i++) { B.fillStyle = `rgba(255,200,130,${rr(0.08, 0.2)})`; B.fillRect(x + rr(0, w), HARBOR + 2 + i * 6 + rr(0, 4), rr(2, 6), 0.8); } }
    for (let i = 0; i < 40; i++) { B.fillStyle = `rgba(255,160,90,${rr(0.1, 0.3)})`; B.fillRect(rr(820, 1180), rr(HARBOR + 2, 170), rr(4, 18), 0.8); }
    B.fillStyle = 'rgba(160,255,220,0.25)'; for (let i = 0; i < 8; i++) B.fillRect(844 + rr(-4, 4), HARBOR + 3 + i * 3.4, rr(3, 10), 0.8);
    // the ferry's stern rail: white pipe rails on stanchions over the orange bulwark, life rings, deck lamps
    const bt = 166;
    vg(B, 0, bt, BW, FY - bt, ['#f07a28', '#d05a14', '#8a3a0c']); B.fillStyle = '#ffb070'; B.fillRect(0, bt, BW, 1.2);
    for (let x = 0; x < BW; x += 46) { B.fillStyle = 'rgba(0,0,0,0.25)'; B.fillRect(x, bt + 2, 1, FY - bt - 2); B.fillStyle = 'rgba(80,30,8,0.6)'; for (let y = bt + 4; y < FY; y += 6) B.fillRect(x + 3, y, 1, 1); }
    B.fillStyle = '#e8e4dc'; B.fillRect(0, bt - 3, BW, 3); B.fillStyle = '#9a968e'; B.fillRect(0, bt - 1, BW, 1);
    ferryRail(B);
    for (const x of [300, 980]) { B.strokeStyle = '#f07a28'; B.lineWidth = 4; B.beginPath(); B.arc(x, 176, 7, 0, PI * 2); B.stroke(); B.strokeStyle = '#f0ece4'; B.lineWidth = 4; for (let k = 0; k < 4; k++) { B.beginPath(); B.arc(x, 176, 7, k * PI / 2, k * PI / 2 + 0.5); B.stroke(); } B.strokeStyle = '#6a2a08'; B.lineWidth = 0.6; B.beginPath(); B.arc(x, 176, 9, 0, PI * 2); B.stroke(); }
    FERRY.lamps = [150, 560, 760, 1140];
    for (const x of FERRY.lamps) { B.fillStyle = '#2a2a2a'; B.fillRect(x - 1, 118, 2, 18); B.fillStyle = '#3a3a3a'; B.fillRect(x - 3, 114, 6, 5); B.fillStyle = '#fff0c0'; B.fillRect(x - 2, 115, 4, 3); glow(B, x, 117, 26, 'rgba(255,220,150,0.6)'); }
    // the flag at the stern
    B.fillStyle = '#c8c4bc'; B.fillRect(1040, 60, 2, 106); R.ball(B, 1041, 59, 2, '#d8b040');
    vignette(B, BW);
    // the deck: painted steel plates, wet with spray, a yellow line along the stern
    pfloor(F, 'stone', '#5e6a66', '#2e3634', { rows: 7, span: 76, wet: true });
    F.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 260; i++) F.fillRect(rand() * AWX, FY + 4 + rand() * (H - FY - 4), 1, 1);
    F.fillStyle = '#d8b030'; F.fillRect(0, FY + 1, AWX, 2);
  }
  const fbmLite = x => (Math.sin(x * 0.031) + Math.sin(x * 0.083 + 1.3) * 0.6 + Math.sin(x * 0.17 + 2.1) * 0.3 + 1.9) / 3.8;

  // =====================================================================================
  // YOSEMITE VALLEY from Tunnel View: El Capitan in the morning sun, Half Dome far off up the valley,
  // Cathedral Rocks and Bridalveil Fall in shadow, mist over the forest, the overlook's stone wall
  // =====================================================================================
  const YOSE = { fall: [736, 102, 140] };
  // a granite wall: clipped to its outline, lit across, streaked top to bottom by old water stains
  function graniteFace(g, pts, light, dark, haze, streaks) {
    g.save(); g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    hgf(g, x0, y0, x1 - x0, y1 - y0, [light, shade(light, -0.06), dark]);
    for (let i = 0; i < streaks; i++) {
      const x = rr(x0, x1), top = rr(y0, y0 + (y1 - y0) * 0.5), len = rr(10, y1 - top), w = rr(0.6, 3);
      const gr = g.createLinearGradient(0, top, 0, top + len), dk = rand() < 0.7;
      gr.addColorStop(0, dk ? `rgba(40,40,50,${rr(0.1, 0.35)})` : `rgba(255,255,250,${rr(0.08, 0.25)})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x, top, w, len);
    }
    for (let i = 0; i < streaks / 4; i++) { g.fillStyle = `rgba(60,60,70,${rr(0.05, 0.15)})`; g.fillRect(rr(x0, x1), rr(y0, y1), rr(6, 24), rr(0.6, 1.4)); }
    if (haze) { g.fillStyle = haze; g.fillRect(x0, y0, x1 - x0, y1 - y0); }
    g.restore();
  }
  // a conifer: a narrow spire of drooping boughs
  function conifer(g, x, y, h, c, lit) {
    const w = h * 0.22;
    g.fillStyle = c; g.beginPath(); g.moveTo(x, y - h);
    for (let i = 1; i <= 6; i++) { const t = i / 6, yy = y - h + h * 0.92 * t, ww = w * t * (0.85 + rand() * 0.3); g.lineTo(x + ww, yy); g.lineTo(x + ww * 0.55, yy - h * 0.03); }
    for (let i = 6; i >= 1; i--) { const t = i / 6, yy = y - h + h * 0.92 * t, ww = w * t * (0.85 + rand() * 0.3); g.lineTo(x - ww * 0.55, yy - h * 0.03); g.lineTo(x - ww, yy); }
    g.closePath(); g.fill();
    if (lit) { g.fillStyle = lit; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x - w * 0.9, y - h * 0.1); g.lineTo(x - w * 0.2, y - h * 0.1); g.closePath(); g.fill(); }
  }
  // a hillside thick with conifers: shaded top to bottom, trees packed in, lit on their sunny side
  function forested(g, pts, c1, c2, n, h0, h1, tree, lit) {
    g.save(); g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9; for (const [x, y] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    vg(g, x0, y0, x1 - x0, y1 - y0, [c1, c2]);
    const ts = []; for (let i = 0; i < n; i++) ts.push([rr(x0, x1), rr(y0, y1 + h1 * 0.6)]); ts.sort((a, b) => a[1] - b[1]);
    for (const [x, y] of ts) conifer(g, x, y, rr(h0, h1), shade(tree, rr(-0.22, 0.1)), lit);
    for (let i = 0; i < (x1 - x0) / 30; i++) { const gx = rr(x0, x1), gy = rr(y0, y1 - 20); g.fillStyle = 'rgba(0,0,0,0.18)'; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + rr(-6, 6), y1); g.lineTo(gx + rr(4, 10), y1); g.closePath(); g.fill(); }
    g.restore();
  }
  // the big sugar pine in the left foreground: a straight trunk, long level limbs with clumps of needles
  function bigPine(g, x, y, h) {
    hgf(g, x - 4, y - h, 8, h, ['#2a1a10', '#6a4428', '#3a2414']);
    for (let i = 0; i < 18; i++) {
      const t = i / 17, yy = y - h * (0.32 + t * 0.66), len = h * (0.24 - t * 0.12) * rr(0.7, 1.3), sd = i % 2 ? 1 : -1, ex = x + sd * len, ey = yy + rr(-4, 6);
      R.line(g, x, yy + 3, ex, ey, '#2a1a10', 1.6);
      for (let k = 0; k < 5; k++) { const bx = x + sd * len * rr(0.3, 1.05), by = ey + rr(-6, 4) - (bx - x) * 0.02; g.fillStyle = shade('#1e3a22', rr(-0.25, 0.08)); g.beginPath(); g.ellipse(bx, by, rr(7, 13), rr(3.5, 6), rr(-0.3, 0.3), 0, PI * 2); g.fill(); g.fillStyle = 'rgba(170,200,120,0.22)'; g.beginPath(); g.ellipse(bx - 2, by - 2, rr(4, 7), rr(1.5, 3), 0, 0, PI * 2); g.fill(); }
    }
  }
  function yosemite(B, F) {
    setSeed(171);
    // clear morning sky, wisps of cirrus combed across it, one contrail
    vg(B, 0, 0, BW, 140, ['#1a52b0', '#3a7ad0', '#7aaee0', '#c0d8ee']);
    for (let i = 0; i < 40; i++) {
      const x = rr(-100, BW), y = rr(6, 96), len = rr(60, 190), bend = rr(-16, 16), a = rr(0.03, 0.09);
      for (let k = 0; k < 4; k++) { B.strokeStyle = `rgba(255,255,255,${a})`; B.lineWidth = 1 + k * 1.6; B.beginPath(); B.moveTo(x, y + k * 0.6); B.quadraticCurveTo(x + len * 0.5, y - len * 0.2 + bend, x + len, y - len * 0.08); B.stroke(); }
    }
    B.strokeStyle = 'rgba(255,255,255,0.45)'; B.lineWidth = 0.8; B.beginPath(); B.moveTo(820, 50); B.lineTo(1160, 42); B.stroke();
    // the high country far up the valley, snow on the peaks
    B.fillStyle = '#a8bcd4'; B.beginPath(); B.moveTo(560, 136); B.lineTo(596, 118); B.lineTo(612, 110); B.lineTo(626, 116); B.lineTo(652, 112); B.lineTo(700, 124); B.lineTo(740, 136); B.fill();
    B.fillStyle = '#eef4fa'; B.beginPath(); B.moveTo(606, 112); B.lineTo(612, 110); B.lineTo(620, 113); B.lineTo(613, 116); B.fill();
    // Half Dome: the long rounded back, then the sheer face cut straight down
    B.fillStyle = '#b4c2d6'; B.beginPath(); B.moveTo(628, 136); B.quadraticCurveTo(636, 104, 672, 96); B.quadraticCurveTo(684, 94, 690, 97); B.lineTo(691, 136); B.fill();
    B.fillStyle = 'rgba(255,255,255,0.3)'; B.beginPath(); B.moveTo(640, 118); B.quadraticCurveTo(650, 102, 672, 98); B.lineTo(676, 100); B.quadraticCurveTo(656, 106, 646, 124); B.fill();
    hgf(B, 682, 97, 9, 39, ['rgba(120,140,170,0.2)', 'rgba(100,120,155,0.6)']);
    // the nearer walls up the valley: blue, hazy
    B.fillStyle = '#7a8eaa'; B.beginPath(); B.moveTo(500, 142); B.lineTo(546, 122); B.lineTo(592, 126); B.lineTo(632, 134); B.lineTo(632, 142); B.fill();
    B.fillStyle = '#6e84a4'; B.beginPath(); B.moveTo(690, 142); B.lineTo(694, 116); B.lineTo(712, 108); B.lineTo(730, 114); B.lineTo(730, 142); B.fill();
    // the south wall in shadow, rising to the right; Cathedral Rocks' lit peak; the cliff Bridalveil Fall drops from
    const SW = [[790, 150]]; for (let x = 800; x <= 1280; x += 12) SW.push([x, Math.max(20 + rr(0, 6), Math.min(150, 124 - (x - 826) * 0.42) + rr(-4, 4))]); SW.push([1280, 150]);
    graniteFace(B, SW, '#7e889e', '#3a4458', 'rgba(90,110,150,0.3)', 110);
    forested(B, [[830, 150], [860, 118], [960, 96], [1100, 84], [1280, 70], [1280, 150]], 'rgba(40,60,70,0.5)', 'rgba(30,46,52,0.9)', 420, 4, 10, '#26363e', null);
    graniteFace(B, [[750, 150], [758, 124], [770, 100], [784, 80], [794, 70], [804, 76], [818, 96], [830, 120], [840, 150]], '#e4e2dc', '#5a6478', 'rgba(110,130,170,0.18)', 50);
    graniteFace(B, [[712, 150], [714, 112], [724, 100], [742, 98], [756, 108], [760, 150]], '#8a94aa', '#4a5468', 'rgba(100,120,160,0.25)', 30);
    YOSE.fall = [736, 102, 140];
    vg(B, YOSE.fall[0] - 1.5, YOSE.fall[1], 3, YOSE.fall[2] - YOSE.fall[1], ['rgba(255,255,255,0.9)', 'rgba(230,240,250,0.7)', 'rgba(230,240,250,0.2)']);
    // El Capitan: the great sheer face catching the morning between the near slope and its prow on the right
    const ELC = [[330, 150], [330, 54], [352, 42], [390, 34], [424, 34], [442, 40], [458, 56], [474, 84], [490, 114], [506, 150]];
    graniteFace(B, ELC, '#f4f0e8', '#a0a6b4', null, 200);
    B.save(); B.beginPath(); ELC.forEach(([x, y], i) => i ? B.lineTo(x, y) : B.moveTo(x, y)); B.closePath(); B.clip();
    const pr = B.createLinearGradient(456, 0, 506, 0); pr.addColorStop(0, 'rgba(60,70,90,0)'); pr.addColorStop(1, 'rgba(60,70,90,0.5)'); B.fillStyle = pr; B.fillRect(440, 30, 70, 130);
    B.fillStyle = 'rgba(40,60,40,0.55)'; for (let i = 0; i < 30; i++) B.fillRect(rr(360, 440), rr(35, 41), rr(1, 3), rr(1, 2.5));
    B.restore();
    // the near slope in front of El Capitan: forest and bare granite coming down from the upper left
    const SL = [[0, 150], [0, 34], [120, 38], [250, 44], [352, 56], [392, 88], [430, 122], [452, 150]];
    forested(B, SL, '#3a5a40', '#1e3424', 900, 5, 13, '#24402e', 'rgba(150,190,110,0.28)');
    graniteFace(B, [[170, 66], [204, 52], [246, 54], [290, 68], [306, 88], [268, 94], [214, 86]], '#d0ccc0', '#7a7a74', 'rgba(60,90,70,0.1)', 40);
    forested(B, [[170, 80], [214, 86], [268, 94], [306, 88], [330, 110], [180, 110]], 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 90, 5, 11, '#24402e', 'rgba(150,190,110,0.28)');
    // the valley floor: an unbroken forest, mist lying in the meadows
    vg(B, 0, 132, BW, FY - 132, ['#4a6a6a', '#2e4a3e', '#1a3026']);
    for (let i = 0; i < 2600; i++) { const y = 132 + Math.pow(rand(), 0.8) * (FY - 132), k = (y - 132) / (FY - 132); conifer(B, rr(0, BW), y, (3 + k * 14) * rr(0.7, 1.3), shade(k < 0.25 ? '#3e5e60' : '#24402e', rr(-0.2, 0.08) - k * 0.15), k > 0.3 ? 'rgba(150,190,110,0.18)' : null); if (i === 700 || i === 1500) fog(B, 132 + (i === 700 ? 0 : 12), 18, 'rgba(230,238,245,0.45)'); }
    // the tall pine on the left and a stand of firs on the right, close by
    bigPine(B, 210, FY, 182);
    for (const [x, h] of [[1060, 110], [1100, 140], [1150, 124], [1210, 160], [1250, 118], [120, 96], [60, 130]]) conifer(B, x, FY, h, '#18301e', 'rgba(140,180,90,0.18)');
    // the overlook's parapet: rough granite blocks in dark mortar
    const wt = 164;
    B.fillStyle = '#4a443c'; B.fillRect(0, wt, BW, FY - wt);
    for (let row = 0; row < 3; row++) for (let x = -rr(0, 20); x < BW;) { const w = rr(18, 34), y = wt + row * 7.4, h = 7; B.fillStyle = shade('#aca08c', rr(-0.16, 0.08) - row * 0.05); B.beginPath(); B.moveTo(x + 1.2, y + 1 + rr(0, 0.8)); B.lineTo(x + w - 1, y + 1); B.lineTo(x + w - 1.4, y + h - 0.4); B.lineTo(x + 1, y + h - 0.2); B.fill(); B.fillStyle = 'rgba(255,250,235,0.22)'; B.fillRect(x + 1.5, y + 1.2, w - 3, 1); B.fillStyle = 'rgba(0,0,0,0.15)'; B.fillRect(x + w - 4, y + 1, 2.6, h - 1.4); x += w; }
    B.fillStyle = '#8a7e6c'; B.fillRect(0, wt - 3, BW, 4); B.fillStyle = '#c8bca4'; B.fillRect(0, wt - 3, BW, 1.2);
    vignette(B, BW);
    // the overlook: sun-warmed paving stones, needles blown across them
    pfloor(F, 'stone', '#a89a86', '#5a5044', { rows: 7, span: 60 });
    for (let i = 0; i < 220; i++) { F.strokeStyle = `rgba(90,60,30,${rr(0.3, 0.6)})`; F.lineWidth = 0.6; const x = rand() * AWX, y = FY + 4 + rand() * (H - FY - 6), a = rand() * PI; F.beginPath(); F.moveTo(x, y); F.lineTo(x + Math.cos(a) * 3, y + Math.sin(a) * 1.2); F.stroke(); }
  }

  // =====================================================================================
  // THE SMITHSONIAN: the great hall after hours, a dinosaur skeleton and a plane overhead
  // =====================================================================================
  function smithsonian(B, F) {
    setSeed(101);
    vg(B, 0, 0, BW, FY, ['#0a0c10', '#1a1e26', '#2a2e36']);
    // arched windows with moonlight, gallery balcony
    for (let x = 60; x < BW; x += 170) { B.fillStyle = '#0c0e14'; B.beginPath(); B.moveTo(x - 30, 120); B.lineTo(x - 30, 40); B.arc(x, 40, 30, PI, 0); B.lineTo(x + 30, 120); B.fill(); vg(B, x - 26, 20, 52, 98, ['#2a3a5a', '#1a2440', '#101828']); B.fillStyle = '#5a5e66'; B.fillRect(x - 1, 14, 2, 106); B.fillRect(x - 26, 64, 52, 2); glow(B, x, 70, 50, 'rgba(150,170,220,0.15)'); }
    B.fillStyle = '#2a2a30'; B.fillRect(0, 122, BW, 8); for (let x = 0; x < BW; x += 8) { B.fillStyle = '#4a4a52'; B.fillRect(x, 130, 2, 12); } B.fillStyle = '#3a3a42'; B.fillRect(0, 142, BW, 3);
    // a big sauropod skeleton on its stand
    const dx = CX - 170, dy = FY - 22, bone = '#d8ccb0';
    const spineP = t => [dx - 170 + t * 320, dy - 62 - Math.sin(t * PI) * 18 - (t > 0.72 ? (t - 0.72) * 150 : 0)];
    B.strokeStyle = bone; B.lineWidth = 3.4; B.beginPath(); for (let i = 0; i <= 40; i++) { const [x, y] = spineP(i / 40); i ? B.lineTo(x, y) : B.moveTo(x, y); } B.stroke();
    for (let i = 0; i <= 40; i++) { const [x, y] = spineP(i / 40); R.ball(B, x, y - 2, 2, bone); }
    for (let i = 0; i < 12; i++) { const [x, y] = spineP(0.32 + i * 0.026); B.lineWidth = 1.6; B.beginPath(); B.moveTo(x, y); B.quadraticCurveTo(x + 10, y + 20, x + 2, y + 30 - Math.abs(i - 6) * 1.5); B.stroke(); }
    for (const [tt, a] of [[0.36, 0.25], [0.42, -0.05], [0.6, 0.2], [0.66, -0.1]]) { const [x, y] = spineP(tt); R.line(B, x, y + 4, x + a * 40, dy - 26, bone, 5); R.line(B, x + a * 40, dy - 26, x + a * 14, dy, bone, 4); R.ball(B, x + a * 40, dy - 26, 3.4, bone); B.fillStyle = bone; B.fillRect(x + a * 14 - 5, dy - 2, 10, 3); }
    const [hx, hy] = spineP(1); B.fillStyle = bone; B.beginPath(); B.ellipse(hx + 8, hy, 11, 6, 0.25, 0, PI * 2); B.fill(); B.fillStyle = '#1a1a1e'; B.fillRect(hx + 8, hy - 3, 2.6, 2.6); R.line(B, hx + 6, hy + 4, hx + 18, hy + 5, '#1a1a1e', 0.8);
    B.fillStyle = '#3a3a42'; B.fillRect(dx - 190, dy, 380, 10); B.fillStyle = '#c8a040'; B.fillRect(dx - 20, dy + 2, 40, 5);
    // display cases and a mastodon-ish mount on the right
    for (const x of [820, 960, 1100]) { B.fillStyle = '#1a1a20'; B.fillRect(x - 30, FY - 40, 60, 36); B.fillStyle = 'rgba(160,190,220,0.2)'; B.fillRect(x - 28, FY - 64, 56, 26); B.strokeStyle = 'rgba(200,220,255,0.3)'; B.strokeRect(x - 28, FY - 64, 56, 26); R.ball(B, x, FY - 50, 6, ['#c8a040', '#8a3a2a', '#4a6a8a'][x % 3]); glow(B, x, FY - 52, 30, 'rgba(255,230,180,0.25)'); }
    glow(B, CX, 140, 400, 'rgba(120,140,200,0.08)');
    vignette(B, BW);
    pfloor(F, 'check', '#8a8270', '#4a463c', { rows: 8, span: 44 });
  }

  // =====================================================================================
  // TIDAL BASIN: the edge of the water under the cherry blossoms, the domed memorial across the basin
  // =====================================================================================
  const BLOSSOMS = [[60, 0.9], [250, 1.1], [470, 0.8], [800, 1.0], [1020, 1.2], [1230, 0.9]];
  function tidal(B, F) {
    setSeed(111);
    vg(B, 0, 0, BW, FY, ['#2a1a3a', '#6a3a5a', '#d8786a', '#f8b888']);
    clouds(B, 10, 60, 8, 'rgba(120,60,90,0.4)', 'rgba(255,190,170,0.3)', 1);
    // the domed memorial across the water
    const mx = CX + 120, my = 118;
    B.fillStyle = '#e8dcd0'; B.beginPath(); B.ellipse(mx, my - 18, 40, 30, 0, PI, 0); B.fill(); hgf(B, mx - 40, my - 48, 80, 30, ['rgba(0,0,0,0.25)', 'rgba(255,255,255,0.15)', 'rgba(0,0,0,0.3)']);
    B.fillStyle = '#d8ccc0'; B.fillRect(mx - 46, my - 20, 92, 6); for (let i = 0; i < 9; i++) { B.fillStyle = '#ece4d8'; B.fillRect(mx - 42 + i * 10.4, my - 14, 4, 18); }
    B.fillStyle = '#c8bcb0'; B.fillRect(mx - 52, my + 4, 104, 5);
    // far shore with blossom haze
    for (let x = 0; x < BW; x += 9) { B.fillStyle = rand() < 0.5 ? '#e8a8b8' : '#d898a8'; B.beginPath(); B.ellipse(x, 122, rr(6, 12), rr(4, 8), 0, 0, PI * 2); B.fill(); }
    // the water with reflections
    vg(B, 0, 126, BW, FY - 126 - 10, ['#6a4a6a', '#3a2a4a', '#2a1a34']);
    B.globalAlpha = 0.25; B.fillStyle = '#e8dcd0'; B.beginPath(); B.ellipse(mx, 134, 40, 12, 0, 0, PI); B.fill(); B.globalAlpha = 1;
    for (let i = 0; i < 80; i++) { B.fillStyle = `rgba(255,200,190,${rr(0.08, 0.25)})`; B.fillRect(rr(0, BW), rr(128, FY - 14), rr(6, 22), 0.7); }
    // stone seawall edge
    B.fillStyle = '#9a948a'; B.fillRect(0, FY - 10, BW, 10); B.fillStyle = '#b8b2a6'; B.fillRect(0, FY - 10, BW, 2);
    // the cherry trees in front
    for (const [x, s] of BLOSSOMS) {
      B.strokeStyle = '#2a1a14'; B.lineWidth = 5 * s; B.beginPath(); B.moveTo(x, FY); B.quadraticCurveTo(x - 10 * s, FY - 50 * s, x + 6 * s, FY - 90 * s); B.stroke();
      B.lineWidth = 2.4 * s; for (const [bx, by] of [[-40, -110], [36, -120], [-10, -130], [50, -96]]) { B.beginPath(); B.moveTo(x, FY - 70 * s); B.quadraticCurveTo(x + bx * 0.4 * s, FY - 100 * s, x + bx * s, FY + by * s); B.stroke(); }
      for (let i = 0; i < 70; i++) { const px = x + rr(-60, 60) * s, py = FY - rr(80, 150) * s; B.fillStyle = ['#f8c8d8', '#f0a8c0', '#fcd8e4', '#e890b0'][i % 4]; B.beginPath(); B.arc(px, py, rr(5, 10) * s, 0, PI * 2); B.fill(); }
    }
    vignette(B, BW);
    // gravel path with fallen petals
    vg(F, 0, FY, AWX, H - FY, ['#a8988a', '#7a6a5e']);
    speckle(F, 0, FY, AWX, H - FY, 2600, 0.3, 0.15);
    for (let i = 0; i < 420; i++) { F.fillStyle = ['#f8c8d8', '#f0a8c0', '#fcd8e4'][i % 3]; F.beginPath(); F.ellipse(rand() * AWX, FY + rand() * (H - FY), 1.4, 0.8, rand() * 3, 0, PI * 2); F.fill(); }
    const dg = F.createLinearGradient(0, FY, 0, FY + 20); dg.addColorStop(0, 'rgba(0,0,0,0.35)'); dg.addColorStop(1, 'rgba(0,0,0,0)'); F.fillStyle = dg; F.fillRect(0, FY, AWX, 20);
  }

  function live(g, id, t, info) {
    if (id === 'oval') {
      // lightning lights up the windows every few seconds
      const ph = (t * 0.37) % 1, flash = ph < 0.05 ? 1 - ph / 0.05 : ph > 0.08 && ph < 0.1 ? 0.6 : 0;
      for (const x of OVAL.windows) {
        g.strokeStyle = 'rgba(160,180,220,0.25)'; g.lineWidth = 0.6;
        for (let i = 0; i < 14; i++) { const xx = x - 22 + ((i * 7.3 + t * 3) % 44), yy = 44 + ((i * 31 + t * 220) % 100); g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx - 1, yy + 6); g.stroke(); }
        if (flash) { g.fillStyle = `rgba(220,230,255,${0.55 * flash})`; g.fillRect(x - 23, 44, 46, FY - 106); glow(g, x, 100, 120, `rgba(200,220,255,${0.35 * flash})`); }
      }
      if (flash) { g.fillStyle = `rgba(200,210,255,${0.08 * flash})`; g.fillRect(0, 0, BW, H); }
      // the portraits' eyes slide to follow the fight
      const look = Math.sin(t * 0.8) * 1.6;
      for (const p of OVAL.portraits) { g.fillStyle = 'rgba(240,230,210,0.85)'; g.fillRect(p.x - p.w * 0.1, p.y - 0.4, p.w * 0.07, 1.4); g.fillRect(p.x + p.w * 0.04, p.y - 0.4, p.w * 0.07, 1.4); g.fillStyle = '#0a0604'; g.fillRect(p.x - p.w * 0.07 + look, p.y - 0.4, 1.1, 1.4); g.fillRect(p.x + p.w * 0.07 + look, p.y - 0.4, 1.1, 1.4); }
    }

    if (id === 'rushmore') {
      // an eagle wheeling over the mountain
      const x = (t * 40) % (BW + 200) - 100, y = 50 + Math.sin(t * 0.8) * 16, f = Math.sin(t * 8) * 4;
      g.strokeStyle = '#1a1210'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x - 12, y - f); g.quadraticCurveTo(x - 5, y - 4, x, y); g.quadraticCurveTo(x + 5, y - 4, x + 12, y - f); g.stroke();
    }
    if (id === 'valleyforge') {
      for (const x of VF_FIRES) { for (let i = 0; i < 4; i++) { const r = 3 + Math.sin(t * 9 + i + x) * 1.4; g.fillStyle = i % 2 ? '#ff8a20' : '#ffd040'; g.beginPath(); g.arc(x - 4 + i * 2.6, FY - 6 - Math.abs(Math.sin(t * 7 + i * 2)) * 6, r, 0, PI * 2); g.fill(); } glow(g, x, FY - 8, 40 + Math.sin(t * 11 + x) * 4, 'rgba(255,140,40,0.4)'); }
      g.fillStyle = 'rgba(240,245,255,0.8)'; for (let i = 0; i < 120; i++) { const x = (i * 97.3 + t * (14 + (i % 5) * 4)) % BW, y = (i * 53.1 + t * (30 + (i % 7) * 8)) % FY; g.fillRect(x, y, 1.4, 1.4); }
    }
    if (id === 'gettysburg') {
      for (let i = 0; i < 8; i++) { const x = (i * 180 + t * 10) % (BW + 200) - 100, y = 130 + Math.sin(t * 0.5 + i) * 10; g.fillStyle = 'rgba(200,180,160,0.1)'; g.beginPath(); g.ellipse(x, y, 90, 16, 0, 0, PI * 2); g.fill(); }
      const ph = (t * 0.23) % 1; if (ph < 0.04) { const fx = 1140 - ph * 400; glow(g, fx, 140, 50, `rgba(255,200,120,${0.7 * (1 - ph / 0.04)})`); }
    }
    if (id === 'reflecting') {
      const ox = CX + 170; for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(220,225,240,0.25)'; g.fillRect(ox - 8 + Math.sin(t * 2 + i) * 3, 138 + i * 5, 16 - i * 2, 0.8); }
      if (Math.floor(t * 1.5) % 2) for (const y of [50, 52]) glow(g, ox + (y === 50 ? -2 : 2), y, 4, 'rgba(255,40,30,1)');
    }
    if (id === 'bowling') {
      for (const lx of [CX - 150, CX + 150]) {
        const ph = ((t + (lx > CX ? 2.3 : 0)) * 0.22) % 1;
        if (ph < 0.3) { const u = ph / 0.3; g.fillStyle = '#16161c'; g.beginPath(); g.arc(lx + Math.sin(u * 3) * 6, lerp(FY - 4, 140, u), lerp(8, 3, u), 0, PI * 2); g.fill(); }
        for (let i = 0; i < 6; i++) { const knocked = ph > 0.3 && ph < 0.6, px = lx - 10 + (i % 3) * 10 + (knocked ? Math.sin(i * 7) * 10 * (ph - 0.3) * 3 : 0), py = 130 - ((i / 3) | 0) * 5 - (knocked ? Math.abs(Math.sin(i * 3)) * 18 * Math.sin((ph - 0.3) * PI / 0.3) : 0);
          g.save(); g.translate(px, py); if (knocked) g.rotate((ph - 0.3) * 10 * (i % 2 ? 1 : -1)); g.fillStyle = '#f4f0e8'; g.beginPath(); g.ellipse(0, -3, 2, 4, 0, 0, PI * 2); g.fill(); g.beginPath(); g.arc(0, -8, 1.4, 0, PI * 2); g.fill(); g.fillStyle = '#c81a24'; g.fillRect(-1.6, -6.4, 3.2, 0.8); g.restore(); }
      }
    }
    if (id === 'house') {
      // the members rise as the fight heats up, clapping or cheering; so do the Speaker and the Vice President.
      // A row where everyone is seated is drawn from a cached picture.
      const hype = info.hype || 0, rise = p => Math.max(0, Math.min(1, (hype * 1.15 - 0.02 - p.eager) * 5));
      for (let r = HOUSE_ROWS.length - 1; r >= 0; r--) {
        const row = HOUSE_ROWS[r], seats = HOUSE_SEATS.filter(p => p.r === r);
        if (!seats.some(p => !p.empty && rise(p) > 0)) {
          if (!row.cache) { row.cache = STAGES.kit.mk(BW); const c = row.cache.getContext('2d'); for (const p of seats) houseChair(c, p.x, row); for (const p of seats) if (!p.empty) member(c, p.x, row.rail, row.Hs, p, 0, 0); houseRail(c, row); }
          g.drawImage(row.cache, 0, 0); continue;
        }
        for (const p of seats) houseChair(g, p.x, row);
        for (const p of seats) if (!p.empty) { const up = rise(p); member(g, p.x, row.rail - (up > 0.5 ? Math.abs(Math.sin(t * 6 + p.ph)) * row.Hs * 0.015 : 0), row.Hs, p, up, t); }
        houseRail(g, row);
      }
      for (const p of HOUSE_LEADERS) member(g, p.x, 98, 80, p, rise(p), t);
      rostrumTop(g);
    }
    if (id === 'ferry') {
      // the wake churning away behind the stern toward Manhattan, gulls riding along, the flag snapping in the wind
      g.save(); g.beginPath(); g.rect(0, HARBOR + 1, BW, 166 - HARBOR - 1); g.clip();
      for (let i = 0; i < 40; i++) {
        const k = (i * 0.0731 + t * 0.09) % 1, y = 166 - (166 - HARBOR) * (1 - Math.pow(1 - k, 2.2)), half = 6 + 150 * Math.pow(1 - k, 2.2), x = CX + Math.sin(i * 12.9898) * half;
        g.fillStyle = `rgba(235,240,250,${0.12 + 0.4 * (1 - k)})`; g.beginPath(); g.ellipse(x, y, 3 + 14 * (1 - k), 0.6 + 1.6 * (1 - k), 0, 0, PI * 2); g.fill();
      }
      for (let i = 0; i < 18; i++) { const x = (i * 97 + t * 14) % BW, y = HARBOR + 4 + (i * 7) % 22; g.fillStyle = 'rgba(255,220,170,0.18)'; g.fillRect(x, y, 6 + (i % 4) * 3, 0.8); }
      g.restore();
      ferryRail(g);
      // the stern flag
      const fx = 1042, fy = 61;
      for (let i = 0; i < 13; i++) { g.fillStyle = i % 2 ? '#f0ece4' : '#b81c28'; g.beginPath(); for (let k = 0; k <= 8; k++) { const xx = fx + k * 5, w = Math.sin(t * 7 - k * 0.7) * k * 0.5; g.lineTo(xx, fy + i * 2 + w); } for (let k = 8; k >= 0; k--) { const xx = fx + k * 5, w = Math.sin(t * 7 - k * 0.7) * k * 0.5; g.lineTo(xx, fy + (i + 1) * 2 + w); } g.fill(); }
      g.fillStyle = '#1e2a5a'; g.beginPath(); for (let k = 0; k <= 3; k++) g.lineTo(fx + k * 5.6, fy + Math.sin(t * 7 - k * 0.78) * k * 0.55); for (let k = 3; k >= 0; k--) g.lineTo(fx + k * 5.6, fy + 14 + Math.sin(t * 7 - k * 0.78) * k * 0.55); g.fill();
      // gulls
      for (let i = 0; i < 3; i++) { const x = (t * (22 + i * 7) + i * 400) % (BW + 200) - 100, y = 70 + i * 18 + Math.sin(t * 0.9 + i) * 10, w = Math.sin(t * 9 + i * 2) * 2.4; g.strokeStyle = '#f0ece4'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x - 6, y - w); g.quadraticCurveTo(x - 3, y - 2.5, x, y); g.quadraticCurveTo(x + 3, y - 2.5, x + 6, y - w); g.stroke(); }
      // the beacon on top of One World Trade Center, the torch's flicker
      if ((t % 1.6) < 0.5) glow(g, FERRY.spire[0], FERRY.spire[1], 7, 'rgba(255,40,40,0.9)');
      glow(g, FERRY.torch[0], FERRY.torch[1], 12 + Math.sin(t * 9) * 2, 'rgba(255,210,120,0.7)');
    }
    if (id === 'yosemite') {
      // mist drifting over the valley floor, spray blowing off Bridalveil Fall, ravens riding the updraft
      for (let i = 0; i < 9; i++) { const x = ((i * 173 + t * (6 + i)) % (BW + 300)) - 150, y = 134 + (i % 3) * 7; const gr = g.createRadialGradient(x, y, 0, x, y, 70); gr.addColorStop(0, 'rgba(235,242,248,0.28)'); gr.addColorStop(1, 'rgba(235,242,248,0)'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, 90, 9, 0, 0, PI * 2); g.fill(); }
      const [fx, f0, f1] = YOSE.fall;
      for (let i = 0; i < 7; i++) { const k = (t * 0.9 + i / 7) % 1; g.fillStyle = `rgba(255,255,255,${0.7 * (1 - k)})`; g.fillRect(fx - 1 + Math.sin(t * 2 + i) * 0.8 * k, f0 + (f1 - f0) * k, 1.6, 4); }
      glow(g, fx, f1, 10 + Math.sin(t * 3) * 2, 'rgba(240,248,255,0.4)');
      for (let i = 0; i < 2; i++) { const x = 560 + Math.cos(t * 0.4 + i * 3) * 120, y = 60 + Math.sin(t * 0.8 + i * 3) * 18, w = Math.sin(t * 6 + i) * 2; g.strokeStyle = '#141414'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x - 5, y - w); g.quadraticCurveTo(x - 2, y - 2, x, y); g.quadraticCurveTo(x + 2, y - 2, x + 5, y - w); g.stroke(); }
    }
    if (id === 'smithsonian') {
      // the old plane hanging overhead, turning slowly on its wires
      const px = CX + 240 + Math.sin(t * 0.3) * 6, py = 60, a = Math.sin(t * 0.4) * 0.05;
      R.line(g, px - 30, 0, px - 30, py - 6, 'rgba(200,200,210,0.4)', 0.6); R.line(g, px + 30, 0, px + 30, py - 6, 'rgba(200,200,210,0.4)', 0.6);
      g.save(); g.translate(px, py); g.rotate(a); g.fillStyle = '#b8bcc4'; g.beginPath(); g.ellipse(0, 0, 40, 6, 0, 0, PI * 2); g.fill(); g.fillStyle = '#9a9ea8'; g.fillRect(-14, -3, 40, 2); g.fillRect(-60, -2, 120, 3); g.fillStyle = '#1a1a22'; g.fillRect(36, -4, 3, 8); const pr = Math.sin(t * 30) * 8; R.line(g, 40, -pr, 40, pr, '#2a2a30', 1.4); g.fillStyle = '#6a6e78'; g.beginPath(); g.moveTo(-40, -1); g.lineTo(-48, -12); g.lineTo(-36, -2); g.fill(); g.restore();
    }
    if (id === 'tidal') {
      for (let i = 0; i < 70; i++) { const x = (i * 83.7 + t * (16 + (i % 4) * 5) + Math.sin(t * 2 + i) * 10) % BW, y = (i * 41.3 + t * (18 + (i % 6) * 4)) % FY; g.fillStyle = ['#f8c8d8', '#f0a8c0', '#fcd8e4'][i % 3]; g.beginPath(); g.ellipse(x, y, 1.6, 0.9, t * 3 + i, 0, PI * 2); g.fill(); }
    }
  }

  const lerp = (a, b, u) => a + (b - a) * Math.max(0, Math.min(1, u));
  const DEFS = {
    oval: { name: 'THE OVAL OFFICE', draw: oval },
    rushmore: { name: 'MOUNT RUSHMORE', draw: rushmore },
    valleyforge: { name: 'VALLEY FORGE', draw: valleyforge },
    gettysburg: { name: 'GETTYSBURG', draw: gettysburg },
    reflecting: { name: 'THE REFLECTING POOL', draw: reflecting },
    bowling: { name: 'WHITE HOUSE BOWLING ALLEY', draw: bowling },
    rotunda: { name: 'THE CAPITOL ROTUNDA', draw: rotunda },
    house: { name: 'JOINT SESSION OF CONGRESS', draw: house },
    smithsonian: { name: 'THE SMITHSONIAN', draw: smithsonian },
    tidal: { name: 'THE TIDAL BASIN', draw: tidal },
    ferry: { name: 'THE STATEN ISLAND FERRY', draw: ferry },
    yosemite: { name: 'YOSEMITE VALLEY', draw: yosemite },
  };
  const ROTATION = ['oval', 'rushmore', 'valleyforge', 'gettysburg', 'reflecting', 'bowling', 'rotunda', 'house', 'smithsonian', 'tidal', 'ferry', 'yosemite'];
  STAGES.define({ defs: DEFS, fallback: 'oval', rotation: ROTATION, single: ROTATION, live });
  // Rushmore is sculpted and lit pixel by pixel (about a second); build it while the title screen is up, not at the bell
  setTimeout(() => STAGES.get('rushmore'), 2500);
})();
