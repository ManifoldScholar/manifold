import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { transientOptions } from "helpers/emotionHelpers";
import { SocialLinks } from "../Social/styles";

const BREAKPOINT = breakpoints[60];
const GUTTER = "20px";

export const Wrapper = styled("div", transientOptions)`
  ${({ $mobile }) =>
    $mobile
      ? `display: block; ${respond(`display: none;`, BREAKPOINT)}`
      : `display: none; ${respond(`display: block; width: 100%;`, BREAKPOINT)}`}

  * + & {
    margin-block-start: 20px;
  }

  + ${SocialLinks} {
    margin-block: 35px;
  }
`;

export const List = styled("div", transientOptions)`
  display: flex;
  flex-direction: column;
  width: 100%;

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
    `,
      BREAKPOINT
    )}
`;
