import { Transforms, Editor, Node } from "slate";

export const setSelectionAtPoint = (editor, path, offset = 0) => {
  Transforms.select(editor, {
    anchor: { path, offset },
    focus: { path, offset }
  });
};

export const getListItemNode = (editor, path) =>
  Editor.above(editor, {
    at: path,
    match: n => n.type === "li"
  }) ?? [];

export const getListNode = (editor, path) =>
  Editor.above(editor, {
    at: path,
    match: n => n.type === "ul" || n.type === "ol"
  }) ?? [];

export const findListChild = iterator => {
  const { value } = iterator.next();
  if (!value) return [];
  const [node, path] = value;
  if (node.type === "ul" || node.type === "ol") return [node, path];
  return findListChild(iterator);
};

const getTextLocation = (editor, iterator, path, str = "") => {
  const { value } = iterator.next();
  if (!value) return { textContent: str, lastPath: path };
  const [node, nodePath] = value;
  if (node.type === "list-sibling")
    return getTextLocation(editor, Node.children(editor, nodePath), nodePath);
  const nextStr = node.text ?? str;
  const nextPath = node.text ? nodePath : path;
  return getTextLocation(editor, iterator, nextPath, nextStr);
};

export const getIndentSelectionLocation = (editor, path) => {
  const textIterator = Node.children(editor, path);
  const { textContent, lastPath } = getTextLocation(editor, textIterator, path);
  return { path: lastPath, offset: textContent.length };
};

export const nestListItem = ({ editor, srcPath, destPath, node, type }) => {
  const children = Array.isArray(node) ? node : [node];
  Transforms.removeNodes(editor, { at: srcPath });
  Transforms.insertNodes(editor, [{ type, children }], {
    at: destPath
  });
};

export const liftListItem = ({ editor, srcPath, destPath, unwrap = true }) => {
  if (destPath) Transforms.moveNodes(editor, { at: srcPath, to: destPath });
  if (unwrap) {
    const targetPath = destPath ?? srcPath;
    Transforms.unwrapNodes(editor, { at: targetPath });
  }
};

export const handleInlineItemChildren = ({ editor, at, nodes }) => {
  if (nodes)
    return Transforms.insertNodes(
      editor,
      [{ type: "list-sibling", slateOnly: true, children: nodes }],
      { at }
    );
  return Transforms.unwrapNodes(editor, {
    at,
    match: n => n.type === "list-sibling"
  });
};
