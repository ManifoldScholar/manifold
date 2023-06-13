import { Editor, Range, Transforms, Path, Element, Point, Node } from "slate";
import { rteElements } from "../utils/elements";
import { decreaseIndent } from "../transforms/indents";
import { getListItemNode } from "../transforms/utils";

// The plugins here are for dealing with nodes that are "invisible" in the RTE, that is renderedElements in "../utils/elements". For example, with html such as <p><span>my text</span></p>, if a user hit enter at the end of "text" having moved selection there in an inline way (that is, by arrowing left or right or by typing in the line but not by arrowing up and down which selects blocks only), Slate would by default simply split the p block. This would result in a new block with the html <p><span></span></p>. Since this span is invisible to the user in RTE mode, I'm assuming that user really wants html of just <p></p> and inserting that instead. It might make sense in a later iteration to assign all the elements in renderedElements to either void or full RTE elements, so there are not invisisbles and all nodes are either preview only or managed with the toolbars. Doing so would remove much of the complexity here. -LD

/* eslint-disable no-param-reassign */
const withHtmlAwareBreaks = editor => {
  const { insertBreak, deleteBackward } = editor;

  editor.insertBreak = () => {
    const { selection } = editor;
    const isCollapsed = selection && Range.isCollapsed(selection);

    // If the selection is a range, delete the content; this is default Slate behavior
    if (!isCollapsed) {
      Transforms.delete(editor);
    }

    /* eslint-disable no-unused-vars */
    // Grab the node where the user hit enter
    const [node, nodePath] = Editor.above(editor, selection);
    // Grab the nearest block node to determine what to insert
    const [block, blockPath] = Editor.above(editor, {
      at: selection,
      match: n => Editor.isBlock(editor, n)
    });
    // Remove all attributes other than the type/tag and marks, so we don't copy id, classes, anything that can't be updated in the RTE
    const { children, htmlAttrs, slateOnly, inline, ...next } = block;
    // Insert a paragraph if this node type isn't editable in the RTE; handle unwrapping the list item if we're on an empty li
    if (!rteElements.includes(next.type)) next.type = "p";
    if (next.type === "a" || next.type === "img" || next.type === "iframe")
      next.type = "p";
    if (next.type === "li") {
      const liIsEmpty = Editor.isEmpty(editor, block);
      if (isCollapsed && liIsEmpty) return decreaseIndent(editor, true);
      // Since the new element we're inserting is an element in an existing list, we'll keep the classname around in case indents are handled with classes
      next.htmlAttrs = { class: htmlAttrs?.class };
    }

    try {
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(
          editor,
          { ...next, children: [{ text: "" }] },
          { at: selection, select: true }
        );
        // If the parent block exists only for Slate normalization, ensure that our new node has a "real" html parent
        if (block.slateOnly) {
          Transforms.liftNodes(editor, { mode: "lowest" });
        }
        // For some reason I don't quite understand, inserting at a nested inline path causes a double node insertion; this cleans up that extra node
        if (!Path.equals(blockPath, nodePath)) {
          Transforms.removeNodes(editor, selection);
        }
      });
    } catch (e) {
      insertBreak();
    }
  };

  // Check for nested empty inlines, again such as <p><span>my text</span></p>, and ensure that they are removed when all text content is deleted
  const removeEmptyInline = (node, path) => {
    const { selection } = editor;

    const start = Editor.start(editor, path);
    const textContent = Node.string(node);

    // Using <= 1 rather than === 0 here is a choice; the result is that the inner span is removed when all its text content is, which is before the outer block wrapper, usually a paragraph, is deleted. This has the effect of cleaning up styles and other attributes, in case the user types new text in the pargraph node instead of deleting it. But as with all these choices, of course, the user could have wanted to keep those span styles around for the new text.
    if (Point.isBefore(start, selection.anchor) && textContent.length <= 1) {
      Transforms.unwrapNodes(editor, {
        at: path,
        match: n => Editor.isInline(editor, n)
      });

      const [inline, inlinePath] =
        Editor.above(editor, {
          match: n => n.type && Editor.isInline(editor, n)
        }) ?? [];

      if (inline) return removeEmptyInline(inline, inlinePath);
    }
  };

  // If the parent block exists only for Slate normalization, remove it too.
  const maybeUnwrapSlateOnlyNode = (node, path) => {
    const { selection } = editor;
    const start = Editor.start(editor, path);

    if (
      !Editor.isEditor(node) &&
      node.slateOnly &&
      Point.equals(selection.anchor, start)
    ) {
      Transforms.unwrapNodes(editor, { at: path, match: n => n.slateOnly });
    }
  };

  editor.deleteBackward = (...args) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [li] = getListItemNode(editor, editor.selection);
      if (li) {
        const liIsEmpty = Editor.isEmpty(editor, li);
        if (liIsEmpty) return decreaseIndent(editor, true);
      }

      const [inline, inlinePath] =
        Editor.above(editor, {
          match: n => n.type && Editor.isInline(editor, n)
        }) ?? [];

      if (inline) {
        removeEmptyInline(inline, inlinePath);
      }

      const [nearestBlock, path] =
        Editor.above(editor, {
          match: n => Element.isElement(n) && Editor.isBlock(editor, n)
        }) ?? [];

      maybeUnwrapSlateOnlyNode(nearestBlock, path);

      const [blockToTransform, transformPath] = nearestBlock.slateOnly
        ? Editor.above(editor, {
            match: n => Element.isElement(n) && Editor.isBlock(editor, n)
          })
        : [nearestBlock, path];

      if (blockToTransform) {
        const start = Editor.start(editor, transformPath);

        if (
          !Editor.isEditor(blockToTransform) &&
          Element.isElement(blockToTransform) &&
          blockToTransform.type !== "p" &&
          Point.equals(selection.anchor, start)
        ) {
          // It's an RTE default / best practice to replace non-paragraph block nodes with a paragraph rather than removing them from the tree. This prevents other nodes from colliding in unwanted ways, such as when another block ends up in a table.
          Transforms.setNodes(
            editor,
            { type: "p" },
            { at: transformPath, select: true }
          );

          if (blockToTransform.type === "li") {
            Transforms.unwrapNodes(editor, {
              match: n =>
                !Editor.isEditor(n) &&
                Element.isElement(n) &&
                (n.type === "ul" || n.type === "ol"),
              split: true
            });
          }
          return;
        }
      }
    }
    deleteBackward(...args);
  };

  return editor;
};

export default withHtmlAwareBreaks;
