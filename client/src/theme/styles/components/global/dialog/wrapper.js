import { respond, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-right: var(--container-padding-inline-responsive);
    padding-left: var(--container-padding-inline-responsive);
    visibility: visible;
    opacity: 1;
    transition: opacity ${defaultTransitionProps},
      visibility ${defaultTransitionProps};

    ${respond(
      `
      padding-right: var(--container-padding-inline-full);
      padding-left: var(--container-padding-inline-full);
    `,
      120
    )}

    &.dialog-appear {
      visibility: visible;
      opacity: 0;
    }
  }
`;
