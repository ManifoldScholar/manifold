import { fluidScale, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .overlay-full {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding-bottom: ${fluidScale("110px", "48px")};
    overflow: auto;

    &:not([class*="bg-"]) {
      background-color: var(--drawer-bg-color);
    }

    .overlay-full-header + * {
      padding-top: 50px;
    }

    .overlay-full-appear & {
      opacity: 0.01;
    }

    .overlay-full-appear.overlay-full-appear-active & {
      opacity: 1;
      transition: opacity ${defaultTransitionProps};
    }

    .overlay-full-enter & {
      opacity: 0.01;
    }

    .overlay-full-enter.overlay-full-enter-active & {
      opacity: 1;
      transition: opacity ${defaultTransitionProps};
    }

    .overlay-full-exit & {
      opacity: 1;
    }

    .overlay-full-exit.overlay-full-exit-active & {
      opacity: 0.01;
      transition: opacity ${defaultTransitionProps};
    }
  }
`;
