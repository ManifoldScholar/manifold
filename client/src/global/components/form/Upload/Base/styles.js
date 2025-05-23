import styled from "@emotion/styled";
import { defaultFocusStyle, setHoverStyle } from "theme/styles/mixins";
import BaseInput from "../../BaseInput";

const BaseDropzone = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 200px;

  a,
  .fake-link {
    ${setHoverStyle()}

    &:focus-visible {
      outline: 0;
    }
  }
`;

export const Dropzone = styled(BaseDropzone)`
  --FieldGroup-child-flex-basis: 100%;

  position: relative;
  cursor: pointer;
  max-width: var(--Dropzone-max-width, 350px);
  border: 1px solid var(--input-border-color);
  border-radius: var(--box-border-radius);
  transition: border-color 0.2s;
`;

export const AvatarBuilderDropzone = styled(BaseDropzone)`
  position: relative;
  width: 100%;
`;

export const Prompt = styled.span`
  cursor: pointer;
  text-decoration-line: underline;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);

  &:hover {
    color: var(--hover-color);
  }
`;

export const Input = styled.input`
  &:focus-visible {
    outline: 0;

    + * ${Prompt} {
      ${defaultFocusStyle}
      outline-color: var(--focus-color);
    }
  }
`;

export const AltTextInput = styled(BaseInput)`
  margin-block-start: 20px;
`;
