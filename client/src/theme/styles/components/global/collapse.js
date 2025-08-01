export default `
  .collapse {
    &__content {
      --hidden-height: 0;
      --collapse-height: 0;
      --collapse-duration: 0;
      --collapse-delay: 0;
      --collapse-durationAfterDelay: 0;

      &--visible {
        overflow: hidden;
        max-height: var(--collapse-height);
        opacity: 1;
        transition:
          max-height var(--collapse-duration) linear 0ms,
          opacity var(--collapse-durationAfterDelay) ease var(--collapse-delay);
      }

      &--hidden {
        overflow: hidden;
        max-height: var(--hidden-height);
        opacity: 0;
        transition:
          max-height var(--collapse-durationAfterDelay) linear 0ms,
          opacity var(--collapse-duration) ease var(--collapse-delay);
      }

      &--stub {
        opacity: 1;
      }

      &--stub-only {
        cursor: default;
      }
    }
  }
`;
