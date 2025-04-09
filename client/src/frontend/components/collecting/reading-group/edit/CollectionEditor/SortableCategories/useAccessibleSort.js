import { useState } from "react";
import { useTranslation } from "react-i18next";
import { announce } from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { handleAddCollectableToCategory } from "./useSortableCategories";
import { reorderWithEdge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge";

const omitMarkdownBlocks = (index, direction, categories) => {
  const destination = categories[index];

  if (destination?.markdownOnly) {
    const next = direction === "down" ? index + 1 : index - 1;
    return omitMarkdownBlocks(next, direction, categories);
  }

  return index;
};

const getTargetCategory = (sourceId, categories, direction, t) => {
  const sourceIndex = categories.findIndex(c => c.id === sourceId);

  const initialTargetIndex =
    direction === "down" ? sourceIndex + 1 : sourceIndex - 1;

  if (initialTargetIndex === -1) {
    announce(t("messages.cannot_move_up"));
    return;
  }

  if (initialTargetIndex > categories.length) {
    announce(t("messages.cannot_move_down"));
    return;
  }

  const targetIndex = omitMarkdownBlocks(
    initialTargetIndex,
    direction,
    categories
  );

  return categories[targetIndex];
};

export default function useAccessibleSort(
  categories,
  mappings,
  onCollectableDrop,
  onCategoryDrop
) {
  const { t } = useTranslation();

  const [targetCategory, setTargetCategory] = useState(null);

  const onCollectableMove = sourceId => ({ id, type, direction }) => {
    const target = getTargetCategory(
      sourceId,
      [...categories, { id: "$uncategorized$" }],
      direction,
      t
    );

    if (!target) return;

    setTargetCategory(target.id);

    const result = handleAddCollectableToCategory(
      { data: { id, type, categoryId: sourceId } },
      { id: target.id },
      mappings
    );
    onCollectableDrop(result, { data: { id, type } });
    announce(
      t("messages.item_moved_category", {
        category: target.title || t("common.uncategorized")
      })
    );
  };

  const onCollectableSort = sourceId => ({ id, type, direction }) => {
    const list = mappings[sourceId][type];

    const startIndex = list.findIndex(m => m === id);
    const finishIndex = direction === "down" ? startIndex + 1 : startIndex - 1;

    const result = {
      ...mappings,
      [sourceId]: {
        ...mappings[sourceId],
        [type]: reorderWithEdge({
          axis: "vertical",
          list,
          startIndex,
          indexOfTarget: finishIndex,
          closestEdgeOfTarget: direction === "down" ? "bottom" : "top"
        })
      }
    };
    onCollectableDrop(result, { data: { id, type } });
    announce(
      t("messages.item_moved_position", {
        direction
      })
    );
  };

  const onCategoryMove = element => (id, direction) => {
    const startIndex = categories.findIndex(c => c.id === id);
    const finishIndex = direction === "down" ? startIndex + 1 : startIndex - 1;

    const result = reorderWithEdge({
      axis: "vertical",
      list: categories,
      startIndex,
      indexOfTarget: finishIndex,
      closestEdgeOfTarget: direction === "down" ? "bottom" : "top"
    });
    onCategoryDrop(result, id, element);
    announce(
      t("messages.category_moved", {
        direction
      })
    );
  };

  return {
    onCollectableMove,
    onCategoryMove,
    onCollectableSort,
    targetCategory
  };
}
