import styled from "@emotion/styled";
import { utilityPrimary } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  border-radius: calc(0.5 * var(--box-border-radius));
  ${utilityPrimary}
  font-size: 11px;
  /* fallbacks if light-dark not supported */
  color: var(--color-base-neutral80);
  background-color: var(--box-bg-color);
  color: light-dark(var(--color-base-neutral80), var(--color-base-neutral50));
  background-color: var(
    --Badge-bg-color,
    light-dark(var(--color-base-neutral10), var(--color-base-neutral100))
  );

  > * {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
  }
`;

export const Kind = styled.span`
  /* fallbacks if light-dark not supported */
  color: var(--color-base-neutral90);
  background-color: var(--box-x-strong-bg-color);
  color: light-dark(var(--color-base-neutral90), var(--color-base-neutral20));
  background-color: var(
    --Badge-Kind-bg-color,
    light-dark(var(--color-base-neutral05), var(--color-base-neutral95))
  );
`;
