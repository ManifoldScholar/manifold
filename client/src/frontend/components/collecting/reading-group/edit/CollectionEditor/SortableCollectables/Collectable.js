import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Draggable } from "react-beautiful-dnd";
import IconComposer from "global/components/utility/IconComposer";
import { Title, Remove, Drag } from "./parts";
import { getCollectableIcon } from "../helpers/resolvers";

function Collectable({ responses, type, id, index, onRemove }) {
  const blockClassName = snapshot =>
    classNames({
      "group-collection-editor__block": true,
      "group-collection-editor__block--collectable": true,
      "group-collection-editor__block--is-dragging": snapshot.isDragging
    });

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={provided.draggableProps.style}
          className="group-collection-editor__collectable-wrapper"
        >
          <article className={blockClassName(snapshot)}>
            <header className="group-collection-editor__collectable-header">
              <IconComposer icon={getCollectableIcon(type)} size={36} />
              <Title id={id} responses={responses} />
            </header>
            <div className="group-collection-editor__actions">
              <Remove id={id} type={type} onRemove={onRemove} />
              <Drag dragHandleProps={provided.dragHandleProps} />
            </div>
          </article>
        </div>
      )}
    </Draggable>
  );
}

Collectable.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Collectable";

Collectable.propTypes = {
  responses: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired
};

export default Collectable;
