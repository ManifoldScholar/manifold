import styled from "@emotion/styled";
import {
  draggable,
  dragging,
  dropIndicator,
  buttonUnstyled,
  setHoverStyle,
  textTruncate,
  respond,
  fluidScale,
  formInputMessage,
  defaultFocusStyle,
  revealOnFocus
} from "theme/styles/mixins";

/* Styles here should be updated after FF implements the :has selector to remove the row-reverse in Inner and TitleWrapper. */

export const Wrapper = styled.div`
  position: relative;
  ${({ $dragging }) => $dragging && `user-select: none;`}
`;

export const ScrollContainer = styled.div`
  position: relative;
`;

const listLayout = `
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const List = styled.ul`
  ${listLayout}
`;

export const Group = styled.ul`
  ${listLayout}
`;

export const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Row = styled.div`
  position: relative;
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

export const KeyboardButtons = styled.div``;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 0;
  color: var(--color-neutral-ui-light);
  ${revealOnFocus(KeyboardButtons)}

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

  ${({ $isTarget, $targetBlocked }) =>
    $isTarget &&
    `border-color: ${
      $targetBlocked ? "var(--error-color)" : "var(--highlight-color)"
    };`}
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

export const DropLine = styled.div`
  ${({ $blocked, $inset }) =>
    dropIndicator({
      color: $blocked ? "var(--error-color)" : "var(--highlight-color)",
      startInset: `${$inset || 0}px`,
      lineRadius: "1px",
      dotInset: "-4px",
      zIndex: "auto"
    })}
  ${({ $edge }) => ($edge === "top" ? "top: -9px;" : "bottom: -9px;")}
`;

export const Preview = styled.div`
  ${textTruncate}
  max-width: 320px;
  padding: 8px 14px;
  border-radius: var(--box-border-radius);
  background-color: var(--drawer-bg-color);
  color: var(--strong-color);
  font-family: var(--font-family-sans);
  font-size: 15px;
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
`;
