import { respond } from "theme/styles/mixins";

export default `
  .collection-detail {
    &__title-and-toggle {
      display: flex;
    }

    &__collecting-toggle {
      margin-left: 12px;
      transform: translateY(2px);

      ${respond(`transform: translateY(6px);`, 60)}
    }

    &__utility {
      padding: 26px 0 12px;

      ${respond(
        `display: flex;
      justify-content: space-between;`,
        60
      )}
    }

    &__description {
      font-family: var(--font-family-copy);
      max-width: 840px;
      font-size: 15px;
    }

    .share-nav-primary {
      padding-top: 26px;
    }
  }
`;
