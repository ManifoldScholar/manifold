import { fluidScale, panelRounded } from "theme/styles/mixins";

export default `
  .content-placeholder {
    ${panelRounded}
    padding: min(6.846vw, 70px);
    color: var(--strong-color);
    text-align: center;
    font-family: var(--font-family-sans);

    &__inner {
      max-width: 740px;
      margin-right: auto;
      margin-left: auto;
    }

    &__header {
      display: flex;
      flex-direction: column;
      align-items: center;
      hyphens: none;
    }

    &__icon-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 86px;
      height: 86px;
      margin-bottom: 28px;
      background-color: var(--box-strong-bg-color);
      border-radius: 50%;

      .content-placeholder--backend & {
        color: var(--highlight-color);
      }

      .content-placeholder--frontend & {
        color: var(--strong-color);
      }
    }

    &__title {
      margin: 0;
      font-size: ${fluidScale("30px", "25px")};
      font-weight: var(--font-weight-medium);
    }

    &__body {
      margin-top: 24px;
      font-size: 16px;
      line-height: 1.5;

      > * + * {
        margin-top: 1em;
      }

      a {
        text-decoration: underline;

        &:visited {
          color: var(--hover-color);
        }
      }
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      margin-top: min(5.86vw, 60px);
    }
  }
`;
