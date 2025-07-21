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
    title: "Building Types",
    content: "There are 5 building types:<br>" +
             "• Residential (R)<br>" +
             "• Industry (I)<br>" +
             "• Commercial (C)<br>" +
             "• Park (O)<br>" +
             "• Road (*)",
    image: "assets/arcade/arcade_types_of_building.png"
  },
  {
    title: "Residential Scoring",
    content: "For Residential (R) buildings:<br>" +
             "• Scores 1 point if next to Industry (I).<br>" +
             "• Scores 1 point per adjacent Residential (R) or Commercial (C).<br>" +
             "• Scores 2 points per adjacent Park (O).",
    image: "assets/arcade/residential_scoring.png"
  },
  {
    title: "Industry Scoring",
    content: "For Industry (I) buildings:<br>" +
             "• Scores 1 point per Industry in city.<br>" +
             "• Generates 1 coin per adjacent Residential.",
    image: "assets/arcade/industry_scoring.png"
  },
  {
    title: "Commercial Scoring",
    content: "For Commercial (C) buildings:<br>" + 
             "• Scores 1 point per adjacent Commercial" +
             "• Generates 1 coin per adjacent Residential.",
    image: "/assets/arcade/commercial_scoring.png"
  },
  {
    title: "Park Scoring",
    content: "For Park (O) buildings, scores 1 point per adjacent Park.",
    image: "/assets/arcade/park_scoring.png"
  },
  {
    title: "Road Scoring",
    content: "For Road (*) buildings, scores 1 point per connected Road (*) in the same row.",
    image: "/assets/arcade/road_scoring.png"
  },
  {
    title: "Objective",
    content: "Build a city that scores as many points as possible before your coins run out."
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

// Bind buttons after DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('tutorialBtn').addEventListener('click', showTutorial);
  document.getElementById('tutorialNextBtn').addEventListener('click', nextSlide);
  document.getElementById('tutorialBackBtn').addEventListener('click', prevSlide);
  document.getElementById('tutorialCloseBtn').addEventListener('click', hideTutorial);
});
