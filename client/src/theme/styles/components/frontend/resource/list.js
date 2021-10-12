import {
  listUnstyled,
  respond,
  utilityPrimary,
  defaultFocusStyle
} from "theme/styles/mixins";

export default `
  .resource-list {
    padding-bottom: 30px;

    .resource-count {
      ${utilityPrimary}
      margin-bottom: 24px;
      font-size: 13px;

      ${respond(
        `display: flex;
      justify-content: space-between;`,
        60
      )}

      .meta-value {
        ${utilityPrimary}
        font-size: 12px;

        a {
          &:visited {
            ${defaultFocusStyle}
          }
        }
      }

      span {
        color: var(--color-base-neutral75);
      }
    }

    > ul {
      ${listUnstyled}

      ${respond(
        `display: flex;
      flex-wrap: wrap;
      margin-left: -30px;`,
        75
      )}

      ${respond(`margin-left: -4.858vw;`, 85)}

      > li {
        width: 100%;
        margin-bottom: 18px;

        ${respond(
          `width: 50%;
        padding-left: 30px;
        margin-bottom: 30px;`,
          75
        )}

        ${respond(`padding-left: 4.858vw;`, 85)}
      }
    }
  }
`;
