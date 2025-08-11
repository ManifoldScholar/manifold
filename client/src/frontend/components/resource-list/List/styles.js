import styled from "@emotion/styled";

export const List = styled.ul`
  container-type: inline-size;

  > li + li {
    padding-block-start: 24px;
  }
`;
