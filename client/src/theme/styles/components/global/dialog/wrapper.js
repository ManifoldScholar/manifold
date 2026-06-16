import { respond, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .dialog-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    display: grid;
    align-items: center;
    width: 100%;
    height: 100%;
    padding-inline: var(--container-padding-inline-responsive);
    padding-block: 0.75rem;
    visibility: visible;
    opacity: 1;
    transition: opacity ${defaultTransitionProps};
    overflow-y: auto;

    @starting-style {
      opacity: 0;
    }

    ${respond(
      `
      padding-right: var(--container-padding-inline-full);
      padding-left: var(--container-padding-inline-full);
    `,
      120
    )}
  }
`;
