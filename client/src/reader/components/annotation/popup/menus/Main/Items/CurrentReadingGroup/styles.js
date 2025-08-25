import styled from "@emotion/styled";
import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { MenuItem as ReakitMenuItem } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";

export const RGMenuItem = styled(ReakitMenuItem)`
  --menu-button-color: var(--menu-secondary-color);
  --menu-button-bg-color: var(--menu-secondary-bg-color);

  ${buttonUnstyled}
  ${utilityPrimary}
  display: block;
  width: 100%;
  padding: 11px 24px 11px 15px;
  font-size: 14px;
  line-height: 23px;
  text-align: start;
  text-decoration: none;
  color: var(--menu-button-color);
  background-color: var(--menu-button-bg-color);
  transition: none;

  padding-right: 20px;
  padding-left: 20px;
  color: var(--color-base-neutral45);
  background-color: var(--color-base-neutral95);

  &:first-child {
    border-top-left-radius: var(--box-border-radius);
    border-top-right-radius: var(--box-border-radius);
  }

  &:last-child {
    border-bottom-right-radius: var(--box-border-radius);
    border-bottom-left-radius: var(--box-border-radius);
  }

  &:hover,
  &:focus {
    color: var(--menu-button-hover-color);
    background-color: var(--hover-color);
    outline: none;
  }
`;

export const Label = styled.span`
  position: relative;
  top: -1px;
`;

export const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 175px;
`;

export const CurrentGroup = styled.span`
  position: relative;
  top: -1px;
  overflow: hidden;
  font-size: 17px;
  font-weight: var(--font-weight-regular);
  text-overflow: ellipsis;
  text-transform: none;
  letter-spacing: 0;
  white-space: nowrap;
`;

export const Icon = styled(IconComposer)`
  margin-right: -5px;
  margin-left: 13px;
  transform: rotate(90deg);
`;
