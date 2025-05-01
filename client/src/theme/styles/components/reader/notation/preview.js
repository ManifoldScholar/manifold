import {
  defaultTransitionProps,
  respond,
  defaultHoverStyle,
} from "theme/styles/mixins";
import { containerPaddingInline } from "theme/styles/variables/layout";

export default `
  .notation-preview-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-base-neutral-white);
    border-top: 1px solid var(--color-base-neutral50);
    transition: transform ${defaultTransitionProps};

    ${respond(`bottom: 0;`, 50)}

    &:empty {
      transform: translateY(100%);
    }

    .scheme-dark & {
      background-color: var(--color-base-neutral90);
    }

    &__link {
      display: block;
      text-decoration: none;

      &:hover,
      &.active,
      &:focus-visible {
        ${defaultHoverStyle}
        outline: 0;
      }
    }

    &__link-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 17px ${containerPaddingInline.responsive};

      .scheme-dark & {
        color: var(--color-base-neutral-white);
      }
    }

    &__figure {
      --Thumbnail-width: 70px;
      --Thumbnail-height: 43px;
      --Thumbnail-background-color: var(--box-medium-bg-color);
      --Thumbnail-Inner-padding: 61.429% 0 0;
      --Thumbnail-Icon-display: flex;
      --Thumbanil-Icon-size: 30px;

      display: flex;
      flex-grow: 2;
    }

    &__figcaption {
      font-family: var(--font-family-heading);
      margin-top: -0.231em;
      margin-left: 10px;
      font-size: 13px;
      font-weight: var(--font-weight-light);
      letter-spacing: 0.06em;

      ${respond(`font-size: 16px;`, 60)}
    }

    &__cube-icon {
      margin-right: 0.375em;
      color: var(--hover-color);
    }

    &__caret-icon {
      color: var(--hover-color);
      transform: rotate(-90deg);
    }
  }
`;
