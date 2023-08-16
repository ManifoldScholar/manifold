import { Transforms, Editor, Node, Element } from "slate";
import { ReactEditor } from "slate-react";
import has from "lodash/has";
import isEqual from "lodash/isEqual";
import { isEmptyAndChildless } from "../getters";

// This function removes a specific node at any point in the selection hierarchy, not just the lowest one like the other transforms. It is used to handle delete via the html element labels.

export const removeNode = (editor, path) => {
  const node = Node.get(editor, path);

  // can't delete the root node
  if (path.length === 1 && path[0] === 0) return;

  // if the node is empty, just remove it
  if (isEmptyAndChildless(editor, node))
    return Transforms.removeNodes(editor, {
      at: path,
      match: (n, p) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n.type === node.type &&
        isEqual(p, path)
    });

  // if the node is inline, it's safe to unwrap; the parent node is already setup for inline children
  if (Editor.isInline(editor, node)) {
    return Transforms.unwrapNodes(editor, {
      at: path,
      match: (n, p) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n.type === node.type &&
        isEqual(p, path)
    });
  }

  // if this is a list node, we're going to enforce some proper structure
  // replace all li nodes with p nodes before removing the list tag
  if (node.type === "ol" || node.type === "ul") {
    node.children.forEach(c => {
      const childPath = ReactEditor.findPath(editor, c);
      Transforms.setNodes(
        editor,
        { type: "p", slateOnly: undefined },
        { at: childPath, mode: "highest" }
      );
      if (c.children) {
        c.children.forEach(nc => {
          if (nc.type === "ol" || nc.type === "ul") {
            const nestedChildPath = ReactEditor.findPath(editor, nc);
            return Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) && Element.isElement(n) && n.type === "p",
              at: nestedChildPath,
              mode: "lowest"
            });
          }
        });
      }
    });
    return Transforms.unwrapNodes(editor, {
      match: (n, p) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n.type === node.type &&
        isEqual(p, path),
      at: path
    });
  }

  // // now that we know the node is block, determine its children type
  const hasBlockChildren = Editor.hasBlocks(editor, node);

  // remove the code mark also if this is a pre tag created with the code block RTE button
  if (node.type === "pre" && node.children[0].code)
    Transforms.setNodes(
      editor,
      { ...node.children[0], code: undefined },
      { at: [...path, 0], mode: "highest" }
    );

  // also safe to unwrap, we're just bumping blocks a level up the tree
  if (hasBlockChildren)
    return Transforms.unwrapNodes(editor, {
      at: path,
      match: (n, p) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        n.type === node.type &&
        !n.slateOnly &&
        isEqual(p, path)
    });

  // if the children are inline, there's a normalization issue because we'd be moving inline nodes up to parent with block children
  if (!hasBlockChildren)
    Editor.withoutNormalizing(editor, () => {
      let pathCounter = 0;
      node.children.forEach(c => {
        // remove if empty text node
        if (has(c, "text") && !Node.string(c)) {
          Transforms.removeNodes(editor, { at: [...path, pathCounter] });
        } else {
          // wrap in a slateOnly div to prevent it from disappearing in normalization
          Transforms.wrapNodes(
            editor,
            { type: "div", slateOnly: true },
            { at: [...path, pathCounter] }
          );
          pathCounter += 1;
        }
      });
      // now unwrap the node
      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n, p) =>
          !Editor.isEditor(n) &&
          Element.isElement(n) &&
          n.type === node.type &&
          !n.slateOnly &&
          isEqual(p, path)
      });
    });
};
