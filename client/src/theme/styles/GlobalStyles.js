import { createGlobalStyle } from "styled-components";
import rootVariables from "./variables";
import vendorStyles from "./vendor";
import baseStyles from "./base";
import utilityStyles from "./utility";

const GlobalStyles = createGlobalStyle`
  ${rootVariables}
  ${vendorStyles}
  ${baseStyles}
  ${utilityStyles}
`;

export default GlobalStyles;
