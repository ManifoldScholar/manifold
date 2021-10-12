import { headingQuaternary, subtitlePrimary } from "theme/styles/mixins";

export default `
  .group-homepage-editor {
    color: var(--strong-color);

    &__heading {
      ${headingQuaternary}
      font-weight: var(--font-weight-semibold);
    }

    &__instructions {
      ${subtitlePrimary}
      margin-top: 1em;
      font-size: 18px;
    }

    &__actions {
      margin-top: 32px;
    }

    &__body {
      margin-top: 40px;
    }
  }
`;
