import { containerPrototype } from "theme/styles/mixins";

export default `
  .press-header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-base-neutral-white);
    text-align: center;
    text-decoration: none;

    &::after {
      position: absolute;
      top: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100%;
      content: "";
      background-color: var(--color-base-neutral95);
      opacity: 0;
      transition: opacity var(--transition-duration-slow);
    }

    &:hover,
    &.focus-visible {
      outline: 0;

      &::after {
        opacity: 0.125;
      }
    }

    &__inner {
      ${containerPrototype}
      width: 100%;
      padding-top: 9.5px;
      padding-bottom: 9.5px;
    }

    &__text {
      font-family: var(--font-family-heading);
      position: relative;
      top: -2px;
      display: block;
      overflow: hidden;
      font-size: 16px;
      font-weight: var(--font-weight-semibold);
      line-height: 1.35;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;
