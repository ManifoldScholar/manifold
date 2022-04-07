import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";

export const Skeleton = styled("div", transientOptions)`
  width: 100%;
  height: 100%;
  min-height: 20px;
  background-color: var(--color-base-neutral20);
  border-radius: 4px;

  ${({ $nested }) =>
    $nested && `background-color: var(--color-base-neutral30);`}
`;
