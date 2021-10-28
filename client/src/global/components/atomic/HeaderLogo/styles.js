import { css } from "@linaria/core";
import { respond } from "theme/styles/mixins";

export const logoClass = css`
  grid-area: logo;
  align-self: center;
  max-width: 300px;
  color: var(--color-accent-primary);
  text-decoration: none;

  .library-header & {
    margin-bottom: 9px;
    ${respond(`margin-bottom: 20px`, 40)}
  }

  .library-header--dark & {
    color: var(--color-neutral-ui-light);
  }

  &[href]:hover,
  &[href]:focus-visible {
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
        width: 38px;
        height: 38px;
      `,
      75
    )}
  }
`;
