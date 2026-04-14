import styled from "@emotion/styled";
import FormContainer from "global/containers/form";

export const Form = styled(FormContainer.Form)`
  --Form-row-gap: 40px;

  padding-bottom: 125px;
`;

export const ButtonOverlay = styled.div`
  position: fixed;
  bottom: 0;
  width: calc(100vw - (2 * var(--container-padding-inline-responsive)));
  box-sizing: border-box;
  background-color: var(--drawer-bg-color);
  padding-block-start: 20px;
  z-index: 200;
`;
