import { respond, defaultTransitionProps } from "theme/styles/mixins";

export default `
  .permissions-form {
    .user {
      display: flex;
      align-items: center;

      + .form-input {
        margin-top: 20px;
      }

      .meta {
        .name {
          font-family: var(--font-family-sans);
          max-width: 100%;
          margin: 0;
          font-size: 16px;
          line-height: 21px;
          color: var(--color-base-neutral30);
          letter-spacing: 0.015em;
          transition: color ${defaultTransitionProps};

          ${respond(`font-size: 18px;`, 80)}

          &.large {
            font-size: 18px;

            ${respond(`font-size: 22px;`, 80)}
          }
        }
      }

      figure {
        &.avatar {
          margin-right: 15px;

          img {
            width: 50px;
            height: 50px;
            border-radius: 100%;
          }

          svg {
            width: 50px;
            height: 50px;
            color: var(--color-base-neutral45);
          }
        }
      }
    }
  }
`;
