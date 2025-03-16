import { useTranslation } from "react-i18next";
import { announce } from "@atlaskit/pragmatic-drag-and-drop-live-region";
import { handleAddCollectableToCategory } from "./useSortableCategories";
import { highlightDroppedEl } from "../helpers/dnd";

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
  onCollectableDrop
) {
  const { t } = useTranslation();

  const onCollectableMove = sourceId => ({ id, type, direction }) => {
    const target = getTargetCategory(
      sourceId,
      [...categories, { id: "$uncategorized$" }],
      direction,
      t
    );

    if (!target) return;

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
    highlightDroppedEl({ selector: `[data-collectable-id="${id}"]` });
  };

  return { onCollectableMove };
}
