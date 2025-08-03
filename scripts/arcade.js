/**
 * Main Arcade Mode Game Logic for Ngee Ann City
 * Handles grid-based building placement, score calculation, turn/coin management, 
 * demolish mode, overlays, save/load functionality, and end-game logic.
 */

// === Import Required Modules ===
import { saveGame } from "./save_game.js";
import { loadGame } from "./load_saved_game.js";
import { calculateScore } from "./scoring.js";

// === Canvas & Game Constants ===
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 48;
const gridSize = 20;
const canvasSize = tileSize * gridSize;

canvas.width = canvasSize;
canvas.height = canvasSize;

// === Game State Variables ===
let gameBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
let coinCount = 16;
let turnCount = 1;
let score = 0;
let demolishMode = false;
let selectedBuilding = null;
let playerName = null;

const buildings = ["Residential", "Industry", "Commercial", "Park", "Road"];
const buildingImages = {};

/**
 * Converts gameBoard into a serializable format.
 */
function serializeGameBoard(board) {
     return board.map(row => row.map(cell => (cell ? cell.type : null)));
}

/**
 * Converts saved game data back into in-game objects.
 */
function deserializeGameBoard(serializedBoard) {
     return serializedBoard.map(row =>
          row.map(type => type ? { type: type, buildingStats: { i_score: 0, i_coin: 0 } } : null)
     );
}

/**
 * Checks if game over condition (coinCount <= 0) is met and triggers Game Over modal and leaderboard update.
 */
function checkGameOver() {
     console.log("Coins:", coinCount);
     if (coinCount <= 0) {
          console.log("Game Over triggered");

          document.getElementById('finalScore').innerText = score;
          document.getElementById('finalTurns').innerText = turnCount;

          // Count and display building statistics
          const stats = {};
          for (const row of gameBoard) {
               for (const cell of row) {
                    if (cell) {
                         const type = typeof cell === "string" ? cell : cell.type;
                         stats[type] = (stats[type] || 0) + 1;
                    }
               }
          }

          const summaryContainer = document.getElementById("buildingStatsSummary");
          summaryContainer.innerHTML = "<strong>Buildings Placed:</strong><ul style='padding-left: 20px;'>";
          for (const [type, count] of Object.entries(stats)) {
               summaryContainer.innerHTML += `<li>${type}: ${count}</li>`;
          }
          summaryContainer.innerHTML += "</ul>";

          // Add to local leaderboard
          const entry = {
               name: playerName || "Anonymous",
               score,
               turnCount,
               date: new Date().toISOString()
          };

          const leaderboard = JSON.parse(localStorage.getItem("ngeeAnnCityLeaderboardArcade") || "[]");
          leaderboard.push(entry);
          leaderboard.sort((a, b) => b.score - a.score);
          localStorage.setItem("ngeeAnnCityLeaderboardArcade", JSON.stringify(leaderboard));

          const modal = document.getElementById('gameOverModal');
          modal.classList.remove('hidden');
          modal.style.display = 'flex';
     }
}

/**
 * Preloads all building images into memory.
 */
function loadImages() {
     const promises = buildings.map(name => {
          return new Promise(resolve => {
               const img = new Image();
               img.onload = () => resolve();
               img.onerror = () => {
                    console.error(`Failed to load image for ${name}`);
                    resolve();
               };
               img.src = `../assets/${name.toLowerCase()}.png`;
               buildingImages[name] = img;
          });
     });
     return Promise.all(promises);
}

/**
 * Resets the board state and starts a new game session.
 */
function startNewGame() {
     localStorage.removeItem(playerName);
     gameBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
     coinCount = 16;
     turnCount = 1;
     score = 0;
     demolishMode = false;
     selectedBuilding = null;
     document.getElementById("coinCount").textContent = coinCount;
     document.getElementById("turnCount").textContent = turnCount;
     document.getElementById("scoreDisplay").textContent = score;
     generateBuildingChoices();
     drawBoard();
}

/**
 * Returns a tooltip text for the selected building type.
 */
