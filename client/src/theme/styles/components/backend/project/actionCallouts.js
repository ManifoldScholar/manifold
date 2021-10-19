import { respond } from "theme/styles/mixins";

export default `
  .action-callouts {
    display: flex;
    flex-direction: column;

    ${respond(
      `
        flex-flow: row nowrap;
        justify-content: space-between;

        > * {
          flex-basis: calc(25% - 12px);
        }
      `,
      85
    )}
  }
`;
