import styled from "@emotion/styled";

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-block: 0;
  list-style-type: none;

  @container (max-inline-size: 500px) {
    --_Button-min-inline-size: 100%;

    > li {
      flex-basis: 100%;
    }
  }
`;
