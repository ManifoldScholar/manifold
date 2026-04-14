// Reworked from https://github.com/cferdinandi/smooth-scroll

const getTop = element => {
  if (element.nodeName === "HTML") return -window.pageYOffset;
  return element.getBoundingClientRect().top + window.pageYOffset;
};

const easeInOutCubic = t => {
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
};

const position = (start, end, elapsed, duration) => {
  if (elapsed > duration) return end;
  return start + (end - start) * easeInOutCubic(elapsed / duration);
};

export default function smoothScroll(
  el,
  offset = 0,
  duration,
  callback,
  context
) {
  if (!el) return null;
  const adjustedDuration = duration || 500;
  const adjustedContext = context || window;
  const start = window.pageYOffset;

  let end;
  if (typeof el === "number") {
    end = parseInt(el, 10);
  } else {
    end = getTop(el);
  }
  end -= offset;
  const clock = Date.now();
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    function delay(fn) {
      window.setTimeout(fn, 15);
    };

  function step() {
    const elapsed = Date.now() - clock;
    if (adjustedContext !== window) {
      adjustedContext.scrollTop = position(
        start,
        end,
        elapsed,
        adjustedDuration
      );
    } else {
      window.scroll(0, position(start, end, elapsed, adjustedDuration));
    }

    if (elapsed > adjustedDuration) {
      if (typeof callback === "function") {
        callback(el);
      }
    } else {
      requestAnimationFrame(step);
    }
  }
  step();
}
