import {
  clearfix,
  respond,
  subtitlePrimary,
  utilityPrimary,
  listUnstyled
} from "theme/styles/mixins";

export default `
  .asset-thumb {
    .asset-link {
      ${clearfix()}
    }

    .asset-image {
      position: relative;
      float: left;
      width: 22%;
      text-align: left;

      ${respond(`width: 90px;`, 40)}

      ${respond(`width: 20%;`, 75)}

      img {
        max-width: 100%;
        height: auto;
        max-height: 130%;
      }
    }

    .asset-image-placeholder {
      svg {
        max-width: 100%;
        height: auto;
        max-height: 130px;

        path {
          fill: var(--color-base-neutral40);
        }
      }
    }

    .asset-description {
      float: left;
      width: 78%;
      padding-left: 6%;

      ${respond(`width: calc(100% - 90px);`, 40)}

      ${respond(`width: 80%;`, 75)}

      a {
        display: block;
        text-decoration: none;
      }

      .asset-title {
        font-family: var(--font-family-heading);
        margin-top: 0;
        margin-bottom: 0.697em;
        font-size: 20px;
        font-weight: var(--font-weight-semibold);
        color: var(--color-base-neutral90);

        ${respond(`font-size: 23px;`, 85)}

        .subtitle {
          ${subtitlePrimary}
          display: block;
          margin-top: 0.625em;
          font-size: 18px;
        }
      }

      .asset-date {
        ${utilityPrimary}
        font-size: 14px;
        color: var(--color-base-neutral50);
      }
    }

    .asset-status {
      margin-top: 20px;
    }

    /* <ul> of icons or links */
    .asset-interactions {
      ${listUnstyled}
      display: flex;
      align-items: flex-end;
      justify-content: flex-start;
      margin-top: -3px;

      li {
        ${utilityPrimary}
        font-size: 15px;
        color: var(--color-base-neutral40);

        + li {
          margin-left: 22px;
        }
      }

      a {
        color: var(--color-base-neutral80);
        text-decoration: none;
      }
    }
  }
`;
