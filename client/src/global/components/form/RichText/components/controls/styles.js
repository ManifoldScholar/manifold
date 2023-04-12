import styled from "@emotion/styled";

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  border: 1px solid var(--textarea-border-color);
  padding-inline: 1.25em;
  background-color: var(--drawer-bg-color);
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);
  color: var(--color);
`;

export const ToolbarSpacer = styled.div`
  margin-inline: 12px;
  border-left: 1px solid var(--background-color);
  height: 24px;
`;

export const ToggleBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-block-end: 32px;
`;
