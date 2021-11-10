import { css } from "@linaria/core";
import rootVariables from "./variables";
import vendorStyles from "./vendor";
import baseStyles from "./base";
import componentStyles from "./components";
import utilityStyles from "./utility";

import aStyles from "./a"

const styles = css`
  :global() {
    ${aStyles}
  }
`;

// const styles = css`
//   :global() {
//     ${rootVariables}
//     ${vendorStyles}
//     ${baseStyles}
//     ${utilityStyles}
//     ${componentStyles}
//   }
// `;


