import React, { useState } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { Draggable } from "react-beautiful-dnd";
import IconComposer from "global/components/utility/IconComposer";
import { Title, Remove, Drag, Move } from "./parts";
import { getCollectableIcon } from "../helpers/resolvers";
import * as Styled from "./styles";

function Collectable({ responses, type, id, index, onRemove, onMove }) {
  const groupLabelId = useUID();
  const [keyboardActionsVisible, setKeyboardActionsVisible] = useState(false);
  const [reverseTabDirection, setReverseTabDirection] = useState(false);

  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <Styled.Wrapper
          {...provided.draggableProps}
          ref={provided.innerRef}
          style={provided.draggableProps.style}
        >
          <Styled.Collectable $isDragging={snapshot.isDragging}>
            <Styled.Header>
              <IconComposer icon={getCollectableIcon(type)} size={36} />
              <Title id={id} responses={responses} labelId={groupLabelId} />
            </Styled.Header>
            <Styled.Actions
              $keyboardActions={keyboardActionsVisible}
              role="group"
              aria-labelledby={groupLabelId}
            >
              <Remove id={id} type={type} onRemove={onRemove} />
              <Styled.TabGroup
                onKeyDown={e => {
                  if (e.shiftKey && e.key === "Tab") {
                    setReverseTabDirection(true);
                    return;
                  }
                  if (e.key === "Tab") {
                    setReverseTabDirection(false);
                  }
                }}
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
                <Styled.KeyboardActions $visible={keyboardActionsVisible}>
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
                </Styled.KeyboardActions>
              </Styled.TabGroup>
            </Styled.Actions>
          </Styled.Collectable>
        </Styled.Wrapper>
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
