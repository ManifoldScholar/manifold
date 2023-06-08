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
    (!pending && !isDetail && !!textAnnotationIds.length) || removableHighlight;

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

  const interactiveAttributes =
    isInteractive && !hasInteractiveAncestor && !previous
      ? {
          tabIndex: 0,
          role: "button",
          "aria-haspopup": removableHighlight ? "menu" : "dialog",
          "aria-label": removableHighlight
            ? t("reader.actions.manage_highlight", {
                chunk: "mathematical content"
              })
            : t("reader.actions.view_annotations", {
                chunk: "mathematical content"
              })
        }
      : {};

  return {
    classes,
    removableHighlightId,
    textAnnotationIds,
    annotationIds,
    interactiveAttributes
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
