import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useUID } from "react-uid";
import { Draggable } from "react-beautiful-dnd";
import IconComposer from "global/components/utility/IconComposer";
import { Title, Remove, Drag, Move } from "./parts";
import { getCollectableIcon } from "../helpers/resolvers";

function Collectable({ responses, type, id, index, onRemove, onMove }) {
  const groupLabelId = useUID();
  const [keyboardActionsVisible, setKeyboardActionsVisible] = useState(false);
  const [reverseTabDirection, setReverseTabDirection] = useState(false);
  const blockClassName = snapshot =>
    classNames({
      "group-collection-editor__block": true,
      "group-collection-editor__block--collectable": true,
      "group-collection-editor__block--is-dragging": snapshot.isDragging
    });
  const actionsClassName = classNames({
    "group-collection-editor__actions": true,
    "group-collection-editor__collectable-actions": true,
    "group-collection-editor__collectable-actions--keyboard-actions-visible": keyboardActionsVisible
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
              <Title id={id} responses={responses} labelId={groupLabelId} />
            </header>
            <div
              className={actionsClassName}
              role="group"
              aria-labelledby={groupLabelId}
            >
              <Remove id={id} type={type} onRemove={onRemove} />
              <div
                role="none"
                onKeyDown={e => {
                  if (e.shiftKey && e.key === "Tab") {
                    setReverseTabDirection(true);
                    return;
                  }
                  if (e.key === "Tab") {
                    setReverseTabDirection(false);
                  }
                }}
                className="group-collection-editor__keyboard-actions--tab-direction"
              >
                <Drag
                  dragHandleProps={provided.dragHandleProps}
                  onFocus={() => {
                    setKeyboardActionsVisible(true);
                  }}
                  onBlur={() => {
                    if (reverseTabDirection) {
                      setKeyboardActionsVisible(false);
                    }
                  }}
                />
                <div className="group-collection-editor__keyboard-actions">
                  <Move
                    onClick={() => onMove({ id, type, direction: "up" })}
                    direction="up"
                  />
                  <Move
                    onClick={() => onMove({ id, type, direction: "down" })}
                    onBlur={() => {
                      if (reverseTabDirection) {
                        return;
                      }
                      setKeyboardActionsVisible(false);
                    }}
                    direction="down"
                  />
                </div>
              </div>
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
  onRemove: PropTypes.func.isRequired,
  onMove: PropTypes.func.isRequired
};

export default Collectable;
