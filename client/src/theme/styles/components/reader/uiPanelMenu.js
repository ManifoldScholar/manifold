import { respond, rgba, reactSlideTransition } from "theme/styles/mixins";

export const uiPanelMenu = `
  ${reactSlideTransition()}
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  background-color: var(--box-bg-color);
  box-shadow: 0 12px 22px -3px ${rgba("neutralBlack", 0.13)};

  ${respond(`width: auto;`, 50)}

  .panel-hidden {
    .screen-reader-text {
      visibility: hidden;
    }
  }
`;
