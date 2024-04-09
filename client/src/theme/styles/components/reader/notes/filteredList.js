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

const iconSize = "24px";
const columnGapMobile = "10px";
const columnGapDesktop = "16px";
const breakpoint = breakpoints[50];
const collapseDuration = "350ms";
const collapseEasing = "linear";
const seeAllMinWidth = "109px";
const groupSelectMinWidth = entityFilterForm.selectMinWidth;
const inputGap = entityFilterForm.gap;

export default `
.notes-filtered-list {
  &__header {
    ${drawerPadding("padding-right", "narrow")}
    ${drawerPadding("padding-left", "narrow")}
    display: flex;
    flex-wrap: wrap;
    gap: ${inputGap}px;
    align-items: center;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  &__header-start {
    flex-grow: 999;
  }

  &__header-end {
    display: flex;
    flex-basis: ${seeAllMinWidth};
    flex-grow: 1;
    gap: ${inputGap}px;

    &--has-select {
      flex-basis: calc(${groupSelectMinWidth}px + ${inputGap}px + ${seeAllMinWidth});
    }
  }

  &__see-all {
    flex-shrink: 0;
    padding: 6px 9px 8px 13px;
    font-size: 13px;
    border-color: var(--select-border-color);
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
    align-items: center;

    ${respond(`column-gap: ${columnGapDesktop};`, breakpoint)}
  }

  &__section-label {
    display: block;
    grid-area: label;
    overflow: hidden;
    font-size: 18px;
    font-weight: var(--font-weight-medium);
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
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

    ${respond(
      `
        grid-template: ". icon inner" auto / ${iconSize} ${iconSize} minmax(
            0,
            1fr
          );
      `,
      95
    )}
  }

  &__item-icon {
    grid-area: icon;
    color: var(--weak-color);
  }

  &__item-inner {
    display: flex;
    flex-direction: column;
    grid-area: inner;
    align-items: baseline;

    ${respond(`flex-direction: row;`, 95)}
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
    margin-top: 12px;

    ${respond(
      `margin-top: -3px;
    margin-left: 40px;`,
      95
    )}
  }
}
`;
