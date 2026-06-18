import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import classNames from "classnames";
import Current from "./in-list/Current";
import Available from "./in-list/Available";
import typeResolver from "../../helpers/resolver";
import isFunction from "lodash/isFunction";

export default function ProjectContentBlock({
  currentBlocks = [],
  index,
  entity,
  context,
  onClickAdd,
  entityCount,
  entityCallbacks,
  instanceId,
  announce,
  type
}) {
  const [element, setElement] = useState(null);
  const [handle, setHandle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);

  const inAvailableList = context === "available";
  const inCurrentList = context === "current";
  const id = entity ? entity.id : null;
  const pending = id === "pending";
  const typeComponent = typeResolver.typeToBlockComponent(type);
  const zoneType = typeComponent.top ? "TOP" : "BOTTOM";

  const disabled = (() => {
    if (pending) return true;
    if (inCurrentList) return false;
    if (!isFunction(typeComponent.isAvailable)) return false;
    return !typeComponent.isAvailable(currentBlocks);
  })();

  useEffect(() => {
    if (!element || disabled) return undefined;

    const cleanups = [];

    if (inCurrentList) {
      cleanups.push(
        dropTargetForElements({
          element,
          canDrop: ({ source }) =>
            source.data.instanceId === instanceId &&
            source.data.zoneType === zoneType,
          getIsSticky: () => true,
          getData: ({ input }) =>
            attachClosestEdge(
              { kind: "current-block", id, zoneType, index },
              { element, input, allowedEdges: ["top", "bottom"] }
            ),
          onDrag: ({ self, source }) => {
            if (source.data.id === id) {
              setClosestEdge(null);
              return;
            }
            setClosestEdge(extractClosestEdge(self.data));
          },
          onDragLeave: () => setClosestEdge(null),
          onDrop: () => setClosestEdge(null)
        })
      );
    }

    if (handle) {
      cleanups.push(
        draggable({
          element,
          dragHandle: handle,
          getInitialData: () =>
            inAvailableList
              ? { instanceId, kind: "available", blockType: type, zoneType }
              : { instanceId, kind: "current", id, zoneType, index },
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false)
        })
      );
    }

    return combine(...cleanups);
  }, [
    element,
    handle,
    disabled,
    inAvailableList,
    inCurrentList,
    id,
    type,
    zoneType,
    index,
    instanceId
  ]);

  const handleClickAdd = () => {
    onClickAdd(type);
  };

  const TypeComponent = typeComponent;
  const ListContextBlock = inAvailableList ? Available : Current;
  const baseClass = "backend-content-block";

  if (disabled) {
    return (
      <div
        className={classNames(
          baseClass,
          `${baseClass}--${context} ${baseClass}--inactive`
        )}
      >
        <ListContextBlock
          entity={entity}
          entityCallbacks={entityCallbacks}
          typeComponent={TypeComponent}
          onClickAdd={handleClickAdd}
          disabled
          index={index}
          entityCount={entityCount}
        />
      </div>
    );
  }

  return (
    <div
      ref={setElement}
      className={classNames(baseClass, `${baseClass}--${context}`, {
        [`${baseClass}--active`]: true,
        [`${baseClass}--is-dragging`]: isDragging
      })}
    >
      {closestEdge && (
        <span
          aria-hidden
          className={classNames(
            `${baseClass}__drop-indicator`,
            `${baseClass}__drop-indicator--${closestEdge}`
          )}
        />
      )}
      <ListContextBlock
        entity={entity}
        entityCallbacks={entityCallbacks}
        dragHandleRef={setHandle}
        typeComponent={TypeComponent}
        onClickAdd={handleClickAdd}
        index={index}
        entityCount={entityCount}
        announce={announce}
      />
    </div>
  );
}

ProjectContentBlock.displayName = "Project.Content.Blocks.Block";

ProjectContentBlock.propTypes = {
  currentBlocks: PropTypes.array.isRequired,
  index: PropTypes.number,
  entity: PropTypes.object,
  context: PropTypes.oneOf(["available", "current"]),
  onClickAdd: PropTypes.func,
  entityCount: PropTypes.number,
  entityCallbacks: PropTypes.object,
  instanceId: PropTypes.symbol.isRequired,
  announce: PropTypes.func,
  type: PropTypes.string
};
