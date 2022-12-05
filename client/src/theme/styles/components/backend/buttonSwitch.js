import {
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  respond,
  rgba
} from "theme/styles/mixins";

export default `
  .button-switch-primary {
    display: flex;
    border: 1px solid var(--color-accent-primary);

    &__side {
      ${buttonUnstyled}
      ${utilityPrimary}
      position: relative;
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
      padding: 7.5px 20px 8.5px;
      font-size: 12px;
      color: var(--color-accent-primary);
      cursor: pointer;
      transition: background-color ${defaultTransitionProps},
        color ${defaultTransitionProps};

      ${respond(
        `
          padding-top: 9px;
          padding-bottom: 11px;
          font-size: 14px;
        `,
        90
      )}

      &:focus-within {
        color: var(--color-accent-primary);
        background-color: ${rgba("neutral20", 0.1)};
      }

      &--selected {
        color: var(--color-base-neutral100);
        background-color: var(--color-accent-primary);

        &:focus-within {
          color: var(--color-base-neutral100);
          background-color: var(--color-accent-primary-pale);
          border-color: var(--color-accent-primary-pale);
        }
      }
    }

    &__icon {
      margin-right: 0.65em;

      ${respond(
        `
          width: 36px;
          height: 36px;
        `,
        90
      )}
    }

    &__input {
      position: absolute;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }

    .drawer-backend & {
      margin-bottom: 28px;
    }
  }
`;
