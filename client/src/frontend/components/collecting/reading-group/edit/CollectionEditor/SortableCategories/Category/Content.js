import * as React from "react";
import { CategoryHeader, MarkdownBody, CategoryBody } from "../parts";
import * as Styled from "./styles";

export default function Content({
  wrapperRef,
  dragState,
  categoryRef,
  dragHandleRef,
  category,
  groupId,
  callbacks,
  newMarkdownBlock,
  collapsed,
  manualCollapsed,
  setManualCollapsed,
  ...bodyProps
}) {
  const isMarkdown = category?.attributes?.markdownOnly;

  const hidden =
    dragState?.status === "has-left" ||
    (isMarkdown && !!dragState?.type && dragState.type !== "categories");

  // const isDragging = dragState
  //   ? dragState.status !== "idle" && dragState.type === "categories"
  //   : false;

  const collectableOver =
    manualCollapsed &&
    dragState?.status === "is-over" &&
    !!dragState?.type &&
    dragState?.type !== "categories";

  // const displayAsCollapsed = collapsed || (!isDragging && manualCollapsed);

  return (
    <Styled.Wrapper ref={wrapperRef} $hidden={hidden}>
      <Styled.Category tabIndex={-1} ref={categoryRef}>
        <CategoryHeader
          dragHandleRef={dragHandleRef}
          category={category}
          groupId={groupId}
          onCategoryEdit={callbacks.onCategoryEdit}
          onCategoryRemove={callbacks.onCategoryRemove}
          initExpanded={
            newMarkdownBlock && newMarkdownBlock === category?.attributes.title
          }
          setCollapsed={() => setManualCollapsed(!manualCollapsed)}
          manualCollapsed={manualCollapsed}
          collectableOver={collectableOver}
        />
        <Styled.Inner $collapsed={manualCollapsed}>
          {isMarkdown ? (
            <MarkdownBody category={category} />
          ) : (
            <CategoryBody
              category={category}
              callbacks={callbacks}
              {...bodyProps}
            />
          )}
        </Styled.Inner>
      </Styled.Category>
    </Styled.Wrapper>
  );
}
