import styled from "@emotion/styled";
import { buttonUnstyled } from "theme/styles/mixins/appearance";
import { utilityPrimary } from "theme/styles/mixins/typography";

export const Tab = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  flex-basis: ${({ $count }) => ($count ? `${100 / $count}%` : `50%`)};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: var(--box-bg-color);
  padding: 10px 12px;
  white-space: nowrap;

  &:first-child {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:last-child {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  &:hover {
    background-color: var(--color-accent-primary);
    color: inherit;
  }

  &:focus-visible {
    background-color: var(--color-accent-primary-pale);
    color: inherit;
    outline-offset: -2px;
  }

  ${({ $active }) =>
    $active &&
    `background-color: var(--color-base-neutral80); color: var(--color-base-neutral-white);`}
`;
