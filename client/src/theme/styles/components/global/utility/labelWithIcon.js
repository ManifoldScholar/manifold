import { formLabelPrimary } from "theme/styles/mixins";

export default `
  .label-with-icon {
    ${formLabelPrimary}
    white-space: nowrap;

    &__icon {
      align-self: center;
      margin-right: 8px;
      transform: translateY(-1.5px);
    }

    &__text-large {
      font-size: 13px;
    }
  }
`;
