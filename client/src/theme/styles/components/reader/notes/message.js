import { drawerPadding } from "theme/styles/mixins";

export default `
  .notes-message {
    margin-top: 42px;

    .heading-primary {
      margin-bottom: 0.8em;
      color: var(--strong-color);
    }

    p {
      font-family: var(--font-family-copy);
      font-size: 19px;
    }

    .drawer & {
      ${drawerPadding("padding-right", "narrow")}
      ${drawerPadding("padding-left", "narrow")}
      margin-top: 0;
    }
  }
`;
