import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import useSortableCategories from "./useSortableCategories";
import useAccessibleSort from "./useAccessibleSort";
import Uncategorized from "./Uncategorized";
import Category from "./Category";
import { highlightDroppedEl, highlightNewEl } from "../helpers/dnd";
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
  const prevCategories = useRef(categories);
  const prevCatsFromProps = useRef(
    setCategoriesFromProps(collection, categoriesData)
  );
  const [mappings, setMappings] = useState(setMappingsFromProps(collection));
  const prevMappings = useRef(mappings);
  const prevMapsFromProps = useRef(setMappingsFromProps(collection));

  useEffect(() => {
    const update = setCategoriesFromProps(collection, categoriesData);
    if (!isEqual(prevCategories.current, categories)) {
      prevCategories.current = categories;
    } else if (
      !isEqual(prevCatsFromProps.current, update) &&
      !isEqual(update, categories)
    ) {
      setCategories(update);
      prevCatsFromProps.current = update;
    } else {
      prevCatsFromProps.current = update;
    }
  }, [categoriesData, collection, categories]);

  useEffect(() => {
    const update = setMappingsFromProps(collection);
    if (!isEqual(prevMappings.current, mappings)) {
      prevMappings.current = mappings;
    } else if (
      !isEqual(prevMapsFromProps.current, update) &&
      !isEqual(update, mappings)
    ) {
      setMappings(update);
      prevMapsFromProps.current = update;
    } else {
      prevMapsFromProps.current = update;
    }
  }, [collection, mappings]);

  const onCategoryDrop = (result, sourceId, element) => {
    const priorPosition = categories.findIndex(c => c.id === sourceId) + 1;
    const position = result.findIndex(c => c.id === sourceId) + 1;

    if (position === 0 || position === priorPosition) return;

    setCategories(result);
    callbacks.onCategoryDrag({
      id: sourceId,
      position
    });
    highlightDroppedEl({ element });
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
    highlightNewEl({ selector: `[data-collectable-id="${id}"]` });
  };

  const { active, scrollableRef } = useSortableCategories(
    categories,
    onCategoryDrop,
    mappings,
    onCollectableDrop
  );

  const {
    onCollectableMove,
    onCollectableSort,
    onCategoryMove,
    targetCategory
  } = useAccessibleSort(
    categories,
    mappings,
    onCollectableDrop,
    onCategoryDrop
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
              callbacks={{
                ...callbacks,
                onCollectableMove,
                onCategoryMove,
                onCollectableSort
              }}
              targetCategory={targetCategory}
              {...listProps}
            />
          );
        })}
      </Styled.Categories>
      <Uncategorized
        mappings={mappings}
        responses={responses}
        callbacks={{
          ...callbacks,
          onCollectableMove,
          onCategoryMove,
          onCollectableSort
        }}
        targetCategory={targetCategory}
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
