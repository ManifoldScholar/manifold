export const highlightNewEl = ({ selector }) => {
  if (!selector) return;

  return setTimeout(() => {
    const el = document.querySelector(selector);
    if (!el) return;

    el.focus();
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
  }, 100);
};

export const highlightDroppedEl = ({ element }) => {
  if (!element) return;

  element.focus();
  element.animate(
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
};
