export const highlightDroppedEl = ({ element, selector }) => {
  if (!element && !selector) return;

  return setTimeout(() => {
    const el = element ?? document.querySelector(selector);
    if (!el) return;

    el.focus();
    el.scrollIntoView({ block: "center" });
    el.animate(
      [
        {
          outline: "2px solid var(--hover-color)"
        }
      ],
      {
        duration: 1250,
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1.0)",
        iterations: 1
      }
    );
  }, 750);
};
