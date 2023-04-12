import styled from "@emotion/styled";

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  border: 1px solid var(--textarea-border-color);
  padding-inline: 1.25em;
  background-color: var(--drawer-bg-color);
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);
`;

export const ToggleBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-block-end: 32px;
`;
