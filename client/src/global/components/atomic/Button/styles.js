import styled from "@emotion/styled";
import { defaultTransitionProps, rgba } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const aSecondaryButton = `
  background-color: var(--color-base-neutral10);

  &:focus-visible {
    outline: 0;
    border-color: var(--color-base-neutral70);
  }

  &:hover {
    color: inherit;
    background-color: ${rgba("neutral30", 0.7)};
  }
`;

const aSecondaryButtonDark = `
  color: var(--color-base-neutral95);
  background-color: var(--color-neutral-ui-light);
  border-color: var(--color-neutral-ui-light);

  &:hover,
  &:focus-visible {
    color: var(--color-base-neutral95);
    background-color: var(--color-base-neutral30);
    border-color: var(--color-base-neutral30);
  }

  &:focus-visible {
    border-color: var(--color-base-neutral75);
  }
`;

const aButtonLg = `
  --ButtonText-padding-block: 18px;

  height: 50px;
  justify-content: center;
  border-radius: 6px;
`;

export const Button = styled("button", transientOptions)`
  --ButtonText-padding-block: 11px;

  display: flex;
  gap: 12px;
  align-items: center;
  height: 40px;
  min-width: 200px;
  width: ${({ $width }) => $width && `${$width}px`};
  padding-inline: 12px;
  color: var(--color-neutral-text-extra-dark);
  border: 2px solid transparent;
  border-radius: 8px;
  background-color: var(--color-accent-primary);
  transition: background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};
  font-family: var(--font-family-heading);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.104em;
  line-height: 18px;

  &:hover,
  &:focus-visible {
    color: var(--color-base-neutral90);
    background-color: var(--color-accent-primary-dull);
  }

  &:focus-visible {
    outline: 0;
    border-color: var(--color-accent-primary);
  }

  ${({ $secondary, $darkMode }) => {
    if ($secondary) {
      if ($darkMode) {
        return aSecondaryButtonDark;
      }
      return aSecondaryButton;
    }
  }}

  ${({ $size }) => $size === "lg" && aButtonLg}
`;

export const ButtonText = styled("span", transientOptions)`
  padding-block: var(--ButtonText-padding-block);
`;
