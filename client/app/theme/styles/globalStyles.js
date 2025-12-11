import { css } from "@emotion/react";
import fonts from "./base/fonts";
import rootVariables from "./variables";
import vendorStyles from "./vendor";
import baseStyles from "./base";
import componentStyles from "./components";
import utilityStyles from "./utility";
import printStyles from "./print";
import rteStyles from "./utility/rte";

export default css`
@layer manifold, custom-styles, editor;

@layer manifold {
  ${fonts}
  ${rootVariables}
  ${vendorStyles}
  ${baseStyles}
  ${utilityStyles}
  ${componentStyles}
  ${printStyles}
}

@layer editor {
  ${rteStyles}
}
`;
