import { respond } from "theme/styles/mixins";

const textGap = "20px";
const containerGap = "30px";

export default `
  .group-page-heading {
    &__container {
      &:not(:last-child):not(:empty) {
        padding-bottom: ${containerGap};
      }
    }

    &__flex-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      margin-top: -${textGap};
      margin-left: -${textGap};

      &--justify-start {
        justify-content: flex-start;
      }

      > * {
        margin-top: ${textGap};
        margin-left: ${textGap};
      }
    }

    &__text-container {
      display: flex;

      ${respond(`transform: translateY(-2px);`, 80)}
    }

    &__nav-container:not(:empty) {
      padding-top: 20px;
    }

    &__summary-container {
      padding-bottom: ${containerGap};

      &:focus {
        outline: none;
      }
    }

    &__icon {
      width: 32px;
      height: 32px;
      transform: translateY(2px);

      ${respond(`transform: translateY(4px);`, 80)}
    }

    &__text {
      margin-bottom: 0;
      margin-left: 15px;
      font-size: 23px;
      color: var(--strong-color);
      word-wrap: break-word;

      ${respond(`font-size: 26px;`, 80)}
    }

    &__subtitle {
      color: var(--color-neutral-text-dark);
    }

    &__nav-button {
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
`;
