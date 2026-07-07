import styled from "@emotion/styled";

export const Spacer = styled.div`
  > * + * {
    margin-block-start: 50px;
  }
`;
