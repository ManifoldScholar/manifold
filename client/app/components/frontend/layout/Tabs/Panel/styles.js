import styled from "styled-components";

export const Panel = styled.div`
  display: none;

  ${({ $visible }) => $visible && `display: block;`}
`;
