import { panelRounded, formLabelPrimary, respond } from "theme/styles/mixins";

const gap = "30px";

export default `
  .group-summary {
    ${panelRounded}
    ${formLabelPrimary}
    padding: 25px 30px;
    font-size: 13px;

    &__list {
      display: grid;
      grid-template-columns: auto;
      gap: ${gap};

      ${respond(`grid-template-columns: repeat(2, auto);`, 40)}

      ${respond(`grid-template-columns: repeat(4, auto);`, "940px")}
    }

    &__section-list {
      display: grid;
      grid-template-rows: minmax(24px, auto);
      grid-template-columns: auto;
      row-gap: 14px;
      column-gap: ${gap};
      align-items: center;

      &--col-2 {
        ${respond(
          `grid-template-rows: repeat(3, minmax(24px, auto));
        grid-auto-flow: column;`,
          110
        )}
      }
    }

    &__section-label {
      margin-top: 0;
      margin-bottom: 20px;
      font: inherit;

      &::after {
        display: inline;
        content: ":";
      }
    }

    &__item {
    }

    &__term,
    &__value {
      display: inline;
      margin: 0;
    }

    &__term {
      margin-right: 10px;
    }

    &__value {
      color: var(--strong-color);
    }

    &__private-icon {
      position: relative;
      top: -2.5px;
      margin-left: 10px;
      color: var(--weak-color);
    }
  }
`;
