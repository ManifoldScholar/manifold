import {
  utilityPrimary,
  listUnstyled,
  buttonUnstyled,
  rgba,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
  .annotation-group-options {
    --tail-size: 16px;

    width: 290px;
    padding-bottom: 20px;
    background-color: var(--color-base-neutral10);
    border-radius: var(--box-border-radius);

    &--light {
      padding-top: 30px;
      background-color: var(--color-base-neutral10);
    }

    &--dark {
      padding-top: 14px;
      background-color: var(--color-base-neutral85);

      .scheme-dark & {
        background-color: var(--color-base-neutral-white);
      }
    }

    &--popup {
      position: absolute;
      top: calc(100% + var(--tail-size) * 2);
      left: 50%;
      z-index: 1;
      outline: 0;

      box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};
      transition: opacity ${defaultTransitionProps},
        visibility ${defaultTransitionProps};
      transform: translateX(-50%);

      &::after {
        position: absolute;
        top: calc(var(--tail-size) * -1);
        left: 50%;
        display: block;
        width: 0;
        height: 0;
        margin-left: calc(var(--tail-size) * -1);
        content: "";
        border-color: transparent transparent var(--color-base-neutral10);
        border-style: solid;
        border-width: 0 var(--tail-size) var(--tail-size);
      }
    }

    &--hidden {
      visibility: hidden;
      opacity: 0;
    }

    &__list {
      ${listUnstyled}
      max-height: 336px; /* equals 8 items */
      overflow: auto;
    }

    &__option {
    }

    &__button {
      ${buttonUnstyled}
      width: 100%;
      text-align: left;
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps};

      .annotation-group-options--light & {
        color: var(--color-base-neutral90);

        &:hover,
        &:focus-visible {
          background-color: var(--color-base-neutral30);
          outline: 0;
        }
      }

      .annotation-group-options--dark & {
        color: var(--color-base-neutral-white);

        .scheme-dark & {
          color: var(--color-base-neutral85);
        }

        &:hover,
        &:focus-visible {
          color: var(--color-base-neutral85);
          background-color: var(--color-interaction-light);
          outline: 0;
        }
      }
    }

    &__button-inner {
      display: grid;
      grid-template: "selected label private" auto / 22px 1fr 18px;
      column-gap: 14px;
      padding: 10px 20px;
    }

    &__button-text {
      display: block;
      grid-area: label;
      min-height: 22px;
      overflow: hidden;
      font-size: 17px;
      font-family: var(--font-family-sans);
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &__icon {
      &--selected {
        grid-area: selected;
      }

      &--private {
        grid-area: private;
        margin-top: 2px;
        transition: color ${defaultTransitionProps};

        .annotation-group-options--light & {
          color: var(--color-base-neutral50);
        }

        .annotation-group-options--dark & {
          color: var(--color-base-neutral45);

          .scheme-dark & {
            color: var(--color-base-neutral50);
          }
        }

        .annotation-group-options--dark
          .annotation-group-options__button:hover
          &,
        .annotation-group-options--dark
          .annotation-group-options__button:focus-visible
          & {
          color: var(--color-base-neutral85);
        }
      }

      &--link {
        margin-left: 8px;
      }
    }

    &__link {
      ${utilityPrimary}
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3px;
      font-size: 12px;
      text-decoration: none;
      border: 1px solid;
      border-radius: 4px;
      transition: color ${defaultTransitionProps},
        background-color ${defaultTransitionProps},
        border-color ${defaultTransitionProps};

      .annotation-group-options--light & {
        color: #5c5c5c;
      }

      .annotation-group-options--dark & {
        color: var(--color-base-neutral45);

        .scheme-dark & {
          color: #5c5c5c;
        }
      }

      &:hover,
      &:focus-visible {
        color: var(--color-base-neutral85);
        background-color: var(--color-interaction-light);
        border-color: var(--color-interaction-light);
        outline: 0;
      }
    }

    &__footer {
      margin: 20px 20px 0;
    }
  }
`;
