import get from "lodash/get";
import { respondBase, fluidScaleBase } from "@castiron/style-mixins";
import { breakpoints } from "../variables/media";

// for replacing Sass `@include respond($break65 - 1, max)`
/* eslint-disable radix */
export function breakpointLessOne(value) {
  const breakpoint = get(breakpoints, value, value);
  return `${parseInt(breakpoint) - 1}px`;
}

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
