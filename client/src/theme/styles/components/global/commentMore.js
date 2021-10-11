import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";

export default `
  .comment-more {
    ${utilityPrimary}
    ${buttonUnstyled}
    display: block;
    width: 100%;
    padding-top: 13px;
    padding-bottom: 3px;
    margin-top: 20px;
    font-size: 13px;
    color: var(--strong-color);
    text-align: left;

    &__icon {
      margin-bottom: 2px;
      margin-left: 12px;
    }
  }
`;
