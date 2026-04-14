import { respond, containerPrototype } from "theme/styles/mixins";

export default `
  .backend-detail {
    ${containerPrototype}
    padding-top: 4.5%;
    padding-bottom: 45px;

    ${respond(
      `
        padding-top: 45px;
      `,
      60
    )}

    .backend-panel > .container {
      padding-right: 0;
      padding-left: 0;
    }
  }
`;
