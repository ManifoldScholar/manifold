const formatTreeItem = entry => {
  if (!entry.children) {
    return {
      id: `${entry.id}_${entry.label}`,
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
      id: `${entry.id}_${entry.label}`,
      hasChildren: true,
      children: entry.children.map(c => `${c.id}_${c.label}`),
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        sectionId: entry.id,
        title: entry.label,
        anchor: entry.anchor,
        type: entry.type
      }
    },
    entry.children.map(c => formatTreeItem(c))
  ];
};

export const formatTreeData = toc => {
  if (!toc) return null;

  const rootChildren = toc.map(e => `${e.id}_${e.label}`);
  const entries = toc.map(formatTreeItem);
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
  return topLevel.map(formatTOCEntry(tree.items));
};
