import { utilityPrimary, respond } from "theme/styles/mixins";

export default `
  .notes-filters {
    ${utilityPrimary}
    flex-grow: 999;
    padding: 0;
    margin: 0;
    font-size: 13px;
    border: 0;
    display: flex;
    gap: 8px;
    align-items: baseline;
    padding-right: 12px;

    &__legend {
      padding-right: 18px;
      float: left;
    }

    &__checkbox-group {
      ${respond(`display: flex;`, 50)}
      ${respond(`display: block;`, 65)}
      ${respond(`display: flex;`, 75)}
      ${respond(`display: block;`, 120)}
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
        ${respond(
          `margin-top: 8px;
        margin-left: 0;`,
          65
        )}
        ${respond(
          `margin-top: 0;
        margin-left: 28px;`,
          75
        )}
        ${respond(
          `margin-top: 8px;
        margin-left: 0;`,
          120
        )}
      }
    }

    .checkbox__indicator {
      position: relative;
      top: -1px;
      color: var(--strong-color);
      background-color: var(--box-medium-bg-color);

      > svg {
        top: 1px;
      }
    }
  }
`;
