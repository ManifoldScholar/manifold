const findNestedMatchIndex = (nodes, target) => {
  return nodes.findIndex(n => {
    return (
      n.nodeUuid === target ||
      (n.children && findNestedMatchIndex(n.children, target) >= 0)
    );
  });
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

const maybeTruncateStart = ({ node, startChar, limit }) => {
  if (!startChar || startChar < limit) return { adjustedNode: node };
  const { content, split } = truncateStart(node.content, startChar, limit);
  return { adjustedNode: { ...node, content }, split };
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

const maybeTruncateEnd = ({ node, endChar, limit }) => {
  if (!endChar) return { adjustedNode: node };
  if (node.content.length - endChar < limit) return { adjustedNode: node };
  return {
    adjustedNode: {
      ...node,
      content: truncateEnd(node.content, endChar, limit)
    }
  };
};

const maybeTruncateText = ({ fromStart, setSplit, target, node, ...args }) => {
  const isTargetNode = node.nodeUuid === target;
  const hasTargetNodeChild = node.children?.[0].nodeUuid === target;

  if (!isTargetNode && !hasTargetNodeChild) return node;

  const nodeToTruncate = isTargetNode ? node : node.children[0];

  let truncatedNode;
  if (fromStart) {
    const { split, adjustedNode } = maybeTruncateStart({
      node: nodeToTruncate,
      ...args
    });
    if (split) setSplit(split);
    truncatedNode = adjustedNode;
  } else {
    const { adjustedNode } = maybeTruncateEnd({
      node: nodeToTruncate,
      ...args
    });
    truncatedNode = adjustedNode;
  }

  return isTargetNode ? truncatedNode : { ...node, children: [truncatedNode] };
};

export const maybeTruncateChildren = ({
  node,
  target,
  fromStart = true,
  ...args
}) => {
  if (node.tag === "table") {
    return node;
  }
  if (!node.children) {
    return maybeTruncateText({
      node,
      target,
      fromStart,
      ...args
    });
  }

  const index = findNestedMatchIndex(node.children, target);
  const adjustedChild = maybeTruncateChildren({
    node: node.children[index],
    target,
    fromStart,
    ...args
  });
  if (fromStart)
    return {
      ...node,
      children: [adjustedChild, ...node.children.slice(index + 1)]
    };
  return {
    ...node,
    children: [...node.children.slice(0, index), adjustedChild]
  };
};
