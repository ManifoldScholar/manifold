import styled from "styled-components";

export const Skeleton = styled("div")`
  width: 100%;
  height: 100%;
  min-height: 20px;
  background-color: var(--color-base-neutral20);
  border-radius: 4px;

  ${({ $nested }) =>
    $nested && `background-color: var(--color-base-neutral30);`}
`;
