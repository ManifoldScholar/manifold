import styled from "styled-components";

export const Spacer = styled.div`
  > * + * {
    margin-block-start: 50px;
  }
`;
