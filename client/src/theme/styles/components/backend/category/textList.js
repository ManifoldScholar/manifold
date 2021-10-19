import {
  listUnstyled,
  utilityPrimary,
  dragging,
  defaultTransitionProps,
  blockLabelRound,
  buttonUnstyled,
  respond,
  outlineOnFocus,
  lighten
} from "theme/styles/mixins";

export default `
  .texts-list {
    ${listUnstyled}
    font-family: var(--font-family-sans);
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: var(--font-weight-semibold);
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    transition: background-color 0.4s ease;

    &--active {
      background-color: ${lighten("neutral90", 0.03)};
    }

    &--empty {
      position: relative;
      min-height: 87px;

      p {
        ${utilityPrimary}
        width: 100%;
        padding: 16px;
        font-size: 14px;
        text-align: center;
        border: 1px solid var(--color-base-neutral80);
      }
    }

    &__text {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 8px 16px;
      margin: 8px;
      background: var(--color-base-neutral95);
      border-radius: 8px;

      &--is-dragging {
        ${dragging}
      }

      &--placeholder {
        position: absolute;
        width: 100%;
        padding-right: 38px;
        background: none;
      }
    }

    &__details {
      display: flex;
      flex-direction: row;
      text-decoration: none;

      &:hover {
        color: inherit;
      }
    }

    &__title-wrapper {
      padding-left: 16px;
    }

    &__title {
      margin: 0 0 0.4em;
      font-size: 17px;
      hyphens: none;
      color: var(--color-neutral-text-extra-light);
      transition: color ${defaultTransitionProps};
    }

    &__subtitle {
      margin: 7px 0 0 15px;
      transition: color ${defaultTransitionProps};
    }

    &__labels {
      display: inline-block;
      margin: 0;
    }

    &__label {
      ${blockLabelRound}
      position: relative;
      display: inline-block;
      padding: 0.333em 5px;
      margin: -3px 0 0;
      font-size: 9px;
      line-height: 1.2em;
      color: var(--color-neutral-ui-extra-dark);
      vertical-align: middle;
      background-color: var(--color-neutral-text-extra-light);

      + .texts-list__label {
        margin-left: 14px;
      }
    }

    &__date {
      ${utilityPrimary}
      display: inline-block;
      font-size: 12px;
      font-weight: var(--font-weight-medium);
    }

    &__icon {
      img {
        position: relative;
        left: 6px;
        max-width: 38px;
        margin-top: 4px;
        margin-right: 12px;
      }

      svg {
        width: 50px;
        height: 50px;

        path {
          fill: var(--color-base-neutral20);
        }
      }
    }

    &__utility {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      margin-left: 14px;
      transition: transform var(--transition-duration-default)
        ${defaultTransitionProps};
      transform: translateX(80px);

      &--keyboard-buttons-visible {
        transition: transform ${defaultTransitionProps};
        transform: translateX(0);
      }

      ${respond(
        `transition: none;
      transform: translateX(0);`,
        35,
        "max"
      )}

      > * + * {
        margin-left: 14px;
      }
    }

    &__button {
      ${buttonUnstyled}
      ${outlineOnFocus()}
      display: block;
      padding: 0;

      &--notice {
        &:hover {
          color: var(--error-color);
        }
      }
    }

    &__keyboard-buttons {
      display: inherit;
      visibility: hidden;
      opacity: 0;
      transition: opacity ${defaultTransitionProps},
        visibility var(--transition-duration-default) ${defaultTransitionProps};

      .texts-list__utility--keyboard-buttons-visible & {
        visibility: visible;
        opacity: 1;
        transition: opacity var(--transition-duration-default)
            calc(var(--transition-duration-default) / 2)
            var(--transition-timing-function),
          visibility var(--transition-duration-default)
            calc(var(--transition-duration-default) / 2)
            var(--transition-timing-function);
      }

      ${respond(
        `width: 0;
      margin-left: 0;
      transition: none;`,
        35,
        "max"
      )}

      > * + * {
        margin-left: 14px;
      }
    }
  }
`;
