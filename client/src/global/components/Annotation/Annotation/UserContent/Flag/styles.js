import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const Form = styled.form`
  --TextArea-border-color: var(--color);

  textarea {
    block-size: 150px !important;
    font-size: 18px;
  }

  > * + * {
    margin-block-start: 24px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-inline-start: auto;

  > button {
    flex-grow: 0;
    flex-basis: 50%;

    ${respond(`flex-basis: max-content`, 65)}
`;

export const Heading = styled.h2`
  color: ${$dark => ($dark ? `var(--strong-color)` : `var(--box-color)`)};
`;
