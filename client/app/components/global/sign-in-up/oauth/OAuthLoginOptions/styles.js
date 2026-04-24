import styled from "styled-components";

export const Wrapper = styled.div`
  margin-block-start: 15px;

  > * + * {
    margin-block-start: 30px;
  }
`;
