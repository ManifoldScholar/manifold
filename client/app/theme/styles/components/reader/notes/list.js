import { listUnstyled } from "theme/styles/mixins";

export default `
  .notes-list {
    ${listUnstyled}
    padding: 0;

    &--pad-top {
      padding-block-start: 40px;
    }

    &--compact {
      --_li-padding-block-start: 30px;
      --_li-first-child-padding-block-start: 30px;

      display: flex;
      flex-direction: column;

      > li {
        padding-block-end: var(--_li-padding-block-start);
        border-block-end: 1px solid var(--color-neutral-ui-dull-dark);
      }
    }

    > li {
      padding-block-start: var(--_li-padding-block-start, 43px);

      &:first-child {
        padding-block-start: var(--_li-first-child-padding-block-start, 0);
      }
    }
  }
`;
