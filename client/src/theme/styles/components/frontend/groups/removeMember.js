import {
  buttonUnstyled,
  formLabelPrimary,
  defaultTransitionProps
} from "theme/styles/mixins";

export default `
  .remove-member-button {
    ${buttonUnstyled}
    ${formLabelPrimary}
    position: relative;
    padding: 4px 15px 5px;
    color: var(--error-color);
    border: 1px solid;
    border-radius: 12px;
    transition: all ${defaultTransitionProps};

    &:hover,
    &:focus-visible {
      color: var(--color-base-neutral-white);
      background-color: var(--error-color);
      outline: 0;
    }
  }
`;
