import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {
  draggable,
  dropTargetForElements
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import {
  attachClosestEdge,
  extractClosestEdge
} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import { useTranslation } from "react-i18next";
import TextInner from "./TextInner";

function TextRow({
  text,
  index,
  itemCount,
  category,
  categoryId,
  categoryIndex,
  categoryCount,
  instanceId,
  callbacks,
  onTextKeyboardMove
}) {
  const [element, setElement] = useState(null);
  const [handle, setHandle] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [closestEdge, setClosestEdge] = useState(null);

  useEffect(() => {
    if (!element) return undefined;

    const cleanups = [
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === "text",
        getIsSticky: () => true,
        getData: ({ input }) =>
          attachClosestEdge(
            { type: "text", id: text.id, index, categoryId },
            { element, input, allowedEdges: ["top", "bottom"] }
          ),
        onDrag: ({ self, source }) => {
          if (source.data.id === text.id) {
            setClosestEdge(null);
            return;
          }
          setClosestEdge(extractClosestEdge(self.data));
        },
        onDragLeave: () => setClosestEdge(null),
        onDrop: () => setClosestEdge(null)
      })
    ];

    if (handle) {
      cleanups.push(
        draggable({
          element,
          dragHandle: handle,
          getInitialData: () => ({
            instanceId,
            type: "text",
            id: text.id,
            index,
            categoryId
          }),
          onDragStart: () => setIsDragging(true),
          onDrop: () => setIsDragging(false)
        })
      );
    }

    return combine(...cleanups);
  }, [element, handle, text.id, index, categoryId, instanceId]);

  return (
    <div
      ref={setElement}
      className={classNames("texts-list__text", {
        "texts-list__text--is-dragging": isDragging
      })}
    >
      {closestEdge && (
        <span
          aria-hidden
          className={classNames(
            "texts-list__drop-indicator",
            `texts-list__drop-indicator--${closestEdge}`
          )}
        />
      )}
      <TextInner
        text={text}
        index={index}
        itemCount={itemCount}
        category={category}
        categoryIndex={categoryIndex}
        categoryCount={categoryCount}
        callbacks={callbacks}
        onTextKeyboardMove={onTextKeyboardMove}
        dragHandleRef={setHandle}
      />
    </div>
  );
}

TextRow.propTypes = {
  text: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  category: PropTypes.object,
  categoryId: PropTypes.string.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  categoryCount: PropTypes.number.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  callbacks: PropTypes.object.isRequired,
  onTextKeyboardMove: PropTypes.func.isRequired
};

export default function CategoryListTexts({
  texts = [],
  callbacks,
  category,
  categoryId,
  instanceId,
  categoryIndex,
  categoryCount,
  onTextKeyboardMove
}) {
  const { t } = useTranslation();

  if (texts.length === 0) {
    return (
      <div className="texts-list__text texts-list__text--placeholder">
        <p>
          {category
            ? t("projects.category.empty_category")
            : t("projects.category.all_texts_categorized")}
        </p>
      </div>
    );
  }

  return texts.map((text, index) => (
    <TextRow
      key={text.id}
      text={text}
      index={index}
      itemCount={texts.length}
      category={category}
      categoryId={categoryId}
      categoryIndex={categoryIndex}
      categoryCount={categoryCount}
      instanceId={instanceId}
      callbacks={callbacks}
      onTextKeyboardMove={onTextKeyboardMove}
    />
  ));
}

CategoryListTexts.displayName = "Category.List.Texts";

CategoryListTexts.propTypes = {
  texts: PropTypes.array.isRequired,
  callbacks: PropTypes.object.isRequired,
  category: PropTypes.object,
  categoryId: PropTypes.string.isRequired,
  instanceId: PropTypes.symbol.isRequired,
  onTextKeyboardMove: PropTypes.func.isRequired,
  categoryIndex: PropTypes.number.isRequired,
  categoryCount: PropTypes.number.isRequired
};
