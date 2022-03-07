import { utilityPrimary, fluidScale } from "theme/styles/mixins";

export default `
  .notation-detail {
    .notation-type {
      ${utilityPrimary}
      font-size: 13px;
      color: var(--color-base-neutral50);
    }

    .button-secondary {
      width: ${fluidScale("320px", "250px")};
      max-width: 100%;
    }
  }
`;
