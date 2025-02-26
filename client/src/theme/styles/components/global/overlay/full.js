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
    transition: opacity ${defaultTransitionProps};

    &:not([class*="bg-"]) {
      background-color: var(--drawer-bg-color);
    }

    @starting-style {
      opacity: 0;
    }

    &[inert] {
      opacity: 0;
    }
  }
`;
