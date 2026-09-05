(() => {
  "use strict";

  const overlay = document.getElementById("portalIntro");
  const seal = document.getElementById("waxSeal");
  const envelope = document.getElementById("envelope");
  const flap = document.getElementById("envelopeFlap");
  const letter = document.getElementById("envelopeLetter");
  const back = document.getElementById("envelopeBack");
  const frontLeft = document.getElementById("frontLeft");
  const frontRight = document.getElementById("frontRight");
  const hint = document.getElementById("envelopeHint");
  const flashBurst = document.getElementById("flashBurst");
  const portalFlash = document.getElementById("portalFlash");
  const shardsContainer = document.getElementById("shardsContainer");
  const invitation = document.getElementById("invitation");

  if (!overlay || !seal || !envelope || !flap || !letter || !invitation) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let opened = false;
  document.body.classList.add("intro-active");

  function holdStart() { if (!opened) envelope.classList.add("holding"); }
  function holdEnd() { if (!opened) envelope.classList.remove("holding"); }

  function spawnShards() {
    if (reducedMotion) return;
    for (let index = 0; index < 7; index += 1) {
      const shard = document.createElement("span");
      shard.className = "shard";
      const angle = (Math.PI * 2 * index) / 7 + Math.random() * 0.5;
      const distance = 46 + Math.random() * 30;
      shard.style.setProperty("--shard-x", `${Math.cos(angle) * distance}px`);
      shard.style.setProperty("--shard-y", `${Math.sin(angle) * distance}px`);
      shard.style.setProperty("--shard-rotation", `${Math.random() * 360}deg`);
      shardsContainer.appendChild(shard);
      requestAnimationFrame(() => shard.classList.add("shard-flying"));
    }
  }

  function handoff() {
    invitation.setAttribute("aria-hidden", "false");
    invitation.classList.add("visible");
    overlay.classList.add("dismissed");
    document.body.classList.remove("intro-active");
    const previousScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = previousScrollBehavior;
    window.setTimeout(() => { overlay.style.display = "none"; portalFlash.style.display = "none"; }, 750);
    window.dispatchEvent(new CustomEvent("envelopeOpened"));
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    seal.disabled = true;
    envelope.classList.remove("holding");
    envelope.classList.add("opening");
    hint.classList.add("hidden");
    if (typeof navigator.vibrate === "function") navigator.vibrate([12, 30, 18]);
    flashBurst.classList.add("go");
    spawnShards();

    if (reducedMotion) { window.setTimeout(handoff, 450); return; }
    window.setTimeout(() => flap.classList.add("open"), 140);
    window.setTimeout(() => letter.classList.add("rise"), 550);
    window.setTimeout(() => {
      flap.classList.add("fade-out");
      back.classList.add("fade-out");
      frontLeft.classList.add("fade-out");
      frontRight.classList.add("fade-out");
      letter.classList.add("hero");
    }, 1550);
    window.setTimeout(() => portalFlash.classList.add("burst"), 2500);
    window.setTimeout(() => { portalFlash.classList.add("clear"); handoff(); }, 2950);
  }

  seal.addEventListener("pointerdown", holdStart);
  seal.addEventListener("pointerup", holdEnd);
  seal.addEventListener("pointercancel", holdEnd);
  seal.addEventListener("pointerleave", holdEnd);
  seal.addEventListener("click", openEnvelope);
})();
