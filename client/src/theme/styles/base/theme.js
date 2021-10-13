// CSS color vars defined by context in Manifold
export default `
  body {
    color: var(--color);
    background-color: var(--background-color);
  }

  .browse,
  .scheme-light,
  .bg-white,
  .bg-neutral05,
  .bg-neutral10 {
    --color: var(--color-neutral-text-dark);
    --background-color: var(--color-base-neutral-white);
    --strong-color: var(--color-neutral-text-extra-dark);
    --extra-strong-color: var(--base-neutral-black);
    --medium-color: var(--color-base-neutral80);
    --weak-color: var(--color-neutral-ui-dull-light);
    --highlight-color: var(--color-interaction-dark);
    --focus-color: var(--color-neutral-ui-dark);
    --hover-color: var(--color-interaction-dark);
    --error-color: var(--color-notification-error-dark);
    --warning-color: var(--color-notification-warning-dark);
    --notice-color: var(--color-notification-notice-dark);
    --inactive-switch-bg-color: var(--color-base-neutral70);
    --active-switch-bg-color: #17986d;
    --switch-toggle-color: var(--color-base-neutral05);
    --box-bg-color: var(--color-base-neutral05);
    --box-weak-bg-color: var(--color-base-neutral05);
    --box-medium-bg-color: var(--color-base-neutral10);
    --box-strong-bg-color: var(--color-base-neutral20);
    --box-x-strong-bg-color: var(--color-base-neutral20);
    --dropzone-bg-color: var(--color-base-neutral30);
    --select-bg-color: transparent;
    --select-border-color: currentColor;
    --button-dull-bg-color: var(--color-base-neutral30);
    --button-tertiary-bg-color: var(--color-accent-primary-pale);
    --button-tertiary-bg-hover-color: var(--color-accent-primary-light);
    --reader-color: var(--strong-color);
    --input-color: var(--color);
    --input-bg-color: var(--color-base-neutral-white);
    --input-border-color: transparent;
    --input-autofill-color: var(--highlight-color);
    --input-font-family: var(--font-family-sans);

    color: var(--color);
  }

  .backend,
  .drawer--backend,
  .scheme-dark,
  .bg-neutral90,
  .bg-neutral95 {
    --color: var(--color-neutral-text-light);
    --background-color: var(--color-base-neutral90);
    --strong-color: var(--color-neutral-text-extra-light);
    --extra-strong-color: var(--base-neutral-white);
    --medium-color: var(--color-base-neutral20);
    --weak-color: var(--color-neutral-ui-dull-dark);
    --highlight-color: var(--color-interaction-light);
    --focus-color: var(--color-interaction-light);
    --hover-color: var(--color-interaction-light);
    --error-color: var(--color-notification-error-light);
    --warning-color: var(--color-notification-warning-light);
    --notice-color: var(--color-notification-notice-light);
    --inactive-switch-bg-color: var(--color-base-neutral70);
    --active-switch-bg-color: var(--color-interaction-light);
    --switch-toggle-color: var(--color-base-neutral90);
    --box-bg-color: var(--color-base-neutral95);
    --box-weak-bg-color: var(--color-base-neutral85);
    --box-medium-bg-color: var(--color-base-neutral90);
    --box-strong-bg-color: var(--color-base-neutral90);
    --box-x-strong-bg-color: var(--color-base-neutral80);
    --dropzone-bg-color: var(--color-base-neutral30);
    --select-bg-color: var(--color-base-neutral90);
    --select-border-color: var(--color-base-neutral45);
    --button-dull-bg-color: var(--color-base-neutral10);
    --button-tertiary-bg-color: var(--color-accent-primary);
    --button-tertiary-bg-hover-color: var(--color-accent-primary-pale);
    --reader-color: var(--color-base-neutral-white);
    --input-color: var(--strong-color);
    --input-bg-color: transparent;
    --input-border-color: var(--color-neutral-ui-dull-light);
    --input-autofill-color: var(--color-accent-primary-pale);
    --input-font-family: var(--font-family-serif);

    color: var(--color);

    input[type="text"],
    input[type="email"],
    input[type="password"],
    select,
    textarea {
      color: var(--input-color);
    }
  }
`;
