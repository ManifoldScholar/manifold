import styled from "@emotion/styled";
import FormContainer from "global/containers/form";

const gap = "30px";

export const Form = styled(FormContainer.Form)`
  margin-block-start: ${gap};

  input,
  .instructions {
    color: var(--strong-color);
  }
`;

export const DatesOuter = styled.div`
  padding-block-end: 20px;
`;

export const DatesInner = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 245px);
  grid-gap: ${gap};
  padding-block-end: 20px;
`;
