import styled from "@emotion/styled";
import * as ToggleStyles from "frontend/components/collecting/Toggle/styles";
import { screenReaderText, defaultFocusStyle } from "theme/styles/mixins";

/*
 * The visible toggle presentation is shared with the frontend collecting
 * toggle, so `AddButton` renders the `ToggleStyles` components directly.
 * Only the screen reader button, which is specific to this component, is
 * defined here.
 */

/**
 * Visually hidden button that is the accessible control. When it has
 * keyboard focus, the visible (but `aria-hidden`) toggle that follows it
 * shows the focus ring.
 */
export const ScreenReaderToggle = styled.button`
  ${screenReaderText}

  &:focus-visible ~ ${ToggleStyles.Toggle} {
    ${defaultFocusStyle}
    outline-color: var(--focus-color);
  }
`;
