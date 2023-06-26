import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

export const clearSlate = editor => {
  const count = Array(editor.children.length).keys();
  [...count].forEach(() => {
    try {
      Transforms.removeNodes(editor, { at: [0] });
    } catch (e) {
      return e;
    }
  });
};

export const setSelectionAtPoint = (editor, path, offset = 0) => {
  Transforms.select(editor, {
    anchor: { path, offset },
    focus: { path, offset }
  });
};

export const formatNodeLabel = node => {
  let label = node.type === "void" ? node.nodeName : node.type;
  const { htmlAttrs } = node ?? {};
  if (htmlAttrs?.id) label = `${label}#${htmlAttrs.id}`;
  if (htmlAttrs?.class)
    label = `${label}.${htmlAttrs.class?.replaceAll(" ", ".")}`;
  return label;
};
