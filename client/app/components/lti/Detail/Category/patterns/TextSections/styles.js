import styled from "styled-components";
import { listUnstyled } from "theme/styles/mixins";

export const Box = styled.div`
  background-color: var(--color-base-neutral-white);
  border: 1px solid var(--color-base-neutral40);
  border-radius: 8px;
  padding: 24px 30px 30px;
`;

export const List = styled.ol`
  ${listUnstyled}
`;
