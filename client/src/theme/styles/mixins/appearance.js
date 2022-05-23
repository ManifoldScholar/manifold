import get from "lodash/get";
import { breakpoints } from "../variables/media";
import { containerWidth } from "../variables/layout";
import { respond } from "./common";
import { utilityPrimary } from "./typography";

// Media
// --------------------
export function hide(size) {
  const breakpoint = get(breakpoints, size, size);
  return respond(`display: none;`, breakpoint);
}

export function show(size, display = "inherit") {
  const breakpoint = get(breakpoints, size, size);
  return `
    display: none;
    ${respond(`display: ${display};`, breakpoint)}
  `;
}

export function fluidShrink(maxWidth, breakpoint = containerWidth.inner) {
  /* eslint-disable radix */
  return `min(${(parseInt(maxWidth) / parseInt(breakpoint)) *
    100}vw, ${maxWidth})`;
}

// Interactions
// --------------------
export const defaultFocusStyle = `outline: solid 2px var(--focus-color);`;
export const defaultHoverStyle = `color: var(--hover-color);`;

export function setFocusStyle(property = "outline", value = "solid 2px") {
  return `
    &:focus:not(.focus-visible) {
      outline: 0;
    }

    &.focus-visible {
      ${property}: ${value};
    }
  `;
}

export function setHoverStyle(
  property = "color",
  value = "var(--hover-color)"
) {
  return `
    transition: ${property} var(--transition-duration-default)
      var(--transition-timing-function);

    &:hover {
      ${property}: ${value};
    }
  `;
}

export function outlineOnFocus(color = "var(--focus-color)") {
  return setFocusStyle("outline", `solid 2px ${color}`);
}

export function fillOnFocus(color = "var(--hover-color)") {
  return `
    ${setFocusStyle("background-color", color)}

    &.focus-visible {
      outline: 0;
    }
  `;
}

export function fillOnHover(color = "var(--hover-color)") {
  return setHoverStyle("background-color", color);
}

// Utility
// --------------------------------------------------------
export const screenReaderText = `
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
`;

export const defaultTransitionProps = `var(--transition-duration-default) var(--transition-timing-function)`;

// Layout
// --------------------------------------------------------
// Apply to a pseudo element to get a tail/triangle pointing up
export function tailUp(color = "var(--color-base-neutral10)", height = "10px") {
  return `
    width: 0;
    height: 0;
    border-color: transparent transparent ${color};
    border-style: solid;
    border-width: 0 10px ${height};
  `;
}

// // Links
// // --------------------------------------------------------
export const linkUnstyled = `
  text-decoration: none;
`;

// // Buttons
// // --------------------------------------------------------
export const buttonUnstyled = `
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  border-radius: 0;
  outline: none;
  appearance: none;
`;

export const buttonRounded = `
  cursor: pointer;
  border-radius: 7px;
`;

export function buttonAvatar(size = 36, color = "inherit") {
  return `
    ${buttonUnstyled}
    width: ${size}px;
    height: ${size}px;
    overflow: hidden;
    color: ${color};
    text-align: center;
    border-radius: 100%;

    &__icon {
      width: 100%;
      height: 100%;
    }

    .avatar-image {
      width: 100%;
    }
  `;
}

export const buttonTrimPrimary = `
  ${buttonUnstyled}
  ${utilityPrimary}
  display: block;
  width: 100%;
  padding-bottom: 13px;
  font-size: 14px;
  text-align: left;

  &:hover {
    color: var(--color-accent-primary-medium);
  }

  &.focus-visible {
    color: var(--color-base-neutral95);
    outline: 0;
  }

  &:active {
    color: var(--hover-color);
  }
`;

export const marker = `
  display: flex;
  align-items: center;
  padding: 3px 10px 5px;
  font-family: var(--font-family-sans);
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  background-color: var(--marker-bg-color, var(--box-bg-color));
  border-radius: 12px;
`;

export const blockLabelRound = `
  ${utilityPrimary}
  display: inline-block;
  padding: 0.333em 8px;
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-base-neutral-white);
  background-color: var(--notice-color);
  border-radius: 3px;
`;

// // Browser UI
// // --------------------------------------------------------
// // Styled select
// // based on: https://github.com/mdo/wtf-forms/blob/master/wtf-forms.css
export const unstyledSelect = `
  cursor: pointer;
  background: transparent;
  border-radius: 0;
  outline: 0;
  appearance: none;

  &.focus-visible:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 var(--medium-color);
  }
`;

