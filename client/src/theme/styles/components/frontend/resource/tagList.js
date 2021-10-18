import {
  listUnstyled,
  utilityPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
  /* <nav> around <ul> */
  .resource-tag-list {
    ul {
      ${listUnstyled}
    }

    li {
      ${utilityPrimary}
      display: inline;
      font-size: 13px;
      color: var(--color-base-neutral40);

      + li::before {
        content: ", ";
      }
    }

    a {
      color: var(--color-base-neutral40);
      text-decoration: none;
      transition: color ${defaultTransitionProps};

      &.disabled {
        pointer-events: none;
      }

      &:not(.disabled):hover {
        color: var(--color-accent-primary);
      }
    }
  }
`;
