import styled from "@emotion/styled";

export const Wrapper = styled.div`
  margin-block-start: 15px;

  > * + * {
    margin-block-start: 30px;
  }
`;
