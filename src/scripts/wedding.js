/* =========================================================
   HINDU WEDDING — ambience & scroll choreography
   Adds falling petals, section reveals and countdown ticks
   without touching any existing interaction logic.
   ========================================================= */
(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- generate soft petal fields (SVG layers) ---------- */
  function buildPetals(svg, count) {
    const ns = "http://www.w3.org/2000/svg";
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    const colors = ["#FF9E1B", "#E8630A", "#FFC24B", "#E94560", "#F0DFB4"];
    for (let i = 0; i < count; i += 1) {
      const petal = document.createElementNS(ns, "ellipse");
      petal.setAttribute("cx", (Math.random() * 100).toFixed(2));
      petal.setAttribute("cy", (Math.random() * 100).toFixed(2));
      petal.setAttribute("rx", (0.35 + Math.random() * 0.55).toFixed(2));
      petal.setAttribute("ry", (0.7 + Math.random() * 1.1).toFixed(2));
      petal.setAttribute("fill", colors[Math.floor(Math.random() * colors.length)]);
      petal.setAttribute("opacity", (0.18 + Math.random() * 0.4).toFixed(2));
      petal.setAttribute("transform", `rotate(${(Math.random() * 360).toFixed(0)} ${petal.getAttribute("cx")} ${petal.getAttribute("cy")})`);
      svg.appendChild(petal);
    }
  }

  if (!reducedMotion) {
    const layer1 = document.getElementById("petalLayer1");
    const layer2 = document.getElementById("petalLayer2");
    if (layer1) buildPetals(layer1, innerWidth < 600 ? 34 : 60);
    if (layer2) buildPetals(layer2, innerWidth < 600 ? 22 : 40);
  }

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
