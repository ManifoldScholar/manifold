import {
  respond,
  marker,
  buttonUnstyled,
  utilityPrimary
} from "theme/styles/mixins";

export default `
  .search-result {
    padding: 29px 20px 23px;
    font-family: var(--font-family-copy);

    mark {
      background-color: var(--color-notification-warning-extra-light);
    }

    a,
    a:visited {
      color: var(--color-neutral-text-extra-dark);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    & + & {
      border-top: 1px solid var(--color-neutral-ui-dull-dark);
    }

    &__wrapper-link {
      text-decoration: none;
    }

    &__content-wrapper {
      display: flex;
    }

    &__figure-column {
      display: none;
      padding-right: 5px;

      ${respond(
        `
        display: block;
        padding-right: 15px;
      `,
        60
      )}
    }

    &__text-column {
      width: 100%;
    }

    &__text-column-top {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    &__text-column-top-left {
      flex-grow: 1;
      padding-right: 20px;
      margin-bottom: 16px;
    }

    &__text-column-top-right {
      display: flex;
      align-items: center;
      align-self: flex-start;
      margin-top: 2px;
      text-align: right;
    }

    &__label {
      ${marker}
    }

    &__collecting-toggle {
      margin-left: 10px;
      transform: translateY(-1px);
    }

    &__title-link {
      display: block;
      margin: 0 0 16px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &__title {
      margin: 0;
      font-size: 21px;
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-semibold);
    }

    &__subtitle {
      color: var(--color-neutral-text-dark);
    }

    &__parent {
      margin: 0 0 12px;
      font-size: 18px;
      font-family: var(--font-family-sans);
      font-weight: var(--font-weight-semibold);
      color: var(--color-neutral-text-dark);

      a,
      a:visited {
        color: inherit;
      }
    }

    &__description {
      margin-bottom: 16px;
      line-height: 23px;
      font-family: var(--font-family-copy);
    }

    &__meta {
      font-style: italic;
    }

    &__attribution {
      font-family: var(--font-family-copy);
      font-style: normal;
    }

    svg.search-result--figure-narrow-svg {
      max-width: 76px;
      margin-left: -10px;
    }

    &__figure {
      position: relative;
      width: 76px;

      img {
        margin-top: 6px;
      }

      img,
      svg {
        max-width: 56px;
        color: var(--color-neutral-ui-dark);
      }
    }

    img.search-result__avatar {
      border: 2px solid var(--color-base-neutral50);
      border-radius: 50%;
    }

    .search-result__avatar svg {
      position: relative;
      left: -6px;
      width: 68px;
      max-width: 68px;
      height: 68px;
    }

    &__excerpt-open-button {
      ${buttonUnstyled}
      ${utilityPrimary}
      margin-top: 30px;
      font-size: 13px;
      font-weight: var(--font-weight-semibold);
    }

    &__excerpt-shim {
      min-height: 25px;
    }

    &__excerpt {
      margin: 0;
      font-size: 16px;
      line-height: 23px;
      border-left: 4px solid var(--color-neutral-ui-dull-dark);

      &:hover,
      &:focus-visible {
        background-color: var(--color-base-neutral05);
        outline: 0;
      }

      a {
        display: block;
        padding: 10px 31px 10px 28px;
      }

      a:hover {
        text-decoration: none;
      }
    }

    .search-result__excerpt + .search-result__excerpt {
      margin-top: 25px;
    }
  }
`;
