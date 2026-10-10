document.addEventListener("DOMContentLoaded", () => {
  const panel = document.getElementById("admin-mode");
  if (!panel) return;

  const body = document.body;

  const urls = {
    login: body.dataset.adminLoginUrl,
    status: body.dataset.adminStatusUrl,
    logout: body.dataset.adminLogoutUrl,
  };

  const loginForm = document.getElementById("admin-mode-login");
  const passwordInput = document.getElementById("admin-mode-password");
  const loginButton = document.getElementById("admin-mode-login-button");
  const error = document.getElementById("admin-mode-error");
  const status = document.getElementById("admin-mode-status");
  const badge = document.getElementById("admin-mode-badge");

  // Reuse the existing logout button, but no longer render a document preview.
  const oldPrivatePanel = document.getElementById("admin-mode-private");
  let logoutButton = document.getElementById("admin-mode-logout");

  if (oldPrivatePanel) {
    oldPrivatePanel.replaceChildren();

    const logout = document.createElement("button");
    logout.type = "button";
    logout.id = "admin-mode-logout";
    logout.className = "button button--secondary";
    logout.textContent = "Lock Admin Mode";
    oldPrivatePanel.append(logout);
    oldPrivatePanel.hidden = true;
    logoutButton = logout;
  }

  let authenticated = false;
  let busy = false;

  function csrfToken() {
    const cookie = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith("csrftoken="));

    if (!cookie) return "";

    try {
      return decodeURIComponent(cookie.slice("csrftoken=".length));
    } catch {
      return "";
    }
  }

  async function request(url, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("Accept", "application/json");

    if (options.method && options.method !== "GET") {
      headers.set("X-CSRFToken", csrfToken());
    }

    return fetch(url, {
      ...options,
      headers,
      credentials: "same-origin",
      cache: "no-store",
    });
  }

  function showLocked(message = "Admin Mode is locked.") {
    authenticated = false;
    badge.textContent = "Locked";
    badge.classList.remove("admin-mode__badge--unlocked");
    status.textContent = message;
    loginForm.hidden = false;
    passwordInput.value = "";
    loginButton.disabled = false;
    error.hidden = true;
    error.textContent = "";

    if (oldPrivatePanel) oldPrivatePanel.hidden = true;
  }

  function showUnlocked() {
    authenticated = true;
    badge.textContent = "Unlocked";
    badge.classList.add("admin-mode__badge--unlocked");
    status.textContent =
      "Private assistant enabled. Public and private knowledge are available.";
    loginForm.hidden = true;

    if (oldPrivatePanel) oldPrivatePanel.hidden = false;
    error.hidden = true;
    error.textContent = "";
  }

  async function checkStatus() {
    loginForm.hidden = true;
    status.textContent = "Checking authentication…";

    try {
      const response = await request(urls.status);
      if (!response.ok) throw new Error("Authentication check failed.");

      const data = await response.json();

      if (data.authenticated === true) {
        showUnlocked();
      } else {
        showLocked();
      }
    } catch {
      showLocked("Unable to verify Admin Mode. Check your connection.");
    }
  }

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;

    busy = true;
    loginButton.disabled = true;
    error.hidden = true;
    status.textContent = "Authenticating…";

    try {
      const response = await request(urls.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput.value }),
      });

      const data = await response.json().catch(() => ({}));
      passwordInput.value = "";

      if (response.status === 429) {
        error.textContent =
          data.error || "Too many login attempts. Try again later.";
        error.hidden = false;
        status.textContent = "Login temporarily limited.";
        return;
      }

      if (!response.ok) {
        error.textContent =
          data.error || "Authentication failed. Please try again.";
        error.hidden = false;
        status.textContent = "Admin Mode remains locked.";
        return;
      }

      showUnlocked();
    } catch {
      passwordInput.value = "";
      error.textContent = "Unable to contact the server. Please try again.";
      error.hidden = false;
      status.textContent = "Admin Mode remains locked.";
    } finally {
      busy = false;
      loginButton.disabled = false;
    }
  });

  logoutButton?.addEventListener("click", async () => {
    if (busy) return;

    busy = true;
    logoutButton.disabled = true;

    try {
      const response = await request(urls.logout, { method: "POST" });

      if (!response.ok) {
        status.textContent =
          "Logout could not be confirmed. Retry before leaving this page.";
        return;
      }

      // Remove private responses from the current browser view after confirmed logout.
      window.KrishChatStore?.clearConversation(
        "Admin Mode is locked. Start a new public conversation."
      );
      showLocked("Admin Mode has been locked.");
    } catch {
      status.textContent =
        "Unable to confirm logout. Check your connection and retry.";
    } finally {
      busy = false;
      if (logoutButton) logoutButton.disabled = false;
    }
  });

  checkStatus();
});
