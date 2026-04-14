import { useId, createElement } from "react";
import PropTypes from "prop-types";
import {
  getAnnotationProps,
  formatLocalAnnotations
} from "../../helpers/annotation";
import { useTranslation } from "react-i18next";
import values from "lodash/values";
import { useErrorHandler } from "react-error-boundary";

const createNode = (n, index, baseId) => {
  const { style, ...attrs } = n.attributes ?? {};
  return createElement(
    n.tag,
    {
      ...attrs,
      key: n.nodeUuid ?? `${baseId}-node-${index}`,
      "data-node-uuid": n.nodeUuid,
      "data-text-digest": n.textDigest
    },
    n.content
      ? n.content
      : n.children?.map((child, i) => createNode(child, i, baseId))
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
  const baseId = useId();

  const childNodes = () => {
    try {
      return children.map((child, index) => createNode(child, index, baseId));
    } catch (e) {
      handleError();
    }
  };

  const { isDetail, ...annotations } = openAnnotations;
  const localAnnotations = formatLocalAnnotations(values(annotations));

  const highlightAriaLabel = t("reader.actions.manage_highlight", {
    chunk: "mathematical content"
  });
  const annotationAriaLabel = t("reader.actions.view_annotations", {
    chunk: "mathematical content"
  });

  const {
    classes,
    removableHighlightId,
    textAnnotationIds,
    annotationIds,
    interactiveAttributes,
    interactiveTag
  } = getAnnotationProps({
    annotations: localAnnotations,
    mathUuids: uuids,
    hasInteractiveAncestor,
    isDetail,
    highlightAriaLabel,
    annotationAriaLabel
  });

  /* eslint-disable no-nested-ternary */
  const Wrapper =
    interactiveTag ?? (attributes.display === "inline" ? "span" : "div");

  const wrapperStyles =
    attributes.display !== "inline"
      ? { display: "block", width: "max-content", maxWidth: "100%" }
      : {};

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
