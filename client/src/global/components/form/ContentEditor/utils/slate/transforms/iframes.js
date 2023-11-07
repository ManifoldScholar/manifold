import { Transforms, Editor } from "slate";
import { ReactEditor } from "slate-react";

export const insertIframe = (editor, url, title) => {
  const text = { text: "", slateOnly: true };
  const type = /api\/proxy\//.test(url) ? "video" : "iframe";
  const controls = type === "video" ? "" : undefined;
  const embed = {
    type,
    htmlAttrs: { src: url, title, controls },
    children: [text]
  };
  const [node] = Editor.above(editor, editor.selection);
  if (Editor.isEmpty(editor, node)) {
    Transforms.removeNodes(editor);
  }
  Transforms.insertNodes(editor, embed);
  ReactEditor.focus(editor);
};
