import {
  buttonUnstyled,
  buttonAvatar,
  defaultTransitionProps,
  defaultHoverStyle
} from "theme/styles/mixins";

export default `
  .button-avatar {
    ${buttonUnstyled}
    height: 100%;
    vertical-align: middle;

    .avatar {
      ${buttonAvatar(42, "var(--header-foreground-color)")}
    }

    &--frontend,
    &--backend {
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

    &--reader {
      .avatar {
        width: 32px;
        height: 32px;
        color: inherit;
      }
    }

    svg {
      color: inherit;
    }
  }
`;
