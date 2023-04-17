import styled from "@emotion/styled";
import {
  buttonUnstyled,
  defaultTransitionProps,
  formLabelPrimary
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

  &:hover {
    background-color: var(--background-color);
    color: inherit;
  }

  &[data-active="true"] {
    color: var(--drawer-bg-color);
    background-color: var(--color-accent-primary);
  }

  &:first-child {
    margin-inline-start: -5px;
  }
`;

export const HTMLToggle = styled.button`
  color: var(--color-accent-primary);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  margin-inline-start: auto;
  align-self: center;
  border-radius: 4px;
`;

export const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export const Select = styled.select`
  ${buttonUnstyled}
  font-family: var(--font-family-sans);
  color: var(--color) !important;
  line-height: 22px;
  font-size: 14px;
  width: 110px;
  height: 28px;
  display: inline-block;
  border-radius: 4px;
  padding-block-start: 2px;
  padding-block-end: 4px;
  padding-inline-start: 8px;

  &:hover {
    background-color: var(--background-color);
  }
`;

export const SelectIcon = styled(IconComposer)`
  position: absolute;
  top: 25%;
  right: 4px;
  pointer-events: none;
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
`;