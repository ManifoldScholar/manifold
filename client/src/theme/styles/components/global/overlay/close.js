import { buttonUnstyled, utilityPrimary } from "theme/styles/mixins";

export default `
  .overlay-close {
    ${buttonUnstyled}
    ${utilityPrimary}
    display: flex;
    align-items: center;
    font-size: 13px;
    line-height: 24px;

    &__icon {
      margin-left: 9px;
    }
  }
`;
