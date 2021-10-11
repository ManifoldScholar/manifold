import { entityFilterForm } from "theme/styles/variables/crossComponent";
import { panelRounded } from "theme/styles/mixins";

const { gap, selectMinWidth, searchMinWidth } = entityFilterForm;

export default `
  .table-filter-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: baseline;
    padding-top: 6px;
    padding-bottom: 20px;
    margin-bottom: 8px;

    &--count-only {
      ${panelRounded}
      padding-top: 14px;
      padding-right: 22px;
      padding-left: 22px;
    }

    &__start {
      flex-grow: 999;
    }

    &__end {
      flex-basis: ${searchMinWidth + gap + selectMinWidth}px;
      flex-grow: 1;
    }
  }
`;
