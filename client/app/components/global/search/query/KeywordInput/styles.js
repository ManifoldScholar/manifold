import styled from "styled-components";
import {
  respond,
  defaultFocusStyle,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 56px;
  width: 100%;
  padding-inline: 20px;
  background-color: var(--color-base-neutral-white);
  border: 1px solid var(--color-base-neutral70);
  border-radius: 12px;
  position: relative;
  font-family: var(--font-family-sans);
  color: var(--color-base-neutral90);
  transition: background-color ${defaultTransitionProps},
    color ${defaultTransitionProps};

  svg {
    color: var(--color-base-neutral90);

    &:hover {
      color: var(--color-accent-primary);
    }
  }

  &:focus-within {
    background-color: var(--color-base-neutral-white);
    border-color: var(--color-base-neutral-white);
    outline: 2px solid var(--color-base-neutral90);

    svg {
      color: var(--color-base-neutral90);

      &:hover {
        color: var(--color-base-neutral70);
      }
    }
  }

  ${respond(
    `
    width: 100%;
  `,
    50
  )}
`;

export const SearchIcon = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-block-start: 4px;
  ${buttonUnstyled}

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  border: none;
  background-color: transparent;
  outline: none;
  color: var(--color-base-neutral90);

  &::placeholder {
    color: var(--color-base-neutral75);
  }
`;

export const ClearButton = styled.button`
  > span {
    font-size: 12px;
  }

  position: absolute;
  right: 25px;
  margin-block-start: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-base-neutral90);

  ${buttonUnstyled}

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;
