import { respond, listHorizontal } from "theme/styles/mixins";

export default `
  .text-category-list-primary {
    .text-category {
      + .text-category,
      + div {
        padding-top: 73px;
      }
    }

    .texts-group {
      ${listHorizontal}
      margin-bottom: -45px;
      font-size: 0;

      ${respond(
        `margin-bottom: -73px;
      margin-left: -45px;`,
        75
      )}

      ${respond(`margin-left: -65px;`, 80)}

      > li {
        width: 100%;
        padding-bottom: 45px;
        /* Font base size reset */
        font-size: 16px;
        vertical-align: top;

        ${respond(
          `width: 50%;
      padding-bottom: 73px;
      padding-left: 45px;`,
          75
        )}

        ${respond(`padding-left: 65px;`, 80)}
      }
    }
  }
`;
