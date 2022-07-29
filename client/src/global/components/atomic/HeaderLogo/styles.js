import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { headerLayout } from "theme/styles/variables/crossComponent";

export const Link = styled.a`
  grid-area: logo;
  align-self: center;
  max-width: 300px;
  color: var(--color-accent-primary);
  text-decoration: none;

  .library-header & {
    margin-bottom: ${headerLayout.paddingVerticalMobile};

    ${respond(`margin-bottom: ${headerLayout.paddingVerticalDesktop};`, 40)}
  }

  .library-header--dark & {
    color: var(--color-neutral-ui-light);
  }

  &[href]:hover,
  &[href].focus-visible {
    color: var(--hover-color);
    outline: 0;
  }

  .manicon-svg {
    ${respond(
      `
        width: 32px;
        height: 32px;
      `,
      40
    )}

    ${respond(
      `
        width: min(4.32vw, 38px);
        height: min(4.32vw, 38px);
      `,
      75
    )}
  }
`;
