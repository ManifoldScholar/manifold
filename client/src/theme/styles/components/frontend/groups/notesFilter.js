import { entityFilterForm } from "theme/styles/variables/crossComponent";

const { gap, selectMinWidth } = entityFilterForm;

const flexBasis2Count = selectMinWidth * 2 + gap;
const flexBasis3Count = selectMinWidth * 3 + gap * 2;

export default `
  .notes-filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: baseline;

    &:not(:first-child) {
      margin-top: 50px;
    }

    &:not(:last-child) {
      margin-bottom: 40px;
    }

    &__start {
      flex-grow: 999;
    }

    &__end {
      flex-grow: 1;

      &--count-1 {
        flex-basis: ${selectMinWidth}px;
      }

      &--count-2 {
        flex-basis: ${flexBasis2Count}px;
      }

      &--count-3 {
        flex-basis: ${flexBasis3Count}px;
      }
    }
  }
`;
