import styled from "@emotion/styled";

export const UserVerification = styled.ul`
  list-style-type: square;
  list-style-position: inside;
  margin-block-start: -10px;
  margin-block-end: 0;
  padding-block: 15px;
  padding-inline: 20px;
  font-family: var(--font-family-sans);
  border: 2px solid
    ${({ $warn }) =>
      $warn ? `var(--error-color)` : `var(--color-accent-primary)`};

  > li + li {
    margin-block-start: 3px;
  }

  > li > span {
    margin-inline-start: 4px;
  }
`;
