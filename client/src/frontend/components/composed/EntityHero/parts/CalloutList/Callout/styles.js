import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import {
  respond,
  defaultTransitionProps,
  rgba,
  defaultHoverStyle
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { transientOptions } from "helpers/emotionHelpers";

const BREAKPOINT = breakpoints[60];

const Callout = styled(Link)`
  font-family: var(--font-family-heading);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: inherit;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.104em;
`;

export const ButtonCallout = styled(Callout, transientOptions)`
  display: grid;
  grid-template: ". icon text ." auto / 1fr auto auto 1fr;
  grid-gap: 9px;
  align-items: center;
  padding-right: 13px;
  padding-left: 13px;
  color: var(--color-neutral-text-extra-dark);
  border: 2px solid transparent;
  transition: background-color ${defaultTransitionProps},
    border-color ${defaultTransitionProps};

  ${({ $color, $lightMode }) => {
    if ($color === "primary") {
      return `background-color: var(--color-accent-primary);

        &:hover,
        &:focus-visible {
          color: var(--color-base-neutral90);
          background-color: var(--color-accent-primary-dull);
        }

        &:focus-visible {
          outline: 0;
          border-color: var(--color-accent-primary);
        }`;
    }
    if ($color === "secondary") {
      if ($lightMode) {
        return `
        background-color: var(--color-base-neutral30);

        &:focus-visible {
          outline: 0;
          border-color: var(--color-base-neutral70);
        }

        &:hover {
          color: inherit;
          background-color: ${rgba("neutral30", 0.7)};
        }
          `;
      }
      return `
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
    }
    if ($color === "error") {
      return `
      background-color: var(--color-notification-warning-light);

      &:hover,
      &:focus-visible {
        color: var(--color-neutral-text-extra-dark);
        background-color: var(--color-notification-warning-extra-light);
      }
      `;
    }
  }}

  ${({ $layout }) => {
    if ($layout === "center") {
      return `grid-template: ". text ." auto / 1fr auto 1fr;`;
    }
  }}
`;

export const ButtonIcon = styled(IconComposer, transientOptions)`
  grid-area: icon;
  margin-left: -6px;

  ${({ $color }) => {
    if ($color === "secondary") {
      return `color: var(--color-neutral-text-extra-dark);`;
    }
  }}
`;

export const ButtonText = styled.span`
  display: block;
  grid-area: text;
  padding-top: 12px;
  padding-bottom: 12px;

  ${respond(
    `padding-top: 17px;
    padding-bottom: 17px;`,
    BREAKPOINT
  )}
`;

export const LinkIcon = styled(IconComposer)`
  margin-right: 8px;
  color: var(--text-color, --color-base-neutral50);
  transition: color ${defaultTransitionProps};
`;

export const LinkCallout = styled(Callout)`
  display: block;
  min-height: 17.33px;

  &:hover {
    ${LinkIcon} {
      ${defaultHoverStyle}
    }
  }

  ${({ $color }) => {
    if ($color === "error") {
      return `
      color: var(--color-notification-warning-light);

      &:hover,
      &:focus-visible {
        color: var(--color-notification-warning-extra-light);
      }`;
    }
  }}
`;
