"use strict";

const assetPath = "./assets/";

const metrics = [
  { value: "01", label: "flagship OS line anchored by Mubuntu" },
  { value: "03", label: "product surfaces sharing one interface language" },
  { value: "24/7", label: "secure update posture for active workstations" },
  { value: "0ms", label: "interface lag tolerance in critical flows" }
];

const products = [
  {
    name: "Mubuntu OS",
    icon: "monitor",
    accent: "#ff313d",
    accentSoft: "rgba(255, 49, 61, 0.24)",
    description:
      "A flagship operating system tuned for disciplined productivity, fast task switching, and rich system control.",
    features: ["Command-first launcher", "Protected workspaces", "Live system telemetry"]
  },
  {
    name: "Desktop Software",
    icon: "grid",
    accent: "#ffc947",
    accentSoft: "rgba(255, 201, 71, 0.2)",
    description:
      "Native applications for documents, project rooms, dashboards, and technical operations.",
    features: ["Studio-grade office tools", "Integrated project views", "Local-first workflows"]
  },
  {
    name: "Mobile Apps",
    icon: "phone",
    accent: "#9b5cff",
    accentSoft: "rgba(155, 92, 255, 0.24)",
    description:
      "Companion apps that carry secure communication, task command, and device control into the field.",
    features: ["Secure mail", "Mubuntu companion", "Cross-device task control"]
  }
];

const showcases = [
  {
    id: "mubuntu",
    category: "OS",
    title: "Mubuntu Control Center",
    image: "mubuntu-control-center.png",
    alt: "Mubuntu operating system desktop with system monitor, terminal, files, calendar, and secure update panels",
    description:
      "A dense desktop cockpit for system health, workspace movement, files, and team operations.",
    wide: true
  },
  {
    id: "studio",
    category: "Desktop",
    title: "Mouradsoft Studio",
    image: "mouradsoft-studio.png",
    alt: "Mouradsoft Studio desktop productivity suite with documents, spreadsheet, presentation, timeline, and team activity",
    description:
      "A professional suite surface for documents, sheets, presentations, timelines, and AI search.",
    wide: false
  },
  {
    id: "mobile",
    category: "Mobile",
    title: "Mouradsoft Mobile",
    image: "mouradsoft-mobile-fixed.png",
    alt: "Three Mouradsoft mobile app screens showing secure mail, task command, and Mubuntu companion",
    description:
      "Secure phone workflows connected to the same visual system as the workstation platform.",
    wide: false
  }
];

const capabilities = [
  {
    title: "Interface velocity",
    body: "Short routes, visible states, and command surfaces designed for repeated action.",
    status: "ACTIVE",
    accent: "#ff313d"
  },
  {
    title: "Productivity-grade structure",
    body: "Files, tasks, schedules, docs, and system panels stay readable without losing density.",
    status: "READY",
    accent: "#ff7a1a"
  },
  {
    title: "Secure continuity",
    body: "Desktop and mobile experiences keep identity, updates, and device posture close to work.",
    status: "LOCKED",
    accent: "#ffc947"
  },
  {
    title: "Visual depth",
    body: "Purple edge lighting, warm signal colors, and restrained surfaces separate priority from noise.",
    status: "TUNED",
    accent: "#9b5cff"
  }
];

const icons = {
  monitor:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H4z"></path><path d="M9 21h6"></path><path d="M12 16v5"></path></svg>',
  grid:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h7v7H4z"></path><path d="M13 4h7v7h-7z"></path><path d="M4 13h7v7H4z"></path><path d="M13 13h7v7h-7z"></path></svg>',
  phone:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path><path d="M11 18h2"></path></svg>'
};

const state = {
  activeCategory: "All",
  modalIndex: 0
};

const select = (selector, scope = document) => scope.querySelector(selector);
const selectAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function renderMetrics() {
  const host = select("#metrics");
  host.innerHTML = metrics
    .map(
      (item) => `
        <div class="metric">
          <span class="metric-value gradient-text">${item.value}</span>
          <span class="metric-label">${item.label}</span>
        </div>
      `
    )
    .join("");
}

function renderProducts() {
  const host = select("#product-grid");
  host.innerHTML = products
    .map(
      (item) => `
        <article class="product-card" style="--accent:${item.accent};--accent-soft:${item.accentSoft}" tabindex="0">
          <span class="product-icon">${icons[item.icon]}</span>
          <div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
          </div>
          <ul class="feature-list">
            ${item.features.map((feature) => `<li>${feature}</li>`).join("")}
          </ul>
        </article>
      `
    )
    .join("");
}

