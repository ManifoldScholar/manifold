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

export const getRootParentPosition = (id, treeItems) => {
  const rootChildren = treeItems.root.children;
  const parent = treeItems[id].data.parentId;

  if (!parent) {
    return rootChildren.length;
  }
  if (parent === "root") {
    return rootChildren.indexOf(id);
  }
  return getRootParentPosition(parent, treeItems);
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

const childCount = item => {
  return item.hasChildren ? item.children.length : 0;
};

export const getCollapseCount = (item, items) => {
  return [
    item.isExpanded ? childCount(item) : 0,
    ...item.children?.map(c => getCollapseCount(items[c], items))
  ].reduce((sum, val) => sum + val, 0);
};
