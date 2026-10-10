document.addEventListener("DOMContentLoaded", () => {
  // The CSS switches to the desktop navigation above 64rem (see components.css).
  const desktop = window.matchMedia("(min-width: 64.0625rem)");

  document.querySelectorAll(".site-nav__mobile").forEach((menu) => {
    const summary = menu.querySelector("summary");
    if (!summary) return;

    const syncLabel = () => {
      summary.setAttribute("aria-label", menu.open ? "Close navigation menu" : "Open navigation menu");
    };
    const close = () => {
      if (!menu.open) return;
      const hadFocus = menu.contains(document.activeElement);
      menu.open = false;
      syncLabel();
      if (hadFocus) summary.focus();
    };

    menu.addEventListener("toggle", syncLabel);

    // Same-page anchor links do not reload the page, so close the menu explicitly.
    menu.addEventListener("click", (event) => {
      if (event.target.closest(".site-nav__mobile-menu a")) close();
    });

    // Light dismiss: a click anywhere outside the open menu closes it.
    document.addEventListener("click", (event) => {
      if (menu.open && !menu.contains(event.target)) close();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menu.open) close();
    });

    // Do not leave the menu "open" while hidden at desktop width; it would
    // reappear open after the window is narrowed again.
    const onViewportChange = (event) => { if (event.matches) close(); };
    if (desktop.addEventListener) desktop.addEventListener("change", onViewportChange);
    else desktop.addListener(onViewportChange);

    // Back/forward cache can restore the page with the menu still open.
    window.addEventListener("pageshow", (event) => { if (event.persisted) close(); });

    syncLabel();
  });
});
