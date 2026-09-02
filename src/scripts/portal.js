(() => {
  "use strict";
  const intro = document.getElementById("portalIntro");
  const coupleName = document.getElementById("coupleName");
  const ampWrap = document.getElementById("portalAmpWrap");
  const amp = ampWrap?.querySelector(".portal-amp");
  const scrollHint = document.getElementById("scrollHint");
  const progressBar = document.getElementById("progressBar");
  const invitation = document.getElementById("invitation");
  if (!intro || !coupleName || !ampWrap || !amp || !scrollHint || !progressBar || !invitation) return;
  let progress = 0; let targetProgress = 0; let autoAnimating = false; let completed = false; let rafId = null; let touchStartY = null; let touchStartProgress = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.body.classList.add("intro-active");
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const easeInOutCubic = (value) => { const t = clamp(value, 0, 1); return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value, 0, 1), 3);
  const zoomMultiplier = () => window.innerWidth <= 380 ? 8.5 : window.innerWidth <= 600 ? 9.5 : 11;
  function render() {
    const p = progress;
    coupleName.style.opacity = String(1 - easeInOutCubic((p - .25) / .22));
    coupleName.style.transform = `scale(${1 + easeOutCubic((p - .02) / .4) * .28})`;
    ampWrap.style.opacity = String(clamp((p - .18) / .22, 0, 1));
    const zoomP = clamp((p - .42) / .58, 0, 1);
    const zoom = 1 + Math.pow(easeInOutCubic(zoomP), 2.15) * zoomMultiplier();
    amp.style.transform = `scale(${(.82 + easeOutCubic((p - .18) / .27) * .2) * zoom}) rotate(${zoomP * -3.5}deg)`;
    scrollHint.style.opacity = String(1 - clamp(p / .18, 0, 1));
    progressBar.style.transform = `scaleX(${p})`;
    const reveal = easeOutCubic((p - .64) / .36);
    invitation.style.opacity = String(reveal);
    invitation.style.transform = `scale(${1.025 - reveal * .025})`;
    if (p >= 1) finishIntro();
  }
  function animationLoop() {
    const difference = targetProgress - progress;
    if (!autoAnimating && Math.abs(difference) < .0008) { progress = targetProgress; render(); rafId = null; return; }
    progress += difference * (reducedMotion ? .35 : .085);
    if (!autoAnimating && Math.abs(difference) < .0008) progress = targetProgress;
    render(); rafId = requestAnimationFrame(animationLoop);
  }
  function startLoop() { if (rafId === null) rafId = requestAnimationFrame(animationLoop); }
  function beginAutoFinish() {
    if (autoAnimating || completed) return;
    autoAnimating = true; const start = targetProgress; const startTime = performance.now(); const duration = reducedMotion ? 200 : 2600;
    function autoStep(now) { const t = clamp((now - startTime) / duration, 0, 1); targetProgress = start + (1 - start) * easeInOutCubic(t); if (t < 1) requestAnimationFrame(autoStep); else { targetProgress = 1; autoAnimating = false; } startLoop(); }
    requestAnimationFrame(autoStep);
  }
  function moveForward(amount) { targetProgress = clamp(targetProgress + amount, 0, 1); if (targetProgress >= .48) beginAutoFinish(); startLoop(); }
  function onWheel(event) { if (completed) return; event.preventDefault(); if (autoAnimating || Math.abs(event.deltaY) < 1) return; moveForward((event.deltaY > 0 ? 1 : -1) * clamp(Math.abs(event.deltaY) / 2300, .008, .065)); }
  function onKey(event) { if (completed) return; const forward = ["ArrowDown", "PageDown", " "]; const backward = ["ArrowUp", "PageUp"]; if (!forward.includes(event.key) && !backward.includes(event.key)) return; event.preventDefault(); if (!autoAnimating) moveForward(forward.includes(event.key) ? .045 : -.045); }
  function onTouchStart(event) { if (!completed && event.touches.length === 1) { touchStartY = event.touches[0].clientY; touchStartProgress = targetProgress; } }
  function onTouchMove(event) { if (completed || event.touches.length !== 1 || touchStartY === null) return; event.preventDefault(); if (autoAnimating) return; const delta = touchStartY - event.touches[0].clientY; if (Math.abs(delta) >= 2) { targetProgress = clamp(touchStartProgress + (delta > 0 ? 1 : -1) * clamp(Math.abs(delta) / 950, 0, .085), 0, 1); if (targetProgress >= .48) beginAutoFinish(); startLoop(); } }
  function finishIntro() { if (completed) return; completed = true; progress = targetProgress = 1; render(); invitation.setAttribute("aria-hidden", "false"); intro.classList.add("finished"); document.body.classList.remove("intro-active"); const previousScrollBehavior = document.documentElement.style.scrollBehavior; document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, 0); document.documentElement.style.scrollBehavior = previousScrollBehavior; window.setTimeout(() => { intro.style.display = "none"; }, 700); }
  window.addEventListener("wheel", onWheel, { passive: false }); window.addEventListener("keydown", onKey); window.addEventListener("touchstart", onTouchStart, { passive: true }); window.addEventListener("touchmove", onTouchMove, { passive: false }); window.addEventListener("touchend", () => { touchStartY = null; }, { passive: true }); window.addEventListener("touchcancel", () => { touchStartY = null; }, { passive: true });
  if (reducedMotion) { targetProgress = progress = 1; invitation.classList.add("visible"); invitation.setAttribute("aria-hidden", "false"); intro.classList.add("finished"); document.body.classList.remove("intro-active"); window.setTimeout(() => { intro.style.display = "none"; }, 50); } else render();
})();
