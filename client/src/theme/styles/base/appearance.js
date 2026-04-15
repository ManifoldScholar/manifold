import {
  outlineOnFocus,
  setHoverStyle,
  transparentize,
  defaultFocusStyle
} from "../mixins";

export default `
  ::view-transition-group(root) {
    animation-duration: 250ms;
  }

  /* Default hover styles */
  button,
  [role="button"],
  a,
  [data-react-beautiful-dnd-drag-handle] {
    ${setHoverStyle()}
  }

  /* Default focus outlines */
  button,
  [role="button"],
  a,
  input,
  select,
  [data-react-beautiful-dnd-drag-handle],
  .recharts-surface {
    ${outlineOnFocus()}
  }

  main[tabindex='-1']:focus-visible {
    outline: none;
  }

  .manicon-svg {
    display: inline-block;
    vertical-align: middle;
  }

  dialog {
    &:focus-visible {
      ${defaultFocusStyle}
    }

    &,
    &::backdrop {
      transition:
        display 0.2s allow-discrete,
        overlay 0.2s allow-discrete,
        opacity 0.2s ease;
    }

    &::backdrop {
      background-color: ${transparentize("neutralBlack", 0.3)};
    }

    /* On Stage */
    &[open] {
      opacity: 1;

      &::backdrop {
        opacity: 1;
      }
    }

    @starting-style {
      &[open],
      &[open]::backdrop {
        opacity: 0;
      }
    }
  }
`;
