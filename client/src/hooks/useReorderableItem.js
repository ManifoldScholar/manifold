import { useEffect, useRef, useState } from "react";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";

/**
 * Wires a row for native pragmatic drag-and-drop: the row element becomes a
 * draggable (lifted by the `setHandle` element) and, unless `isDropTarget` is
 * false, a closest-edge drop target. Returns callback refs for the row element
 * and drag handle plus the live `isDragging`/`closestEdge` state for rendering.
 *
 * Drag/drop payloads and predicates are read at drag time through a ref, so the
 * listeners register once per element and never need to re-bind as the list
 * reorders.
 *
 * @param {symbol}   instanceId   scopes drops to this list instance
 * @param {*}        itemId       this row's id, compared against the dragged
 *                                source (via `idKey`) to suppress its own edge
 * @param {object}   dragData     payload merged into the draggable's
 *                                `getInitialData` (`instanceId` is added)
 * @param {object}   [dropData]   payload for the drop target's `getData`
 *                                (defaults to `dragData`)
 * @param {string}   [idKey]      key in `source.data` holding the dragged id
 * @param {function} [canDrop]    extra predicate `(source) => boolean`
 * @param {string[]} [allowedEdges]
 * @param {boolean}  [isDropTarget] set false for draggable-only items (palettes)
 */
export default function useReorderableItem({
  instanceId,
  itemId,
  dragData,
  dropData,
  idKey = "id",
  canDrop,
  allowedEdges = ["top", "bottom"],
  isDropTarget = true
}) {
  const [element, setElement] = useState(null);
  const [handle, setHandle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);

  const stateRef = useRef();
  stateRef.current = {
    itemId,
    dragData,
    dropData: dropData ?? dragData,
    idKey,
    canDrop,
    allowedEdges
  };

  useEffect(() => {
    if (!element) return undefined;

    const cleanups = [];

    if (isDropTarget) {
      cleanups.push(
        dropTargetForElements({
          element,
          canDrop: ({ source }) => {
            if (source.data.instanceId !== instanceId) return false;
            const extra = stateRef.current.canDrop;
            return !extra || extra(source);
          },
          getIsSticky: () => true,
          getData: ({ input }) =>
            attachClosestEdge(
              { ...stateRef.current.dropData },
              { element, input, allowedEdges: stateRef.current.allowedEdges }
            ),
          onDrag: ({ self, source }) => {
            if (
              source.data[stateRef.current.idKey] === stateRef.current.itemId
            ) {
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
          getInitialData: () => ({ instanceId, ...stateRef.current.dragData }),
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false)
        })
      );
    }

    return cleanups.length ? combine(...cleanups) : undefined;
  }, [element, handle, instanceId, isDropTarget]);

  return { setElement, setHandle, isDragging, closestEdge };
}
