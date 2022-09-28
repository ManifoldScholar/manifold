import styled from "@emotion/styled";
import {
  respond,
  fluidScale,
  buttonUnstyled,
  utilityPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

const ACTION_MARGIN_TOP = 18;
const BUTTON_MARGIN_LEFT = 15;

export const Editor = styled.div`
  margin-block-end: 5px;
  padding-inline-start: var(--Editor-padding-inline-start);
`;

export const Label = styled.button`
  display: flex;
  align-items: center;
  padding-inline: 24px;
  padding-block: ${fluidScale("8px", "5px")};
  border-radius: 20px;
  border: none;
  margin-block-start: 50px;
  font-size: ${fluidScale("17px", "14px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-regular);
  color: var(--color-neutral-text-extra-dark);
  background-color: var(--box-medium-bg-color);
`;

export const Icon = styled(IconComposer)`
  margin-right: 8px;
  margin-left: -3px;
  width: 24px;
  height: 24px;
`;

export const TextArea = styled.textarea`
  margin-block-start: 18px;
  width: 100%;
  padding: 1em 1.5em;
  font-size: 16px;
  font-family: var(--font-family-sans);
  color: var(--strong-color);
  resize: vertical;
  background-color: var(--box-medium-bg-color);
  border: 0;
  border-radius: var(--box-border-radius);
  outline: 0;

  &::placeholder {
    color: var(--color);
  }

  &:focus-visible::placeholder {
    color: var(--strong-color);
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: ${10 - ACTION_MARGIN_TOP}px;

  ${respond(`margin-top: ${20 - ACTION_MARGIN_TOP}px;`, 90)}
`;

export const Buttons = styled.div`
  display: flex;
  width: 100%;
  margin-block-start: ${ACTION_MARGIN_TOP}px;
  margin-inline-start: -${BUTTON_MARGIN_LEFT}px;

  ${respond(`width: auto;`, 120)}

  &:only-child {
    justify-content: flex-end;
    width: 100%;
    margin-inline-start: 0;
  }

  .button-primary,
  .button-secondary {
    min-width: 100px;
    padding: 9px 0 11px;
    margin-inline-start: ${BUTTON_MARGIN_LEFT}px;
    font-size: 14px;
  }

  .button-secondary {
    color: var(--color-neutral-text-extra-dark);
    border-radius: var(--box-border-radius);

    &:disabled {
      color: inherit;
      background-color: var(--color-accent-primary-dull);
      cursor: default;
    }

    &:active,
    &:hover {
      color: inherit;
    }
  }
`;

export const Placeholder = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 14px;
  border: 0;
  margin-block-start: 18px;

  &:focus-visible,
  &:focus {
    color: var(--hover-color);
    ${defaultFocusStyle}
  }
`;
