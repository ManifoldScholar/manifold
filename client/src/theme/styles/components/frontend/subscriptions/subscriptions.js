import { respond, utilityPrimary, formLabelPrimary } from "theme/styles/mixins";

export default `
  .subscriptions {
    margin: auto;

    ${respond(`width: 600px;`, 75)}

    .form-group {
      padding: 20px 24px 60px;

      + .form-group {
        margin-top: 60px;
      }
    }

    .section-heading-secondary {
      ${utilityPrimary}
      padding: 12px 24px;
      font-size: 14px;
      color: var(--color-base-neutral75);
      letter-spacing: 0.1em;
      background-color: var(--color-base-neutral10);
      border-radius: 8px;
    }

    .form-heading {
      margin-bottom: 55px;
    }

    .form-input {
      + .form-input {
        margin-top: 50px;
      }

      label:not(.checkbox):not(.radio):not(.toggle) {
        font-size: 14px;
      }
    }

    &__collapsed-group {
      padding-top: 50px;
    }

    &__legend,
    &__radio-group {
      padding: 0;
      margin: 0;
      border: none;
    }

    &__legend {
      ${formLabelPrimary}
      display: block;
      margin-bottom: 1em;
      font-size: 14px;

      + .form-toggle {
        margin-top: 4px;
      }
    }

    .sign-in-up-update & {
      width: auto;
      margin-top: 50px;

      .subscriptions__label {
        font-family: var(--font-family-copy);
        display: block;
        margin-bottom: 20px;
        font-style: italic;
      }

      .button-secondary {
        width: 100%;

        &__icon {
          width: 30px;
          height: 20px;
        }
      }
    }
  }
`;
