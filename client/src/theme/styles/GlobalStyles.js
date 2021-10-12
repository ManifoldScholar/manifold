import { createGlobalStyle } from "styled-components";
import rootVariables from "./variables";
import vendorStyles from "./vendor";
import baseStyles from "./base";
import componentStyles from "./components";
import utilityStyles from "./utility";

const GlobalStyles = createGlobalStyle`
  ${rootVariables}
  ${vendorStyles}
  ${baseStyles}
  ${componentStyles}
  ${utilityStyles}
`;

export default GlobalStyles;
