import {
  defaultTransitionProps,
  defaultHoverStyle,
  transparentize,
  buttonTrimPrimary
} from "theme/styles/mixins";
import { baseColors } from "theme/styles/variables/colors";

export default `
  .truncated {
    &__wrapper {
      position: relative;
      overflow: hidden;
      transition: height ${defaultTransitionProps};

      &::before,
      &::after {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4em;
        content: "";
        opacity: 0;
      }

      &::before {
        transition: opacity var(--transition-duration-slow)
          var(--transition-timing-function) var(--transition-duration-default);
      }

      &--light::before {
        background: linear-gradient(
          to top,
          ${baseColors.neutral05} 10%,
          ${transparentize("neutral05", 1)} 100%
        );
      }

      &--dark::before {
        background: linear-gradient(
          to top,
          ${baseColors.neutral10} 10%,
          ${transparentize("neutral10", 1)} 100%
        );
      }

      &--blur::before {
        opacity: 1;
      }

      &::after {
        /* hover effect (approximates bumping gradient to baseColors.neutral20 */
        background: linear-gradient(
          to top,
          ${transparentize("neutral30", 0.8)} 10%,
          ${transparentize("neutral30", 1)} 100%
        );
        transition: opacity ${defaultTransitionProps};
      }
    }

    &__expand-button {
      ${buttonTrimPrimary}
      position: relative;
      padding-top: 11px;
      padding-bottom: 0;
      margin-top: -8px;
      font-size: 13px;
      color: var(--color-base-neutral90);
      visibility: visible;
      border: 0;
      border-top: 1px solid var(--color-base-neutral90);
      opacity: 1;
      transition: margin var(--transition-duration-default) linear,
        color ${defaultTransitionProps}, border-color ${defaultTransitionProps},
        padding-top var(--transition-duration-default)
          var(--transition-timing-function) var(--transition-duration-fast),
        opacity var(--transition-duration-default)
          var(--transition-timing-function) var(--transition-duration-fast),
        visibility var(--transition-duration-default)
          var(--transition-timing-function) var(--transition-duration-fast);

      &:hover {
        ${defaultHoverStyle}
        border-color: var(--hover-color);
      }

      &--hidden {
        padding-top: 0;
        visibility: hidden;
        opacity: 0;
      }
    }
  }
`;
