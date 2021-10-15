import {
  panelRounded,
  dragging,
  dropzone,
  listUnstyled,
  rgba,
  defaultTransitionProps,
  respond,
  utilityPrimary,
  buttonUnstyled,
  textTruncate
} from "theme/styles/mixins";

const categoryVerticalPadding = `19px`;
const collectableMinHeight = `50px`;
const inputHeight = collectableMinHeight;
const collectableVerticalPadding = `5px`;
const collectableTypeVerticalPadding = `10px`;
const shadowSize = `10px`;

export default `
  .group-collection-editor {
    --label-color: var(--strong-color);
    --label-margin-bottom: 16px;

    font-family: var(--font-family-heading);
    font-size: 17px;
    font-weight: var(--font-weight-medium);
    color: var(--strong-color);

    > * + * {
      margin-top: ${categoryVerticalPadding};
    }

    &__category-creator {
      --label-color: var(--color-base-neutral80);
      --label-margin-bottom: 20px;
    }

    &__categories {
      ${dropzone("18px", "--active")}
    }

    &__category-wrapper {
      padding-top: ${categoryVerticalPadding};
      padding-bottom: ${categoryVerticalPadding};
      margin-top: 0;
    }

    &__category {
      ${panelRounded}

      &--is-dragging {
        ${dragging}
      }
    }

    &__category-inner {
      padding: calc(32px - ${collectableTypeVerticalPadding})
        clamp(20px, 2.857vw, 32px);

      &--drawer {
        padding-top: 40px;
        padding-bottom: 40px;
        box-shadow: inset 0 ${shadowSize} ${shadowSize} calc(-${shadowSize} / 2)
            ${rgba("neutralBlack", 0.08)},
          inset 0 (${shadowSize} * -1) ${shadowSize} calc(-${shadowSize} / 2)
            ${rgba("neutralBlack", 0.08)};
      }
    }

    &__collectable-type {
      ${dropzone("18px", "--active")}
      padding-top: ${collectableTypeVerticalPadding};
      padding-bottom: ${collectableTypeVerticalPadding};
      box-sizing: border-box;
    }

    &__list {
      ${listUnstyled}
      position: relative;
      min-height: calc(
        ${collectableMinHeight} + ${collectableVerticalPadding} * 2
      );
      margin-top: -${collectableVerticalPadding};
      margin-bottom: -${collectableVerticalPadding};
    }

    &__block {
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
      background-color: var(--box-medium-bg-color);

      &--category {
        --label-margin-bottom: 18px;

        border-top-left-radius: var(--box-border-radius);
        border-top-right-radius: var(--box-border-radius);
      }

      &--collectable {
        padding-left: 14px;
        border-radius: var(--box-border-radius);
      }

      &--is-dragging {
        ${dragging}
      }

      &--empty {
        --label-margin-bottom: 0;

        align-items: center;
        justify-content: center;
        padding-top: 9px;
        padding-bottom: 9px;
        color: $neutral80;
        border-radius: var(--box-border-radius);

        > * + * {
          margin-left: 8px;
        }

        svg {
          transform: translateY(1px);
        }
      }
    }

    &__actions {
      display: flex;
      flex-shrink: 0;
      gap: min(1vw, 10px);
      align-items: center;
      margin-left: 10px;
      color: var(--color);
    }

    &__collectable-actions {
      transition: transform var(--transition-duration-default) ${defaultTransitionProps};
      transform: translateX(80px);

      &--keyboard-actions-visible {
        transition: transform ${defaultTransitionProps};
        transform: translateX(0);
      }

      ${respond(
        `transition: none;
        transform: translateX(0);`,
        50,
        "max"
      )}
    }

    &__keyboard-actions {
      display: inherit;
      gap: inherit;
      align-items: inherit;
      visibility: hidden;
      opacity: 0;
      transition: opacity ${defaultTransitionProps},
        visibility transform var(--transition-duration-default) var(--transition-duration-default) var(--transition-timing-function);

      .group-collection-editor__collectable-actions--keyboard-actions-visible
        & {
        visibility: visible;
        opacity: 1;
        transition: opacity var(--transition-duration-default) calc(var(--transition-duration-default) / 2) var(--transition-timing-function),
          visibility var(--transition-duration-default) calc(var(--transition-duration-default) / 2) var(--transition-timing-function);
      }

      ${respond(
        `width: 0;
        margin-left: 0;
        transition: none;`,
        50,
        "max"
      )}
    }

    &__action {
      ${buttonUnstyled}
      ${utilityPrimary}
      font-size: 12px;

      &--padded {
        margin-right: 6px;
        margin-left: 6px;
      }
    }

    &__label {
      ${utilityPrimary}
      display: block;
      margin-bottom: var(--label-margin-bottom, 20px);
      font-size: 14px;
      color: var(--label-color);
      letter-spacing: 0.089em;

      &--category {
        ${textTruncate}
        margin-top: 16px;
      }

      &--collectable-type {
        margin-top: 0;
        font-size: 13px;
        color: inherit;
      }
    }

    &__input-container {
      display: flex;
    }

    &__input {
      flex-grow: 1;
      height: ${inputHeight};
      padding: 0 20px 2px;
      font: inherit;
      background-color: var(--box-bg-color);
      border: none;
      border-top-left-radius: var(--box-border-radius);
      border-bottom-left-radius: var(--box-border-radius);
      appearance: none;

      &::placeholder {
        font-weight: var(--font-weight-regular);
        color: var(--label-color);
      }

      &:focus-visible {
        outline: none;
      }
    }

    &__submit-button {
      ${buttonUnstyled}
      ${utilityPrimary}
      display: flex;
      align-items: center;
      height: ${inputHeight};
      padding-right: 27px;
      padding-left: 27px;
      font-size: 14px;
      letter-spacing: 0.089em;
      background-color: var(--box-medium-bg-color);
      border-top-right-radius: var(--box-border-radius);
      border-bottom-right-radius: var(--box-border-radius);
      transition: color ${defaultTransitionProps}, background-color ${defaultTransitionProps};

      &:hover,
      &:focus-visible {
        color: var(--strong-color);
        background-color: var(--color-accent-primary-light);
        outline: none;
      }

      > * + * {
        margin-left: 0.5em;
      }
    }

    &__collectable-wrapper {
      padding-top: ${collectableVerticalPadding};
      padding-bottom: ${collectableVerticalPadding};

      &--empty {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: calc(${collectableMinHeight} + ${collectableVerticalPadding} * 2);
      }
    }

    &__collectable-header {
      display: flex;
      align-items: center;
      min-width: 0;
      margin-top: 6px;
      margin-bottom: 8px;

      > * + * {
        margin-left: 15px;
      }

      svg {
        flex-shrink: 0;
        color: var(--color-base-neutral80);
        transform: translateY(2px);
      }
    }

    &__collectable-title {
      ${textTruncate}
      /* prevent clipping of italics, descenders */
      padding-right: 2px;
      padding-bottom: 1px;
      margin-top: 0;
      margin-bottom: 0;
      font: inherit;
    }
  }
`;
