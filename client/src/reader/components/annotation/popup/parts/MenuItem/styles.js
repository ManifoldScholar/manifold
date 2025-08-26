import styled from "@emotion/styled";
import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { MenuItem as ReakitMenuItem } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";

export const MenuItem = styled(ReakitMenuItem)`
  ${buttonUnstyled}
  ${utilityPrimary}
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 11px 20px 11px 20px;
  font-size: 14px;
  line-height: 21px;
  text-align: start;
  text-decoration: none;
  color: var(--menu-color);
  background-color: var(--menu-bg-color);
  transition: none;

  &:hover,
  &:focus {
    color: var(--menu-button-hover-color);
    background-color: var(--hover-color);
    outline: none;
  }
`;

export const Icon = styled(IconComposer)``;

export const Label = styled.span``;
