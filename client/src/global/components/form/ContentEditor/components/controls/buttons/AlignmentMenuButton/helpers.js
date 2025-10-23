import { Range } from "slate";
import { setBlockClassName } from "../../../../utils/slate/transforms";

export const getClassNameWithAlign = (node, alignment) => {
  return node.htmlAttrs?.class
    ? node.htmlAttrs.class
        .split(" ")
        .filter(c => !c.startsWith("manifold-rte"))
        .concat(`manifold-rte-${alignment}`)
        .join(" ")
    : `manifold-rte-${alignment}`;
};

export const getSelectionIndices = (selection, parentPath) => {
  const { anchor, focus } = selection;
  const anchorIndex = anchor.path[parentPath.length];
  const focusIndex = focus.path[parentPath.length];
  const sorted = [anchorIndex, focusIndex].sort();
  return sorted;
};

const gatherListForAlignmentCheck = block => {
  if (block.type === "li") {
    const listChildren = block.children?.filter(
      child => child.type === "ul" || child.type === "ol"
    );
    return listChildren?.length
      ? [block, ...listChildren.map(gatherListForAlignmentCheck)]
      : block;
  }
  if (block.type === "ul" || block.type === "ol") {
    return block.children?.map(gatherListForAlignmentCheck) ?? [];
  }
};

const gatherNodesForAlignmentCheck = block => {
  if (!block) return [];

  if (block.type === "list-sibling") return [];

  const hasInlineChildren = Object.hasOwn(block.children?.[0], "text");

  if (hasInlineChildren && !block.slateOnly) return block;

  if (block.type === "li") return gatherListForAlignmentCheck(block);

  if (block.children?.length)
    return block.children.map(c => gatherNodesForAlignmentCheck(c));
};

export const getActiveAlignment = (selection, block, path) => {
  if (!block || !selection || !path) return null;

  // If selection only spans a single block, just check that block's classes.
  const hasInlineChildren = Object.hasOwn(block.children?.[0], "text");
  if (Range.isCollapsed(selection) || hasInlineChildren)
    return block.htmlAttrs?.class
      ?.split(" ")
      .find(c => c.includes("manifold-rte"));

  // Otherwise check whether all selcted children share an alignment class.
  const selectionRange = getSelectionIndices(selection, path);
  const selectionChildren = block.children?.slice(
    selectionRange[0],
    selectionRange[1] + 1
  );

  const nodesToCheck = selectionChildren
    ?.map(gatherNodesForAlignmentCheck)
    .flat(Infinity);

  const firstChildAttrs = nodesToCheck[0]?.htmlAttrs;
  const { class: classes } = firstChildAttrs ?? {};
  const target = classes?.split(" ").find(c => c.includes("manifold-rte"));

  return [...nodesToCheck, ...(block.type === "li" ? [block] : [])].every(c =>
    c.htmlAttrs?.class?.includes(target)
  )
    ? target
    : null;
};

const applyClassNameToNestedList = (editor, block, path, style) => {
  if (block.type === "li") {
    setBlockClassName({
      editor,
      block,
      path,
      className: getClassNameWithAlign(block, style)
    });
  }

  const hasInlineChildren = block.children?.[0]
    ? Object.hasOwn(block.children?.[0], "text")
    : false;

  if (hasInlineChildren) return;

  if (block.children?.length)
    block.children.map((childBlock, i) =>
      applyClassNameToNestedList(editor, childBlock, [...path, i], style)
    );
};

export const maybeApplyNestedBlockClassName = (editor, block, path, style) => {
  if (!block) return;

  if (block.type === "li")
    return applyClassNameToNestedList(editor, block, path, style);

  const hasInlineChildren = block.children?.[0]
    ? Object.hasOwn(block.children?.[0], "text")
    : false;

  if (hasInlineChildren && !block.slateOnly) {
    return setBlockClassName({
      editor,
      block,
      path,
      className: getClassNameWithAlign(block, style)
    });
  }

  if (block.children?.length)
    block.children.map((childBlock, i) =>
      maybeApplyNestedBlockClassName(editor, childBlock, [...path, i], style)
    );
};
