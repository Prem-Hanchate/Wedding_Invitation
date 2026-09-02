(() => {
  const form = document.querySelector("[data-wishes-form]");
  const list = document.getElementById("wishesList");
  const status = document.querySelector("[data-wishes-status]");
  if (!form || !list || !status) return;
  const key = "wedding-guest-wishes";
  const read = () => { try { return JSON.parse(localStorage.getItem(key) || "[]").slice(0, 12); } catch { return []; } };
  const render = () => { list.replaceChildren(...read().map((wish) => { const article = document.createElement("article"); article.className = "wish-item"; article.innerHTML = "<strong></strong><p></p>"; article.querySelector("strong").textContent = wish.name; article.querySelector("p").textContent = wish.message; return article; })); };
  render();
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const wish = { name: String(data.get("name")).trim(), message: String(data.get("message")).trim(), createdAt: Date.now() };
    if (form.action.includes("REPLACE_WITH_FORM_ID")) { status.textContent = "Add your Formspree form ID to enable wishes."; status.className = "form-status error"; return; }
    const submit = form.querySelector("[type=submit]"); submit.disabled = true; status.textContent = "Sending your wish...";
    try { const response = await fetch(form.action, { method: "POST", body: data, headers: { Accept: "application/json" } }); if (!response.ok) throw new Error("Request failed"); localStorage.setItem(key, JSON.stringify([wish, ...read()].slice(0, 12))); form.reset(); render(); status.textContent = "Your wish has been added."; status.className = "form-status success"; }
    catch { status.textContent = "We couldn't send that yet. Please try again."; status.className = "form-status error"; }
    finally { submit.disabled = false; }
  });
})();
