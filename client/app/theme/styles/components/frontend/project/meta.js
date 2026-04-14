import { listHorizontal, utilityPrimary } from "theme/styles/mixins";

export default `
  .meta-list {
    ${listHorizontal}
    margin-right: -63px;
    margin-left: -63px;

    li {
      width: 50%;
      padding-right: 63px;
      padding-left: 63px;
      vertical-align: top;
    }

    .meta-label {
      ${utilityPrimary}
      color: var(--color-base-neutral40);
    }

    .meta-value {
      font-family: var(--font-family-heading);
      margin-top: 4px;
      margin-bottom: 19px;
      font-size: "26px";
      color: var(--color-base-neutral80);
    }
  }
`;
