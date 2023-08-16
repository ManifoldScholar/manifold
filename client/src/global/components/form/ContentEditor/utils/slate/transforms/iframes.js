import { Transforms, Editor } from "slate";
import { ReactEditor } from "slate-react";

export const insertIframe = (editor, url, title) => {
  const text = { text: "", slateOnly: true };
  const embed = {
    type: "iframe",
    htmlAttrs: { src: url, title },
    children: [text]
  };
  const [node] = Editor.above(editor, editor.selection);
  if (Editor.isEmpty(editor, node)) {
    Transforms.removeNodes(editor);
  }
  Transforms.insertNodes(editor, embed);
  ReactEditor.focus(editor);
};
