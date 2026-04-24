import styled from "styled-components";
import {
  draggable,
  dragging,
  buttonUnstyled,
  setHoverStyle,
  textTruncate,
  respond,
  blockLabelRound,
  fluidScale,
  defaultFocusStyle,
  revealOnFocus
} from "theme/styles/mixins";

export const Wrapper = styled.div`
  ul > * + *:not([data-rbd-drop-indicator]) {
    margin-block-start: 16px;
  }
`;

export const Item = styled.li`
  color: var(--color-neutral-text-extra-light);

  &:first-child {
    margin-block-start: 16px;
  }
`;

export const Title = styled.div`
  overflow: hidden;
  ${textTruncate}
  font-family: var(--font-family-sans);
  font-size: 17px;
  font-weight: var(--font-weight-semibold);
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-neutral-text-extra-light);
  max-width: 50%;

  ${respond(`max-width: ${fluidScale("650px", "250px", 120, 65)};`, 65)}
`;

export const KeyboardButtons = styled.div``;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  ${revealOnFocus(KeyboardButtons)}

  &:hover ~ ${TitleWrapper} {
    color: var(--highlight-color);
  }
`;

export const Inner = styled.div`
  --item-background: var(--box-bg-color);

  ${draggable}
  padding: 12px ${fluidScale("24px", "16px")};
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  cursor: default;
  background-color: var(--box-bg-color);
  position: relative;

  ${({ $isDragging }) => $isDragging && dragging}

  &:has(${ButtonGroup}:hover) {
    background-color: var(--drawer-bg-color);
  }
`;

export const Button = styled.button`
  ${buttonUnstyled}

  padding-inline: 3px;

  ${respond(`padding-inline: 6px;`, 30)};

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const DragHandle = styled(Button)`
  cursor: grab;
  ${setHoverStyle()}

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const Tag = styled.div`
  ${blockLabelRound}
  width: max-content;

  padding-right: 8px;
  padding-left: 8px;
  margin: 0;
  font-size: 12px;
  vertical-align: middle;
  line-height: 1.188;
  font-family: var(--font-family-heading);
  background-color: var(--color-accent-primary-light);
  color: var(--color-neutral-text-extra-dark);
`;
