document.addEventListener("DOMContentLoaded", () => {
  const setupRotator = (control, target, options) => {
    if (!control || !target) return;

    let rotationX = 0;
    let rotationY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let lastX = 0;
    let lastY = 0;
    let startX = 0;
    let startY = 0;
    let lastTime = 0;
    let isDragging = false;

    const render = () => {
      target.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    };

    const animate = () => {
      if (!isDragging) {
        rotationY += options.idleY;
        rotationX += velocityX;
        rotationY += velocityY;
        velocityX *= options.friction;
        velocityY *= options.friction;

        if (Math.abs(velocityX) < 0.006) velocityX = 0;
        if (Math.abs(velocityY) < 0.006) velocityY = 0;
      }

      render();
      requestAnimationFrame(animate);
    };

    control.addEventListener("pointerdown", (event) => {
      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;
      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = performance.now();
      velocityX = 0;
      velocityY = 0;
      control.classList.add("is-dragging");
      control.setPointerCapture(event.pointerId);
    });

    control.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      const now = performance.now();
      const elapsed = Math.max(now - lastTime, 16);
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;

      rotationY += deltaX * options.dragScale;
      rotationX -= deltaY * options.dragScale;
      velocityY = (deltaX / elapsed) * options.throwScale;
      velocityX = (-deltaY / elapsed) * options.throwScale;

      lastX = event.clientX;
      lastY = event.clientY;
      lastTime = now;
      render();
    });

    const finishDrag = (event) => {
      if (!isDragging) return;

      const travel = Math.hypot(event.clientX - startX, event.clientY - startY);
      isDragging = false;
      control.classList.remove("is-dragging");
      control.releasePointerCapture(event.pointerId);

      if (travel < 6) {
        velocityY += options.clickBoostY;
      }
    };

    control.addEventListener("pointerup", finishDrag);
    control.addEventListener("pointercancel", finishDrag);
    animate();
  };

  const title = document.querySelector(".tilt-title");
  setupRotator(title, title?.querySelector(".tilt-inner"), {
    clickBoostY: 0,
    dragScale: 0.75,
    friction: 0.9982,
    idleY: 0.07,
    throwScale: 26
  });

  const logo = document.querySelector(".hero-logo-button");
  setupRotator(logo, logo?.querySelector(".hero-logo"), {
    clickBoostY: 8,
    dragScale: 0.85,
    friction: 0.985,
    idleY: 0.14,
    throwScale: 20
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button[data-tab]");
  const panels = document.querySelectorAll(".tab-panel[data-panel]");
  if (!tabButtons.length || !panels.length) return;

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tab;

      tabButtons.forEach((b) => {
        b.classList.toggle("active", b === button);
        b.setAttribute("aria-selected", b === button ? "true" : "false");
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.panel === target);
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const modeButtons = document.querySelectorAll(".manual-mode-option");
  if (!modeButtons.length) return;

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      modeButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const manual = document.querySelector(".manual-page");
  if (!manual) return;

  manual.querySelectorAll(".article section").forEach((section) => {
    const heading = section.querySelector("h2");
    if (!heading) return;

    heading.setAttribute("role", "button");
    heading.setAttribute("tabindex", "0");
    heading.setAttribute("aria-expanded", "true");

    const toggleSection = () => {
      const isCollapsed = section.classList.toggle("is-collapsed");
      heading.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
    };

    heading.addEventListener("click", toggleSection);
    heading.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      toggleSection();
    });
  });

  manual.querySelectorAll(".step").forEach((step) => {
    const marker = step.querySelector(".step-marker");
    const label = marker ? marker.textContent.trim() : "item";
    const button = document.createElement("button");
    button.className = "manual-step-toggle";
    button.type = "button";
    button.textContent = "−";
    button.setAttribute("aria-expanded", "true");
    button.setAttribute("aria-label", "Fechar item " + label);

    button.addEventListener("click", () => {
      const isCollapsed = step.classList.toggle("is-collapsed");
      button.textContent = isCollapsed ? "+" : "−";
      button.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
      button.setAttribute("aria-label", (isCollapsed ? "Abrir item " : "Fechar item ") + label);
    });

    step.appendChild(button);
  });
});
