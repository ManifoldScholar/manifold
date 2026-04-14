import styled from "@emotion/styled";
import { utilityPrimary, respond } from "theme/styles/mixins";

export const Divider = styled.div`
  ${utilityPrimary}
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40px 0;
  white-space: nowrap;

  &::before {
    margin-right: 25px;
    margin-left: 10px;
  }

  &::after {
    margin-right: 10px;
    margin-left: 25px;
  }

  &::before,
  &::after {
    width: 45%;
    height: 1px;
    content: "";
    background-color: var(--color-neutral-ui-dull-light);
  }

  ${respond(`flex-basis: 100%;`, 90)}
`;
