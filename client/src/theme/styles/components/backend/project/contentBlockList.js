import { dropzone } from "theme/styles/mixins";

export default `
  .content-block-list {
    ${dropzone("9px", "--show-dropzone")}

    + .content-block-list {
      margin-top: 16px;
    }

    &--show-dropzone + .content-block-list {
      margin-top: 16px;
    }

    &--show-dropzone {
      min-height: 85px;
    }
  }
`;
