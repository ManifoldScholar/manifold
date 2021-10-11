import {
  respond,
  utilityPrimary,
  defaultTransitionProps,
  unstyledSelect
} from "theme/styles/mixins";

export default `
  .select {
    &__label {
      ${utilityPrimary}
      display: block;
      margin-bottom: 12px;
      font-size: 12px;
      font-weight: var(--font-weight-semibold);
      letter-spacing: 0.1em;

      &--empty {
        display: none;
        ${respond(`display: block;`, 60)}
      }
    }

    &__wrapper {
      position: relative;
    }

    select,
    &__select {
      ${unstyledSelect}
      ${utilityPrimary}
      width: 100%;
      height: 2.857em;
      padding-right: 32px;
      padding-left: 13px;
      overflow: hidden;
      font-size: 16px;
      font-weight: var(--font-weight-regular);
      text-overflow: ellipsis;
      text-transform: none;
      letter-spacing: normal;
      white-space: nowrap;
      background-color: var(--select-bg-color, inherit);
      border: 1px solid var(--color-neutral-ui-dull-light);
      border-radius: 8px;
      transition: border-color ${defaultTransitionProps};

      &:focus-visible {
        border-color: var(--highlight-color);
      }
    }

    svg {
      position: absolute;
      top: 50%;
      right: 8px;
      width: 22px;
      height: 22px;
      pointer-events: none;
      transform: translateY(-50%);
    }
  }
`;
