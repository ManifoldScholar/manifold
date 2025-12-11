import { respond } from "theme/styles/mixins";

export default `
  .button-nav {
    display: flex;
    justify-content: center;
    margin-top: -10px;
    margin-bottom: -10px;

    &--default {
      flex-direction: column;

      ${respond(`flex-direction: row;`, 75)}
    }

    &--stack {
      flex-direction: column;
      gap: 1.125rem;
    }

    .button-icon-primary {
      flex-grow: 1;
      margin: 10px;
      vertical-align: top;

      ${respond(`flex-grow: 0;`, 75)}
    }
  }
`;
