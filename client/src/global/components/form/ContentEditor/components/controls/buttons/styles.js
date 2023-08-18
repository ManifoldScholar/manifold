import styled from "@emotion/styled";
import {
  buttonUnstyled,
  defaultTransitionProps,
  formLabelPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

export const Button = styled.button`
  ${buttonUnstyled}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  width: 28px;
  background-color: none;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  border-radius: 4px;
  margin-inline-start: 3px;

  &:hover {
    background-color: var(--background-color);
    color: inherit;
  }

  &[data-active="true"] {
    color: var(--drawer-bg-color);
    background-color: var(--color-accent-primary);
  }

  &:focus-visible,
  &:focus {
    ${defaultFocusStyle}
  }
`;

export const SelectTooltipWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TooltipIcon = styled.div`
  position: relative;
  width: max-content;
  margin-block-start: -3px;
  margin-inline-start: 5px;
  cursor: pointer;
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const Select = styled.select`
  ${buttonUnstyled}
  font-family: var(--font-family-sans);
  line-height: 22px;
  font-size: 14px;
  width: 120px;
  height: 28px;
  display: inline-block;
  border-radius: 4px;
  padding-block-start: 2px;
  padding-block-end: 4px;
  padding-inline-start: 8px;

  .backend & {
    color: var(--color);

    &[data-active="true"] {
      color: var(--drawer-bg-color);
      background-color: ${({ $color }) => $color};
    }

    &:hover {
      background-color: var(--background-color);
      color: var(--color);
    }
  }

  &:focus-visible,
  &:focus {
    ${defaultFocusStyle}
  }
`;

export const SpanButton = styled(Select)`
  width: auto;
  padding-inline: 8px;

  .backend & {
    &[data-active="true"] {
      color: var(--drawer-bg-color);
      background-color: var(--color-base-blue45);
    }

    &:hover {
      background-color: var(--background-color);
      color: var(--color);
    }
  }

  &:focus-visible,
  &:focus {
    ${defaultFocusStyle}
  }
`;

export const SelectIcon = styled(IconComposer)`
  position: absolute;
  top: 25%;
  right: 4px;
  pointer-events: none;

  select[data-active="true"]:not(:hover) + & {
    color: var(--drawer-bg-color);
  }
`;

export const StylesButton = styled.button`
  ${buttonUnstyled}
  ${formLabelPrimary}
  padding-inline-start: 12px;
  padding-inline-end: 16px;
  padding-block: 6px;
  background-color: var(--box-bg-color);
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-inline-start: auto;

  svg {
    margin-top: 3px;
  }

  &:hover {
    background-color: var(--color-accent-primary);
    color: var(--box-bg-color);
  }
`;
