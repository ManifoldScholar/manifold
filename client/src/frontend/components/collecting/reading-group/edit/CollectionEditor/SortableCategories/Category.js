import React from "react";
import PropTypes from "prop-types";
import { CategoryHeader } from "./parts";
import {
  CollectedProjects,
  CollectedTexts,
  CollectedTextSections,
  CollectedResourceCollections,
  CollectedResources,
  CollectedJournalIssues
} from "./types";
import * as Styled from "./styles";

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
    if (!dragProps) return;
    const { provided } = dragProps;
    return {
      ...provided.draggableProps,
      ref: provided.innerRef,
      style: provided.draggableProps.style
    };
  }

  return (
    <Styled.Wrapper {...getWrapperProps()}>
      <Styled.Category $isDragging={dragProps?.snapshot.isDragging}>
        <CategoryHeader
          dragProps={dragProps}
          category={category}
          groupId={groupId}
          onCategoryEdit={callbacks.onCategoryEdit}
          onCategoryRemove={callbacks.onCategoryRemove}
        />
        <Styled.Inner>
          <CollectedProjects {...getCollectedProps("projects")} />
          <CollectedJournalIssues {...getCollectedProps("journalIssues")} />
          <CollectedTexts {...getCollectedProps("texts")} />
          <CollectedTextSections {...getCollectedProps("textSections")} />
          <CollectedResourceCollections
            {...getCollectedProps("resourceCollections")}
          />
          <CollectedResources {...getCollectedProps("resources")} />
        </Styled.Inner>
      </Styled.Category>
    </Styled.Wrapper>
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
