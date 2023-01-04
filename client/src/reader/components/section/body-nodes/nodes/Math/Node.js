import React from "react";
import * as ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import { MathJax } from "better-react-mathjax";

const mergeTextChild = node => {
  const textChild = node.children[0];
  return {
    ...node,
    nodeUuid: textChild.nodeUuid,
    textDigest: textChild.textDigest,
    content: textChild.content,
    children: null
  };
};

const transformJSON = nodes => {
  return nodes.map(node => {
    if (!node.children) return node;

    if (node.children.length === 1) {
      const onlyChild = node.children[0];
      if (onlyChild.nodeType === "text") {
        return mergeTextChild(node);
      }
    }

    return { ...node, children: transformJSON(node.children) };
  });
};

const createNode = n =>
  React.createElement(
    n.tag,
    {
      ...n.attributes,
      "data-node-uuid": n.nodeUuid,
      "data-text-digest": n.textDigest
    },
    n.content ? n.content : n.children.map(child => createNode(child))
  );

function MathNode({ attributes, children }) {
  const { xmlns, ...rest } = attributes;

  const transformedChildren = Array.isArray(children)
    ? transformJSON(children)
    : null;

  const childNodes = transformedChildren.map(child => createNode(child));

  return (
    <MathJax {...rest}>
      <math xmlns={xmlns}>{childNodes}</math>
    </MathJax>
  );
}

MathNode.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.array
};

export default MathNode;
