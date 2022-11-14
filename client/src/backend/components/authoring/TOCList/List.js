import React, { useState } from "react";
import PropTypes from "prop-types";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import Entry from "./TOCEntry";
import { DragOverContext } from "./dragContext";
import {
  formatTOCData,
  formatTreeData,
  getNestedTreeChildren,
  removeKeys
} from "./treeHelpers";
import { textsAPI } from "api";
import { useApiCallback } from "hooks";
import * as Styled from "./styles";

export default function TOCList({ tree, setTree, textId, startSectionId }) {
  const [combine, setCombine] = useState(null);

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
    setCombine(null);

    const update = moveItemOnTree(tree, source, destination);
    onReorderTOC(update);

    const expand = mutateTree(update, destination.parentId, {
      isExpanded: true
    });
    setTree(expand);
  };

  const renderItem = ({ item, provided, snapshot, depth }) => {
    return (
      <Entry
        entry={item}
        depth={depth}
        innerRef={provided.innerRef}
        draggableProps={provided.draggableProps}
        dragHandleProps={provided.dragHandleProps}
        isDragging={snapshot.isDragging}
        placeholder={provided.placeholder}
        setCombine={setCombine}
        combine={snapshot.combineWith}
        textId={textId}
        isStart={startSectionId === item.id}
        onDelete={onDelete}
      />
    );
  };

  return tree ? (
    <Styled.ScrollContainer $count={Object.keys(tree.items).length - 1}>
      <DragOverContext.Provider value={combine}>
        <Tree
          tree={tree}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          isDragEnabled
          isNestingEnabled
          offsetPerLevel={0}
        />
      </DragOverContext.Provider>
    </Styled.ScrollContainer>
  ) : null;
}

TOCList.displayName = "Text.TOC.List";

TOCList.propTypes = {
  tree: PropTypes.object.isRequired,
  setTree: PropTypes.func.isRequired,
  textId: PropTypes.string.isRequired,
  startSectionId: PropTypes.string.isRequired
};
