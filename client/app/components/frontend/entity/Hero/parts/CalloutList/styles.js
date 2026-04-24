import styled from "styled-components";
import { respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

const BREAKPOINT = breakpoints[60];
const GUTTER = "20px";

export const Wrapper = styled("div")`
  ${({ $mobile }) =>
    $mobile
      ? `display: block; ${respond(`display: none;`, BREAKPOINT)}`
      : `display: none; ${respond(`display: block; width: 100%;`, BREAKPOINT)}`}

  * + & {
    margin-block-start: 20px;
  }
`;

export const ButtonListItem = styled("li")`
  min-inline-size: min(200px, 100%);
`;

export const List = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;

  &:is(ul) {
    margin-block: 0px;
  }

  > *:not(:first-child) {
    width: 100%;
    margin-block-start: var(--CalloutList-gutter, ${GUTTER});
  }

  & + & {
    margin-block-start: var(--CalloutList-margin, ${GUTTER});
  }

  ${({ $inline }) =>
    $inline &&
    respond(
      `
      flex-flow: row wrap;
      gap: ${GUTTER};

      > *,
      > *:not(:first-child) {
        width: auto;
        margin-block-start: 0;
      }

      > ${ButtonListItem} {
        display: flex;
      }
    `,
      BREAKPOINT
    )}
`;
