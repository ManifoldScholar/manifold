import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { transientOptions } from "helpers/emotionHelpers";
import { SocialLinks } from "../Social/styles";

const BREAKPOINT = breakpoints[60];

export const Wrapper = styled("div", transientOptions)`
  ${({ $mobile }) =>
    $mobile
      ? `display: block; ${respond(`display: none;`, BREAKPOINT)}`
      : `display: none; ${respond(`display: block; width: 100%;`, BREAKPOINT)}`}

  & + & {
    margin-top: 12px;
  }

  + ${SocialLinks} {
    margin-top: 35px;
  }
`;

const calloutGutter = "19px";

export const List = styled("div", transientOptions)`
  display: flex;
  flex-direction: column;
  width: 100%;

  > * {
    width: 100%;
    margin-top: ${calloutGutter};
  }

  ${({ $inline }) =>
    $inline &&
    respond(
      `
      flex-flow: row wrap;
      gap: ${calloutGutter};

      > * {
        width: auto;
      }
    `,
      BREAKPOINT
    )}
`;
