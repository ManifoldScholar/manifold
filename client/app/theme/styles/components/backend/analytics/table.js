import { utilityPrimary } from "theme/styles/mixins";

const INDENT_INCREMENT = "1em";
const indents = [2, 3, 4, 5, 6]
  .map(
    level => `
    &--depth-${level} {
      --link-indent: calc(${INDENT_INCREMENT} * (${level} - 1));
    }
  `
  )
  .join("");

export default `
  .analytics-table {
    --link-indent: 0;

    width: 100%;
    text-align: left;
    table-layout: auto;

    &__header {
      ${utilityPrimary}
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      color: var(--color-base-neutral50);
      letter-spacing: 0.1em;
    }

    &__row {
      vertical-align: baseline;
      border-bottom: 1px solid var(--color-base-neutral80);
    }

    &__link {
      margin-left: var(--link-indent, 0);
      text-decoration: none;

      ${indents}
    }

    &__empty-message {
      font-family: var(--font-family-serif);
      font-style: italic;
    }

    th {
      padding-top: 12px;

      &:first-child {
        width: 100%;
      }

      &:last-child {
        width: 100%;
        text-align: right;
        white-space: nowrap;
      }
    }

    td {
      padding-top: 14px;
      padding-bottom: 10px;

      &:first-child {
        font-size: 18px;
        font-weight: var(--font-weight-medium);
        color: var(--color-base-neutral30);
      }

      &:last-child {
        font-size: 27px;
        color: var(--color-accent-secondary);
        text-align: right;
      }
    }
  }
`;
