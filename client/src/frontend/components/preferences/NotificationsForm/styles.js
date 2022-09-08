import styled from "@emotion/styled";
import { utilityPrimary, formInstructions } from "theme/styles/mixins";

export const FormSection = styled.div`
  & + & {
    margin-block-start: 60px;
  }
`;

export const Header = styled.h2`
  ${utilityPrimary}
  padding: 12px 24px;
  font-size: 14px;
  color: var(--color-base-neutral75);
  letter-spacing: 0.1em;
  background-color: var(--color-base-neutral10);
  border-radius: 8px;
`;

export const FormFields = styled.div`
  padding-inline: 24px;
  padding-block-start: 20px;

  > * + * {
    margin-block-start: 50px;
  }
`;

export const Instructions = styled.span`
  ${formInstructions}
  display: block;
`;

export const Button = styled.button`
  margin-block-start: 60px;
`;
