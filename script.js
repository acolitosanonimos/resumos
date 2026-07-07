document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".tilt-title");
  const inner = title && title.querySelector(".tilt-inner");
  if (!title || !inner) return;

  title.addEventListener("mousemove", (event) => {
    const rect = title.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 34;
    const rotateX = (0.5 - y) * 34;
    inner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  });

  title.addEventListener("mouseleave", () => {
    inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
});
