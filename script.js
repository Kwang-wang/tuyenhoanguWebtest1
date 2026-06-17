const backToTop = document.querySelector(".back-to-top");
const track = document.querySelector(".slider-track");
const dots = [...document.querySelectorAll("[data-slide-dot]")];
const prevButton = document.querySelector("[data-slider-prev]");
const nextButton = document.querySelector("[data-slider-next]");
const slides = [...document.querySelectorAll(".course-slide")];
let activeSlide = 1;
let autoTimer;
let autoResumeTimer;

function setSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${activeSlide * 100}%)`;
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
    dot.setAttribute("aria-selected", String(dotIndex === activeSlide));
  });
}

function startAutoSlide() {
  window.clearInterval(autoTimer);
  autoTimer = window.setInterval(() => setSlide(activeSlide + 1), 6500);
}

function restartAutoSlide() {
  window.clearInterval(autoTimer);
  window.clearTimeout(autoResumeTimer);
  autoResumeTimer = window.setTimeout(startAutoSlide, 1200);
}

dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    setSlide(Number(dot.dataset.slideDot));
    restartAutoSlide();
  });
});

prevButton.addEventListener("click", () => {
  setSlide(activeSlide - 1);
  restartAutoSlide();
});

nextButton.addEventListener("click", () => {
  setSlide(activeSlide + 1);
  restartAutoSlide();
});

document.querySelector(".course-slider").addEventListener("mouseenter", () => window.clearInterval(autoTimer));
document.querySelector(".course-slider").addEventListener("mouseleave", startAutoSlide);

document.querySelectorAll(".magnetic").forEach((element) => {
  element.addEventListener("pointermove", (event) => {
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    element.style.setProperty("--x", `${x}%`);
    element.style.setProperty("--y", `${y}%`);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("is-visible", window.scrollY > 640);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

setSlide(activeSlide);
startAutoSlide();
