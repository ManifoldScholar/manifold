import styled from "@emotion/styled";
import AtomicButton from "global/components/atomic/Button";
import { headingPrimary } from "theme/styles/mixins";

export const Header = styled.h2`
  ${headingPrimary}
  margin-block-end: 25px;
`;

export const TextBlock = styled.p`
  margin-block-end: 20px;
  font-family: var(--font-family-copy);
`;

export const Button = styled(AtomicButton)`
  inline-size: 100%;
  margin-block-start: 40px;

  &:disabled {
    --_color: var(--strong-color);
    --_background-color: transparent;
    --_border-color: currentColor;

    cursor: not-allowed;

    &:hover {
      color: var(--_color);
      background-color: var(--_background-color);
      border-color: var(--_border-color);
    }
  }
`;

export const CheckboxWrapper = styled.div`
  margin-block-start: 40px;
  margin-block-end: 10px;
`;
