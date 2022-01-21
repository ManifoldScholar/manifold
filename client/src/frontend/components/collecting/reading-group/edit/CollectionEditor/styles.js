import styled from "@emotion/styled";

export const categoryVerticalPadding = `19px`;

export const Editor = styled.div`
  --label-color: var(--strong-color);
  --label-margin-bottom: 16px;

  font-family: var(--font-family-heading);
  font-size: 17px;
  font-weight: var(--font-weight-medium);
  color: var(--strong-color);

  > * + * {
    margin-top: ${categoryVerticalPadding};
  }
`;
