import * as React from "react";
import { useState, useEffect } from "react";
import Shadow from "./Shadow";
import Preview from "./Preview";
import Content from "./Content";
import useDraggableCategory from "./useDraggableCategory";

export default function Category({
  id,
  index,
  category,
  isStatic,
  targetCategory,
  ...restProps
}) {
  const [manualCollapsed, setManualCollapsed] = useState(true);

  const onDropInto = () => {
    if (manualCollapsed) setManualCollapsed(false);
  };

  const { dragState, ...contentProps } = useDraggableCategory({
    id,
    index,
    category,
    isStatic,
    onDropInto,
  });

  useEffect(() => {
    if (targetCategory === id) setManualCollapsed(false);
  }, [targetCategory, setManualCollapsed, id]);

  if (!category) return null;

  return (
    <>
      <Shadow
        active={
          dragState?.status === "is-over" &&
          dragState?.closestEdge === "top" &&
          dragState?.type === "categories"
        }
      />
      <Content
        dragState={dragState}
        category={category}
        manualCollapsed={manualCollapsed}
        setManualCollapsed={setManualCollapsed}
        index={index}
        {...contentProps}
        {...restProps}
      />
      <Shadow
        active={
          dragState?.status === "is-over" &&
          dragState?.closestEdge === "bottom" &&
          dragState?.type === "categories"
        }
      />
      <Preview
        category={category}
        active={dragState?.status === "preview"}
        container={dragState?.container}
      />
    </>
  );
}
