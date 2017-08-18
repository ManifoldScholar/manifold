export function closest(el, selector) {
  let output = el;
  const matchesSelector =
    output.matches ||
    output.webkitMatchesSelector ||
    output.mozMatchesSelector ||
    output.msMatchesSelector;
  while (output) {
    if (matchesSelector.call(output, selector)) {
      break;
    }
    output = output.parentElement;
  }
  return output;
}

/* eslint-disable no-empty */
export function detectPassiveEventOptionsSupport() {
  if (!window && window.addEventListener) return false;
  let passiveSupported = false;
  try {
    const options = Object.defineProperty({}, "passive", {
      get() {
        passiveSupported = true;
      }
    });
    window.addEventListener("test", null, options);
  } catch (err) {}
  return passiveSupported;
}
/* eslint-enable no-empty */

export function scrollOptions(passive = true) {
  return detectPassiveEventOptionsSupport() ? { passive } : false;
}
