import styled from "@emotion/styled";
import { respond, utilityPrimary } from "theme/styles/mixins";

export const categoryVerticalPadding = `14px`;

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

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  & + & {
    margin-block-start: 40px;
  }
`;

export const CategoryInputs = styled.div`
  display: flex;
  gap: calc(2 * ${categoryVerticalPadding});
  flex-wrap: wrap;
  justify-content: center;

  ${respond(`justify-content: flex-start`, 85)}
`;

export const Header = styled.h3`
  ${utilityPrimary}
  margin: 0;
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.115em;
`;
