import {
  utilityPrimary,
  buttonUnstyled,
  defaultHoverStyle,
  outlineOnFocus,
  defaultTransitionProps,
  filterSelectBase
} from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";

const { gap, selectMinWidth, searchMinWidth } = entityFilterForm;

export default `
  .form-list-filter {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    gap: ${gap}px;

    > * {
      flex-grow: 1;
    }

    .resource-totals + & {
      padding-top: 40px;
    }

    &__label {
      ${utilityPrimary}
      display: block;
      margin-bottom: ${gap}px;
      font-size: 13px;
    }

    &__text-input {
      width: 100%;
      padding: 6px 40px 8px 15px;
      font-size: 17px;
      font-family: var(--font-family-sans);
      background-color: transparent;
      border: 1px solid;

      &:focus-visible::placeholder {
        color: var(--focus-color);
      }

      &--search {
        padding-left: 44px;
        border-radius: 20px;

        &:focus-visible {
          outline: none;
        }
      }
    }

    &__search-field {
      position: relative;
      display: inline-block;
      flex-basis: 0;
      flex-grow: 999;
      width: 100%;
      min-width: ${searchMinWidth}px;
    }

    &__search-button {
      ${buttonUnstyled}
      position: absolute;
      top: 50%;
      left: 14px;
      transform: translateY(-50%);
      ${outlineOnFocus()}

      &:hover {
        ${defaultHoverStyle}
      }
    }

    &__select-group {
      position: relative;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(${selectMinWidth}px, 1fr));
      grid-gap: ${gap}px;
      margin-bottom: 0;

      &--count-1 {
        flex-basis: ${selectMinWidth}px;
      }

      &--count-2 {
        flex-basis: ${selectMinWidth * 2 + gap}px;
      }

      &--count-3 {
        flex-basis: ${selectMinWidth * 3 + gap * 2}px;
      }
    }

    &__select-field {
      position: relative;
    }

    &__select-input {
      ${filterSelectBase}
      width: 100%;
      padding-top: 11px;
      padding-bottom: 12px;
      font-size: 13px;
      border: 1px solid var(--select-border-color);
      border-radius: 6px;
      transition: border-color ${defaultTransitionProps};

      &:focus-visible {
        border-color: var(--hover-color);
      }

      option {
        color: var(--color-base-neutral-black);
      }
    }

    &__select-icon {
      position: absolute;
      top: 50%;
      right: 12px;
      width: 24px;
      height: 24px;
      color: var(--select-border-color);
      pointer-events: none;
      transform: translateY(-50%);
    }

    &__reset-button {
      ${buttonUnstyled}
      ${utilityPrimary}
      position: absolute;
      top: 100%;
      left: 0;
      margin-top: 8px;
      font-size: 13px;

      &:focus-visible {
        color: var(--focus-color);
      }
    }
  }
`;
