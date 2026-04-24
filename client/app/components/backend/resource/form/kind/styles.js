import styled from "styled-components";

export const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  > *:not(style) {
    flex-basis: 350px;
    display: flex;
    flex-direction: column;

    > div {
      flex-grow: 1;
    }

    > label {
      block-size: 15px;
    }
  }
`;
