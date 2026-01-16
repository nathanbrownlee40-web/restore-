// ===== SIMPLE STATE (example data – your real data can replace this) =====
const bankrollData = [0, 10, 25, 20, 40, 55, 50];
const over25Data   = [0, 5, 12, 18, 15, 22, 30];
const bttsData     = [0, 8, 6, 14, 20, 18, 26];

const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

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
  console.log("Result saved:", results.at(-1));
}

// Hook into ✅ ❌ buttons
document.addEventListener("click", (e) => {
  const btn = e.target;
  if (!btn || !btn.classList.contains("action-btn")) return;

  const card = btn.closest(".bet-card");
  if (!card) return;

  const text = btn.textContent.trim();
  const marketText = card.textContent;

  let market = "Other";
  if (/over\s*2\.5/i.test(marketText)) market = "Over 2.5";
  if (/btts/i.test(marketText)) market = "BTTS";

  // Default stake logic (can be improved later)
  const STAKE = 10;

  if (text === "✅") {
    addResult({ market, profit: STAKE });
  }

  if (text === "❌") {
    addResult({ market, profit: -STAKE });
  }
});
