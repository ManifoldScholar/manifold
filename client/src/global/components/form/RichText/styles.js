import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";
import { Editable as BaseEditable } from "slate-react";

export const Editor = styled.div`
  width: 100%;
  resize: vertical;
  border: 1px solid var(--TextArea-border-color);
  outline: none;
  transition: border-color ${defaultTransitionProps};

  &:focus-visible {
    border-color: var(--TextArea-focus-color);
  }
`;

export const EditorSecondary = styled(Editor)`
  --TextArea-border-color: var(--textarea-border-color);
  --TextArea-focus-color: var(--highlight-color);

  font-family: var(--input-font-family);
  background-color: var(--input-bg-color);
  border-radius: var(--box-border-radius);

  &::placeholder {
    color: var(--color-neutral-ui-light);
  }
`;

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid var(--textarea-border-color);
  padding-inline: 1.25em;
`;

export const EditableWrapper = styled.div`
  height: 800px;
  overflow-y: scroll;

  .ace_editor {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

export const Editable = styled(BaseEditable)`
  padding-inline: 1.25em;
  margin-block-start: 1.25em;
`;
