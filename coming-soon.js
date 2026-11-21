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

// The owner's computer serves this endpoint only while the request server is running.
document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector("#pre-register-button");
  const status = document.querySelector("#pre-register-status");
  if (!button || !status) return;

  const recipient = "mouradcrosoft@outlook.com";
  const subject = "Free Mubuntu pre-registration and launch access request";
  const body = "Hello Mouradsoft,\r\n\r\nI'd like to pre-register for Mubuntu for free. Please send my launch access file to this email address when Mubuntu launches.\r\n\r\nThank you!";
  const emailUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  let checking = false;

  async function checkAvailability() {
    try {
      const endpoint = new URL(button.dataset.presenceUrl, window.location.href);
      endpoint.searchParams.set("t", String(Date.now()));
      const response = await fetch(endpoint, {
        cache: "no-store",
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) return false;
      const presence = await response.json();
      return presence.online === true;
    } catch {
      return false;
    }
  }

  function showAvailability(online) {
    button.disabled = !online;
    button.textContent = online ? "Pre-register for free" : "Offline — requests closed";
    status.textContent = online
      ? "Mouradsoft is online. Opens your email app to request launch access for free."
      : "Mouradsoft is offline. Come back when requests reopen.";
  }

  async function refreshAvailability() {
    if (checking) return;
    checking = true;
    try {
      showAvailability(await checkAvailability());
    } finally {
      checking = false;
    }
  }

  button.addEventListener("click", async () => {
    if (checking || button.disabled) return;
    checking = true;
    button.disabled = true;
    button.textContent = "Checking availability…";
    try {
      const online = await checkAvailability();
      showAvailability(online);
      if (online) {
        window.location.href = emailUrl;
        status.textContent = "Send the message in your email app to request free launch access.";
      }
    } finally {
      checking = false;
    }
  });

  refreshAvailability();
  window.setInterval(() => {
    if (!document.hidden) refreshAvailability();
  }, 15000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshAvailability();
  });
});
