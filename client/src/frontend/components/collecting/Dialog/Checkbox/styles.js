import styled from "@emotion/styled";
import { textTruncate, defaultFocusStyle } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

const iconSize = `28px`;
const highlightBgColor = `var(--color-base-blue45)`;

export const Label = styled.label`
  position: relative;
  display: block;
  font-size: 17px;
  line-height: 1.25;
  cursor: pointer;

  &:focus-within {
    ${defaultFocusStyle}
    outline-offset: -2px;
  }

  & + & {
    margin-top: 18px;
  }

  .icon-star-fill {
    &__background {
      fill: ${highlightBgColor};
    }
  }
`;

export const Input = styled.input`
  position: absolute;
  z-index: -1;
  opacity: 0;
`;

export const Item = styled.span`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
`;

export const IconWrapper = styled.span`
  position: relative;
  width: ${iconSize};
  height: ${iconSize};
  margin-right: 12px;
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
  ${textTruncate}
`;
