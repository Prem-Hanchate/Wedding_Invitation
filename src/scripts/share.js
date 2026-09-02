(() => {
  const button = document.getElementById("shareButton");
  const status = document.getElementById("shareStatus");
  if (!button || !status) return;
  button.addEventListener("click", async () => {
    const data = { title: "Siddhesh & Priyanka | Wedding Invitation", text: "Join us for the wedding of Siddhesh & Priyanka.", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); status.textContent = "Invitation link copied."; window.setTimeout(() => { status.textContent = ""; }, 2200); }
    } catch (error) { if (error.name !== "AbortError") status.textContent = "Copying the link was not available."; }
  });
})();
