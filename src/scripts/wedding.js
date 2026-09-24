/* =========================================================
   HINDU WEDDING — ambience & scroll choreography
   Adds falling flowers, section reveals and countdown ticks
   without touching any existing interaction logic.
   Mobile & desktop safe: layers are re-generated on resize /
   orientation change so animations always run full-screen.
   ========================================================= */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- falling marigold & rose flowers (DOM layer, smooth downward drift) ---------- */
  const flowerLayer = document.getElementById("flowerLayer");
  const FLOWER_COLORS = [
    ["#FF9E1B", "#E8630A"], // marigold orange
    ["#FFC24B", "#FF9E1B"], // golden marigold
    ["#E94560", "#B3123A"], // rose red
    ["#F0DFB4", "#D8B370"], // cream / gold
    ["#F4A6C0", "#D96C8E"]  // lotus pink
  ];

  function makeFlower() {
    const colors = FLOWER_COLORS[Math.floor(Math.random() * FLOWER_COLORS.length)];
    const portrait = innerHeight > innerWidth;
    // slightly smaller blooms on narrow phones so they never crowd the screen
    const size = (portrait ? 9 : 11) + Math.random() * (portrait ? 10 : 12);
    const wrap = document.createElement("span");
    wrap.className = "falling-flower";
    wrap.style.left = (Math.random() * 100).toFixed(2) + "%";
    wrap.style.setProperty("--fall-duration", (9 + Math.random() * 9).toFixed(1) + "s");
    wrap.style.setProperty("--fall-delay", (-Math.random() * 16).toFixed(1) + "s");
    wrap.style.setProperty("--sway-x", (Math.random() * 90 - 45).toFixed(0) + "px");
    wrap.style.setProperty("--spin", ((Math.random() < .5 ? -1 : 1) * (360 + Math.random() * 540)).toFixed(0) + "deg");
    wrap.style.setProperty("--flower-size", size.toFixed(1) + "px");
    wrap.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    for (let pIdx = 0; pIdx < 5; pIdx += 1) {
      const petal = document.createElementNS(svgNS, "ellipse");
      petal.setAttribute("cx", "12");
      petal.setAttribute("cy", "6.4");
      petal.setAttribute("rx", "3.1");
      petal.setAttribute("ry", "5.4");
      petal.setAttribute("fill", pIdx % 2 === 0 ? colors[0] : colors[1]);
      petal.setAttribute("transform", `rotate(${pIdx * 72} 12 12)`);
      svg.appendChild(petal);
    }
    const core = document.createElementNS(svgNS, "circle");
    core.setAttribute("cx", "12");
    core.setAttribute("cy", "12");
    core.setAttribute("r", "2.6");
    core.setAttribute("fill", "#7a4a12");
    svg.appendChild(core);

    wrap.appendChild(svg);
    return wrap;
  }

  function populateFlowers() {
    if (!flowerLayer || reducedMotion) return;
    flowerLayer.textContent = "";
    const count = innerWidth < 600 ? 14 : 24;
    for (let i = 0; i < count; i += 1) flowerLayer.appendChild(makeFlower());
  }

  populateFlowers();

  /* regenerate on resize / phone rotation so the fall path always matches the viewport */
  let lastW = innerWidth;
  let lastH = innerHeight;
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (Math.abs(innerWidth - lastW) < 40 && Math.abs(innerHeight - lastH) < 120) return;
      lastW = innerWidth;
      lastH = innerHeight;
      populateFlowers();
    }, 300);
  }, { passive: true });

  /* pause ambient CSS work while tab is hidden (saves battery on mobile) */
  document.addEventListener("visibilitychange", () => {
    if (!flowerLayer) return;
    flowerLayer.style.visibility = document.hidden ? "hidden" : "visible";
  });

  /* ---------- keep fixed decor hidden until the envelope is opened ---------- */
  function gateDecor() {
    const invitation = document.getElementById("invitation");
    const decor = document.querySelector(".wedding-ambient");
    if (!invitation || !decor) return;
    const sync = () => {
      decor.style.opacity = invitation.classList.contains("visible") ? "1" : "0";
    };
    sync();
    new MutationObserver(sync).observe(invitation, { attributes: true, attributeFilter: ["class"] });
  }
  gateDecor();

  /* ---------- scroll reveal choreography ---------- */
  const revealTargets = [
    { selector: ".story-section .section-inner", cls: "reveal" },
    { selector: ".scratch-content", cls: "reveal zoom" },
    { selector: ".countdown-section .section-inner, .countdown-section > div", cls: "reveal" },
    { selector: "#events .section-inner", cls: "reveal" },
    { selector: ".event-grid", cls: "reveal-stagger" },
    { selector: ".scroller-stage", cls: "reveal zoom" },
    { selector: ".location-section .section-inner", cls: "reveal" },
    { selector: ".calendar-section .section-inner", cls: "reveal" },
    { selector: ".wishes-section .section-inner", cls: "reveal" },
    { selector: ".rsvp-section .section-inner", cls: "reveal" },
    { selector: "footer", cls: "reveal" },
  ];

  const elements = new Set();
  revealTargets.forEach(({ selector, cls }) => {
    document.querySelectorAll(selector).forEach((el) => {
      cls.split(" ").forEach((name) => el.classList.add(name));
      elements.add(el);
    });
  });

  if ("IntersectionObserver" in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    elements.forEach((el) => observer.observe(el));
  } else {
    elements.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- countdown heartbeat pulse on the seconds digit ---------- */
  const secondsEl = document.getElementById("seconds");
  if (secondsEl && !reducedMotion) {
    let lastValue = secondsEl.textContent;
    const tick = () => {
      if (secondsEl.textContent !== lastValue) {
        lastValue = secondsEl.textContent;
        secondsEl.classList.remove("tick");
        void secondsEl.offsetWidth;
        secondsEl.classList.add("tick");
      }
    };
    const timer = setInterval(tick, 1000);
    window.addEventListener("pagehide", () => clearInterval(timer));
  }
})();
