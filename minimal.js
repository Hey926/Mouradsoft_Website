"use strict";

(() => {
  const snippets = {
    bash: `#!/usr/bin/env bash
set -euo pipefail

TOKEN="$(cat /etc/mubuntu-minimal/repo.token)"
CHANNEL="stable"

curl -fsS "http://127.0.0.1:8721/minimal/v1/repository?channel=\${CHANNEL}&include_stats=true" \\
  -H "Authorization: Bearer \${TOKEN}" \\
  | jq "."`,
    curl: `curl "http://127.0.0.1:8721/minimal/v1/repository?channel=stable&arch=x86_64&include_stats=true" \\
  -H "Authorization: Bearer mm_local_example" \\
  -H "Accept: application/json"`,
    python: `import requests

response = requests.get(
    "http://127.0.0.1:8721/minimal/v1/repository",
    params={
        "channel": "stable",
        "arch": "x86_64",
        "include_stats": "true",
    },
    headers={"Authorization": "Bearer mm_local_example"},
    timeout=10,
)

metadata = response.json()`
  };

  const responses = {
    packages: `{
  "channel": "stable",
  "arch": "x86_64",
  "packages": [
    {
      "name": "mubuntu-base",
      "version": "1.0 Noble Cat",
      "origin": "minimal-main"
    },
    {
      "name": "container-runtime",
      "version": "26.1.4",
      "origin": "minimal-containers"
    },
    {
      "name": "repo-agent",
      "version": "0.8.2",
      "origin": "minimal-services"
    }
  ]
}`,
    kernel: `{
  "kernel_update": {
    "current": "6.6.18-mubuntu-minimal",
    "available": "6.6.24-mubuntu-minimal",
    "security": true,
    "reboot_required": true
  },
  "status": "update_available"
}`,
    stats: `{
  "system_stats": {
    "hostname": "edge-node-07",
    "uptime_seconds": 482991,
    "cpu_load": [0.18, 0.21, 0.19],
    "memory": {
      "total_mb": 2048,
      "used_mb": 611
    },
    "package_cache_mb": 184
  }
}`
  };

  const state = {
    language: "bash",
    response: "packages"
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function setLanguage(value) {
    state.language = value;
    $$("#minimal-language-tabs [data-language]").forEach((button) => {
      const isActive = button.dataset.language === value;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    renderConsole();
  }

  function renderConsole() {
    $("#minimal-command-code").textContent = snippets[state.language];
    $("#minimal-response-code").textContent = responses[state.response];
    $("#minimal-response-label").textContent = `${$("#minimal-response-select").selectedOptions[0].textContent} response`;
  }

  async function copyText(value, button) {
    try {
      await navigator.clipboard.writeText(value);
      button.classList.add("is-copied");
      window.setTimeout(() => button.classList.remove("is-copied"), 1200);
    } catch {
      window.prompt("Copy this text:", value);
    }
  }

  function bindHeader() {
    const header = $("[data-elevate]");
    const toggle = $(".nav-toggle");

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    $$(".site-nav a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function bindConsole() {
    $("#minimal-language-tabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-language]");
      if (!button) {
        return;
      }

      setLanguage(button.dataset.language);
    });

    $("#minimal-response-select").addEventListener("change", (event) => {
      state.response = event.target.value;
      renderConsole();
    });

    $$(".code-copy").forEach((button) => {
      button.addEventListener("click", () => {
        const target = $(`#${button.dataset.copyTarget}`);
        copyText(target.textContent, button);
      });
    });
  }

  function bindSectionHighlighting() {
    const links = $$("[data-section-link]");
    const sections = $$("[data-doc-section]");

    const activate = (id) => {
      links.forEach((link) => {
        const isActive = link.dataset.sectionLink === id;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    if (!("IntersectionObserver" in window)) {
      activate(sections[0].id);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          activate(visible.target.id);
        }
      },
      {
        rootMargin: "-96px 0px -58% 0px",
        threshold: [0.15, 0.35, 0.6]
      }
    );

    sections.forEach((section) => observer.observe(section));
    activate(sections[0].id);
  }

  function init() {
    renderConsole();
    bindHeader();
    bindConsole();
    bindSectionHighlighting();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
