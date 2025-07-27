const slides = [
  {
    title: "Welcome to Free Play Mode",
    content: "You start with unlimited coins and a 5x5 grid. Build freely!"
  },
  {
    title: "Building Rules",
    content: "Each building costs 1 coin to construct. You can build on any tile."
  },
  {
    title: "City Expansion",
    content: "Once you build on the border, the city expands:<br>• First time: 15x15<br>• Second time: 25x25",
    image: "/assets/freeplay/freeplay_city_expansion.png"
  },
  {
    title: "Adjacency",
    content: "Buildings are considered adjacent if connected by the same roads, or if they are on the top, bottom, left or right of the building.",
    image: "/assets/freeplay/adjacency.png"
  },
  {
    title: "Scoring",
    content: "Scoring is the same as Arcade Mode. The same 5 types of buildings can be constructed. Use roads, parks, and clusters wisely!",
    image: "/assets/freeplay/freeplay_buildings.png"
  },
  {
    title: "Residential Scoring, Profit & Upkeep",
    content: "For Residential (R) buildings:<br>" +
             "• Scores 1 point if next to Industry (I).<br>" +
             "• Scores 1 point per adjacent Residential (R) or Commercial (C).<br>" +
             "• Scores 2 points per adjacent Park (O).<br>" +
             "• Profit & Upkeep: Each residential building generates 1 coin per turn. Each cluster of residential buildings (must be immediately next to each other) requires 1 coin per turn to upkeep.",
    image: "/assets/freeplay/freeplay_residential.png"
  },
  {
    title: "Industrial Scoring, Profit & Upkeep",
    content: "For Industry (I) buildings:<br>" +
             "• Scores 1 point per Industry in city.<br>" +
             "• Generates 1 coin per adjacent Residential.<br>" +
             "• Profit & Upkeep: Each industry generates 2 coins per turn and cost 1 coin per turn to upkeep.",
    image: "/assets/freeplay/freeplay_industrial.png"
  },
  {
    title: "Commercial Scoring, Profit & Upkeep",
    content: "For Commercial (C) buildings:<br>" + 
             "• Scores 1 point per adjacent Commercial<br>" +
             "• Generates 1 coin per adjacent Residential.<br>" +
             "• Profit & Upkeep: Each commercial generates 3 coins per turn and cost 2 coins per turn to upkeep.",
    image: "/assets/freeplay/freeplay_commercial.png"
  },
  {
    title: "Park Scoring, Profit & Upkeep",
    content: "For Park (O) buildings, scores 1 point per adjacent Park.<br>" +
             "Profit & Upkeep: Each park costs 1 coin to upkeep.",
    image: "/assets/freeplay/freeplay_park.png"
  },
  {
    title: "Road Scoring, Profit & Upkeep",
    content: "For Road (*) buildings, scores 1 point per connected Road (*) in the same row.<br>" +
             "Profit & Upkeep: Each unconnected road segment costs 1 coin to upkeep.",
    image: "/assets/freeplay/freeplay_road.png"
  },
  {
    title: "Objective",
    content: "Design and grow your city while maintaining a positive coin flow!"
  }
];

let currentSlide = 0;

function renderSlide() {
  const slide = slides[currentSlide];

  document.getElementById('tutorialTitle').textContent = slide.title;
  document.getElementById('tutorialText').innerHTML = slide.content;

  const imageEl = document.getElementById('tutorialImage');
  if (slide.image) {
    imageEl.src = slide.image;
    imageEl.style.display = 'block';
  } else {
    imageEl.style.display = 'none';
  }

  document.getElementById('tutorialBackBtn').style.display = currentSlide === 0 ? 'none' : 'inline-block';

  const nextBtn = document.getElementById('tutorialNextBtn');
  nextBtn.textContent = currentSlide === slides.length - 1 ? 'Got it!' : 'Next ➡';
}

function nextSlide() {
  if (currentSlide < slides.length - 1) {
    currentSlide++;
    renderSlide();
  } else {
    hideTutorial();
  }
}

function prevSlide() {
  if (currentSlide > 0) {
    currentSlide--;
    renderSlide();
  }
}

function showTutorial() {
  const modal = document.getElementById('tutorialModal');
  if (modal) {
    modal.style.display = 'flex';
    currentSlide = 0;
    renderSlide();
  }
}

function hideTutorial() {
  const modal = document.getElementById('tutorialModal');
  if (modal) {
    modal.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tutorialBtn').addEventListener('click', showTutorial);
  document.getElementById('tutorialNextBtn').addEventListener('click', nextSlide);
  document.getElementById('tutorialBackBtn').addEventListener('click', prevSlide);
  document.getElementById('tutorialCloseBtn').addEventListener('click', hideTutorial);
});
