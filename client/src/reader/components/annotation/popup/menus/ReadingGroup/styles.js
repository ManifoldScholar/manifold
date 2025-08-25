import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins";
import MenuItem from "../../parts/MenuItem";

export const Header = styled.div`
  ${utilityPrimary}
  display: flex;
  align-items: center;
  padding: 14px 20px;
  font-size: 14px;
  color: var(--menu-secondary-color);
  background-color: var(--menu-secondary-bg-color);
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);
`;

export const Heading = styled.span`
  margin-left: 1em;
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 336px; /* equals 8 items */
  padding-top: 14px;
  padding-bottom: 14px;
  overflow: auto;
`;

export const Footer = styled.div`
  margin: 20px 20px 0;
`;

export const Back = styled(MenuItem)`
  --menu-button-color: var(--menu-secondary-color);
  --menu-button-bg-color: var(--menu-secondary-bg-color);

  padding-right: 20px;
  padding-left: 20px;
  color: var(--color-base-neutral45);
  background-color: var(--color-base-neutral95);
`;
