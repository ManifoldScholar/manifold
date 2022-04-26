import {
  buttonUnstyled,
  defaultHoverStyle,
  defaultTransitionProps,
  listUnstyled
} from "theme/styles/mixins";

export default `
  .dropdown-nav {
    font-family: var(--font-family-sans);
    position: relative;
    font-weight: var(--font-weight-semibold);
    text-align: center;
    text-transform: none;
    background-color: var(--color-base-neutral100);

    &__trigger {
      ${buttonUnstyled}
      width: 100%;

      &:hover {
        cursor: pointer;
      }

      &.focus-visible {
        outline: 0;
      }

      .dropdown-nav--open & {
        ${defaultHoverStyle}
      }

      .dropdown-nav--static:hover & {
        color: var(--color-neutral-text-extra-light);
        cursor: default;
      }
    }

    &__trigger-icon {
      margin-top: 3px;
      margin-left: 10px;
      transition: transform ${defaultTransitionProps};

      .dropdown-nav--open & {
        transform: rotate(-180deg);
      }
    }

    &__selected {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 9px 0 11px;
    }

    &__nav-list {
      ${listUnstyled}
      position: absolute;
      width: 100%;
      padding: 25px 43px 32px;
      text-align: left;
      visibility: hidden;
      background-color: var(--color-base-neutral100);
      border-top: 2px solid var(--color-base-neutral95);
      opacity: 0;
      transition: opacity var(--transition-duration-slow)
          var(--transition-timing-function),
        visibility var(--transition-duration-slow)
          var(--transition-timing-function);

      .dropdown-nav--open & {
        visibility: visible;
        opacity: 1;
      }
    }

    &__nav-item {
    }

    &__link {
      display: inline-block;
      width: 100%;
      padding-top: 7px;
      padding-bottom: 7px;
      text-decoration: none;

      &--active {
        color: var(--color-neutral-text-extra-light);
      }
    }
  }
`;
