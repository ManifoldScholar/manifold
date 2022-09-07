import styled from "@emotion/styled";
import { headingPrimary } from "theme/styles/mixins";
import { Button as BaseButton } from "../form-inputs";

export const Header = styled.h2`
  ${headingPrimary}
  margin-block-end: 25px;
`;

export const TextBlock = styled.p`
  margin-block-end: 20px;
`;

export const Button = styled(BaseButton)`
  &:disabled {
    color: var(--color-neutral-ui-dull-light);
    background: none;
    cursor: not-allowed;
    border: 1px solid;
  }
`;
