import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import {
  utilityPrimary,
  defaultTransitionProps,
  defaultHoverStyle
} from "theme/styles/mixins";

export const ZoomIndicator = styled.div`
  ${utilityPrimary}
  position: absolute;
  top: 30px;
  right: 30px;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 5.5px 11px 7.5px 13px;
  font-size: 12px;
  cursor: pointer;
  background-color: var(--color-base-neutral95);
  opacity: 0.9;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover {
    ${defaultHoverStyle}
  }
`;

export const Icon = styled(IconComposer)`
  margin-left: 4px;
`;
