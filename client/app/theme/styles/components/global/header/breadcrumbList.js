import { respond } from "theme/styles/mixins";

export default `
  .breadcrumb-list {
    font-family: var(--font-family-sans);

    &__link {
      display: inline;
      font-size: 17px;
      text-decoration: none;

      ${respond(`font-size: 20px;`, 40)}
    }

    &__icon {
      position: relative;
      top: -1px;
      margin-right: 5px;
      margin-left: 5px;
      transform: rotate(-90deg);
    }
  }
`;
