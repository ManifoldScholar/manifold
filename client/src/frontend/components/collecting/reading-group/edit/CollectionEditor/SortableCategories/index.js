import React, { useState, useEffect, useReducer } from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Uncategorized from "./Uncategorized";
import DraggableEventHelper from "../helpers/draggableEvent";
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

function setInitialState(collection) {
  return {
    categories: setCategoriesFromProps(collection),
    mappings: setMappingsFromProps(collection)
  };
}

function init(initialState) {
  return initialState;
}

function sortingReducer(state, action) {
  switch (action.type) {
    case "sortCategories":
      return { ...state, categories: action.payload };
    case "sortMappings": {
      const { categoryId, type, sortedCollectables } = action.payload;
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [categoryId]: {
            ...state.mappings[categoryId],
            [type]: sortedCollectables
          }
        }
      };
    }
    case "migrateMapping": {
      const {
        type,
        source: {
          categoryId: sourceCategoryId,
          updatedCollectables: sourceCollectables
        },
        destination: {
          categoryId: destinationCategoryId,
          updatedCollectables: destinationCollectables
        }
      } = action.payload;
      return {
        ...state,
        mappings: {
          ...state.mappings,
          [sourceCategoryId]: {
            ...state.mappings[sourceCategoryId],
            [type]: sourceCollectables
          },
          [destinationCategoryId]: {
            ...state.mappings[destinationCategoryId],
            [type]: destinationCollectables
          }
        }
      };
    }
    case "reset":
      return init(action.payload);
    default:
      throw new Error();
  }
}

function SortableCategories({ collection, responses, callbacks, children }) {
  const initialState = setInitialState(collection);
  const [state, dispatch] = useReducer(sortingReducer, initialState, init);

  useEffect(() => {
    dispatch({ type: "reset", payload: initialState });
  }, [JSON.stringify(collection)]); // eslint-disable-line react-hooks/exhaustive-deps

  const [activeType, setActiveType] = useState(null);

  const { categories, mappings } = state;
  const { onCategoryDrag, onCollectableDrag } = callbacks;

  function handleDragStart({ type }) {
    setActiveType(type);
  }

  function handleDragEnd(draggable) {
    setActiveType(null);

    const draggableHelper = new DraggableEventHelper(
      draggable,
      categories,
      mappings
    );

    if (!draggableHelper.actionable) return;

    switch (draggableHelper.action) {
      case "sortCategories": {
        dispatch({
          type: "sortCategories",
          payload: draggableHelper.sortedCategories
        });
        return onCategoryDrag(draggableHelper.sortedCategory);
      }
      case "sortMappings": {
        dispatch({
          type: "sortMappings",
          payload: {
            categoryId: draggableHelper.destinationCategoryId,
            type: draggableHelper.type,
            sortedCollectables: draggableHelper.sortedType
          }
        });
        return onCollectableDrag(draggableHelper.sortedCollectable);
      }
      case "migrateMapping": {
        dispatch({
          type: "migrateMapping",
          payload: {
            type: draggableHelper.type,
            source: {
              categoryId: draggableHelper.sourceCategoryId,
              updatedCollectables: draggableHelper.updatedSourceType
            },
            destination: {
              categoryId: draggableHelper.destinationCategoryId,
              updatedCollectables: draggableHelper.updatedDestinationType
            }
          }
        });
        return onCollectableDrag(draggableHelper.sortedCollectable);
      }
      default:
        return null;
    }
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="categories" type="categories">
        {provided => (
          <Styled.Categories
            ref={provided.innerRef}
            $active={activeType === "categories"}
          >
            {children(categories, mappings, activeType)}
            {provided.placeholder}
          </Styled.Categories>
        )}
      </Droppable>
      <Uncategorized
        mappings={mappings}
        responses={responses}
        callbacks={callbacks}
        activeType={activeType}
      />
    </DragDropContext>
  );
}

SortableCategories.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCategories";

SortableCategories.propTypes = {
  collection: PropTypes.object.isRequired,
  responses: PropTypes.object.isRequired,
  callbacks: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired
};

export default SortableCategories;
