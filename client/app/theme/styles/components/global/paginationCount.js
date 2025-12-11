import { formLabelPrimary } from "theme/styles/mixins";

export default `
  .pagination-count {
    ${formLabelPrimary}
    margin: 0;
    font-size: 13px;
    color: var(--color-base-neutral75);

    &__figure {
      color: var(--color-base-neutral90);
    }
  }
`;
