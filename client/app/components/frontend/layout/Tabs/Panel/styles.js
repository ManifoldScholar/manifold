import styled from "@emotion/styled";

export const Panel = styled.div`
  display: none;

  ${({ $visible }) => $visible && `display: block;`}
`;
