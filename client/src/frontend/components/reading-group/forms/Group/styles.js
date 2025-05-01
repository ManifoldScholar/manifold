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
  --transition-duration: 500ms;

  display: grid;
  grid-template-rows: 1fr;
  transition-property: display, opacity, grid-template-rows;
  transition-duration: var(--transition-duration);
  transition-delay:
    calc(0.5 * var(--transition-duration)),
    calc(0.5 * var(--transition-duration)), 0s;
  transition-timing-function: var(--transition-timing-function);
  transition-behavior: allow-discrete;

  > * {
    min-block-size: 0;
  }

  &[inert] {
    opacity: 0;
    display: none;
    grid-template-rows: 0fr;
    overflow: hidden;
    transition-delay: 0s;
  }
`;

export const DatesInner = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, 245px);
  grid-gap: ${gap};
  padding-block-end: 20px;
`;
