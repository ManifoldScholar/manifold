import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import isEqual from "lodash/isEqual";
import cloneDeep from "lodash/cloneDeep";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import DraggableEventHelper from "../helpers/draggableEvent";

function cloneArray(items) {
  return items.length > 0 ? cloneDeep(items) : [];
}

function SortableCategories({ categories, onUpdateCollection, children }) {
  const cloned = cloneArray(categories);
  const [sorted, setSorted] = useState([]);
  const [prevCategories, setPrevCategories] = useState(undefined);
  const [activeType, setActiveType] = useState(null);

  if (!isEqual(cloned, prevCategories)) {
    setSorted(cloned);
    setPrevCategories(cloned);
  }

  function handleDragStart(draggable) {
    setActiveType(draggable.type);
  }

  function handleDragEnd(draggable) {
    setActiveType(null);

    const draggableHelper = new DraggableEventHelper(draggable, sorted);

    if (!draggableHelper.actionable) return;

    if (draggableHelper.isCategory) return setSorted(draggableHelper.resorted);

    const action = draggableHelper.collectableAction;

    if (action === "sort") {
      console.log(draggableHelper.repopulatedCategories);

      return;
    }
    return null;
  }

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="categories" type="CATEGORY">
        {provided => (
          <div
            ref={provided.innerRef}
            className={classNames({
              "collection-category-builder__categories": true,
              "collection-category-builder__categories--active":
                activeType === "CATEGORY"
            })}
          >
            {children(sorted, activeType)}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

SortableCategories.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCategories";

SortableCategories.propTypes = {
  categories: PropTypes.array.isRequired,
  onUpdateCollection: PropTypes.func.isRequired,
  children: PropTypes.func.isRequired
};

export default SortableCategories;
