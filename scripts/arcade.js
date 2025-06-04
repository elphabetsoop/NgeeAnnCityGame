const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILE_SIZE = 32;
const GRID_SIZE = 20;
let coins = 16;

const grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));

const buildings = ['R', 'I', 'C', 'O', '*']; // Residential, Industry, etc.
let selectedBuildings = getRandomBuildings();
let selectedChoice = selectedBuildings[0];

const images = {};

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

// Utility
function getRandomBuildings() {
     const shuffled = buildings.sort(() => 0.5 - Math.random());
     return shuffled.slice(0, 2);
}

// Drawing function
function drawGrid() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     for (let y = 0; y < GRID_SIZE; y++) {
          for (let x = 0; x < GRID_SIZE; x++) {
               ctx.strokeStyle = '#ccc';
               ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
               const cell = grid[y][x];
               if (cell && images[cell]) {
                    ctx.drawImage(images[cell], x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
               }
          }
     }
}

// Handle placing
canvas.addEventListener('click', (e) => {
     if (coins <= 0) return;

     const rect = canvas.getBoundingClientRect();
     const x = Math.floor((e.clientX - rect.left) / TILE_SIZE);
     const y = Math.floor((e.clientY - rect.top) / TILE_SIZE);

     if (!grid[y][x]) {
          const toBuild = selectedChoice; // ✅
          grid[y][x] = toBuild;
          coins--;
          document.getElementById('coinCount').innerText = coins;
          selectedBuildings = getRandomBuildings();
          drawGrid();
          displayChoices();
     }
});

function displayChoices() {
     const container = document.getElementById('buildingChoices');
     container.innerHTML = ''; // Clear old options

     selectedBuildings.forEach((type) => {
          const img = document.createElement('img');
          img.src = imagePaths[type];
          img.dataset.type = type;

          if (type === selectedChoice) {
               img.classList.add('selected');
          }

          img.addEventListener('click', () => {
               selectedChoice = type;
               displayChoices(); // Refresh selection UI
          });

          container.appendChild(img);
     });
}

