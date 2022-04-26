import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import {
  defaultTransitionProps,
  unstyledSelect,
  utilityPrimary
} from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";

const ICON_WIDTH = 24;
const ICON_PADDING = 12;

export const borderStyles = `
  border: 1px solid var(--select-border-color);
  border-radius: 6px;
`;

export const Wrapper = styled.div`
  position: relative;
  flex-basis: ${entityFilterForm.selectMinWidth}px;
`;

const sharedIconStyles = `
  position: absolute;
  top: 50%;
  color: var(--select-border-color);
  pointer-events: none;
  transform: translateY(-50%);
`;

export const DisclosureIcon = styled(IconComposer)`
  ${sharedIconStyles}
  inset-inline-end: ${ICON_PADDING}px;
`;

export const PreIcon = styled(IconComposer)`
  ${sharedIconStyles}
  inset-inline-start: ${ICON_PADDING}px;
`;

export const Select = styled.select`
  ${unstyledSelect}
  ${utilityPrimary}
  padding: 11px ${ICON_WIDTH +
    ICON_PADDING * 1.5}px 13px var(--padding-inline-start, 13px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 13px;
  ${borderStyles}
  transition: border-color ${defaultTransitionProps};

  &.focus-visible {
    border-color: var(--hover-color);
  }

  ${PreIcon} + & {
    --padding-inline-start: ${ICON_WIDTH + ICON_PADDING * 2}px;
  }

  option {
    color: var(--color-base-neutral-black);
  }
`;
