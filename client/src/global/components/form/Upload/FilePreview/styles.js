import styled from "@emotion/styled";
import {
  utilityPrimary,
  formLabelPrimary,
  buttonUnstyled
} from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

export const Preview = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  pointer-events: none;
`;

export const Message = styled.div`
  position: relative;
  width: 100%;
  padding: 20px;
  word-wrap: break-word;
  overflow-wrap: break-word;
`;

export const Icon = styled(IconComposer)`
  display: block;
  margin: 0 auto 20px;
`;

export const PrimaryText = styled.p`
  ${utilityPrimary}
  padding-bottom: 0;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.5em;
  text-align: center;
`;

export const SecondaryText = styled.p`
  ${formLabelPrimary}
  padding-bottom: 0;
  margin-top: 10px;
  line-height: 1.5em;
  text-align: center;
`;

export const Button = styled.button`
  ${buttonUnstyled}
  display: inline;
  text-decoration-line: underline;
  text-transform: inherit;
  letter-spacing: inherit;
  pointer-events: auto;
`;
