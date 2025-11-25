import styled from "@emotion/styled";
import Button from "global/components/atomic/Button";

export const ZoomIndicator = styled(Button)`
  position: absolute;
  top: 30px;
  right: 30px;
  opacity: 0.9;
`;

export const DialogInner = styled.div`
  block-size: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
