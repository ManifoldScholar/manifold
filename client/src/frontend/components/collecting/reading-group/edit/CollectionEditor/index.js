import React, { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, collectingAPI, requests } from "api";
import { entityStoreActions } from "actions";
import CategoryCreator from "./CategoryCreator";
import SortableCategories from "./SortableCategories";
import { getEntityCollection } from "frontend/components/collecting/helpers";
import * as Styled from "./styles";

const { request } = entityStoreActions;

export default function CollectionEditor({
  readingGroup,
  categories,
  responses,
  refresh
}) {
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

  const callbacks = {
    onCategoryEdit: refresh,
    onCategoryDrag: updateCategory,
    onCategoryRemove: removeCategory,
    onCollectableDrag: updateCollectable,
    onCollectableRemove: removeCollectable
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
      {categories && (
        <SortableCategories
          collection={collection}
          categories={categories}
          responses={responses}
          callbacks={callbacks}
          groupId={readingGroup.id}
          newMarkdownBlock={newMarkdownBlock}
        />
      )}
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
