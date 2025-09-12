import styled from "@emotion/styled";
import {
  transparentize,
  buttonUnstyled,
  utilityPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Dialog = styled.dialog`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -30%);
  height: 80dvh;
  min-width: 80vw;
  padding: 0;
  padding-block-end: 50px;
  overflow: auto;
  border-radius: 20px;

  &:focus-visible {
    ${defaultFocusStyle}
  }

  &::backdrop {
    background-color: ${transparentize("neutralBlack", 0.3)};
  }

  .reader.scheme-dark & {
    background: var(--color-base-neutral90);
  }
`;

export const Header = styled.header`
  padding: 12px;
  background: var(--color-base-neutral10);
  display: flex;
  justify-content: flex-end;
  align-items-center;

  .reader.scheme-dark & {
    background: var(--color-base-neutral95);
  }
`;

export const HeaderButton = styled.button`
  ${buttonUnstyled}
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--color-base-neutral90);
  font-family: var(--font-family-sans);
  padding-inline: 12px;
  font-size: 16px;
  cursor: pointer;

  .reader.scheme-dark & {
    color: var(--color-base-neutral20);

    &:hover {
      color: var(--hover-color);
    }
  }

  > svg {
    margin-block-start: 2px;
  }

  &:hover {
    color: var(--hover-color);
  }

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const CloseButton = styled(HeaderButton)`
  padding-inline: 14px;
`;

export const CloseText = styled.span`
  ${utilityPrimary}
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
`;
