(() => {
  document.querySelectorAll("[data-formspree-form]").forEach((form) => {
    const status = form.querySelector("[data-form-status]");
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (form.action.includes("REPLACE_WITH_FORM_ID")) { status.textContent = "Add your Formspree form ID to enable RSVPs."; status.className = "form-status error"; return; }
      const submit = form.querySelector("[type=submit]"); submit.disabled = true; status.textContent = "Sending your RSVP..."; status.className = "form-status";
      try { const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Request failed"); form.reset(); status.textContent = "Thank you, your RSVP is received."; status.className = "form-status success"; } catch { status.textContent = "We couldn't send that yet. Please try again."; status.className = "form-status error"; } finally { submit.disabled = false; }
    });
  });
})();
