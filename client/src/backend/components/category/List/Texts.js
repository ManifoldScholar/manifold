import React from "react";
import PropTypes from "prop-types";
import { Droppable } from "@atlaskit/pragmatic-drag-and-drop-react-beautiful-dnd-migration";
import classNames from "classnames";
import TextsInner from "./TextsInner";

export default function CategoryListTexts({
  activeType,
  category,
  categoryIndex,
  categoryCount,
  texts = [],
  callbacks,
  onTextKeyboardMove
}) {
  const categoryId = category?.id ?? "uncategorized";

  return (
    <Droppable type="text" droppableId={categoryId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={classNames({
            "texts-list": true,
            "texts-list--active": activeType === "text",
            "texts-list--empty": texts.length === 0
          })}
        >
          <TextsInner
            callbacks={callbacks}
            texts={texts}
            category={category}
            onTextKeyboardMove={onTextKeyboardMove}
            dragging={snapshot.draggingFromThisWith}
            categoryIndex={categoryIndex}
            categoryCount={categoryCount}
          />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

CategoryListTexts.propTypes = {
  activeType: PropTypes.string,
  category: PropTypes.object,
  texts: PropTypes.array.isRequired,
  callbacks: PropTypes.object.isRequired,
  onTextKeyboardMove: PropTypes.func.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  categoryCount: PropTypes.number.isRequired
};
