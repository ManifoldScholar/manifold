import { listUnstyled, utilityPrimary } from "theme/styles/mixins";

const Color = require("color");

export default `
  .ordered-records {
    ${listUnstyled}
    display: flex;
    flex-direction: column;
    transition: background-color 0.4s ease;

    &--active {
      background-color: ${Color("#363636")
        .lighten(0.03)
        .hex()};
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
        background-color: ${Color("#363636")
          .lighten(0.03)
          .hex()};
      }
    }
  }
`;
