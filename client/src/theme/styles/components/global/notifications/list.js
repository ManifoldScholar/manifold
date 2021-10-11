export default `
  .notifications-list {
    width: 100%;

    &--updating {
      transition: transform var(--transition-duration-default) ease-out;
    }

    &--context-header {
      position: fixed;
      top: calc(
        var(--library-header-height, 82px) + var(--press-header-height, 0px)
      );
    }

    &__inner {
      .notifications-list--context-drawer & {
        margin-bottom: 26px;
        transition: transform var(--transition-duration-default) ease-out;

        &.notification-exit {
          visibility: visible;
          opacity: 1;
          transition: opacity 0s linear;
        }

        &.notification-exit-active {
          visibility: hidden;
          opacity: 0;
          transition: visibility 0s 0.5s, opacity 0.5s linear;
        }
      }

      .notifications-list--context-header & {
        + .notifications-list__inner {
          border-top: 1px solid var(--color-neutral-ui-extra-dark);
        }

        &.notification-exit {
          max-height: 200px;
          transition: transform 0.3s ease-in-out, max-height 0.2s ease-out 0.15s;
        }

        &.notification-exit-active {
          max-height: 0;
          transform: translate3d(-100%, 0, 0);
        }
      }
    }
  }
`;
