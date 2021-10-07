import { createGlobalStyle } from "styled-components";
import rootVariables from "./variables";
import baseStyles from "./base";
import utilityStyles from "./utility";

const GlobalStyles = createGlobalStyle`
  ${rootVariables}
  ${baseStyles}
  ${utilityStyles}
`;

export default GlobalStyles;
