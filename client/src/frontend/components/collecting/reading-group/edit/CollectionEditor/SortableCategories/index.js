import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import useSortableCategories from "./useSortableCategories";
import Uncategorized from "./Uncategorized";
import CategoriesList from "./CategoriesList";
import * as Styled from "./styles";

function setCategoriesFromProps(collection) {
  const {
    attributes: { categories }
  } = collection;
  const sortedCategories = categories.map(cat => ({
    id: cat.id,
    position: cat.position
  }));
  return sortedCategories;
}

function setMappingsFromProps(collection) {
  const {
    attributes: { categoryMappings }
  } = collection;
  return { ...categoryMappings };
}

export default function SortableCategories({
  collection,
  responses,
  callbacks,
  ...listProps
}) {
  const [categories, setCategories] = useState(
    setCategoriesFromProps(collection)
  );
  const [mappings, setMappings] = useState(setMappingsFromProps(collection));

  useEffect(() => {
    setCategories(setCategoriesFromProps(collection));
  }, [JSON.stringify(collection)]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCategoryDrop = (result, sourceId) => {
    const priorPosition = categories.find(c => c.id === sourceId).position;
    const position = result.findIndex(c => c.id === sourceId) + 1;

    if (position === 0 || position === priorPosition) return;

    setCategories(result);
    callbacks.onCategoryDrag({
      id: sourceId,
      position
    });
  };

  const onCollectableDrop = (result, source) => {
    const {
      data: { type, id }
    } = source;
    if (!type || !id) return;

    const priorCategoryId = Object.keys(result).find(m =>
      mappings[m][type].includes(id)
    );
    const categoryId = Object.keys(result).find(m =>
      result[m][type].includes(id)
    );
    if (!categoryId) return;

    const priorPosition =
      mappings[priorCategoryId]?.[type].findIndex(c => c === id) + 1;
    const position = result[categoryId][type].findIndex(c => c === id) + 1;

    if (position === 0) return;

    if (priorCategoryId === categoryId && priorPosition === position) return;

    setMappings(result);
    callbacks.onCollectableDrag({
      groupingId: categoryId,
      id,
      position,
      type
    });
  };

  const { active, scrollableRef } = useSortableCategories(
    categories,
    onCategoryDrop,
    mappings,
    onCollectableDrop
  );

  return (
    <>
      <div ref={scrollableRef}>
        <Styled.Categories $active={active}>
          <CategoriesList
            categoryOrder={categories}
            mappings={mappings}
            responses={responses}
            callbacks={callbacks}
            {...listProps}
          />
        </Styled.Categories>
      </div>
      <Uncategorized
        mappings={mappings}
        responses={responses}
        callbacks={callbacks}
      />
    </>
  );
}

SortableCategories.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCategories";

SortableCategories.propTypes = {
  collection: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  callbacks: PropTypes.object.isRequired
};
