import styled from "@emotion/styled";

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-block-end: 35px;
  margin-block-start: 20px;
`;

export const ButtonWithDisable = styled.button`
  &:disabled {
    cursor: default;
  }
`;
