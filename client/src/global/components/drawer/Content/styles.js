import styled from "@emotion/styled";
import {
  defaultTransitionProps,
  respond,
  reactSlideTransition,
  drawerPadding
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export const Drawer = styled.div`
  position: fixed;
  bottom: 0;
  top: var(--library-header-height, 82px);
  width: 100%;
  overflow: auto;
  background-color: var(--drawer-bg-color);
  transition: transform ${defaultTransitionProps};
  padding: 20px var(--container-padding-inline-responsive) 33px;
  z-index: 400;

  .utility-primary {
    color: var(--color-base-neutral-white);
  }

  .form-secondary .form-select {
    width: 100%;
  }

  .actions {
    margin-top: 40px;

    ${respond(`margin-top: 60px;`, 95)}
  }

  &.left {
    ${reactSlideTransition("left", "&", "drawer")}
    right: auto;
    left: 0;
  }

  &.right {
    ${reactSlideTransition("right", "&", "drawer")}
    right: 0;
    left: auto;
  }

  ${respond(`width: 400px;`, 65)}
  ${respond(`width: 555px;`, 90)}
  ${respond(`padding: 33px 48px;`, 90)}

  &.wide {
    ${respond(`width: 555px;`, 75)}
    ${respond(`width: 860px;`, 120)}
  }

  &.flexible {
    ${respond(
      `width: auto;
      max-width: 75%;`,
      75
    )}

    ${respond(
      `max-width: 1024px;`,
      `${(parseInt(breakpoints[95], 10) * 4) / 3}px`
    )}
    ${respond(
      `width: calc((100vw - var(--container-width-inner) / 2));`,
      `${parseInt(breakpoints[120], 10) + 1000}px`
    )}
  }

  &.pad-large {
    ${respond(`padding: 33px 48px;`, 65)}
    ${respond(`padding: 33px 156px 66px 98px;`, 90)}
    ${respond(
      `padding: 33px 70px;`,
      `${parseInt(breakpoints[120], 10) + 1000}px`
    )}
  }
`;

export const DrawerReader = styled(Drawer)`
  top: var(--reader-header-height);
  z-index: 150;
  padding: 0 !important;

  @keyframes notesSlide {
    from {
      transform: translateX(100%);
    }

    to {
      transform: translateX(0);
    }
  }

  .panel-visible & {
    animation: notesSlide ${defaultTransitionProps} forwards;
  }

  .panel-exit & {
    transform: translateX(0);

    animation: notesSlide ${defaultTransitionProps} backwards;
  }

  .panel-exit.panel-exit-active & {
    transform: translateX(100%);
  }

  .notes-message {
    ${drawerPadding("padding-right", "narrow")}
    ${drawerPadding("padding-left", "narrow")}
    margin-top: 0;
  }
`;

export const DrawerOverlay = styled(Drawer)`
  top: 0;
`;
