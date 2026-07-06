document.addEventListener("DOMContentLoaded", () => {
  const zone = document.querySelector(".hero") || document.querySelector(".tilt-title");
  const inner = document.querySelector(".tilt-title .tilt-inner");
  if (!zone || !inner) return;

  zone.addEventListener("mousemove", (event) => {
    const rect = zone.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 90;
    const rotateX = (0.5 - y) * 90;
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.35) translateZ(50px)`;
  });

  zone.addEventListener("mouseleave", () => {
    inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)";
  });
});
