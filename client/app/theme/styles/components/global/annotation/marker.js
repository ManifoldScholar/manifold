import { marker, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .marker {
    ${marker}
    max-width: 240px;

    &[href] {
      transition: background-color ${defaultTransitionProps};

      &:hover {
        color: inherit;
        background-color: var(--box-medium-bg-color);
      }
    }

    &--secondary {
      color: var(--error-color);
    }

    & + & {
      margin-left: 8px;
    }
  }
`;
