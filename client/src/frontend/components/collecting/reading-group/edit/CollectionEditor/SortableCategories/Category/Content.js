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
  index,
  categoryCount,
  ...bodyProps
}) {
  const isMarkdown = category?.attributes?.markdownOnly;

  const hidden =
    dragState?.status === "has-left" ||
    dragState?.self ||
    (isMarkdown && !!dragState?.type && dragState.type !== "categories");

  const collectableOver =
    manualCollapsed &&
    dragState?.status === "is-over" &&
    !!dragState?.type &&
    dragState?.type !== "categories";

  return (
    <Styled.Wrapper ref={wrapperRef} $hidden={hidden}>
      <Styled.Category tabIndex={-1} ref={categoryRef}>
        <CategoryHeader
          dragHandleRef={dragHandleRef}
          category={category}
          groupId={groupId}
          onCategoryEditError={callbacks.onCategoryEditError}
          onCategoryRemove={callbacks.onCategoryRemove}
          initExpanded={
            newMarkdownBlock && newMarkdownBlock === category?.attributes.title
          }
          setCollapsed={() => setManualCollapsed(!manualCollapsed)}
          manualCollapsed={manualCollapsed}
          collectableOver={collectableOver}
          onCategoryMove={callbacks.onCategoryMove(categoryRef?.current)}
          index={index}
          categoryCount={categoryCount}
        />
        <Styled.Inner inert={manualCollapsed ? "" : undefined}>
          {isMarkdown ? (
            <MarkdownBody category={category} />
          ) : (
            <CategoryBody
              category={category}
              callbacks={callbacks}
              index={index}
              categoryCount={categoryCount}
              {...bodyProps}
            />
          )}
        </Styled.Inner>
      </Styled.Category>
    </Styled.Wrapper>
  );
}
