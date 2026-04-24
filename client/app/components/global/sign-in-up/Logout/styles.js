import styled from "styled-components";

export const Wrapper = styled.div`
  min-height: 250px;
  font-family: var(--font-family-copy);

  > * + * {
    margin-block-start: 30px;
    width: 100%;
  }
`;
