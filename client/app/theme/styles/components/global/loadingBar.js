export default `
  .loading-bar {
    position: fixed;
    top: 0;
    width: 100%;
    height: 5px;
    visibility: hidden;

    &.loading,
    &.complete {
      visibility: visible;
    }

    .progress {
      position: relative;
      width: 0%;
      height: 100%;
      background-color: var(--highlight-color);
      opacity: 0;
    }

    &.loading .progress {
      width: 90%;
      opacity: 1;
      transition: width 100s cubic-bezier(0.06, 0.95, 0.4, 0.93);
    }

    &.complete .progress {
      width: 100%;
      opacity: 0;
      transition: width 0.5s ease-out, opacity 0.8s ease;
    }
  }
`;
