// See https://benmarshall.me/responsive-iframes/

export default `
  .responsive-iframe {
    position: relative;
    display: block;
    max-width: 100%;
    height: 0;
    padding-top: 56.25%;
    overflow: hidden;

    iframe,
    object,
    embed,
    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;
