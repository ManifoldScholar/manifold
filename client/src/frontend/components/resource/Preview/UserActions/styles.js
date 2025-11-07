import styled from "@emotion/styled";

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-block: 0;
  margin-inline: 0;
  padding: 0;
  list-style-type: none;

  @container (max-inline-size: 500px) {
    --Button-min-inline-size: 100%;

    flex-grow: 1;

    > li {
      flex-basis: 100%;
    }
  }
`;
