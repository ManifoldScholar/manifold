import styled from "@emotion/styled";
import {
  draggable,
  dragging,
  buttonUnstyled,
  setHoverStyle,
  textTruncate,
  respond,
  fluidScale,
  formInputMessage,
  defaultFocusStyle
} from "theme/styles/mixins";

/* Styles here should be updated after FF implements the :has selector to remove the row-reverse in Inner and TitleWrapper. */

export const Wrapper = styled.div`
  overflow: visible;
  position: relative;
  height: ${({ $count }) => `${$count * 68}px`};
`;

export const ScrollContainer = styled.div`
  overflow: auto;
  height: ${({ $count }) => `${$count * 68}px`};
`;

export const Dropzone = styled.div`
  --Padding-inline: 10px;
  ${respond(`--Padding-inline: 20px;`, 110)};

  position: absolute;
  top: -20px;
  left: calc(-1 * var(--Padding-inline));
  background-color: var(--box-weak-bg-color);
  border-radius: var(--box-border-radius);
  width: calc(100% + (2 * var(--Padding-inline)));
  height: ${({ $count }) => `${$count * 68 + 20}px`};
`;

export const Item = styled.div`
  & + & {
    margin-block-start: 16px;
  }
`;

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  color: var(--color-neutral-text-extra-light);
  max-width: 55%;

  ${respond(`max-width: ${fluidScale("650px", "250px", 120, 65)};`, 65)}
`;

export const ChildLink = styled.div`
  height: 8px;
  width: 16px;
  border-bottom-left-radius: 4px;
  border-left: 1px solid currentColor;
  border-bottom: 1px solid currentColor;
  color: var(--color-neutral-ui-light);
  margin-inline-end: 12px;
`;

export const Title = styled.div`
  overflow: hidden;
  ${textTruncate}
  font-family: var(--font-family-sans);
  font-size: 17px;
  font-weight: var(--font-weight-semibold);
`;

export const BG = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--box-bg-color);
  border-radius: var(--box-border-radius);

  ${({ $isDragging }) =>
    $isDragging && `background-color: var(--drawer-bg-color)`}
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  color: var(--color-neutral-ui-light);

  &:hover ~ ${TitleWrapper} {
    color: var(--highlight-color);
  }
`;

export const Inner = styled.div`
  ${draggable}
  padding: 10px ${fluidScale("24px", "16px")};
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: space-between;
  width: ${({ $depth }) =>
    `calc(100% - ${fluidScale(`${$depth * 24}px`, `${$depth * 12}px`)})`};
  cursor: default;
  background-color: var(--box-bg-color);
  position: relative;
  border: 1px solid var(--box-bg-color);
  color: var(--text-neutral-extra-light);
  margin-inline-start: ${({ $depth }) =>
    fluidScale(`${$depth * 24}px`, `${$depth * 12}px`)};

  ${({ $isDragging }) => $isDragging && dragging}

  ${({ $isDragging }) =>
    $isDragging && `background-color: var(--drawer-bg-color)`}

    &:has(${ButtonGroup}:hover) {
      background-color: var(--drawer-bg-color);
    }

  ${({ $isTarget }) => $isTarget && `border-color: var(--highlight-color);`}
`;

export const Button = styled.button`
  ${buttonUnstyled}

  color: var(--color-neutral-ui-light);
  padding-inline: 3px;
  ${respond(`padding-inline: 6px;`, 30)};

  &:focus-visible {
    ${defaultFocusStyle}
  }

  &:hover {
    color: var(--highlight-color);
  }

  &:hover ~ ${Title} {
    color: var(--highlight-color);
  }
`;

export const DragHandle = styled.div`
  ${buttonUnstyled}
  cursor: grab;
  ${setHoverStyle()}

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const Error = styled.span`
  ${formInputMessage}
  display: inline-block;
  margin-block-end: 20px;
  color: var(--error-color);
  padding-inline: 0;
`;
