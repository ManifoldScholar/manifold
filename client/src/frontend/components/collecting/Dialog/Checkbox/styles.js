import styled from "@emotion/styled";
import { defaultFocusStyle } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

const iconSize = `28px`;
const highlightBgColor = `var(--color-base-blue45)`;

export const Label = styled.label`
  position: relative;
  display: block;
  font-size: 17px;
  line-height: 1.25;
  cursor: pointer;

  & + & {
    margin-block-start: 18px;
  }

  .icon-star-fill {
    color: var(--strong-color);

    &__background {
      fill: ${highlightBgColor};
    }
  }
`;

export const Item = styled.span`
  display: grid;
  grid-template-columns: auto 1fr auto;
  max-height: 28px;
`;

export const Input = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;

  &.focus-visible ~ ${Item} {
    ${defaultFocusStyle}
    outline-offset: -2px;
  }
`;

export const IconWrapper = styled.span`
  position: relative;
  inline-size: ${iconSize};
  block-size: ${iconSize};
  margin-inline-end: 12px;
`;

export const Icon = styled(IconComposer)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &-enter {
    opacity: 0;
  }

  &-enter-active {
    opacity: 1;
    transition: opacity 0.5s;
  }

  &-exit {
    opacity: 1;
  }

  &-exit-active {
    opacity: 0;
    transition: opacity 0.5s;
  }
`;

export const Title = styled.span`
  display: block;
  margin-block-start: 2px;
`;

export const Lock = styled(IconComposer)`
  margin-block-start: 4px;
`;
