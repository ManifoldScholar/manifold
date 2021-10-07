import { respondBase, fluidScaleBase } from "@castiron/style-mixins";
import { breakpoints } from "../variables/media";
import get from "lodash/get";

export function respond(content, size, operator = "min", aspect = "width") {
  const pxSize = get(breakpoints, size, size);
  return respondBase(content, pxSize, operator, aspect);
}

export function fluidScale(max, min, maxVw, minVw) {
  const scaleMax = get(breakpoints, 95, maxVw);
  const scaleMin = get(breakpoints, 60, minVw);
  if (max === min) return max;
  return fluidScaleBase(max, min, scaleMax, scaleMin);
}
