import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { transientOptions } from "helpers/emotionHelpers";

const BREAKPOINT = breakpoints[60];

export const Header = styled("header", transientOptions)`
  position: relative;
  z-index: 50;
  hyphens: none;
  line-height: 1.188;

  ${({ $standalone }) =>
    $standalone &&
    `display: none;
  ${respond(`display: block;`, BREAKPOINT)}`}
`;

export const TitleWrapper = styled.div`
  display: flex;
`;

export const Title = styled("h1", transientOptions)`
  font-family: var(--font-family-heading);
  margin: 0;
  font-size: 22px;
  font-weight: var(--font-weight-semibold);

  ${respond(`font-size: 32px;`, BREAKPOINT)}

  ${({ $standalone }) =>
    $standalone && `${respond(`max-width: 90%;`, BREAKPOINT)}`}
`;

export const Toggle = styled.span`
  margin-left: 12px;

  ${respond(`transform: translateY(8px);`, BREAKPOINT)}
`;

export const Subtitle = styled.div`
  font-family: var(--font-family-copy);
  margin-block-start: 2px;
  font-size: 18px;
  font-style: italic;
  letter-spacing: 0.028em;

  ${respond(
    `margin-block-start: 11px;
    font-size: 24px;`,
    BREAKPOINT
  )}

  em,
  i {
    font-style: normal;
  }
`;
