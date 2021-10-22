import { listUnstyled, respond, buttonUnstyled } from "theme/styles/mixins";

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
        font-family: var(--font-family-sans);
        font-size: 16px;
        color: var(--color-base-neutral40);
        letter-spacing: 0.015em;

        ${respond(`font-size: 18px;`, 30)}
        }

        ${respond(`font-size: 16px;`, 75)}
        }

        ${respond(`font-size: 18px;`, 85)}
        }

        a {
          text-decoration: none;
        }
      }
    }
  }

  /* Close button */
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
