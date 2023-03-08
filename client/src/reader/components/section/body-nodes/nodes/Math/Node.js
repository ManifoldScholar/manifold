import React from "react";
import * as ReactDOMServer from "react-dom/server";
import PropTypes from "prop-types";
import {
  getAnnotationStyles,
  getlocalAnnotationsArray
} from "./annotationHelpers";
import { useTranslation } from "react-i18next";
import { uid } from "react-uid";
import { useErrorHandler } from "react-error-boundary";

const createNode = n => {
  const { style, ...attrs } = n.attributes ?? {};
  return React.createElement(
    n.tag,
    {
      ...attrs,
      key: n.nodeUuid ?? uid(n),
      "data-node-uuid": n.nodeUuid,
      "data-text-digest": n.textDigest
    },
    n.content ? n.content : n.children?.map(child => createNode(child))
  );
};

function MathNode({
  attributes,
  children,
  openAnnotations,
  uuids,
  hasInteractiveAncestor
}) {
  const { t } = useTranslation();
  const handleError = useErrorHandler();

  const childNodes = () => {
    try {
      return children.map(child => createNode(child));
    } catch (e) {
      handleError();
    }
  };

  const { isDetail, ...annotations } = openAnnotations;
  const localAnnotations = getlocalAnnotationsArray(annotations);
  const {
    classes,
    removableHighlightId,
    textAnnotationIds,
    annotationIds,
    interactiveAttributes
  } = getAnnotationStyles(
    localAnnotations,
    uuids,
    t,
    hasInteractiveAncestor,
    isDetail
  );

  const Wrapper = attributes.display === "inline" ? "span" : "div";
  const wrapperStyles =
    Wrapper === "div" ? { width: "max-content", maxWidth: "100%" } : {};

  const { style, ...mathAttrs } = attributes ?? {};

  return (
    <Wrapper
      data-mathml="true"
      className={classes}
      style={wrapperStyles}
      data-removable-highlight-id={removableHighlightId}
      data-text-annotation-ids={textAnnotationIds}
      data-annotation-ids={annotationIds}
      {...interactiveAttributes}
    >
      <math {...mathAttrs}>{childNodes()}</math>
    </Wrapper>
  );
}

MathNode.propTypes = {
  attributes: PropTypes.object,
  children: PropTypes.array
};

export default MathNode;
