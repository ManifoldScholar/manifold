import { fluidScale } from "theme/styles/mixins";

export default `
  .frontend-content-block {
    &--default {
      &:last-child {
        margin-bottom: ${fluidScale("65px", "50px")};
      }

      + .frontend-content-block {
        margin-top: ${fluidScale("55px", "25px")};
      }
    }

    &--shaded {
      padding-bottom: 30px;
      background-color: var(--color-base-neutral05);
      padding-top: ${fluidScale("30px", "0px")};
    }

    &--box {
      --content-color: var(--color-neutral-text-dark);
      --card-bg-color: var(--color-base-neutral-white);

      padding-top: 15px;
      padding-bottom: 45px;
      background-color: var(--color-base-neutral05);
      border-radius: var(--box-border-radius);

      & + & {
        margin-top: clamp(40px, 6.452vw, 50px);
      }
    }

    &--nested {
      --content-color: var(--color-neutral-text-dark);
      --card-bg-color: var(--color-base-neutral-white);

      & + & {
        margin-top: clamp(20px, 3.225vw, 30px);
      }
    }
  }
`;
