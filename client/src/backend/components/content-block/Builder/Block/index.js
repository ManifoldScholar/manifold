import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Current from "./in-list/Current";
import Available from "./in-list/Available";
import typeResolver from "../../helpers/resolver";
import DropEdgeIndicator from "global/components/dnd/DropEdgeIndicator";
import { useReorderableItem } from "hooks";
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

  // Palette (available) items are draggable only; current blocks are also
  // closest-edge drop targets. The draggable and drop payloads differ (the
  // monitor keys off `kind`), so they're passed separately.
  const { setElement, setHandle, isDragging, closestEdge } = useReorderableItem(
    {
      instanceId,
      itemId: id,
      isDropTarget: inCurrentList,
      dragData: inAvailableList
        ? { kind: "available", blockType: type, zoneType }
        : { kind: "current", id, zoneType, index },
      dropData: { kind: "current-block", id, zoneType, index },
      canDrop: source => source.data.zoneType === zoneType
    }
  );

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
      <DropEdgeIndicator
        edge={closestEdge}
        baseClass={`${baseClass}__drop-indicator`}
      />
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
