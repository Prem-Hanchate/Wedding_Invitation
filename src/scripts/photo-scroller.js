(() => {
  const card = document.getElementById("scrollerCard");
  const revealStack = document.getElementById("scrollerRevealStack");
  const finalLine = document.getElementById("scrollerFinalLine");
  const photos = [...document.querySelectorAll(".scroller-strip-photo")];
  if (!card || !revealStack || !finalLine) return;
  card.classList.add("opening");
  photos.forEach((photo) => photo.classList.add("show"));
  finalLine.classList.add("show");
})();
