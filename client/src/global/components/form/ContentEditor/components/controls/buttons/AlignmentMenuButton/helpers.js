import { Range } from "slate";

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
  const selectedChildren = [];

  for (let i = selectionRange[0]; i <= selectionRange[1]; i++) {
    selectedChildren.push(block.children[i]);
  }

  const firstChildAttrs = selectedChildren[0]?.htmlAttrs;
  const { class: classes } = firstChildAttrs ?? {};
  const target = classes?.split(" ").find(c => c.includes("manifold-rte"));

  return selectedChildren.every(c => c.htmlAttrs?.class?.includes(target))
    ? target
    : null;
};
