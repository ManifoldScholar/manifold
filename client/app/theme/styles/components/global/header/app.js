import { rgba } from "theme/styles/mixins";

export default `
  .header-app {
    position: relative;
    top: 0;
    width: 100%;

    &--sticky {
      position: sticky;

      @supports (position: sticky) {
        box-shadow: 0 -10px 20px 7px ${rgba("neutralBlack", 0.25)};
      }
    }
  }
`;
