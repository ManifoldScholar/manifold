import { defaultTransitionProps, textTruncate } from "theme/styles/mixins";

export const TAG_WIDTH = "200px";
const COUNT_WIDTH = "56px";

export default `
  .annotation-tag {
    display: flex;
    align-items: center;
    overflow: hidden;
    color: var(--color);
    background-color: var(--box-bg-color);
    border-radius: 12px;
    line-height: 1.4;
    font-family: var(--font-family-sans);

    &--group {
      ${textTruncate}
      width: max-content;
      max-width: min(100%, ${TAG_WIDTH});
      font-size: 14px;
    }

    &--creator {
      ${textTruncate}
      width: max-content;
      max-width: min(100%, ${TAG_WIDTH});
      font-size: 12px;
    }

    &__inner {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      min-width: ${COUNT_WIDTH};
      padding: 2px 10px 3px;

      & + & {
        padding-left: 8px;
      }

      > * + * {
        margin-left: 4px;
      }

      &--dark {
        flex-shrink: 0;
        background-color: var(--darker-tag-bg-color);
        transition: background-color ${defaultTransitionProps};
      }

      &[href] {
        transition: background-color ${defaultTransitionProps};
        text-decoration: none;

        &:hover {
          color: inherit;
          background-color: var(--box-medium-bg-color);
        }
      }
    }

    &--secondary {
      color: var(--error-color);
    }

    &__text {
      ${textTruncate}

      &--count {
        letter-spacing: 0.083em;
        transform: translateY(-0.5px);
      }
    }

    &__icon {
      flex-shrink: 0;

      &.svg-icon--interactComment16 {
        transform: translateY(0.5px);
      }
    }
  }
`;
