import {
  buttonUnstyled,
  listUnstyled,
  buttonAvatar,
  defaultTransitionProps,
  defaultHoverStyle,
  tailUp,
  rgba,
  respond
} from "theme/styles/mixins";

export default `
  .button-avatar {
    ${buttonUnstyled}
    height: 100%;
    vertical-align: middle;

    .avatar {
      ${buttonAvatar(
        32,
        "var(--header-foreground-color, var(--color-neutral-text-dark))"
      )}
    }

    &--frontend,
    &--backend {
      padding-top: 5px;
      padding-bottom: 5px;

      .avatar {
        transition: color ${defaultTransitionProps};
      }

      &:hover,
      &.button-active {
        .avatar {
          ${defaultHoverStyle}
        }
      }
    }

    &--frontend {
      &:focus-visible {
        outline: 0;

        .avatar {
          ${defaultHoverStyle}
        }
      }
    }

    &--reader {
      .avatar {
        color: inherit;
      }
    }

    svg {
      color: inherit;
    }
  }

  .user-menu {
    position: absolute;
    right: -20px;
    color: var(--color-neutral-text-dark);
    white-space: nowrap;
    background-color: var(--color-base-neutral05);

    &--frontend,
    &--backend {
      z-index: 1;
      min-width: 251px;
      border-radius: var(--box-border-radius);
      box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};
    }

    &--reader {
      width: 100%;

      ${respond(`width: auto;`, 50)}
    }

    &__tail {
      ${tailUp("var(--color-base-neutral05)", "17px")}
      position: absolute;
      top: -17px;
      right: 25px;
    }

    &__list {
      ${listUnstyled}
      padding-top: 11px;
      padding-bottom: 15px;
    }

    &__item {
      font-size: 16px;
      font-family: var(--font-family-sans);
    }

    &__link {
      ${buttonUnstyled}
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 20px;
      text-decoration: none;
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      &:hover,
      &:focus-visible {
        color: var(--color-base-neutral90);

        .user-menu--reader & {
          background-color: var(--color-base-neutral30);
        }
      }

      &:focus-visible {
        background-color: var(--color-base-neutral30);
        outline: 0;
      }
    }

    &__icon {
      position: relative;
      top: 2px;
      margin-right: 10px;
      transition: color ${defaultTransitionProps};

      .user-menu--frontend &,
      .user-menu--backend & {
        color: var(--color-neutral-ui-dark);
      }

      .user-menu__link:hover &,
      .user-menu__link:focus-visible & {
        color: var(--color-base-neutral90);
      }
    }

    ${respond(`right: -24px;`, 40)}
  }
`;
