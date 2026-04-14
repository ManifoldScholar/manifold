import { defaultTransitionProps } from "theme/styles/mixins";

export default `
  .header-border {
    position: absolute;
    width: 100%;
    visibility: hidden;
    border-bottom: 1px solid var(--color-base-neutral40);
    opacity: 0;
    transition: opacity ${defaultTransitionProps},
      visibility ${defaultTransitionProps};
  }
`;
