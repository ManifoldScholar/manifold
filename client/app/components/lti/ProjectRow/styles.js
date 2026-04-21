import styled from "@emotion/styled";
import { formLabelPrimary } from "theme/styles/mixins";

export const ExpandableItem = styled.li`
  display: flex;
  flex-direction: column;
  background: ${p =>
    p.$selected
      ? "var(--color-accent-primary-pale-translucent, #e8f9f0)"
      : "transparent"};

  & + & {
    border-top: 1px solid var(--color-neutral-ui-dull-dark);
  }
`;

export const RowMain = styled.div`
  display: flex;
  align-items: stretch;
`;

export const ExpandToggle = styled.button`
  flex: 0 0 auto;
  width: 52px;
  border: none;
  background: transparent;
  color: var(--color-neutral-text-dark);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  svg,
  .icon {
    transition: transform 0.15s ease;
    transform: rotate(${p => (p.$expanded ? "0deg" : "-90deg")});
  }

  &:hover {
    color: var(--color-neutral-text-extra-dark);
    background: var(--color-base-neutral05);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent-primary);
    outline-offset: -2px;
  }
`;

export const RowBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ExpandedChildren = styled.div`
  background: var(--color-base-neutral05);
  box-shadow: inset 0 6px 8px -6px rgba(0, 0, 0, 0.12);
  padding: 20px 20px 16px 60px;

  > ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

export const ExpandedLabel = styled.div`
  ${formLabelPrimary}
  color: var(--color-neutral-text-dark);
  margin-bottom: 12px;
`;

export const ExpandedChildRow = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;

  & + & {
    border-top: 1px solid var(--color-neutral-ui-dull-dark);
  }

  > a {
    flex: 1;
    color: var(--color-interaction-dark);
    text-decoration: none;
    font-family: var(--font-family-sans);
    font-size: 14px;
  }

  > a:hover {
    text-decoration: underline;
  }
`;

export const ExpandedCount = styled.span`
  display: inline-block;
  margin-left: 0.4rem;
  font-weight: var(--font-weight-regular);
  color: var(--color-neutral-ui-dark);
  letter-spacing: 0;
  text-transform: none;
`;

export const Empty = styled.p`
  color: var(--color-neutral-text-dark);
  font-style: italic;
  padding: 16px 4px;
  margin: 0;
`;
