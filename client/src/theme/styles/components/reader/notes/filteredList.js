import {
  drawerPadding,
  listUnstyled,
  respond,
  buttonUnstyled,
  defaultTransitionProps,
  textTruncate,
  buttonAvatar,
  defaultFocusStyle
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { entityFilterForm } from "theme/styles/variables/crossComponent";
import { TAG_WIDTH } from "theme/styles/components/global/annotation/tag";

const iconSize = "24px";
const columnGapMobile = "10px";
const columnGapDesktop = "16px";
const breakpoint = breakpoints[50];
const collapseDuration = "350ms";
const collapseEasing = "linear";
const inputGap = entityFilterForm.gap;

export default `
.notes-filtered-list {
  &__header {
    ${drawerPadding("padding-right", "narrow")}
    ${drawerPadding("padding-left", "narrow")}
    display: flex;
    flex-wrap: wrap;
    gap: 18px;
    align-items: start;
    padding-top: 20px;
    padding-bottom: 28px;

    ${respond(`gap: 36px`, 120)}
  }

  &__header-start {
    flex-shrink: 0;
  }

  &__header-end {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: end;
    gap: ${inputGap}px;

    ${respond(`flex-direction: row;`, 40)}
    ${respond(`flex-direction: column;`, 65)}
    ${respond(`flex-direction: row;`, 75)}
  }

  &__see-all {
    flex-shrink: 0;
    padding: 6px 9px 8px 13px;
    font-size: 13px;
    border-color: var(--select-border-color);
    width: 100%;

    ${respond(`width: auto;`, 40)}
    ${respond(`width: 100%;`, 65)}
    ${respond(`width: auto;`, 75)}
  }

  &__see-all-icon {
    top: 0;
    margin-left: 6px;
  }

  &__section-list {
    ${listUnstyled}
    font-family: var(--font-family-heading);
    color: var(--strong-color);
  }

  &__section-button {
    ${buttonUnstyled}
    ${drawerPadding("padding-right", "narrow")}
    ${drawerPadding("padding-left", "narrow")}
    display: block;
    width: 100%;
    padding-top: 11px;
    padding-bottom: 13px;
    text-align: left;
    background-color: var(--box-bg-color);
    transition: background-color ${defaultTransitionProps};

    &:hover,
    &.focus-visible {
      color: inherit;
      background-color: var(--box-medium-bg-color);
      outline: 0;
    }

    &.focus-visible {
      ${defaultFocusStyle}
      outline-offset: -2px;
    }
  }

  &__section-button-inner {
    display: grid;
    grid-template: 'icon label' auto / ${iconSize} 1fr;
    column-gap: ${columnGapMobile};
    align-items: start;

    ${respond(`column-gap: ${columnGapDesktop};`, breakpoint)}
  }

  &__section-label {
    display: block;
    grid-area: label;
    overflow: hidden;
    font-size: 18px;
    font-weight: var(--font-weight-medium);
    line-height: 1.4;
    cursor: inherit;

    ${respond(`font-size: 21px;`, breakpoint)}
  }

  &__disclosure-icon {
    position: relative;
    top: 2px;
    grid-area: icon;
    transition: transform ${collapseDuration} ${collapseEasing};
    transform: rotate(-0.25turn);

    &--expanded {
      transform: rotate(0);
    }

    ${respond(`top: 4px;`, breakpoint)}
  }

  &__group {
    ${listUnstyled}
    padding-top: 15px;
    padding-bottom: 15px;
  }

  &__item-button {
    --darker-tag-bg-color: var(--box-medium-bg-color);

    ${buttonUnstyled}
    ${drawerPadding("padding-right", "narrow")}
    ${drawerPadding("padding-left", "narrow")}
    display: block;
    width: 100%;
    padding-top: 11px;
    padding-bottom: 11px;
    font-size: 16px;
    text-align: left;
    transition: background-color ${defaultTransitionProps};

    &:hover,
    &.focus-visible {
      --darker-tag-bg-color: var(--box-strong-bg-color);

      color: inherit;
      background-color: var(--box-medium-bg-color);
      outline: 0;
    }

    &.focus-visible {
      ${defaultFocusStyle}
      outline-offset: -2px;
    }
  }

  &__item-button-inner {
    display: grid;
    grid-template: 'icon inner' auto / ${iconSize} minmax(0, 1fr);
    column-gap: ${columnGapMobile};

    ${respond(`column-gap: ${columnGapDesktop};`, breakpoint)}
  }

  &__item-icon {
    grid-area: icon;
    color: var(--weak-color);

    ${respond(`align-self: center;`, 120)}
  }

  &__item-inner {
    display: flex;
    flex-direction: column;
    gap: 12px;
    grid-area: inner;
    align-items: start;

    ${respond(`flex-direction: row; align-items: center; gap: 40px`, 120)}
  }

  &__item-text {
    ${textTruncate}
    flex-grow: 1;
    width: 100%;
    line-height: calc(${iconSize} - 3px);
  }

  &__item-creator {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  &__item-creator-avatar {
    flex-shrink: 0;

    &--image {
      ${buttonAvatar(14, "var(--strong-color)")}
      margin-right: 2px;
      margin-left: 1px;
      transform: translateY(1px);
    }

    &--default {
      transform: translateY(-1px);
    }
  }

  &__item-tag {
    width: ${TAG_WIDTH};
    flex-shrink: 0;
    display: flex;
  }
}
`;
