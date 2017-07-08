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
