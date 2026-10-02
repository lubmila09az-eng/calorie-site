document.addEventListener('DOMContentLoaded', () => {
    const days = Storage.lastNDays(7);
    const totals = days.map(d => Storage.dayTotals(d));
  
    const labels = days.map(d => d.slice(5));
    const kcal = totals.map(t => t.kcal);
    const p = totals.map(t => t.p);
    const f = totals.map(t => t.f);
    const c = totals.map(t => t.c);
  
    drawBarChart('chartKcal', labels, kcal, '#43a047', 'ккал');
    drawMultiBarChart('chartMacros', labels, [
      { label: 'Белки', data: p, color: '#1e88e5' },
      { label: 'Жиры', data: f, color: '#fb8c00' },
      { label: 'Углеводы', data: c, color: '#8e24aa' }
    ]);
  
    const sum = {
      kcal: kcal.reduce((a, b) => a + b, 0),
      p: p.reduce((a, b) => a + b, 0),
      f: f.reduce((a, b) => a + b, 0),
      c: c.reduce((a, b) => a + b, 0)
    };
    const avg = {
      kcal: Math.round(sum.kcal / 7),
      p: Math.round(sum.p / 7),
      f: Math.round(sum.f / 7),
      c: Math.round(sum.c / 7)
    };
  
    document.getElementById('summary').innerHTML = `
      <div class="cards">
        <div class="card"><h3>Средние калории</h3><div class="value">${avg.kcal}</div><div class="unit">ккал/день</div></div>
        <div class="card"><h3>Средние белки</h3><div class="value">${avg.p}</div><div class="unit">г/день</div></div>
        <div class="card"><h3>Средние жиры</h3><div class="value">${avg.f}</div><div class="unit">г/день</div></div>
        <div class="card"><h3>Средние углеводы</h3><div class="value">${avg.c}</div><div class="unit">г/день</div></div>
      </div>
    `;
  });
  
  /* ---------- Простые рисовалки на canvas ---------- */
  
  function drawBarChart(id, labels, data, color, unit) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.clientWidth;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
  
    const pad = 40;
    const max = Math.max(...data, 1);
    const bw = (W - pad * 2) / data.length;
  
    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#555';
  
    data.forEach((v, i) => {
      const h = (v / max) * (H - pad * 2);
      const x = pad + i * bw + bw * 0.15;
      const y = H - pad - h;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, bw * 0.7, h);
      ctx.fillStyle = '#333';
      ctx.fillText(v, x, y - 4);
      ctx.fillStyle = '#555';
      ctx.fillText(labels[i], x, H - pad + 14);
    });
  
    ctx.fillStyle = '#2e7d32';
    ctx.fillText(unit, 6, 14);
  }
  
  function drawMultiBarChart(id, labels, series) {
    const canvas = document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width = canvas.clientWidth;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
  
    const pad = 40;
    const max = Math.max(...series.flatMap(s => s.data), 1);
    const groupW = (W - pad * 2) / labels.length;
    const barW = groupW / (series.length + 1);
  
    ctx.font = '11px sans-serif';
  
    labels.forEach((lab, i) => {
      series.forEach((s, j) => {
        const v = s.data[i];
        const h = (v / max) * (H - pad * 2);
        const x = pad + i * groupW + barW * (j + 0.5);
        const y = H - pad - h;
        ctx.fillStyle = s.color;
        ctx.fillRect(x, y, barW, h);
      });
      ctx.fillStyle = '#555';
      ctx.fillText(lab, pad + i * groupW + groupW * 0.2, H - pad + 14);
    });
  
    // Легенда
    let lx = pad;
    series.forEach(s => {
      ctx.fillStyle = s.color;
      ctx.fillRect(lx, 6, 10, 10);
      ctx.fillStyle = '#333';
      ctx.fillText(s.label, lx + 14, 15);
      lx += 80;
    });
  }