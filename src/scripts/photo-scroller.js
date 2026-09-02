(() => {
  const card = document.getElementById("scrollerCard");
  const button = document.getElementById("scrollerClickBtn");
  const revealStack = document.getElementById("scrollerRevealStack");
  const finalLine = document.getElementById("scrollerFinalLine");
  const photos = [...document.querySelectorAll(".scroller-strip-photo")];
  if (!card || !button || !revealStack || !finalLine) return;
  let busy = false;
  let opened = false;
  button.addEventListener("click", () => {
    if (busy || opened) return;
    busy = true; opened = true; button.classList.add("pressed"); button.disabled = true;
    window.setTimeout(() => { card.classList.add("opening"); button.classList.add("hidden"); }, 120);
    window.setTimeout(() => revealStack.classList.add("ready", "scrolling"), 420);
    window.setTimeout(() => revealStack.scrollIntoView({ behavior: "smooth", block: "start" }), 850);
    photos.forEach((photo, index) => window.setTimeout(() => photo.classList.add("show"), 650 + index * 260));
    window.setTimeout(() => { finalLine.classList.add("show"); busy = false; }, 650 + photos.length * 260 + 200);
  });
})();
