import React, { memo, useRef } from "react";
import { useParams } from "react-router-dom";
import nl2br from "nl2br";
import BodyNodes from "reader/components/section/body-nodes";
import Wrapper from "./Wrapper";
import { maybeTruncateChildren } from "./helpers";
import blacklist from "./elementBlacklist";
import { useFromStore } from "hooks";

function AnnotationWithNodes({ annotation, selection }) {
  const {
    annotationNode,
    startNode: startNodeId,
    endNode: endNodeId,
    startChar,
    endChar
  } = annotation?.attributes ?? {};

  const fallback = (
    <Wrapper>
      <div dangerouslySetInnerHTML={{ __html: nl2br(selection) }} />
    </Wrapper>
  );

  const { sectionId } = useParams();
  const bodyJSON = useFromStore(
    `entityStore.entities.textSections["${sectionId}"].attributes.bodyJSON`
  );

  const length = selection?.replace("\n", " ")?.length;
  /* eslint-disable no-nested-ternary */
  const contextCharLimit = length > 500 ? 25 : length > 200 ? 50 : 100;

  const textSplit = useRef(0);
  const setSplit = val => (textSplit.current = val);

  const haystack = annotationNode ?? bodyJSON;

  const subjectInSingleNode = startNodeId === endNodeId;

  const siftHaystack = () => {
    if (!haystack) return null;
    const adjustedStack = maybeTruncateChildren({
      node: haystack,
      target: startNodeId,
      startChar,
      limit: contextCharLimit,
      setSplit
    });
    if (!adjustedStack) return null;
    const finalStack = maybeTruncateChildren({
      node: adjustedStack,
      target: endNodeId,
      endChar: subjectInSingleNode ? endChar - textSplit.current : endChar,
      limit: contextCharLimit,
      fromStart: false
    });
    if (!finalStack) return null;
    return finalStack;
  };

  const finalStack = siftHaystack();
  const nodesToRender =
    finalStack?.children ?? finalStack?.content ? [finalStack] : undefined;

  const activeGroup = useFromStore(
    `ui.persistent.reader.readingGroups.currentAnnotatingReadingGroup`
  );
  const memberships = useFromStore(
    `entityStore.entities.readingGroupMemberships`
  );
  const membership =
    typeof memberships === "object"
      ? Object.keys(memberships)?.find(
          m => memberships[m].relationships.readingGroup.data.id === activeGroup
        )
      : null;
  const annotationStyle =
    memberships && membership
      ? memberships[membership]?.attributes?.annotationStyle
      : "solid";

  if (!annotation || !nodesToRender?.length) return fallback;

  const fragment = {
    nodeType: "element",
    tag: "div",
    children: nodesToRender
  };

  const adjustedEndChar =
    subjectInSingleNode && textSplit
      ? endChar - textSplit.current - 1
      : endChar;

  const iterator = new BodyNodes.Helpers.NodeTreeIterator({
    annotations: [
      {
        id: "detail",
        ...annotation,
        attributes: {
          currentUserIsCreator: true,
          annotationStyle,
          format: "annotation",
          ...annotation.attributes,
          startChar: textSplit ? startChar - textSplit.current - 1 : startChar,
          endChar: adjustedEndChar
        }
      }
    ],
    location: { hash: `` },
    isDetail: true
  });

  return <Wrapper>{iterator.visit(fragment, null, blacklist)}</Wrapper>;
}

const checkId = (prev, next) => {
  if (prev.annotation?.id === next.annotation?.id) return true;
  return false;
};

export default memo(AnnotationWithNodes, checkId);
