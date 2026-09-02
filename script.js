(() => {

  "use strict";


  /* ========================================================
     ELEMENTS
     ======================================================== */

  const intro =
    document.getElementById(
      "portalIntro"
    );


  const coupleName =
    document.getElementById(
      "coupleName"
    );


  const ampWrap =
    document.getElementById(
      "portalAmpWrap"
    );


  const amp =
    ampWrap.querySelector(
      ".portal-amp"
    );


  const scrollHint =
    document.getElementById(
      "scrollHint"
    );


  const progressBar =
    document.getElementById(
      "progressBar"
    );


  const invitation =
    document.getElementById(
      "invitation"
    );


  /* ========================================================
     STATE
     ======================================================== */

  let progress = 0;

  let targetProgress = 0;

  let autoAnimating = false;

  let completed = false;

  let rafId = null;

  let touchStartY = null;

  let touchStartProgress = 0;


  const reducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  /*
   * Lock normal page scrolling while the
   * intro portal is active.
   */

  document.body.classList.add(
    "intro-active"
  );


  /* ========================================================
     HELPERS
     ======================================================== */

  function clamp(
    value,
    min,
    max
  ) {

    return Math.min(
      max,
      Math.max(
        min,
        value
      )
    );

  }


  function easeInOutCubic(t) {

    t =
      clamp(
        t,
        0,
        1
      );


    if (t < 0.5) {

      return 4 * t * t * t;

    }


    return (
      1 -
      Math.pow(
        -2 * t + 2,
        3
      ) / 2
    );

  }


  function easeOutCubic(t) {

    return (
      1 -
      Math.pow(
        1 -
        clamp(
          t,
          0,
          1
        ),
        3
      )
    );

  }


  /* ========================================================
     ZOOM SIZE
     ======================================================== */

  function getZoomMultiplier() {

    const width =
      window.innerWidth;


    /*
     * Smaller multiplier for small
     * mobile screens.
     */

    if (width <= 380) {

      return 8.5;

    }


    if (width <= 600) {

      return 9.5;

    }


    /*
     * Larger zoom for desktop.
     */

    return 11;

  }


  /* ========================================================
     RENDER
     ======================================================== */

  function render() {

    const p =
      progress;


    /* ------------------------------------------------------
       COUPLE NAME
       ------------------------------------------------------ */

    const coupleFade =
      1 -
      easeInOutCubic(
        (p - 0.25) /
        0.22
      );


    const coupleScale =
      1 +
      easeOutCubic(
        (p - 0.02) /
        0.40
      ) *
      0.28;


    coupleName.style.opacity =
      String(
        coupleFade
      );


    coupleName.style.transform =
      `scale(${coupleScale})`;


    /* ------------------------------------------------------
       BIG AMPERSAND APPEARANCE
       ------------------------------------------------------ */

    const ampOpacity =
      clamp(
        (p - 0.18) /
        0.22,
        0,
        1
      );


    const ampReveal =
      0.82 +
      easeOutCubic(
        (p - 0.18) /
        0.27
      ) *
      0.20;


    /* ------------------------------------------------------
       AMPERSAND ZOOM
       ------------------------------------------------------ */

    const zoomP =
      clamp(
        (p - 0.42) /
        0.58,
        0,
        1
      );


    const zoomEase =
      easeInOutCubic(
        zoomP
      );


    /*
     * This is the important part.
     *
     * The & does not simply scale linearly.
     * It accelerates toward the viewer.
     *
     * That creates the portal effect.
     */

    const zoom =
      1 +
      Math.pow(
        zoomEase,
        2.15
      ) *
      getZoomMultiplier();


    const rotation =
      zoomP *
      -3.5;


    ampWrap.style.opacity =
      String(
        ampOpacity
      );


    amp.style.transform =
      `scale(${ampReveal * zoom}) rotate(${rotation}deg)`;


    /* ------------------------------------------------------
       SCROLL HINT
       ------------------------------------------------------ */

    scrollHint.style.opacity =
      String(
        1 -
        clamp(
          p / 0.18,
          0,
          1
        )
      );


    /* ------------------------------------------------------
       PROGRESS
       ------------------------------------------------------ */

    progressBar.style.transform =
      `scaleX(${p})`;


    /* ------------------------------------------------------
       INVITATION REVEAL
       ------------------------------------------------------ */

    const invitationReveal =
      easeOutCubic(
        (p - 0.64) /
        0.36
      );


    invitation.style.opacity =
      String(
        invitationReveal
      );


    invitation.style.transform =
      `scale(${
        1.025 -
        invitationReveal *
        0.025
      })`;


    /* ------------------------------------------------------
       COMPLETE
       ------------------------------------------------------ */

    if (p >= 1) {

      finishIntro();

    }

  }


  /* ========================================================
     ANIMATION LOOP
     ======================================================== */

  function animationLoop() {

    const difference =
      targetProgress -
      progress;

    if (
      !autoAnimating &&
      Math.abs(difference) < 0.0008
    ) {

      progress =
        targetProgress;

      render();

      rafId = null;

      return;

    }


    /*
     * Smoothly move current progress
     * toward target progress.
     */

    progress +=
      difference *
      (
        reducedMotion
          ? 0.35
          : 0.085
      );


    if (
      !autoAnimating &&
      Math.abs(
        difference
      ) < 0.0008
    ) {

      progress =
        targetProgress;

    }


    render();


    rafId =
      requestAnimationFrame(
        animationLoop
      );

  }


  function startLoop() {

    if (
      rafId !== null
    ) {

      return;

    }


    rafId =
      requestAnimationFrame(
        animationLoop
      );

  }


  /* ========================================================
     MOUSE / TRACKPAD SCROLL
     ======================================================== */

  function updateFromWheel(
    event
  ) {

    if (completed) {

      return;

    }


    /*
     * Prevent the underlying invitation
     * from scrolling while the portal
     * is active.
     */

    event.preventDefault();


    if (autoAnimating) {

      return;

    }


    const delta =
      event.deltaY;


    if (
      Math.abs(delta) < 1
    ) {

      return;

    }


    /*
     * Convert wheel movement into
     * animation progress.
     */

    const step =
      clamp(
        Math.abs(delta) / 2300,
        0.008,
        0.065
      );


    targetProgress =
      clamp(
        targetProgress +
        (
          delta > 0
            ? step
            : -step
        ),
        0,
        1
      );


    /*
     * Once the user has started the
     * main & zoom, finish it automatically.
     */

    if (
      targetProgress >= 0.48
    ) {

      beginAutoFinish();

    }


    startLoop();

  }


  window.addEventListener(
    "wheel",
    updateFromWheel,
    {
      passive: false
    }
  );


  /* ========================================================
     KEYBOARD
     ======================================================== */

  window.addEventListener(
    "keydown",
    (event) => {

      if (completed) {

        return;

      }


      const forwardKeys = [

        "ArrowDown",

        "PageDown",

        " "

      ];


      const backwardKeys = [

        "ArrowUp",

        "PageUp"

      ];


      if (

        !forwardKeys.includes(
          event.key
        ) &&

        !backwardKeys.includes(
          event.key
        )

      ) {

        return;

      }


      event.preventDefault();


      if (autoAnimating) {

        return;

      }


      const forward =
        forwardKeys.includes(
          event.key
        );


      targetProgress =
        clamp(
          targetProgress +
          (
            forward
              ? 0.045
              : -0.045
          ),
          0,
          1
        );


      if (
        targetProgress >= 0.48
      ) {

        beginAutoFinish();

      }


      startLoop();

    }
  );


  /* ========================================================
     MOBILE TOUCH START
     ======================================================== */

  window.addEventListener(
    "touchstart",
    (event) => {

      if (completed) {

        return;

      }


      if (
        event.touches.length !== 1
      ) {

        return;

      }


      touchStartY =
        event.touches[0]
          .clientY;


      touchStartProgress =
        targetProgress;

    },
    {
      passive: true
    }
  );


  /* ========================================================
     MOBILE TOUCH MOVE
     ======================================================== */

  window.addEventListener(
    "touchmove",
    (event) => {

      if (completed) {

        return;

      }


      if (
        event.touches.length !== 1
      ) {

        return;

      }


      if (autoAnimating) {

        event.preventDefault();

        return;

      }


      event.preventDefault();


      const currentY =
        event.touches[0]
          .clientY;


      /*
       * Swipe upward:
       *
       * startY - currentY > 0
       *
       * means user is moving forward.
       */

      const deltaY =
        touchStartY -
        currentY;


      if (
        Math.abs(deltaY) < 2
      ) {

        return;

      }


      /*
       * Convert the complete swipe
       * into progress.
       */

      const step =
        clamp(
          Math.abs(deltaY) / 950,
          0,
          0.085
        );


      targetProgress =
        clamp(
          touchStartProgress +
          (
            deltaY > 0
              ? step
              : -step
          ),
          0,
          1
        );


      /*
       * Begin automatic zoom when
       * the & becomes dominant.
       */

      if (
        targetProgress >= 0.48
      ) {

        beginAutoFinish();

      }


      startLoop();

    },
    {
      passive: false
    }
  );


  /* ========================================================
     TOUCH END
     ======================================================== */

  window.addEventListener(
    "touchend",
    () => {

      touchStartY =
        null;

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    "touchcancel",
    () => {

      touchStartY =
        null;

    },
    {
      passive: true
    }
  );


  /* ========================================================
     AUTOMATIC FINAL ZOOM
     ======================================================== */

  function beginAutoFinish() {

    if (
      autoAnimating ||
      completed
    ) {

      return;

    }


    autoAnimating =
      true;


    const start =
      targetProgress;


    const startTime =
      performance.now();


    /*
     * Duration of the final cinematic
     * & zoom.
     */

    const duration =
      reducedMotion
        ? 200
        : 2600;


    function autoStep(
      now
    ) {

      const elapsed =
        now -
        startTime;


      const t =
        clamp(
          elapsed /
          duration,
          0,
          1
        );


      const eased =
        easeInOutCubic(
          t
        );


      targetProgress =
        start +
        (
          1 -
          start
        ) *
        eased;


      if (t < 1) {

        requestAnimationFrame(
          autoStep
        );

      } else {

        targetProgress = 1;

        autoAnimating = false;

      }


      startLoop();

    }


    requestAnimationFrame(
      autoStep
    );

  }


  /* ========================================================
     FINISH INTRO
     ======================================================== */

  function finishIntro() {

    if (completed) {

      return;

    }


    completed = true;


    progress = 1;

    targetProgress = 1;


    render();


    /*
     * Make invitation accessible.
     */

    invitation.setAttribute(
      "aria-hidden",
      "false"
    );


    intro.classList.add(
      "finished"
    );

    document.body.classList.remove(
      "intro-active"
    );

    requestAnimationFrame(() => {
      invitation.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });
    });

    setTimeout(
      () => {

        intro.style.display =
          "none";

      },
      700
    );

  }


  /* ========================================================
     RSVP BUTTON
     ======================================================== */

  const rsvpButton =
    document.getElementById(
      "rsvpButton"
    );


  if (rsvpButton) {

    rsvpButton.addEventListener(
      "click",
      () => {

        rsvpButton.textContent =
          "We can't wait to celebrate with you ♥";

      }
    );

  }


  /* ========================================================
     INITIAL STATE
     ======================================================== */

  if (reducedMotion) {

    targetProgress = 1;

    progress = 1;


    invitation.classList.add(
      "visible"
    );


    invitation.setAttribute(
      "aria-hidden",
      "false"
    );


    intro.classList.add(
      "finished"
    );


    document.body.classList.remove(
      "intro-active"
    );


    setTimeout(
      () => {

        intro.style.display =
          "none";

      },
      50
    );

  } else {

    render();

  }

})();


