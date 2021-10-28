import { listUnstyled, utilityPrimary, lighten } from "theme/styles/mixins";

export default `
  .ordered-records {
    ${listUnstyled}
    display: flex;
    flex-direction: column;
    transition: background-color 0.4s ease;

    &--active {
      background-color: ${lighten("neutral90", 3)};
    }

    &--empty {
      position: relative;
      min-height: 87px;

      p {
        ${utilityPrimary}
        width: 100%;
        padding: 16px;
        font-size: 14px;
        text-align: center;
        border: 1px solid;
      }
    }

    &__dropzone {
      padding: 16px 32px;
      margin: -16px -32px;

      border-radius: 8px;
      transition: background-color 0.4s ease;

      &--active {
        background-color: ${lighten("neutral90", 3)};
      }
    }
  }
`;
