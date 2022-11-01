import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function SectionsList({ name, onDelete, index }) {
  return (
    <Draggable draggableId={name} index={index}>
      {(provided, snapshot) => (
        <Styled.Section
          ref={provided.innerRef}
          {...provided.draggableProps}
          $dragging={snapshot.isDragging}
        >
          <span>{name}</span>
          <Styled.ButtonGroup>
            <button onClick={() => onDelete(name)}>
              <IconComposer icon="delete32" size={24} />
            </button>
            <Styled.DragHandle {...provided.dragHandleProps}>
              <IconComposer icon="grabber32" size={24} />
            </Styled.DragHandle>
          </Styled.ButtonGroup>
        </Styled.Section>
      )}
    </Draggable>
  );
}
