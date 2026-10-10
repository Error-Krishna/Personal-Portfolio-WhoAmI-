document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-inquiry-form]");
  if (!form) return;

  form.addEventListener("submit", () => {
    const button = form.querySelector("[type=submit]");
    if (!button || button.disabled) return;
    button.disabled = true;
    button.textContent = "Sending inquiry…";
  });
});
