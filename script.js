document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".tilt-title");
  const inner = title?.querySelector(".tilt-inner");
  if (!title || !inner) return;

  let rotationX = 0;
  let rotationY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let isDragging = false;
  let frameId = 0;

  const render = () => {
    inner.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
  };

  const stopMomentum = () => {
    if (!frameId) return;
    cancelAnimationFrame(frameId);
    frameId = 0;
  };

  const glide = () => {
    rotationX += velocityX;
    rotationY += velocityY;
    velocityX *= 0.975;
    velocityY *= 0.975;
    render();

    if (Math.abs(velocityX) < 0.02 && Math.abs(velocityY) < 0.02) {
      frameId = 0;
      return;
    }

    frameId = requestAnimationFrame(glide);
  };

  const startMomentum = () => {
    stopMomentum();
    frameId = requestAnimationFrame(glide);
  };

  title.addEventListener("pointerdown", (event) => {
    isDragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();
    velocityX = 0;
    velocityY = 0;
    stopMomentum();
    title.classList.add("is-dragging");
    title.setPointerCapture(event.pointerId);
  });

  title.addEventListener("pointermove", (event) => {
    if (!isDragging) return;

    const now = performance.now();
    const elapsed = Math.max(now - lastTime, 16);
    const deltaX = event.clientX - lastX;
    const deltaY = event.clientY - lastY;

    rotationY += deltaX * 0.75;
    rotationX -= deltaY * 0.75;
    velocityY = (deltaX / elapsed) * 18;
    velocityX = (-deltaY / elapsed) * 18;

    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
    render();
  });

  const finishDrag = (event) => {
    if (!isDragging) return;

    isDragging = false;
    title.classList.remove("is-dragging");
    title.releasePointerCapture(event.pointerId);
    startMomentum();
  };

  title.addEventListener("pointerup", finishDrag);
  title.addEventListener("pointercancel", finishDrag);
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
