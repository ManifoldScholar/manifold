import { createGlobalStyle } from "styled-components";
import fonts from "./base/fonts";
import rootVariables from "./variables";
import vendorStyles from "./vendor";
import baseStyles from "./base";
import componentStyles from "./components";
import utilityStyles from "./utility";
import printStyles from "./print";
import rteStyles from "./utility/rte";

// Raw CSS string — consumed by RootErrorBoundary and entry.server's error
// path via a virtual-DOM <style> element, which survives React's singleton
// head reconciliation when createGlobalStyle's injected rules may not.
export const rawCss = `
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

export default createGlobalStyle`${rawCss}`;
