import { Transforms, Editor } from "slate";
import { ReactEditor } from "slate-react";
import { isBlockActive } from "./BlockButton";
import { containers } from "../../../utils/elements";

export const onModalClose = (editor, selection) => close => {
  close();
  const selectionToUse = editor.selection ?? selection;

  // I don't know exactly why this works, but there's some relevant, though potentially outdated, discussion here: https://github.com/ianstormtaylor/slate/issues/2097. The issue is that the focus() call fails unless it happens after the focus trap closes, and when a user hits cancel and we're not performing any node transformations after closing the modal, that doesn't happen without a timeout.
  setTimeout(() => {
    Transforms.select(editor, selectionToUse);
    ReactEditor.focus(editor);
  }, 200);
};

export const getNearestContainer = (editor, selection) => {
  const [container, containerPath] = Editor.above(editor, {
    at: Editor.unhangRange(editor, selection),
    match: n =>
      !Editor.isEditor(n) &&
      containers.includes(n.type) &&
      !n.nodeName &&
      !n.slateOnly
  });
  return { container, containerPath };
};

export const getActiveBlock = (editor, opts) => {
  const active = opts
    .map(o => [o, isBlockActive(editor, o)])
    .reduce((obj, o) => ({ ...obj, [o[0]]: o[1] }), {});
  const activeCount = opts.map(o => isBlockActive(editor, o)).filter(Boolean)
    .length;

  if (activeCount !== 1) return "";
  return Object.keys(active).find(o => active[o]);
};
