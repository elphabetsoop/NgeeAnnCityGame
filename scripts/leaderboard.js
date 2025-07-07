// Sample leaderboard data — replace with real data
const arcadeData = [
  { player: "Alice", score: 1200 },
  { player: "Bob", score: 950 },
  { player: "Charlie", score: 800 }
];

const freeplayData = [
  { player: "David", score: 600 },
  { player: "Eve", score: 550 },
  { player: "Frank", score: 400 }
];

// Populate leaderboard table by mode
function populateLeaderboard(data, tbodyId) {
  const tbody = document.getElementById(tbodyId);
  tbody.innerHTML = ""; // Clear existing rows

  data
    .sort((a, b) => b.score - a.score)
    .forEach((entry, index) => {
      const row = document.createElement("tr");
      row.classList.add("leaderboard-entry"); // for hover effects
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${entry.player}</td>
        <td>${entry.score}</td>
      `;
      tbody.appendChild(row);
    });
}

// Show one leaderboard and hide the other
function showLeaderboard(mode) {
  const arcadeTable = document.getElementById("arcade-leaderboard");
  const freeplayTable = document.getElementById("freeplay-leaderboard");

  if (mode === "arcade") {
    arcadeTable.style.display = "table";
    freeplayTable.style.display = "none";
  } else {
    arcadeTable.style.display = "none";
    freeplayTable.style.display = "table";
  }
}

// Initial population
populateLeaderboard(arcadeData, "arcade-body");
populateLeaderboard(freeplayData, "freeplay-body");

function goToMainMenu() {
    window.location.href = 'index.html';
}
