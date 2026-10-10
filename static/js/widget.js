document.addEventListener("DOMContentLoaded", () => {
  const store = window.KrishChatStore, toggle = document.getElementById("krish-toggle"), panel = document.getElementById("krish-bubble"), messages = document.getElementById("widget-messages"), input = document.getElementById("widget-input"), form = document.getElementById("widget-form"), send = document.getElementById("widget-send");
  if (!store || !toggle || !panel || !messages || !input || !form || !send) return;
  store.trackVisit(); store.ensureIntro("Hi, I’m the portfolio guide. Ask about Krishna’s projects, services, or how to get in touch.");
  const getCookie = (n) => document.cookie.split(";").map((x) => x.trim()).find((x) => x.startsWith(`${n}=`))?.slice(n.length + 1) || "";
  const safeHref = (href) => /^\/(work(?:\/[a-z0-9-]+)?|services|process|about|book|resume)\/$/.test(href || "");
  function render(items, typing = false) {
    messages.replaceChildren();
    items.forEach((item) => { const row = document.createElement("div"), bubble = document.createElement("div"); bubble.className = `chat-widget__message${item.role === "user" ? " chat-widget__message--user" : ""}`; bubble.textContent = item.content; row.append(bubble); (item.links || []).filter((l) => safeHref(l.href)).forEach((l) => { const a = document.createElement("a"); a.href = l.href; a.textContent = l.label; row.append(a); }); messages.append(row); });
    if (typing) { const pending = document.createElement("div"); pending.className = "chat-widget__message"; pending.textContent = "Thinking…"; pending.setAttribute("role", "status"); messages.append(pending); }
    messages.scrollTop = messages.scrollHeight;
  }
  function setOpen(open) { panel.hidden = !open; panel.classList.toggle("is-open", open); panel.setAttribute("aria-hidden", String(!open)); toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? "Close portfolio guide" : "Open portfolio guide"); if (open) input.focus(); }
  async function sendMessage(value) {
    const text = value.trim(); if (!text || send.disabled) return;
    store.addMessage("user", text); input.value = ""; send.disabled = true; render(store.getState().messages, true);
    try {
      const response = await fetch(document.body.dataset.chatApiUrl, { method: "POST", headers: { "Content-Type": "application/json", "X-CSRFToken": decodeURIComponent(getCookie("csrftoken")) }, body: JSON.stringify({ messages: store.getConversationPayload() }) });
      const data = await response.json(); store.addMessage("assistant", response.ok ? data.reply : "I’m having trouble connecting right now. You can explore the work or book a session.", response.ok ? data.links : []);
    } catch { store.addMessage("assistant", "I’m having trouble connecting right now. You can explore the work or book a session."); }
    finally { send.disabled = false; render(store.getState().messages); input.focus(); }
  }
  store.subscribe((state) => render(state.messages)); toggle.addEventListener("click", () => setOpen(panel.hidden));
  form.addEventListener("submit", (e) => { e.preventDefault(); sendMessage(input.value); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) { setOpen(false); toggle.focus(); } });
});
