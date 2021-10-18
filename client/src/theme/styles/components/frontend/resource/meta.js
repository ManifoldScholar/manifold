import { respond } from "theme/styles/mixins";

export default `
  .resource-meta,
  .resource-meta-mobile {
    .resource-type {
      margin-bottom: 14px;

      ${respond(`margin-bottom: 2px;`, 65)}
    }

    /* <ul> */
    .meta-list-secondary {
      margin-bottom: 22px;

      &:not(:first-child) {
        margin-top: 10px;
      }
    }

    /* Only shown on mobile */
    .meta-list-primary {
      margin-bottom: 22px;
    }
  }
`;
