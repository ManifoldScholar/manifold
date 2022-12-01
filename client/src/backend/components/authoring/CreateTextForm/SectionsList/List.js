import React from "react";
import PropTypes from "prop-types";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import Section from "./Section";
import { useUID } from "react-uid";

export default function SectionList({ sections, setSectionOrder, onDelete }) {
  const id = useUID();

  return (
    <DragDropContext onDragEnd={setSectionOrder}>
      <Droppable droppableId={id}>
        {provided => (
          <ul {...provided.droppableProps} ref={provided.innerRef}>
            {sections.map((section, i) => (
              <Section
                key={section.id}
                section={section}
                index={i}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}

SectionList.displayName = "CreateTextForm.Sections.List";

SectionList.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.exact({ id: PropTypes.string, name: PropTypes.string })
  ),
  setSectionOrder: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
