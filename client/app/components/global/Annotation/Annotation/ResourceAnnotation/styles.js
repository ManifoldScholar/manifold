import styled from "@emotion/styled";

export const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-block-start: 0.25rem;
`;

export const Delete = styled.button`
  border: 1px transparent;
  font-size: 12px;

  &:hover:not([disabled]),
  &:active:not([disabled]) {
    color: var(--color-neutral-text-extra-dark);
    background-color: var(--color-base-red45);
    border-color: var(--color-base-red45);
  }

  &:focus-visible:not([disabled]) {
    color: var(--color-base-neutral90);
    background-color: var(--color-base-red20);
    outline: 0;
  }
`;
