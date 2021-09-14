import styled from "@emotion/styled";
import { MenuItemRadio } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";
import { buttonUnstyled, defaultTransitionProps } from "theme/styles/mixins";

export const Item = styled(MenuItemRadio)`
  ${buttonUnstyled}
  width: 100%;
  min-width: 290px;
  color: var(--group-button-color, inherit);
  text-align: left;
  background-color: var(--group-button-bg-color, transparent);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover,
  &:focus-visible {
    color: var(--group-button-hover-color);
    background-color: var(
      --group-button-hover-bg-color,
      var(--color-accent-interaction-dark)
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

export const Text = styled.span`
  display: block;
  grid-area: label;
  min-height: 22px;
  overflow: hidden;
  font-size: 17px;
  font-family: var(--font-family-sans);
  color: inherit;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PrivateIcon = styled(IconComposer)`
  grid-area: private;
  margin-top: 2px;
  color: var(--group-button-private-icon-color, var(--color-neutral-ui-light));

  ${Item}:hover &,
  ${Item}:focus-visible & {
    color: inherit;
  }
`;

export const SelectedIcon = styled(IconComposer)`
  grid-area: selected;
`;
