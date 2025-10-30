import styled from "@emotion/styled";
import {
  defaultTransitionProps,
  filterSelectBase,
  utilityPrimary
} from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";
import IconComposer from "global/components/utility/IconComposer";

export const borderStyles = `
  border: 1px solid var(--select-border-color);
  border-radius: 6px;
`;

export const Wrapper = styled.div`
  position: relative;
`;

export const Label = styled.label`
  ${utilityPrimary}
  position: absolute;
  inset-block-end: 100%;
  font-size: 12px;
  display: block;
  margin-block-end: 8px;
`;

export const Select = styled.select`
  ${filterSelectBase}
  width: 100%;
  height: ${entityFilterForm.filterHeight};
  padding-top: 6px;
  padding-bottom: 8px;
  ${borderStyles}
  transition: border-color ${defaultTransitionProps};

  &:focus-visible {
    outline: solid 2px var(--focus-color);
  }

  option {
    color: var(--color-base-neutral-black);
  }
`;

export const Icon = styled(IconComposer)`
  position: absolute;
  inset-block-end: ${parseFloat(entityFilterForm.filterHeight) * 0.5}px;
  right: 12px;
  width: 24px;
  height: 24px;
  color: var(--select-border-color);
  pointer-events: none;
  transform: translateY(50%);
`;
