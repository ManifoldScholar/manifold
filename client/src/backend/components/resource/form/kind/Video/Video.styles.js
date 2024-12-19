import styled from "@emotion/styled";

export const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;

  > * {
    inline-size: max(200px, min(calc(50% - 20px), 400px));
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
