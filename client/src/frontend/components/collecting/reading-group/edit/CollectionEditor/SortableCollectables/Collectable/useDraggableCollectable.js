import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { isShallowEqual } from "../../helpers/utils";
import { highlightDroppedEl } from "../../helpers/dnd";

export default function useDraggableCollectable({
  type,
  id,
  index,
  categoryId
}) {
  const collectableRef = useRef(null);
  const wrapperRef = useRef(null);
  const dragHandleRef = useRef(null);

  const [dragState, setDragState] = useState({ status: "idle" });

  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    invariant(wrapperEl);

    return dropTargetForElements({
      element: wrapperEl,
      getIsSticky: () => true,
      getData: ({ element, input }) => {
        const data = { id, index, type, categoryId };
        return attachClosestEdge(data, {
          element,
          input,
          allowedEdges: ["top", "bottom"]
        });
      },
      canDrop: ({ source }) => {
        return source.data.type === type;
      },
      onDragEnter({ source, self }) {
        if (!source.data.type) {
          return;
        }
        if (source.data.id === id) {
          return;
        }
        const closestEdge = extractClosestEdge(self.data);
        if (!closestEdge) {
          return;
        }
        setDragState({
          status: "is-over",
          type: source.data.type,
          closestEdge
        });
      },
      onDrag({ source, self }) {
        if (!source.data.type) {
          return;
        }
        if (source.data.id === id) {
          return;
        }
        const closestEdge = extractClosestEdge(self.data);
        if (!closestEdge) {
          return;
        }
        const proposed = {
          status: "is-over",
          type: source.data.type,
          closestEdge
        };
        setDragState(current => {
          if (isShallowEqual(proposed, current)) {
            return current;
          }
          return proposed;
        });
      },
      onDragLeave({ source }) {
        if (!source.data.type) {
          return;
        }
        if (source.data.id === id) {
          setDragState({ status: "has-left", type: source.data.type });
          return;
        }
        setDragState({ status: "idle" });
      },
      onDrop() {
        setDragState({ status: "idle" });
      }
    });
  }, [id, index, type, categoryId]);

  useEffect(() => {
    if (collectableRef.current) {
      const collectableEl = collectableRef.current;
      const dragHandleEl = dragHandleRef.current;
      invariant(collectableEl && dragHandleEl);

      return draggable({
        element: collectableEl,
        dragHandle: dragHandleEl,
        getInitialData: ({ element }) => ({
          type,
          id,
          index,
          categoryId,
          rect: element.getBoundingClientRect()
        }),
        onDragStart: () => {
          setDragState({ status: "dragging", type });
        },
        onDrop: () => {
          setDragState({ status: "idle" });
          highlightDroppedEl({ selector: `[data-collectable-id="${id}"]` });
        },
        onGenerateDragPreview({ nativeSetDragImage, location }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: collectableEl,
              input: location.current.input
            }),
            render({ container }) {
              setDragState({
                status: "preview",
                container,
                type
              });

              return () => setDragState({ status: "dragging", type });
            }
          });
        }
      });
    }
  }, [id, index, type, categoryId]);

  return { dragState, collectableRef, wrapperRef, dragHandleRef };
}
