import styled from "@emotion/styled";
import { Form as RouterForm } from "react-router";

export const Form = styled(RouterForm)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const Input = styled.input`
  border: 1px solid var(--color-neutral-ui-dull-dark);
  border-radius: 3px;
  font-family: var(--font-family-copy);
  color: var(--color-neutral-text-extra-dark);
  background: #fff;

  &:focus {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: 1px;
  }

  ${p =>
    p.$size === "md"
      ? `
        flex: 1;
        padding: 10px 14px;
        font-size: 15px;
      `
      : `
        padding: 7px 12px;
        font-size: 14px;
        min-width: 18rem;
      `}
`;
