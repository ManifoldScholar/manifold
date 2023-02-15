import { Transforms } from "slate";

export const clearSlate = editor => {
  const count = Array(editor.children.length).keys();
  [...count].forEach(() => {
    try {
      Transforms.removeNodes(editor, { at: [0] });
    } catch (e) {
      console.log(e);
    }
  });
};
