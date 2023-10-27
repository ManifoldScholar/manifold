import styled from "@emotion/styled";
import {
  buttonUnstyled,
  defaultFocusStyle,
  formLabelPrimary,
  respond
} from "theme/styles/mixins";
import { rteElements, inlineNodes, markElements } from "../../utils/elements";

export const ButtonGroup = styled.div`
  display: none;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: absolute;
  top: 5px;
  right: auto;
  left: 5px;
  color: var(--color-accent-primary);

  ${({ $visible }) => $visible && `display: flex;`}
  ${respond(`right: -60px; left: auto; top: -5px;`, 65)}
`;

export const InteriorButton = styled.button`
  ${buttonUnstyled}
  width: 34px;
  height: 34px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-neutral-text-light);
  background: var(--color-base-neutral90);
  border-radius: 4px;
  border: 1px solid var(--color);

  &:hover {
    color: ${({ $color }) =>
      $color === "red"
        ? `var(--color-notification-error-light)`
        : `var(--color-accent-primary)`};
    border-color: ${({ $color }) =>
      $color === "red"
        ? `var(--color-notification-error-light)`
        : `var(--color-accent-primary)`};
  }
`;

export const Content = styled.img`
  display: inline;
  ${({ $selected }) => $selected && `${defaultFocusStyle} outline-offset: 1px;`}
`;
export const ImageWrapper = styled.span`
  display: inline-block;
  width: max-content;
  max-width: 100%;
  position: relative;

  &.responsive-iframe {
    display: block;
    width: 100%;
    overflow: visible;
  }
`;

export const VoidOuter = styled.div`
  & + & {
    margin-block-start: 20px;
  }
`;

export const VoidInner = styled.div`
  display: block;
  margin-inline-start: -5%;
  width: 110%;
  padding-inline: 8%;
  padding-block-end: 20px;
  padding-block-start: 20px;
  position: relative;
  background-color: var(--drawer-bg-color);
  box-shadow: 3px 3px 10px var(--color-base-neutral100);
  border-radius: 4px;
  border: 0;

  .scheme-light & {
    background-color: var(--color-base-neutral20);
    box-shadow: 3px 3px 10px var(--color-base-neutral30);
  }

  ${({ $selected }) =>
    $selected &&
    `outline: solid 2px var(--disabled-control-color); outline-offset: 1px;`}
`;

export const VoidLabel = styled.span`
  ${formLabelPrimary}
  font-size: 14px;
  color: var(--color-base-yellow20);
  display: inline-flex;
  gap: 6px;
  align-items: center;

  .scheme-light & {
    color: var(--color-base-violet75);
  }

  > svg {
    margin-top: 1px;
  }
`;

export const HrOuter = styled.span`
  display: inline-flex;
  width: 100%;
`;

export const HrInner = styled.span`
  flex-grow: 1;
  margin: 0;
  width: 100%;
`;

export const COLOR_MAP = {
  green: {
    light: "var(--color-interaction-dark)",
    dark: "var(--color-accent-primary)"
  },
  blue: { light: "var(--color-base-blue75)", dark: "var(--color-base-blue45)" },
  violet: {
    dark: "var(--color-base-violet45)",
    light: "var(--color-base-violet75)"
  }
};

export const ElementLabel = styled.span`
  position: absolute;
  display: inline-block;
  left: -8px;
  top: -26px;
  font-size: 14px;
  line-height: 1;
  padding: 2px;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-regular);
  border: 0px solid;
  border-bottom: 0;
  white-space: nowrap;
  text-indent: 0;
  z-index: 10;
  padding-inline: 4px;
  padding-block-start: 2px;
  padding-block-end: 4px;
  text-decoration: none;
  text-transform: none;
  font-variant: none;

  .scheme-dark & {
    background: ${({ $color }) => COLOR_MAP[$color].dark};
    color: var(--drawer-bg-color);
  }

  .scheme-light & {
    background: ${({ $color }) => COLOR_MAP[$color].light};
    color: var(--background-color);
  }

  &:hover {
    z-index: 20;
  }
`;

export const EditableElementLabel = styled(ElementLabel)`
  top: -35px;
  padding-block-start: 4px;
  display: flex;
  align-items: center;

  > span {
    line-height: 1;
  }
`;

export const ClassInput = styled.input`
  appearance: none;
  background: rgba(255, 255, 255, 0.75);
  border: none;
  padding: 0;
  height: 18px;
  margin-inline-start: 3px;
  width: 150px;

  .scheme-light & {
    background: rgba(0, 0, 0, 0.5);
  }

  &:focus-visible {
    outline: 1px solid;
  }
`;

export const TagButtons = styled.div`
  display: flex;
  gap: 4px;
  margin-inline-start: 8px;
  margin-inline-end: 4px;
`;

export const DeleteButton = styled.button`
  ${buttonUnstyled}
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 2px;

  &:hover,
  &:focus-visible {
    color: var(--error-color);
    background: var(--background-color);
  }

  &:disabled {
    cursor: default;

    &:hover {
      background: none;
      color: inherit;
    }
  }
`;

export const LiftButton = styled(DeleteButton)`
  &:hover,
  &:focus-visible {
    color: var(--hover-color);
    background: var(--background-color);
  }
`;

export const getHtmlOutlineStyles = (nodeName, darkMode) => {
  /* eslint-disable no-nested-ternary */
  const color = rteElements.includes(nodeName)
    ? "green"
    : inlineNodes.includes(nodeName) || markElements.includes(nodeName)
    ? "blue"
    : "violet";

  return {
    outline: "2px dotted",
    outlineColor: darkMode ? COLOR_MAP[color].dark : COLOR_MAP[color].light,
    borderRadius: "2px",
    borderTopLeftRadius: 0,
    outlineOffset: "6px",
    position: "relative"
  };
};
