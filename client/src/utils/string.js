const isString = require("lodash/isString");

export function repeat(str, times) {
  return new Array(times + 1).join(str);
}

export function pad(aString, maxLength, padWith = "0", padLeft = true) {
  const toPad =
    typeof aString.toString === "function" ? aString.toString() : aString;
  const padding = repeat(padWith, maxLength - toPad.length);
  if (padLeft) {
    return padding + toPad;
  }
  return toPad + padding;
}

export function possessivize(str) {
  let out;
  if (isString(str)) {
    out = str.trim();
    out = out.toLowerCase().slice(-1) === "s" ? out + "'" : out + "'s";
  }
  return out;
}

// Thanks, darkskyapp
// https://github.com/darkskyapp/string-hash/blob/master/index.js
export function hash(str) {
  let out = 5381;
  let i = str.length;
  while (i) {
    out = (out * 33) ^ str.charCodeAt(--i);
  }
  return out >>> 0;
}

export function capitalize(s, all = false) {
  if (all) {
    return s
      .split(" ")
      .map(capitalize)
      .join(" ");
  }
  return s && s[0].toUpperCase() + s.slice(1);
}

export default {
  repeat,
  pad,
  possessivize,
  hash,
  capitalize
};
