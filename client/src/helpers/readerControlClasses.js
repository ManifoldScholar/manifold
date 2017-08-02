import classNames from "classnames";

function readerClasses(colorScheme) {
  if (!colorScheme) return null;
  return classNames({
    "reader-window": true,
    "scheme-light": colorScheme === "light",
    "scheme-dark": colorScheme === "dark"
  });
}

// Font selection may be handled differently later, but for now, variants are based
// on class names
function textClasses(typography) {
  if (!typography.font || !typography.fontSize) return null;
  let out = classNames({
    "manifold-text-section text-section": true,
    "font-serif": typography.font === "serif",
    "font-sans-serif": typography.font === "sans-serif"
  });

  // Apply a font-size class to the text-section
  // This maps to a numbered class with responsive font declarations
  out += ` font-size-${typography.fontSize.current}`;
  return out;
}

// Apply a conditional container class that maps to a size in CSS
function containerClasses(margins) {
  if (!margins) return null;
  return `container-focus container-width-${margins.current}`;
}

export default { readerClasses, textClasses, containerClasses };
