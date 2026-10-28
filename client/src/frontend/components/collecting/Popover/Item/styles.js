import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { buttonUnstyled, defaultFocusStyle } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Text = styled.span`
  display: block;
  grid-area: label;
  font-size: 17px;
  font-family: var(--font-family-sans);
  overflow-wrap: anywhere;
`;

export const Star = styled(IconComposer)`
  grid-area: selected;
`;

export const Button = styled("button", transientOptions)`
  ${buttonUnstyled}
  font: inherit;
  font-weight: normal;
  color: inherit;
  display: grid;
  inline-size: 100%;
  text-align: start;
  grid-template: "selected label private" auto / 28px minmax(0, 1fr) 20px;
  column-gap: 12px;
  margin: 0;
  padding-block: 0.375rem;
  align-items: center;
  cursor: pointer;
  opacity: ${({ $pending }) => ($pending ? 0.6 : 1)};

  &:first-child {
    padding-block-start: 0;
  }

  &:last-child {
    padding-block-end: 0;
  }

  .icon-star-fill {
    color: var(--color-base-neutral100);

    &__background {
      fill: var(--color-base-blue45);
    }
  }

  &:focus-visible {
    ${defaultFocusStyle}
    outline-offset: 2px;
  }
`;

export const PrivateIcon = styled(IconComposer)`
  grid-area: private;
  color: light-dark(var(--color-base-neutral50), var(--color-base-neutral30));
`;
