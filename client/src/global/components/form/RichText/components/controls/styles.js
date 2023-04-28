import styled from "@emotion/styled";

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  align-items: center;
  gap: 3px;
  border: 1px solid var(--TextArea-border-color);
  border-bottom-color: var(--textarea-border-color);
  padding-inline: 1.25em;
  padding-block: 1em;
  background-color: var(--drawer-bg-color);
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);
  color: var(--color);
  min-height: 60px;
`;

export const ToolbarSpacer = styled.div`
  margin-inline: 12px;
  border-left: 1px solid var(--background-color);
  height: 24px;
`;

export const ToggleBar = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  row-gap: 12px;
  justify-content: space-between;
  margin-block-end: 32px;
`;
