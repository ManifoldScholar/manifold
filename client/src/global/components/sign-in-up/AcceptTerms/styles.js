import styled from "@emotion/styled";
import { headingPrimary } from "theme/styles/mixins";

export const Header = styled.h2`
  ${headingPrimary}
  margin-block-end: 25px;
`;

export const TextBlock = styled.p`
  margin-block-end: 20px;
`;

export const Button = styled.button`
  width: 100%;

  &:disabled {
    color: var(--color-neutral-ui-dull-light);
    background: none;
    cursor: not-allowed;
    border: 1px solid;
  }
`;

export const CheckboxWrapper = styled.div`
  margin-block-start: 40px;
  margin-block-end: 10px;
`;
