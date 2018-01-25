import isFunction from "lodash/isFunction";

export function closest(el, selector) {
  let output = el;
  let check;
  if (isFunction(selector)) {
    check = selector;
  } else {
    const matchesSelector =
      output.matches ||
      output.webkitMatchesSelector ||
      output.mozMatchesSelector ||
      output.msMatchesSelector;
    check = toCheck => {
      return matchesSelector.call(toCheck, selector);
    };
  }
  while (output) {
    if (check(output)) {
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
