import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import invariant from "tiny-invariant";
import {
  draggable,
  dropTargetForElements,
  monitorForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source";
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { isShallowEqual } from "../../helpers/utils";

const idle = { type: "idle" };
const dragging = { type: "dragging" };

export default function useDraggableCategory({ id, index, category }) {
  const categoryRef = useRef(null);
  const wrapperRef = useRef(null);
  const dragHandleRef = useRef(null);

  const [dragState, setDragState] = useState({ type: "idle" });
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const categoryEl = categoryRef.current;
    const wrapperEl = wrapperRef.current;
    const dragHandleEl = dragHandleRef.current;
    invariant(categoryEl && wrapperEl && dragHandleEl);

    return combine(
      monitorForElements({
        onDragStart({ source }) {
          if (source.data.type === "categories") {
            setCollapsed(true);
          } else {
            setDragState({ type: "collectable" });
          }
        },
        onDrop({ source }) {
          if (source.data.type === "categories") {
            setCollapsed(false);
          } else {
            setDragState({ type: "idle" });
          }
        }
      }),
      draggable({
        element: categoryEl,
        dragHandle: dragHandleEl,
        getInitialData: ({ element }) => ({
          type: "categories",
          category,
          id,
          index,
          rect: element.getBoundingClientRect()
        }),
        onDragStart: () => {
          setDragState(dragging);
        },
        onDrop: () => {
          setDragState(idle);
        },
        onGenerateDragPreview({ nativeSetDragImage, location }) {
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: categoryEl,
              input: location.current.input
            }),
            render({ container }) {
              setDragState({
                type: "preview",
                container,
                dragging: categoryEl.getBoundingClientRect()
              });

              return () => setDragState({ type: "dragging" });
            }
          });
        }
      }),
      dropTargetForElements({
        element: wrapperEl,
        getIsSticky: () => true,
        getData: ({ element, input }) => {
          const data = { id, index, category };
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ["top", "bottom"]
          });
        },
        canDrop: ({ source }) => {
          return source.data.type === "categories";
        },
        onDragEnter({ source, self }) {
          if (source.data.type !== "categories") {
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
            type: "is-over",
            dragging: source.data.rect,
            closestEdge
          });
        },
        onDrag({ source, self }) {
          if (source.data.type !== "categories") {
            return;
          }
          if (source.data.id === id) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }
          // optimization - Don't update react state if we don't need to.
          const proposed = {
            type: "is-over",
            dragging: source.data.rect,
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
          if (!source.data.category) {
            return;
          }
          if (source.data.id === id) {
            setDragState({ type: "has-left" });
            return;
          }
          setDragState(idle);
        },
        onDrop() {
          setDragState(idle);
        }
      })
    );
  }, [category, id, index]);

  return { dragState, collapsed, categoryRef, wrapperRef, dragHandleRef };
}
