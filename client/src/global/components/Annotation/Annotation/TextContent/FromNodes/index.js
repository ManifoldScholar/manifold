import React, { memo } from "react";
import { useParams } from "react-router-dom";
import nl2br from "nl2br";
import BodyNodes from "reader/components/section/body-nodes";
import Wrapper from "./Wrapper";
import {
  findStartOrEndNode,
  findTextNode,
  findAncestorNode,
  maybeTruncate,
  deepCopyChildren
} from "./helpers";
import blacklist from "./elementBlacklist";
import { useFromStore } from "hooks";

function AnnotationWithNodes({ annotation, selection }) {
  const {
    annotationNode,
    startNode: startNodeId,
    endNode: endNodeId,
    startChar,
    endChar
  } = annotation.attributes;

  const fallback = (
    <Wrapper>
      <div dangerouslySetInnerHTML={{ __html: nl2br(selection) }} />
    </Wrapper>
  );

  const { sectionId } = useParams();
  const bodyJSON = useFromStore(
    `entityStore.entities.textSections["${sectionId}"].attributes.bodyJSON`
  );

  const toDeepCopy =
    annotationNode?.children ??
    findAncestorNode(bodyJSON, startNodeId, endNodeId)?.children ??
    [];
  const haystack = toDeepCopy.map(deepCopyChildren);

  const activeGroup = useFromStore(
    `ui.persistent.reader.readingGroups.currentAnnotatingReadingGroup`
  );
  const memberships = useFromStore(
    `entityStore.entities.readingGroupMemberships`
  );
  const membership = Object.keys(memberships)?.find(
    m => memberships[m].relationships.readingGroup.data.id === activeGroup
  );
  const annotationStyle =
    memberships[membership]?.attributes?.annotationStyle ?? "solid";

  if (!annotation || !haystack.length) return fallback;

  const contextCharLimit = selection.replace("\n", " ").length > 500 ? 50 : 100;

  if (startNodeId === endNodeId) {
    const node = findTextNode(haystack, startNodeId);
    if (!node) return fallback;
    const { adjustedNode, split } = maybeTruncate(
      node,
      startChar,
      endChar,
      contextCharLimit
    );

    const iterator = new BodyNodes.Helpers.NodeTreeIterator({
      annotations: [
        {
          id: "selection",
          ...annotation,
          attributes: {
            userIsCreator: true,
            annotationStyle,
            format: "annotation",
            ...annotation.attributes,
            startChar: split ? startChar - split - 1 : startChar,
            endChar: split ? endChar - split - 1 : endChar
          }
        }
      ],
      location: { hash: `` },
      isDetail: true
    });

    return <Wrapper>{iterator.visit(adjustedNode, null, blacklist)}</Wrapper>;
  }

  const [startNodeIndex, startNode] = findStartOrEndNode(haystack, startNodeId);
  if (!startNode) return fallback;
  const [endNodeIndex, endNode] = findStartOrEndNode(
    haystack,
    endNodeId,
    false
  );
  if (!endNode) return fallback;
  const middleNodes = haystack.slice(startNodeIndex + 1, endNodeIndex);

  const { adjustedNode: adjustedStartNode, split } = maybeTruncate(
    startNode,
    startChar,
    null,
    contextCharLimit
  );
  const { adjustedNode: adjustedEndNode } = maybeTruncate(
    endNode,
    null,
    endChar,
    contextCharLimit
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
          annotationStyle,
          format: "annotation",
          ...annotation.attributes,
          startChar: split ? startChar - split - 1 : startChar,
          endChar
        }
      }
    ],
    location: { hash: `` },
    isDetail: true
  });

  return <Wrapper>{iterator.visit(fragment, null, blacklist)}</Wrapper>;
}

const checkId = (prev, next) => {
  if (prev.annotation.id === next.annotation.id) return true;
  return false;
};

export default memo(AnnotationWithNodes, checkId);
