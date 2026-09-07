"use strict";

const builds = [
  {
    architecture: "x86_64",
    label: "Desktop / Laptop",
    version: "1.0 Noble Cat",
    size: "2.8 GB",
    file: "mubuntu-1.0-noble-cat-x86_64.iso",
    href: "./assets/mubuntu-1.0-noble-cat-x86_64.iso",
    checksum: "7f3b6b6f9cc4a20ac2f4e2ed8c6b1b00d73ab532d4096f6b8cb1c9e802f7c1a4",
    recommended: true
  },
  {
    architecture: "ARM64",
    label: "ARM boards / UEFI devices",
    version: "1.0 Noble Cat",
    size: "2.4 GB",
    file: "mubuntu-1.0-noble-cat-arm64.iso",
    href: "./assets/mubuntu-1.0-noble-cat-arm64.iso",
    checksum: "e62f8d5455e37fd8d0c8794f7561d7b3bd2e5ce9858a90be3f0d3ba38fa42d91",
    recommended: false
  },
  {
    architecture: "x86_64-minimal",
    label: "Minimal image",
    version: "1.0 Noble Cat",
    size: "1.6 GB",
    file: "mubuntu-1.0-noble-cat-x86_64-minimal.iso",
    href: "./assets/mubuntu-1.0-noble-cat-x86_64-minimal.iso",
    checksum: "a41d2ad6d08f6bfb05de521fb7b765f5d377b2ff931f0f3cd4f3a40ec2d61476",
    recommended: false
  }
];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function renderBuildSelect() {
  const select = $("#build-select");
  select.innerHTML = builds
    .map((build) => `<option value="${build.architecture}">${build.architecture} - ${build.label}</option>`)
    .join("");
}

function renderArchitectureCards() {
  const grid = $("#architecture-grid");
  grid.innerHTML = builds
    .map(
      (build) => `
        <article class="architecture-card ${build.recommended ? "is-recommended" : ""}" data-build-card="${build.architecture}">
          <div>
            <span class="showcase-tag">${build.recommended ? "Recommended" : "Build"}</span>
            <h3>${build.architecture}</h3>
            <p>${build.label}</p>
          </div>
          <dl>
            <div><dt>Version</dt><dd>${build.version}</dd></div>
            <div><dt>Size</dt><dd>${build.size}</dd></div>
          </dl>
          <a class="button button-secondary" href="${build.href}" download>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v12" />
              <path d="m7 10 5 5 5-5" />
              <path d="M5 21h14" />
            </svg>
            Download
          </a>
        </article>
      `
    )
    .join("");
}

function renderChecksums() {
  const table = $("#checksum-table");
  table.innerHTML = builds
    .map(
      (build) => `
        <article class="checksum-row">
          <div>
            <strong>${build.file}</strong>
            <code>${build.checksum}</code>
          </div>
          <button class="icon-button checksum-copy" type="button" data-copy="${build.checksum}" aria-label="Copy checksum for ${build.file}">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 8h10v12H8z" />
              <path d="M6 16H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
            </svg>
          </button>
        </article>
      `
    )
    .join("");
}

function setActiveBuild(architecture) {
  const build = builds.find((item) => item.architecture === architecture) || builds[0];
  const link = $("#primary-download-link");

  link.href = build.href;
  link.setAttribute("download", build.file);
  $("#selected-build").innerHTML = `
    <span>${build.architecture}</span>
    <span>${build.file}</span>
    <span>${build.size}</span>
  `;

  $$("[data-build-card]").forEach((card) => {
    card.classList.toggle("is-selected", card.dataset.buildCard === build.architecture);
  });
}

async function copyChecksum(value, button) {
  try {
    await navigator.clipboard.writeText(value);
    button.classList.add("is-copied");
    window.setTimeout(() => button.classList.remove("is-copied"), 1200);
  } catch {
    window.prompt("Copy this SHA256 checksum:", value);
  }
}

function bindHeader() {
  const header = $("[data-elevate]");
  const toggle = $(".nav-toggle");

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function bindDownloads() {
  $("#build-select").addEventListener("change", (event) => {
    setActiveBuild(event.target.value);
  });

  $("#architecture-grid").addEventListener("click", (event) => {
    const card = event.target.closest("[data-build-card]");
    if (!card) {
      return;
    }

    $("#build-select").value = card.dataset.buildCard;
    setActiveBuild(card.dataset.buildCard);
  });

  $("#checksum-table").addEventListener("click", (event) => {
    const button = event.target.closest("[data-copy]");
    if (button) {
      copyChecksum(button.dataset.copy, button);
    }
  });
}

function init() {
  renderBuildSelect();
  renderArchitectureCards();
  renderChecksums();
  setActiveBuild(builds[0].architecture);
  bindHeader();
  bindDownloads();
}

document.addEventListener("DOMContentLoaded", init);
