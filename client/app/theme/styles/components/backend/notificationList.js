import { fluidScale, listUnstyled, buttonUnstyled } from "theme/styles/mixins";

export default `
  .notification-list-block {
    ul {
      ${listUnstyled}

      li {
        position: relative;
        padding: 14px 60px 17px 20px;
        background-color: var(--color-base-neutral80);

        + li {
          margin-top: 20px;
        }

        p {
          font-size: ${fluidScale("18px", "16px")};
          font-family: var(--font-family-sans);
          color: var(--color-base-neutral40);
          letter-spacing: 0.015em;

          a {
            text-decoration: none;
          }
        }
      }
    }

    &__close-button {
      ${buttonUnstyled}
      position: absolute;
      top: 50%;
      right: 22px;
      margin-top: -8px;
      color: var(--color-base-neutral40);
    }
  }
`;
