import styled from "@emotion/styled";
import { breakpoints } from "theme/styles/variables/media";
import { respond } from "theme/styles/mixins";

const BREAKPOINT = breakpoints[60];

export const SocialLinks = styled.div`
  grid-area: social;
  color: var(--link-color, inherit);
`;

export const Hashtag = styled.a`
  color: inherit;
  text-decoration: none;
  font-family: var(--font-family-heading);
  display: block;
  font-size: 16px;
  font-weight: var(--font-weight-semibold);

  ${respond(`font-size: 18px;`, BREAKPOINT)}
`;

export const Link = styled.a`
  color: inherit;
  text-decoration: none;
  display: inline-block;
  padding: 5px;
  color: var(--Social-icons-color, --color-neutral-ui-light);

  &:first-child {
    margin-left: -5px;
  }

  + ${Hashtag} {
    margin-block-start: 15px;
  }
`;
