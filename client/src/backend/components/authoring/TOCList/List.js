import React, { useState } from "react";
import PropTypes from "prop-types";
import Tree, { mutateTree, moveItemOnTree } from "@atlaskit/tree";
import Entry from "./TOCEntry";
import { DragOverContext } from "./dragContext";

export default function TOCList({ toc, textId, startSectionId }) {
  const [tree, setTree] = useState(toc);
  const [combine, setCombine] = useState(null);

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
      />
    );
  };

  const onDragEnd = (source, destination) => {
    setCombine(null);
    const update = moveItemOnTree(tree, source, destination);
    const expand = mutateTree(update, destination.parentId, {
      isExpanded: true
    });
    setTree(expand);
  };

  return tree ? (
    <div
      className="full-width"
      style={{
        overflow: "auto",
        height: `${(Object.keys(toc.items).length - 1) * 68}px`
      }}
    >
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
    </div>
  ) : null;
}

TOCList.displayName = "Text.TOC.List";

TOCList.propTypes = {
  toc: PropTypes.object.isRequired,
  textId: PropTypes.string
};
