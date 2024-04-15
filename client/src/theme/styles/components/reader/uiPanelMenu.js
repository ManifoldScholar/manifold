import { respond, rgba, reactSlideTransition } from "theme/styles/mixins";
import { ZOOM_BREAKPOINT } from "./readerHeader";

export const uiPanelMenu = `
  ${reactSlideTransition()}
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  background-color: var(--box-bg-color);
  box-shadow: 0 12px 22px -3px ${rgba("neutralBlack", 0.13)};
  overflow: auto;
  max-block-size: calc(100vh - var(--reader-header-height) * 2);

  ${respond(
    `max-block-size: calc(100vh - var(--reader-header-height));`,
    ZOOM_BREAKPOINT
  )}

  ${respond(`width: auto;`, 50)}

  .panel-hidden {
    .screen-reader-text {
      visibility: hidden;
    }
  }
`;
