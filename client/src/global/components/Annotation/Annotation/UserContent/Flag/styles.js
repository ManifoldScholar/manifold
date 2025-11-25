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
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  column-gap: 20px;
  row-gap: 12px;
  margin-inline-start: auto;

  > button {
    flex-grow: 0;
    flex-basis: calc(50% - 10px);

    ${respond(`flex-basis: max-content`, 65)}
`;
