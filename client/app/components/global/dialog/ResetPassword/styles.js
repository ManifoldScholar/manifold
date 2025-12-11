import styled from "@emotion/styled";

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > * + * {
    margin-block-start: 20px;
  }

  .button-secondary {
    width: 100%;
  }
`;
