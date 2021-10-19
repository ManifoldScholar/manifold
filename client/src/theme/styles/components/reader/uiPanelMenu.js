import { respond, reactSlideTransition } from "theme/styles/mixins";

export const uiPanelMenu = `
  --hover-color: var(--color-interaction-dark);

  ${reactSlideTransition()}
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  background-color: var(--color-base-neutral05);

  ${respond(`width: auto;`, 50)}

.panel-hidden {
  .screen-reader-text {
    visibility: hidden;
  }
}
`;
