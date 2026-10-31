(() => {
  const audio = document.getElementById("themeAudio");
  const button = document.getElementById("musicToggle");
  if (!audio || !button) return;
  const updateButton = (playing) => {
    button.textContent = playing ? "◼" : "♪";
    button.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
    button.setAttribute("aria-pressed", String(playing));
  };
  const startFromEnvelope = () => {
    if (document.visibilityState !== "visible") return;
    if (audio.paused) {
      audio.play().then(() => updateButton(true)).catch(() => updateButton(false));
    }
  };
  window.addEventListener("envelopeOpening", startFromEnvelope, { once: true });
  window.addEventListener("envelopeOpened", startFromEnvelope, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      audio.pause();
      updateButton(false);
    }
  });
  window.addEventListener("pagehide", () => {
    audio.pause();
    updateButton(false);
  });
  button.addEventListener("click", async () => {
    if (document.visibilityState !== "visible") return;
    if (audio.paused) {
      try { await audio.play(); updateButton(true); }
      catch { button.setAttribute("aria-label", "Music file unavailable"); }
    } else { audio.pause(); updateButton(false); }
  });
})();
