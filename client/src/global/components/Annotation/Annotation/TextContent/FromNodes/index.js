import React, { memo } from "react";
import BodyNodes from "reader/components/section/body-nodes";
import { findTargetNode, maybeTruncate } from "./helpers";
import { useFromStore } from "hooks";

function AnnotationWithNodes({ annotation }) {
  const {
    startNode: startNodeId,
    endNode: endNodeId,
    startChar,
    endChar
  } = annotation.attributes;

  const annotationNode = useFromStore(
    `entityStore.entities.annotations["${annotation.id}"].attributes.annotationNode`
  );

  const haystack = annotationNode.children;

  if (!annotation) return null;

  if (startNodeId === endNodeId) {
    const [, node] = findTargetNode(haystack, startNodeId);
    if (!node) return null;
    const { adjustedNode, split } = maybeTruncate(node, startChar, endChar);

    const iterator = new BodyNodes.Helpers.NodeTreeIterator({
      annotations: [
        {
          ...annotation,
          attributes: {
            ...annotation.attributes,
            startChar: split ? startChar - split - 1 : startChar,
            endChar: split ? endChar - split - 1 : endChar
          }
        }
      ],
      location: { hash: `` },
      inert: true
    });

    return iterator.visit(adjustedNode);
  }

  const [startNodeIndex, startNode] = findTargetNode(haystack, startNodeId);
  if (!startNode) return null;
  const [endNodeIndex, endNode] = findTargetNode(haystack, endNodeId, false);
  if (!endNode) return null;
  const middleNodes = haystack.slice(startNodeIndex + 1, endNodeIndex);

  const { adjustedNode: adjustedStartNode, split } = maybeTruncate(
    startNode,
    startChar
  );
  const { adjustedNode: adjustedEndNode } = maybeTruncate(
    endNode,
    null,
    endChar
  );

  const fragment = {
    nodeType: "element",
    tag: "div",
    children: [adjustedStartNode, ...middleNodes, adjustedEndNode]
  };

  const iterator = new BodyNodes.Helpers.NodeTreeIterator({
    annotations: [
      {
        ...annotation,
        attributes: {
          ...annotation.attributes,
          startChar: split ? startChar - split - 1 : startChar,
          endChar
        }
      }
    ],
    location: { hash: `` },
    inert: true
  });

  return iterator.visit(fragment);
}

const checkId = (prev, next) => {
  if (prev.annotation.id === next.annotation.id) return true;
  return false;
};

export default memo(AnnotationWithNodes, checkId);
