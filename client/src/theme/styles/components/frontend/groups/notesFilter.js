import { entityFilterForm } from "theme/styles/variables/crossComponent";
import { stripUnit } from "@castiron/style-mixins";

const inputGap = entityFilterForm.gap;
const selectMinWidth = entityFilterForm.selectMinWidth;

const flexBasis2Count = stripUnit(selectMinWidth) * 2 + stripUnit(inputGap);
const flexBasis3Count = stripUnit(selectMinWidth) * 3 + stripUnit(inputGap) * 2;

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
        flex-basis: ${selectMinWidth};
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
