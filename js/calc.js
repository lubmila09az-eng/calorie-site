document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const sex = document.getElementById('sex').value;
    const age = +document.getElementById('age').value;
    const height = +document.getElementById('height').value;
    const weight = +document.getElementById('weight').value;
    const activity = +document.getElementById('activity').value;
    const goal = document.getElementById('goal').value;

    // Формула Миффлина — Сан Жеора
    let bmr;
    if (sex === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let calories = bmr * activity;

    // Коррекция под цель
    if (goal === 'lose') calories *= 0.8;
    if (goal === 'gain') calories *= 1.15;

    // БЖУ: 30/30/40
    const protein = (calories * 0.30) / 4;   // 4 ккал на 1 г белка
    const fat     = (calories * 0.30) / 9;   // 9 ккал на 1 г жира
    const carbs   = (calories * 0.40) / 4;   // 4 ккал на 1 г углеводов

    const data = {
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
      bmr: Math.round(bmr),
      updated: new Date().toISOString()
    };

    // Сохраняем цель для других страниц
    Storage.saveGoal(data);

    result.hidden = false;
    result.innerHTML = `
      <h2>Ваша суточная норма</h2>
      <p>Базовый метаболизм (BMR): <strong>${data.bmr} ккал</strong></p>
      <p>Калории: <span class="value">${data.calories} ккал</span></p>
      <p>Белки: <strong>${data.protein} г</strong> ·
         Жиры: <strong>${data.fat} г</strong> ·
         Углеводы: <strong>${data.carbs} г</strong></p>
      <p><a href="diary.html">Перейти в дневник →</a></p>
    `;
  });
});