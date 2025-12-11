import {
  subtitlePrimary,
  headingPrimary,
  respond,
  fluidScale
} from "theme/styles/mixins";

export default `
  .reader-text-meta {
    .overlay-full & {
      padding-top: 85px;

      ${respond(`padding-top: 150px;`, 65)}
    }

    .title {
      display: block;
      margin-bottom: 0.3em;
      color: var(--color-base-neutral80);
      ${headingPrimary}
    }

    .subtitle {
      ${subtitlePrimary}
      font-size: 18px;
      color: var(--color-base-neutral80);

      ${respond(`font-size: 21px;`, 60)}
    }

    header {
      padding-bottom: ${fluidScale("80px", "28px")};
    }
  }
`;
