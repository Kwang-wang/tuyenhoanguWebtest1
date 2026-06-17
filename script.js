const menuToggle = document.querySelector(".menu-toggle");
const menuClose = document.querySelector(".menu-close");
const mobileMenu = document.querySelector(".mobile-menu");
const contactToggle = document.querySelector(".contact-dock__toggle");
const contactPanel = document.querySelector(".contact-dock__panel");
const contactOptions = document.querySelector("#contact-options");
const interestNote = document.querySelector("[data-interest-note]");

const contactLinks = {
  phone: {
    href: "tel:+84906254982",
    enabled: true,
  },
  zalo: {
    href: "https://zalo.me/0906254982",
    external: true,
    enabled: true,
  },
  messenger: {
    href: "",
    external: true,
    enabled: false,
  },
  facebook: {
    href: "",
    external: true,
    enabled: false,
  },
  tiktok: {
    href: "https://www.tiktok.com/@tuyenhoangu",
    external: true,
    enabled: true,
  },
};

const interestLabels = {
  general: "",
  communication: "Tiếng Trung giao tiếp không căng não",
  work: "Tiếng Trung công việc thực chiến",
};

let currentInterest = "general";
let highlightTimer;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setMenu(open) {
  if (!mobileMenu || !menuToggle) return;
  mobileMenu.classList.toggle("is-open", open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("menu-open", open);
}

menuToggle?.addEventListener("click", () => setMenu(true));
menuClose?.addEventListener("click", () => setMenu(false));
mobileMenu?.addEventListener("click", (event) => {
  if (event.target === mobileMenu || event.target.closest("a")) {
    setMenu(false);
  }
});

function setContactPanel(open) {
  if (!contactToggle || !contactPanel) return;
  contactToggle.setAttribute("aria-expanded", String(open));
  contactPanel.hidden = !open;
}

contactToggle?.addEventListener("click", () => {
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

function updateInterestNote(interest) {
  const label = interestLabels[interest] || "";
  if (!interestNote) return;

  if (!label) {
    interestNote.textContent = "";
    interestNote.classList.remove("is-visible");
    return;
  }

  interestNote.textContent = `Bạn đang quan tâm: ${label}`;
  interestNote.classList.add("is-visible");
}

function highlightContactOptions() {
  if (!contactOptions) return;

  contactOptions.classList.add("is-highlighted");
  window.clearTimeout(highlightTimer);
  highlightTimer = window.setTimeout(() => {
    contactOptions.classList.remove("is-highlighted");
  }, 700);
}

function scrollToContactOptions() {
  if (!contactOptions) return;

  contactOptions.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
  highlightContactOptions();
}

document.querySelectorAll("[data-consultation-cta]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    currentInterest = link.dataset.interest || "general";
    updateInterestNote(currentInterest);
    scrollToContactOptions();
  });
});

document.querySelectorAll("[data-contact]").forEach((link) => {
  const channel = link.dataset.contact;
  const config = contactLinks[channel];

  if (!config?.enabled || !config.href) {
    link.setAttribute("aria-disabled", "true");
    link.removeAttribute("target");
    link.removeAttribute("rel");
    link.addEventListener("click", (event) => event.preventDefault());
    return;
  }

  link.href = config.href;
  if (config.external) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  } else {
    link.removeAttribute("target");
    link.removeAttribute("rel");
  }

  link.addEventListener("click", () => {
    const detail = {
      channel,
      location: link.dataset.location || "unknown",
      interest: currentInterest || "general",
    };
    window.dispatchEvent(new CustomEvent("contact_click", { detail }));
  });
});

document.querySelectorAll("[data-social]").forEach((link) => {
  const config = contactLinks[link.dataset.social];

  if (!config?.enabled || !config.href) {
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", (event) => event.preventDefault());
    return;
  }

  link.href = config.href;
  if (config.external) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
});
