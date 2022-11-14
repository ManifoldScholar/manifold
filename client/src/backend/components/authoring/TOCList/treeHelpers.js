import { uid } from "react-uid";

const formatTreeItem = entry => {
  if (!entry) return undefined;
  if (!entry.children) {
    return {
      id: uid(entry),
      children: [],
      hasChildren: false,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        sectionId: entry.id,
        title: entry.label,
        anchor: entry.anchor,
        type: entry.type
      }
    };
  }
  return [
    {
      id: uid(entry),
      hasChildren: true,
      children: entry.children
        .map(c => (c ? uid(c) : undefined))
        .filter(Boolean),
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        sectionId: entry.id,
        title: entry.label,
        anchor: entry.anchor,
        type: entry.type
      }
    },
    entry.children.map(c => formatTreeItem(c)).filter(Boolean)
  ];
};

export const formatTreeData = toc => {
  if (!toc) return null;

  const rootChildren = toc.map(e => uid(e));
  const entries = toc.map(formatTreeItem).filter(Boolean);
  const flatEntries = entries.flat(10);
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
          title: "root"
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
    id: item.data.sectionId,
    label: item.data.title,
    anchor: item.data.anchor,
    type: item.data.type,
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

const removeKey = (k, { [k]: _, ...o }) => o;
export const removeKeys = (keys, o) =>
  keys.reduce((r, k) => removeKey(k, r), o);
