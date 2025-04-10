import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Section({ section, onDelete, index, isDragging }) {
  const handleDelete = e => {
    e.preventDefault();
    onDelete(section.id);
  };
  return (
    <>
      <Draggable draggableId={section.id} index={index}>
        {(provided, snapshot) => (
          <Styled.Section
            ref={provided.innerRef}
            {...provided.draggableProps}
            $dragging={snapshot.isDragging}
          >
            <span>{section.name}</span>
            <Styled.ButtonGroup>
              <Styled.Button onClick={handleDelete}>
                <IconComposer icon="delete32" size={24} />
              </Styled.Button>
              <Styled.DragHandle as="div" {...provided.dragHandleProps}>
                <IconComposer icon="grabber32" size={24} />
              </Styled.DragHandle>
            </Styled.ButtonGroup>
          </Styled.Section>
        )}
      </Draggable>
      {isDragging && (
        <Styled.Section className="drag-placeholder">
          <span>{section.name}</span>
          <Styled.ButtonGroup>
            <Styled.Button as="div">
              <IconComposer icon="delete32" size={24} />
            </Styled.Button>
            <Styled.DragHandle as="div">
              <IconComposer icon="grabber32" size={24} />
            </Styled.DragHandle>
          </Styled.ButtonGroup>
        </Styled.Section>
      )}
    </>
  );
}

Section.displayName = "CreateTextForm.Sections.ListItem";

Section.propTypes = {
  section: PropTypes.exact({ id: PropTypes.string, name: PropTypes.string }),
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool
};
