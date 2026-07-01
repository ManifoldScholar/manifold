import React, { useCallback, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { autoScrollWindowForElements } from "@atlaskit/pragmatic-drag-and-drop-auto-scroll/element";
import { extractClosestEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { setOrderByChange } from "helpers/dnd";
import { useReorderableItem } from "hooks";
import { withTranslation } from "react-i18next";

/* Non-empty prop bags preserve the row's `isSortable` gate (Entity/Row.js),
   which requires draggableProps + dragHandleProps to be non-empty objects.
   `data-rbd-draggable-id` is still read by Row.js's keyboard-move handler. */
const DRAG_HANDLE_PROPS = { "data-drag-handle": true };

const cloneEntities = entities => (entities || []).slice(0);

const getAdjustedPosition = (position, count) => {
  if (position <= 0) return "top";
  if (position >= count) return "bottom";
  return position + 1;
};

function SortableEntityRow({
  entity,
  index,
  entityCount,
  instanceId,
  EntityComponent,
  useDragHandle,
  entityComponentProps
}) {
  // `setElement` refs the whole row (draggable + drop target); `setHandle` refs
  // the grabber icon, so nested links/buttons stay clickable and never hijack
  // the drag.
  const { setElement, setHandle, isDragging, closestEdge } = useReorderableItem(
    {
      instanceId,
      itemId: entity.id,
      dragData: { id: entity.id, index }
    }
  );

  return (
    <EntityComponent
      innerRef={setElement}
      dragHandleRef={setHandle}
      entity={entity}
      draggableProps={{ "data-rbd-draggable-id": entity.id }}
      dragHandleProps={DRAG_HANDLE_PROPS}
      useDragHandle={useDragHandle}
      isDragging={isDragging}
      dropEdge={closestEdge}
      index={index}
      entityCount={entityCount}
      {...entityComponentProps}
    />
  );
}

SortableEntityRow.propTypes = {
  entity: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  entityCount: PropTypes.number.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  EntityComponent: PropTypes.elementType.isRequired,
  useDragHandle: PropTypes.bool,
  entityComponentProps: PropTypes.object
};

function SortableEntities(props) {
  const {
    entities,
    entityComponent: EntityComponent,
    callbacks,
    listStyle,
    sortableStyle,
    useDragHandle,
    className,
    t,
    setScreenReaderStatus,
    renderLiveRegion
  } = props;

  const [instanceId] = useState(() => Symbol("sortableEntities"));
  const [ordered, setOrdered] = useState(() => cloneEntities(entities));
  const [isListDragging, setIsListDragging] = useState(false);

  // Adopt new orderings handed down via props (e.g. after an API refresh),
  // mirroring the old getDerivedStateFromProps behavior.
  const [entitiesRef, setEntitiesRef] = useState(entities);
  if (entitiesRef !== entities) {
    setEntitiesRef(entities);
    setOrdered(cloneEntities(entities));
  }

  // The window-level monitor is registered once but needs the current order
  // and reorder callback on drop, so read them through refs.
  const orderedRef = useRef(ordered);
  orderedRef.current = ordered;
  const reorderCallbackRef = useRef(callbacks.onReorder);
  reorderCallbackRef.current = callbacks.onReorder;

  useEffect(() => {
    return combine(
      monitorForElements({
        canMonitor: ({ source }) => source.data.instanceId === instanceId,
        onDragStart: () => setIsListDragging(true),
        onDrop({ source, location }) {
          setIsListDragging(false);

          const target = location.current.dropTargets[0];
          if (!target) return;

          const list = orderedRef.current;
          const startIndex = list.findIndex(e => e.id === source.data.id);
          const indexOfTarget = list.findIndex(e => e.id === target.data.id);
          if (startIndex === -1 || indexOfTarget === -1) return;

          const reordered = reorderWithEdge({
            axis: "vertical",
            list,
            startIndex,
            indexOfTarget,
            closestEdgeOfTarget: extractClosestEdge(target.data)
          });

          const finalIndex = reordered.findIndex(e => e.id === source.data.id);
          if (finalIndex === startIndex) return;

          setOrdered(reordered);
          reorderCallbackRef.current(
            {
              id: source.data.id,
              position: getAdjustedPosition(finalIndex, reordered.length)
            },
            reordered
          );
        }
      }),
      autoScrollWindowForElements()
    );
  }, [instanceId]);

  const onKeyboardMove = useCallback(
    (draggableId, title, oldPos, newPos, callback) => {
      if (oldPos === newPos) return;

      const list = orderedRef.current;
      const entity = list.find(e => e.id === draggableId);
      if (!entity) return;

      const reordered = setOrderByChange(list, oldPos, newPos);
      setOrdered(reordered);

      reorderCallbackRef.current(
        {
          id: entity.id,
          position: getAdjustedPosition(newPos, reordered.length)
        },
        reordered
      );

      setScreenReaderStatus(
        t("actions.dnd.moved_to_position", { title, position: newPos + 1 })
      );

      if (typeof callback === "function") callback();
    },
    [setScreenReaderStatus, t]
  );

  const entityComponentProps = {
    ...props.entityComponentProps,
    listStyle,
    sortableStyle,
    onKeyboardMove
  };

  return (
    <>
      <ul
        className={classNames(className, {
          "show-dropzone": isListDragging,
          "entity-list--dragging": isListDragging
        })}
      >
        {ordered.map((entity, index) => (
          <SortableEntityRow
            key={entity.id ?? index}
            entity={entity}
            index={index}
            entityCount={ordered.length}
            instanceId={instanceId}
            EntityComponent={EntityComponent}
            useDragHandle={useDragHandle}
            entityComponentProps={entityComponentProps}
          />
        ))}
      </ul>
      {renderLiveRegion("alert")}
    </>
  );
}

SortableEntities.displayName = "List.Entities.List.SortableEntities";

SortableEntities.propTypes = {
  callbacks: PropTypes.object,
  entities: PropTypes.array,
  entityComponent: PropTypes.elementType.isRequired,
  entityComponentProps: PropTypes.object,
  className: PropTypes.string,
  listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"]),
  sortableStyle: PropTypes.oneOf(["tight", "spaced"]),
  useDragHandle: PropTypes.bool,
  idForInstructions: PropTypes.string,
  t: PropTypes.func,
  setScreenReaderStatus: PropTypes.func,
  renderLiveRegion: PropTypes.func
};

SortableEntities.defaultProps = {
  useDragHandle: false,
  sortableStyle: "spaced"
};

export default withTranslation()(
  withScreenReaderStatus(SortableEntities, false)
);
