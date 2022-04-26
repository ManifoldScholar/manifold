import {
  drawerPadding,
  drawerIndent,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";
import { annotationList } from "theme/styles/variables/crossComponent";

const {
  avatarHeight,
  avatarPlaceholderWidth,
  avatarPlaceholderMarginInlineStart
} = annotationList;

export default `
  .annotation-footer-button {
    ${drawerPadding("padding-right")}
    ${drawerPadding("padding-left")}
    ${buttonUnstyled}
    ${utilityPrimary}
    display: block;
    width: 100%;
    padding-top: 18px;
    padding-bottom: 18px;
    font-size: 13px;
    text-align: left;
    background-color: var(--box-medium-bg-color);
    border-bottom-right-radius: var(--box-border-radius);
    border-bottom-left-radius: var(--box-border-radius);
    transition: color ${defaultTransitionProps}, background-color ${defaultTransitionProps};

    &:hover,
    &.focus-visible {
      color: var(--strong-color);
      background-color: var(--box-strong-bg-color);
    }

    &:not(:first-child) {
      margin-top: -10px;
    }

    &__inner {
      position: relative;
      display: flex;
      align-items: center;
      height: ${avatarHeight};
    }

    &__icon-container {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      width: ${avatarPlaceholderWidth};
      height: ${avatarHeight};
      margin-left: ${avatarPlaceholderMarginInlineStart};
    }

    &__text {
      ${drawerIndent("padding-left")}
      transform: translateY(-1px);
    }

    &__arrow-icon {
      margin-left: 12px;
      transition: transform ${defaultTransitionProps};
      transform: translate(0, -0.5px);

      .annotation-footer-button:hover & {
        transform: translate(20%, -0.5px);
      }
    }
  }
`;
