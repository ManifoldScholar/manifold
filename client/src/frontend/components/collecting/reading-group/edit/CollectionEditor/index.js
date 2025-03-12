import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, collectingAPI, requests } from "api";
import { entityStoreActions } from "actions";
import CategoryCreator from "./CategoryCreator";
import SortableCategories from "./SortableCategories";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import * as Styled from "./styles";

import withScreenReaderStatus from "hoc/withScreenReaderStatus";

const { request } = entityStoreActions;

function CollectionEditor({
  readingGroup,
  categories,
  responses,
  refresh,
  setScreenReaderStatus: announce
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const collection = getEntityCollection(readingGroup);

  const [newMarkdownBlock, setNewMarkdownBlock] = useState(null);

  function createCategory(attributes) {
    const call = readingGroupsAPI.createCategory(readingGroup.id, {
      attributes
    });
    const createRequest = request(call, requests.feReadingGroupCategoryCreate);
    dispatch(createRequest).promise.then(() => {
      setNewMarkdownBlock(attributes.markdownOnly ? attributes.title : null);
      refresh();
    });
  }

  function updateCategory(category) {
    const { id: categoryId, position } = category;
    const changes = { attributes: { position } };
    const call = readingGroupsAPI.updateCategory(
      readingGroup.id,
      categoryId,
      changes
    );
    const updateRequest = request(call, requests.feReadingGroupCategoryUpdate);
    dispatch(updateRequest).promise.then(() => refresh());
  }

  function removeCategory(category) {
    const call = readingGroupsAPI.destroyCategory(readingGroup.id, category.id);
    const destroyRequest = request(
      call,
      requests.feReadingGroupCategoryDestroy
    );
    dispatch(destroyRequest).promise.then(() => refresh());
  }

  function updateCollectable(collectable) {
    const call = collectingAPI.collect([collectable], readingGroup);
    const updateRequest = request(call, requests.feCollectCollectable);
    dispatch(updateRequest).promise.then(() => refresh());
  }

  function removeCollectable(collectable) {
    const call = collectingAPI.remove([collectable], readingGroup);
    const updateRequest = request(call, requests.feCollectCollectable);
    dispatch(updateRequest).promise.then(() => refresh());
  }

  function determineMovePosition(destinationId, type, direction) {
    if (direction === "down") return 1;
    const destinationCollectables =
      collection.attributes.categoryMappings[destinationId]?.[type];
    return destinationCollectables?.length + 1 || 1;
  }

  const validateTargetPosition = (targetPosition, direction) => {
    if (targetPosition === 0 || targetPosition > categories.length + 1)
      return targetPosition;

    const destination = categories.find(
      c => c.attributes.position === targetPosition
    );

    if (destination?.attributes.markdownOnly) {
      const next =
        direction === "down" ? targetPosition + 1 : targetPosition - 1;
      return validateTargetPosition(next, direction);
    }

    return targetPosition;
  };

  const handleCollectableMove = sourceId => ({ id, type, direction }) => {
    const sourcePosition =
      sourceId === "$uncategorized$"
        ? categories.length + 1
        : categories.find(c => c.id === sourceId)?.attributes.position;

    const initialTargetPosition =
      direction === "down" ? sourcePosition + 1 : sourcePosition - 1;

    const targetPosition = validateTargetPosition(
      initialTargetPosition,
      direction
    );

    if (targetPosition === 0) {
      announce(t("messages.cannot_move_up"));
      return;
    }

    if (targetPosition > categories.length + 1) {
      announce(t("messages.cannot_move_down"));
      return;
    }

    const destination = categories.find(
      c => c.attributes.position === targetPosition
    );

    const destinationId =
      targetPosition === categories.length + 1
        ? "$uncategorized$"
        : destination.id;

    const position = determineMovePosition(destinationId, type, direction);

    const updatedCollectable = {
      groupingId: destinationId,
      id,
      position,
      type
    };
    updateCollectable(updatedCollectable);
    announce(
      t("messages.item_moved_category", {
        category:
          destination?.attributes.title.plaintext || t("common.uncategorized")
      })
    );
  };

  const callbacks = {
    onCategoryEdit: refresh,
    onCategoryDrag: updateCategory,
    onCategoryRemove: removeCategory,
    onCollectableDrag: updateCollectable,
    onCollectableRemove: removeCollectable,
    onCollectableMove: handleCollectableMove
  };

  return (
    <Styled.Editor>
      <Styled.CategoryInputs>
        <CategoryCreator onSubmit={createCategory} />
        <CategoryCreator
          onSubmit={createCategory}
          count={categories?.length ?? 0}
          isMarkdown
        />
      </Styled.CategoryInputs>
      <SortableCategories
        collection={collection}
        categories={categories}
        responses={responses}
        callbacks={callbacks}
        groupId={readingGroup.id}
        newMarkdownBlock={newMarkdownBlock}
      />
    </Styled.Editor>
  );
}

CollectionEditor.displayName = "ReadingGroup.Collecting.CollectionEditor";

CollectionEditor.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  categories: PropTypes.array
};

export default withScreenReaderStatus(CollectionEditor);
