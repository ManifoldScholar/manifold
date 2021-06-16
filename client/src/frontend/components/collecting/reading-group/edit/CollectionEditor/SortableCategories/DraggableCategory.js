import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import Category, { categoryShape } from "./Category";

function DraggableCategory({ id, index, ...restProps }) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Category dragProps={{ provided, snapshot }} {...restProps} />
      )}
    </Draggable>
  );
}

DraggableCategory.propTypes = {
  ...categoryShape,
  id: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired
};

export default DraggableCategory;
