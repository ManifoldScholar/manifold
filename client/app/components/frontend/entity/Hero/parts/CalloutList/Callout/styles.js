import styled from "styled-components";
import { Link } from "react-router";
import IconComposer from "components/global/utility/IconComposer";
import Button from "components/global/atomic/Button";
import { defaultTransitionProps, defaultHoverStyle } from "theme/styles/mixins";

export const ErrorButton = styled(Button)`
  background-color: var(--color-notification-warning-light);

  &:hover,
  &:focus-visible {
    color: var(--color-neutral-text-extra-dark);
    background-color: var(--color-notification-warning-extra-light);
  }
`;

export const LinkIcon = styled(IconComposer)`
  inline-size: 1.667em;
  block-size: 1.667em;
  color: var(--text-color, --color-base-neutral50);
  transition: color ${defaultTransitionProps};
`;

export const LinkCallout = styled(Link)`
  min-height: 17.33px;
  letter-spacing: 0.104em;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-family-heading);
  font-size: 14px;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
  color: inherit;
  text-decoration: none;
  text-transform: uppercase;

  &:hover {
    ${LinkIcon} {
      ${defaultHoverStyle}
    }

    color: var(--hover-color);
  }

  > span {
    padding-block: 0.15em 0.275em;
  }
`;

export const ErrorLink = styled(LinkCallout)`
  color: var(--color-notification-warning-light);

  &:hover,
  &:focus-visible {
    color: var(--color-notification-warning-extra-light);
  }
`;
