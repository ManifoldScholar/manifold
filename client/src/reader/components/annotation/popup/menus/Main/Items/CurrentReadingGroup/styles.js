import styled from "@emotion/styled";
import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { MenuItem as ReakitMenuItem } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";

export const Icon = styled(IconComposer)`
  transform: rotate(90deg);
  opacity: 0;
  transition: opacity 0.3s;
`;

export const RGMenuItem = styled(ReakitMenuItem)`
  ${buttonUnstyled}
  padding: 16px 12px 16px 24px;
  color: var(--color-base-neutral90);
  background-color: var(--menu-secondary-bg-color);
  border-bottom-right-radius: var(--box-border-radius);
  border-bottom-left-radius: var(--box-border-radius);

  &:hover,
  &:focus-visible {
    color: var(--menu-button-hover-color);
    background-color: var(--hover-color);
    outline: none;

    ${Icon} {
      opacity: 1;
    }
  }
`;

export const Label = styled.span`
  ${utilityPrimary}
  font-size: 12px;
  line-height: 19px;
  letter-spacing: 1.5px;
  display: inline-block;
  inline-size: 100%;
  text-align: start;
`;

export const CurrentGroup = styled.span`
  margin-block-start: 6px;
  font-family: var(--font-family-sans);
  font-size: 17px;
  line-height: 20px;
  font-weight: var(--font-weight-regular);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Inner = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  inline-size: 208px;
`;
