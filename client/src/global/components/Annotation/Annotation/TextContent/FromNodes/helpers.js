export const deepCopy = n => ({
  ...n,
  children: n.children ? n.children.map(deepCopy) : undefined
});

const findNestedMatchIndex = (nodes, target) => {
  return nodes.findIndex(n => {
    return (
      n.nodeUuid === target ||
      (n.children && findNestedMatchIndex(n.children, target) >= 0)
    );
  });
};

const maybeTruncateChildren = (node, target, fromStart = true) => {
  if (!node.children || node.children?.length <= 1) return node;
  const index = findNestedMatchIndex(node.children, target);
  if (fromStart)
    return {
      ...node,
      children: [
        maybeTruncateChildren(node.children[index], target),
        ...node.children.slice(index + 1)
      ]
    };
  return {
    ...node,
    children: [
      ...node.children.slice(0, index),
      maybeTruncateChildren(node.children[index], target, fromStart)
    ]
  };
};

export const shrinkHaystack = (haystack, startId, endId) => {
  if (!haystack) return null;
  const shrunkFromStart = maybeTruncateChildren(haystack, startId);
  if (!shrunkFromStart) return null;
  const finalStack = maybeTruncateChildren(shrunkFromStart, endId, false);
  if (!finalStack) return null;
  return finalStack;
};

const truncateStart = (content, startChar, limit) => {
  const split = Math.max(
    content.lastIndexOf(".", startChar - limit),
    content.lastIndexOf("?", startChar - limit),
    content.lastIndexOf("!", startChar - limit)
  );
  if (split === -1) return { content };
  return { content: content.substring(split + 1), split };
};

const maybeTruncateStart = (node, startChar, limit) => {
  if (!startChar) return { adjustedNode: node };
  if (node.children?.length) {
    const firstChild = node.children.shift();
    const { adjustedNode: adjustedStartNode, split } = maybeTruncateStart(
      firstChild,
      startChar,
      limit
    );
    return {
      adjustedNode: {
        ...node,
        children: [adjustedStartNode, ...node.children]
      },
      split
    };
  }
  if (node.content) {
    const { content, split } = truncateStart(node.content, startChar, limit);
    return { adjustedNode: { ...node, content }, split };
  }
};

const truncateEnd = (content, endChar, limit) => {
  const split = Math.max(
    content.indexOf(".", endChar + limit),
    content.indexOf("?", endChar + limit),
    content.indexOf("!", endChar + limit)
  );
  if (split === -1) return content;
  return content.substring(0, split + 1);
};

const maybeTruncateEnd = (node, endChar, limit) => {
  if (!endChar) return { adjustedNode: node };
  if (node.children?.length) {
    const lastChild = node.children.pop();
    const adjustedEndNode = maybeTruncateEnd(lastChild, endChar, limit)
      .adjustedNode;
    return {
      adjustedNode: { ...node, children: [...node.children, adjustedEndNode] }
    };
  }
  if (node.content) {
    if (node.content.length - endChar < limit) return { adjustedNode: node };
    return {
      adjustedNode: {
        ...node,
        content: truncateEnd(node.content, endChar, limit)
      }
    };
  }
};

export const maybeTruncate = ({ limit, node, endChar, startChar }) => {
  if (!startChar || startChar < limit) {
    return maybeTruncateEnd(node, endChar, limit);
  }
  return maybeTruncateStart(
    maybeTruncateEnd(node, endChar, limit).adjustedNode,
    startChar,
    limit
  );
};

/* Unused prior iterations. Can remove before merging.

const findNestedNode = (nodes, target) => {
  const result = nodes
    .map(n => {
      if (n.nodeUuid === target) return n;
      if (n.children) return findNestedNode(n.children, target).flat();
      return [];
    })
    .flat();
  return result;
};

const findTextNode = (nodes, target) => {
  return findNestedNode(nodes, target)[0];
};

const findParentNode = (node, childId) => {
  if (!node.children?.length) return [];
  const result = node.children
    .map(n => {
      if (n.nodeUuid === childId) return node;
      if (n.children) return findParentNode(n, childId).flat();
      return [];
    })
    .flat();
  return result;
};

const findParentOfElement = (node, element) => {
  if (isEqual(node, element)) return [element];
  if (!node.children?.length) return [];
  const result = node.children
    .map(n => {
      if (isEqual(n, element)) return node;
      if (n.children) return findParentOfElement(n, element).flat();
      return [];
    })
    .flat();
  return result;
};

const findAncestorNode = (bodyNode, startNode, endNode) => {
  if (typeof startNode === "string") {
    const startNodeParent = findParentNode(bodyNode, startNode)[0];
    const endNodeParent = findParentNode(bodyNode, endNode)[0];
    if (isEqual(startNodeParent, endNodeParent)) return startNodeParent;
    return findAncestorNode(bodyNode, startNodeParent, endNodeParent);
  }
  const startNodeParent = findParentOfElement(bodyNode, startNode)[0];
  const endNodeParent = findParentOfElement(bodyNode, endNode)[0];
  if (isEqual(startNodeParent, endNodeParent)) return startNodeParent;
  return findAncestorNode(bodyNode, startNodeParent, endNodeParent);
};

*/
