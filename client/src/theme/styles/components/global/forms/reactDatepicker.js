import {
  defaultHoverStyle,
  defaultTransitionProps,
  rgba
} from "theme/styles/mixins";

export default `
.react-datepicker {
  color: var(--color);
  background-color: transparent;
  border: none;
  box-shadow: 10px 31px 44px 2px ${rgba("neutralBlack", 0.13)};
  font-family: var(--font-family-sans);

  &-wrapper {
    width: 100%;
  }

  &__triangle {
    display: none;
  }

  &__navigation {
    top: 9px;
    width: auto;
    height: auto;
    font-size: 16px;
    line-height: 1;
    text-indent: unset;
    background-color: transparent;
    border: none;

    &--previous {
      left: 20px;
    }

    &--next {
      right: 20px;
    }
  }

  &__input-container {
    display: block;
  }

  &__close-icon {
    display: none;
  }

  &__header {
    background-color: var(--color-base-neutral110);
    border: none;

    .browse &,
    .reader.scheme-light &,
    .bg-white & {
      background-color: var(--box-medium-bg-color);
    }
  }

  &__current-month {
    color: var(--strong-color);
  }

  &__day-name {
    color: inherit;
  }

  &__month-container {
    background-color: var(--box-bg-color);
    border-radius: 8px;
  }

  &__day {
    height: 1.7rem;
    line-height: 1.45rem;
    line-height: 1.45rem;
    color: inherit;
    border: 1px solid transparent;
    border-radius: 50%;
    transition: color ${defaultTransitionProps},
      border-color ${defaultTransitionProps},
      background-color ${defaultTransitionProps};

    &--keyboard-selected,
    &--selected {
      ${defaultHoverStyle}
      background-color: var(--box-x-strong-bg-color);
    }

    &:hover {
      ${defaultHoverStyle}
      background-color: var(--box-strong-bg-color);
    }
  }
}
`;