/* ========================================================
   PHOTO SCROLLER
   ======================================================== */

(() => {
  const card = document.getElementById("scrollerCard");
  const button = document.getElementById("scrollerClickBtn");
  const photos = Array.from(document.querySelectorAll(".scroller-strip-photo"));
  const revealStack = document.getElementById("scrollerRevealStack");
  const finalLine = document.getElementById("scrollerFinalLine");

  if (!card || !button || !revealStack || !finalLine) return;

  let isAnimating = false;
  let hasOpened = false;

  function openScroller() {
    if (isAnimating || hasOpened) return;

    isAnimating = true;
    hasOpened = true;
    button.classList.add("pressed");
    button.disabled = true;

    setTimeout(() => {
      card.classList.add("opening");
      button.classList.add("hidden");
    }, 120);

    setTimeout(() => {
      revealStack.classList.add("ready", "scrolling");
    }, 420);

    setTimeout(() => {
      revealStack.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 850);

    photos.forEach((photo, index) => {
      setTimeout(() => photo.classList.add("show"), 650 + index * 260);
    });

    setTimeout(() => {
      finalLine.classList.add("show");
      isAnimating = false;
    }, 650 + photos.length * 260 + 200);
  }

  button.addEventListener("click", openScroller);
})();


/* ========================================================
   SCRATCH REVEAL, COUNTDOWN AND DECORATIONS
   ======================================================== */

(() => {
  const card = document.getElementById("scratchCard");
  const canvas = document.getElementById("scratchCanvas");
  const countdown = document.getElementById("countdown");
  const particleCanvas = document.getElementById("particleCanvas");

  if (!card || !canvas || !countdown || !particleCanvas) return;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  const particleContext = particleCanvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targetDate = new Date("2026-12-19T00:00:00+05:30");
  const progressBar = document.getElementById("scratchProgressBar");
  const status = document.getElementById("scratchStatus");
  let scratching = false;
  let finished = false;
  let lastPoint = null;
  let countdownTimer = null;
  let scratchWidth = 0;
  let scratchHeight = 0;
  let particleWidth = 0;
  let particleHeight = 0;
  let particles = [];

  function sizeScratchCanvas() {
    const bounds = card.getBoundingClientRect();
    const density = Math.min(window.devicePixelRatio || 1, 2);
    scratchWidth = bounds.width;
    scratchHeight = bounds.height;
    canvas.width = scratchWidth * density;
    canvas.height = scratchHeight * density;
    canvas.style.width = `${scratchWidth}px`;
    canvas.style.height = `${scratchHeight}px`;
    context.setTransform(density, 0, 0, density, 0, 0);
    context.globalCompositeOperation = "source-over";
    const gradient = context.createLinearGradient(0, 0, scratchWidth, scratchHeight);
    gradient.addColorStop(0, "#72522d");
    gradient.addColorStop(.5, "#c9aa6b");
    gradient.addColorStop(1, "#80603a");
    context.fillStyle = gradient;
    context.fillRect(0, 0, scratchWidth, scratchHeight);
    context.fillStyle = "rgba(255,255,255,.1)";
    for (let index = 0; index < 600; index += 1) {
      context.fillRect(Math.random() * scratchWidth, Math.random() * scratchHeight, 1, 1);
    }
  }

  function getPoint(event) {
    const bounds = canvas.getBoundingClientRect();
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
  }

  function updateProgress() {
    const sample = 70;
    const sampleCanvas = document.createElement("canvas");
    sampleCanvas.width = sample;
    sampleCanvas.height = sample;
    const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
    sampleContext.drawImage(canvas, 0, 0, sample, sample);
    const pixels = sampleContext.getImageData(0, 0, sample, sample).data;
    let transparent = 0;
    for (let index = 3; index < pixels.length; index += 4) {
      if (pixels[index] < 80) transparent += 1;
    }
    const percentage = Math.round(transparent / (sample * sample) * 100);
    progressBar.style.width = `${percentage}%`;
    status.textContent = `${percentage}% revealed`;
    if (percentage >= 58) finishScratch();
  }

  function erase(from, to) {
    context.save();
    context.globalCompositeOperation = "destination-out";
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = window.innerWidth < 600 ? 52 : 64;
    context.beginPath();
    context.moveTo(from.x, from.y);
    context.lineTo(to.x, to.y);
    context.stroke();
    context.restore();
    updateProgress();
  }

  function startScratch(event) {
    if (finished) return;
    event.preventDefault();
    scratching = true;
    canvas.setPointerCapture?.(event.pointerId);
    lastPoint = getPoint(event);
    erase(lastPoint, lastPoint);
  }

  function moveScratch(event) {
    if (!scratching || finished) return;
    event.preventDefault();
    const point = getPoint(event);
    erase(lastPoint, point);
    lastPoint = point;
  }

  function endScratch() {
    scratching = false;
    lastPoint = null;
  }

  function updateCountdown() {
    let remaining = Math.max(0, targetDate.getTime() - Date.now()) / 1000;
    const days = Math.floor(remaining / 86400);
    remaining %= 86400;
    const hours = Math.floor(remaining / 3600);
    remaining %= 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = Math.floor(remaining % 60);
    [["days", days], ["hours", hours], ["minutes", minutes], ["seconds", seconds]].forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = String(value).padStart(2, "0");
    });
  }

  function finishScratch() {
    if (finished) return;
    finished = true;
    scratching = false;
    canvas.style.transition = "opacity .8s ease";
    canvas.style.opacity = "0";
    card.classList.add("scratched");
    countdown.classList.add("revealed");
    updateCountdown();
    countdownTimer = window.setInterval(updateCountdown, 1000);
    status.textContent = "The big day is revealed";
  }

  canvas.addEventListener("pointerdown", startScratch, { passive: false });
  canvas.addEventListener("pointermove", moveScratch, { passive: false });
  window.addEventListener("pointerup", endScratch, { passive: true });
  window.addEventListener("pointercancel", endScratch, { passive: true });
  new ResizeObserver(sizeScratchCanvas).observe(card);
  sizeScratchCanvas();

  const decorationCount = reducedMotion ? 0 : (window.innerWidth < 600 ? 16 : 30);
  const types = ["petal", "leaf", "butterfly", "spark"];

  function createParticle(randomY) {
    return {
      type: types[Math.floor(Math.random() * types.length)],
      x: Math.random() * particleWidth,
      y: randomY ? Math.random() * particleHeight : -20,
      size: 5 + Math.random() * 9,
      speed: .25 + Math.random() * .55,
      drift: .2 + Math.random() * .5,
      opacity: .25 + Math.random() * .45,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - .5) * .02,
      phase: Math.random() * Math.PI * 2
    };
  }

  function resizeParticles() {
    const density = Math.min(window.devicePixelRatio || 1, 2);
    particleWidth = window.innerWidth;
    particleHeight = window.innerHeight;
    particleCanvas.width = particleWidth * density;
    particleCanvas.height = particleHeight * density;
    particleCanvas.style.width = `${particleWidth}px`;
    particleCanvas.style.height = `${particleHeight}px`;
    particleContext.setTransform(density, 0, 0, density, 0, 0);
    particles = Array.from({ length: decorationCount }, () => createParticle(true));
  }

  function drawParticle(particle) {
    particleContext.save();
    particleContext.translate(particle.x, particle.y);
    particleContext.rotate(particle.rotation);
    particleContext.globalAlpha = particle.opacity;
    if (particle.type === "petal") {
      particleContext.fillStyle = "#e3b6b8";
      particleContext.beginPath();
      particleContext.ellipse(0, 0, particle.size * .55, particle.size, 0, 0, Math.PI * 2);
      particleContext.fill();
    } else if (particle.type === "leaf") {
      particleContext.fillStyle = "#9aa66f";
      particleContext.beginPath();
      particleContext.moveTo(0, -particle.size);
      particleContext.quadraticCurveTo(particle.size * 1.1, 0, 0, particle.size);
      particleContext.quadraticCurveTo(-particle.size * 1.1, 0, 0, -particle.size);
      particleContext.fill();
    } else if (particle.type === "butterfly") {
      const flap = .55 + .45 * Math.sin(particle.phase * 2);
      particleContext.fillStyle = "#c79ab2";
      particleContext.beginPath();
      particleContext.ellipse(-particle.size * .5, 0, particle.size * flap, particle.size * .75, 0, 0, Math.PI * 2);
      particleContext.ellipse(particle.size * .5, 0, particle.size * flap, particle.size * .75, 0, 0, Math.PI * 2);
      particleContext.fill();
      particleContext.fillStyle = "#4f2c3d";
      particleContext.fillRect(-.8, -particle.size * .55, 1.6, particle.size * 1.1);
    } else {
      particleContext.strokeStyle = "#d8b370";
      particleContext.lineWidth = .8;
      particleContext.beginPath();
      particleContext.moveTo(-particle.size, 0);
      particleContext.lineTo(particle.size, 0);
      particleContext.moveTo(0, -particle.size);
      particleContext.lineTo(0, particle.size);
      particleContext.stroke();
    }
    particleContext.restore();
  }

  function animateParticles() {
    particleContext.clearRect(0, 0, particleWidth, particleHeight);
    particles.forEach((particle) => {
      particle.phase += .03;
      particle.y += particle.speed;
      particle.x += Math.sin(particle.phase) * particle.drift;
      particle.rotation += particle.rotationSpeed;
      if (particle.y > particleHeight + 25) Object.assign(particle, createParticle(false));
      drawParticle(particle);
    });
    window.requestAnimationFrame(animateParticles);
  }

  resizeParticles();
  window.addEventListener("resize", resizeParticles, { passive: true });
  if (!reducedMotion) animateParticles();
})();