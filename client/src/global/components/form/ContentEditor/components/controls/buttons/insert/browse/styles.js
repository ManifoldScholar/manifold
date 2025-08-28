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

export const Modal = styled(Dialog.Wrapper)`
  max-inline-size: 1000px;
  max-block-size: 85dvh;
  oveflow: auto;
  padding-block-start: ${fluidScale("50px", "30px")};
  padding-block-end: ${fluidScale("40px", "30px")};
  padding-inline: ${fluidScale("60px", "40px")};
  overflow: hidden;

  .dialog-overlay:has(+ &) {
    display: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 24px;
  padding-block-start: 36px;
`;

export const ListWrapper = styled.div`
  padding-block: 1.25rem;
  overflow: auto;
  flex-grow: 1;
  max-height: 47dvh;

  div.entity-list {
    height: 100%;
  }

  .entity-list__contents-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

export const Pagination = styled(Utility.Pagination)`
  margin-block-start: 36px;
`;
