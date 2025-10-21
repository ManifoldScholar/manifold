import classNames from "classnames";

export const formatLocalAnnotations = (annotations, uuid) =>
  annotations.map(a => {
    const id = a.id;
    const type = a.attributes.format;
    const isCreator =
      a.id === "selection" ? true : a.attributes.currentUserIsCreator;
    const start =
      a.attributes.startNode === uuid ? a.attributes.startChar : null;
    const end = a.attributes.endNode === uuid ? a.attributes.endChar : null;
    const {
      startNode,
      endNode,
      resourceId,
      resourceCollectionId,
      authorCreated,
      abilities,
      annotationStyle,
      readerDisplayFormat
    } = a.attributes;
    return {
      id,
      type,
      annotationStyle,
      isCreator,
      start,
      end,
      startNode,
      endNode,
      resourceId,
      resourceCollectionId,
      authorCreated,
      abilities,
      readerDisplayFormat
    };
  });

const getResourceAnnotationClasses = (notations, uuids) => {
  if (!notations?.length) return {};

  if (Array.isArray(uuids)) {
    const start = notations.some(n => uuids.includes(n.startNode));
    const end = notations.some(n => uuids.includes(n.endNode));
    return {
      "annotation-resource": true,
      "annotation-resource-start": start,
      "annotation-resource-end": end
    };
  }

  const start = notations.find(n => uuids === n.startNode);
  const end = notations.find(n => uuids === n.endNode);
  return {
    "annotation-resource": true,
    "annotation-resource-start": start,
    "annotation-resource-end": end
  };
};

const ariaLabelForAnnotations = (chunk, annotated, highlighted, t) => {
  if (annotated && highlighted)
    return t("reader.annotation_highlight_aria_label", { chunk });

  if (highlighted) return t("reader.highlight_aria_label", { chunk });

  return t("reader.annotation_aria_label", { chunk });
};

export const getAnnotationProps = ({
  annotations,
  nodeUuid,
  mathUuids,
  hasInteractiveAncestor,
  isDetail,
  chunk,
  t
}) => {
  const highlighted = annotations.some(a => a.type === "highlight");
  const underlined = annotations.some(a => a.type === "annotation");
  const wavy = annotations.some(a => a.annotationStyle === "wavy");
  const dots = annotations.some(a => a.annotationStyle === "dots");
  const dashes = annotations.some(a => a.annotationStyle === "dashes");
  const solid = annotations.some(a => a.annotationStyle === "solid");
  const pending = annotations.some(a => a.annotationStyle === "pending");
  const previous =
    annotations.length === 1 && annotations.some(a => a.type === "previous"); // don't style as previous if node has multiple annotations
  const isCreator = annotations.some(a => a.isCreator);
  const authorCreated = annotations.some(a => a.authorCreated);
  const lockedSelection = annotations.some(
    a => a.id === "selection" && a.type !== "previous"
  );
  const notations = annotations.filter(
    a => a.type === "resource" || a.type === "resource_collection"
  );

  const annotationIds = annotations.map(a => a.id);

  const textAnnotationIds = annotations
    .filter(a => a.type === "annotation")
    .map(a => a.id);

  const removableHighlight = annotations.filter(
    a => a.type === "highlight" && (a.isCreator || a.abilities.delete)
  )[0];
  const removableHighlightId = removableHighlight
    ? removableHighlight.id
    : null;
  const isInteractive =
    (!pending && !isDetail && !!textAnnotationIds.length) || removableHighlight;

  const resourceAnnotationClasses = getResourceAnnotationClasses(
    notations,
    nodeUuid ?? mathUuids
  );

  const classes = classNames({
    primary: isCreator,
    secondary: !isCreator,
    tertiary: !isCreator && authorCreated,
    inert: isDetail,
    "annotation-locked-selected primary": lockedSelection,
    "annotation-underline": underlined,
    "annotation-highlight": highlighted,
    "annotation-wavy": wavy,
    "annotation-dashes": dashes,
    "annotation-dots": dots,
    "annotation-solid": solid,
    ...resourceAnnotationClasses,
    pending,
    previous
  });

  const interactiveAttributes =
    isInteractive && !hasInteractiveAncestor && !previous
      ? {
          href: textAnnotationIds.length
            ? `#annotation-${textAnnotationIds[0]}`
            : undefined,
          role: removableHighlight ? "button" : undefined,
          /* eslint-disable-next-line no-nested-ternary */
          tabIndex: removableHighlight ? 0 : previous ? -1 : undefined,
          "aria-haspopup": removableHighlight ? "menu" : undefined,
          "aria-label": ariaLabelForAnnotations(
            chunk,
            !!textAnnotationIds.length,
            highlighted,
            t
          )
        }
      : {};

  /* eslint-disable-next-line no-nested-ternary */
  const interactiveTag = interactiveAttributes.href
    ? "a"
    : textAnnotationIds?.length > 0
    ? "mark"
    : null;

  return {
    classes,
    removableHighlightId,
    textAnnotationIds,
    annotationIds,
    interactiveAttributes,
    interactiveTag
  };
};

export const getUuids = nodes => {
  return nodes
    .map(node => {
      if (node.nodeUuid) {
        return node.nodeUuid;
      }
      if (node.children) {
        return getUuids(node.children);
      }
      return null;
    })
    .flat(50)
    .filter(Boolean);
};
