import { screenReaderText } from "../mixins";

export default `
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
`;
