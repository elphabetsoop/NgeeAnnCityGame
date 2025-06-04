// Adjust canvas and tile size for better visibility
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;

const TILE_SIZE = 48;
const GRID_SIZE = 20;
canvas.width = TILE_SIZE * GRID_SIZE;
canvas.height = TILE_SIZE * GRID_SIZE;

let turn = 1;
let score = 0;

let isDemolishMode = false;

let coins = 16;
const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

const images = {};
const buildings = ['R', 'I', 'C', 'O', '*'];
let selectedBuildings = getRandomBuildings();
let selectedChoice = selectedBuildings[0];


//// Create and style the Exit button
const exitBtn = document.createElement('button');
exitBtn.textContent = 'Exit to Main Menu';
exitBtn.className = 'exit-button';
exitBtn.onclick = () => window.location.href = 'index.html';
document.body.appendChild(exitBtn);



// Load images
const imagePaths = {
     'R': 'assets/residential.png',
     'I': 'assets/industry.png',
     'C': 'assets/commercial.png',
     'O': 'assets/park.png',
     '*': 'assets/road.png'
};



let imagesLoaded = 0;
const totalImages = Object.keys(imagePaths).length;

for (let key in imagePaths) {
     const img = new Image();
     img.src = imagePaths[key];
     img.onload = () => {
          imagesLoaded++;
          if (imagesLoaded === totalImages) {
               drawGrid();
               displayChoices();
          }
     };
     images[key] = img;
}

function getRandomBuildings() {
     const shuffled = [...buildings].sort(() => 0.5 - Math.random());
     return shuffled.slice(0, 2);
}

function drawGrid() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
               ctx.strokeStyle = '#999'; // Darker grid lines for visibility
               ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
               const cell = grid[y][x];
               if (cell && images[cell]) {
                    ctx.drawImage(images[cell], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
               }
          }
     }
}

function allowDrop(ev) {
     ev.preventDefault();
}

function drag(ev) {
     ev.dataTransfer.setData("type", ev.target.dataset.type);
}

canvas.addEventListener('dragover', allowDrop);
canvas.addEventListener('drop', function (e) {
     e.preventDefault();
     if (coins <= 0) return;

     const rect = canvas.getBoundingClientRect();
     const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
     const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

     if (!grid[y][x]) {
          const isFirstBuilding = grid.flat().every(cell => cell === null);
          if (isFirstBuilding || isConnected(x, y)) {
               const toBuild = e.dataTransfer.getData("type");
               grid[y][x] = toBuild;
               coins--;
               turn++;
               score = calculateScore(true); // Pass true to suppress alert
               updateGameStats();
               selectedBuildings = getRandomBuildings();
               selectedChoice = selectedBuildings[0];
               drawGrid();
               displayChoices();
          }
     }
});

function displayChoices() {
     const container = document.getElementById('buildingChoices');
     container.innerHTML = '';

     selectedBuildings.forEach((type) => {
          const img = document.createElement('img');
          img.src = imagePaths[type];
          img.dataset.type = type;
          img.draggable = true;
          img.ondragstart = drag;

          if (type === selectedChoice) {
               img.classList.add('selected');
          }

          img.addEventListener('click', () => {
               selectedChoice = type;
               displayChoices();
          });

          container.appendChild(img);
     });
}

function isConnected(x, y) {
     const directions = [
          [0, -1], [0, 1], [-1, 0], [1, 0]
     ];
     return directions.some(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          return nx >= 0 && nx < GRID_SIZE && ny >= 0 && ny < GRID_SIZE && grid[ny][nx] !== null;
     });
}

function getAdjacentTypes(x, y) {
     const types = [];
     const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];

     directions.forEach(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          if (nx >= 0 && ny >= 0 && nx < GRID_SIZE && ny < GRID_SIZE) {
               if (grid[ny][nx]) types.push(grid[ny][nx]);
          }
     });

     return types;
}

function getConnectedRoadLength(x, y) {
     if (grid[y][x] !== '*') return 0;

     let length = 1;
     for (let i = x - 1; i >= 0 && grid[y][i] === '*'; i--) length++;
     for (let i = x + 1; i < GRID_SIZE && grid[y][i] === '*'; i++) length++;

     return length;
}

function calculateScore(silent = false) {
     let total = 0;

     for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
               const type = grid[y][x];
               if (!type) continue;

               const neighbors = getAdjacentTypes(x, y);

               switch (type) {
                    case 'R':
                         if (neighbors.includes('I')) {
                              total += 1;
                         } else {
                              total += neighbors.filter(n => n === 'R' || n === 'C').length;
                              total += 2 * neighbors.filter(n => n === 'O').length;
                         }
                         break;
                    case 'I':
                         total += 1;
                         break;
                    case 'C':
                         total += neighbors.filter(n => n === 'C').length;
                         break;
                    case 'O':
                         total += neighbors.filter(n => n === 'O').length;
                         break;
                    case '*':
                         total += getConnectedRoadLength(x, y);
                         break;
               }
          }
     }

     if (!silent) alert("Your final score: " + total);
     return total;
}

function updateGameStats() {
     document.getElementById('coinCount').innerText = coins;
     document.getElementById('turnCount').innerText = turn;
     document.getElementById('scoreDisplay').innerText = score;
}

document.getElementById('saveGameBtn').addEventListener('click', () => {
     const gameState = {
          coins,
          turn,
          score,
          grid,
     };

     localStorage.setItem('ngeeAnnCitySave', JSON.stringify(gameState));
     alert('Game saved!');
});

const demolishBtn = document.getElementById('demolishBtn');
demolishBtn.addEventListener('click', () => {
     isDemolishMode = !isDemolishMode;
     demolishBtn.classList.toggle('active', isDemolishMode);
     demolishBtn.textContent = `Demolish Mode: ${isDemolishMode ? 'ON' : 'OFF'}`;
});

canvas.addEventListener('click', function (e) {
     if (!isDemolishMode) return;

     const rect = canvas.getBoundingClientRect();
     const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
     const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

     if (grid[y][x]) {
          grid[y][x] = null;
          coins--;
          turn++;
          score = calculateScore(true);
          updateGameStats();
          drawGrid();
     }
});







