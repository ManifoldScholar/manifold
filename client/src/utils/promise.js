export function isPromise(val) {
  return val && typeof val.then === "function";
}
