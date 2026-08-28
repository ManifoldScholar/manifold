import styled from "styled-components";

export const Wrapper = styled.section`
  > * + * {
    margin-block-start: 16px;
  }
`;
