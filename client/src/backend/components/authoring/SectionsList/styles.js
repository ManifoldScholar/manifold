import styled from "@emotion/styled";
import {
  draggable,
  dragging,
  buttonUnstyled,
  setHoverStyle,
  textTruncate,
  respond
} from "theme/styles/mixins";

export const Item = styled.li`
  & + & {
    padding-block-start: 16px;
  }
  color: var(--color-neutral-text-extra-light);
`;

export const Inner = styled.div`
  ${draggable}
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  cursor: default;

  ${({ $isDragging }) => $isDragging && dragging}
`;

export const Title = styled.div`
  overflow: hidden;
  ${textTruncate}
  font-family: var(--font-family-sans);
  font-size: 17px;
  font-weight: var(--font-weight-semibold);
`;

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0;

  ${respond(`gap: 12px;`, 30)}
`;

export const Button = styled.button`
  ${buttonUnstyled}
`;

export const DragHandle = styled(Button)`
  cursor: grab;
  ${setHoverStyle()}
`;
