import styled from "@emotion/styled";
import {
  defaultFocusStyle,
  buttonUnstyled,
  buttonRounded,
  formLabelPrimary
} from "theme/styles/mixins";
import BaseAvatar from "global/components/avatar";

export const Dropzone = styled.div`
  position: relative;
  cursor: pointer;
`;

export const RemoveWrapper = styled.div`
  top: 50%;
  margin-top: -33px;
  height: 66px;
  width: 66px;
  position: absolute;
`;

export const RemoveButton = styled.button`
  ${buttonUnstyled}
  ${buttonRounded}
  ${formLabelPrimary}
  font-weight: var(--font-weight-regular);
  line-height: 1.761;
  text-align: center;
  position: absolute;
  top: -6px;
  right: -12px;
`;

export const Avatar = styled(BaseAvatar)`
  margin: 0 !important;
`;

export const DropzonePrompt = styled.span`
  display: block;
  padding-left: 95px;
  text-align: left;
`;

export const UploadLink = styled.span`
  text-decoration-line: underline;
  transition: color var(--transition-duration-default)
    var(--transition-timing-function);
`;

export const DropzoneOutline = styled.div`
  ${buttonUnstyled}
  ${buttonRounded}
  ${formLabelPrimary}
  position: relative;
  padding: 25px 15px;
  font-weight: var(--font-weight-regular);
  line-height: 1.761;
  text-align: center;
  border: 2px dotted var(--color-base-neutral50);
  &:hover {
    ${UploadLink} {
      color: var(--hover-color);
    }
  }
`;

export const DropzoneInput = styled.input`
  display: block !important;
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  inline-size: 100%;
  block-size: 100%;
  opacity: 0;
  cursor: pointer;
  &:hover {
    + ${DropzoneOutline} ${UploadLink} {
      color: var(--hover-color);
    }
  }
  &:focus {
    outline: 0;
    + ${DropzoneOutline} ${UploadLink} {
      ${defaultFocusStyle}
      outline-color: var(--focus-color);
    }
  }
`;

export const Instructions = styled.p`
  margin-block-end: 20px;
`;
