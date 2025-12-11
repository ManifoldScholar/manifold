import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

const BREAKPOINT = breakpoints[60];

export const Cover = styled.figure`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 0;

  ${respond(`align-items: flex-start;`, BREAKPOINT)}

  &--constrained {
    width: 160px;
  }

  img {
    width: 100%;
    max-width: 120px;
    height: auto;

    ${respond(`max-width: 260px;`, BREAKPOINT)}
  }

  svg {
    width: 111px;
    height: 111px;
    align-self: center;

    ${respond(
      `
      width: 160px;
      height: 160px;
    `,
      BREAKPOINT
    )}
  }
`;
