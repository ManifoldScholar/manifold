import styled from "@emotion/styled";
import { Button } from "backend/components/list/EntitiesList";

export const DeleteButton = styled(Button)`
  color: var(--error-color);

  &:hover {
    color: var(--color-neutral-text-extra-dark);
    background: var(--error-color);
    border: var(--error-color);
  }

  &:disabled {
    color: var(--color-neutral-text-light);
    pointer-events: none;
  }
`;
