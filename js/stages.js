// POTUS Kombat: arenas, painted in the dark early-90s Mortal Kombat style (night, storms, hard light),
// then dithered like a digitized backdrop.
'use strict';
(() => {
  const { R, PI, H, AWX, BW, CX, FY, rand, rr, shade, setSeed, vg, hgf, glow, shadowRect, speckle, grime, wall, bricks, stones, win, stars, clouds, fog, vignette, pfloor } = STAGES.kit;

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
  }

  const DEFS = {
    oval: { name: 'THE OVAL OFFICE', draw: oval },
  };
  const ROTATION = ['oval'];
  STAGES.define({ defs: DEFS, fallback: 'oval', rotation: ROTATION, single: ROTATION, live });
})();
