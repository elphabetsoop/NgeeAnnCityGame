const slides = [
  {
    title: "Welcome to Arcade Mode",
    content: "You start with 16 coins. Each turn, build one of two randomly selected buildings."
  },
  {
    title: "Building Placement Rules",
    content: "First building can be placed anywhere. After that, buildings must connect to existing ones. Unchosen buildings are discarded."
  },
  {
    title: "Building Types and Scoring",
    content: "There are 5 building types:\n" +
             "• Residential (R): Scores 1 point if next to Industry (I). Otherwise, scores 1 point per adjacent Residential (R) or Commercial (C), and 2 points per adjacent Park (O).\n" +
             "• Industry (I): Scores 1 point per Industry in city and generates 1 coin per adjacent Residential.\n" +
             "• Commercial (C): Scores 1 point per adjacent Commercial and generates 1 coin per adjacent Residential.\n" +
             "• Park (O): Scores 1 point per adjacent Park.\n" +
             "• Road (*): Scores 1 point per connected Road (*) in the same row."
  },
  {
    title: "Objective",
    content: "Build a city that scores as many points as possible before your coins run out."
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

// Bind buttons after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tutorialBtn').addEventListener('click', showTutorial);
  document.getElementById('tutorialNextBtn').addEventListener('click', nextSlide);
  document.getElementById('tutorialBackBtn').addEventListener('click', prevSlide);
});
