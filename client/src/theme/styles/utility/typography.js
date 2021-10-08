import {
  headingPrimary,
  headingSecondary,
  headingQuaternary,
  utilityPrimary,
  textTruncate
} from "../mixins/typography";

export default `
  .heading-primary {
    ${headingPrimary}
  }

  .heading-secondary {
    ${headingSecondary}
  }

  .heading-quaternary {
    ${headingQuaternary}
  }

  .utility-primary {
    ${utilityPrimary}
  }

  .truncate-text-overflow {
    ${textTruncate}
  }
`;
