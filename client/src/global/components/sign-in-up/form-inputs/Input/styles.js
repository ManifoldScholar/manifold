import styled from "@emotion/styled";
import Form from "global/components/form";

export const Input = styled.input`
  font-family: var(--input-font-family);
  color: var(--input-color);
  background-color: var(--input-bg-color);
  border-color: var(--input-border-color);
  padding: 8px 13px 12px;
  font-size: var(--font-size-70);
  border: 3px solid var(--input-border-color);
  width: 100%;
`;

export const Label = styled.label`
  font-size: 12px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.125em;
  display: block;
  margin-bottom: 1em;
  color: var(--color-base-neutral50);
`;

export const Field = styled(Form.Errorable)`
  & + & {
    margin-block-start: 30px;
  }
`;
