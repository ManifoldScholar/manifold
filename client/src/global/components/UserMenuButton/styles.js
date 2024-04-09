import styled from "@emotion/styled";
import {
  buttonUnstyled,
  buttonAvatar,
  defaultTransitionProps,
  defaultHoverStyle,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Button = styled.button`
  ${buttonUnstyled}
  height: 100%;
  vertical-align: middle;

  .avatar {
    ${buttonAvatar(42, "var(--header-foreground-color)")}
  }

  ${({ $context }) =>
    $context === "reader"
      ? `
        padding-right: var(--padding-lateral-narrow);
        padding-left: var(--padding-lateral-narrow);

        &:hover,
        &.focus-visible,
        &[aria-expanded='true'] {
          color: var(--color-neutral-text-extra-dark);
          background-color: var(--color-interaction-light);
          outline: 0;
        }

        &.focus-visible {
          outline: 2px solid;
          outline-offset: -2px;
        }

        .avatar {
          width: 32px;
          height: 32px;
          color: inherit;
        }
        `
      : `
        .avatar {
          transition: color ${defaultTransitionProps};
        }

        &:hover {
          .avatar {
            ${defaultHoverStyle}
          }
        }

        &:focus-visible {
          .avatar {
            ${defaultFocusStyle}
          }
        }
  `}
`;
