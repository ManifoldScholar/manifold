import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  border-radius: calc(0.5 * var(--box-border-radius));
  ${utilityPrimary}
  font-size: 11px;
  color: var(--color-base-neutral80);
  background-color: var(--color-base-neutral10);

  .scheme-dark & {
    color: var(--color-base-neutral50);
    background-color: var(--color-base-neutral100);
  }

  > * {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
  }
`;

export const Kind = styled.span`
  color: var(--color-base-neutral90);
  background-color: var(--color-base-neutral05);

  .scheme-dark & {
    color: var(--color-base-neutral20);
    background-color: var(--color-base-neutral95);
  }
`;
