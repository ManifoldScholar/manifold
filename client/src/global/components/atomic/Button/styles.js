import styled from "@emotion/styled";
import { defaultTransitionProps, buttonUnstyled } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";
import IconComposer from "global/components/utility/IconComposer";

function getSizeStyles(size) {
  switch (size) {
    case "lg":
      return `
        --_padding: 6px 24px 8px;
        --_font-size: 14px;
        --_inner-text-padding-block: 0.6em 0.68em;

        &:has(> svg) {
          padding-inline: 20px;
        }
      `;
    case "md":
      return `
        --_padding: 6px 32px 8px;
        --_font-size: 14px;

        &:has(> svg) {
          padding-inline: 20px;
        }
      `;
    case "sm":
      return `
        --_padding: 6px 14px 8px;
        --_font-size: 12px;
      `;
    default:
      return ``;
  }
}

function getShapeStyles(shape) {
  switch (shape) {
    case "rectangle":
      return `
          --_border-radius: 4px;
          --_letter-spacing: 0.089em;
        `;
    case "lozenge":
      return `
          --_border-radius: 400px;
        `;
    default:
      return ``;
  }
}

function getColorStyles(background) {
  switch (background) {
    case "accent":
      return `
        --_color: var(--color-neutral-text-extra-dark);
        --_background-color: var(--color-accent-primary);
        --_hover-background-color: var(--color-accent-primary-dull);
        --_border-color: var(--color-accent-primary);
      `;
    case "neutral":
      return `
        --_color: var(--strong-color);
        --_background-color: var(--button-bg-color);
        --_hover-background-color: var(--color-accent-primary);
        --_border-color: var(--button-bg-color);
      `;
    case "outline":
      return `
        --_background-color: transparent;
        --_hover-background-color: var(--color-accent-primary);
        --_border-color: currentColor;
      `;
    case "outline-accent":
      return `
        --_color: var(--outline-button-color);
        --_background-color: transparent;
        --_hover-background-color: var(--color-accent-primary);
        --_border-color: var(--highlight-color);
      `;
    default:
      return ``;
  }
}

export const Button = styled("button", transientOptions)`
  ${({ $size }) => getSizeStyles($size)}
  ${({ $shape }) => getShapeStyles($shape)}
  ${({ $background }) => getColorStyles($background)}

  ${buttonUnstyled}
  min-inline-size: var(--_Button-min-inline-size);
  vertical-align: middle;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: var(--_padding);
  color: var(--_color, var(--strong-color));
  background-color: var(--_background-color, var(--background-color));
  border: 1px solid var(--_border-color);
  border-radius: var(--_border-radius);
  transition:
    color ${defaultTransitionProps},
    background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};
  font-family: var(--font-family-heading);
  font-size: var(--_font-size);
  line-height: 1;
  text-decoration: none;

  ${({ $lowercase }) =>
    $lowercase
      ? `
          font-size: max(14px, var(--_font-size));
        `
      : `
          text-transform: uppercase;
          letter-spacing: 0.125em;
          font-weight: var(--font-weight-semibold);
        `}

  &:hover,
  &:focus-visible {
    color: var(--_hover-color, var(--color-neutral-text-extra-dark));
    background-color: var(--_hover-background-color);
    border-color: var(--_hover-background-color);
  }

  > span {
    min-block-size: var(--_min-block-size);
    display: inline-flex;
    align-items: center;
    transform: translateY(-5%);
  }
`;

export const ButtonIcon = styled(IconComposer)`
  // inline-size: 1.667em;
  // block-size: 1.667em;
`;
