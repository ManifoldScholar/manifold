import { Editor as SlateEditor, Transforms, Node, Point } from "slate";
import { ReactEditor } from "slate-react";
import { getListNode, getListItemNode } from "../getters";
import { setSelectionAtPoint } from "../general";
import { unwrapNode } from "./shared";
import { rteElements } from "../../elements";
import has from "lodash/has";

const getTextLocation = (editor, iterator, path, str = "") => {
  const { value } = iterator.next();
  if (!value) return { textContent: str, lastPath: path };
  const [node, nodePath] = value;
  if (node.type === "list-sibling")
    return getTextLocation(editor, Node.children(editor, nodePath), nodePath);
  const isTextNode = has(node, "text");
  const nextStr = isTextNode ? node.text : str;
  const nextPath = isTextNode ? nodePath : path;
  return getTextLocation(editor, iterator, nextPath, nextStr);
};

// There must be a better way to achieve this with Range, but I haven't taken the time to figure it out. -LD
const getIndentSelectionLocation = (editor, path) => {
  const textIterator = Node.children(editor, path);
  const { textContent, lastPath } = getTextLocation(editor, textIterator, path);
  return { path: lastPath, offset: textContent.length };
};

const nestListItem = ({ editor, srcPath, destPath, node, type }) => {
  const children = Array.isArray(node) ? node : [node];
  Transforms.removeNodes(editor, { at: srcPath });
  Transforms.insertNodes(editor, [{ type, children }], {
    at: destPath
  });
};

const liftListItem = ({ editor, srcPath, destPath, unwrap = true }) => {
  if (destPath) Transforms.moveNodes(editor, { at: srcPath, to: destPath });
  if (unwrap) {
    const targetPath = destPath ?? srcPath;
    Transforms.unwrapNodes(editor, { at: targetPath });
  }
};

const handleInlineItemChildren = ({ editor, at, nodes }) => {
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

const findListChild = iterator => {
  const { value } = iterator.next();
  if (!value) return [];
  const [node, path] = value;
  if (node.type === "ul" || node.type === "ol") return [node, path];
  return findListChild(iterator);
};

export const increaseIndent = editor => {
  const [node, path] = getListItemNode(editor, editor.selection);
  const [listNode, listNodePath] = getListNode(editor, path);

  if (!node || !listNode) return;

  const listType = listNode.type;
  const index = [...path].pop();

  const nodeStart = SlateEditor.start(editor, path);
  const listStart = SlateEditor.start(editor, listNodePath);

  // If this is the first element in a list, indent the entire (sub)list
  if (Point.equals(nodeStart, listStart))
    return SlateEditor.withoutNormalizing(editor, () => {
      nestListItem({
        editor,
        srcPath: listNodePath,
        destPath: listNodePath,
        node: listNode,
        type: listType
      });
      const { path: selectionPath, offset } = getIndentSelectionLocation(
        editor,
        [...listNodePath, 0, 0]
      );
      setSelectionAtPoint(editor, selectionPath, offset);
    });

  const prevItemPath = [...path.slice(0, -1), index - 1];
  const [prevItem] = SlateEditor.node(editor, prevItemPath);

  if (!prevItem) return;

  const iterator = Node.children(editor, prevItemPath);
  const [subListNode, subListPath] = findListChild(iterator);

  if (subListNode) {
    return Transforms.moveNodes(editor, {
      at: path,
      to: [...subListPath, subListNode.children.length]
    });
  }

  SlateEditor.withoutNormalizing(editor, () => {
    if (SlateEditor.hasBlocks(editor, prevItem)) {
      const destPath = [...prevItemPath, prevItem.children.length];
      nestListItem({
        editor,
        srcPath: path,
        destPath,
        node,
        type: listType
      });
      const { path: selectionPath, offset } = getIndentSelectionLocation(
        editor,
        [...destPath, 0]
      );
      setSelectionAtPoint(editor, selectionPath, offset);
      return;
    }

    handleInlineItemChildren({
      editor,
      at: [...prevItemPath, 0],
      nodes: prevItem.children
    });
    const destPath = [...prevItemPath, 1];
    nestListItem({
      editor,
      srcPath: path,
      destPath,
      node,
      type: listType
    });
    const { path: selectionPath, offset } = getIndentSelectionLocation(editor, [
      ...destPath,
      0
    ]);
    setSelectionAtPoint(editor, selectionPath, offset);
  });
};

export const decreaseIndent = ({ editor, canUnwrapRoot }) => {
  const [node, path] = getListItemNode(editor, editor.selection);
  const [parentLi, parentPath] = getListItemNode(editor, path);
  const [listNode, listNodePath] = getListNode(editor, path);
  const listParent = Node.parent(editor, listNodePath);
  const isWrappedList = listParent?.type === "ul" || listParent?.type === "ol";

  if (!node) return;

  if ((!listNode || !isWrappedList) && !parentLi) {
    const format = rteElements.includes(listParent?.type)
      ? listParent.type
      : "p";

    if (canUnwrapRoot) {
      Transforms.setNodes(editor, { type: format }, { at: path });
      return unwrapNode({ editor, format, path });
    }
    return null;
  }

  const nodeStart = SlateEditor.start(editor, path);
  const listStart = SlateEditor.start(editor, listNodePath);

  // If this is the first element in a list, unindent the entire (sub)list
  if (Point.equals(nodeStart, listStart))
    return SlateEditor.withoutNormalizing(editor, () => {
      if (isWrappedList) {
        return liftListItem({ editor, srcPath: listNodePath });
      }
      const destIndex = [...parentPath].pop() + 1;
      const destPath = [...parentPath.slice(0, -1), destIndex];
      liftListItem({ editor, srcPath: listNodePath, destPath });
      handleInlineItemChildren({ editor, at: [...destPath.slice(0, -1), 0] });
    });

  if (!parentLi) return;

  SlateEditor.withoutNormalizing(editor, () => {
    const destIndex = [...parentPath].pop() + 1;
    const destPath = [...parentPath.slice(0, -1), destIndex];
    liftListItem({ editor, srcPath: path, destPath, unwrap: false });
  });
};
