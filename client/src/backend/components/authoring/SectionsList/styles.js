import styled from "@emotion/styled";
import {
  draggable,
  dragging,
  buttonUnstyled,
  setHoverStyle,
  textTruncate,
  respond,
  blockLabelRound,
  fluidScale,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Item = styled.li`
  & + & {
    padding-block-start: 16px;
  }
  color: var(--color-neutral-text-extra-light);
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

export const BG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
  background-color: var(--box-bg-color);
  border-radius: var(--box-border-radius);

  ${({ $isDragging }) =>
    $isDragging && `background-color: var(--drawer-bg-color)`}
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 0;

  &:hover ~ ${TitleWrapper} {
    color: var(--highlight-color);
  }

  &:hover ~ ${BG} {
    background-color: var(--drawer-bg-color);
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
  background-color: transparent;
  position: relative;

  ${({ $isDragging }) => $isDragging && dragging}
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
