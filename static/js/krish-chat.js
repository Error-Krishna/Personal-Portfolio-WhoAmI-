(function() {
  const VISIT_STORAGE_KEY = "krish_visit_state_v1";
  // Discard conversations saved by older versions (which could contain private admin output).
  try { localStorage.removeItem("krish_chat_state_v1"); } catch (_) {}
  let chatState = { messages: [] };
  let visitState = { totalVisits: 0, visitsByDay: {}, lastTrackedDate: null };
  try {
    const saved = JSON.parse(localStorage.getItem(VISIT_STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") visitState = { ...visitState, ...saved };
  } catch (_) {}
  const listeners = new Set();
  const clone = (value) => JSON.parse(JSON.stringify(value));
  function notify() {
    const snapshot = clone(chatState);
    listeners.forEach((listener) => listener(snapshot));
    window.dispatchEvent(new CustomEvent("krish-chat:updated", { detail: snapshot }));
  }
  window.KrishChatStore = {
    getState: () => clone(chatState),
    subscribe(listener) { listeners.add(listener); listener(clone(chatState)); return () => listeners.delete(listener); },
    trackVisit() {
      const today = new Date().toDateString();
      visitState.totalVisits++;
      visitState.visitsByDay[today] = (visitState.visitsByDay[today] || 0) + 1;
      visitState.lastTrackedDate = today;
      try { localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(visitState)); } catch (_) {}
      return clone(visitState);
    },
    ensureIntro(content) { if (!chatState.messages.length) { chatState.messages.push({ role: "assistant", content }); notify(); } },
    addMessage(role, content, links = []) { chatState.messages.push({ role, content, links }); notify(); },
    clearConversation(content = "") {
      chatState.messages = [];
      if (content) {
        chatState.messages.push({ role: "assistant", content, links: [] });
      }
      notify();
      window.dispatchEvent(new CustomEvent("krish-chat:cleared"));
    },
    getConversationPayload() { return chatState.messages.filter((m) => m.role === "user").slice(-19).map((m) => ({ role: "user", content: m.content })); },
  };
})();
