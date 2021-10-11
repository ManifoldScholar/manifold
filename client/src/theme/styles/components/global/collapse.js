export default `
  .collapse {
    &__content {
      --collapse-height: 0;
      --collapse-duration: 0;
      --collapse-delay: 0;
      --collapse-durationAfterDelay: 0;

      overflow: hidden;

      &--visible {
        height: var(--collapse-height);
        visibility: 1;
        opacity: 1;
        transition: height var(--collapse-duration) linear 0ms,
          opacity var(--collapse-durationAfterDelay) ease var(--collapse-delay);
      }

      &--hidden {
        height: 0;
        visibility: 0;
        opacity: 0;
        transition: height var(--collapse-durationAfterDelay) linear 0ms,
          opacity var(--collapse-duration) ease var(--collapse-delay),
          visibility var(--collapse-duration);
      }
    }
  }
`;
