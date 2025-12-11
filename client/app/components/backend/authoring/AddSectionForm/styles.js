import styled from "@emotion/styled";

export const ButtonGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
  gap: 24px;
`;

export const ButtonRow = styled.div`
  width: 100%;
  display: flex;
  gap: 24px;
  align-items: stretch;
  justify-content: stretch;

  & > * {
    width: 50%;
  }
`;
