import styled from "@emotion/styled";
import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { MenuItem as ReakitMenuItem } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";

export const MenuItem = styled(ReakitMenuItem)`
  ${buttonUnstyled}
  ${utilityPrimary}
  display: flex;
  align-items: center;
  width: 100%;
  padding: 11px 24px 11px 15px;
  font-size: 14px;
  line-height: 23px;
  text-align: start;
  text-decoration: none;
  color: var(--menu-button-color);
  background-color: var(--menu-button-bg-color);
  transition: none;

  &:first-child {
    border-top-left-radius: var(--box-border-radius);
    border-top-right-radius: var(--box-border-radius);
  }

  &:last-child {
    border-bottom-right-radius: var(--box-border-radius);
    border-bottom-left-radius: var(--box-border-radius);
  }

  &:hover,
  &:focus,
  &[data-selected="true"] {
    color: var(--menu-button-hover-color);
    background-color: var(--hover-color);
    outline: none;
  }

  &[data-selected="true"]:hover,
  &[data-selected="true"]:focus-visible {
    color: var(--menu-selected-button-interaction-color);
    background-color: var(--menu-selected-button-interaction-background-color);
  }

  &:focus-visible {
    text-decoration: underline;
  }
`;

export const Icon = styled(IconComposer)`
  margin-right: 13px;
`;

export const Label = styled.span`
  position: relative;
  top: -1px;
`;
