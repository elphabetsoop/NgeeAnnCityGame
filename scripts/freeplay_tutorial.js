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
    content: "Once you build on the border, the city expands:\n• First time: 15x15\n• Second time: 25x25"
  },
  {
    title: "Adjacency",
    content: "Buildings are considered adjacent only if connected by roads."
  },
  {
    title: "Scoring",
    content: "Scoring is the same as Arcade Mode. Use roads, parks, and clusters wisely!"
  },
  {
    title: "Profit & Upkeep",
    content:
      "• Residential (R): +1 coin/turn; clusters cost -1 coin/turn\n" +
      "• Industry (I): +2 coins/turn, -1 upkeep\n" +
      "• Commercial (C): +3 coins/turn, -2 upkeep\n" +
      "• Park (O): -1 upkeep\n" +
      "• Road (*): -1 upkeep if unconnected"
  },
  {
    title: "Objective",
    content: "Design and grow your city while maintaining a positive coin flow!"
  }
];

let currentSlide = 0;

function renderSlide() {
  document.getElementById('tutorialTitle').textContent = slides[currentSlide].title;
  document.getElementById('tutorialText').textContent = slides[currentSlide].content;

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
});
