import { respond, formInstructions } from "theme/styles/mixins";

export default `
  .project-collection-sort {
    display: flex;
    flex-direction: column;
    gap: 20px;
    justify-content: space-between;
    margin-bottom: 20px;

    ${respond(
      `
      flex-flow: row wrap;
      align-items: center;
    `,
      60
    )}

    &__order-select {
      padding-top: 5px;
    }

    &__instructional-copy {
      ${formInstructions}
      font-size: 13px;
    }

    .form-secondary {
      margin-top: 0;

      .form-input {
        display: flex;
        align-items: center;
        justify-content: space-between;

        ${respond(`justify-content: flex-end;`, 60)}

        .form-input-heading {
          margin-right: 12px;
          margin-bottom: 0;
          font-size: 13px;
          transform: translateY(-1px);
        }

        .toggle-indicator {
          display: inline-block;
        }
      }
    }
  }
`;
