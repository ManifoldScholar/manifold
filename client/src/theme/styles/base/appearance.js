import { outlineOnFocus, setHoverStyle } from "../mixins/appearance";

export default `
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
  [data-react-beautiful-dnd-drag-handle] {
    ${outlineOnFocus()}
  }

  main[tabindex='-1'].focus-visible {
    outline: none;
  }

  .manicon-svg {
    display: inline-block;
    vertical-align: middle;
  }
`;
