(() => {
  const card = document.getElementById("scrollerCard");
  const revealStack = document.getElementById("scrollerRevealStack");
  const finalLine = document.getElementById("scrollerFinalLine");
  if (!card || !revealStack || !finalLine) return;
  const track = revealStack.querySelector(".scroller-strip-track");
  if (!track) return;
  finalLine.classList.add("show");
  window.setTimeout(() => track.classList.add("scrolling"), 1800);
})();
