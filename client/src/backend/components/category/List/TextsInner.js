import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import TextInner from "./TextInner";
import DropEdgeIndicator from "global/components/dnd/DropEdgeIndicator";
import { useReorderableItem } from "hooks";

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
  const { setElement, setHandle, isDragging, closestEdge } = useReorderableItem(
    {
      instanceId,
      itemId: text.id,
      dragData: { type: "text", id: text.id, index, categoryId },
      canDrop: source => source.data.type === "text"
    }
  );

  return (
    <div
      ref={setElement}
      className={classNames("texts-list__text", {
        "texts-list__text--is-dragging": isDragging
      })}
    >
      <DropEdgeIndicator
        edge={closestEdge}
        baseClass="texts-list__drop-indicator"
      />
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
