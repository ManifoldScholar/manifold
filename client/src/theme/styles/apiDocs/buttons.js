import { utilityPrimary, defaultTransitionProps } from "theme/styles/mixins";
import { invalidFormElement } from "./mixins";

export default `
  .btn {
    ${utilityPrimary}
    display: inline-block;
    padding: 0.76em 1.7em;
    font-size: 11.18px;
    color: var(--header-foreground-color);
    text-decoration: none;
    letter-spacing: 0.134em;
    white-space: nowrap;
    border: 1px solid;
    border-radius: 4px;
    transition: color ${defaultTransitionProps},
      background-color ${defaultTransitionProps},
      border-color ${defaultTransitionProps};

    &:hover,
    &.focus-visible {
      color: var(--strong-color);
      background-color: var(--color-interaction-light);
      border-color: var(--color-interaction-light);
      outline: 0;
    }

    &.btn-sm {
      padding: 4px 23px;
      font-size: 12px;
    }

    &[disabled] {
      cursor: not-allowed;

      opacity: 0.3;
    }

    &.cancel {
      background-color: var(--btn-cancel-background-color);
      border-color: var(--api-docs-theme-warning);
      font-family: var(--font-family-sans);
    }

    &.authorize {
      display: inline;
      line-height: 1;

      color: var(--btn-authorize-font-color);
      background-color: var(--btn-authorize-background-color);
      border-color: var(--btn-authorize-border-color);

      span {
        float: left;
        padding: 4px 20px 0 0;
      }

      svg {
        fill: var(--btn-authorize-svg-fill-color);
      }
    }

    &.execute {
      color: var(--btn-execute-font-color);
      background-color: var(--btn-execute-background-color-alt);
      border-color: var(--btn-execute-border-color);
    }
  }

  .btn-group {
    display: flex;
    padding: 30px;

    .btn {
      flex: 1;

      &:first-child {
        border-radius: 4px 0 0 4px;
      }

      &:last-child {
        border-radius: 0 4px 4px 0;
      }
    }
  }

  .authorization__btn {
    padding: 0 10px;
    background: none;
    border: none;

    svg {
      width: 24px;
      height: 24px;
      margin-top: -6px;
    }

    &.locked {
      opacity: 1;
    }

    &.unlocked {
      opacity: 0.4;
    }
  }

  .opblock-summary-control,
  .models-control,
  .model-box-control
  {
    all: inherit;
    flex: 1;
    border-bottom: 0;
    padding: 0;
    cursor: pointer;

    &:focus {
      outline: auto;
    }
  }


  .expand-methods,
  .expand-operation {
    background: none;
    border: none;

    svg {
      width: 20px;
      height: 20px;
    }
  }

  .expand-methods {
    padding: 0 10px;

    &:hover {
      svg {
        fill: var(--expand-methods-svg-fill-color-hover);
      }
    }

    svg {
      fill: var(--expand-methods-svg-fill-color);
      transition: all 0.3s;
    }
  }

  .copy-to-clipboard
  {
    display: none;
  }

  button {
    cursor: pointer;
    outline: none;

    &.invalid {
      ${invalidFormElement}
    }
  }
`;
