import styled from "@emotion/styled";
import { transparentize, defaultTransitionProps } from "theme/styles/mixins";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${transparentize("neutralBlack", 0.35)};
  z-index: var(--z-index, 500);
  transition: opacity ${defaultTransitionProps};

  &[inert] {
    opacity: 0;
  }
`;
