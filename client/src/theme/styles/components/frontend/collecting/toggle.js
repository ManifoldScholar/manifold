import {
  respond,
  screenReaderText,
  defaultFocusStyle,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  rgba
} from "theme/styles/mixins";

const lightColor = `var(
  --collecting-toggle-light-color,
  var(--color-base-neutral05)
)`;
const darkColor = `var(
  --collecting-toggle-dark-color,
  var(--color-base-neutral75)
)`;
const inactiveColor = `var(
  --collecting-toggle-inactive-color,
  var(--color-base-neutral70)
)`;
const highlightFgColor = `var(--color-base-neutral90)`;
const highlightBgColor = `var(--color-base-blue45)`;

export default `
  .sr-collecting-toggle {
    ${screenReaderText}

    &.focus-visible ~ .collecting-toggle {
      ${defaultFocusStyle}
      outline-color: var(--focus-color);
    }
  }

  .collecting-toggle {
    --toggle-size: 24px;
    --toggle-color: ${highlightFgColor};
    --toggle-bg-color: ${inactiveColor};
    --icon-transform: none;
    --text-top-padding: 5px;

    ${buttonUnstyled}
    ${utilityPrimary}

    position: relative;
    width: var(--toggle-size);
    height: var(--toggle-size);
    font-size: 12px;
    text-align: left;
    white-space: nowrap;
    cursor: pointer;

    &--project-cover {
      --toggle-size: 28px;
      --text-top-padding: 7px;

      position: absolute;
      top: 25px;
      left: 0;

      ${respond(
        `
          top: calc(2.105vw + 15px);
          left: calc(2.105vw - 15px);
        `,
        75
      )}

      ${respond(
        `
          top: 40px;
          left: 10px;
        `,
        120
      )}
    }

    &--small-project-cover {
      --toggle-size: 28px;
      --text-top-padding: 7px;

      position: absolute;
      top: 10px;
      left: -15px;

      ${respond(
        `
          top: 15px;
        `,
        120
      )}
    }

    .backend & {
      --collecting-toggle-light-color: var(--color-base-neutral75);
      --collecting-toggle-dark-color: var(--color-base-neutral05);
      --collecting-toggle-inactive-color: var(--color-base-neutral10);
    }

    &__inner {
      position: absolute;
      top: 0;
      left: 0;
      max-width: 100%;
      height: 100%;
      overflow: hidden;
      color: var(--toggle-color);
      background-color: var(--toggle-bg-color);
      border-radius: 0.667em;
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      .collecting-toggle--project-cover &,
      .collecting-toggle--small-project-cover & {
        box-shadow: 2px 4px 10px 0 ${rgba("neutral90", 0.36)};
      }

      &--add-active,
      &--remove-active,
      &--remove-confirm-active {
        max-width: 145px;
        transition: max-width var(--transition-duration-slow) ease-out;
      }

      &--remove-active,
      &--remove-confirm-active {
        --toggle-color: ${lightColor};
        --toggle-bg-color: ${darkColor};
      }

      &--add,
      &--remove,
      &--remove-confirm-active {
        --toggle-color: ${lightColor};
      }

      &--remove,
      &--add-active {
        --toggle-color: ${highlightFgColor};
        --toggle-bg-color: ${highlightBgColor};
      }

      &--add {
        .collecting-toggle--outlined & {
          --toggle-color: currentColor;
          --toggle-bg-color: transparent;
        }
      }

      &--add,
      &--add-active,
      &--remove {
        --icon-transform: translateY(-100%);
      }

      &--remove-confirm-active {
        --icon-transform: translateY(100%);
      }

      .backend &--remove {
        --icon-transform: translateY(100%);
      }
    }

    &__text {
      display: block;
      padding: var(--text-top-padding) 14px 0 32px;
      line-height: 1;

      &-enter {
        opacity: 0;
      }

      &-enter-active {
        opacity: 1;
        transition: opacity calc(var(--transition-duration-default) * 3)
          var(--transition-timing-function);
      }

      &-exit {
        opacity: 1;
      }

      &-exit.collecting-toggle__text-exit-active {
        opacity: 0;
        transition: opacity calc(var(--transition-duration-default) * 3)
          var(--transition-timing-function);
      }
    }

    &__icons {
      position: absolute;
      width: 100%;
      height: 100%;
      transition: transform ${defaultTransitionProps};
      transform: var(--icon-transform);
    }

    &__icon {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--toggle-size);
      height: var(--toggle-size);

      &--confirm {
        top: -100%;
      }

      &--add {
        top: 100%;
      }
    }

    .icon-star-fill {
      &__foreground {
        fill: currentColor;
      }

      &__background {
        fill: transparent;
      }
    }

    .icon-star-outline {
      fill: var(--strong-color);
    }

    &--toc-hidden {
      visibility: hidden;
      opacity: 0;
    }
  }
`;
