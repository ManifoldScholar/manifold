import styled from "@emotion/styled";
import { defaultFocusStyle, setHoverStyle } from "theme/styles/mixins";

export const Dropzone = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 350px;
  min-height: 200px;
  border: 1px solid var(--input-border-color);
  border-radius: var(--box-border-radius);
  transition: border-color 0.2s;

  a,
  .fake-link {
    ${setHoverStyle()}

    &.focus-visible,
    &:focus-visible {
      outline: 0;
    }
  }
`;

export const Prompt = styled.span`
  text-decoration: underline;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
`;

export const Input = styled.input`
  display: block !important;
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  inline-size: 100%;
  block-size: 100%;
  opacity: 0;
  cursor: pointer;

  &:hover {
    + * ${Prompt} {
      color: var(--hover-color);
    }
  }

  &:focus-visible {
    outline: 0;

    + * ${Prompt} {
      ${defaultFocusStyle}
      outline-color: var(--focus-color);
    }
  }
`;
