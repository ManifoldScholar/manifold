import { transparentize } from "theme/styles/mixins";

export default `
  .rh5v-DefaultPlayer_component {
    font-family: var(--font-family-heading);

    &:fullscreen {
      background-color: var(--color-base-neutral-black);
    }
  }

  .rh5v-Overlay_inner {
    left: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    background-color: ${transparentize("neutralBlack", 0.78)};
    border-radius: 0;

    svg {
      width: 68px;
      height: 68px;
      padding: 6px;
      background-color: var(--color-accent-primary);
      border-radius: 100%;
    }
  }

  .rh5v-PlayPause_button,
  .rh5v-Volume_button,
  .rh5v-Fullscreen_button {
    svg {
      width: 100%;
      height: 100%;
    }
  }
`;
