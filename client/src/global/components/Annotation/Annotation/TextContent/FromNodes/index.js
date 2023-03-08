import React, { memo } from "react";
import { useParams } from "react-router-dom";
import BodyNodes from "reader/components/section/body-nodes";
import Collapse from "global/components/Collapse";
import {
  findStartOrEndNode,
  findTextNode,
  findAncestorNode,
  maybeTruncate,
  deepCopyChildren
} from "./helpers";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

function AnnotationWithNodes({ annotation }) {
  const {
    annotationNode,
    startNode: startNodeId,
    endNode: endNodeId,
    startChar,
    endChar
  } = annotation.attributes;

  const { sectionId } = useParams();
  const bodyJSON = useFromStore(
    `entityStore.entities.textSections["${sectionId}"].attributes.bodyJSON`
  );

  const toDeepCopy =
    annotationNode?.children ??
    findAncestorNode(bodyJSON, startNodeId, endNodeId)?.children ??
    [];
  const haystack = toDeepCopy.map(deepCopyChildren);

  if (!annotation || !haystack.length) return null;

  if (startNodeId === endNodeId) {
    const node = findTextNode(haystack, startNodeId);
    if (!node) return null;
    const { adjustedNode, split } = maybeTruncate(node, startChar, endChar);

    const iterator = new BodyNodes.Helpers.NodeTreeIterator({
      annotations: [
        {
          id: "selection",
          ...annotation,
          attributes: {
            userIsCreator: true,
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

  const [startNodeIndex, startNode] = findStartOrEndNode(haystack, startNodeId);
  if (!startNode) return null;
  const [endNodeIndex, endNode] = findStartOrEndNode(
    haystack,
    endNodeId,
    false
  );
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
        id: "selection",
        ...annotation,
        attributes: {
          userIsCreator: true,
          ...annotation.attributes,
          startChar: split ? startChar - split - 1 : startChar,
          endChar
        }
      }
    ],
    location: { hash: `` },
    inert: true
  });

  return (
    <Collapse>
      <Styled.Toggle>
        <Styled.Content stubHeight={200}>
          {iterator.visit(fragment)}
          <Styled.Overlay />
        </Styled.Content>
      </Styled.Toggle>
    </Collapse>
  );
}

const checkId = (prev, next) => {
  if (prev.annotation.id === next.annotation.id) return true;
  return false;
};

export default memo(AnnotationWithNodes, checkId);
