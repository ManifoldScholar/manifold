import { panelRounded, headingQuaternary, respond } from "theme/styles/mixins";

export default `
  .group-collection-category {
    ${panelRounded}
    padding-top: 42px;
    padding-bottom: 45px;

    & + & {
      margin-top: 50px;
    }

    &__header {
      margin-bottom: 20px;
      color: var(--strong-color);
    }

    &__heading {
      ${headingQuaternary}
      font-weight: var(--font-weight-medium);
    }

    &__description {
      font-family: var(--font-family-heading);
      margin: 1.438em 0 0;
      font-size: 16px;
      line-height: 1.438;
    }

    &__bottom-margin-offset {
      ${respond(`margin-bottom: -18px;`, 75)}
    }
  }
`;
