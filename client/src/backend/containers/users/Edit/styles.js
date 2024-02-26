import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const UserVerification = styled.ul`
  list-style-type: square;
  list-style-position: inside;
  margin-block-start: 10px;
  margin-block-end: 40px;
  padding-block: 15px;
  padding-inline: 20px;
  font-family: var(--font-family-sans);
  border: 1px solid
    ${({ $warn }) =>
      $warn ? `var(--error-color)` : `var(--color-accent-primary)`};

  > li + li {
    margin-block-start: 3px;
  }

  > li > span {
    margin-inline-start: -8px;
  }

  ${respond(`margin-block-start: -20px;`, 65)}
`;
