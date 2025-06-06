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

export const Name = styled.span`
  &:not(:last-child) {
    margin-inline-end: 1.25ch;
  }
`;

export const Roles = styled.span`
  font-style: italic;
  margin-inline-start: 0.75ch;
`;

export const Description = styled.div`
  font-size: 16px;
  letter-spacing: 0.012em;
  line-height: 1.529em;

  ${Contributors} + & {
    margin-block-start: 22px;
  }

  ${respond(
    `
    font-size: 17px;

    ${Contributors} + & {
      margin-block-start: 45px;
    }`,
    BREAKPOINT
  )}
`;
