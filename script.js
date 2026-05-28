document.addEventListener("DOMContentLoaded", () => {
  // --- Scroll Animations ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  document.querySelectorAll(".fade-up").forEach((el) => {
    observer.observe(el);
  });

  // --- Background Particle System ---
  const bgCanvas = document.getElementById("particles-bg");
  const bgCtx = bgCanvas.getContext("2d");
  let particles = [];

  function resizeBgCanvas() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeBgCanvas);
  resizeBgCanvas();

  class Particle {
    constructor() {
      this.x = Math.random() * bgCanvas.width;
      this.y = Math.random() * bgCanvas.height;
      this.size = Math.random() * 2;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0) this.x = bgCanvas.width;
      if (this.x > bgCanvas.width) this.x = 0;
      if (this.y < 0) this.y = bgCanvas.height;
      if (this.y > bgCanvas.height) this.y = 0;
    }
    draw() {
      bgCtx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      bgCtx.beginPath();
      bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      bgCtx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const numParticles = Math.floor(window.innerWidth / 10);
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // Draw connecting lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          bgCtx.beginPath();
          bgCtx.strokeStyle = `rgba(110, 231, 183, ${0.1 - distance / 1000})`;
          bgCtx.lineWidth = 0.5;
          bgCtx.moveTo(particles[i].x, particles[i].y);
          bgCtx.lineTo(particles[j].x, particles[j].y);
          bgCtx.stroke();
        }
      }
    }

    requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // --- Jogo de Constelações (Drag and Drop) ---
  const dropzoneContainer = document.getElementById("dropzone-container");
  const starsBank = document.getElementById("stars-bank");
  const selectConstellation = document.getElementById("constellation-select");
  const resetBtn = document.getElementById("reset-btn");
  const successMessage = document.getElementById("success-message");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener("click", () => {
      const opened = navLinks.classList.toggle("open");
      mobileMenuToggle.setAttribute("aria-expanded", opened);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768 && navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Create canvas for drawing lines
  const canvas = document.createElement("canvas");
  canvas.id = "lines-canvas";
  if (dropzoneContainer) dropzoneContainer.appendChild(canvas);
  const ctx = canvas ? canvas.getContext("2d") : null;

  // Resize canvas to match container
  function resizeCanvas() {
    if (canvas && dropzoneContainer) {
      canvas.width = dropzoneContainer.clientWidth;
      canvas.height = dropzoneContainer.clientHeight;
      drawLines();
    }
  }
  window.addEventListener("resize", resizeCanvas);

  const constellationsData = {
    orion: {
      stars: [
        { id: "o1", name: "Betelgeuse", x: 25, y: 25 },
        { id: "o2", name: "Bellatrix", x: 70, y: 30 },
        { id: "o3", name: "Meissa", x: 50, y: 15 },
        { id: "o4", name: "Alnitak", x: 42, y: 50 },
        { id: "o5", name: "Alnilam", x: 50, y: 48 },
        { id: "o6", name: "Mintaka", x: 58, y: 46 },
        { id: "o7", name: "Saiph", x: 35, y: 80 },
        { id: "o8", name: "Rigel", x: 70, y: 75 },
        { id: "o9", name: "Pi3 Ori", x: 85, y: 35 },
        { id: "o10", name: "Pi4 Ori", x: 82, y: 50 },
        { id: "o11", name: "Pi5 Ori", x: 75, y: 60 },
      ],
      lines: [
        ["o3", "o1"],
        ["o3", "o2"],
        ["o1", "o4"],
        ["o2", "o6"],
        ["o4", "o5"],
        ["o5", "o6"],
        ["o4", "o7"],
        ["o6", "o8"],
        ["o2", "o9"],
        ["o9", "o10"],
        ["o10", "o11"],
      ],
    },
    ursa_major: {
      stars: [
        { id: "u1", name: "Alkaid", x: 80, y: 30 },
        { id: "u2", name: "Mizar", x: 60, y: 40 },
        { id: "u3", name: "Alioth", x: 45, y: 55 },
        { id: "u4", name: "Megrez", x: 40, y: 70 },
        { id: "u5", name: "Phecda", x: 20, y: 80 },
        { id: "u6", name: "Merak", x: 15, y: 60 },
        { id: "u7", name: "Dubhe", x: 35, y: 50 },
      ],
      lines: [
        ["u1", "u2"],
        ["u2", "u3"],
        ["u3", "u4"],
        ["u4", "u5"],
        ["u5", "u6"],
        ["u6", "u7"],
        ["u7", "u4"],
      ],
    },
    cruzeiro_sul: {
      stars: [
        { id: "c1", name: "Rubídea", x: 50, y: 20 },
        { id: "c2", name: "Est. de Magalhães", x: 50, y: 80 },
        { id: "c3", name: "Mimosa", x: 20, y: 45 },
        { id: "c4", name: "Pálida", x: 80, y: 45 },
        { id: "c5", name: "Intrometida", x: 65, y: 65 },
      ],
      lines: [
        ["c1", "c2"],
        ["c3", "c4"],
      ],
    },
    escorpiao: {
      stars: [
        { id: "e1", name: "Graffias", x: 70, y: 15 },
        { id: "e2", name: "Dschubba", x: 60, y: 25 },
        { id: "e3", name: "Pi Scorpii", x: 55, y: 35 },
        { id: "e4", name: "Antares", x: 50, y: 45 },
        { id: "e5", name: "Wei", x: 45, y: 60 },
        { id: "e6", name: "Zeta", x: 30, y: 75 },
        { id: "e7", name: "Sargas", x: 45, y: 85 },
        { id: "e8", name: "Shaula", x: 65, y: 80 },
        { id: "e9", name: "Lesath", x: 70, y: 75 },
      ],
      lines: [
        ["e1", "e2"],
        ["e2", "e3"],
        ["e3", "e4"],
        ["e4", "e5"],
        ["e5", "e6"],
        ["e6", "e7"],
        ["e7", "e8"],
        ["e8", "e9"],
      ],
    },
  };

  let currentConstellation = "orion";
  let placedStars = {};

  function initGame() {
    if (!dropzoneContainer) return;

    successMessage.classList.add("hidden");
    placedStars = {};

    document.querySelectorAll(".dropzone").forEach((el) => el.remove());
    starsBank.innerHTML = "";

    const data = constellationsData[currentConstellation];

    data.stars.forEach((star) => {
      const dropzone = document.createElement("div");
      dropzone.classList.add("dropzone");
      dropzone.dataset.id = star.id;
      dropzone.style.left = `${star.x}%`;
      dropzone.style.top = `${star.y}%`;

      const dropzoneLabel = document.createElement("span");
      dropzoneLabel.classList.add("dropzone-label");
      dropzoneLabel.textContent = star.name;
      dropzone.appendChild(dropzoneLabel);

      dropzoneContainer.appendChild(dropzone);
    });

    let starsToCreate = [...data.stars].sort(() => Math.random() - 0.5);

    starsToCreate.forEach((star, index) => {
      const starEl = document.createElement("div");
      starEl.classList.add("star");
      starEl.dataset.targetId = star.id;
      starEl.id = `draggable-${index}`;

      const starLabel = document.createElement("span");
      starLabel.classList.add("star-label");
      starLabel.textContent = star.name;
      starEl.appendChild(starLabel);

      starEl.addEventListener("pointerdown", pointerStart, { passive: false });

      starsBank.appendChild(starEl);
    });

    resizeCanvas();
  }

  let touchDragStar = null;
  let activePointerId = null;
  let pointerActive = false;
  let dragStarSize = { width: 0, height: 0 };
  let dragContainer = null;
  let containerRect = null;

  function resetStarPosition(starEl) {
    starEl.classList.remove("dragging");
    starEl.style.position = "";
    starEl.style.left = "";
    starEl.style.top = "";
    starEl.style.transform = "";
    starEl.style.zIndex = "";
    starEl.style.pointerEvents = "";

    if (!starEl.classList.contains("placed")) {
      starsBank.appendChild(starEl);
    }
  }

  function finalizeStarPlacement(starEl, dropzone) {
    dropzone.appendChild(starEl);
    dropzone.classList.add("filled");
    starEl.classList.add("placed");
    starEl.setAttribute("draggable", "false");
    starEl.style.cursor = "default";
    starEl.style.position = "";
    starEl.style.left = "";
    starEl.style.top = "";
    starEl.style.transform = "";
    starEl.style.zIndex = "";
    starEl.style.pointerEvents = "";

    placedStars[dropzone.dataset.id] = true;
    drawLines();
    checkWin();
  }

  function getDropzoneAtPoint(clientX, clientY) {
    const target = document.elementFromPoint(clientX, clientY);
    return target ? target.closest(".dropzone") : null;
  }

  function pointerStart(e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (this.classList.contains("placed")) return;

    e.preventDefault();
    touchDragStar = this;
    activePointerId = e.pointerId;
    pointerActive = true;
    touchDragStar.classList.add("dragging");
    touchDragStar.style.zIndex = "1000";
    touchDragStar.style.pointerEvents = "none";

    dragContainer =
      document.querySelector(".game-section") || dropzoneContainer;
    containerRect = dragContainer.getBoundingClientRect();
    const starRect = touchDragStar.getBoundingClientRect();
    dragStarSize.width = starRect.width;
    dragStarSize.height = starRect.height;

    const x = e.clientX - containerRect.left - dragStarSize.width / 2;
    const y = e.clientY - containerRect.top - dragStarSize.height / 2;

    console.log({
      clientX: e.clientX,
      clientY: e.clientY,
      rectLeft: containerRect.left,
      rectTop: containerRect.top,
      finalX: x,
      finalY: y,
      container: dragContainer.id || dragContainer.className,
    });

    dragContainer.appendChild(touchDragStar);
    touchDragStar.style.position = "absolute";
    touchDragStar.style.left = `${x}px`;
    touchDragStar.style.top = `${y}px`;
    touchDragStar.style.transform = "translate(0, 0)";

    if (touchDragStar.setPointerCapture) {
      touchDragStar.setPointerCapture(activePointerId);
    }

    document.addEventListener("pointermove", pointerMove, { passive: false });
    document.addEventListener("pointerup", pointerEnd, { passive: false });
    document.addEventListener("pointercancel", pointerEnd, { passive: false });
  }

  function pointerMove(e) {
    if (!pointerActive || !touchDragStar || e.pointerId !== activePointerId)
      return;
    e.preventDefault();

    if (!containerRect) {
      containerRect = dragContainer
        ? dragContainer.getBoundingClientRect()
        : dropzoneContainer.getBoundingClientRect();
    }

    const x = e.clientX - containerRect.left - dragStarSize.width / 2;
    const y = e.clientY - containerRect.top - dragStarSize.height / 2;

    console.log({
      clientX: e.clientX,
      clientY: e.clientY,
      rectLeft: containerRect.left,
      rectTop: containerRect.top,
      finalX: x,
      finalY: y,
    });

    touchDragStar.style.left = `${x}px`;
    touchDragStar.style.top = `${y}px`;

    const currentDropzone = getDropzoneAtPoint(e.clientX, e.clientY);
    document.querySelectorAll(".dropzone").forEach((zone) => {
      zone.classList.toggle("highlight", zone === currentDropzone);
    });
  }

  function pointerEnd(e) {
    if (!pointerActive || !touchDragStar || e.pointerId !== activePointerId)
      return;

    if (touchDragStar.releasePointerCapture) {
      touchDragStar.releasePointerCapture(activePointerId);
    }

    document.removeEventListener("pointermove", pointerMove);
    document.removeEventListener("pointerup", pointerEnd);
    document.removeEventListener("pointercancel", pointerEnd);

    const dropzone = getDropzoneAtPoint(e.clientX, e.clientY);
    const starEl = touchDragStar;

    touchDragStar = null;
    pointerActive = false;
    activePointerId = null;
    containerRect = null;
    dragContainer = null;

    document.querySelectorAll(".dropzone").forEach((zone) => {
      zone.classList.remove("highlight");
    });

    if (
      dropzone &&
      dropzone.dataset.id === starEl.dataset.targetId &&
      !dropzone.classList.contains("filled")
    ) {
      finalizeStarPlacement(starEl, dropzone);
    } else {
      resetStarPosition(starEl);
    }
  }

  function drawLines() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const data = constellationsData[currentConstellation];
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    data.lines.forEach((line) => {
      const [id1, id2] = line;
      const star1 = data.stars.find((s) => s.id === id1);
      const star2 = data.stars.find((s) => s.id === id2);

      if (placedStars[id1] && placedStars[id2]) {
        ctx.strokeStyle = "rgba(110, 231, 183, 0.8)";
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
      } else {
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
      }

      const x1 = (star1.x / 100) * canvas.width;
      const y1 = (star1.y / 100) * canvas.height;
      const x2 = (star2.x / 100) * canvas.width;
      const y2 = (star2.y / 100) * canvas.height;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    });
  }

  function checkWin() {
    const totalStars = constellationsData[currentConstellation].stars.length;
    if (Object.keys(placedStars).length === totalStars) {
      successMessage.classList.remove("hidden");
    }
  }

  if (selectConstellation) {
    selectConstellation.addEventListener("change", (e) => {
      currentConstellation = e.target.value;
      initGame();
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", initGame);
  }

  // Start game
  setTimeout(initGame, 100);

  // --- Mapa de Observação Passiva (Hover) ---
  const hoverCanvas = document.getElementById("hover-sky-map");
  if (hoverCanvas) {
    const hoverCtx = hoverCanvas.getContext("2d");
    const tooltip = document.getElementById("star-tooltip");
    const ttName = document.getElementById("tt-name");
    const ttConst = document.getElementById("tt-constellation");

    function resizeHoverCanvas() {
      const container = hoverCanvas.parentElement;
      hoverCanvas.width = container.clientWidth;
      hoverCanvas.height = container.clientHeight;
      drawHoverMap();
    }
    window.addEventListener("resize", resizeHoverCanvas);

    const hoverData = [
      {
        id: "cassiopeia",
        name: "Cassiopeia",
        offset: { x: 20, y: 30 },
        stars: [
          { name: "Epsilon Cas", x: 10, y: 20 },
          { name: "Delta Cas", x: 30, y: 40 },
          { name: "Gamma Cas", x: 50, y: 10 },
          { name: "Alpha Cas", x: 70, y: 50 },
          { name: "Beta Cas", x: 90, y: 20 },
        ],
        lines: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ],
      },
      {
        id: "leao",
        name: "Leão",
        offset: { x: 10, y: 0 },
        stars: [
          { name: "Denebola", x: 10, y: 65 }, // 0
          { name: "Zosma", x: 30, y: 42 }, // 1
          { name: "Chertan", x: 28, y: 65 }, // 2
          { name: "Regulus", x: 68, y: 78 }, // 3
          { name: "Eta Leonis", x: 66, y: 60 }, // 4
          { name: "Algieba", x: 60, y: 48 }, // 5
          { name: "Adhafera", x: 62, y: 32 }, // 6
          { name: "Rasalas", x: 75, y: 20 }, // 7
          { name: "Epsilon Leonis", x: 82, y: 28 }, // 8
        ],
        lines: [
          [0, 1],
          [0, 2],
          [1, 2], // Triângulo da cauda
          [1, 5],
          [2, 3], // Corpo
          [3, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [7, 8], // Foice (Cabeça)
        ],
      },
    ];

    let mappedHoverStars = [];
    hoverData.forEach((constell) => {
      const ox = constell.offset ? constell.offset.x : 0;
      const oy = constell.offset ? constell.offset.y : 0;

      constell.stars.forEach((star, index) => {
        mappedHoverStars.push({
          ...star,
          px: star.x + ox,
          py: star.y + oy,
          constellationId: constell.id,
          constellationName: constell.name,
          index: index,
        });
      });
    });

    let activeHoverConstellation = null;

    function drawHoverMap() {
      hoverCtx.clearRect(0, 0, hoverCanvas.width, hoverCanvas.height);

      // Draw lines
      hoverData.forEach((constell) => {
        const isHovered = activeHoverConstellation === constell.id;
        hoverCtx.strokeStyle = isHovered
          ? "rgba(110, 231, 183, 0.8)"
          : "rgba(255, 255, 255, 0.15)";
        hoverCtx.lineWidth = isHovered ? 2 : 1;

        if (!isHovered) {
          hoverCtx.setLineDash([5, 5]);
        } else {
          hoverCtx.setLineDash([]);
        }

        const ox = constell.offset ? constell.offset.x : 0;
        const oy = constell.offset ? constell.offset.y : 0;

        constell.lines.forEach((line) => {
          const s1 = constell.stars[line[0]];
          const s2 = constell.stars[line[1]];

          const x1 = ((s1.x + ox) / 100) * hoverCanvas.width;
          const y1 = ((s1.y + oy) / 100) * hoverCanvas.height;
          const x2 = ((s2.x + ox) / 100) * hoverCanvas.width;
          const y2 = ((s2.y + oy) / 100) * hoverCanvas.height;

          hoverCtx.beginPath();
          hoverCtx.moveTo(x1, y1);
          hoverCtx.lineTo(x2, y2);
          hoverCtx.stroke();
        });
      });

      // Draw stars
      mappedHoverStars.forEach((star) => {
        const x = (star.px / 100) * hoverCanvas.width;
        const y = (star.py / 100) * hoverCanvas.height;
        const isHovered = activeHoverConstellation === star.constellationId;

        hoverCtx.beginPath();
        hoverCtx.arc(x, y, isHovered ? 5 : 3, 0, Math.PI * 2);
        hoverCtx.fillStyle = isHovered ? "#6ee7b7" : "#ffffff";
        hoverCtx.fill();

        if (isHovered) {
          hoverCtx.shadowBlur = 15;
          hoverCtx.shadowColor = "#6ee7b7";
          hoverCtx.fill();
          hoverCtx.shadowBlur = 0; // reset
        }
      });
    }

    setTimeout(resizeHoverCanvas, 100);
    let tooltipTimeout;

    function handleHoverEvent(e) {
      if (e.cancelable) e.preventDefault();
      const rect = hoverCanvas.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX == null || clientY == null) return;

      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;
      let found = false;

      for (let star of mappedHoverStars) {
        const sx = (star.px / 100) * hoverCanvas.width;
        const sy = (star.py / 100) * hoverCanvas.height;
        const dist = Math.hypot(mouseX - sx, mouseY - sy);

        if (dist < 18) {
          activeHoverConstellation = star.constellationId;
          tooltip.style.left = `${mouseX}px`;
          tooltip.style.top = `${mouseY}px`;
          ttName.textContent = star.name;
          ttConst.textContent = star.constellationName;
          tooltip.classList.remove("hidden");
          found = true;
          break;
        }
      }

      if (!found) {
        activeHoverConstellation = null;
        tooltip.classList.add("hidden");
      }

      drawHoverMap();

      if (e.type === "pointerdown" && found) {
        clearTimeout(tooltipTimeout);
        tooltipTimeout = setTimeout(() => {
          activeHoverConstellation = null;
          tooltip.classList.add("hidden");
          drawHoverMap();
        }, 1800);
      }
    }

    hoverCanvas.addEventListener("pointermove", handleHoverEvent);
    hoverCanvas.addEventListener("pointerdown", handleHoverEvent);

    hoverCanvas.addEventListener("pointerleave", () => {
      activeHoverConstellation = null;
      tooltip.classList.add("hidden");
      drawHoverMap();
    });
  }
});
