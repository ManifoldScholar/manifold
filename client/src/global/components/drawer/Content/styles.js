import styled from "@emotion/styled";
import {
  defaultTransitionProps,
  respond,
  drawerPadding
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { ZOOM_BREAKPOINT } from "theme/styles/components/reader/readerHeader";

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
  --Dropzone-max-width: 100%;

  position: fixed;
  bottom: 0;
  top: ${({ $fullHeight }) =>
    $fullHeight ? 0 : `var(--library-header-height, 82px)`};
  width: 100%;
  overflow: auto;
  background-color: var(--drawer-bg-color);
  transition: transform ${defaultTransitionProps};
  padding: 20px var(--container-padding-inline-responsive) 33px;
  z-index: 500;

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

  &.fixed {
    max-width: 800px;
    width: 100%;
  }

  &.pad-large {
    ${respond(`padding: 33px 48px;`, 65)}
    ${respond(`padding: 33px 156px 66px 98px;`, 90)}
    ${respond(
      `padding: 33px 70px;`,
      `${parseInt(breakpoints[120], 10) + 1000}px`
    )}
  }

  &.pad-xl {
    ${respond(`padding: 33px 70px;`, 65)}
  }
`;

export const DrawerReader = styled(Drawer)`
  --Dropzone-max-width: 350px;

  top: calc(var(--reader-header-height) * 2);
  z-index: 150;
  padding: 0 !important;

  ${respond(`top: var(--reader-header-height);`, ZOOM_BREAKPOINT)}

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

  &.wide {
    ${respond(`width: 585px;`, 75)}
    ${respond(`width: 920px;`, 120)}
  }
`;

export const DrawerOverlay = styled(Drawer)`
  --Dropzone-max-width: 350px;

  top: 0;
`;

function editorDrawerTransition(selector = "&", prefix = "drawer") {
  return `
    .${prefix}-enter ~ ${selector},
    .${prefix}-enter ${selector} {
      transform: translateY(-100%);
    }

    .${prefix}-enter-active ~ ${selector},
    .${prefix}-enter-active ${selector} {
      transition: transform 0.75s ease-out;
      transform: translateY(0);
    }

    .${prefix}-exit ~ ${selector},
    .${prefix}-exit ${selector} {
      transform: translateY(0);
    }

    .${prefix}-exit.${prefix}-exit-active ~ ${selector},
    .${prefix}-exit.${prefix}-exit-active ${selector} {
      transition: transform 0.5s ease-out;
      transform: translateY(-100%);
    }
  `;
}

export const DrawerEditor = styled(Drawer)`
  width: 100vw !important;
  min-height: 100vh;
  padding: 80px var(--container-padding-inline-responsive) 160px !important;
  top: 0;
  left: 0;
  bottom: auto;
  z-index: 500;
  ${editorDrawerTransition()}
`;

export const DrawerEditorInner = styled.div`
  max-width: 1040px;
  max-height: 500px;
  margin: auto;
`;
