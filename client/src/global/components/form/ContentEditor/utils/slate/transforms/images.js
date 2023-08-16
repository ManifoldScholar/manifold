import { Transforms, Editor } from "slate";
import { ReactEditor } from "slate-react";

export const insertImage = (editor, url, alt) => {
  const text = { text: "", slateOnly: true };
  const image = {
    type: "img",
    htmlAttrs: { src: url, alt: alt ?? "" },
    children: [text]
  };
  const [node] = Editor.above(editor, editor.selection);
  if (Editor.isEmpty(editor, node)) {
    Transforms.removeNodes(editor);
  }
  Transforms.insertNodes(editor, image);
  ReactEditor.focus(editor);
};
