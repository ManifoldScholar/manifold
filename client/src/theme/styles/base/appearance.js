import { outlineOnFocus, setHoverStyle } from "../mixins/appearance";

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
`;
