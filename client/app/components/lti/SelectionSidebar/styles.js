import styled from "@emotion/styled";
import { formLabelPrimary, utilityPrimary } from "theme/styles/mixins";

export const Sidebar = styled.dialog`
  position: fixed;
  inset-block: 0;
  inset-inline-end: 0;
  inset-inline-start: auto;
  width: 20rem;
  max-width: 20rem;
  height: 100dvh;
  margin: 0;
  background: #fff;
  border: none;
  border-left: 1px solid var(--color-neutral-ui-dull-dark);
  padding: 20px 20px 24px;
  overflow-y: auto;
  z-index: 5;
  box-shadow: -2px 0 12px rgba(0, 0, 0, 0.04);
  color: inherit;

  &[open] {
    display: flex;
    flex-direction: column;
  }
`;

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  h2 {
    ${formLabelPrimary}
    font-size: 13px;
    margin: 0;
    color: var(--color-neutral-text-dark);
  }

  button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    color: var(--color-neutral-text-dark);
    padding: 4px;
    border-radius: 3px;

    &:hover {
      color: var(--color-neutral-text-extra-dark);
      background: var(--color-base-neutral05);
    }
  }
`;

export const SidebarToggle = styled.button`
  ${utilityPrimary}
  position: fixed;
  top: 72px;
  right: 0;
  z-index: 6;
  padding: 8px 18px 8px 14px;
  background: #fff;
  border: 1px solid var(--color-neutral-ui-dull-dark);
  border-right: none;
  border-radius: 3px 0 0 3px;
  box-shadow: -1px 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-neutral-text-extra-dark);

  &:hover {
    background: var(--color-base-neutral05);
  }
`;

export const SidebarGroup = styled.div`
  margin-bottom: 16px;

  h3 {
    ${formLabelPrimary}
    font-size: 11px;
    margin: 0 0 6px;
    color: var(--color-neutral-text-dark);
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    border: 1px solid var(--color-neutral-ui-dull-dark);
    border-radius: 3px;
    margin-bottom: 4px;
    background: #fff;
    font-size: 13px;
    font-family: var(--font-family-copy);
    color: var(--color-neutral-text-extra-dark);
  }

  li > span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  li > button {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    line-height: 1;
    color: var(--color-neutral-ui-dark);
    padding: 0 4px;

    &:hover {
      color: var(--color-notification-error);
    }
  }
`;

export const Empty = styled.p`
  color: var(--color-neutral-text-dark);
  font-style: italic;
  padding: 16px 4px;
  margin: 0;
`;

export const AddToCourseButton = styled.div`
  margin-top: auto;
  padding-top: 16px;

  > * {
    width: 100%;
    justify-content: center;
  }
`;
