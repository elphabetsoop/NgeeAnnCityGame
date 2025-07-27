function loadLeaderboard(mode = "arcade") {
  const storageKey = mode === "arcade"
    ? "ngeeAnnCityLeaderboardArcade"
    : "ngeeAnnCityLeaderboardFree";

  const raw = localStorage.getItem(storageKey);
  const tableBody = document.getElementById("leaderboardBody");
  const noData = document.getElementById("no-data");

  tableBody.innerHTML = "";

  if (!raw) {
    noData.style.display = "block";
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
    if (!Array.isArray(data) || data.length === 0) {
      noData.style.display = "block";
      return;
    }
  } catch (err) {
    console.error("Failed to parse leaderboard data:", err);
    noData.style.display = "block";
    return;
  }

  // Sort by score descending and keep only top 10
  data.sort((a, b) => b.score - a.score);
  const top10 = data.slice(0, 10);

  noData.style.display = "none";

  top10.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${entry.score}</td>
      <td>${entry.turnCount}</td>
      <td>${new Date(entry.date).toLocaleDateString()}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Toggle buttons
document.getElementById("arcadeBtn").addEventListener("click", () => {
  setActive("arcade");
});

document.getElementById("freeBtn").addEventListener("click", () => {
  setActive("free");
});

function setActive(mode) {
  document.getElementById("arcadeBtn").classList.toggle("active", mode === "arcade");
  document.getElementById("freeBtn").classList.toggle("active", mode === "free");
  loadLeaderboard(mode);
}

// Load default mode
loadLeaderboard("arcade");
