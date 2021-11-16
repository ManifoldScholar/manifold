import styled from "@emotion/styled";
import { breakpoints } from "theme/styles/variables/media";
import { respond } from "theme/styles/mixins";
import { Wrapper as CalloutWrapper } from "../CalloutList/styles";

const BREAKPOINT = breakpoints[60];

export const SocialLinks = styled.div`
  grid-area: social;
  color: var(--link-color, inherit);

  ${CalloutWrapper} + & {
    margin-top: 35px;
  }
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
  color: var(--color-neutral-ui-light);

  &:first-child {
    margin-left: -5px;
  }

  + ${Hashtag} {
    margin-top: 15px;
  }
`;
