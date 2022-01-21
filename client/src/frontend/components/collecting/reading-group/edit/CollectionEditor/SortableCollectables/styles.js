import styled from "@emotion/styled";
import {
  listUnstyled,
  defaultTransitionProps,
  respond,
  dragging,
  utilityPrimary
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const collectableMinHeight = `50px`;
const collectableVerticalPadding = `5px`;

export const List = styled.ul`
  ${listUnstyled}
  position: relative;
  min-height: calc(${collectableMinHeight} + ${collectableVerticalPadding} * 2);
  margin-block-start: -${collectableVerticalPadding};
  margin-block-end: -${collectableVerticalPadding};
`;

export const Wrapper = styled.div`
  padding-block-start: ${collectableVerticalPadding};
  padding-block-end: ${collectableVerticalPadding};
`;

export const WrapperEmpty = styled(Wrapper)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(${collectableMinHeight} + ${collectableVerticalPadding} * 2);
`;

export const Collectable = styled("article", transientOptions)`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--box-medium-bg-color);
  padding-inline-start: 14px;
  border-radius: var(--box-border-radius);

  ${({ $isDragging }) => $isDragging && dragging}
`;

export const CollectableEmpty = styled.div`
  --label-margin-bottom: 0;

  display: flex;
  background-color: var(--box-medium-bg-color);
  align-items: center;
  justify-content: center;
  padding-block-start: 9px;
  padding-block-end: 9px;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  color: var(--color-base-neutral80);
  border-radius: var(--box-border-radius);

  > * + * {
    margin-left: 8px;
  }

  svg {
    transform: translateY(1px);
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  min-width: 0;
  margin-block-start: 6px;
  margin-block-end: 8px;

  > * + * {
    margin-left: 15px;
  }

  svg {
    flex-shrink: 0;
    color: var(--color-base-neutral80);
    transform: translateY(2px);
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: min(1vw, 10px);
  align-items: center;
  margin-inline-start: 10px;
  color: var(--color);
  transition: transform var(--transition-duration-default)
    ${defaultTransitionProps};
  transform: translateX(80px);

  ${respond(
    `transition: none;
    transform: translateX(0);`,
    50,
    "max"
  )}

  ${({ $keyboardActions }) =>
    $keyboardActions &&
    `
      transition: transform ${defaultTransitionProps};
      transform: translateX(0);
      `}
`;

export const TabGroup = styled.div`
  display: inherit;
  gap: inherit;
`;

export const KeyboardActions = styled.div`
  display: inherit;
  gap: inherit;
  align-items: inherit;
  visibility: hidden;
  opacity: 0;
  transition: opacity ${defaultTransitionProps},
    visibility transform var(--transition-duration-default)
      var(--transition-duration-default) var(--transition-timing-function);

  ${respond(
    `
      width: 0;
      margin-left: 0;
      transition: none;`,
    50,
    "max"
  )}

  ${({ $visible }) =>
    $visible &&
    `
      visibility: visible;
      opacity: 1;
      transition: opacity var(--transition-duration-default) calc(var(--  transition-duration-default) / 2) var(--transition-timing-function),
      visibility var(--transition-duration-default) calc(var(--transition-duration-default) / 2) var(--transition-timing-function);
      `}
`;

export const Label = styled.span`
  ${utilityPrimary}
  display: block;
  margin-block-end: var(--label-margin-bottom, 20px);
  margin-block-start: 0;
  letter-spacing: 0.089em;
  font-size: 13px;
  color: inherit;
`;
