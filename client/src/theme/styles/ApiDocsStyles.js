import { css } from "@linaria/core";
import rootVariables from "./variables";
import baseStyles from "./base";
import utilityStyles from "./utility";
import apiDocsStyles from "./apiDocs";

export default css`
  :global() {
    ${rootVariables}
    ${baseStyles}
    ${utilityStyles}
    ${apiDocsStyles}
  }
`;
