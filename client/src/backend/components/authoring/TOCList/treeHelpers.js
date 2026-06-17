/*
 * The TOC is held in the `@atlaskit/tree` flat shape ({ rootId, items }) so that
 * the drawer forms (AddEditTOCEntryForm) and the container (TableOfContents) can
 * keep reading/writing `tree.items[id]` unchanged. The drag-and-drop runtime,
 * however, no longer comes from `@atlaskit/tree` (deprecated, react-beautiful-dnd
 * under the hood) — it is now built on @atlaskit/pragmatic-drag-and-drop. The
 * move/path/flatten helpers below replace `moveItemOnTree`/`mutateTree`.
 */

export const INDENT_PER_LEVEL = 24;

const nodeToUids = n => {
  if (!n) return undefined;
  return [n.uid, n.children?.map(nodeToUids)];
};

const getFinalParentChildren = children => {
  return children
    .map(nodeToUids)
    .flat(100)
    .filter(Boolean);
};

const formatTreeItem = (entry, parentId, depth = 1, finalParent) => {
  if (!entry) return undefined;

  const setFinalParent = depth === 9 ? entry.uid : null;

  if (!entry.children) {
    return {
      id: entry.uid,
      children: [],
      hasChildren: false,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        uid: entry.uid,
        sectionId: entry.id,
        title: entry.label,
        anchor: entry.anchor,
        parentId: finalParent ?? parentId,
        isValidParent: !finalParent
      }
    };
  }

  /* eslint-disable no-nested-ternary */
  const children = setFinalParent
    ? getFinalParentChildren(entry.children)
    : !finalParent
    ? entry.children.map(c => (c ? c.uid : undefined)).filter(Boolean)
    : [];
  /* eslint-disable no-nested-ternary */

  return [
    {
      id: entry.uid,
      hasChildren: !finalParent,
      children,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        uid: entry.uid,
        sectionId: entry.id,
        title: entry.label,
        anchor: entry.anchor,
        parentId: finalParent ?? parentId,
        isValidParent: !finalParent
      }
    },
    entry.children
      .map(c =>
        formatTreeItem(c, entry.uid, depth + 1, finalParent ?? setFinalParent)
      )
      .filter(Boolean)
  ];
};

export const formatTreeData = toc => {
  if (!toc) return null;

  const rootChildren = toc.map(e => e.uid);
  const entries = toc.map(e => formatTreeItem(e, "root")).filter(Boolean);
  const flatEntries = entries.flat(100);
  const asObj = flatEntries.reduce((obj, e) => {
    return { ...obj, [e.id]: e };
  }, {});

  return {
    rootId: "root",
    items: {
      root: {
        id: "root",
        children: rootChildren,
        hasChildren: true,
        isExpanded: true,
        isChildrenLoading: false,
        data: {
          title: "root",
          isValidParent: true
        }
      },
      ...asObj
    }
  };
};

const formatTOCEntry = all => item => {
  if (!item) return undefined;

  const formatter = formatTOCEntry(all);
  return {
    uid: item.data.uid,
    id: item.data.sectionId,
    label: item.data.title,
    anchor: item.data.anchor,
    children: item.hasChildren
      ? item.children.map(c => formatter(all[c]))
      : undefined
  };
};

export const formatTOCData = tree => {
  if (!tree) return null;

  const topLevel = tree.items.root.children.map(c => tree.items[c]);
  return topLevel.map(formatTOCEntry(tree.items)).filter(Boolean);
};

export const getNestedTreeChildren = (itemId, treeItems) => {
  const item = treeItems[itemId];

  if (!item.hasChildren) return [];

  return [
    ...item.children,
    item.children.map(c => getNestedTreeChildren(c, treeItems))
  ].flat(10);
};

export const isValidParent = (id, treeItems) => {
  return treeItems[id].data.isValidParent;
};

export const getParentId = (id, treeItems) => {
  return treeItems[id].data.parentId;
};

const removeKey = (k, { [k]: _, ...o }) => o;
export const removeKeys = (keys, o) =>
  keys.reduce((r, k) => removeKey(k, r), o);

// Toggle (or otherwise patch) a single item — replaces @atlaskit/tree's `mutateTree`.
export const mutateTreeItem = (tree, id, patch) => ({
  ...tree,
  items: {
    ...tree.items,
    [id]: { ...tree.items[id], ...patch }
  }
});

// Metadata for one sibling group, used during the recursive (nested-ul) render.
// Each entry carries what the tree-item hitbox, ARIA attributes, and keyboard
// menu need; the renderer recurses into a child group with `level + 1`.
export const getRowsForChildren = (items, childrenIds, level) =>
  (childrenIds || []).map((id, i) => {
    const positionInSet = i + 1;
    const prevSibling = i > 0 ? items[childrenIds[i - 1]] : null;
    return {
      id,
      level,
      positionInSet,
      isLastInGroup: positionInSet === childrenIds.length,
      // Whether the keyboard menu's nest/un-nest actions are possible.
      canUnnest: level > 0,
      canNest: !!prevSibling && !!prevSibling.data?.isValidParent
    };
  });

