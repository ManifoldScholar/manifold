import { memo, useRef } from "react";
import BodyNodes from "reader/components/section/body-nodes";
import Wrapper from "./Wrapper";
import { maybeTruncateChildren } from "./helpers";
import blacklist from "./elementBlacklist";
import { useLoaderEntity, useReadingGroups } from "hooks";
import { nl2br } from "utils/string";
import isEmpty from "lodash/isEmpty";

function AnnotationWithNodes({
  annotation,
  selection,
  overlayLight,
  expandable = true
}) {
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

  const section = useLoaderEntity("textSections");
  const bodyJSON = section?.attributes?.bodyJSON ?? null;

  const length = selection?.replace("\n", " ")?.length;
  /* eslint-disable no-nested-ternary */
  const contextCharLimit = length > 500 ? 25 : length > 200 ? 50 : 100;

  const textSplit = useRef(0);
  const setSplit = val => (textSplit.current = val);

  const haystack = annotationNode ?? bodyJSON;

  const subjectInSingleNode = startNodeId === endNodeId;

  const siftHaystack = () => {
    if (!haystack || isEmpty(haystack)) return null;
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

  const { currentAnnotationStyle: annotationStyle } = useReadingGroups();

  if (!annotation || !nodesToRender?.length) return fallback;

  const fragment = {
    nodeType: "element",
    tag: "div",
    children: nodesToRender
  };

  const adjustedEndChar =
    subjectInSingleNode && textSplit.current
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
          startChar: textSplit.current
            ? startChar - textSplit.current - 1
            : startChar,
          endChar: adjustedEndChar
        }
      }
    ],
    location: { hash: `` },
    isDetail: true
  });

  return expandable ? (
    <Wrapper overlayLight={overlayLight}>
      {iterator.visit(fragment, null, blacklist)}
    </Wrapper>
  ) : (
    iterator.visit(fragment, null, blacklist)
  );
}

const checkId = (prev, next) => {
  if (prev.annotation?.id === next.annotation?.id) return true;
  return false;
};

export default memo(AnnotationWithNodes, checkId);
