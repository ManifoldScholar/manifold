import React, { useState } from "react";
import PropTypes from "prop-types";
import useSortableCategories from "./useSortableCategories";
import useAccessibleSort from "./useAccessibleSort";
import Uncategorized from "./Uncategorized";
import Category from "./Category";
import * as Styled from "./styles";

function setCategoriesFromProps(collection, categoriesData) {
  const {
    attributes: { categories }
  } = collection;
  const sortedCategories = categories.map(cat => {
    const {
      attributes: { markdownOnly, titlePlaintext }
    } = categoriesData?.find(c => cat.id === c.id) ?? { attributes: {} };
    return {
      id: cat.id,
      position: cat.position,
      markdownOnly,
      title: titlePlaintext
    };
  });
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
  categories: categoriesData,
  responses,
  callbacks,
  ...listProps
}) {
  const [categories, setCategories] = useState(
    setCategoriesFromProps(collection, categoriesData)
  );
  const [mappings, setMappings] = useState(setMappingsFromProps(collection));

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
      mappings[m]?.[type]?.includes(id)
    );
    const categoryId = Object.keys(result).find(m =>
      result[m]?.[type]?.includes(id)
    );
    if (!categoryId) return;

    const priorPosition =
      mappings[priorCategoryId]?.[type]?.findIndex(c => c === id) + 1;
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

  const { onCollectableMove } = useAccessibleSort(
    categories,
    mappings,
    onCollectableDrop
  );

  return (
    <Styled.Container ref={scrollableRef}>
      <Styled.Categories $active={active}>
        {categories.map((c, index) => {
          const category = categoriesData.find(cat => cat.id === c.id);
          return (
            <Category
              key={c.id}
              id={c.id}
              index={index}
              category={category}
              mappings={mappings}
              responses={responses}
              callbacks={{ ...callbacks, onCollectableMove }}
              {...listProps}
            />
          );
        })}
      </Styled.Categories>
      <Uncategorized
        mappings={mappings}
        responses={responses}
        callbacks={{ ...callbacks, onCollectableMove }}
      />
    </Styled.Container>
  );
}

SortableCategories.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCategories";

SortableCategories.propTypes = {
  collection: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  callbacks: PropTypes.object.isRequired
};
