import { respond } from "theme/styles/mixins";

export default `
  .resource-preview {
    .overlay-full & {
      padding-top: 70px;

      ${respond(`padding-top: 120px;`, 70)}
    }
  }

  .resource-preview-image {
    img {
      width: 100%;
      height: auto;
    }
  }

  .resource-preview-video {
    position: relative;
    height: 500px;

    &.external-video {
      height: 620px;

      .figure-video {
        width: 100%;
        height: 100%;

        iframe {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

  .resource-preview-interactive {
    position: relative;

    iframe {
      border: 0;
    }
  }
`;
