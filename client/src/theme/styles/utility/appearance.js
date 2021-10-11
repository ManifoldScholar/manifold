import { css } from "styled-components";
import { screenReaderText, show, hide } from "../mixins/appearance";

export default css`
  .screen-reader-text {
    ${screenReaderText}
  }

  .bg-white {
    background-color: var(--color-base-neutral-white);
  }

  .bg-accent-primary {
    background-color: var(--color-accent-primary);
  }

  .bg-accent-secondary {
    background-color: var(--color-accent-primary-off-white);
  }

  .bg-neutral05 {
    background-color: var(--color-base-neutral05);
  }

  .bg-neutral10 {
    background-color: var(--color-base-neutral10);
  }

  .bg-neutral90 {
    background-color: var(--color-base-neutral90);
  }

  .bg-neutral95 {
    background-color: var(--color-base-neutral95);
  }

  .manicon-svg {
    display: inline-block;
    vertical-align: middle;
  }

  .show-50 {
    ${show(50)}
  }

  .show-60 {
    ${show(60)}
  }

  .show-75 {
    ${show(75, "block")}
  }

  .hide-60 {
    ${hide(60)}
  }

  .hide-75 {
    ${hide(75)}
  }

  .rel {
    position: relative;
  }
`;
