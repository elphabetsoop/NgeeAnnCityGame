/**
 * Loads leaderboard data from localStorage and populates the leaderboard table.
 * @param {string} mode - Either "arcade" or "free", determining which leaderboard to load.
 */
function loadLeaderboard(mode = "arcade") {
     // Determine which localStorage key to use based on game mode
     const storageKey = mode === "arcade"
          ? "ngeeAnnCityLeaderboardArcade"
          : "ngeeAnnCityLeaderboardFree";

     const raw = localStorage.getItem(storageKey); // Retrieve raw JSON data from localStorage
     const tableBody = document.getElementById("leaderboardBody"); // Leaderboard table body element
     const noData = document.getElementById("no-data"); // Element to show when no data exists

     tableBody.innerHTML = ""; // Clear any existing rows

     if (!raw) {
          // No data stored yet
          noData.style.display = "block";
          return;
     }

     let data;
     try {
          data = JSON.parse(raw); // Parse JSON string into object
          if (!Array.isArray(data) || data.length === 0) {
               // Handle empty or invalid data
               noData.style.display = "block";
               return;
          }
     } catch (err) {
          // Handle JSON parse errors
          console.error("Failed to parse leaderboard data:", err);
          noData.style.display = "block";
          return;
     }

     // Sort leaderboard entries by score in descending order and take top 10
     data.sort((a, b) => b.score - a.score);
     const top10 = data.slice(0, 10);

     noData.style.display = "none"; // Hide "no data" message if data is available

     // Create a new row for each entry and append to the table
     top10.forEach((entry, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
      <td>${index + 1}</td> <!-- Rank -->
      <td>${entry.name}</td> <!-- Player Name -->
      <td>${entry.score}</td> <!-- Player Score -->
      <td>${entry.turnCount}</td> <!-- Number of Turns Taken -->
      <td>${new Date(entry.date).toLocaleDateString()}</td> <!-- Date Played -->
    `;
          tableBody.appendChild(row);
     });
}

// Add event listeners to toggle buttons for switching between Arcade and Free Play leaderboards
document.getElementById("arcadeBtn").addEventListener("click", () => {
     setActive("arcade");
});

document.getElementById("freeBtn").addEventListener("click", () => {
     setActive("free");
});

/**
 * Sets the active mode visually and reloads the appropriate leaderboard.
 * @param {string} mode - "arcade" or "free"
 */
function setActive(mode) {
     document.getElementById("arcadeBtn").classList.toggle("active", mode === "arcade");
     document.getElementById("freeBtn").classList.toggle("active", mode === "free");
     loadLeaderboard(mode);
}

// Load Arcade leaderboard by default on initial page load
loadLeaderboard("arcade");
