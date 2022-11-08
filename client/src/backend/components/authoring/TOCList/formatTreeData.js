const formatEntry = entry => {
  if (!entry.children) {
    return {
      id: entry.id,
      children: [],
      hasChildren: false,
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: entry.label
      }
    };
  }
  return [
    {
      id: entry.id,
      hasChildren: true,
      children: entry.children.map(c => c.id),
      isExpanded: true,
      isChildrenLoading: false,
      data: {
        title: entry.label
      }
    },
    entry.children.map(c => formatEntry(c))
  ];
};

export const formatTreeData = toc => {
  if (!toc) return null;

  const rootChildren = toc.map(e => e.id);
  const entries = toc.map(formatEntry);
  const flatEntries = entries.flat(Infinity);
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
