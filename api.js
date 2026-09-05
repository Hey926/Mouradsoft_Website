"use strict";

(() => {
  const examples = {
    auth: {
      label: "POST /v1/auth",
      snippets: {
        curl: `curl -X POST https://api.mouradsoft.com/v1/auth \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "ms_sk_live_example",
    "workspace_id": "wrk_9x42"
  }'`,
        javascript: `const response = await fetch("https://api.mouradsoft.com/v1/auth", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    api_key: "ms_sk_live_example",
    workspace_id: "wrk_9x42"
  })
});

const token = await response.json();`,
        python: `import requests

response = requests.post(
    "https://api.mouradsoft.com/v1/auth",
    json={
        "api_key": "ms_sk_live_example",
        "workspace_id": "wrk_9x42",
    },
    timeout=20,
)

token = response.json()`
      },
      responses: {
        success: `{
  "access_token": "ms_live_eyJhbGciOiJIUzI1NiIs...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "workspace:read events:write"
}`,
        error: `{
  "error": {
    "code": "invalid_api_key",
    "message": "The supplied API key is missing or invalid.",
    "status": 401
  }
}`
      }
    },
    data: {
      label: "GET /v1/data",
      snippets: {
        curl: `curl "https://api.mouradsoft.com/v1/data?type=device&limit=2" \\
  -H "Authorization: Bearer ms_live_eyJhbGciOi..."`,
        javascript: `const response = await fetch(
  "https://api.mouradsoft.com/v1/data?type=device&limit=2",
  {
    headers: {
      Authorization: "Bearer ms_live_eyJhbGciOi..."
    }
  }
);

const data = await response.json();`,
        python: `import requests

response = requests.get(
    "https://api.mouradsoft.com/v1/data",
    params={"type": "device", "limit": 2},
    headers={"Authorization": "Bearer ms_live_eyJhbGciOi..."},
    timeout=20,
)

data = response.json()`
      },
      responses: {
        success: `{
  "items": [
    {
      "id": "dev_8df3",
      "type": "device",
      "name": "Mubuntu Workstation",
      "status": "online"
    },
    {
      "id": "dev_a712",
      "type": "device",
      "name": "Field Mobile",
      "status": "syncing"
    }
  ],
  "next_cursor": "cur_01HZW7"
}`,
        error: `{
  "error": {
    "code": "rate_limit_exceeded",
    "message": "Too many requests for this workspace.",
    "status": 429,
    "retry_after": 28
  }
}`
      }
    },
    events: {
      label: "POST /v1/events",
      snippets: {
        curl: `curl -X POST https://api.mouradsoft.com/v1/events \\
  -H "Authorization: Bearer ms_live_eyJhbGciOi..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "event_type": "device.booted",
    "source": "mubuntu-agent",
    "payload": {
      "device_id": "dev_8df3",
      "kernel": "6.6.18"
    }
  }'`,
        javascript: `const response = await fetch("https://api.mouradsoft.com/v1/events", {
  method: "POST",
  headers: {
    Authorization: "Bearer ms_live_eyJhbGciOi...",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    event_type: "device.booted",
    source: "mubuntu-agent",
    payload: {
      device_id: "dev_8df3",
      kernel: "6.6.18"
    }
  })
});

const event = await response.json();`,
        python: `import requests

response = requests.post(
    "https://api.mouradsoft.com/v1/events",
    headers={"Authorization": "Bearer ms_live_eyJhbGciOi..."},
    json={
        "event_type": "device.booted",
        "source": "mubuntu-agent",
        "payload": {
            "device_id": "dev_8df3",
            "kernel": "6.6.18",
        },
    },
    timeout=20,
)

event = response.json()`
      },
      responses: {
        success: `{
  "event_id": "evt_42b9c13",
  "received_at": "2026-09-04T18:24:09Z",
  "status": "accepted"
}`,
        error: `{
  "error": {
    "code": "validation_failed",
    "message": "payload.device_id is required.",
    "status": 400
  }
}`
      }
    }
  };

  const state = {
    endpoint: "auth",
    language: "curl",
    response: "success"
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  function setTabState(container, attribute, value) {
    $$(`[data-${attribute}]`, container).forEach((button) => {
      const isActive = button.dataset[attribute] === value;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  }

  function renderConsole() {
    const endpoint = examples[state.endpoint];
    $("#request-label").textContent = `${endpoint.label} request`;
    $("#response-label").textContent = state.response === "success" ? "200 OK response" : "Error response";
    $("#request-code").textContent = endpoint.snippets[state.language];
    $("#response-code").textContent = endpoint.responses[state.response];
  }

  async function copyText(value, button) {
    try {
      await navigator.clipboard.writeText(value);
      button.classList.add("is-copied");
      button.setAttribute("aria-label", "Copied");
      window.setTimeout(() => {
        button.classList.remove("is-copied");
        button.setAttribute("aria-label", button.dataset.copyTarget === "request-code" ? "Copy request code" : "Copy response JSON");
      }, 1200);
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
    $("#endpoint-select").addEventListener("change", (event) => {
      state.endpoint = event.target.value;
      renderConsole();
    });

    $("#language-tabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-language]");
      if (!button) {
        return;
      }

      state.language = button.dataset.language;
      setTabState($("#language-tabs"), "language", state.language);
      renderConsole();
    });

    $("#response-tabs").addEventListener("click", (event) => {
      const button = event.target.closest("[data-response]");
      if (!button) {
        return;
      }

      state.response = button.dataset.response;
      setTabState($("#response-tabs"), "response", state.response);
      renderConsole();
    });

    $$(".code-copy").forEach((button) => {
      button.addEventListener("click", () => {
        const target = $(`#${button.dataset.copyTarget}`);
        copyText(target.textContent, button);
      });
    });
  }

  function init() {
    renderConsole();
    bindHeader();
    bindConsole();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
