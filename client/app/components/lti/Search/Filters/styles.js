import styled from "styled-components";
import Button from "components/global/atomic/Button";
import { utilityPrimary } from "theme/styles/mixins";

export const Disclosure = styled(Button)`
  border-radius: 6px;

  &::-webkit-details-marker {
    display: none;
  }

  & [data-label-less] {
    display: none;
  }

  details[open] > & [data-label-more] {
    display: none;
  }

  details[open] > & [data-label-less] {
    display: inline;
  }

  details[open] > & svg {
    transform: rotate(180deg);
  }

  &:hover {
    background-color: var(--color-base-neutral90);
    border-color: var(--color-base-neutral90);
    color: var(--color-base-neutral-white);
  }

  &:focus-visible {
    outline: 2px solid var(--color-base-neutral90);
    background-color: var(--color-base-neutral-white);
    border-color: var(--color-base-neutral-white);
    color: var(--color-base-neutral90);
  }
`;

export const Legend = styled.legend`
  ${utilityPrimary}
  font-size: 12px;
  margin-block-end: 12px;
`;

export const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 12px;
  row-gap: 14px;
  align-items: center;

  details {
    display: contents;
  }
`;
