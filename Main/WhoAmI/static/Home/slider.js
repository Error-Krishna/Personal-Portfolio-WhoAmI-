// slider for skill carousel in home page
// Select all cards and Explore buttons
document.addEventListener("DOMContentLoaded", () => {
  const carouselContainer = document.querySelector(".skill-section");
  const cards = document.querySelectorAll(".skill-frame01");

  let currentIndex = 0;
  let interval;

  function scrollToCard(index) {
    const card = cards[index];
    const offsetLeft = card.offsetLeft;
    const containerWidth = carouselContainer.clientWidth;
    const cardWidth = card.offsetWidth;

    const scrollPosition = offsetLeft - (containerWidth / 2) + (cardWidth / 2);

    carouselContainer.scrollTo({
      left: scrollPosition,
      behavior: "smooth"
    });
  }

  function startAutoSlide() {
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % cards.length;
      scrollToCard(currentIndex);
    }, 2000); // Change card every 3 seconds
  }

  function stopAutoSlideAndSnap() {
    clearInterval(interval);
    snapToNearestCard();
  }

  function snapToNearestCard() {
    const containerScrollLeft = carouselContainer.scrollLeft;
    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const containerCenter = containerScrollLeft + carouselContainer.offsetWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    currentIndex = closestIndex;
    scrollToCard(currentIndex);
  }

  // Hover handlers for skill cards
  cards.forEach((card) => {
    card.addEventListener("mouseenter", stopAutoSlideAndSnap);
    card.addEventListener("mouseleave", startAutoSlide);
  });

  // Also pause on Explore button hover
  const exploreButtons = document.querySelectorAll(".projects-building-blocks-segmentedbutton-buttonsegmentmiddle");
  exploreButtons.forEach((btn) => {
    btn.addEventListener("mouseenter", stopAutoSlideAndSnap);
    btn.addEventListener("mouseleave", startAutoSlide);

    btn.addEventListener("click", () => {
    const url = btn.getAttribute('data-url');
    if (url) {
      window.location.href = url;
    }
    });
  });

  // Start the auto-slide initially
  startAutoSlide();
});





// 👉 Clickable project cards - open in new tab
const projectCards = document.querySelectorAll(".projects-component");
projectCards.forEach((card) => {
  card.addEventListener("click", () => {
    const url = card.getAttribute("data-url");
    if (url) {
      window.open(url, "_blank");
    }
  });
});