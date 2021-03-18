import React from "react";
import PropTypes from "prop-types";
import { readingGroupsAPI, collectingAPI, requests } from "api";
import { entityStoreActions } from "actions";
import CategoryCreator from "./CategoryCreator";
import SortableCategories from "./SortableCategories";
import CategoriesList from "./SortableCategories/CategoriesList";
import { getEntityCollection } from "frontend/components/collecting/helpers";

const { request } = entityStoreActions;

function CollectionEditor({
  readingGroup,
  categories,
  responses,
  refresh,
  dispatch
}) {
  const collection = getEntityCollection(readingGroup);

  function createCategory(attributes) {
    const call = readingGroupsAPI.createCategory(readingGroup.id, {
      attributes
    });
    const createRequest = request(call, requests.feReadingGroupCategoryCreate);
    dispatch(createRequest).promise.then(() => refresh());
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
    onCategoryUpdate: updateCategory,
    onCategoryRemove: removeCategory,
    onCollectableUpdate: updateCollectable,
    onCollectableRemove: removeCollectable
  };

  return (
    <div className="group-collection-editor">
      <CategoryCreator onSubmit={createCategory} />
      <SortableCategories
        collection={collection}
        responses={responses}
        callbacks={callbacks}
      >
        {(categoryOrder, mappings, activeType) => (
          <CategoriesList
            groupId={readingGroup.id}
            categories={categories}
            categoryOrder={categoryOrder}
            mappings={mappings}
            responses={responses}
            callbacks={callbacks}
            activeType={activeType}
          />
        )}
      </SortableCategories>
    </div>
  );
}

CollectionEditor.displayName = "ReadingGroup.Collecting.CollectionEditor";

CollectionEditor.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
};

export default CollectionEditor;
