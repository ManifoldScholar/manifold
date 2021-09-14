import { listUnstyled, rgba } from "theme/styles/mixins";

export default `
  .annotation-group-options {
    --tail-size: 16px;
    --group-button-color: inherit;
    --group-button-bg-color: transparent;
    --group-button-hover-bg-color: var(--color-base-neutral30);

    position: absolute;
    top: calc(100% + var(--tail-size) * 2);
    left: 50%;
    z-index: 1;
    padding-top: 30px;
    padding-bottom: 20px;
    background-color: var(--box-medium-bg-color);
    border-radius: var(--box-border-radius);
    box-shadow: 5px 15px 35px 8px ${rgba("neutralBlack", 0.13)};
    outline: 0;
    transition:
      opacity var(--transition-duration-default) var(--transition-timing-function),
      visibility var(--transition-duration-default) var(--transition-timing-function);
    transform: translateX(-50%);

    &::after {
      position: absolute;
      top: calc(var(--tail-size) * -1);
      left: 50%;
      display: block;
      width: 0;
      height: 0;
      margin-left: calc(var(--tail-size) * -1);
      content: '';
      border-color: transparent transparent var(--box-medium-bg-color);
      border-style: solid;
      border-width: 0 var(--tail-size) var(--tail-size);
    }

    &--hidden {
      visibility: hidden;
      opacity: 0;
    }

    &__list {
      ${listUnstyled}
      max-height: 336px; /* equals 8 items */
      overflow: auto;
    }

    &__footer {
      margin: 20px 20px 0;
    }
  }
`;
