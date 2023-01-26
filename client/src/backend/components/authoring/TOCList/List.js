import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import Entry from "./TOCEntry";
import {
  formatTOCData,
  formatTreeData,
  getNestedTreeChildren,
  getRootParentPosition,
  removeKeys
} from "./treeHelpers";
import { textsAPI } from "api";
import { useApiCallback } from "hooks";
import * as Styled from "./styles";

export default function TOCList({ tree, setTree, textId }) {
  const { t } = useTranslation();

  const updateText = useApiCallback(textsAPI.update);

  const onReorderTOC = async newTree => {
    const newToc = formatTOCData(newTree);
    await updateText(textId, { attributes: { toc: newToc } });

    // TODO: add error handling
  };

  const onDelete = async entryId => {
    const toDelete = [entryId, ...getNestedTreeChildren(entryId, tree.items)];
    const update = removeKeys(toDelete, tree.items);
    const newToc = formatTOCData({ ...tree, items: update });

    try {
      await updateText(textId, { attributes: { toc: newToc } });
      setTree(formatTreeData(newToc));
    } catch (err) {
      // TODO: add error handling
    }
  };

  const onDragEnd = async (source, destination) => {
    let finalDestination;
    if (destination.parentId === "root" && isNaN(destination.index)) {
      const rootParentIndex = getRootParentPosition(
        source.parentId,
        tree.items
      );
      finalDestination = { parentId: "root", index: rootParentIndex + 1 };
    } else {
      finalDestination = destination;
    }

    const update = moveItemOnTree(tree, source, finalDestination);
    onReorderTOC(update);

    const movedId = tree.items[source.parentId].children.at(source.index);
    update.items[movedId].data.parentId = destination.parentId;

    const expand = mutateTree(update, destination.parentId, {
      isExpanded: true
    });
    setTree(expand);
  };

  const renderItem = ({ item, provided, snapshot, depth }) => {
    const dragHandleProps = provided.dragHandleProps;
    delete dragHandleProps["aria-roledescription"];

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
      />
    );
  };

  return tree ? (
    <Styled.ScrollContainer
      className="full-width"
      $count={Object.keys(tree.items).length - 1}
    >
      <Tree
        tree={tree}
        renderItem={renderItem}
        onDragEnd={onDragEnd}
        isDragEnabled
        isNestingEnabled
        offsetPerLevel={0}
      />
      <span className="screen-reader-text" id="toc-drag-handle-instructions">
        {t("texts.toc.drag_handle_instructions")}
      </span>
    </Styled.ScrollContainer>
  ) : null;
}

TOCList.displayName = "Text.TOC.List";

TOCList.propTypes = {
  tree: PropTypes.object.isRequired,
  setTree: PropTypes.func.isRequired,
  textId: PropTypes.string.isRequired
};
