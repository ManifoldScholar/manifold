import React from "react";
import PropTypes from "prop-types";
import { Droppable } from "react-beautiful-dnd";
import CollectablesList from "./CollectablesList";
import { collectedShape } from "../SortableCategories/types/helpers";
import * as Styled from "./styles";

function SortableCollectables({ categoryId, type, ...restProps }) {
  const id = `${categoryId}_${type}`;
  return (
    <Droppable droppableId={id} type={type}>
      {provided => (
        <Styled.List ref={provided.innerRef}>
          <CollectablesList type={type} {...restProps} />
          {provided.placeholder}
        </Styled.List>
      )}
    </Droppable>
  );
}

SortableCollectables.displayName =
  "ReadingGroup.Collecting.CollectionEditor.SortableCollectables";

SortableCollectables.propTypes = {
  ...collectedShape,
  type: PropTypes.string.isRequired
};

export default SortableCollectables;
