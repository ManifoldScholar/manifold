import styled from "@emotion/styled";

export const Instructions = styled.p`
  margin-block-end: 24px;
`;

export const Form = styled.form`
  --TextArea-border-color: var(--color);

  textarea {
    block-size: 150px !important;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
  margin-block-start: 20px;

  > button {
    padding-inline: 16px;
    padding-block: 12px;
  }
`;
