(() => {
  const audio = document.getElementById("themeAudio");
  const button = document.getElementById("musicToggle");
  if (!audio || !button) return;
  button.addEventListener("click", async () => {
    if (audio.paused) {
      try { await audio.play(); button.textContent = "◼"; button.setAttribute("aria-label", "Pause background music"); button.setAttribute("aria-pressed", "true"); }
      catch { button.setAttribute("aria-label", "Music file unavailable"); }
    } else { audio.pause(); button.textContent = "♪"; button.setAttribute("aria-label", "Play background music"); button.setAttribute("aria-pressed", "false"); }
  });
})();
