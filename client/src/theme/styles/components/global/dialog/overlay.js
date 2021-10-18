import { transparentize } from "theme/styles/mixins";

export default `
  .dialog-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    .backend & {
      background-color: ${transparentize("neutralBlack", 0.35)};
    }

    .browse &,
    .reader & {
      background-color: ${transparentize("neutralWhite", 0.1)};
    }
  }
`;
