export const hasLineBreak = str => str.match(/[\r\n]+/) !== null;

export const prependSpace = str => str && ` ${str.trim()}`;

const camelize = str => {
  return str.replace(/(?:^|[-])(\w)/g, (a, c) => {
    const cc = a.substring(0, 1) === "-" ? c.toUpperCase() : c;
    return cc || "";
  });
};

export const parseStyleCssText = value => {
  if (!value) return {};

  const styles = value.split(";");

  styles
    .map(s => {
      const [prop, val] = s.trim().split(":");
      return prop ? [camelize(prop), val] : null;
    })
    .reduce((obj, s) => ({ ...obj, [s[0]]: s[1] }), {});
};

export const styleToString = style => {
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      style[key] +
      ";",
    ""
  );
};

export const isEmptyObject = obj =>
  obj &&
  Object.keys(obj).length === 0 &&
  Object.getPrototypeOf(obj) === Object.prototype;

export const removeEmpty = obj => {
  return Object.fromEntries(
    Object.entries(obj).filter(([ignored, v]) => v != null)
  );
};

/**
 *
 * @param obj an object of any dimension
 * @param args property list to check
 * @returns undefined or property value
 */
export const getNested = (obj, ...args) => {
  return args.reduce((o, level) => o && o[level], obj);
};
