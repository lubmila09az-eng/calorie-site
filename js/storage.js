const Storage = (() => {
    const KEYS = {
      GOAL: 'calorie_goal',
      ENTRIES: 'calorie_entries',
      CUSTOM_PRODUCTS: 'calorie_custom_products'
    };
  
    /* ----- Цель ----- */
    function saveGoal(goal) {
      localStorage.setItem(KEYS.GOAL, JSON.stringify(goal));
    }
    function getGoal() {
      try { return JSON.parse(localStorage.getItem(KEYS.GOAL)); }
      catch { return null; }
    }
  
    /* ----- Записи дневника ----- */
    function getEntries() {
      try { return JSON.parse(localStorage.getItem(KEYS.ENTRIES)) || []; }
      catch { return []; }
    }
    function saveEntries(list) {
      localStorage.setItem(KEYS.ENTRIES, JSON.stringify(list));
    }
    function addEntry(entry) {
      const list = getEntries();
      entry.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      list.push(entry);
      saveEntries(list);
      return entry;
    }
    function removeEntry(id) {
      const list = getEntries().filter(e => e.id !== id);
      saveEntries(list);
    }
  
    /* ----- Пользовательские продукты ----- */
    function getCustomProducts() {
      try { return JSON.parse(localStorage.getItem(KEYS.CUSTOM_PRODUCTS)) || []; }
      catch { return []; }
    }
    function saveCustomProducts(list) {
      localStorage.setItem(KEYS.CUSTOM_PRODUCTS, JSON.stringify(list));
    }
    function resetCustomProducts() {
      localStorage.removeItem(KEYS.CUSTOM_PRODUCTS);
    }
  
    /* ----- Агрегация ----- */
    function dayTotals(date) {
      const entries = getEntries().filter(e => e.date === date);
      return entries.reduce((acc, e) => {
        acc.kcal += e.kcal;
        acc.p += e.p;
        acc.f += e.f;
        acc.c += e.c;
        return acc;
      }, { kcal: 0, p: 0, f: 0, c: 0 });
    }
  
    function lastNDays(n) {
      const out = [];
      const today = new Date();
      for (let i = n - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        out.push(d.toISOString().slice(0, 10));
      }
      return out;
    }
  
    return {
      saveGoal, getGoal,
      getEntries, saveEntries, addEntry, removeEntry,
      getCustomProducts, saveCustomProducts, resetCustomProducts,
      dayTotals, lastNDays
    };
  })();