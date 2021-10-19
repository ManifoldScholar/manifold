import { respond } from "theme/styles/mixins";

export default `
  .project-collection-form {
    ${respond(
      `max-width: 446.44px; /* set explicity to prevent drawer from expanding */`,
      75
    )}

    .button-switch-primary {
      &__side {
        font-size: 17px;
        font-weight: var(--font-weight-regular);
        text-transform: none;
        letter-spacing: 0;
      }

      &__label::after {
        ${respond(
          `
            display: inline;
            content: " Collection";
          `,
          "500px",
          "min"
        )}
      }
    }
  }
`;
