import { textTruncate } from "theme/styles/mixins";

const highlightBgColor = `var(--color-base-blue45)`;
const iconSize = `28px`;

export default `
  .collecting-dialog-checkbox {
    position: relative;
    display: block;
    font-size: 17px;
    line-height: 1.25;
    cursor: pointer;

    & + & {
      margin-top: 18px;
    }

    &__input {
      position: absolute;
      z-index: -1;
      opacity: 0;
    }

    &__label {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
    }

    &__icon-block {
      position: relative;
      width: ${iconSize};
      height: ${iconSize};
      margin-right: 12px;
    }

    &__icon {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      &-enter {
        opacity: 0;
      }

      &-enter-active {
        opacity: 1;
        transition: opacity 0.5s;
      }

      &-exit {
        opacity: 1;
      }

      &-exit-active {
        opacity: 0;
        transition: opacity 0.5s;
      }
    }

    &__title {
      ${textTruncate}
    }

    .icon-star-fill {
      &__background {
        fill: ${highlightBgColor};
      }
    }
  }
`;