export const selectPrimary = `
  position: relative;
  display: inline-block;
  color: var(--medium-color);

  select {
    ${utilityPrimary}
    ${unstyledSelect}
    display: inline-block;
    width: 100%;
    padding: 9px 13px 11px;
    margin: 0;
    font-size: var(--font-size-40);
    line-height: var(--line-height);
    border: 2px solid var(--color-neutral40);

    &.focus-visible {
      border-color: var(--focus-color);
    }
  }
`;

// // Styled Checkbox (also from wtf forms)
// // Should be applied to a label with an input type="checkbox" inside
export const checkboxStyled = `
  position: relative;
  display: inline-block;
  cursor: pointer;

  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
`;

const inputBase = `
  font-family: var(--input-font-family);
  color: var(--input-color);
  background-color: var(--input-bg-color);
  border-color: var(--input-border-color);

  &.focus-visible {
    outline: none;
    border-color: var(--focus-color);
  }
`;

// // Inputs/Textareas
export const inputLabelPrimary = `
  display: block;
  margin-bottom: 12px;
  text-transform: uppercase;
  font-size: var(--font-size-30);
  font-family: var(--input-font-family);
  color: var(--color-base-neutral50);
`;

export const inputPrimary = `
  ${inputBase}
  padding: 8px 13px 12px;
  font-size: var(--font-size-70);
  border: 3px solid var(--input-border-color);
`;

// // Dark input with border
export const inputQuaternary = `
  ${inputBase}
  padding: 0.438em 1.125em 0.563em;
  background: transparent;
  border: 1px solid;
  border-radius: 0;
  appearance: none;
  outline: none;

  &.focus-visible {
    outline: none;

    &::placeholder {
      color: var(--highlight-color);
    }
  }
`;

export const filterSelectBase = `
  ${unstyledSelect}
  ${utilityPrimary}
  padding-right: 36px;
  padding-left: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const panelRounded = `
  color: var(--box-color);
  background-color: var(--box-bg-color);
  border-radius: var(--box-border-radius);
`;

export const panelRoundedDark = panelRounded; // exporting separately to match Sass mixins

export const roundedHeader = `
  ${panelRoundedDark}
  display: table;
  width: 100%;
  padding: 0.75em 1.5em 0.875em;
  margin-bottom: 20px;
  font-size: 16px;

  /* if using a rounded label, pad any of its siblings */
  ~ :not(.full-width) {
    padding-right: min(3.158vw, 24px);
    padding-left: min(3.158vw, 24px);
  }
`;

export const roundedFormHeader = `
  --label-color: var(--highlight-color);

  ${roundedHeader}

  .browse &,
  .reader & {
    --label-color: var(--color);
  }

  > * {
    ${utilityPrimary}
    display: table-cell;
    width: 100%;
    font-size: 14px;
    font-weight: var(--font-weight-semibold);
    color: var(--label-color);
    letter-spacing: 0.1em;
  }
`;

// Drag and Drop styles
export function dropzone(margin = "9px", activeSelector = "--show-dropzone") {
  return `
    ${panelRounded}
    display: block;
    padding: 0 ${margin};
    margin-right: -${margin};
    margin-left: -${margin};
    background-color: transparent;
    transition: background-color 0.4s ease;

    &${activeSelector} {
      background-color: var(--dropzone-bg-color);
    }
  `;
}

export function dropzoneStyled(margin = "9px", active = false) {
  return `
    ${panelRounded}
    display: block;
    padding: 0 ${margin};
    margin-right: -${margin};
    margin-left: -${margin};
    background-color: transparent;
    transition: background-color 0.4s ease;

    ${active && `background-color: var(--dropzone-bg-color);`}
  `;
}

export const draggable = `
  ${panelRounded}
  cursor: move; /* fallback for older browsers */
  cursor: grab;
  transition: color var(--transition-duration-default)
      var(--transition-timing-function),
    background-color var(--transition-duration-default)
      var(--transition-timing-function),
    border-color var(--transition-duration-default)
      var(--transition-timing-function);
`;

export const dragging = `
  box-shadow: 0 31px 26px -13px rgba(0 0 0 / 0.33);
`;

export function reactSlideTransition(
  from = "right",
  selector = "&",
  prefix = "panel"
) {
  return `
    .${prefix}-enter ${selector} {
      transform: translateX(${from === "right" ? "100%" : "-100%"});
    }

    .${prefix}-enter-active ${selector} {
      transition: transform ${defaultTransitionProps};
      transform: translateX(0);
    }

    .${prefix}-exit ${selector} {
      transform: translateX(0);
    }

    .${prefix}-exit.${prefix}-exit-active ${selector} {
      transition: transform ${defaultTransitionProps};
      transform: translateX(${from === "right" ? "100%" : "-100%"});
    }
  `;
}
