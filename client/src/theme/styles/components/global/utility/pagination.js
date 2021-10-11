import { listUnstyled, utilityPrimary } from "theme/styles/mixins";

export default `
  .list-pagination {
    ${utilityPrimary}
    font-size: 14px;
    font-weight: var(--font-weight-semibold);
    text-align: center;

    a,
    a:visited {
      text-decoration: none;
    }

    ul {
      ${listUnstyled}
    }

    li {
      line-height: 16px;
    }

    .manicon-svg {
      width: 24px;
      height: 16px;
      margin-top: -4px;
    }

    &__columns {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    &__icon-label {
      margin: 0 8px;
    }

    &__column {
      flex: 0 0 auto;
    }

    &__column-middle {
      flex: 1 1 auto;
    }

    &__pages {
      display: flex;
      justify-content: center;
    }

    &__page {
      a {
        display: block;
        padding: 0 8px;
      }

      &--disabled {
        a,
        a:visited {
          pointer-events: none;
          opacity: 0.6;
        }
      }

      &--prev,
      &--next {
        a {
          padding: 0;
        }
      }
    }
  }
`;
