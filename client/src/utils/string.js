export function repeat(str, times) {
  return new Array(times + 1).join(str);
}

export function pad(aString, maxLength, padWith = '0', padLeft = true) {
  const toPad = typeof aString.toString === 'function' ? aString.toString() : aString;
  const padding = repeat(padWith, maxLength - toPad.length);
  if (padLeft) {
    return padding + toPad;
  }
  return toPad + padding;
}
