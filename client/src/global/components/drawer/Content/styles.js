import styled from "@emotion/styled";
import {
  defaultTransitionProps,
  respond,
  drawerPadding
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

function drawerSlideTransition(
  from = "right",
  selector = "&",
  prefix = "drawer"
) {
  return `
    .${prefix}-enter ~ ${selector},
    .${prefix}-enter ${selector} {
      transform: translateX(${from === "right" ? "100%" : "-100%"});
    }

    .${prefix}-enter-active ~ ${selector},
    .${prefix}-enter-active ${selector} {
      transition: transform ${defaultTransitionProps};
      transform: translateX(0);
    }

    .${prefix}-exit ~ ${selector},
    .${prefix}-exit ${selector} {
      transform: translateX(0);
    }

    .${prefix}-exit.${prefix}-exit-active ~ ${selector},
    .${prefix}-exit.${prefix}-exit-active ${selector} {
      transition: transform ${defaultTransitionProps};
      transform: translateX(${from === "right" ? "100%" : "-100%"});
    }
  `;
}

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
    ${drawerSlideTransition("left")}
    left: 0;
  }

  &.right {
    ${drawerSlideTransition()}
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

  .panel-exit & {
    transform: translateX(0);
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
