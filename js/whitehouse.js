// POTUS Kombat: the White House at night (north facade), for the title screen and the app icon.
// WHITEHOUSE.scene(g, W, H, t, o) paints the whole picture; o = { cx, base, s } places the building
// (base is the ground line under the steps, s the scale; the building is 288 units wide and the flag tops out
// 132 units above the ground). The still parts are cached per size; the searchlights and the flag move.
'use strict';
const WHITEHOUSE = (() => {
  const PI = Math.PI;
  function rnd(seed) { let x = seed; return () => (x = (x * 16807) % 2147483647) / 2147483647; }

  function sky(g, W, H, o) {
    const hz = o.base;
    const gr = g.createLinearGradient(0, 0, 0, hz);
    gr.addColorStop(0, '#03040b'); gr.addColorStop(0.5, '#120716'); gr.addColorStop(0.85, '#3a0c16'); gr.addColorStop(1, '#5a1418');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const r = rnd(11);
    for (let i = 0; i < W * hz / 240; i++) {
      const x = r() * W, y = r() * hz * 0.75, big = r() < 0.12;
      g.fillStyle = `rgba(255,240,225,${0.25 + r() * 0.6})`; g.fillRect(x, y, big ? 1.5 : 0.9, big ? 1.5 : 0.9);
    }
    // a crescent moon off to the side
    const mx = o.cx - o.s * 205, my = o.base - o.s * 150, mr = 11 * o.s;
    const mg = g.createRadialGradient(mx, my, mr, mx, my, mr * 3); mg.addColorStop(0, 'rgba(255,240,210,0.14)'); mg.addColorStop(1, 'rgba(255,240,210,0)'); g.fillStyle = mg; g.fillRect(mx - mr * 3, my - mr * 3, mr * 6, mr * 6);
    g.save(); g.beginPath(); g.arc(mx, my, mr, 0, PI * 2); g.clip();
    g.fillStyle = '#f4ead0'; g.fillRect(mx - mr, my - mr, mr * 2, mr * 2);
    g.fillStyle = '#120716'; g.beginPath(); g.arc(mx + mr * 0.45, my - mr * 0.2, mr * 0.9, 0, PI * 2); g.fill(); g.restore();
    // the floodlit building lights up the haze behind it
    const hg = g.createRadialGradient(o.cx, o.base - 50 * o.s, 10, o.cx, o.base - 50 * o.s, 230 * o.s);
    hg.addColorStop(0, 'rgba(255,200,150,0.22)'); hg.addColorStop(1, 'rgba(255,200,150,0)');
    g.fillStyle = hg; g.fillRect(0, 0, W, H);
  }

  function beams(g, o, t) {
    [[-118, 0.4, 0.0], [118, 0.33, 2.2]].forEach(([bx, sp, ph], k) => {
      const x = o.cx + bx * o.s, y = o.base - 30 * o.s, a = -PI / 2 + (k ? 0.35 : -0.35) + 0.42 * Math.sin(t * sp + ph), L = 420 * o.s, wd = 0.07;
      const gr = g.createLinearGradient(x, y, x + Math.cos(a) * L, y + Math.sin(a) * L);
      gr.addColorStop(0, 'rgba(255,244,214,0.34)'); gr.addColorStop(1, 'rgba(255,244,214,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x, y);
      g.lineTo(x + Math.cos(a - wd) * L, y + Math.sin(a - wd) * L); g.lineTo(x + Math.cos(a + wd) * L, y + Math.sin(a + wd) * L); g.closePath(); g.fill();
    });
  }

  function tree(g, x, y, r, c) {
    g.fillStyle = c;
    [[0, 0, 1], [-0.6, 0.25, 0.75], [0.6, 0.2, 0.8], [-0.25, -0.5, 0.7], [0.3, -0.45, 0.65]].forEach(([dx, dy, k]) => { g.beginPath(); g.arc(x + dx * r, y + dy * r, r * k, 0, PI * 2); g.fill(); });
  }

  // the building, in its own units: x from -144 to 144, the ground at 0, the pediment apex at -98
  const STONE = '#efe9dc', SHADE = '#cfc6b3', DEEP = '#a99d87';
  function win(g, x, y, h, lit, top) {
    g.fillStyle = DEEP; g.fillRect(x - 5.6, y - 1, 11.2, h + 2);
    const wg = g.createLinearGradient(0, y, 0, y + h);
    if (lit) { wg.addColorStop(0, '#ffe7a8'); wg.addColorStop(1, '#f2a948'); } else { wg.addColorStop(0, '#3c3448'); wg.addColorStop(1, '#241e2c'); }
    g.fillStyle = wg; g.fillRect(x - 4.5, y, 9, h);
    g.fillStyle = 'rgba(70,50,40,0.75)'; g.fillRect(x - 0.4, y, 0.8, h); g.fillRect(x - 4.5, y + h / 3, 9, 0.7); g.fillRect(x - 4.5, y + h * 2 / 3, 9, 0.7);
    g.fillStyle = SHADE;
    if (top === 'tri') { g.beginPath(); g.moveTo(x - 7, y - 2); g.lineTo(x, y - 6.5); g.lineTo(x + 7, y - 2); g.closePath(); g.fill(); g.fillStyle = DEEP; g.fillRect(x - 7, y - 2.2, 14, 1); }
    else if (top === 'arc') { g.beginPath(); g.moveTo(x - 7, y - 2); g.quadraticCurveTo(x, y - 7.5, x + 7, y - 2); g.closePath(); g.fill(); g.fillStyle = DEEP; g.fillRect(x - 7, y - 2.2, 14, 1); }
    else { g.fillRect(x - 6.6, y - 3, 13.2, 2); }
    g.fillStyle = SHADE; g.fillRect(x - 5.8, y + h + 0.6, 11.6, 1.4);
  }
  function column(g, x) {
    const cg = g.createLinearGradient(x - 3.6, 0, x + 3.6, 0);
    cg.addColorStop(0, '#bdb3a0'); cg.addColorStop(0.35, '#fbf8f0'); cg.addColorStop(1, '#b0a590');
    g.fillStyle = cg; g.fillRect(x - 3.4, -66, 6.8, 58);
    g.fillStyle = 'rgba(0,0,0,0.08)'; for (let k = -2; k <= 2; k += 2) g.fillRect(x + k * 0.9 - 0.2, -64, 0.5, 54);
    g.fillStyle = STONE; g.fillRect(x - 5, -68.6, 10, 2.8);
    g.fillStyle = SHADE; g.beginPath(); g.arc(x - 4.6, -66.4, 1.6, 0, PI * 2); g.arc(x + 4.6, -66.4, 1.6, 0, PI * 2); g.fill();
    g.fillStyle = STONE; g.fillRect(x - 4.8, -8.4, 9.6, 2.4);
  }
  function building(g) {
    // trees behind the wings
    for (const sx of [-1, 1]) { tree(g, sx * 160, -44, 26, '#0b1a10'); tree(g, sx * 196, -34, 30, '#0a170e'); }
    // the main block, lit from below
    const bg = g.createLinearGradient(0, -76, 0, 0); bg.addColorStop(0, '#d8d0bf'); bg.addColorStop(1, '#f6f1e6');
    g.fillStyle = bg; g.fillRect(-140, -72, 280, 72);
    g.fillStyle = SHADE; g.fillRect(-142, -6, 284, 6); g.fillRect(-140, -38, 280, 2);
    g.fillStyle = 'rgba(0,0,0,0.06)'; for (let x = -138; x < 140; x += 46) g.fillRect(x, -72, 0.8, 66);
    // the balustrade and cornice along the roof
    g.fillStyle = STONE; g.fillRect(-144, -78, 288, 6);
    g.fillStyle = DEEP; g.fillRect(-142, -72.4, 284, 1.2);
    g.fillStyle = SHADE; g.fillRect(-142, -80, 284, 2);
    g.fillStyle = STONE; for (let x = -141; x <= 140; x += 3.2) g.fillRect(x, -86, 1.5, 6);
    g.fillStyle = STONE; g.fillRect(-142, -87.6, 284, 2);
    // windows on the wings, two floors; the top floor alternates triangle and arch heads
    const lit = [1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1];
    let k = 0;
    for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) {
      const x = sx * (66 + i * 19);
      win(g, x, -62, 18, lit[k++], i % 2 ? 'arc' : 'tri');
      win(g, x, -30, 18, lit[k++], 'flat');
    }
    // the portico: the recessed front wall, the door and lantern, then the columns, entablature and pediment
    g.fillStyle = '#b9ae9a'; g.fillRect(-48, -70, 96, 64);
    win(g, -24, -60, 16, 1, 'flat'); win(g, 24, -60, 16, 1, 'flat');
    win(g, -26, -28, 16, 0, 'flat'); win(g, 26, -28, 16, 1, 'flat');
    g.fillStyle = '#7d705c'; g.beginPath(); g.moveTo(-8, -6); g.lineTo(-8, -26); g.arc(0, -26, 8, PI, 0); g.lineTo(8, -6); g.closePath(); g.fill();
    g.fillStyle = '#ffd88a'; g.beginPath(); g.arc(0, -26, 6.4, PI, 0); g.closePath(); g.fill();
    g.fillStyle = 'rgba(70,50,40,0.7)'; for (let a = 0; a < 5; a++) { const an = PI + (a + 0.5) * PI / 5; g.fillRect(Math.cos(an) * 3 - 0.3, -26 + Math.sin(an) * 3, 0.6, 0.6); }
    g.fillStyle = '#3a2418'; g.fillRect(-6.4, -24.6, 12.8, 18.6); g.fillStyle = '#5a3a26'; g.fillRect(-5.4, -23.6, 5, 17); g.fillRect(0.4, -23.6, 5, 17);
    const lg = g.createRadialGradient(0, -44, 0.5, 0, -44, 10); lg.addColorStop(0, 'rgba(255,220,140,0.95)'); lg.addColorStop(1, 'rgba(255,220,140,0)');
    g.fillStyle = lg; g.fillRect(-10, -54, 20, 20); g.fillStyle = '#3a2a1a'; g.fillRect(-0.3, -66, 0.6, 19);
    g.fillStyle = '#ffe9b0'; g.fillRect(-1.6, -47, 3.2, 4.4);
    for (const x of [-40, -22, 22, 40]) column(g, x);
    g.fillStyle = 'rgba(0,0,0,0.16)'; for (const x of [-31, 31]) g.fillRect(x - 2.4, -66, 4.8, 58);  // the second row, half seen between
    g.fillStyle = STONE; g.fillRect(-50, -77, 100, 9);
    g.fillStyle = SHADE; g.fillRect(-50, -72, 100, 1.2); g.fillRect(-52, -79, 104, 2.4);
    g.fillStyle = STONE; g.beginPath(); g.moveTo(-54, -79); g.lineTo(0, -99); g.lineTo(54, -79); g.closePath(); g.fill();
    g.fillStyle = '#ddd4c2'; g.beginPath(); g.moveTo(-45, -81); g.lineTo(0, -95.6); g.lineTo(45, -81); g.closePath(); g.fill();
    g.fillStyle = SHADE; g.beginPath(); g.ellipse(0, -86, 6, 3, 0, 0, PI * 2); g.fill();
    // the steps and the drive
    g.fillStyle = '#d8d0c0'; g.fillRect(-52, -6, 104, 2); g.fillStyle = '#c8bfae'; g.fillRect(-56, -4, 112, 2); g.fillStyle = '#b6ad9c'; g.fillRect(-60, -2, 120, 2);
  }
  function lawn(g, W, H, o) {
    const lg = g.createLinearGradient(0, o.base, 0, H); lg.addColorStop(0, '#163a1c'); lg.addColorStop(1, '#06140a');
    g.fillStyle = lg; g.fillRect(0, o.base, W, H - o.base);
    const fl = g.createRadialGradient(o.cx, o.base, 4, o.cx, o.base, 160 * o.s);
    fl.addColorStop(0, 'rgba(255,220,160,0.28)'); fl.addColorStop(1, 'rgba(255,220,160,0)');
    g.fillStyle = fl; g.fillRect(0, o.base, W, H - o.base);
    // the drive curving in to the steps
    g.strokeStyle = 'rgba(200,190,170,0.35)'; g.lineWidth = 5 * o.s; g.beginPath();
    g.moveTo(o.cx - 220 * o.s, H + 4); g.quadraticCurveTo(o.cx - 70 * o.s, o.base + 6 * o.s, o.cx, o.base + 2 * o.s); g.quadraticCurveTo(o.cx + 70 * o.s, o.base + 6 * o.s, o.cx + 220 * o.s, H + 4); g.stroke();
  }
  function flag(g, o, t) {
    const x = o.cx, top = o.base - 132 * o.s, s = o.s;
    g.fillStyle = '#d8d0c0'; g.fillRect(x - 0.6 * s, top, 1.2 * s, 34 * s);
    g.fillStyle = '#f0d070'; g.beginPath(); g.arc(x, top, 1.4 * s, 0, PI * 2); g.fill();
    const FW = 26, FH = 15, N = 13;
    for (let i = 0; i < N; i++) {
      const u0 = i / N, u1 = (i + 1) / N, wav = u => Math.sin(t * 4.2 - u * 6) * 2.2 * u;
      const xa = x + u0 * FW * s, xb = x + u1 * FW * s + 0.4, ya = top + 1.5 * s + wav(u0) * s, yb = top + 1.5 * s + wav(u1) * s;
      for (let r = 0; r < 7; r++) {
        g.fillStyle = r % 2 ? '#f4f0ea' : '#c8202c';
        const h = FH / 7, y0 = r * h;
        g.beginPath(); g.moveTo(xa, ya + y0 * s); g.lineTo(xb, yb + y0 * s); g.lineTo(xb, yb + (y0 + h) * s + 0.3); g.lineTo(xa, ya + (y0 + h) * s + 0.3); g.closePath(); g.fill();
      }
      if (u0 < 0.42) {
        g.fillStyle = '#23306e'; g.beginPath(); g.moveTo(xa, ya); g.lineTo(xb, yb); g.lineTo(xb, yb + FH * 4 / 7 * s); g.lineTo(xa, ya + FH * 4 / 7 * s); g.closePath(); g.fill();
        if (i % 2) { g.fillStyle = '#f4f0ea'; for (let r = 0; r < 3; r++) g.fillRect((xa + xb) / 2 - 0.4, ya + (1.4 + r * 2.4) * s, 0.9, 0.9); }
      }
      // shading in the folds
      g.fillStyle = `rgba(0,0,0,${0.18 * Math.max(0, Math.cos(t * 4.2 - u0 * 6))})`; g.fillRect(xa, Math.min(ya, yb), xb - xa, FH * s + 2);
    }
  }

  let cache = null;
  function scene(g, W, H, t, o) {
    const key = [W, H, o.cx, o.base, o.s].join();
    if (!cache || cache.key !== key) {
      const mk = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
      const back = mk(), front = mk();
      sky(back.getContext('2d'), W, H, o);
      const f = front.getContext('2d');
      lawn(f, W, H, o);
      f.save(); f.translate(o.cx, o.base); f.scale(o.s, o.s); building(f); f.restore();
      cache = { key, back, front };
    }
    g.drawImage(cache.back, 0, 0);
    beams(g, o, t);
    g.drawImage(cache.front, 0, 0);
    flag(g, o, t);
  }
  return { scene };
})();
