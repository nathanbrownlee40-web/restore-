// ===== CHART DATA FROM REAL RESULTS =====
function buildSeries(filterMarket = null) {
  const results = getResults();
  let running = 0;
  const data = [];

  results.forEach(r => {
    if (!filterMarket || r.market === filterMarket) {
      running += r.profit;
      data.push(running);
    }
  });

  return data.length ? data : [0];
}

function buildLabels() {
  const results = getResults();
  return results.map((_, i) => `#${i + 1}`);
}

// Destroy & rebuild charts safely
let bankrollChart, over25Chart, bttsChart;

function renderCharts() {
  const labels = buildLabels();

  const bankrollData = buildSeries();
  const over25Data = buildSeries("Over 2.5");
  const bttsData = buildSeries("BTTS");

  if (bankrollChart) bankrollChart.destroy();
  if (over25Chart) over25Chart.destroy();
  if (bttsChart) bttsChart.destroy();

  bankrollChart = makeChart(
    "bankrollChart",
    "Bankroll",
    bankrollData,
    "#22c55e"
  );

  over25Chart = makeChart(
    "over25Chart",
    "Over 2.5",
    over25Data,
    "#3b82f6"
  );

  bttsChart = makeChart(
    "bttsChart",
    "BTTS",
    bttsData,
    "#a855f7"
  );
}

// Re-render charts whenever page loads
window.addEventListener("load", renderCharts);

// ===== CHART HELPER =====
function makeChart(canvasId, label, data, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label,
        data,
        borderColor: color,
        backgroundColor: "transparent",
        borderWidth: 3,
        tension: 0.35,
        pointRadius: 3,
        pointBackgroundColor: color
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: "#9ca3af" },
          grid: { display: false }
        },
        y: {
          ticks: { color: "#9ca3af" },
          grid: { color: "rgba(255,255,255,0.05)" }
        }
      }
    }
  });
}

// ===== INIT CHARTS =====
window.addEventListener("load", () => {
  makeChart("bankrollChart", "Bankroll", bankrollData, "#22c55e");
  makeChart("over25Chart", "Over 2.5", over25Data, "#3b82f6");
  makeChart("bttsChart", "BTTS", bttsData, "#a855f7");
});
// ===== RESULT TRACKING (STEP A1) =====
const STORAGE_KEY = "top_daily_tips_results";

function getResults() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveResults(results) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function addResult({ market, profit }) {
  const results = getResults();
  results.push({
    market,
    profit,
    date: new Date().toISOString().slice(0, 10)
  });
  saveResults(results);
  renderCharts();
  console.log("Result saved:", results.at(-1));
}
// Hook into ✅ ❌ buttons
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".result-btn");
  if (!btn) return;

  const card = btn.closest(".bet-card");
  if (!card) return;

  const market =
    card.textContent.includes("BTTS") ? "BTTS Yes" : "Over 2.5";

  let profit = 0;
  const symbol = btn.textContent.trim();

  if (symbol === "✅") profit = 1;
  if (symbol === "❌") profit = -1;

  addResult({ market, profit });
});
