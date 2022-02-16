import { listUnstyled } from "theme/styles/mixins";

export default `
  .notes-list {
    ${listUnstyled}
    padding: 0;

    & > li + li {
      padding-top: 43px;
    }

    &--pad-top {
      padding-block-start: 40px;
    }
  }
`;
