import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import Button from "global/components/atomic/Button";
import { defaultTransitionProps, defaultHoverStyle } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const ErrorButton = styled(Button)`
  background-color: var(--color-notification-warning-light);

  &:hover,
  &.focus-visible {
    color: var(--color-neutral-text-extra-dark);
    background-color: var(--color-notification-warning-extra-light);
  }
`;

export const LinkIcon = styled(IconComposer)`
  margin-inline-end: 12px;
  color: var(--text-color, --color-base-neutral50);
  transition: color ${defaultTransitionProps};
`;

export const LinkCallout = styled(Link, transientOptions)`
  font-family: var(--font-family-heading);
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  color: inherit;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.104em;
  display: flex;
  align-items: center;
  min-height: 17.33px;

  &:hover {
    ${LinkIcon} {
      ${defaultHoverStyle}
    }

    color: var(--hover-color);
  }
`;

export const ErrorLink = styled(LinkCallout)`
  color: var(--color-notification-warning-light);

  &:hover,
  &.focus-visible {
    color: var(--color-notification-warning-extra-light);
  }
`;
