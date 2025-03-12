import * as React from "react";
import Shadow from "./Shadow";
import Preview from "./Preview";
import Content from "./Content";
import useDraggableCategory from "./useDraggableCategory";

export default function Category({ id, index, category, ...restProps }) {
  const { dragState, ...contentProps } = useDraggableCategory({
    id,
    index,
    category
  });

  return (
    <>
      <Shadow
        dragging={dragState?.dragging}
        active={
          dragState?.type === "is-over" && dragState?.closestEdge === "top"
        }
      />
      <Content
        dragState={dragState}
        category={category}
        {...contentProps}
        {...restProps}
      />
      <Shadow
        dragging={dragState?.dragging}
        active={
          dragState?.type === "is-over" && dragState?.closestEdge === "bottom"
        }
      />
      <Preview
        category={category}
        active={dragState?.type === "preview"}
        container={dragState?.container}
      />
    </>
  );
}
