import * as React from "react";
import { useState } from "react";
import { useUID } from "react-uid";
import { getCollectableIcon } from "./helpers";
import { Title, Remove, Drag, Move } from "../parts";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function Content({
  responses,
  type,
  id,
  onRemove,
  onMove,
  collectableRef,
  wrapperRef,
  dragHandleRef,
  dragState
}) {
  const [keyboardActionsVisible, setKeyboardActionsVisible] = useState(false);
  const [reverseTabDirection, setReverseTabDirection] = useState(false);

  const groupLabelId = useUID();

  return (
    <Styled.Wrapper ref={wrapperRef} $hidden={dragState?.status === "has-left"}>
      <Styled.Collectable
        ref={collectableRef}
        tabIndex={-1}
        data-collectable-id={id}
      >
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
              dragHandleRef={dragHandleRef}
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
  );
}
