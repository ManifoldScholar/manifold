import styled from "@emotion/styled";
import {
  respond,
  buttonUnstyled,
  defaultHoverStyle,
  utilityPrimary,
  fluidScale
} from "theme/styles/mixins";
import { Form as BaseForm } from "global/containers/form/styles";
import Utility from "global/components/Utility";
import BaseDialog from "global/components/dialog";

export const Dialog = styled(BaseDialog.Wrapper)`
  padding: ${fluidScale("60px", "30px")};
  padding-block-start: ${fluidScale("50px", "25px")};
  overflow: auto;
  max-height: 90dvh;
`;

export const Options = styled.fieldset`
  display: flex;
  gap: 40px;
  flex-direction: column;
  max-width: 100%;

  > * {
    flex-basis: 50%;
  }

  ${respond(`flex-direction: row;`, 50)}
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: start;
  color: var(--reader-color);
`;

export const TextColumn = styled.div`
  > * + * {
    margin-block-start: 17px;
  }

  > *:first-child {
    margin-block-start: 0;
  }
`;

export const Instructions = styled.span`
  font-family: var(--font-family-copy);
  font-style: italic;
  font-weight: 400;
`;

export const Form = styled(BaseForm)`
  --Form-row-gap: ${fluidScale("50px", "30px")};
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;

  > button {
    min-width: 140px;
  }
`;

export const CloseButton = styled.button`
  ${buttonUnstyled}
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  cursor: pointer;

  &:hover {
    ${defaultHoverStyle}
    outline: 0;
  }

  &:focus-visible {
    color: var(--focus-color);
  }
`;

const CLOSE_ICON_SIZE = "16px";

export const CloseText = styled.span`
  ${utilityPrimary}
  margin-right: 10px;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  line-height: ${CLOSE_ICON_SIZE};
  letter-spacing: 0.125em;
  margin-block-start: -1px;
`;

export const CloseIcon = styled(Utility.IconComposer)`
  width: ${CLOSE_ICON_SIZE};
  height: ${CLOSE_ICON_SIZE};
`;
