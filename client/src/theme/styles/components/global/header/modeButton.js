import { utilityPrimary, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .mode-button {
    ${utilityPrimary}
    display: inline-block;
    padding: 5px 8.5px 7px;
    font-size: 12px;
    color: var(--header-foreground-color);
    text-decoration: none;
    letter-spacing: 0.134em;
    white-space: nowrap;
    border: 1px solid;
    border-radius: 4px;
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};

    &:hover {
      color: var(--color-neutral-text-extra-dark);
      background-color: var(--color-interaction-light);
      border-color: var(--color-interaction-light);
      outline: 0;
    }

    .bg-neutral90 &,
    .user-links--dark &,
    .user-nav--dark & {
      &:hover {
        color: var(--color-base-neutral90);
      }
    }
  }
`;
