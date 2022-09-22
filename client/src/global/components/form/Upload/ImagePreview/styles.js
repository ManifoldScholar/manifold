import styled from "@emotion/styled";
import { formLabelPrimary, buttonUnstyled } from "theme/styles/mixins";

export const Preview = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  align-items: center;
  width: 100%;
  padding: 10px;
  pointer-events: none;
`;

export const Message = styled.div`
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  justify-self: center;
  width: 75%;
  padding: 5px 20px 15px;
  margin-bottom: 20px;
  text-align: center;
  background: var(--color-base-neutral95);
  opacity: 0.9;
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
  text-decoration: underline;
  text-transform: inherit;
  letter-spacing: inherit;
  pointer-events: auto;
`;

export const Image = styled.img`
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  justify-self: center;
  max-width: 100%;
  max-height: 200px;
  background: var(--color-base-neutral20);
`;
