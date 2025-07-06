// arcade.js
import { calculateScore } from "./scoring.js";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileSize = 48;
const gridSize = 20;
const canvasSize = tileSize * gridSize;

canvas.width = canvasSize;
canvas.height = canvasSize;

let gameBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
let coinCount = 16;
let turnCount = 1;
let score = 0;
let demolishMode = false;
let selectedBuilding = null;

const buildings = ["Residential", "Industry", "Commercial", "Park", "Road"];
const buildingImages = {};

function loadImages() {
     buildings.forEach(name => {
          const img = new Image();
          img.src = `../assets/${name.toLowerCase()}.png`;
          buildingImages[name] = img;
     });
}

function startNewGame() {
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
const buildingDescriptions = {
     Residential: "Residential:.",
     Industry: "Industry:.",
     Commercial: "Commercial:.",
     Park: "Park:.dawda",
     Road: "Road:."
};

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

function generateBuildingChoices() {
     const choiceContainer = document.getElementById("buildingChoices");
     choiceContainer.innerHTML = "";
     const choices = [];
     while (choices.length < 2) {
          const b = buildings[Math.floor(Math.random() * buildings.length)];
          choices.push(b);
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

function drawBoard() {
     ctx.clearRect(0, 0, canvasSize, canvasSize);
     
     const existingOverlays = document.querySelectorAll('.building-stat-overlay');
     existingOverlays.forEach(overlay => overlay.remove());
     
     for (let y = 0; y < gridSize; y++) {
          for (let x = 0; x < gridSize; x++) {
               ctx.strokeStyle = "#ccc";
               ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
               const cell = gameBoard[y][x];
               if (cell) {
                    const buildingType = typeof cell === 'string' ? cell : cell.type;
                    ctx.drawImage(buildingImages[buildingType], x * tileSize, y * tileSize, tileSize, tileSize);

                    // Only create overlay if cell is an object with stats
                    if (typeof cell === 'object' && cell.buildingStats) {
                         createBuildingStatsOverlay(x, y, cell);
                    }
               }
          }
     }
}

function createBuildingStatsOverlay(x, y, building) {
     const canvasRect = canvas.getBoundingClientRect();
     
     const overlay = document.createElement("div");
     overlay.classList.add("building-stat-overlay", "tooltip-container");
     overlay.style.position = "absolute";
     overlay.style.left = (canvasRect.left + window.scrollX + x * tileSize) + "px";
     overlay.style.top = (canvasRect.top + window.scrollY + y * tileSize) + "px";
     overlay.style.width = tileSize + "px";
     overlay.style.height = tileSize + "px";
     overlay.style.pointerEvents = "none";
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

canvas.addEventListener("click", e => {
     const rect = canvas.getBoundingClientRect();
     const x = Math.floor((e.clientX - rect.left) / tileSize);
     const y = Math.floor((e.clientY - rect.top) / tileSize);

     if (demolishMode) {
          if (gameBoard[y][x] && coinCount > 0) {
               gameBoard[y][x] = null;
               coinCount--;
               document.getElementById("coinCount").textContent = coinCount;
               drawBoard();
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

function placeBuilding(x, y, building) {
     if (coinCount <= 0) return;
     
     const buildingObj = {
          type: building,
          buildingStats: { i_score: 0, i_coin: 0 } //indiv stats
     };
     gameBoard[y][x] = buildingObj;

     console.log(`Placing ${building} at (${x}, ${y})`);

     coinCount--;
     turnCount++;
     
     const result = calculateScore(gameBoard, score, coinCount, x, y, building, buildingObj.buildingStats);
     score = result.score;
     coinCount = result.coinCount;
     
     console.log(`Score after placing ${building} at (${x}, ${y}): ${score}`);

     selectedBuilding = null;
     document.querySelectorAll(".choices img").forEach(el => el.classList.remove("selected"));
     document.getElementById("coinCount").textContent = coinCount;
     document.getElementById("turnCount").textContent = turnCount;
     document.getElementById("scoreDisplay").textContent = score;
     generateBuildingChoices();
     drawBoard();
}

document.getElementById("saveGameBtn").addEventListener("click", () => {
     localStorage.setItem("ngeeAnnGameState", JSON.stringify({ gameBoard, coinCount, turnCount, score }));
});

document.getElementById("demolishBtn").addEventListener("click", () => {
     demolishMode = !demolishMode;
     const btn = document.getElementById("demolishBtn");
     btn.classList.toggle("active", demolishMode);
     btn.textContent = `Demolish Mode: ${demolishMode ? "ON" : "OFF"}`;

     if (demolishMode) {
          document.getElementById("demolishModal").style.display = "flex";
     }
});


document.getElementById("closeDemolishModal").addEventListener("click", () => {
     document.getElementById("demolishModal").style.display = "none";
});

loadImages();
startNewGame();


// Exit to Main Menu Modal
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

