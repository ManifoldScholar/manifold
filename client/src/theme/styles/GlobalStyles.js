import rootVariables from "./variables";
import vendorStyles from "./vendor";
import baseStyles from "./base";
import componentStyles from "./components";
import utilityStyles from "./utility";
import { css } from '@emotion/react'

// import aStyles from "./a"
//
// export default  css`
//     ${aStyles}
// `;

export default css`
    ${rootVariables}
    ${vendorStyles}
    ${baseStyles}
    ${utilityStyles}
    ${componentStyles}
`;


