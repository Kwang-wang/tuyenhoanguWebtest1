const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const mobileMenu = document.querySelector(".mobile-menu");
const contactToggle = document.querySelector(".contact-dock__toggle");
const contactPanel = document.querySelector(".contact-dock__panel");
const contactLinks = {
  phone: { href: "tel:+84906254982" },
  zalo: { href: "https://zalo.me/0906254982", external: true },
  tiktok: { href: "https://www.tiktok.com/@tuyenhoangu", external: true },
};

function setMenu(open) {
  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}

menuToggle.addEventListener("click", () => setMenu(true));
menuClose.addEventListener("click", () => setMenu(false));
mobileMenu.addEventListener("click", (event) => {
  if (event.target === mobileMenu || event.target.closest("a")) {
    setMenu(false);
  }
});

function setContactPanel(open) {
  contactToggle.setAttribute("aria-expanded", String(open));
  contactPanel.hidden = !open;
}

contactToggle.addEventListener("click", () => {
  setContactPanel(contactPanel.hidden);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setMenu(false);
    setContactPanel(false);
  }
});

document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;
    const isOpen = button.getAttribute("aria-expanded") === "true";

    document.querySelectorAll(".faq-question").forEach((item) => {
      item.setAttribute("aria-expanded", "false");
      item.nextElementSibling.hidden = true;
    });

    button.setAttribute("aria-expanded", String(!isOpen));
    answer.hidden = isOpen;
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
  { threshold: 0.16 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

document.querySelectorAll("[data-contact]").forEach((link) => {
  const config = contactLinks[link.dataset.contact];
  if (config) {
    link.href = config.href;
    if (config.external) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  }

  link.addEventListener("click", () => {
    const detail = {
      channel: link.dataset.contact,
      location: link.dataset.location || "unknown",
    };
    window.dispatchEvent(new CustomEvent("contact_click", { detail }));
  });
});
