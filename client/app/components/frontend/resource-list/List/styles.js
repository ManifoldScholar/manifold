import styled from "styled-components";

export const List = styled.ul`
  container-type: inline-size;

  > li + li {
    padding-block-start: 24px;
  }
`;
