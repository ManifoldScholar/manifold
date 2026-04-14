import styled from "@emotion/styled";
import { breakpoints } from "theme/styles/variables/media";
import { respond } from "theme/styles/mixins";

const BREAKPOINT = breakpoints[60];

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${respond(`align-items: flex-start;`, BREAKPOINT)}
`;

export const Text = styled.div`
  font-family: var(--font-family-copy);
  margin: 0;
  font-size: 16px;
  font-style: italic;
  color: var(--text-color, --color-neutral-text-dark);
  letter-spacing: 0.012em;

  em {
    font-style: normal;
  }
`;
