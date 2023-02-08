import React from "react";
import * as ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import {
  getAnnotationStyles,
  getlocalAnnotationsArray
} from "./annotationHelpers";
import { useTranslation } from "react-i18next";
import { uid } from "react-uid";

// const mergeTextChild = node => {
//   const textChild = node.children[0];
//   return {
//     ...node,
//     nodeUuid: textChild.nodeUuid,
//     textDigest: textChild.textDigest,
//     content: textChild.content,
//     children: null
//   };
// };
//
// const transformJSON = nodes => {
//   return nodes.map(node => {
//     if (!node.children) return node;
//
//     if (node.children.length === 1) {
//       const onlyChild = node.children[0];
//       if (onlyChild.nodeType === "text") {
//         return mergeTextChild(node);
//       }
//     }
//
//     return { ...node, children: transformJSON(node.children) };
//   });
// };

const createNode = n =>
  React.createElement(
    n.tag,
    {
      ...n.attributes,
      key: n.nodeUuid ?? uid(n),
      "data-node-uuid": n.nodeUuid,
      "data-text-digest": n.textDigest
    },
    n.content ? n.content : n.children.map(child => createNode(child))
  );

function MathNode({
  children,
  openAnnotations,
  uuids,
  hasInteractiveAncestor
}) {
  const { t } = useTranslation();

  const childNodes = children.map(child => createNode(child));

  const localAnnotations = getlocalAnnotationsArray(openAnnotations);
  const {
    classes,
    removableHighlightId,
    textAnnotationIds,
    annotationIds,
    interactiveAttributes
  } = getAnnotationStyles(localAnnotations, uuids, t, hasInteractiveAncestor);

  return (
    <math
      data-mathml="true"
      className={classes}
      data-removable-highlight-id={removableHighlightId}
      data-text-annotation-ids={textAnnotationIds}
      data-annotation-ids={annotationIds}
      {...interactiveAttributes}
    >
      {childNodes}
    </math>
  );
}

MathNode.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.array
};

export default MathNode;
