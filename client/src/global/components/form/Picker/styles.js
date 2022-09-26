import styled from "@emotion/styled";
import {
  buttonUnstyled,
  listUnstyled,
  formInputBase,
  defaultTransitionProps,
  fluidScale
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";
import BaseList from "./List";

const BUTTON_PADDING_LATERAL = 8;
const ICON_SIZE = 16;
const BUTTON_WIDTH = ICON_SIZE + BUTTON_PADDING_LATERAL * 2;

export const Wrapper = styled.div`
  position: relative;
`;

export const InputWrapper = styled.div`
  position: relative;

  .backend & {
    background-color: var(--color-base-neutral90);
  }
`;

export const ComboBox = styled.div`
  border: 1px solid var(--color-base-neutral70);
`;

export const TextInput = styled.input`
  ${formInputBase}
  width: 100%;
  outline: 0;
  border: 1px solid;
  transition: border-color ${defaultTransitionProps};
  border-radius: 0;
  appearance: none;
  outline: 0;
  font-size: ${fluidScale("18px", "16px")};

  padding-right: ${({ $paddingFactor }) =>
    `${BUTTON_WIDTH * $paddingFactor + BUTTON_PADDING_LATERAL}px`};
`;

export const TextInputSecondary = styled(TextInput)`
  height: auto;
  padding-block-start: 8px;
  padding-block-end: 13px;
  padding-inline-start: 17px;
  border: 0;
  background: transparent;

  &:focus-visible {
    border: 0;
  }

  &::placeholder {
    color: var(--color-base-neutral10);
  }
`;

export const ButtonGroup = styled.div`
  position: absolute;
  top: 50%;
  right: ${BUTTON_PADDING_LATERAL}px;
  display: flex;
  pointer-events: none;
  transform: translateY(-50%);
`;

export const Button = styled.button`
  ${buttonUnstyled}
  padding: ${BUTTON_PADDING_LATERAL}px 6px;
  color: var(--color-accent-primary);
`;

export const IconReset = styled(IconComposer)`
  pointer-events: all;
`;

export const IconDisclosure = styled(IconComposer)`
  pointer-events: none;
`;

export const ResultsList = styled.ul`
  ${listUnstyled}
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 210px;
  padding: 8px 0;
  overflow: auto;
  color: var(--color-base-neutral10);
  visibility: hidden;
  background-color: var(--color-base-neutral90);
  border-color: var(--color-base-neutral80);
  border-style: solid;
  border-width: 0 1px 1px;
  opacity: 0;
  transition: opacity var(--transition-duration-fast)
      var(--transition-timing-function),
    visibility var(--transition-duration-fast) var(--transition-timing-function);
  z-index: 100;

  ${({ $open }) =>
    $open &&
    `visibility: visible;
    opacity: 1;
    `}
`;

export const Result = styled.li`
  --Result-bg-color: ${({ $active, $selected }) => {
    if ($active && $selected) return "var(--color-base-neutral75);";
    if ($active) return "var(--color-base-neutral80);";
    if ($selected) return "var(--color-base-neutral85);";
    return "inherit;";
  }}

  padding: 8px 17px;
  font-family: var(--font-family-sans);
  color: var(--color-base-neutral10);
  cursor: pointer;
  background: var(--Result-bg-color);

  & + & {
    border: 0;
  }

  &:hover {
    background: var(--color-base-neutral80);
  }
`;

export const EmptyResult = styled(Result)`
  color: var(--color-base-neutral45);
  cursor: inherit;

  &:hover {
    background: inherit;
  }
`;

export const List = styled(BaseList)`
  margin-block-start: ${({ $tight }) => ($tight ? 0 : "24px")};
`;

export const Utility = styled.div`
  margin-block-start: 12px;
  margin-block-end: 8px;
`;
