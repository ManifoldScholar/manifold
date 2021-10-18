import { breakpoints } from "theme/styles/variables/media";
import { respond } from "theme/styles/mixins";

export default `
  /* Can be abstracted for other wrappers */
  .search-form-frontend {
    padding: 60px 0 40px;
    background-color: var(--color-base-neutral05);

    .container {
      max-width: ${breakpoints[90]};
    }

    header {
      padding-bottom: 25px;

      .title {
        font-family: var(--font-family-heading);
        margin: 0;
        font-size: 24px;
        font-weight: var(--font-weight-regular);
        color: var(--color-base-neutral75);
      }

      .subtitle {
        font-family: var(--font-family-copy);
        margin-top: 0.429em;
        font-size: 14px;
        font-style: italic;
        color: $neutral70;
      }
    }

    .search-query {
      input[type="text"] {
        background-color: var(--color-base-neutral-white);

        ${respond(`padding: 0.722em 1.111em 0.889em 57px;`, 60)}

        &::placeholder {
          color: inherit;
        }
      }
    }
  }
`;
