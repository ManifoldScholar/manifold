export function repeat(str, times) {
  return new Array(times + 1).join(str);
}

export function pad(aString, maxLength, padWith = '0') {
  const toPad = typeof aString.toString === 'function' ? aString.toString() : aString;
  return repeat(padWith, maxLength - toPad.length) + toPad;
}
