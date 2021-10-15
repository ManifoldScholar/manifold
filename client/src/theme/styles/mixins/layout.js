import { logicalWithFallback } from "@castiron/style-mixins";
import { respond, fluidScale } from "./common";
import { breakpoints } from "../variables/media";
import { containerPadding } from "../variables/layout";
import { headerLayout } from "../variables/crossComponent";

// 'light' mode is sufficient for clearing floats,
// while 'heavy' is required to prevent margin collapsing
export function clearfix(mode = "light") {
  switch (mode) {
    case "heavy":
      return `
        &::before,
        &::after {
          display: table;
          content: "";
        }

        &::after {
          clear: both;
        }
      `;
    default:
      return `
        &::after {
          display: block;
          clear: both;
          content: "";
        }
      `;
  }
}

// Layout
// --------------------------------------------------------
export const containerPrototype = `
  max-width: var(--container-width-full);
  ${logicalWithFallback({
    "padding-inline": fluidScale(
      containerPadding.full,
      containerPadding.narrow,
      breakpoints[120],
      breakpoints[120]
    ),
    "margin-inline": "auto"
  })}
`;

export const containerFocus = `
  max-width: var(--container-width-focus);
  ${logicalWithFallback({
    "padding-inline": "var(--container-padding-min)",
    "margin-inline": "auto"
  })}
`;

export const headerContainerPrimary = `
  ${containerPrototype}
  position: relative;
  padding-top: ${fluidScale(
    headerLayout.paddingVerticalDesktop,
    headerLayout.paddingVerticalMobile
  )};
`;

export function drawerPadding(property = "padding-right", scale = "wide") {
  return `
    ${property}: 20px;

    ${respond(`${property}: ${scale === "wide" ? "5.859vw" : "3.906vw"}`, 95)}
    ${respond(`${property}: ${scale === "wide" ? "60px" : "40px"}`, 120)}
  `;
}

export function drawerIndent(property, dimension = 1) {
  return `${property}: ${50 * dimension}px;`;
}

export function flexViewport(full) {
  return `
    display: flex;
    flex-direction: column;

    ${full &&
      `
        min-height: 100vh;
        & > .main-content {
          flex-grow: 1;
        }
      `}
  `;
}

// Lists
// --------------------------------------------------------
export const listUnstyled = `
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
  list-style-type: none;
`;

export const listHorizontal = `
  ${listUnstyled}

  li {
    display: inline-block;
  }
`;
