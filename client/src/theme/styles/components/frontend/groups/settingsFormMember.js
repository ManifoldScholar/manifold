import { panelRounded, respond } from "theme/styles/mixins";

export default `
  .member-settings-form {
    margin-top: 30px;

    input,
    .instructions {
      color: var(--strong-color);
    }

    &__style-preview {
      ${panelRounded}
      font-family: var(--font-family-heading);
      padding: 1.3em 1.6em 1.6em;
      margin-top: 20px;
      font-size: 17px;
      line-height: 1.7;
      color: var(--strong-color);

      ${respond(`font-size: 20px;`, 60)}

      &:not(:first-child) {
        margin-top: 20px;
      }

      &:not(:last-child) {
        margin-bottom: 20px;

        ${respond(`margin-bottom: 40px;`, 60)}
      }
    }
  }
`;
