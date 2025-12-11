import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

export const onModalClose = (editor, selection) => close => {
  close();
  const selectionToUse = editor.selection ?? selection;

  // I don't know exactly why this works, but there's some relevant, though potentially outdated, discussion here: https://github.com/ianstormtaylor/slate/issues/2097. The issue is that the focus() call fails unless it happens after the focus trap closes, and when a user hits cancel and we're not performing any node transformations after closing the modal, that doesn't happen without a timeout.
  setTimeout(() => {
    Transforms.select(editor, selectionToUse);
    ReactEditor.focus(editor);
  }, 200);
};
