export default `
  .collapse {
    &__content {
      --hidden-height: 0;
      --collapse-height: 0;
      --collapse-duration: 0;
      --collapse-delay: 0;
      --collapse-durationAfterDelay: 0;

      overflow: hidden;

      &--visible {
        height: var(--collapse-height);
        visibility: visible;
        opacity: 1;
        transition: height var(--collapse-duration) linear 0ms,
          opacity var(--collapse-durationAfterDelay) ease var(--collapse-delay);
      }

      &--hidden {
        height: var(--hidden-height);
        visibility: hidden;
        opacity: 0;
        transition: height var(--collapse-durationAfterDelay) linear 0ms,
          opacity var(--collapse-duration) ease var(--collapse-delay),
          visibility var(--collapse-duration);
      }

      &--stub {
        visibility: visible;
        opacity: 1;
      }
    }
  }
`;
