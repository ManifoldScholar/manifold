import {
  panelRounded,
  formLabelPrimary,
  headingSecondary,
  formInstructions,
  utilityPrimary
} from "theme/styles/mixins";

const basePaddingVertical = "38px";
const basePaddingLateral = "38px";
const gap = "20px";

export default `
  .group-action-panel {
    ${panelRounded}
    padding: ${basePaddingVertical} ${basePaddingLateral};
    color: var(--strong-color);

    &__label {
      ${formLabelPrimary}
      margin-top: 0;
      margin-bottom: 2.5em;
      color: var(--color);
    }

    &__heading {
      ${headingSecondary}
      margin-bottom: 0.5em;
    }

    &__instructions {
      ${formInstructions}
    }

    &__inputs {
      margin-top: 40px;
    }

    &__checkbox {
      display: flex;

      & + & {
        margin-top: 12px;
        margin-left: 0;
      }
    }

    &__checkbox-text {
      ${utilityPrimary}
      font-size: 14px;
      transform: translateY(2px);
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      padding-top: 40px;
      margin-top: -${gap};
      margin-left: -${gap};

      > * {
        flex-grow: 1;
        margin-top: ${gap};
        margin-left: ${gap};
      }
    }
  }
`;
