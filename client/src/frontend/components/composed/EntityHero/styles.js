import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { breakpoints } from "theme/styles/variables/media";
import { respond, containerPrototype } from "theme/styles/mixins";
import { standaloneHeaderLayout } from "theme/styles/variables/crossComponent";

const BREAKPOINT = breakpoints[60];

const gridGapSmall = "30px";
const rowGapMedium = "3.159vw";
const columnGapMedium = "4.839vw";
const rowGapLarge = "48px";
const columnGapLarge = "100px";
const rightColumnWidth = "28%";

export const Wrapper = styled("section", transientOptions)`
  position: relative;
  padding-top: 20px;
  padding-bottom: 35px;

  color: var(--color-base-neutral-white);
  background-color: var(--color-base-neutral95);

  ${respond(
    `padding-top: 70px;
    padding-bottom: 80px;`,
    BREAKPOINT
  )}

  ${({ $lightMode }) => {
    if ($lightMode) {
      return `
      --link-color: var(--color-neutral-text-dark)
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--color-base-neutral05);
      `;
    }
    return `
    --focus-color: var(--color-interaction-light);
    --hover-color: var(--color-interaction-light);
    --text-color: var(--color-neutral-text-light);
    --strong-color: currentColor;
    `;
  }}

  ${({ $isStandalone }) =>
    $isStandalone &&
    `padding-top: calc(${gridGapSmall} + var(--standalone-header-height));
    ${respond(`padding-top: 30px;`, BREAKPOINT)}`}
`;

export const Inner = styled.div`
  ${containerPrototype}
  position: relative;
  z-index: 50;
  display: grid;
  grid-row-gap: ${gridGapSmall};
  max-width: ${standaloneHeaderLayout.maxWidth};

  ${respond(
    `
    grid-template-columns: 1fr minmax(220px, ${rightColumnWidth});
    row-gap: ${rowGapMedium};
    column-gap: ${columnGapMedium};
    padding-right: 20px;
    padding-left: 20px;
  `,
    BREAKPOINT
  )}

  ${respond(
    `row-gap: ${rowGapLarge};
    column-gap: ${columnGapLarge};`,
    120
  )}
`;

export const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 2;
  grid-column: 1;

  ${respond(
    `grid-row: 1;
    grid-column: 1;`,
    BREAKPOINT
  )}
`;

export const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 1;
  grid-column: 1;

  ${respond(
    `grid-row: 1;
    grid-column: 2;
    padding-right: 60px;`,
    BREAKPOINT
  )}
`;

export const BottomLeft = styled.div`
  grid-row: 3;
  grid-column: 1;

  ${respond(
    `grid-row: 2;
    grid-column: 1;`,
    BREAKPOINT
  )}
`;

export const BottomRight = styled.div`
  grid-row: 4;
  grid-column: 1;

  ${respond(
    `grid-row: 2;
    grid-column: 2;
    align-self: end;`,
    BREAKPOINT
  )}
`;
