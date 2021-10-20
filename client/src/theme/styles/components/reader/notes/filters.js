import { utilityPrimary, respond } from "theme/styles/mixins";

export default `
  .notes-filters {
    ${utilityPrimary}
    flex-grow: 999;
    flex-wrap: wrap;
    padding: 0;
    margin: 0;
    font-size: 13px;
    border: 0;

    &__inner {
      display: flex;
      gap: 8px;
      align-items: baseline;
      padding-right: 12px;
    }

    &__label {
      display: inline-block;
      padding-right: 18px;
    }

    &__checkbox-group {
      ${respond(`display: flex;`, 50)}
    }

    &__checkbox {
      display: block;

      & + & {
        margin-top: 8px;
        margin-left: 0;

        ${respond(
          `margin-top: 0;
        margin-left: 28px;`,
          50
        )}
      }
    }

    .checkbox__indicator {
      position: relative;
      top: -1px;
      color: var(--strong-color);
      background-color: var(--box-medium-bg-color);
    }
  }
`;