function getTooltipText(building) {
     switch (building) {
          case "Residential":
               return `Residential: 
Scores 1 if next to Industry.
Otherwise, +1 per adjacent Residential or Commercial, +2 per Park.`;
          case "Industry":
               return `Industry: 
+1 per Industry in city.
Generates 1 coin per adjacent Residential.`;
          case "Commercial":
               return `Commercial: 
+1 per adjacent Commercial.
Generates 1 coin per adjacent Residential.`;
          case "Park":
               return `Park: 
+1 per adjacent Park.`;
          case "Road":
               return `Road: 
+1 per connected Road in same row.`;
          default:
               return "";
     }
}

/**
 * Displays two randomly selected building options with tooltips.
 */
function generateBuildingChoices() {
     const choiceContainer = document.getElementById("buildingChoices");
     choiceContainer.innerHTML = "";
     const choices = [];
     while (choices.length < 2) {
          const b = buildings[Math.floor(Math.random() * buildings.length)];
          if (!choices.includes(b)) choices.push(b);
     }

     choices.forEach(building => {
          const div = document.createElement("div");
          div.classList.add("tooltip-container");

          const img = document.createElement("img");
          img.src = `../assets/${building.toLowerCase()}.png`;
          img.alt = building;
          img.draggable = true;
          img.addEventListener("dragstart", e => {
               e.dataTransfer.setData("text/plain", building);
          });
          img.addEventListener("click", () => {
               document.querySelectorAll(".choices img").forEach(el => el.classList.remove("selected"));
               img.classList.add("selected");
               selectedBuilding = building;
          });

          const tooltip = document.createElement("div");
          tooltip.classList.add("tooltip-text");
          tooltip.innerText = getTooltipText(building);

          div.appendChild(img);
          div.appendChild(tooltip);
          choiceContainer.appendChild(div);
     });
}

/**
 * Redraws the entire game board grid and buildings.
 */
function drawBoard() {
     ctx.clearRect(0, 0, canvasSize, canvasSize);
     document.querySelectorAll('.building-stat-overlay').forEach(el => el.remove());

     for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
               ctx.strokeStyle = "#ccc";
               ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
               const cell = gameBoard[y][x];
               if (cell) {
                    const buildingType = typeof cell === 'string' ? cell : cell.type;
                    ctx.drawImage(buildingImages[buildingType], x * tileSize, y * tileSize, tileSize, tileSize);
                    if (typeof cell === 'object' && cell.buildingStats) {
                         createBuildingStatsOverlay(x, y, cell);
                    }
               }
          }
     }
}

/**
 * Creates interactive overlays showing building-specific stats.
 */
function createBuildingStatsOverlay(x, y, building) {
     const canvasRect = canvas.getBoundingClientRect();

     const overlay = document.createElement("div");
     overlay.classList.add("building-stat-overlay", "tooltip-container");
     overlay.style.position = "absolute";
     overlay.style.left = (canvasRect.left + window.scrollX + x * tileSize) + "px";
     overlay.style.top = (canvasRect.top + window.scrollY + y * tileSize) + "px";
     overlay.style.width = tileSize + "px";
     overlay.style.height = tileSize + "px";
     overlay.style.pointerEvents = demolishMode ? "none" : "auto";
     overlay.style.zIndex = "10";

     const tooltip = document.createElement("div");
     tooltip.classList.add("tooltip-text");
     tooltip.innerHTML = `
        <strong>${building.type}</strong><br>
        Score: ${building.buildingStats.i_score}<br>
        Coins: ${building.buildingStats.i_coin}
    `;

     overlay.appendChild(tooltip);
     document.body.appendChild(overlay);
}

// === Event: Placing or Demolishing ===
canvas.addEventListener("click", e => {
     const rect = canvas.getBoundingClientRect();
     const x = Math.floor((e.clientX - rect.left) / tileSize);
     const y = Math.floor((e.clientY - rect.top) / tileSize);

     if (demolishMode) {
          if (gameBoard[y][x] && coinCount > 0) {
               const building = gameBoard[y][x];
               if (typeof building === 'object' && building.buildingStats) {
                    score -= building.buildingStats.i_score;
                    coinCount -= building.buildingStats.i_coin;
                    console.log(`Demolished ${building.type} - Score: -${building.buildingStats.i_score}, Coins: -${building.buildingStats.i_coin}`);
               }
               gameBoard[y][x] = null;
               coinCount--;
               document.getElementById("coinCount").textContent = coinCount;
               document.getElementById("scoreDisplay").textContent = score;
               drawBoard();
               checkGameOver();
          }
          return;
     }

     if (!selectedBuilding || gameBoard[y][x]) return;
     placeBuilding(x, y, selectedBuilding);
});

