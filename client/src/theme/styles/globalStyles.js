import { css } from "@emotion/react";
import fonts from "./base/fonts";
import rootVariables from "./variables";
import vendorStyles from "./vendor";
import baseStyles from "./base";
import componentStyles from "./components";
import utilityStyles from "./utility";
import printStyles from "./print";

export default css`
  @layer manifold, stylesheets;

  @layer manifold {
    ${fonts}
    ${rootVariables}
  ${vendorStyles}
  ${baseStyles}
  ${utilityStyles}
  ${componentStyles}
  ${printStyles}
  }
`;
