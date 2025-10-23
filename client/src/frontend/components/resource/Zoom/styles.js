import styled from "@emotion/styled";
import Button from "global/components/atomic/Button";
import NativeDialog from "global/components/NativeDialog";

export const ZoomIndicator = styled(Button)`
  position: absolute;
  top: 30px;
  right: 30px;
  opacity: 0.9;
`;

export const Dialog = styled(NativeDialog)`
  --Dialog-block-size: 85dvh;
  --Dialog-content-max-inline-size: var(--container-width-inner);
`;

export const DialogInner = styled.div`
  block-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
