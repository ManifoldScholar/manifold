import { respond } from "theme/styles/mixins";

export default `
  .custom-logo {
    &__image {
      position: relative;
      width: auto;
      max-width: 175px;
      height: auto;
      max-height: 26px;

      ${respond(
        `
          max-width: 100%;
          max-height: 59px;
        `,
        75
      )}

      &--desktop {
        display: none;
        ${respond(`display: block;`, 75)}
      }

      &--mobile {
        display: block;
        ${respond(`display: none;`, 75)}
      }
    }
  }
`;