function renderTabs() {
  const categories = ["All", ...new Set(showcases.map((item) => item.category))];
  const host = select("#showcase-tabs");
  host.innerHTML = categories
    .map(
      (category) => `
        <button class="tab-button ${category === state.activeCategory ? "is-active" : ""}" type="button" data-category="${category}">
          ${category}
        </button>
      `
    )
    .join("");
}

function getVisibleShowcases() {
  if (state.activeCategory === "All") {
    return showcases;
  }

  return showcases.filter((item) => item.category === state.activeCategory);
}

function renderShowcases() {
  const host = select("#showcase-grid");
  const visibleItems = getVisibleShowcases();

  host.innerHTML = visibleItems
    .map((item) => {
      const originalIndex = showcases.findIndex((showcase) => showcase.id === item.id);
      return `
        <article class="showcase-card ${item.wide ? "is-wide" : ""}" tabindex="0" data-index="${originalIndex}" aria-label="Open ${item.title} image">
          <img src="${assetPath}${item.image}" alt="${item.alt}" loading="lazy" />
          <div class="showcase-reveal">
            <span class="showcase-tag">${item.category}</span>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          </div>
        </article>
      `;
    })
    .join("");

  bindTilt(selectAll(".showcase-card"));
}

function renderCapabilities() {
  const host = select("#edge-stack");
  host.innerHTML = capabilities
    .map(
      (item, index) => `
        <article class="edge-item" style="--accent:${item.accent}">
          <span class="edge-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h3>${item.title}</h3>
            <p>${item.body}</p>
          </div>
          <span class="edge-status">${item.status}</span>
        </article>
      `
    )
    .join("");
}

function bindTilt(elements) {
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!canHover) {
    return;
  }

  elements.forEach((element) => {
    element.addEventListener("mousemove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateY = ((x / rect.width) - 0.5) * 10;
      const rotateX = ((y / rect.height) - 0.5) * -10;
      element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "";
    });
  });
}

function bindProductSpotlight() {
  selectAll(".product-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });
}

function bindTabs() {
  select("#showcase-tabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) {
      return;
    }

    state.activeCategory = button.dataset.category;
    renderTabs();
    renderShowcases();
  });
}

function openModal(index) {
  const item = showcases[index];
  const modal = select("#image-modal");
  state.modalIndex = index;

  select("#modal-image").src = `${assetPath}${item.image}`;
  select("#modal-image").alt = item.alt;
  select("#modal-kicker").textContent = item.category;
  select("#modal-title").textContent = item.title;
  select("#modal-description").textContent = item.description;

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  select(".modal-close").focus();
}

function closeModal() {
  const modal = select("#image-modal");
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function shiftModal(direction) {
  const nextIndex = (state.modalIndex + direction + showcases.length) % showcases.length;
  openModal(nextIndex);
}

function bindModal() {
  select("#showcase-grid").addEventListener("click", (event) => {
    const card = event.target.closest(".showcase-card");
    if (!card) {
      return;
    }

    openModal(Number(card.dataset.index));
  });

  select("#showcase-grid").addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    const card = event.target.closest(".showcase-card");
    if (!card) {
      return;
    }

    event.preventDefault();
    openModal(Number(card.dataset.index));
  });

  selectAll("[data-close-modal]").forEach((element) => element.addEventListener("click", closeModal));
  select("#modal-prev").addEventListener("click", () => shiftModal(-1));
  select("#modal-next").addEventListener("click", () => shiftModal(1));

  document.addEventListener("keydown", (event) => {
    if (!select("#image-modal").classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeModal();
    }

    if (event.key === "ArrowLeft") {
      shiftModal(-1);
    }

    if (event.key === "ArrowRight") {
      shiftModal(1);
    }
  });
}

function bindHeader() {
  const header = select("[data-elevate]");
  const toggle = select(".nav-toggle");

  const updateHeader = () => {
    header.classList.toggle("is-elevated", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  selectAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function bindParallax() {
  const items = selectAll("[data-parallax]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || items.length === 0) {
    return;
  }

  let ticking = false;
  const update = () => {
    items.forEach((item) => {
      const speed = Number(item.dataset.parallax);
      item.style.setProperty("--parallax-y", `${window.scrollY * speed}px`);
    });
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
}

function init() {
  renderMetrics();
  renderProducts();
  renderTabs();
  renderShowcases();
  renderCapabilities();
  bindProductSpotlight();
  bindTabs();
  bindModal();
  bindHeader();
  bindParallax();
}

document.addEventListener("DOMContentLoaded", init);
