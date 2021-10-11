import { respond, buttonAvatar, headingPrimary } from "theme/styles/mixins";

export default `
  .sign-in-up-update {
    .form-group + .form-group {
      margin-top: 0;

      ${respond(`margin-top: 40px;`, 60)}
    }

    .nickname {
      ${headingPrimary}
      margin-bottom: 30px;
      color: var(--highlight-color);
    }

    .overlay-copy {
      margin-bottom: 20px;
    }

    .form-heading-image {
      ${headingPrimary}
      margin-top: 60px;
      margin-bottom: 20px;
    }

    .avatar {
      ${buttonAvatar(65)}
      margin: 25px auto;
    }
  }
`;
