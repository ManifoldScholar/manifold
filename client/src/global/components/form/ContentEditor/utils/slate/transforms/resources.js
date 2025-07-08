import { Transforms, Editor } from "slate";
import { ReactEditor } from "slate-react";

export const insertResource = (editor, id, display = "full") => {
  const text = { text: "", slateOnly: true };
  const image = {
    type: "resource-block",
    htmlAttrs: { resourceid: id, display },
    children: [text]
  };
  const [node] = Editor.above(editor, editor.selection);
  if (Editor.isEmpty(editor, node)) {
    Transforms.removeNodes(editor);
  }
  Transforms.insertNodes(editor, image);
  ReactEditor.focus(editor);
};
