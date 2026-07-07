import styled from "@emotion/styled";
import {
  linkUnstyled,
  headingPrimary,
  defaultTransitionProps,
  defaultFocusStyle
} from "theme/styles/mixins";
import { Link } from "react-router";

export const Button = styled(Link)`
  ${linkUnstyled}

  flex-basis: calc(50% - var(--_BrowseButton-gap));
  min-height: 276px;
  background-color: var(--color-base-neutral-white);
  border: 1px solid var(--color-base-neutral40);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px 30px 30px 30px;
  gap: 16px;
  font-family: var(--font-family-sans);
  word-break: keep-all;
  transition: background-color ${defaultTransitionProps};

  &:hover {
    color: inherit;
    background-color: var(--color-accent-primary-light);
    border-color: var(--color-accent-primary-light);

    > div {
      background-color: var(--color-base-neutral-white);
    }
  }

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const Label = styled.span`
  ${headingPrimary}
  color: var(--color-base-neutral90);
  margin: 0;
`;
