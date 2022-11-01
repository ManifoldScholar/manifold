import React from "react";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import Section from "./Section";
import { useUID } from "react-uid";
import * as Styled from "./styles";

export default function SectionList({ sections, setSectionOrder, onDelete }) {
  const id = useUID();

  return (
    <DragDropContext onDragEnd={setSectionOrder}>
      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <Styled.List
            {...provided.droppableProps}
            ref={provided.innerRef}
            $dragging={snapshot.isDraggingOver}
          >
            {sections.map((section, i) => (
              <Section
                key={section}
                name={section}
                index={i}
                onDelete={onDelete}
              />
            ))}
            {provided.placeholder}
          </Styled.List>
        )}
      </Droppable>
    </DragDropContext>
  );
}
