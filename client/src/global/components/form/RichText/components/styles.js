import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";
import { Editable as BaseEditable } from "slate-react";

export const Editor = styled.div`
  width: 100%;
  resize: vertical;
  outline: none;
  transition: border-color ${defaultTransitionProps};
  position: relative;
  border-radius: var(--box-border-radius);

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

  &.error {
    --TextArea-border-color: var(--error-color);
  }
`;

export const EditableWrapper = styled.div`
  min-height: 700px;
  padding-block-end: 4em;
  border: 1px solid var(--TextArea-border-color);
  border-top: 0;
  border-bottom-left-radius: var(--box-border-radius);
  border-bottom-right-radius: var(--box-border-radius);
  background-color: var(--background-color);

  .ace_editor {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border: 0;
    overflow: visible;
  }

  .ace_gutter,
  .ace_scroller {
    min-height: 700px !important;
    overflow: visible;
    padding-block-start: 2em;
    height: calc(100% + 5.25em);
    border-bottom-left-radius: var(--box-border-radius);
  }

  ${({ $cssVisible }) =>
    $cssVisible &&
    `
    cursor: default;
    
    .ace_cursor {
      display: none;
    }
  `}
`;

export const Editable = styled(BaseEditable)`
  max-width: 750px;
  margin: auto;
  padding-block: 4em;
`;

export const Controls = styled.div`
  position: sticky;
  top: -80px;
  z-index: 200;
  background-color: var(--drawer-bg-color);
  padding-top: 30px;
`;
