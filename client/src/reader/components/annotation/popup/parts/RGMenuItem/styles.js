import styled from "@emotion/styled";
import { buttonUnstyled } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

export const RGMenuItem = styled.button`
  ${buttonUnstyled}
  width: 100%;
  min-width: 290px;
  color: var(--group-button-color, inherit);
  text-align: left;
  background-color: var(--group-button-bg-color, transparent);
  transition: none;

  &:hover,
  &:focus-visible {
    color: var(--group-button-hover-color);
    background-color: var(
      --group-button-hover-bg-color,
      var(--color-interaction-dark)
    );
    outline: 0;
  }
`;

export const Inner = styled.div`
  display: grid;
  grid-template: "selected label private" auto / 22px 1fr 18px;
  column-gap: 14px;
  padding: 10px 20px;
`;

export const SelectedIcon = styled(IconComposer)`
  grid-area: selected;
`;

export const PrivateIcon = styled(IconComposer)`
  grid-area: private;
  margin-top: 2px;
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
