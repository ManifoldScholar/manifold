import { respond } from "theme/styles/mixins";

export default `
  .resource-title {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding-top: 23px;
    padding-bottom: 26px;
    text-decoration: none;

    &__icon {
      display: none;
      padding-right: 18px;

      ${respond(`display: inline-block;`, 60)}

      svg {
        fill: var(--color-base-neutral50);
      }
    }

    &__title {
      font-family: var(--font-family-heading);
      width: 100%;
      margin: 0;
      margin-bottom: 5px;
      font-size: 26px;
      font-weight: var(--font-weight-medium);
      hyphens: none;

      ${respond(`width: auto;`, 60)}
    }

    &__title-and-toggle {
      display: flex;
    }

    &__collecting-toggle {
      margin-left: 12px;
      transform: translateY(5px);
    }

    + .resource-content {
      margin-top: -8px;
    }
  }
`;
