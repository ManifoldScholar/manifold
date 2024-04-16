import { buttonUnstyled } from "theme/styles/mixins";

export default `
  .annotation-popup-menu-item {
    ${buttonUnstyled}
    width: 100%;
    min-width: 290px;
    color: var(--group-button-color, inherit);
    text-align: left;
    background-color: var(--group-button-bg-color, transparent);
    transition: none;

    &:hover,
    &.focus-visible {
      color: var(--group-button-hover-color);
      background-color: var(
        --group-button-hover-bg-color,
        var(--color-interaction-dark)
      );
      outline: 0;
    }

    &__inner {
      display: grid;
      grid-template: "selected label private" auto / 22px 1fr 18px;
      column-gap: 14px;
      padding: 10px 20px;
    }

    &__selected-icon {
      grid-area: selected;
    }

    &__private-icon {
      grid-area: private;
      margin-top: 2px;
      color: var(--group-button-private-icon-color);

      .annotation-popup-menu-item:hover &,
      .annotation-popup-menu-item.focus-visible & {
        color: inherit;
      }
    }

    &__text {
      display: block;
      grid-area: label;
      min-height: 22px;
      font-size: 17px;
      font-family: var(--font-family-sans);
      text-wrap: wrap;
    }
  }
`;
