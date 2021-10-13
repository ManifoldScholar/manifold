import { respond } from "theme/styles/mixins";

export default `
  .frontend-content-block {
    &--default {
      &:last-child {
        margin-bottom: 50px;

        ${respond(`margin-bottom: 8.065vw;`, 60)}

        ${respond(`margin-bottom: 65px;`, 80)}

      + .frontend-content-block {
        margin-top: 25px;

        ${respond(`margin-bottom: 4.453vw;`, 60)}

        ${respond(`margin-bottom: 55px;`, 80)}
      }
    }

    &--shaded {
      padding-bottom: 30px;
      background-color: var(--color-base-neutral05);

      ${respond(`margin-bottom: 2.429vw;`, 60)}

      ${respond(`margin-bottom: 30px;`, 120)}
    }

    &--box {
      --content-color: var(--color-neutral-text-dark);
      --card-bg-color: var(--color-base-neutral-white);

      padding-top: 15px;
      padding-bottom: 45px;
      background-color: var(--color-base-neutral05);
      border-radius: var(--panel-rounded-radius);

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
