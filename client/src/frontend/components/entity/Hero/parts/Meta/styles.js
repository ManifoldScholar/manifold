import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { Wrapper as CalloutWrapper } from "../CalloutList/styles";

const BREAKPOINT = breakpoints[60];

export const Wrapper = styled.div`
  font-family: var(--Meta-font-family, var(--font-family-copy));

  + ${CalloutWrapper} {
    margin-top: 20px;
  }
`;

const NamesList = styled.div`
  font-size: 16px;
  letter-spacing: 0.012em;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  line-height: 1.313em;
  font-family: var(--font-family-copy);
`;

export const Contributors = styled(NamesList)`
  ${respond(
    `
    font-size: 17px;
  `,
    BREAKPOINT
  )}
`;

export const Creators = styled(NamesList)`
  ${respond(
    `
    font-size: 20px;
  `,
    BREAKPOINT
  )}

  + ${Contributors} {
    margin-block-start: 12px;
  }

  .italic {
    font-style: italic;
  }
`;

export const Name = styled.span`
  margin-left: 0.5ch;

  &:not(:last-child) {
    &::after {
      display: inline;
      content: ", ";
    }
  }
`;

export const Description = styled.div`
  font-size: 16px;
  letter-spacing: 0.012em;
  line-height: 1.529em;

  ${Creators} + &,
  ${Contributors} + & {
    margin-block-start: 22px;
  }

  ${respond(
    `
    font-size: 17px;

    ${Creators} + &,
    ${Contributors} + & {
      margin-block-start: 45px;
    }`,
    BREAKPOINT
  )}
`;
