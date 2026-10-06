"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("[data-elevate]");
  const toggle = document.querySelector(".nav-toggle");

  if (!header || !toggle) {
    return;
  }

  const updateHeader = () => {
    header.classList.toggle("is-elevated", window.scrollY > 24);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.querySelectorAll(".site-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
