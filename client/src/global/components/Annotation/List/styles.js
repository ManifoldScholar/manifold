import styled from "@emotion/styled";
import { buttonUnstyled } from "theme/styles/mixins";

export const ProfileButton = styled.button`
  ${buttonUnstyled}
  text-decoration: underline;

  &:hover {
    color: var(--color-base-neutral70);
  }

  &:focus-visible {
    outline-color: var(--color-base-neutral70);
  }
`;

export const UnverifiedMessage = styled.div`
  padding: 20px;
  background-color: var(--color-base-blue45);
  color: var(--color-neutral-text-extra-dark);
  font-family: var(--font-family-sans);
`;
