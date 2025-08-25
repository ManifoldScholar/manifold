import styled from "@emotion/styled";
import { buttonUnstyled } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

export const RGMenuItem = styled.button`
  ${buttonUnstyled}
  width: 100%;
  min-width: 297px;
  color: var(--group-button-color);
  text-align: left;
  transition: none;

  &:hover,
  &:focus-visible {
    color: var(--group-button-hover-color);
    background-color: var(--group-button-hover-bg-color);
    outline: 0;
  }
`;

export const Inner = styled.div`
  display: grid;
  grid-template: "selected label private" auto / 20px 1fr 20px;
  column-gap: 14px;
  padding: 10px 20px;
  align-items: center;
`;

export const SelectedIcon = styled(IconComposer)`
  grid-area: selected;
  margin-block-start: 2px;
`;

export const PrivateIcon = styled(IconComposer)`
  grid-area: private;
  color: var(--group-button-private-icon-color);

  .${RGMenuItem}:hover &,
  .${RGMenuItem}:focus-visible & {
    color: inherit;
  }
`;

export const Label = styled.span`
  display: block;
  grid-area: label;
  min-height: 22px;
  font-size: 17px;
  font-family: var(--font-family-sans);
  text-wrap: wrap;
`;
