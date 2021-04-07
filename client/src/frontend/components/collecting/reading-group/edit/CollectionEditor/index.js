import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { readingGroupsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import CategoryCreator from "./CategoryCreator";
import SortableCategories from "./SortableCategories";
import CategoriesList from "./SortableCategories/CategoriesList";
import {
  getEntityCollection,
  getCollectionCategories,
  getSortableCategories,
  getMappingsForCollectionCategory
} from "frontend/components/collecting/helpers";
import { reorderCategories } from "./helpers/resolvers";

const { request } = entityStoreActions;

function CollectionEditor({ readingGroup, responses, refresh }) {
  const dispatch = useDispatch();

  const collection = getEntityCollection(readingGroup);
  const categories = getCollectionCategories(collection);
  const uncategorizedMappings = getMappingsForCollectionCategory(
    collection,
    "$uncategorized$"
  );

  const hasPopulatedCategories = categories?.length > 0;
  const hasUncategorized = !!uncategorizedMappings;

  function createCategory(attributes) {
    const call = readingGroupsAPI.createCategory(readingGroup.id, {
      attributes
    });
    const createRequest = request(
      call,
      requests.feReadingGroupCollectionCategoryCreate
    );
    dispatch(createRequest).promise.then(() => refresh());
  }

  function updateCategory(category) {
    const call = readingGroupsAPI.updateCategory(readingGroup.id, category.id, {
      attributes: category.attributes
    });
    const updateRequest = request(
      call,
      requests.feReadingGroupCollectionCategoryUpdate
    );
    dispatch(updateRequest).promise.then(() => refresh());
  }

  function updateCollectable(category, collectable) {}

  function removeCategory(category) {
    const call = readingGroupsAPI.destroyCategory(readingGroup.id, category.id);
    const destroyRequest = request(
      call,
      requests.feReadingGroupCollectionCategoryDestroy
    );
    dispatch(destroyRequest).promise.then(() => refresh());
  }

  function updateCollection() {}

  function removeCollectable() {}

  return (
    <div className="collection-category-builder">
      <CategoryCreator onSubmit={createCategory} />
      {hasPopulatedCategories && (
        <SortableCategories
          collection={collection}
          onUpdateCollection={updateCollection}
        >
          {(sorted, activeType) => (
            <CategoriesList
              collection={collection}
              categoryOrder={sorted}
              responses={responses}
              onCollectableRemove={removeCollectable}
              activeType={activeType}
            />
          )}
        </SortableCategories>
      )}
    </div>
  );
}

CollectionEditor.displayName = "ReadingGroup.Collecting.CollectionEditor";

CollectionEditor.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired
};

export default CollectionEditor;
