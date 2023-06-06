import { screenReaderText, show, hide, utilityPrimary } from "../mixins";

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

  .bg-neutral10 {
    background-color: var(--color-base-neutral10);
  }

  .bg-neutral90 {
    background-color: var(--color-base-neutral90);
  }

  .bg-neutral95 {
    background-color: var(--color-base-neutral95);
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

  .show-82 {
    ${show(82, "block")}
  }

  .hide-60 {
    ${hide(60)}
  }

  .hide-75 {
    ${hide(75)}
  }

  .hide-82 {
    ${hide(82)}
  }

  .rel {
    position: relative;
  }

  .no-focus-outline.focus-visible {
    outline: none;
  }

  .no-focus-outline:focus {
    outline: none;
  }

  /* Icon styles */
  .icon-notes-unique {
    fill: transparent;

    &__foreground {
      fill: var(--strong-color);
    }

    &__background {
      fill: var(--box-medium-bg-color);
    }
  }

  .annotation-manage-groups-link {
    ${utilityPrimary}
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    padding: 3px;
    font-size: 12px;
    color: var(--manage-groups-link-color, #5c5c5c);
    text-decoration: none;
    border: 1px solid;
    border-radius: 4px;
    transition: none;

    &:hover,
    &.focus-visible {
      color: var(--color-base-neutral85);
      background-color: var(--color-interaction-light);
      border-color: var(--color-interaction-light);
      outline: 0;
    }
  }

  .inline-block {
    display: inline-block;
  }
`;
