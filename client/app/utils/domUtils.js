import { flushSync as reactDomFlushSync } from "react-dom";
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

export const doViewTransition = (callback, options) => {
  if (!document.startViewTransition) {
    callback();
    return { finished: Promise.resolve() };
  }
  return document.startViewTransition(() => {
    if (options?.flushSync) {
      // https://malcolmkee.com/blog/view-transition-api-in-react-app/#usage-view-transition-api-with-react
      reactDomFlushSync(() => {
        callback();
      });
    } else {
      callback();
    }
  });
};
