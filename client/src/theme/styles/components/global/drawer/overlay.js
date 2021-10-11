import { transparentize, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${transparentize("neutralBlack", 0.35)};

    .drawer-enter & {
      opacity: 0.01;
    }

    .drawer-enter-active & {
      opacity: 1;
      transition: opacity ${defaultTransitionProps};
    }

    .drawer-exit & {
      opacity: 1;
    }

    .drawer-exit-active & {
      opacity: 0.01;
      transition: opacity ${defaultTransitionProps};
    }
  }
`;
