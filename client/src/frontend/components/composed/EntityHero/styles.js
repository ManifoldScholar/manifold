import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { breakpoints } from "theme/styles/variables/media";
import { respond, containerPrototype, fluidScale } from "theme/styles/mixins";
import { standaloneHeaderLayout } from "theme/styles/variables/crossComponent";

const BREAKPOINT = breakpoints[60];

export const Wrapper = styled("section", transientOptions)`
  --right-column-width: minmax(220px, 28%);
  --right-column-padding: 60px;
  --column-gap: min("100px", "4.839vw");

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
      --link-color: var(--color-neutral-text-dark);
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
    `padding-top: calc(30px + var(--standalone-header-height));
    ${respond(`padding-top: 30px;`, BREAKPOINT)}`}
`;

export const JournalWrapper = styled(Wrapper)`
  --right-column-width: 200px;
  --right-column-padding: 0px;
  --left-column-width: 50%;
  --column-gap: ${fluidScale("180px", "60px")};
  --Meta-font-family: var(--font-family-heading);
  --Social-icons-color: var(--color-base-neutral80);
  --link-color: var(--color-neutral-text-dark);
  --CalloutList-gutter: 16px;
  --CalloutList-margin: 22px;

  color: var(--color-neutral-text-extra-dark);
  background-color: var(--color-base-neutral-white);
`;

export const Inner = styled.div`
  ${containerPrototype}
  position: relative;
  z-index: 50;
  max-width: ${standaloneHeaderLayout.maxWidth};
  display: grid;
  row-gap: ${fluidScale("48px", "30px", 120)};
  column-gap: var(--column-gap);

  ${respond(
    `
    grid-template-columns: var(--left-column-width, 1fr) var(--right-column-width);
    padding-right: 20px;
    padding-left: 20px;
  `,
    BREAKPOINT
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
    padding-right: var(--right-column-padding);

    > *:first-child {
      margin-top: 7px;
    }
    `,
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
