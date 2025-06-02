import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const categoryVerticalPadding = `19px`;

export const Editor = styled.div`
  --label-color: var(--strong-color);
  --label-margin-bottom: 16px;

  font-family: var(--font-family-heading);
  font-size: 17px;
  font-weight: var(--font-weight-medium);
  color: var(--strong-color);
  position: relative;

  > * + * {
    margin-top: ${categoryVerticalPadding};
  }
`;

export const CategoryInputs = styled.div`
  display: flex;
  column-gap: 40px;
  row-gap: 25px;
  flex-wrap: wrap;
  justify-content: center;

  ${respond(`justify-content: flex-start`, 85)}
`;
