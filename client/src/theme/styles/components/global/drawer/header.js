import {
  respond,
  fluidScale,
  headingQuaternary,
  subtitlePrimary
} from "theme/styles/mixins";

export default `
  .drawer-header {
    padding-bottom: ${fluidScale("53px", "21px")};

    &--pad-bottom-small {
      padding-bottom: 20px;
    }

    &__title {
      ${headingQuaternary}
      display: flex;
      min-width: 0;
    }

    &__title-icon {
      margin-right: 10px;
      margin-left: -8px;
    }

    &__title-text {
      padding-top: 2px;
      color: var(--strong-color);
    }

    &__utility {
      margin-top: 24px;
    }

    &__instructions {
      font-family: var(--font-family-copy);
      display: block;
      margin-top: 8px;
      margin-bottom: 0;
      font-size: 17px;
      font-style: italic;
      text-transform: none;
    }

    .subtitle {
      ${subtitlePrimary}
      padding: 5px 0;
    }

    .form-input {
      input[type="text"] {
        height: auto;
        padding: 0 0 0.4em;
        font-size: 24px;

        ${respond(
          `
            padding: 0 0 0.25em;
            font-size: 30px;
          `,
          90
        )}
      }
    }
  }
`;
