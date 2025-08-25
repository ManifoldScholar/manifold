import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins";
import MenuItem from "../../parts/MenuItem";
import { MenuItem as ReakitMenuItem } from "reakit/Menu";

export const Header = styled.div`
  padding: 24px 24px 10px 24px;
`;

export const Heading = styled.span`
  ${utilityPrimary}
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 1.5;
  color: var(--menu-secondary-color);
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 336px; /* equals 8 items */
  overflow: auto;
`;

export const Footer = styled.div`
  padding: 20px;
`;

export const Back = styled(MenuItem)`
  padding: 16px 20px;
  color: var(--color-base-neutral75);
  background-color: var(--menu-secondary-bg-color);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const Manage = styled(ReakitMenuItem)`
  ${utilityPrimary}
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 19px;
  letter-spacing: 1.5;
  text-decoration: none;
  background-color: var(--menu-secondary-bg-color);
  color: var(--manage-groups-link-color);
  border-radius: 4px;
  block-size: 36px;

  &:hover,
  &:focus-visible {
    color: var(--color-base-neutral90);
    background-color: var(--color-interaction-light);
    border-color: var(--color-interaction-light);
    outline: 0;
  }
`;
