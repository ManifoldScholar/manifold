import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CategoryHeader } from "./parts";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources
} from "./types";

function Category({
  groupId,
  category,
  mappings,
  responses,
  callbacks,
  activeType,
  dragProps
}) {
  const categoryMapping = mappings[category?.id] || null;

  function getCollectedIdsByType(type) {
    if (!categoryMapping || !categoryMapping[type]) return [];
    return categoryMapping[type];
  }

  function getResponsesByType(type) {
    if (!responses || !responses[type]) return [];
    return responses[type];
  }

  function getCollectedProps(type) {
    return {
      categoryId: category?.id || "",
      collectedIds: getCollectedIdsByType(type),
      responses: getResponsesByType(type),
      onRemove: callbacks.onCollectableRemove,
      onMove: callbacks.onCollectableMove,
      showDropzone: activeType === type
    };
  }

  function getWrapperProps() {
    const className = "group-collection-editor__category-wrapper";
    if (!dragProps) return { className };
    const { provided } = dragProps;
    return {
      ...provided.draggableProps,
      ref: provided.innerRef,
      style: provided.draggableProps.style,
      className
    };
  }

  function getBlockClassName() {
    return classNames({
      "group-collection-editor__category": true,
      "group-collection-editor__category--is-dragging":
        dragProps?.snapshot.isDragging
    });
  }

  return (
    <div {...getWrapperProps()}>
      <article className={getBlockClassName()}>
        <CategoryHeader
          dragProps={dragProps}
          category={category}
          groupId={groupId}
          onCategoryEdit={callbacks.onCategoryEdit}
          onCategoryRemove={callbacks.onCategoryRemove}
        />
        <div className="group-collection-editor__category-inner">
          <CollectedProjects {...getCollectedProps("projects")} />
          <CollectedTexts {...getCollectedProps("texts")} />
          <CollectedTextSections {...getCollectedProps("textSections")} />
          <CollectedResourceCollections
            {...getCollectedProps("resourceCollections")}
          />
          <CollectedResources {...getCollectedProps("resources")} />
        </div>
      </article>
    </div>
  );
}

Category.displayName = "ReadingGroup.Collecting.CollectionEditor.Category";

export const categoryShape = {
  category: PropTypes.object.isRequired,
  mappings: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  callbacks: PropTypes.object.isRequired,
  activeType: PropTypes.string,
  groupId: PropTypes.string
};

Category.propTypes = {
  ...categoryShape,
  dragProps: PropTypes.shape({
    provided: PropTypes.object.isRequired,
    snapshot: PropTypes.object.isRequired
  })
};

export default Category;
