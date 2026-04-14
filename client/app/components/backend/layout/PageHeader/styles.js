import styled from "@emotion/styled";
import { panelRounded, fluidScale, respond } from "theme/styles/mixins";
import { SecondaryNavDropdown } from "../SecondaryNav";

export const Header = styled.header`
  ${({ $spaceBottom }) => $spaceBottom && `margin-block-end: 30px`}

  & + *:not(.container):not(.backend-panel) {
    margin-block-start: ${fluidScale("30px", "20px")};
  }
`;

export const Content = styled.div`
  ${panelRounded}

  nav + & {
    margin-block-start: ${fluidScale("30px", "20px")};
  }
`;

export const SecondaryNav = styled(SecondaryNavDropdown)`
  display: block;
  border-radius: 0 0 var(--box-border-radius) var(--box-border-radius);
  margin-block-start: -3px;

  ${respond(`display: none;`, 65)}
`;
