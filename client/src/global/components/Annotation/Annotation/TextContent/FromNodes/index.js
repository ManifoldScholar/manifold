import React, { memo, useMemo } from "react";
import { useParams } from "react-router-dom";
import nl2br from "nl2br";
import BodyNodes from "reader/components/section/body-nodes";
import Wrapper from "./Wrapper";
import { shrinkHaystack, maybeTruncate, deepCopy } from "./helpers";
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

  const haystack = useMemo(() => deepCopy(annotationNode ?? bodyJSON), [
    annotationNode,
    bodyJSON
  ]);
  const nodesToRender = useMemo(
    () => shrinkHaystack(haystack, startNodeId, endNodeId)?.children,
    [haystack, endNodeId, startNodeId]
  );

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

  if (!nodesToRender?.length) return fallback;

  const contextCharLimit = selection.replace("\n", " ").length > 500 ? 50 : 100;

  if (startNodeId === endNodeId) {
    const [textNode] = nodesToRender;
    const { adjustedNode, split } = maybeTruncate({
      node: textNode,
      startChar,
      endChar,
      limit: contextCharLimit
    });

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

  const startNode = nodesToRender.shift();
  const endNode = nodesToRender.pop();

  const { adjustedNode: adjustedStartNode, split } = maybeTruncate({
    node: startNode,
    startChar,
    limit: contextCharLimit
  });
  const { adjustedNode: adjustedEndNode } = maybeTruncate({
    node: endNode,
    endChar,
    limit: contextCharLimit
  });

  const fragment = {
    nodeType: "element",
    tag: "div",
    children: [adjustedStartNode, ...nodesToRender, adjustedEndNode]
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
