import values from "lodash/values";
import classNames from "classnames";

export const getlocalAnnotationsArray = annotations => {
  return values(annotations).map(a => {
    const id = a.id;
    const type = a.attributes.format;
    const isCreator =
      a.id === "selection" ? true : a.attributes.currentUserIsCreator;
    const {
      startNode,
      endNode,
      resourceId,
      resourceCollectionId,
      authorCreated,
      abilities,
      annotationStyle
    } = a.attributes;
    return {
      id,
      type,
      annotationStyle,
      isCreator,
      startNode,
      endNode,
      resourceId,
      resourceCollectionId,
      authorCreated,
      abilities
    };
  });
};

export const getAnnotationStyles = (
  annotations,
  uuids,
  t,
  hasInteractiveAncestor,
  isDetail
) => {
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
  const start = annotations.some(
    a =>
      uuids.includes(a.startNode) &&
      (a.type === "resource" || a.type === "resource_collection")
  );
  const end = annotations.some(
    a =>
      uuids.includes(a.endNode) &&
      (a.type === "resource" || a.type === "resource_collection")
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
    removableHighlight || (!pending && !isDetail && !!textAnnotationIds.length);

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
    "annotation-resource": notations.length > 0,
    "annotation-resource-start": notations && start,
    "annotation-resource-end": notations && end,
    pending,
    previous
  });

  const ariaLabel = () => {
    if (!!textAnnotationIds.length && highlighted)
      return this.props.t("reader.annotation_highlight_aria_label", {
        chunk: "mathematical content"
      });

    if (highlighted)
      return this.props.t("reader.highlight_aria_label", {
        chunk: "mathematical content"
      });

    return this.props.t("reader.annotation_aria_label", {
      chunk: "mathematical content"
    });
  };

  const interactiveAttributes =
    isInteractive && !hasInteractiveAncestor && !previous
      ? {
          href: textAnnotationIds.length
            ? `#annotation-${textAnnotationIds[0]}`
            : undefined,
          "aria-haspopup": removableHighlight ? "menu" : undefined,
          "aria-label": ariaLabel()
        }
      : {};

  /* eslint-disable-next-line no-nested-ternary */
  const tag = interactiveAttributes.href
    ? "a"
    : removableHighlightId && removableHighlightId !== "selection"
    ? "button"
    : null;

  return {
    classes,
    removableHighlightId,
    textAnnotationIds,
    annotationIds,
    interactiveAttributes,
    interactiveTag: tag
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
    .filter(Boolean)
    .flat(50);
};
