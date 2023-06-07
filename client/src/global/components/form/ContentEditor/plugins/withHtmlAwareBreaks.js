import { Editor, Range, Transforms, Path, Element, Point } from "slate";
import { rteElements } from "../utils/elements";
import { decreaseIndent } from "../transforms/indents";
import { getListItemNode } from "../transforms/utils";

// The plugins here are for dealing with nodes that are "invisible" in the RTE. For example, with html such as <p><span>my text</span></p>, if a user hit enter at the end of "text" having moved selection there in an inline way (that is, by arrowing left or right or by typing in the line but not by arrowing up and down which selects blocks only), Slate would by default simply split the p block. This would result in a new block with the html <p><span></span></p>. Since this span is invisible to the user in RTE mode, I'm assuming that user really wants html of just <p></p> and inserting that instead. It might make sense in a later iteration to make common html elements like span and div into full RTE elements, so they can be added/removed with a button like list, etc. Doing so would remove much of the complexity here.

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
      next.htmlAttrs = { class: htmlAttrs.class };
    }

    try {
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(
          editor,
          { ...next, children: [{ text: "" }] },
          { at: selection, select: true }
        );
        // If there parent block exists only for Slate normalization, ensure that our new node has a "real" html parent
        if (block.slateOnly) {
          Transforms.liftNodes(editor, { mode: "lowest" });
        }
        if (!Path.equals(blockPath, nodePath)) {
          Transforms.removeNodes(editor, selection);
        }
      });
    } catch (e) {
      insertBreak();
    }
  };

  // Again, for html such as <p><span>my text</span></p>, ensure that the span is removed when all text content is deleted.
  const removeEmptyInlines = selection => {
    const match = type => Editor.isInline(editor, type);

    const [inline, inlinePath] =
      Editor.previous(editor, {
        match: n => n.type && match(n.type)
      }) ?? [];
    const inlineStart = Editor.start(editor, inlinePath);

    if (inline) {
      const textContent = Node.string(inline);

      if (
        Point.isBefore(inlineStart, selection.anchor) &&
        textContent.length === 1
      ) {
        Transforms.removeNodes(editor, {
          at: inlinePath,
          match: n => match(n.type)
        });
      }
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

      removeEmptyInlines(selection);

      const match =
        Editor.above(editor, {
          match: n => Element.isElement(n) && Editor.isBlock(editor, n)
        }) ?? [];

      if (match) {
        const [block, path] = match;
        const start = Editor.start(editor, path);

        if (
          !Editor.isEditor(block) &&
          Element.isElement(block) &&
          block.type !== "p" &&
          Point.equals(selection.anchor, start)
        ) {
          Transforms.setNodes(editor, { type: "p" });

          if (block.type === "li") {
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
