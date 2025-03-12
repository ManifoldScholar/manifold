import * as React from "react";
import Content from "./Content";
import Preview from "./Preview";
import Empty from "./Empty";
import Shadow from "./Shadow";
import useDraggableCollectable from "./useDraggableCollectable";

export default function Collectable({
  id,
  type,
  index,
  responses,
  categoryId,
  ...restProps
}) {
  const { dragState, ...contentProps } = useDraggableCollectable({
    id,
    type,
    index,
    categoryId
  });

  return (
    <>
      <Shadow
        dragging={dragState?.dragging}
        active={
          dragState?.type === "is-over" && dragState?.closestEdge === "top"
        }
      />
      {id !== "empty" ? (
        <Content
          id={id}
          type={type}
          responses={responses}
          dragState={dragState}
          {...restProps}
          {...contentProps}
        />
      ) : (
        <Empty
          type={type}
          dragState={dragState}
          categoryId={categoryId}
          {...contentProps}
        />
      )}
      <Shadow
        dragging={dragState?.dragging}
        active={
          dragState?.type === "is-over" && dragState?.closestEdge === "bottom"
        }
      />
      <Preview
        id={id}
        type={type}
        responses={responses}
        active={dragState?.type === "preview"}
        container={dragState?.container}
      />
    </>
  );
}
