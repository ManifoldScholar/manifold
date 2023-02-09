import styled from "@emotion/styled";
import { defaultTransitionProps, respond } from "theme/styles/mixins";
import { Editable as BaseEditable } from "slate-react";

export const Editor = styled.div`
  width: 100%;
  height: 800px;
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

  padding-block-end: 1.2em;
  font-family: var(--input-font-family);
  font-size: 16px;
  background-color: var(--input-bg-color);
  border-radius: var(--box-border-radius);

  ${respond(
    `
    padding-block-end: 1.389em;
    font-size: 18px;
  `,
    70
  )}

  &::placeholder {
    color: var(--color-neutral-ui-light);
  }
`;

export const Toolbar = styled.div`
  width: 100%;
  display: flex;
  border-bottom: 1px solid var(--textarea-border-color);
  margin-block-end: 1.25em;
  padding-inline: 1.25em;
`;

export const Editable = styled(BaseEditable)`
  padding-inline: 1.25em;
`;
