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
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { isShallowEqual } from "../../helpers/utils";

export default function useDraggableCategory({
  id,
  index,
  category,
  isStatic = false,
  onDropInto
}) {
  const categoryRef = useRef(null);
  const wrapperRef = useRef(null);
  const dragHandleRef = useRef(null);

  const [dragState, setDragState] = useState({ status: "idle" });
  const [collapsed, setCollapsed] = useState(false);

  const isMarkdown = category?.attributes?.markdownOnly;

  useEffect(() => {
    return monitorForElements({
      onDragStart({ source }) {
        if (source.data.type === "categories") setCollapsed(true);
        setDragState({ type: source.data.type });
      },
      onDrop({ source }) {
        if (source.data.type === "categories") setCollapsed(false);
        setDragState({ type: null });
      }
    });
  }, []);

  useEffect(() => {
    if (category) {
      const wrapperEl = wrapperRef.current;
      invariant(wrapperEl);

      return dropTargetForElements({
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
          if (isMarkdown && source.data.type !== "categories") return false;
          if (isStatic && source.data.type === "categories") return false;
          return !!source.data.type;
        },
        onDragEnter({ source, self }) {
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
          if (source.data.id === id) {
            setDragState({ status: "has-left", type: "categories" });
            return;
          }
          setDragState({ status: "idle" });
        },
        onDrop({ source }) {
          setDragState({ status: "idle" });
          if (
            typeof onDropInto === "function" &&
            source.data.type !== "categories"
          )
            onDropInto();
        }
      });
    }
  }, [category, id, index, isStatic, isMarkdown, onDropInto]);

  useEffect(() => {
    if (!isStatic && category) {
      const categoryEl = categoryRef.current;
      const dragHandleEl = dragHandleRef.current;
      invariant(categoryEl && dragHandleEl);

      return draggable({
        element: categoryEl,
        dragHandle: dragHandleEl,
        getInitialData: ({ element }) => ({
          type: "categories",
          category,
          id,
          index,
          rect: element.getBoundingClientRect(),
          element: categoryEl
        }),
        onDragStart: () => {
          setDragState({ status: "dragging", type: "categories" });
        },
        onDrop: () => {
          setDragState({ status: "idle" });
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
                status: "preview",
                type: "categories",
                container
              });

              return () =>
                setDragState({ status: "dragging", type: "categories" });
            }
          });
        }
      });
    }
  }, [category, id, index, isStatic]);

  if (isStatic) return { collapsed, dragState, wrapperRef };

  return {
    dragState,
    collapsed,
    categoryRef,
    wrapperRef,
    dragHandleRef
  };
}
