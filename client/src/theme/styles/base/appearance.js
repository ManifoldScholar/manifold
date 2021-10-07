import { css } from "styled-components";
import { outlineOnFocus, setHoverStyle } from "../mixins/appearance";

export default css`
  // Default hover styles
  button,
  [role="button"],
  [href],
  [data-react-beautiful-dnd-drag-handle] {
    ${setHoverStyle()}
  }

  // Default focus outlines
  button,
  [role="button"],
  [href],
  input,
  select,
  [data-react-beautiful-dnd-drag-handle] {
    ${outlineOnFocus()}
  }
`;