canvas.addEventListener("dragover", e => e.preventDefault());

canvas.addEventListener("drop", e => {
     e.preventDefault();
     const rect = canvas.getBoundingClientRect();
     const x = Math.floor((e.clientX - rect.left) / tileSize);
     const y = Math.floor((e.clientY - rect.top) / tileSize);
     const droppedBuilding = e.dataTransfer.getData("text/plain");
     if (!gameBoard[y][x]) {
          placeBuilding(x, y, droppedBuilding);
     }
});

/**
 * Places a building and updates score, turn, coin, and UI.
 */
function placeBuilding(x, y, building) {
     if (coinCount <= 0) return;

     const buildingObj = {
          type: building,
          buildingStats: { i_score: 0, i_coin: 0 }
     };
     gameBoard[y][x] = buildingObj;

     console.log(`Placing ${building} at (${x}, ${y})`);

     coinCount--;
     turnCount++;

     const result = calculateScore(gameBoard, score, coinCount, x, y, building, buildingObj.buildingStats);
     score = result.score;
     coinCount = result.coinCount;

     selectedBuilding = null;
     document.querySelectorAll(".choices img").forEach(el => el.classList.remove("selected"));
     document.getElementById("coinCount").textContent = coinCount;
     document.getElementById("turnCount").textContent = turnCount;
     document.getElementById("scoreDisplay").textContent = score;
     generateBuildingChoices();
     drawBoard();
     checkGameOver();
}

/**
 * Loads saved game state if available.
 */
function loadSavedGame() {
     const savedState = loadGame(playerName, "arcade");
     if (!savedState) {
          alert("No saved game found for this player. Please proceed to Main Menu");
          return;
     }

     gameBoard = deserializeGameBoard(savedState.gameBoard);
     coinCount = Number(savedState.coinCount);
     turnCount = Number(savedState.turnCount);
     score = Number(savedState.score);

     document.getElementById("coinCount").textContent = coinCount;
     document.getElementById("turnCount").textContent = turnCount;
     document.getElementById("scoreDisplay").textContent = score;
     selectedBuilding = null;
     generateBuildingChoices();
     drawBoard();
}

// === Button & Modal Event Listeners ===
document.getElementById("saveGameBtn").addEventListener("click", () => {
     const serializedBoard = serializeGameBoard(gameBoard);
     const gameState = {
          mode: "arcade",
          gameBoard: serializedBoard,
          coinCount,
          turnCount,
          score
     };
     saveGame(gameState, playerName);

     const saveBtn = document.getElementById("saveGameBtn");
     saveBtn.textContent = "Game Saved!";
     setTimeout(() => {
          saveBtn.textContent = "Save Game";
     }, 500);
});

document.getElementById("demolishBtn").addEventListener("click", () => {
     demolishMode = !demolishMode;
     const btn = document.getElementById("demolishBtn");
     btn.classList.toggle("active", demolishMode);
     btn.textContent = `Demolish Mode: ${demolishMode ? "ON" : "OFF"}`;
     document.querySelectorAll('.building-stat-overlay').forEach(overlay => {
          overlay.style.pointerEvents = demolishMode ? "none" : "auto";
     });

     if (demolishMode) {
          document.getElementById("demolishModal").style.display = "flex";
     }
});

document.getElementById("closeDemolishModal").addEventListener("click", () => {
     document.getElementById("demolishModal").style.display = "none";
});

document.getElementById("exitBtn").addEventListener("click", (e) => {
     e.preventDefault();
     document.getElementById("exitModal").style.display = "flex";
});

document.getElementById("cancelExit").addEventListener("click", () => {
     document.getElementById("exitModal").style.display = "none";
});

document.getElementById("confirmExit").addEventListener("click", () => {
     window.location.href = "index.html";
});

// === Game Initialization ===
loadImages().then(() => {
     while (!playerName) {
          playerName = prompt("Enter your player name to begin:");
          if (!playerName) alert("Player name cannot be empty!");
     }

     const loadFlag = new URLSearchParams(window.location.search).get("load") === "true";
     loadFlag ? loadSavedGame() : startNewGame();

     drawBoard();
});
