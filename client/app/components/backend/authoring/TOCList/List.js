import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import Entry from "./TOCEntry";
import {
  formatTOCData,
  formatTreeData,
  getNestedTreeChildren,
  getRootParentPosition,
  removeKeys,
  isValidParent,
  getParentId,
  getCollapseCount
} from "./treeHelpers";
import { textsAPI } from "api";
import { useApiCallback } from "hooks";
import * as Styled from "./styles";

export default function TOCList({ tree, setTree, textId, error, setError }) {
  const { t } = useTranslation();

  const [dragging, setDragging] = useState(false);
  const [pageHeightCount, setPageHeightCount] = useState(
    Object.keys(tree.items).length - 1
  );
  const [dropzoneCount, setDropzoneCount] = useState(
    Object.keys(tree.items).length - 1
  );

  const updateText = useApiCallback(textsAPI.update);

  const onReorderTOC = async newTree => {
    setError(null);
    const newToc = formatTOCData(newTree);
    const res = await updateText(textId, { attributes: { toc: newToc } });
    if (res?.errors) setError("reorder");
  };

  const onDelete = async entryId => {
    setError(null);
    const toDelete = [entryId, ...getNestedTreeChildren(entryId, tree.items)];
    const update = removeKeys(toDelete, tree.items);
    const newToc = formatTOCData({ ...tree, items: update });

    const res = await updateText(textId, { attributes: { toc: newToc } });
    if (res?.errors) return setError(res.errors);
    setTree(formatTreeData(newToc));
  };

  const onDragEnd = async (source, destination) => {
    setDragging(false);
    let finalDestination;
    if (destination.parentId === "root" && isNaN(destination.index)) {
      const rootParentIndex = getRootParentPosition(
        source.parentId,
        tree.items
      );
      finalDestination = { parentId: "root", index: rootParentIndex + 1 };
    } else if (!isValidParent(destination.parentId, tree.items)) {
      finalDestination = {
        parentId: getParentId(destination.parentId, tree.items)
      };
    } else {
      finalDestination = destination;
    }

    const update = moveItemOnTree(tree, source, finalDestination);
    onReorderTOC(update);

    setTree(update);
  };

  const renderItem = ({ item, provided, snapshot, depth }) => {
    const dragHandleProps = provided.dragHandleProps;
    delete dragHandleProps["aria-roledescription"];

    const onCollapse = () => {
      const update = mutateTree(tree, item.id, { isExpanded: false });
      setTree(update);
      const nestedCount = getCollapseCount(item, update.items);
      setPageHeightCount(pageHeightCount - nestedCount);
    };

    const onExpand = () => {
      const update = mutateTree(tree, item.id, { isExpanded: true });
      setTree(update);
      const nestedCount = getCollapseCount(update.items[item.id], update.items);
      setPageHeightCount(pageHeightCount + nestedCount);
    };

    return (
      <Entry
        entry={item}
        depth={depth}
        innerRef={provided.innerRef}
        draggableProps={provided.draggableProps}
        dragHandleProps={dragHandleProps}
        isDragging={snapshot.isDragging}
        isdropTarget={snapshot.combineTargetFor}
        placeholder={provided.placeholder}
        textId={textId}
        onDelete={onDelete}
        onCollapse={onCollapse}
        onExpand={onExpand}
      />
    );
  };

  /* eslint-disable no-nested-ternary */
  const errorMessage =
    error === "reorder"
      ? t("errors.toc_reorder")
      : Array.isArray(error)
      ? error.map(e => e.detail).join(". ")
      : error;
  /* eslint-disable no-nested-ternary */

  const onDragStart = id => {
    setDragging(true);
    const nestedCount = getCollapseCount(tree.items[id], tree.items);
    setDropzoneCount(pageHeightCount - nestedCount);
  };

  return tree ? (
    <Styled.Wrapper className="full-width" $count={pageHeightCount}>
      {error && <Styled.Error>{errorMessage}</Styled.Error>}
      {dragging && <Styled.Dropzone $count={dropzoneCount} />}
      <Styled.ScrollContainer $count={Object.keys(tree.items).length - 1}>
        <Tree
          tree={tree}
          renderItem={renderItem}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          isDragEnabled
          isNestingEnabled
          offsetPerLevel={0}
        />
        <span className="screen-reader-text" id="toc-drag-handle-instructions">
          {t("texts.toc.drag_handle_instructions")}
        </span>
      </Styled.ScrollContainer>
    </Styled.Wrapper>
  ) : null;
}

TOCList.displayName = "Text.TOC.List";

TOCList.propTypes = {
  tree: PropTypes.object.isRequired,
  setTree: PropTypes.func.isRequired,
  textId: PropTypes.string.isRequired
};
