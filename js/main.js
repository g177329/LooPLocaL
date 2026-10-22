const CATEGORIES = {
    paper:     { name: 'Paper & Cardboard', color: '#2563eb', icon: '📄' },
    plastic:   { name: 'Plastic',           color: '#f59e0b', icon: '🥤' },
    glass:     { name: 'Glass',             color: '#0891b2', icon: '🍾' },
    metal:     { name: 'Metal',             color: '#64748b', icon: '🥫' },
    organic:   { name: 'Organic',           color: '#65a30d', icon: '🍃' },
    ewaste:    { name: 'E-Waste',           color: '#7c3aed', icon: '🔌' },
    hazardous: { name: 'Hazardous',         color: '#dc2626', icon: '⚠️' },
    textile:   { name: 'Textiles',          color: '#db2777', icon: '👕' }
  };
  
  const RECYCLING_ITEMS = [
    { name: 'Plastic bottle', category: 'plastic', co2: 0.08, rule: 'Rinse, remove cap, place in recycling bin.' },
    { name: 'Aluminium can', category: 'metal', co2: 0.15, rule: 'Rinse and place in recycling bin.' },
    { name: 'Glass bottle', category: 'glass', co2: 0.30, rule: 'Rinse, place in glass bank.' },
    { name: 'Cardboard box', category: 'paper', co2: 0.05, rule: 'Flatten and place in paper recycling.' },
    { name: 'Battery', category: 'hazardous', co2: 0.00, rule: 'Take to battery drop-off point.' },
    { name: 'Old smartphone', category: 'ewaste', co2: 0.50, rule: 'Wipe data, take to e-waste collection.' },
    { name: 'Food scraps', category: 'organic', co2: 0.05, rule: 'Compost or use food-waste bin.' },
    { name: 'Old T-shirt', category: 'textile', co2: 0.40, rule: 'Donate or take to textile bank.' }
  ];
  
  window.addEventListener('load', () => {
    initSortingGuide();
    initDashboard();
    initVolunteerForm();
  });
  
  /* ===== SORTING GUIDE ===== */
  function initSortingGuide() {
    const itemsGrid = document.getElementById('itemsGrid');
    if (!itemsGrid) return;
  
    const searchInput = document.getElementById('searchInput');
    const filterChips = document.getElementById('filterChips');
    let activeCategory = 'all';
  
    function renderChips() {
      const chips = [{ id: 'all', name: 'All', color: '#10b981', icon: '🗂️' }, ...Object.entries(CATEGORIES).map(([id, c]) => ({ id, ...c }))];
      filterChips.innerHTML = chips.map(c => `<button class="chip ${c.id === activeCategory ? 'active' : ''}" data-cat="${c.id}">${c.icon || '🗂️'} ${c.name}</button>`).join('');
      
      filterChips.querySelectorAll('.chip').forEach(btn => {
        btn.addEventListener('click', () => {
          activeCategory = btn.dataset.cat;
          renderChips();
          renderItems();
        });
      });
    }
  
    function renderItems() {
      const query = searchInput.value.trim().toLowerCase();
      const filtered = RECYCLING_ITEMS.filter(item => {
        const matchCat = activeCategory === 'all' || item.category === activeCategory;
        const matchTxt = !query || item.name.toLowerCase().includes(query);
        return matchCat && matchTxt;
      });
  
      if (!filtered.length) {
        itemsGrid.innerHTML = `<p class="notice">No items found.</p>`;
        return;
      }
  
      itemsGrid.innerHTML = filtered.map(item => {
        const cat = CATEGORIES[item.category];
        return `
          <article class="item-card">
            <span class="cat-tag" style="background:${cat.color}22;color:${cat.color}">${cat.icon} ${cat.name}</span>
            <h4>${item.name}</h4>
            <p class="rule">${item.rule}</p>
            <p class="co2">💚 Saves ≈ ${item.co2.toFixed(2)} kg CO₂</p>
          </article>
        `;
      }).join('');
    }
  
    searchInput.addEventListener('input', renderItems);
    renderChips();
    renderItems();
  }
  
  /* ===== DASHBOARD ===== */
  function initDashboard() {
    const logForm = document.getElementById('logForm');
    if (!logForm) return; 
  
    const logItem = document.getElementById('logItem');
    const logCount = document.getElementById('logCount');
    const resetLog = document.getElementById('resetLog');
    let recyclingLog = JSON.parse(localStorage.getItem('ll_log')) || [];
    let doughnutChart, barChart;
  
    logItem.innerHTML = `<option value="">— Select item —</option>` + RECYCLING_ITEMS.map((it, i) => `<option value="${i}">${it.name}</option>`).join('');
  
    function initCharts() {
      doughnutChart = new Chart(document.getElementById('doughnutChart').getContext('2d'), {
        type: 'doughnut',
        data: { labels: [], datasets: [{ data: [], backgroundColor: [] }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
      });
      barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: { labels: [], datasets: [{ label: 'Items recycled', data: [], backgroundColor: '#4C8780', borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } }
      });
    }
  
    function updateDashboard() {
      const totalItems = recyclingLog.reduce((s, e) => s + e.count, 0);
      const totalCO2 = recyclingLog.reduce((s, e) => s + (e.co2 * e.count), 0);
      if(document.getElementById('impactItems')) document.getElementById('impactItems').textContent = totalItems;
      if(document.getElementById('impactCO2')) document.getElementById('impactCO2').textContent = totalCO2.toFixed(1) + ' kg';
  
      const byCat = {};
      recyclingLog.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + e.count; });
      const catKeys = Object.keys(byCat);
      if (doughnutChart) {
        doughnutChart.data.labels = catKeys.map(k => CATEGORIES[k].name);
        doughnutChart.data.datasets[0].data = catKeys.map(k => byCat[k]);
        doughnutChart.data.datasets[0].backgroundColor = catKeys.map(k => CATEGORIES[k].color);
        doughnutChart.update();
      }
  
      const days = [], labels = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days.push(d.toISOString().slice(0, 10));
        labels.push(d.toLocaleDateString('en-GB', { weekday: 'short' }));
      }
      if (barChart) {
        barChart.data.labels = labels;
        barChart.data.datasets[0].data = days.map(iso => recyclingLog.filter(e => e.date === iso).reduce((s, e) => s + e.count, 0));
        barChart.update();
      }
    }
  
    logForm.addEventListener('submit', e => {
      e.preventDefault();
      const idx = logItem.value;
      if (idx === '') return;
      const item = RECYCLING_ITEMS[+idx];
      recyclingLog.push({ name: item.name, category: item.category, co2: item.co2, count: parseInt(logCount.value), date: new Date().toISOString().slice(0, 10) });
      localStorage.setItem('ll_log', JSON.stringify(recyclingLog));
      logCount.value = 1;
      updateDashboard();
    });
  
    resetLog.addEventListener('click', () => {
      if (!confirm('Clear your log?')) return;
      recyclingLog = [];
      localStorage.setItem('ll_log', JSON.stringify(recyclingLog));
      updateDashboard();
    });
  
    initCharts();
    updateDashboard();
  }
  
  /* ===== VOLUNTEER FORM ===== */
  function initVolunteerForm() {
    const form = document.getElementById('volunteerForm');
    if (!form) return;
  
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('volName').value;
      alert(`✅ Thank you, ${name}! You have joined the Green Team.`);
      form.reset();
    });
  }
