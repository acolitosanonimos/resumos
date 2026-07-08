document.addEventListener("DOMContentLoaded", () => {
  const zone = document.querySelector(".hero") || document.querySelector(".tilt-title");
  const inner = document.querySelector(".tilt-title .tilt-inner");
  if (!zone || !inner) return;

  const tiltTo = (clientX, clientY) => {
    const rect = zone.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 90;
    const rotateX = (0.5 - y) * 90;
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.35) translateZ(50px)`;
  };

  const resetTilt = () => {
    inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)";
  };

  zone.addEventListener("mousemove", (event) => tiltTo(event.clientX, event.clientY));
  zone.addEventListener("mouseleave", resetTilt);

  zone.addEventListener(
    "touchmove",
    (event) => {
      const touch = event.touches[0];
      if (!touch) return;
      tiltTo(touch.clientX, touch.clientY);
    },
    { passive: true }
  );
  zone.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    tiltTo(touch.clientX, touch.clientY);
  });
  zone.addEventListener("touchend", resetTilt);
  zone.addEventListener("touchcancel", resetTilt);
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
