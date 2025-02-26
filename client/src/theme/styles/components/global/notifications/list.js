export default `
  .notifications-list {
    width: 100%;

    &--updating {
      /* transition: transform var(--transition-duration-default) ease-out; */
    }

    &--context-header {
      position: fixed;
      inset-block-start: calc(
        var(--library-header-height, 82px) + var(--press-header-height, 0px)
      );
    }
  }
`;
