import { respond, panelRounded } from "theme/styles/mixins";

export default `
  .backend-panel {
    > .container {
      display: flex;
      flex-direction: column;

      ${respond(`flex-direction: row;`, 65)}

      &:not(.flush) {
        --container-padding-block-start: 42px;
      }
    }

    .aside {
      ${panelRounded}
      display: none;
      width: 192px;
      height: max-content;
      padding: 25px 31px 45px;
      margin-right: 20px;

      ${respond(`display: block;`, 65)}
      ${respond(`margin-right: 46px;`, 110)}
    }

    .aside-wide {
      display: none;
      width: 300px;
      margin-right: 20px;

      ${respond(
        `
          display: block;
          width: 34.88%;
          min-width: 260px;
          max-width: 312px;
          margin-right: 46px;
        `,
        75
      )}

      ${respond(`min-width: auto;`, 85)}

      ${respond(
        `
          min-width: 312px;
          margin-right: 70px;
        `,
        110
      )}
    }

    .panel {
      flex-grow: 1;

      &:only-child {
        padding-right: 5px;
        padding-left: 5px;
      }
    }
  }
`;
