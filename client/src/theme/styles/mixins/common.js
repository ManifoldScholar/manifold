import { respondBase } from "@castiron/style-mixins";
import { breakpoints } from "../variables/media";
import get from "lodash/get";

export function respond(content, size, operator = "min", aspect = "width") {
  const pxSize = get(breakpoints, size, size);
  return respondBase(content, pxSize, operator, aspect);
}
