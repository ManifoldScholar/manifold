import { pad } from "./string";

export function timestamp(time) {
  const hours = pad(time.getHours(), 2);
  const minutes = pad(time.getMinutes(), 2);
  const seconds = pad(time.getSeconds(), 2);
  const milliseconds = pad(time.getMilliseconds(), 6);
  return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}
