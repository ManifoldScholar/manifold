import { headerContainerPrimary, headerLogo } from "theme/styles/mixins";

export default `
  .overlay-header {
    position: fixed;
    z-index: 5;
    width: 100%;

    &__inner {
      ${headerContainerPrimary}
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    &__logo {
      ${headerLogo}
    }
  }
`;
