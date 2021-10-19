import {
  panelRounded,
  listUnstyled,
  utilityPrimary,
  respond
} from "theme/styles/mixins";

const STAT_FONT_SIZE_LARGE = "66px";
const STAT_FONT_SIZE_SMALL = "52px";

export default `
  .analytics-block {
    --focus-color: var(--color-accent-secondary);
    --hover-color: var(--color-accent-secondary);
    --select-bg-color: var(--color-base-neutral95);

    ${panelRounded}
    font-family: var(--font-family-sans);
    padding: 25px 30px 30px;
    font-size: 17px;

    &__title {
      display: flex;
      align-items: baseline;
      margin-top: 0;
      margin-bottom: 0;
      margin-left: -3px;
      font-size: 22px;
      font-weight: var(--font-weight-medium);
      color: var(--color-base-neutral30);
    }

    &__title-text {
      flex-grow: 1;
      margin-left: 0.5em;
    }

    &__icon {
      position: relative;
      top: -1px;
      flex-shrink: 0;
      align-self: flex-start;
      color: var(--color-accent-secondary);
    }

    &__description {
      margin-top: 8px;
    }

    &__body {
      margin-top: 15px;
    }

    &__stat {
      font-size: ${STAT_FONT_SIZE_LARGE};
      font-weight: var(--font-weight-light);
      line-height: 1;
      color: var(--color-accent-secondary);
    }

    &__caption {
      margin-top: 15px;
    }

    &__list {
      ${listUnstyled}
      columns: auto 365px;
      column-gap: 50px;
    }

    &__figure-list {
      ${listUnstyled}
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      row-gap: 20px;
    }

    &__figure-list-item {
      padding-right: 20px;

      & + & {
        position: relative;
        padding-left: 20px;

        &::after {
          position: absolute;
          top: 50%;
          left: 0;
          display: block;
          width: 1px;
          height: 100%;
          content: "";
          background-color: currentColor;
          transform: translateY(-50%);
        }

        .analytics-block__stat {
          position: relative;
          top: calc(
            (${STAT_FONT_SIZE_LARGE} - ${STAT_FONT_SIZE_SMALL} - 2px) / 2
          );
          font-size: ${STAT_FONT_SIZE_SMALL};
          /* simulate baseline alignment with larger stat */
          line-height: ${STAT_FONT_SIZE_LARGE};
          color: var(--color-neutral-ui-light);
        }
      }
    }

    &__footer {
      margin-top: 32px;
      text-align: center;
    }

    &__link {
      ${utilityPrimary}
      display: inline-flex;
      align-items: center;
      font-size: 14px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-accent-secondary);
      text-decoration: none;

      > * + * {
        margin-left: 8px;
      }
    }

    &__sort {
      margin-bottom: 16px;
    }

    &__sort-form {
      ${respond(`display: inline-flex;`, 60)}
    }
  }
`;
