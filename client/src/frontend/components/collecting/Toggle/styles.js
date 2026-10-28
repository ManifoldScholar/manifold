import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import {
  respond,
  defaultFocusStyle,
  buttonUnstyled,
  utilityPrimary,
  defaultTransitionProps,
  rgba
} from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

/*
 * These components replace the former global `.collecting-toggle`
 * stylesheet. They are shared with the backend project-collection
 * AddButton, which renders the same toggle presentation.
 */

const lightColor = `var(
  --collecting-toggle-light-color,
  var(--color-base-neutral05)
)`;
const darkColor = `var(
  --collecting-toggle-dark-color,
  var(--color-base-neutral75)
)`;
const inactiveColor = `var(
  --collecting-toggle-inactive-color,
  var(--color-base-neutral70)
)`;
const highlightFgColor = `var(--color-base-neutral90)`;
const highlightBgColor = `var(--color-base-blue45)`;

/*
 * The wrapper exists only so a single ref can contain both the button and
 * the popover for focus-out detection. `display: contents` keeps it out of
 * layout so it never affects the `Toggle` positioning.
 */
export const Wrapper = styled.div`
  display: contents;
`;

/**
 * Returns the styles for a single `Inner` view. Each view sets the color
 * custom properties and the icon offset that selects which icon shows.
 *
 * @param {"add" | "add-active" | "remove" | "remove-active" | "collected-active"} view
 * @param {boolean} outlined
 * @returns {string}
 */
function viewStyles(view, outlined) {
  switch (view) {
    case "add":
      return `
        --toggle-color: ${outlined ? "currentColor" : lightColor};
        --icon-transform: translateY(-100%);

        ${outlined ? "--toggle-bg-color: transparent;" : ""}
      `;
    case "add-active":
      return `
        --toggle-color: ${highlightFgColor};
        --toggle-bg-color: ${highlightBgColor};
        --icon-transform: translateY(-100%);

        max-width: 145px;
        transition: max-width var(--transition-duration-slow) ease-out;
      `;
    case "collected-active":
      return `
        --toggle-color: ${highlightFgColor};
        --toggle-bg-color: ${highlightBgColor};
        --icon-transform: translateY(-100%);

        max-width: 145px;
        transition: max-width var(--transition-duration-slow) ease-out;
      `;
    case "remove":
      return `
        --toggle-color: ${highlightFgColor};
        --toggle-bg-color: ${highlightBgColor};
        --icon-transform: translateY(-100%);

        .backend & {
          --icon-transform: translateY(100%);
        }
      `;
    case "remove-active":
      return `
        --toggle-color: ${lightColor};
        --toggle-bg-color: ${darkColor};

        max-width: 145px;
        transition: max-width var(--transition-duration-slow) ease-out;
      `;
    default:
      return "";
  }
}

/**
 * Returns the styles for a single `Toggle` variant.
 *
 * @param {"inline" | "project-cover" | "small-project-cover"} variant
 * @returns {string}
 */
function variantStyles(variant) {
  switch (variant) {
    case "inline":
      return `
        margin-block-start: 3px;
        margin-inline-end: 64px;
      `;
    case "project-cover":
      return `
        --toggle-size: 28px;
        --text-top-padding: 7px;
        --toggle-shadow: 2px 4px 10px 0 ${rgba("neutral90", 0.36)};

        position: absolute;
        top: 25px;
        left: 0;

        ${respond(
          `
            top: calc(2.105vw + 15px);
            left: calc(2.105vw - 15px);
          `,
          75
        )}

        ${respond(
          `
            top: 40px;
            left: 10px;
          `,
          120
        )}
      `;
    case "small-project-cover":
      return `
        --toggle-size: 28px;
        --text-top-padding: 7px;
        --toggle-shadow: 2px 4px 10px 0 ${rgba("neutral90", 0.36)};

        position: absolute;
        top: 10px;
        left: -15px;

        ${respond(
          `
            top: 15px;
          `,
          120
        )}
      `;
    default:
      return "";
  }
}

/**
 * The visible pill within the toggle button. The `$view` prop selects the
 * color scheme and which icon is shown.
 */
export const Inner = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  height: 100%;
  overflow: hidden;
  color: var(--toggle-color);
  background-color: var(--toggle-bg-color);
  border-radius: 0.667em;
  box-shadow: var(--toggle-shadow, none);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  ${({ $view, $outlined }) => viewStyles($view, $outlined)}
`;

/**
 * The toggle button. The `$variant` prop selects the positioning, and
 * `$hidden` visually hides the toggle without removing it from the layout.
 */
export const Toggle = styled("button", transientOptions)`
  --toggle-size: 24px;
  --toggle-color: ${highlightFgColor};
  --toggle-bg-color: ${inactiveColor};
  --icon-transform: none;
  --text-top-padding: 5px;

  ${buttonUnstyled}
  ${utilityPrimary}

  position: relative;
  width: var(--toggle-size);
  height: var(--toggle-size);
  font-size: 12px;
  text-align: left;
  white-space: nowrap;
  cursor: pointer;

  &:focus-visible {
    outline: none;

    ${Inner} {
      ${defaultFocusStyle}
    }
  }

  ${({ $variant }) => variantStyles($variant)}

  .backend & {
    --collecting-toggle-light-color: var(--color-base-neutral75);
    --collecting-toggle-dark-color: var(--color-base-neutral05);
    --collecting-toggle-inactive-color: var(--color-base-neutral10);
  }

  ${({ $hidden }) => ($hidden ? "opacity: 0;" : "")}
`;

export const Text = styled.span`
  display: block;
  padding: var(--text-top-padding) 14px 0 32px;
  line-height: 1;
  transition: opacity calc(var(--transition-duration-default) * 3)
    var(--transition-timing-function);

  @starting-style {
    opacity: 0;
  }
`;

export const Disclosure = styled(IconComposer)`
  display: inline-block;
  margin-inline-start: 6px;
  vertical-align: middle;
  margin-block-start: -2px;
`;

export const Icons = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transition: transform ${defaultTransitionProps};
  transform: var(--icon-transform);

  .icon-star-fill {
    &__foreground {
      fill: currentColor;
    }

    &__background {
      fill: transparent;
    }
  }

  .icon-star-outline {
    fill: var(--strong-color);
  }
`;

/**
 * A single icon within `Icons`. The `$type` prop offsets the icon so that
 * `Icons` can slide the active one into view.
 */
export const Icon = styled(IconComposer)`
  position: absolute;
  top: ${({ $type }) => {
    if ($type === "confirm") return "-100%";
    if ($type === "add") return "100%";
    return "0";
  }};
  left: 0;
  width: var(--toggle-size);
  height: var(--toggle-size);
`;