// After deleting `id` (and its descendants), the id of the entry whose move
// control should receive focus so focus is not lost to <body>: prefer the next
// sibling, else the previous sibling, else the parent. Returns null when the
// deletion empties the top level (caller should fall back to the list itself).
export const getDeleteFocusTarget = (items, id) => {
  const parentId = items[id]?.data?.parentId || "root";
  const siblings = items[parentId]?.children || [];
  const idx = siblings.indexOf(id);
  if (idx < siblings.length - 1) return siblings[idx + 1];
  if (idx > 0) return siblings[idx - 1];
  return parentId === "root" ? null : parentId;
};

// Ids from the top-level ancestor down to (and including) `id`.
export const getPathToItem = (items, id) => {
  const path = [];
  let current = id;
  while (current && current !== "root") {
    path.unshift(current);
    current = items[current]?.data?.parentId;
  }
  return path;
};

export const isDescendant = (items, ancestorId, id) => {
  let current = items[id]?.data?.parentId;
  while (current && current !== "root") {
    if (current === ancestorId) return true;
    current = items[current]?.data?.parentId;
  }
  return false;
};

const cloneItems = items => {
  const out = {};
  Object.keys(items).forEach(k => {
    const it = items[k];
    out[k] = {
      ...it,
      children: [...(it.children || [])],
      data: { ...it.data }
    };
  });
  return out;
};

const removeFromParent = (items, id) => {
  const parentId = items[id]?.data?.parentId || "root";
  const parent = items[parentId];
  if (!parent) return;
  parent.children = parent.children.filter(c => c !== id);
  if (parentId !== "root") parent.hasChildren = parent.children.length > 0;
};

const insertIntoParent = (items, id, parentId, index) => {
  const parent = items[parentId];
  const child = items[id];
  const at = index == null ? parent.children.length : index;
  parent.children.splice(at, 0, id);
  child.data.parentId = parentId;
  if (parentId !== "root") {
    parent.hasChildren = true;
    parent.isExpanded = true;
  }
};

// Round-trip through the API shape so depth-derived flags (isValidParent at the
// depth-9 cap, parentId, hasChildren, child order) are recomputed authoritatively,
// then restore the expansion state captured from the mutated items.
const rebuild = items => {
  const expanded = {};
  Object.keys(items).forEach(k => {
    expanded[k] = items[k].isExpanded;
  });
  const next = formatTreeData(formatTOCData({ rootId: "root", items }));
  Object.keys(next.items).forEach(k => {
    if (k !== "root" && k in expanded) next.items[k].isExpanded = expanded[k];
  });
  return next;
};

// Apply a tree-item instruction (from the pragmatic-dnd tree-item hitbox) to the
// tree — replaces @atlaskit/tree's `moveItemOnTree`. Returns the original tree
// unchanged when the move is a no-op or blocked.
export const moveItemInTree = (tree, { itemId, targetId, instruction }) => {
  if (!instruction || !itemId || !targetId || itemId === targetId) return tree;
  if (isDescendant(tree.items, itemId, targetId)) return tree;

  const items = cloneItems(tree.items);
  const targetParentId = tree.items[targetId]?.data?.parentId || "root";

  removeFromParent(items, itemId);

  let parentId;
  let index;
  switch (instruction.type) {
    case "reorder-above":
      parentId = targetParentId;
      index = items[parentId].children.indexOf(targetId);
      break;
    case "reorder-below":
      parentId = targetParentId;
      index = items[parentId].children.indexOf(targetId) + 1;
      break;
    case "make-child":
      parentId = targetId;
      index = 0;
      break;
    case "reparent": {
      const path = getPathToItem(tree.items, targetId);
      const desiredId = path[instruction.desiredLevel];
      parentId = items[desiredId]?.data?.parentId || "root";
      index = items[parentId].children.indexOf(desiredId) + 1;
      break;
    }
    default:
      return tree;
  }

  insertIntoParent(items, itemId, parentId, index);
  return rebuild(items);
};

// Keyboard-driven moves. `action` is one of "up" | "down" | "indent" | "outdent".
// Returns { tree, announce, params } or null when the move is not possible.
export const keyboardMove = (tree, id, action) => {
  const { items } = tree;
  const parentId = items[id]?.data?.parentId || "root";
  const siblings = items[parentId].children;
  const idx = siblings.indexOf(id);

  if (action === "up") {
    if (idx <= 0) return null;
    return {
      tree: moveItemInTree(tree, {
        itemId: id,
        targetId: siblings[idx - 1],
        instruction: { type: "reorder-above" }
      }),
      announce: "announce_moved_up"
    };
  }

  if (action === "down") {
    if (idx >= siblings.length - 1) return null;
    return {
      tree: moveItemInTree(tree, {
        itemId: id,
        targetId: siblings[idx + 1],
        instruction: { type: "reorder-below" }
      }),
      announce: "announce_moved_down"
    };
  }

  if (action === "indent") {
    if (idx <= 0) return null;
    const prevId = siblings[idx - 1];
    if (!items[prevId].data?.isValidParent) return null;
    return {
      tree: moveItemInTree(tree, {
        itemId: id,
        targetId: prevId,
        instruction: { type: "make-child" }
      }),
      announce: "announce_nested",
      params: { title: items[prevId].data.title }
    };
  }

  if (action === "outdent") {
    if (parentId === "root") return null;
    return {
      tree: moveItemInTree(tree, {
        itemId: id,
        targetId: parentId,
        instruction: { type: "reorder-below" }
      }),
      announce: "announce_unnested"
    };
  }

  return null;
};
