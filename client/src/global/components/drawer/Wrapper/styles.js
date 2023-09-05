import styled from "@emotion/styled";
import { transparentize, defaultTransitionProps } from "theme/styles/mixins";

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${transparentize("neutralBlack", 0.35)};
  z-index: 500;

  .drawer-enter ~ & {
    opacity: 0.01;
  }

  .drawer-enter-active ~ & {
    opacity: 1;
    transition: opacity ${defaultTransitionProps};
  }

  .drawer-exit ~ & {
    opacity: 1;
  }

  .drawer-exit-active ~ & {
    opacity: 0.01;
    transition: opacity ${defaultTransitionProps};
  }
`;

export const NotesOverlay = styled(Overlay)`
  @keyframes drawerOverlayFade {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  opacity: 0;
  z-index: 150;
  animation: drawerOverlayFade ${defaultTransitionProps} forwards;

  .panel-visible &,
  .drawer-enter-done ~ & {
    opacity: 1;
  }

  .panel-exit &,
  .drawer-exit ~ & {
    opacity: 1;
    animation: drawerOverlayFade ${defaultTransitionProps} backwards;
  }

  .panel-exit.panel-exit-active &,
  .drawer-exit.drawer-exit-active ~ & {
    opacity: 0;
  }
`;

export const AnnotationsOverlay = styled(Overlay)`
  z-index: 150;
`;
