import styled from "@emotion/styled";
import {
  formLabelPrimary,
  utilityPrimary,
  buttonUnstyled,
  defaultHoverStyle,
  defaultFocusStyle,
  respond
} from "theme/styles/mixins";

export const Cart = styled.dialog`
  position: fixed;
  inset-block: 77px;
  inset-inline-end: 0;
  inset-inline-start: auto;
  width: 100%;
  height: calc(100dvh - 77px);
  margin: 0;
  background: var(--color-base-neutral-white);
  border: none;
  border-left: 1px solid var(--color-base-neutral40);
  padding: 24px 30px;
  overflow-y: auto;
  z-index: 5;

  > * + * {
    margin-block-start: 30px;
  }

  > button {
    width: 100%;
  }

  ${respond(`width: 370px;`, 90)}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-block-end: 30px;

  h2 {
    margin: 0;
    font-size: 19px;
    line-height: 1.21;
  }

  button {
    display: flex;
    align-items: center;
    gap: 12px;

    ${buttonUnstyled}
    ${utilityPrimary}
    ${formLabelPrimary}

    &:hover {
      ${defaultHoverStyle}
    }

    &:focus-visible {
      ${defaultFocusStyle}
    }
  }
`;
