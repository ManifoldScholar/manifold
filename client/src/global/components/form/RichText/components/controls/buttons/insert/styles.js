import styled from "@emotion/styled";
import {
  buttonUnstyled,
  defaultHoverStyle,
  utilityPrimary,
  fluidScale
} from "theme/styles/mixins";
import Utility from "global/components/utility";
import Dialog from "global/components/dialog";

export const Form = styled.form`
  > * + * {
    margin-block-start: 50px;
  }
`;

export const CloseButton = styled.button`
  ${buttonUnstyled}
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 17px;
  cursor: pointer;

  ${({ $primary }) =>
    $primary &&
    `
    cursor: pointer;

    &:hover {
      ${defaultHoverStyle}
      outline: 0;
    }

    &:focus-visible {
      color: var(--focus-color);
    }
  `}
`;

const CLOSE_ICON_SIZE = "24px";

export const CloseText = styled.span`
  ${utilityPrimary}
  margin-right: 6px;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  line-height: ${CLOSE_ICON_SIZE};
  letter-spacing: 0.125em;
`;

export const CloseIcon = styled(Utility.IconComposer)`
  width: ${CLOSE_ICON_SIZE};
  height: ${CLOSE_ICON_SIZE};
`;

export const ModalHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block-start: 0;
`;

export const HeaderIcon = styled(Utility.IconComposer)`
  color: var(--color-accent-primary);
  margin-top: 2px;
`;

export const Heading = styled.span`
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: -2px;

  h2 {
    margin-top: -6px;
  }
`;

export const ModalBody = styled.div`
  width: 100%;
`;

export const Modal = styled(Dialog.Wrapper)`
  max-width: 600px;
  padding-block: ${fluidScale("50px", "30px")};
  padding-inline: ${fluidScale("60px", "40px")};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 64px;
`;
