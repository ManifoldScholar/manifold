import { buttonUnstyled, utilityPrimary } from "theme/styles/mixins";

export default `
  .skip-to-main {
    ${buttonUnstyled}
    ${utilityPrimary}
    position: fixed;
    top: 0;
    left: -400px;
    width: auto;
    height: auto;
    padding: 14px 18px;
    margin: 0;
    clip: unset;
    font-size: 15px;
    color: var(--color-accent-primary);
    text-decoration: none;
    background: var(--color-base-neutral85);
    opacity: 0.95;
    transition: left var(--transition-duration-slow)
      var(--transition-timing-function);

    &.focus-visible {
      left: 0;
      outline-offset: -3px;
    }
  }
`;
