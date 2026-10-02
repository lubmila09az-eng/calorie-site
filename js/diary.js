document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('entryForm');
    const dateInput = document.getElementById('entryDate');
    const tbody = document.querySelector('#entriesTable tbody');
  
    // Дата по умолчанию — сегодня
    dateInput.value = new Date().toISOString().slice(0, 10);
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('entryProduct').value;
      const weight = +document.getElementById('entryWeight').value;
      const product = Products.find(name);
      if (!product) return;
  
      const k = weight / 100;
      Storage.addEntry({
        date: document.getElementById('entryDate').value,
        meal: document.getElementById('entryMeal').value,
        product: name,
        weight: weight,
        kcal: Math.round(product.kcal * k),
        p: +(product.p * k).toFixed(1),
        f: +(product.f * k).toFixed(1),
        c: +(product.c * k).toFixed(1)
      });
  
      form.reset();
      dateInput.value = new Date().toISOString().slice(0, 10);
      document.getElementById('entryWeight').value = 100;
      render();
    });
  
    dateInput.addEventListener('change', render);
  
    function render() {
      const date = dateInput.value;
      const entries = Storage.getEntries().filter(e => e.date === date);
  
      tbody.innerHTML = entries.map(e => `
        <tr>
          <td>${e.date}</td>
          <td>${e.meal}</td>
          <td>${e.product}</td>
          <td>${e.weight}</td>
          <td>${e.kcal}</td>
          <td>${e.p}</td>
          <td>${e.f}</td>
          <td>${e.c}</td>
          <td><button class="danger" data-id="${e.id}">×</button></td>
        </tr>
      `).join('');
  
      tbody.querySelectorAll('button[data-id]').forEach(btn => {
        btn.addEventListener('click', () => {
          Storage.removeEntry(btn.dataset.id);
          render();
        });
      });
  
      const totals = Storage.dayTotals(date);
      document.getElementById('sumKcal').textContent = Math.round(totals.kcal);
      document.getElementById('sumP').textContent = totals.p.toFixed(1);
      document.getElementById('sumF').textContent = totals.f.toFixed(1);
      document.getElementById('sumC').textContent = totals.c.toFixed(1);
  
      renderProgress(date, totals);
    }
  
    function renderProgress(date, totals) {
      const goal = Storage.getGoal();
      if (!goal) {
        document.getElementById('dayProgress').innerHTML =
          '<p>Задайте цель на странице «Калькулятор» или «Цели».</p>';
        return;
      }
  
      const lines = [
        ['Калории', Math.round(totals.kcal), goal.calories, 'ккал'],
        ['Белки', +totals.p.toFixed(1), goal.protein, 'г'],
        ['Жиры', +totals.f.toFixed(1), goal.fat, 'г'],
        ['Углеводы', +totals.c.toFixed(1), goal.carbs, 'г']
      ];
  
      document.getElementById('dayProgress').innerHTML = `
        <h2>Прогресс за ${date}</h2>
        ${lines.map(([name, cur, max, unit]) => {
          const pct = Math.min(100, Math.round((cur / max) * 100));
          return `
            <div class="card" style="border-top-color:#43a047">
              <h3>${name}: ${cur} / ${max} ${unit}</h3>
              <div class="bar"><span style="width:${pct}%"></span></div>
              <div class="unit">${pct}%</div>
            </div>
          `;
        }).join('')}
      `;
    }
  
    render();
  });