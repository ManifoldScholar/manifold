import styled from "@emotion/styled";
import { defaultTransitionProps } from "theme/styles/mixins";
import { Editable as BaseEditable } from "slate-react";
import InputError from "../../InputError";

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
  border: 1px solid var(--TextArea-border-color);
  border-top: 0;
  border-bottom-left-radius: var(--box-border-radius);
  border-bottom-right-radius: var(--box-border-radius);
  background-color: var(--background-color);
  overflow: hidden;
  overflow-x: auto;

  .ace_editor {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    border: 0;
    overflow: visible;
  }

  .ace_gutter {
    min-height: 699px !important;
    overflow: visible;
    border-bottom-left-radius: var(--box-border-radius);
  }

  .ace_scroller {
    min-height: 699px !important;
    overflow: visible;
    border-bottom-right-radius: var(--box-border-radius);
  }

  .ace_gutter-cell:last-of-type {
    border-bottom-left-radius: var(--box-border-radius);
  }

  ${({ $cssVisible }) =>
    $cssVisible &&
    `
    .ace_cursor {
      display: none;
    }
  `}
`;

export const Editable = styled(BaseEditable)`
  max-width: 850px;
  margin: auto;
  padding-block: 4em;
  padding-inline: var(--container-padding-inline-fluid);
`;

export const Controls = styled.div`
  position: sticky;
  top: -80px;
  z-index: 200;
  background-color: var(--drawer-bg-color);
  padding-top: 30px;
`;

export const HTMLError = styled(InputError)`
  margin-block-end: 20px;

  > span {
    margin: 0;
  }
`;
