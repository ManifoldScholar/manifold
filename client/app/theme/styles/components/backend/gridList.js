import { respond, listUnstyled } from "theme/styles/mixins";

export default `
  .grid-list {
    margin-bottom: 24px;

    ul {
      ${listUnstyled}
      display: flex;
      flex-direction: column;

      ${respond(`flex-flow: row wrap;`, 75)}

      li {
        ${respond(
          `flex: 1 1 25%;
      max-width: 25%;`,
          75
        )}

        ${respond(
          `flex-basis: 20%;
      max-width: 20%;`,
          90
        )}
      }
    }

    .drawer-backend & {
      li {
        padding: 15px 0;

        ${respond(
          `flex-basis: 25%;
        max-width: 25%;
        padding: 15px;`,
          90
        )}
      }
    }
  }
`;
