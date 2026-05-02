(function() {
  const CHAT_STORAGE_KEY = "krish_chat_state_v1";
  const VISIT_STORAGE_KEY = "krish_visit_state_v1";

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : clone(fallback);
    } catch (error) {
      return clone(fallback);
    }
  }

  function createDefaultChatState() {
    return {
      isAdmin: false,
      messages: [],
    };
  }

  function createDefaultVisitState() {
    return {
      totalVisits: 0,
      visitsByDay: {},
      lastTrackedDate: null,
    };
  }

  let chatState = loadJson(CHAT_STORAGE_KEY, createDefaultChatState());
  let visitState = loadJson(VISIT_STORAGE_KEY, createDefaultVisitState());
  const listeners = new Set();

  function persistChatState() {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chatState));
  }

  function persistVisitState() {
    localStorage.setItem(VISIT_STORAGE_KEY, JSON.stringify(visitState));
  }

  function notify() {
    const snapshot = clone(chatState);
    listeners.forEach((listener) => listener(snapshot));
    window.dispatchEvent(new CustomEvent("krish-chat:updated", { detail: snapshot }));
  }

  function getTodayKey() {
    return new Date().toDateString();
  }

  function formatMessage(message) {
    return {
      id: message.id || String(Date.now() + Math.random()),
      role: message.role,
      content: message.content,
      timestamp: message.timestamp || new Date().toISOString(),
    };
  }

  window.addEventListener("storage", (event) => {
    if (event.key === CHAT_STORAGE_KEY) {
      chatState = loadJson(CHAT_STORAGE_KEY, createDefaultChatState());
      notify();
    }

    if (event.key === VISIT_STORAGE_KEY) {
      visitState = loadJson(VISIT_STORAGE_KEY, createDefaultVisitState());
    }
  });

  window.KrishChatStore = {
    getState() {
      return clone(chatState);
    },

    subscribe(listener) {
      listeners.add(listener);
      listener(clone(chatState));
      return function unsubscribe() {
        listeners.delete(listener);
      };
    },

    trackVisit() {
      const today = getTodayKey();
      visitState.totalVisits += 1;
      visitState.visitsByDay[today] = (visitState.visitsByDay[today] || 0) + 1;
      visitState.lastTrackedDate = today;
      persistVisitState();
      return clone(visitState);
    },

    getVisitState() {
      return clone(visitState);
    },

    getSessionInfo() {
      const today = getTodayKey();
      const todayVisits = visitState.visitsByDay[today] || 0;
      return "Today: " + todayVisits + " visit(s). Total visits recorded: " + visitState.totalVisits + ". Date: " + today + ".";
    },

    ensureIntro(introText) {
      if (chatState.messages.length > 0) {
        return false;
      }

      chatState.messages.push(
        formatMessage({
          role: "assistant",
          content: introText,
        })
      );
      persistChatState();
      notify();
      return true;
    },

    addMessage(role, content) {
      chatState.messages.push(
        formatMessage({
          role: role,
          content: content,
        })
      );
      persistChatState();
      notify();
    },

    setAdmin(nextValue) {
      chatState.isAdmin = Boolean(nextValue);
      persistChatState();
      notify();
    },

    getConversationPayload() {
      return chatState.messages.map(function(message) {
        return {
          role: message.role,
          content: message.content,
        };
      });
    },
  };
})();
