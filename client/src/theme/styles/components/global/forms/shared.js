import {
  respond,
  buttonUnstyled,
  inputQuaternary,
  outlineOnFocus,
  defaultTransitionProps,
  selectPrimary,
  utilityPrimary
} from "theme/styles/mixins";

const VISIBILITY_TOGGLE_SIZE = 32;

export default `
  .search-button-inline {
    position: relative;

    .icon {
      ${buttonUnstyled}
      ${outlineOnFocus()}
      position: absolute;
      top: 50%;
      left: 10px;
      margin-top: -11px;
      font-size: 17px;
    }

    input {
      ${inputQuaternary}
      width: 100%;
      padding-left: 40px;
      border-color: var(--color-base-neutral40);
      border-radius: 8px;
      appearance: none;
      transition: color ${defaultTransitionProps}, border-color ${defaultTransitionProps};

      &::placeholder {
        color: var(--color-base-neutral30);
      }

      &.focus-visible {
        color: var(--color-base-neutral-white);
        border-color: var(--focus-color);
      }
    }
  }

  .select-browse {
    ${selectPrimary}
    width: 100%;

    ${respond(
      `
      width: auto;
      min-width: 310px;`,
      30
    )}
  }

  .password-input {
    position: relative;

    .hidden {
      display: none;
    }

    &__visibility-toggle {
      position: absolute;
      top: ${(-1 / 4) * VISIBILITY_TOGGLE_SIZE - 1}px;
      left: 80px;
      width: ${VISIBILITY_TOGGLE_SIZE}px;
      height: ${VISIBILITY_TOGGLE_SIZE}px;
      color: var(--color-base-neutral70);
      cursor: pointer;

      &.focus-visible {
        outline: 0;
      }
    }

    &__visibility-icon {
      position: absolute;
      cursor: pointer;
    }
  }
`;
