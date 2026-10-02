const DEFAULT_PRODUCTS = [
    { name: 'Куриная грудка', kcal: 165, p: 31, f: 3.6, c: 0 },
    { name: 'Гречка (варёная)', kcal: 110, p: 4, f: 1.1, c: 21 },
    { name: 'Рис (варёный)', kcal: 116, p: 2.2, f: 0.5, c: 25 },
    { name: 'Яйцо куриное', kcal: 155, p: 13, f: 11, c: 1.1 },
    { name: 'Овсянка (варёная на воде)', kcal: 88, p: 3, f: 1.7, c: 15 },
    { name: 'Творог 5%', kcal: 121, p: 17, f: 5, c: 3 },
    { name: 'Молоко 2.5%', kcal: 52, p: 2.8, f: 2.5, c: 4.7 },
    { name: 'Яблоко', kcal: 52, p: 0.3, f: 0.2, c: 14 },
    { name: 'Банан', kcal: 89, p: 1.1, f: 0.3, c: 23 },
    { name: 'Огурец', kcal: 15, p: 0.7, f: 0.1, c: 3.6 },
    { name: 'Помидор', kcal: 18, p: 0.9, f: 0.2, c: 3.9 },
    { name: 'Хлеб цельнозерновой', kcal: 247, p: 13, f: 3.4, c: 41 },
    { name: 'Сыр твёрдый', kcal: 364, p: 25, f: 29, c: 0.5 },
    { name: 'Лосось', kcal: 208, p: 20, f: 13, c: 0 },
    { name: 'Картофель (варёный)', kcal: 87, p: 2, f: 0.1, c: 20 }
  ];
  
  const Products = (() => {
    function all() {
      return [...DEFAULT_PRODUCTS, ...Storage.getCustomProducts()];
    }
  
    function find(name) {
      return all().find(p => p.name === name);
    }
  
    function addCustom(product) {
      const list = Storage.getCustomProducts();
      list.push(product);
      Storage.saveCustomProducts(list);
    }
  
    return { all, find, addCustom };
  })();
  
  /* Наполнение select в дневнике */
  document.addEventListener('DOMContentLoaded', () => {
    const select = document.getElementById('entryProduct');
    if (select) {
      Products.all().forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.name;
        opt.textContent = `${p.name} (${p.kcal} ккал/100 г)`;
        select.appendChild(opt);
      });
    }
  
    /* Страница «Продукты» */
    const table = document.getElementById('productsTable');
    if (table) renderProductsTable('');
  
    const search = document.getElementById('search');
    if (search) {
      search.addEventListener('input', (e) => renderProductsTable(e.target.value.toLowerCase()));
    }
  
    const form = document.getElementById('addProductForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const product = {
          name: document.getElementById('pName').value.trim(),
          kcal: +document.getElementById('pKcal').value,
          p: +document.getElementById('pP').value,
          f: +document.getElementById('pF').value,
          c: +document.getElementById('pC').value
        };
        if (!product.name) return;
        Products.addCustom(product);
        form.reset();
        renderProductsTable(search ? search.value.toLowerCase() : '');
      });
    }
  
    const reset = document.getElementById('resetCustom');
    if (reset) {
      reset.addEventListener('click', () => {
        if (confirm('Удалить все пользовательские продукты?')) {
          Storage.resetCustomProducts();
          renderProductsTable('');
        }
      });
    }
  });
  
  function renderProductsTable(filter) {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;
    const list = Products.all().filter(p => p.name.toLowerCase().includes(filter));
    tbody.innerHTML = list.map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.kcal}</td>
        <td>${p.p}</td>
        <td>${p.f}</td>
        <td>${p.c}</td>
        <td><button class="secondary" onclick="quickAdd('${p.name.replace(/'/g, "\\'")}')">В дневник</button></td>
      </tr>
    `).join('');
  }
  
  function quickAdd(name) {
    const product = Products.find(name);
    if (!product) return;
    const weight = parseFloat(prompt(`Вес порции «${name}», г:`, '100'));
    if (!weight || weight <= 0) return;
  
    const k = weight / 100;
    Storage.addEntry({
      date: new Date().toISOString().slice(0, 10),
      meal: 'Перекус',
      product: name,
      weight: weight,
      kcal: Math.round(product.kcal * k),
      p: +(product.p * k).toFixed(1),
      f: +(product.f * k).toFixed(1),
      c: +(product.c * k).toFixed(1)
    });
    alert(`«${name}» (${weight} г) добавлено в дневник.`);
  }