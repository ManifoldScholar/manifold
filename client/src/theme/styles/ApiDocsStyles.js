import { createGlobalStyle } from "styled-components";
import rootVariables from "./variables";
import vendorStyles from './vendor';
import baseStyles from "./base";
import utilityStyles from "./utility";

// TODO: update this to api docs styles
const ApiDocsStyles = createGlobalStyle`
  ${rootVariables}
  ${vendorStyles}
  ${baseStyles}
  ${utilityStyles}
`;

export default ApiDocsStyles;
