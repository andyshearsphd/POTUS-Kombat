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
  // a little painted person: suit, head, arms up or down (crowds, tourists)
  function person(g, x, y, h, o) {
    const k = h / 40, up = o.up || 0;
    g.fillStyle = o.legs || '#1a1a20'; g.fillRect(x - 4 * k, y - 14 * k, 3.2 * k, 14 * k); g.fillRect(x + 0.8 * k, y - 14 * k, 3.2 * k, 14 * k);
    g.fillStyle = o.top; g.beginPath(); g.moveTo(x - 6 * k, y - 28 * k); g.lineTo(x + 6 * k, y - 28 * k); g.lineTo(x + 5 * k, y - 13 * k); g.lineTo(x - 5 * k, y - 13 * k); g.fill();
    if (o.tie) { g.fillStyle = '#f0ece4'; g.fillRect(x - 1.2 * k, y - 28 * k, 2.4 * k, 4 * k); g.fillStyle = o.tie; g.fillRect(x - 0.6 * k, y - 27 * k, 1.2 * k, 7 * k); }
    for (const sd of [-1, 1]) { const a = up > 0 ? -2.6 + sd * 0.3 - Math.sin(o.ph || 0) * 0.3 : 0.15 * sd; R.line(g, x + sd * 5.6 * k, y - 26 * k, x + sd * 5.6 * k + Math.sin(a) * 11 * k * sd * (up ? -1 : 1), y - 26 * k + Math.cos(a) * 11 * k, o.top, 2.6 * k); }
    g.fillStyle = o.skin; g.beginPath(); g.arc(x, y - 32 * k, 3.6 * k, 0, PI * 2); g.fill();
    g.fillStyle = o.hair; g.beginPath(); g.arc(x, y - 33.4 * k, 3.6 * k, PI, 0); g.fill();
  }
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
  // MOUNT RUSHMORE: on the ledge under the four granite faces at sunset
  // =====================================================================================
  function rushmore(B, F) {
    setSeed(31);
    vg(B, 0, 0, BW, FY, ['#1a1430', '#4a2a4a', '#a8503a', '#e8904a']);
    clouds(B, 10, 70, 9, 'rgba(80,40,60,0.5)', 'rgba(255,160,100,0.35)', -1);
    // the mountain
    B.fillStyle = '#6a625a'; B.beginPath(); B.moveTo(0, FY); B.lineTo(0, 120); B.quadraticCurveTo(200, 80, 380, 56); B.quadraticCurveTo(640, 34, 900, 52); B.quadraticCurveTo(1100, 70, 1280, 110); B.lineTo(1280, FY); B.fill();
    for (let i = 0; i < 260; i++) { B.fillStyle = rand() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(255,220,190,0.08)'; B.beginPath(); B.ellipse(rr(0, BW), rr(30, FY), rr(4, 20), rr(2, 8), rr(-1, 1), 0, PI * 2); B.fill(); }
    // four generic granite faces (stylized, not portraits)
    const faces = [[CX - 150, 96, 0.62], [CX - 55, 90, 0.68], [CX + 35, 100, 0.56], [CX + 125, 96, 0.64]];
    for (const [fx, fy, s] of faces) {
      const w = 46 * s, h = 70 * s;
      B.fillStyle = '#8a8278'; B.beginPath(); B.ellipse(fx, fy, w, h, 0, 0, PI * 2); B.fill();
      hgf(B, fx - w, fy - h, w * 2, h * 2, ['rgba(0,0,0,0.35)', 'rgba(255,220,180,0.12)', 'rgba(0,0,0,0.4)']);
      B.fillStyle = 'rgba(30,24,20,0.6)'; B.fillRect(fx - w * 0.45, fy - h * 0.18, w * 0.3, h * 0.08); B.fillRect(fx + w * 0.15, fy - h * 0.18, w * 0.3, h * 0.08);
      B.fillStyle = 'rgba(30,24,20,0.35)'; B.beginPath(); B.moveTo(fx, fy - h * 0.12); B.lineTo(fx - w * 0.12, fy + h * 0.18); B.lineTo(fx + w * 0.1, fy + h * 0.2); B.fill();
      B.fillStyle = 'rgba(30,24,20,0.5)'; B.fillRect(fx - w * 0.25, fy + h * 0.35, w * 0.5, h * 0.04);
      B.fillStyle = 'rgba(255,200,150,0.15)'; B.beginPath(); B.ellipse(fx + w * 0.4, fy - h * 0.3, w * 0.3, h * 0.4, 0, 0, PI * 2); B.fill();
      B.fillStyle = 'rgba(40,32,26,0.4)'; B.fillRect(fx - w * 0.5, fy - h * 0.3, w * 0.35, h * 0.05); B.fillRect(fx + w * 0.15, fy - h * 0.3, w * 0.35, h * 0.05);
      B.strokeStyle = 'rgba(40,32,26,0.3)'; B.lineWidth = 1; for (let i = 0; i < 5; i++) { B.beginPath(); B.moveTo(fx - w * 0.8 + i * w * 0.3, fy - h * 0.95); B.lineTo(fx - w * 0.7 + i * w * 0.3, fy - h * 0.62); B.stroke(); }
    }
    // talus and pines below
    for (let i = 0; i < 80; i++) { B.fillStyle = shade('#5a524a', rr(-0.2, 0.15)); B.beginPath(); B.ellipse(rr(0, BW), rr(150, FY), rr(6, 18), rr(3, 7), 0, 0, PI * 2); B.fill(); }
    treeline(B, FY - 2, 50, '#142018', 20, 46);
    fog(B, FY - 40, 40, 'rgba(255,150,100,0.18)');
    vignette(B, BW);
    // granite ledge floor
    vg(F, 0, FY, AWX, H - FY, ['#6a625a', '#4a443e']);
    for (let i = 0; i < 60; i++) { F.strokeStyle = 'rgba(0,0,0,0.3)'; F.lineWidth = 0.7; F.beginPath(); let x = rand() * AWX, y = FY + rand() * 50; F.moveTo(x, y); for (let j = 0; j < 4; j++) { x += rr(-14, 14); y += rr(0, 6); F.lineTo(x, y); } F.stroke(); }
    speckle(F, 0, FY, AWX, H - FY, 2400, 0.3, 0.15);
    const dg = F.createLinearGradient(0, FY, 0, FY + 20); dg.addColorStop(0, 'rgba(0,0,0,0.45)'); dg.addColorStop(1, 'rgba(0,0,0,0)'); F.fillStyle = dg; F.fillRect(0, FY, AWX, 20);
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
  // HOUSE CHAMBER, JOINT SESSION: the rostrum, the flag, and the whole Congress on its feet
  // =====================================================================================
  const HOUSE_SEATS = (() => { const r = prng(113), a = [], suits = ['#1a1a22', '#2a2e3a', '#3a3a44', '#1c2436', '#5a1a24', '#2a3a2a', '#4a4a56', '#6a5a4a', '#1a1a1a', '#7a2a3a', '#2a3a6a'];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 26; i++) { const x = 20 + i * 48 + (row % 2) * 24 + r() * 10; if (Math.abs(x - CX) < 120 && row < 2) continue; a.push({ x, y: FY - 8 - row * 22, h: 40 - row * 5, top: suits[(r() * suits.length) | 0], skin: SKINS[(r() * SKINS.length) | 0], hair: ['#1a1208', '#3a2a1a', '#8a8680', '#c8c4bc', '#6a4428', '#b89a6a'][(r() * 6) | 0], ph: r() * 6, eager: r(), tie: r() < 0.6 ? ['#8a1a24', '#1a2a6a', '#c8a040'][(r() * 3) | 0] : null }); }
    return a; })();
  function house(B, F) {
    setSeed(91);
    vg(B, 0, 0, BW, FY, ['#1a1410', '#2a2016', '#3a2c1e']);
    // gallery up top, ceiling glass, walls
    vg(B, 0, 0, BW, 22, ['#c8b88a', '#8a7a5a']); for (let x = 0; x < BW; x += 30) { B.fillStyle = 'rgba(0,0,0,0.25)'; B.fillRect(x, 0, 1, 22); }
    B.fillStyle = '#3a2416'; B.fillRect(0, 22, BW, 26); for (let x = 0; x < BW; x += 14) { B.fillStyle = '#5a3a20'; B.fillRect(x + 2, 26, 9, 16); }
    hgf(B, 0, 48, BW, FY - 48, ['#4a3a28', '#6a5438', '#4a3a28']);
    // the rostrum, the flag, the seal
    const rx = CX;
    B.fillStyle = '#2a3a5a'; B.fillRect(rx - 120, 52, 240, 74);
    for (let i = 0; i < 13; i++) { B.fillStyle = i % 2 ? '#e8e0d0' : '#9a1420'; B.fillRect(rx - 40, 58 + i * 3.6, 80, 3.6); } B.fillStyle = '#1e2a5a'; B.fillRect(rx - 40, 58, 32, 25); B.fillStyle = '#f0eee8'; for (let i = 0; i < 20; i++) B.fillRect(rx - 37 + (i % 5) * 6, 61 + ((i / 5) | 0) * 5.4, 1, 1);
    marble(B, rx - 130, 126, 260, FY - 126, '#a89878');
    for (let i = 0; i < 3; i++) { B.fillStyle = shade('#6a4a2a', -i * 0.1); B.fillRect(rx - 110 + i * 14, 112 + i * 18, 220 - i * 28, 16); B.fillStyle = '#c8a040'; B.fillRect(rx - 110 + i * 14, 112 + i * 18, 220 - i * 28, 1.4); }
    R.ball(B, rx, 166, 10, '#c8a050'); R.ball(B, rx, 166, 7, '#1e2a5a');
    for (const sd of [-1, 1]) { B.fillStyle = '#1a1208'; B.fillRect(rx + sd * 150 - 1, 60, 2, FY - 60); B.fillStyle = '#c8a040'; B.fillRect(rx + sd * 150 - 6, 60, 12, 4); }
    // tiered desks the crowd stands behind (people drawn live)
    for (let row = 0; row < 3; row++) { const y = FY - 8 - row * 22; B.fillStyle = shade('#5a3a20', -row * 0.08); B.fillRect(0, y - 4, BW, 12); B.fillStyle = '#7a5030'; B.fillRect(0, y - 4, BW, 1.6); }
    glow(B, CX, 40, 300, 'rgba(255,220,160,0.12)');
    vignette(B, BW);
    // blue carpet with the stars
    pfloor(F, 'stone', '#2a3a6a', '#141c3a', { rows: 7, span: 70 });
    F.fillStyle = 'rgba(230,200,100,0.4)'; for (let i = 0; i < 60; i++) { const x = rand() * AWX, y = FY + 6 + rand() * 48; F.beginPath(); for (let j = 0; j < 5; j++) { const a = -PI / 2 + j * PI * 4 / 5; F.lineTo(x + Math.cos(a) * 2.4, y + Math.sin(a) * 1.4); } F.fill(); }
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
      // the whole joint session on its feet; the louder the fight, the more of them cheer
      const hype = (info && info.hype) || 0;
      for (const p of HOUSE_SEATS) { const cheer = p.eager < 0.25 + hype * 0.75; person(g, p.x, p.y + (cheer ? -Math.abs(Math.sin(t * 6 + p.ph)) * 2 : 0), p.h, { top: p.top, skin: p.skin, hair: p.hair, up: cheer ? 1 : 0, ph: t * 8 + p.ph, tie: p.tie }); }
      for (let row = 0; row < 3; row++) { const y = FY - 8 - row * 22; g.fillStyle = shade('#5a3a20', -row * 0.08); g.fillRect(0, y - 4, BW, 12); g.fillStyle = '#7a5030'; g.fillRect(0, y - 4, BW, 1.6); }
      if (hype > 0.4) for (let i = 0; i < 12; i++) { const x = (i * 113 + t * 50) % BW, y = 30 + ((t * 60 + i * 41) % 150); g.fillStyle = ['#f0eee8', '#9a1420', '#1e2a5a'][i % 3]; g.fillRect(x, y, 2, 1.4); }
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
  };
  const ROTATION = ['oval', 'rushmore', 'valleyforge', 'gettysburg', 'reflecting', 'bowling', 'rotunda', 'house', 'smithsonian', 'tidal'];
  STAGES.define({ defs: DEFS, fallback: 'oval', rotation: ROTATION, single: ROTATION, live });
})();
