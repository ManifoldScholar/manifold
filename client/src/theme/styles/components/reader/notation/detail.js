import { utilityPrimary, respond } from "theme/styles/mixins";

export default `
  .notation-detail {
    .notation-type {
      ${utilityPrimary}
      font-size: 13px;
      color: var(--color-base-neutral50);
    }

    .resource-slideshow {
      margin-top: 14px;

      ${respond(`margin-top: 25px;`, 60)}

      .slide-footer {
        padding-right: 0;
        padding-left: 0;
      }
    }

    .resource-title__title {
      color: var(--strong-color);
    }

    .button-secondary {
      width: 250px;
      max-width: 100%;

      ${respond(`width: 320px;`, 60)}
    }
  }
`;
