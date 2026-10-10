document.addEventListener("DOMContentLoaded", () => {
  const store = window.KrishChatStore;
  const messages = document.getElementById("chat-messages");
  const input = document.getElementById("chat-input");
  const form = document.getElementById("assistant-form");
  const send = document.getElementById("send-btn");

  if (!store || !messages || !input || !form || !send) return;

  const intro =
    "Hello, I’m the portfolio guide. Ask about Krishna’s work, projects, or where to explore next.";

  store.trackVisit();
  store.ensureIntro(intro);

  const getCookie = (name) =>
    document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) || "";

  // Only allow known, same-origin portfolio routes.
  const safeHref = (href) =>
    /^\/(work(?:\/[a-z0-9-]+)?|services|process|about|book|resume)\/$/.test(
      href || ""
    );

  function appendInline(parent, text) {
    const pattern =
      /\*\*[^*\n]+\*\*|`[^`\n]+`|\*[^*\n]+\*|\[[^\]\n]+\]\([^) \n]+\)/g;

    let position = 0;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      if (match.index > position) {
        parent.append(document.createTextNode(text.slice(position, match.index)));
      }

      const token = match[0];

      if (token.startsWith("**")) {
        const strong = document.createElement("strong");
        strong.textContent = token.slice(2, -2);
        parent.append(strong);
      } else if (token.startsWith("`")) {
        const code = document.createElement("code");
        code.textContent = token.slice(1, -1);
        parent.append(code);
      } else if (token.startsWith("*")) {
        const emphasis = document.createElement("em");
        emphasis.textContent = token.slice(1, -1);
        parent.append(emphasis);
      } else {
        const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        const label = linkMatch?.[1] || token;
        const href = linkMatch?.[2] || "";

        if (linkMatch && safeHref(href)) {
          const anchor = document.createElement("a");
          anchor.href = href;
          anchor.textContent = label;
          anchor.className = "assistant-inline-link";
          parent.append(anchor);
        } else {
          // Never interpret arbitrary URLs or HTML as trusted markup.
          parent.append(document.createTextNode(label));
        }
      }

      position = pattern.lastIndex;
    }

    if (position < text.length) {
      parent.append(document.createTextNode(text.slice(position)));
    }
  }

  function renderMarkdown(container, rawText) {
    const lines = String(rawText || "").replace(/\r\n?/g, "\n").split("\n");
    let index = 0;

    const isBullet = (line) => /^\s*[-*]\s+/.test(line);
    const isNumbered = (line) => /^\s*\d+[.)]\s+/.test(line);
    const isHeading = (line) => /^#{1,3}\s+/.test(line);

    while (index < lines.length) {
      const line = lines[index];

      if (!line.trim()) {
        index += 1;
        continue;
      }

      const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);

      if (headingMatch) {
        const heading = document.createElement("h3");
        appendInline(heading, headingMatch[2].trim());
        container.append(heading);
        index += 1;
        continue;
      }

      if (isBullet(line) || isNumbered(line)) {
        const ordered = isNumbered(line);
        const list = document.createElement(ordered ? "ol" : "ul");

        while (index < lines.length) {
          const current = lines[index];

          if (
            (ordered && !isNumbered(current)) ||
            (!ordered && !isBullet(current))
          ) {
            break;
          }

          const item = document.createElement("li");
          const content = current
            .trim()
            .replace(ordered ? /^\d+[.)]\s+/ : /^[-*]\s+/, "");

          appendInline(item, content);
          list.append(item);
          index += 1;
        }

        container.append(list);
        continue;
      }

      const paragraph = document.createElement("p");

      while (
        index < lines.length &&
        lines[index].trim() &&
        !isHeading(lines[index]) &&
        !isBullet(lines[index]) &&
        !isNumbered(lines[index])
      ) {
        if (paragraph.childNodes.length) {
          paragraph.append(document.createElement("br"));
        }

        appendInline(paragraph, lines[index].trim());
        index += 1;
      }

      container.append(paragraph);
    }
  }

  function render(items, typing = false) {
    messages.replaceChildren();

    items.forEach((item) => {
      const row = document.createElement("article");
      row.className =
        `assistant-message assistant-message--${item.role === "user" ? "user" : "guide"}`;

      const content = document.createElement("div");
      content.className = "assistant-message__content";

      if (item.role === "user") {
        // User input is always rendered as plain text.
        content.textContent = item.content;
      } else {
        renderMarkdown(content, item.content);
      }

      row.append(content);

      (item.links || [])
        .filter((link) => safeHref(link.href))
        .forEach((link) => {
          const anchor = document.createElement("a");
          anchor.href = link.href;
          anchor.textContent = link.label;
          anchor.className = "assistant-message__link";
          row.append(anchor);
        });

      messages.append(row);
    });

    if (typing) {
      const pending = document.createElement("p");
      pending.className = "assistant-message__pending";
      pending.textContent = "Preparing a response…";
      pending.setAttribute("role", "status");
      messages.append(pending);
    }

    messages.scrollTop = messages.scrollHeight;
  }

  let requestGeneration = 0;
  let activeController = null;

  window.addEventListener("krish-chat:cleared", () => {
    requestGeneration += 1;
    activeController?.abort();
    activeController = null;
    send.disabled = false;
    render(store.getState().messages);
  });

  async function sendMessage(value) {
    const text = value.trim();

    if (!text || send.disabled) return;

    store.addMessage("user", text);
    input.value = "";
    input.style.height = "auto";
    send.disabled = true;
    render(store.getState().messages, true);

    const generation = requestGeneration;
    activeController = new AbortController();

    try {
      const response = await fetch(document.body.dataset.chatApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": decodeURIComponent(getCookie("csrftoken")),
        },
        body: JSON.stringify({
          messages: store.getConversationPayload(),
        }),
        signal: activeController.signal,
      });

      const data = await response.json().catch(() => ({}));

      if (generation !== requestGeneration) return;

      store.addMessage(
        "assistant",
        response.ok
          ? (data.reply || "The server returned an empty response.")
          : (data.error || "The request failed. Please try again."),
        response.ok ? (data.links || []) : []
      );
    } catch {
      if (generation === requestGeneration) {
        store.addMessage(
          "assistant",
          "I’m having trouble connecting right now. You can explore the work or book a session."
        );
      }
    } finally {
      if (generation === requestGeneration) {
        activeController = null;
        send.disabled = false;
        render(store.getState().messages);
        input.focus();
      }
    }
  }

  store.subscribe((state) => render(state.messages));

  const suggested = new URLSearchParams(location.search).get("prompt");

  if (suggested) {
    input.value = suggested.slice(0, 4000);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 180)}px`;
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(input.value);
    }
  });

  document.querySelectorAll("[data-prompt]").forEach((button) => {
    button.addEventListener("click", () => sendMessage(button.dataset.prompt));
  });
});
