import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { breakpoints } from "theme/styles/variables/media";
import { respond, containerPrototype, fluidScale } from "theme/styles/mixins";

const BREAKPOINT = breakpoints[60];

export const Wrapper = styled("section", transientOptions)`
  position: relative;
  padding-block-start: 20px;
  padding-block-end: 35px;

  color: var(--color-base-neutral-white);
  background-color: var(--color-base-neutral95);

  ${respond(
    `padding-block-start: 70px;
    padding-block-end: 80px;`,
    BREAKPOINT
  )}

  ${({ $darkMode }) =>
    $darkMode
      ? `
        --focus-color: var(--color-interaction-light);
        --hover-color: var(--color-interaction-light);
        --text-color: var(--color-neutral-text-light);
        --strong-color: currentColor;
      `
      : `
        --link-color: var(--color-neutral-text-dark);
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-base-neutral05);
      `}

  ${({ $isStandalone }) =>
    $isStandalone &&
    `padding-block-start: calc(30px + var(--standalone-header-height));
    ${respond(`padding-block-start: 30px;`, BREAKPOINT)}`}
`;

export const JournalWrapper = styled(Wrapper)`
  --right-column-width: 200px;
  --left-column-width: 51.5%;
  --column-gap: ${fluidScale("180px", "60px")};
  --Meta-font-family: var(--font-family-heading);
  --Social-icons-color: var(--color-base-neutral80);
  --link-color: var(--color-neutral-text-dark);
  --CalloutList-gutter: 16px;
  --CalloutList-margin: 22px;

  color: var(--color-neutral-text-extra-dark);
  background-color: var(--color-base-neutral-white);
  padding-block-end: 20px;

  ${respond(`padding-block-end: 20px`)}
`;

export const IssueWrapper = styled(Wrapper)`
  --Social-icons-color: var(--color-base-neutral80);
  --link-color: var(--color-neutral-text-dark);

  color: var(--color-neutral-text-extra-dark);
  background-color: var(--color-base-neutral-white);
`;

export const Inner = styled.div`
  ${containerPrototype}
  position: relative;
  z-index: 50;
  display: grid;
  row-gap: ${fluidScale("48px", "30px", 120)};
  column-gap: var(--column-gap, ${fluidScale("100px", "4.839vw")});

  ${respond(
    `
    grid-template-columns: var(--left-column-width, 1fr) var(--right-column-width, clamp(220px, 28%, 260px));
  `,
    BREAKPOINT
  )}
`;

export const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  grid-row: 2;
  grid-column: 1;

  > * + * {
    margin-block-start: 24px;
  }

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

    > *:first-child {
      margin-block-start: 7px;
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
