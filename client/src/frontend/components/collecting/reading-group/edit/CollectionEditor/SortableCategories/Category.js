import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";
import IconComposer from "global/components/utility/IconComposer";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources
} from "./types";

function Category({
  id,
  index,
  categoryMapping,
  category,
  responses,
  onCollectableRemove,
  activeType
}) {
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
      categoryId: id,
      collectedIds: getCollectedIdsByType(type),
      responses: getResponsesByType(type),
      onRemove: onCollectableRemove,
      showDropzone: activeType === type.toUpperCase()
    };
  }

  const blockClassName = snapshot => {
    return classNames({
      "collection-category-builder__category": true,
      "collection-category-builder__category--is-dragging": snapshot.isDragging
    });
  };

  const { title } = category;

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={provided.draggableProps.style}
          className="collection-category-builder__category-wrapper"
        >
          <article className={blockClassName(snapshot)}>
            <header className="collection-category-builder__block collection-category-builder__block--category">
              <h3 className="collection-category-builder__label collection-category-builder__label--category">
                {title.plaintext}
              </h3>
              <div className="collection-category-builder__actions">
                <div className="collection-category-builder__action">
                  <IconComposer icon="annotate32" size="default" />
                  <span className="screen-reader-text">Edit category</span>
                </div>
                <div
                  {...provided.dragHandleProps}
                  className="collection-category-builder__action"
                >
                  <IconComposer icon="grabber32" size="default" />
                </div>
              </div>
            </header>
            <div className="collection-category-builder__category-inner">
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
      )}
    </Draggable>
  );
}

Category.displayName = "ReadingGroup.Collecting.CollectionEditor.Category";

Category.propTypes = {
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  responses: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  categoryMapping: PropTypes.object,
  onCollectableRemove: PropTypes.func.isRequired,
  activeType: PropTypes.string
};

export default Category;
