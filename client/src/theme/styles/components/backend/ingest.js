import { utilityPrimary, formInstructions, respond } from "theme/styles/mixins";

export default `
  .ingestion-output {
    .ingest-header {
      margin-bottom: 30px;
    }

    &__label {
      ${utilityPrimary}
      margin-top: 20px;
      font-size: 12px;
    }

    &__value {
      ${formInstructions}
      margin-top: 12px;
      font-size: 17px;
      font-style: normal;
      color: var(--color-neutral-text-extra-light);
    }

    &__properties {
      display: flex;
      flex-wrap: wrap;
      margin-top: 0;
      margin-bottom: 10px;

      > * {
        flex-basis: 50%;
      }
    }

    &__log-value {
      height: 200px;
      padding: 15px;
      margin-top: 10px;
      overflow-y: auto;
      font-size: 14px;
      font-family: var(--font-family-mono);
      line-height: 1.45em;
      white-space: pre-line;
      color: var(--color-neutral-text-extra-light);
      border: 1px solid var(--color-neutral-ui-dull-light);

      ${respond(`height: 50vh;`, 90)}
    }

    &__buttons {
      margin: 30px 0 15px;
    }

    &__utility {
      margin-top: 20px;
    }
  }
`;
