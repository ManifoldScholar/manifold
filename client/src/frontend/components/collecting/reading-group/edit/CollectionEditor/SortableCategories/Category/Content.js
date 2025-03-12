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
  ...bodyProps
}) {
  const isMarkdown = category?.attributes?.markdownOnly;

  const hidden =
    dragState?.type === "has-left" ||
    (isMarkdown && dragState?.type === "collectable");

  const isDragging = dragState
    ? dragState.type !== "idle" && dragState.type !== "collectable"
    : false;

  return (
    <Styled.Wrapper ref={wrapperRef} $hidden={hidden}>
      <Styled.Category ref={categoryRef} $isDragging={isDragging}>
        <CategoryHeader
          dragHandleRef={dragHandleRef}
          category={category}
          groupId={groupId}
          onCategoryEdit={callbacks.onCategoryEdit}
          onCategoryRemove={callbacks.onCategoryRemove}
          initExpanded={
            newMarkdownBlock && newMarkdownBlock === category.attributes.title
          }
        />
        <Styled.Inner $collapsed={collapsed}>
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
